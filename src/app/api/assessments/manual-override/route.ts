// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/utils/supabase/client';

export const dynamic = 'force-dynamic';

// Type helper for Supabase responses
type SupabaseResponse<T> = { data: T | null; error: any };

export async function POST(request: NextRequest) {
  try {
    const supabase = createServiceRoleClient();
    const body = await request.json();
    const { resultId, questionId, markAsCorrect, assessmentType, setScore, ao1Score, ao3Score } = body;

    console.log('[Manual Override] Request:', { resultId, questionId, markAsCorrect, assessmentType, setScore });

    if (!resultId || !questionId || (typeof markAsCorrect !== 'boolean' && typeof setScore !== 'number' && typeof ao1Score !== 'number' && typeof ao3Score !== 'number')) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Handle GCSE Reading
    if (assessmentType === 'gcse-reading' || assessmentType === 'aqa-reading') {
      // Parse sub-question ID (e.g., "uuid-uuid-uuid-uuid-4" -> base="uuid-uuid-uuid-uuid", subIndex=4)
      const parts = questionId.split('-');
      const lastPart = parts[parts.length - 1];
      const isSubQuestion = !isNaN(parseInt(lastPart)) && lastPart.length <= 2;
      const baseQuestionId = isSubQuestion ? parts.slice(0, -1).join('-') : questionId;
      const subQuestionIndex = isSubQuestion ? parseInt(lastPart) : null;

      // Get the current response and question data
      const { data: response, error: fetchError } = await supabase
        .from('aqa_reading_question_responses')
        .select('id, points_awarded, marks_possible, question_id, sub_question_scores')
        .eq('result_id', resultId)
        .eq('question_id', baseQuestionId)
        .single() as SupabaseResponse<any>;

      if (fetchError || !response) {
        console.error('[Manual Override] Fetch error:', fetchError);
        return NextResponse.json({ error: 'Response not found', details: fetchError }, { status: 404 });
      }

      // Get question data to determine marks per sub-question
      const { data: questionData } = await supabase
        .from('aqa_reading_questions')
        .select('question_data, question_type')
        .eq('id', baseQuestionId)
        .single() as SupabaseResponse<any>;

      let pointsToAdjust = 1; // Default: adjust by 1 point

      // If this is a sub-question, calculate the marks for that specific sub-question
      if (subQuestionIndex !== null && questionData?.question_data) {
        const qData = questionData.question_data;
        const arrayIndex = subQuestionIndex - 1; // Convert 1-indexed to 0-indexed

        // Extract sub-question marks based on question type
        if (qData.sentences && Array.isArray(qData.sentences) && qData.sentences[arrayIndex]) {
          pointsToAdjust = qData.sentences[arrayIndex].marks || 2;
        } else if (qData.questions && Array.isArray(qData.questions) && qData.questions[arrayIndex]) {
          pointsToAdjust = qData.questions[arrayIndex].marks || 1;
        } else if (qData.students && Array.isArray(qData.students) && qData.students[arrayIndex]) {
          pointsToAdjust = 1; // Letter matching typically 1 mark each
        } else if (qData.articles && Array.isArray(qData.articles) && qData.articles[arrayIndex]) {
          pointsToAdjust = 1; // Headline matching typically 1 mark each
        }
      }

      // Calculate new points: either set exact score or add/subtract
      let newPoints;
      let updatedSubQuestionScores = response.sub_question_scores || {};

      if (typeof setScore === 'number') {
        // Set exact score for a sub-question
        if (subQuestionIndex !== null && questionData?.question_data) {
          const qData = questionData.question_data;
          const arrayIndex = subQuestionIndex - 1;

          // Get marks for this specific sub-question
          let thisSubQuestionMarks = 2; // default
          if (qData.sentences && qData.sentences[arrayIndex]) {
            thisSubQuestionMarks = qData.sentences[arrayIndex].marks || 2;
          } else if (qData.questions && qData.questions[arrayIndex]) {
            thisSubQuestionMarks = qData.questions[arrayIndex].marks || 1;
          } else if (qData.students && qData.students[arrayIndex]) {
            thisSubQuestionMarks = 1;
          } else if (qData.articles && qData.articles[arrayIndex]) {
            thisSubQuestionMarks = 1;
          }

          // Get current score for this sub-question from stored scores
          const currentSubQuestionPoints = updatedSubQuestionScores[subQuestionIndex] || 0;

          // Store the new score for this sub-question
          updatedSubQuestionScores[subQuestionIndex] = setScore;

          // Calculate new total: (current total - old sub-question score + new sub-question score)
          const pointsDiff = setScore - currentSubQuestionPoints;
          newPoints = Math.max(0, Math.min(response.points_awarded + pointsDiff, response.marks_possible));
        } else {
          // Not a sub-question, set the total directly
          newPoints = Math.max(0, Math.min(setScore, response.marks_possible));
        }
      } else {
        // Add/subtract the specific sub-question marks
        newPoints = markAsCorrect
          ? Math.min(response.points_awarded + pointsToAdjust, response.marks_possible)
          : Math.max(response.points_awarded - pointsToAdjust, 0);
      }

      // Update the response
      const { error: updateError } = await supabase
        .from('aqa_reading_question_responses')
        .update({
          points_awarded: newPoints,
          is_correct: newPoints === response.marks_possible,
          sub_question_scores: updatedSubQuestionScores
        } as any)
        .eq('id', response.id);

      if (updateError) {
        console.error('[Manual Override] Update error:', updateError);
        return NextResponse.json({ error: 'Update failed', details: updateError }, { status: 500 });
      }

      console.log(`[Manual Override] Updated question ${baseQuestionId} sub-part ${subQuestionIndex}: ${markAsCorrect ? '+' : '-'}${pointsToAdjust} points (${response.points_awarded} → ${newPoints})`);

      // Recalculate total score and performance breakdown
      const { data: allResponses } = await supabase
        .from('aqa_reading_question_responses')
        .select('points_awarded, marks_possible, question_type, is_correct, theme, topic')
        .eq('result_id', resultId) as SupabaseResponse<any[]>;

      const rawScore = allResponses?.reduce((sum: number, r: any) => sum + r.points_awarded, 0) || 0;
      const totalPossible = allResponses?.reduce((sum: number, r: any) => sum + r.marks_possible, 0) || 1;
      const percentageScore = (rawScore / totalPossible) * 100;

      // Recalculate performance_by_question_type
      const performanceByType: Record<string, any> = {};
      allResponses?.forEach((r: any) => {
        if (r.question_type) {
          if (!performanceByType[r.question_type]) {
            performanceByType[r.question_type] = {
              correct: 0,
              total: 0,
              points_awarded: 0,
              points_possible: 0
            };
          }
          performanceByType[r.question_type].total += 1;
          // Count as correct if ANY points awarded (for partial credit) or is_correct flag is set
          if (r.is_correct || (r.points_awarded && r.points_awarded > 0)) {
            performanceByType[r.question_type].correct += 1;
          }
          performanceByType[r.question_type].points_awarded += r.points_awarded || 0;
          performanceByType[r.question_type].points_possible += r.marks_possible || 0;
        }
      });

      // Calculate accuracy for each type
      Object.keys(performanceByType).forEach(type => {
        const perf = performanceByType[type];
        perf.accuracy = perf.points_possible > 0
          ? Math.round((perf.points_awarded / perf.points_possible) * 100)
          : 0;
      });

      await supabase
        .from('aqa_reading_results')
        .update({
          raw_score: rawScore,
          percentage_score: percentageScore,
          performance_by_question_type: performanceByType
        } as any)
        .eq('id', resultId);

      return NextResponse.json({ success: true, newScore: Math.round(percentageScore) });
    }

    // Handle reading-comprehension (original logic)
    if (assessmentType === 'reading-comprehension') {
      const { data: result, error: fetchError } = await supabase
        .from('reading_comprehension_results')
        .select('question_results, total_questions')
        .eq('id', resultId)
        .single() as SupabaseResponse<any>;

      if (fetchError || !result) {
        return NextResponse.json({ error: 'Result not found' }, { status: 404 });
      }

      let questionResults = result.question_results || [];
      const questionIndex = questionResults.findIndex((q: any) => q.questionId === questionId);

      if (questionIndex === -1) {
        return NextResponse.json({ error: 'Question not found' }, { status: 404 });
      }

      questionResults[questionIndex].isCorrect = markAsCorrect;
      const correctCount = questionResults.filter((q: any) => q.isCorrect).length;
      const newScore = Math.round((correctCount / (result.total_questions || questionResults.length)) * 100);

      await supabase
        .from('reading_comprehension_results')
        .update({ question_results: questionResults, correct_answers: correctCount, score: newScore } as any)
        .eq('id', resultId);

      return NextResponse.json({ success: true, newScore, correctCount });
    }

    // Handle GCSE Listening (similar to Reading)
    if (assessmentType === 'gcse-listening' || assessmentType === 'aqa-listening') {
      // For listening, responses are stored in a JSONB column within aqa_listening_results
      const { data: result, error: fetchError } = await supabase
        .from('aqa_listening_results')
        .select('id, responses, raw_score, total_possible_score, performance_by_question_type')
        .eq('id', resultId)
        .single() as SupabaseResponse<any>;

      if (fetchError || !result) {
        console.error('[Manual Override] Listening fetch error:', fetchError);
        return NextResponse.json({ error: 'Listening result not found', details: fetchError }, { status: 404 });
      }

      // 1. Better ID parsing
      let baseQuestionId = questionId;
      let subPartKey: string | null = null;

      // Detect suffixes
      if (questionId.match(/-sentence\d+$/)) {
        const parts = questionId.split('-sentence');
        baseQuestionId = parts[0];
        subPartKey = 'sentence' + parts[1];
      } else if (questionId.match(/-part\d+$/)) {
        const parts = questionId.split('-part');
        baseQuestionId = parts[0];
        subPartKey = 'part' + parts[1];
      } else if (questionId.match(/-q\d+$/)) {
        const parts = questionId.split('-q');
        baseQuestionId = parts[0];
        subPartKey = 'q' + parts[1];
      } else if (questionId.includes('-')) {
        // Fallback for UUID based sub-questions or other IDs (legacy handling)
        const lastDash = questionId.lastIndexOf('-');
        const suffix = questionId.substring(lastDash + 1);
        if (suffix.length < 12 && !isNaN(parseInt(suffix))) {
          // Standard gcse logic
          // const isSubQuestion = !isNaN(parseInt(suffix)) && suffix.length <= 2;
          // But here we rely on the specific key if we can find it.
          // If legacy numeric suffix:
          baseQuestionId = questionId.substring(0, lastDash);
          // We don't have a named subPartKey for legacy numeric indices unless mapped.
          // For now, treat as legacy flow if no named key.
        } else if (suffix.length < 20) {
          // Possible named key (e.g. aspect ID)
          baseQuestionId = questionId.substring(0, lastDash);
          subPartKey = suffix;
        }
      }

      // Find the response in the responses array
      const responses = result.responses || [];
      const responseIndex = responses.findIndex((r: any) => r.question_id === baseQuestionId);

      if (responseIndex === -1) {
        console.log('[Manual Override] Question not found in responses. ID:', baseQuestionId, 'Input:', questionId);
        return NextResponse.json({ error: 'Question not found in responses' }, { status: 404 });
      }

      const response = responses[responseIndex];
      let newPoints = response.points_awarded;
      let updatedSubQuestionScores = response.sub_question_scores || {};

      if (subPartKey) {
        // We are overriding a SUB-part. 
        // We need to fetch the question definition to re-grade accurately.

        const { data: questionDef } = await supabase
          .from('aqa_listening_questions')
          .select('question_data, question_type')
          .eq('id', baseQuestionId)
          .single();

        if (questionDef && questionDef.question_data) {
          const qData = questionDef.question_data;
          const qType = questionDef.question_type;

          // Parse student answer
          let parsedAnswer: any = {};
          try {
            if (typeof response.student_answer === 'string' && (response.student_answer.startsWith('{') || response.student_answer.startsWith('['))) {
              parsedAnswer = JSON.parse(response.student_answer);
            } else {
              parsedAnswer = response.student_answer;
            }
          } catch (e) { parsedAnswer = {}; }

          // Re-calculate total points
          let totalRecalculatedPoints = 0;

          // Set the override
          let explicitScore = setScore;
          if (explicitScore === undefined) {
            explicitScore = markAsCorrect ? 2 : 0;
          }
          updatedSubQuestionScores[subPartKey] = explicitScore;

          // Helper to get score for a part
          const getScore = (key: string, max: number, currentVal: any, correctVal: any) => {
            if (updatedSubQuestionScores[key] !== undefined) {
              return updatedSubQuestionScores[key];
            }
            // Auto-grade logic
            if (qType === 'dictation') {
              const normStudent = String(currentVal || '').trim().toLowerCase();
              const normCorrect = String(correctVal).trim().toLowerCase();
              if (normStudent === normCorrect && normStudent.length > 0) return 2;
              if (normStudent.length > 5 && normCorrect.includes(normStudent.substring(0, Math.min(10, normStudent.length)))) return 1;
              return 0;
            }
            // Default equality check
            return String(currentVal) === String(correctVal) ? max : 0;
          };

          // Iterators
          let localSubIndex = 1;
          if (qType === 'dictation' && qData.sentences) {
            qData.sentences.forEach((s: any) => {
              const sKey = s.id || `sentence${localSubIndex}`;
              const val = parsedAnswer[sKey];
              const corr = s.text || s.sentence || s.correctText || '';
              totalRecalculatedPoints += getScore(sKey, 2, val, corr);
              localSubIndex++;
            });
          } else if (qType === 'activity-timing' && qData.questions) {
            qData.questions.forEach((q: any) => {
              const qKey = q.id || `q${localSubIndex}`;
              const val = parsedAnswer[qKey];
              if (updatedSubQuestionScores[qKey] !== undefined) {
                totalRecalculatedPoints += updatedSubQuestionScores[qKey];
              } else {
                // Auto-grade
                let p = 0;
                if (val && typeof val === 'object') {
                  if (String(val.activity) === String(q.correctActivity)) p++;
                  if (String(val.time) === String(q.correctTime)) p++;
                }
                totalRecalculatedPoints += p;
              }
              localSubIndex++;
            });
          } else if (qType === 'multi-part' && qData.parts) {
            qData.parts.forEach((p: any) => {
              const pKey = p.id || `part${localSubIndex}`;
              const val = parsedAnswer[pKey];
              const corr = p.correctAnswer || p.correct;
              totalRecalculatedPoints += getScore(pKey, 1, val, corr);
              localSubIndex++;
            });
          } else if (qType === 'open-response' && qData.questions) {
            qData.questions.forEach((q: any) => {
              const qKey = q.id || `q${localSubIndex}`;
              totalRecalculatedPoints += getScore(qKey, q.marks || 1, parsedAnswer[qKey], q.sampleAnswer);
              localSubIndex++;
            });
          } else if (qType === 'opinion-rating' && qData.aspects) {
            qData.aspects.forEach((a: any) => {
              const aKey = a.id || a.label;
              totalRecalculatedPoints += getScore(aKey, 1, parsedAnswer[aKey], a.correctAnswer);
            });
          } else {
            // Fallback: trust explicit score or simple toggle
            totalRecalculatedPoints = explicitScore; // Risky but better than crashing
          }

          newPoints = Math.min(totalRecalculatedPoints, response.marks_possible || 100);
        }
      } else {
        // Standard override for the whole question (legacy or simple question)
        if (typeof setScore === 'number') {
          newPoints = Math.max(0, Math.min(setScore, response.marks_possible || 1));
        } else {
          const pointsToAdjust = 1;
          newPoints = markAsCorrect
            ? Math.min((response.points_awarded || 0) + pointsToAdjust, response.marks_possible || 1)
            : Math.max((response.points_awarded || 0) - pointsToAdjust, 0);
        }
      }

      // Update the response
      responses[responseIndex] = {
        ...response,
        points_awarded: newPoints,
        is_correct: newPoints === (response.marks_possible || 1),
        sub_question_scores: updatedSubQuestionScores
      };

      // Recalculate total score
      const rawScore = responses.reduce((sum: number, r: any) => sum + (r.points_awarded || 0), 0);
      const totalPossible = responses.reduce((sum: number, r: any) => sum + (r.marks_possible || 1), 0);
      const percentageScore = totalPossible > 0 ? (rawScore / totalPossible) * 100 : 0;

      // Recalculate performance_by_question_type
      const performanceByType: Record<string, any> = {};
      responses.forEach((r: any) => {
        if (r.question_type) {
          if (!performanceByType[r.question_type]) {
            performanceByType[r.question_type] = {
              correct: 0,
              total: 0,
              points_awarded: 0,
              points_possible: 0
            };
          }
          performanceByType[r.question_type].total += 1;
          if (r.is_correct || (r.points_awarded && r.points_awarded > 0)) {
            performanceByType[r.question_type].correct += 1;
          }
          performanceByType[r.question_type].points_awarded += r.points_awarded || 0;
          performanceByType[r.question_type].points_possible += r.marks_possible || 0;
        }
      });

      // Update the result
      const { error: updateError } = await supabase
        .from('aqa_listening_results')
        .update({
          responses,
          raw_score: rawScore,
          percentage_score: percentageScore,
          performance_by_question_type: performanceByType
        } as any)
        .eq('id', resultId);

      if (updateError) {
        console.error('[Manual Override] Listening update error:', updateError);
        return NextResponse.json({ error: 'Update failed', details: updateError }, { status: 500 });
      }

      console.log(`[Manual Override] Updated listening question ${questionId}: ${newPoints} points`);
      return NextResponse.json({ success: true, newScore: Math.round(percentageScore) });
    }

    // Handle Dictation (holistic AO1/AO3 scoring)
    if (assessmentType === 'dictation' || assessmentType === 'aqa-dictation') {
      const { data: result, error: fetchError } = await supabase
        .from('aqa_dictation_results')
        .select('id, responses, raw_score, total_possible_score')
        .eq('id', resultId)
        .single() as SupabaseResponse<any>;

      if (fetchError || !result) {
        console.error('[Manual Override] Dictation fetch error:', fetchError);
        return NextResponse.json({ error: 'Dictation result not found', details: fetchError }, { status: 404 });
      }

      // For dictation, we score holistically with AO1 (communication) and AO3 (transcription accuracy)
      // AO1 + AO3 = 8 marks total (4 + 4 for Foundation)
      const validAO1 = typeof ao1Score === 'number' && ao1Score >= 0 && ao1Score <= 4;
      const validAO3 = typeof ao3Score === 'number' && ao3Score >= 0 && ao3Score <= 4;

      if (!validAO1 && !validAO3) {
        // Fallback: treat as per-sentence scoring if no AO scores provided
        const responses = result.responses || [];
        const responseIndex = responses.findIndex((r: any) => r.question_id === questionId);

        if (responseIndex !== -1) {
          const response = responses[responseIndex];
          const newPoints = typeof setScore === 'number'
            ? Math.max(0, Math.min(setScore, response.marks_possible || 2))
            : (markAsCorrect
              ? Math.min((response.points_awarded || 0) + 1, response.marks_possible || 2)
              : Math.max((response.points_awarded || 0) - 1, 0));

          responses[responseIndex] = { ...response, points_awarded: newPoints, is_correct: newPoints >= (response.marks_possible || 2) };

          const rawScore = responses.reduce((sum: number, r: any) => sum + (r.points_awarded || 0), 0);
          const totalPossible = 8; // Dictation total is 8 marks
          const percentageScore = (rawScore / totalPossible) * 100;

          await supabase
            .from('aqa_dictation_results')
            .update({ responses, raw_score: rawScore, percentage_score: percentageScore } as any)
            .eq('id', resultId);

          return NextResponse.json({ success: true, newScore: Math.round(percentageScore) });
        }

        return NextResponse.json({ error: 'Question not found' }, { status: 404 });
      }

      // Apply holistic AO scoring
      const totalScore = (validAO1 ? ao1Score : 0) + (validAO3 ? ao3Score : 0);
      const totalPossible = 8; // 4 + 4
      const percentageScore = (totalScore / totalPossible) * 100;

      // Update with AO scores stored in a structured way
      await supabase
        .from('aqa_dictation_results')
        .update({
          raw_score: totalScore,
          percentage_score: percentageScore,
          holistic_scores: { AO1: validAO1 ? ao1Score : null, AO3: validAO3 ? ao3Score : null }
        } as any)
        .eq('id', resultId);

      console.log(`[Manual Override] Updated dictation AO1: ${ao1Score}, AO3: ${ao3Score}, Total: ${totalScore}/8`);
      return NextResponse.json({ success: true, newScore: Math.round(percentageScore), ao1Score, ao3Score });
    }

    // Handle GCSE Writing (allow updating individual question scores or overall per-question marks)
    if (assessmentType === 'gcse-writing' || assessmentType === 'aqa-writing') {
      const { data: response, error: fetchError } = await supabase
        .from('aqa_writing_question_responses')
        .select('id, score, max_score, result_id')
        .eq('result_id', resultId)
        .eq('question_id', questionId)
        .single() as SupabaseResponse<any>;

      if (fetchError || !response) {
        console.error('[Manual Override] Writing fetch error:', fetchError);
        return NextResponse.json({ error: 'Writing response not found', details: fetchError }, { status: 404 });
      }

      const newScore = typeof setScore === 'number'
        ? Math.max(0, Math.min(setScore, response.max_score))
        : (markAsCorrect
          ? Math.min(response.score + 1, response.max_score)
          : Math.max(response.score - 1, 0));

      await supabase
        .from('aqa_writing_question_responses')
        .update({ score: newScore, is_correct: newScore >= response.max_score * 0.5 } as any)
        .eq('id', response.id);

      // Recalculate total for the result
      const { data: allResponses } = await supabase
        .from('aqa_writing_question_responses')
        .select('score, max_score')
        .eq('result_id', resultId) as SupabaseResponse<any[]>;

      const totalScore = allResponses?.reduce((sum: number, r: any) => sum + (r.score || 0), 0) || 0;
      const maxScore = allResponses?.reduce((sum: number, r: any) => sum + (r.max_score || 0), 0) || 1;
      const percentageScore = (totalScore / maxScore) * 100;

      await supabase
        .from('aqa_writing_results')
        .update({ total_score: totalScore, percentage_score: percentageScore } as any)
        .eq('id', resultId);

      console.log(`[Manual Override] Updated writing question ${questionId}: ${newScore}/${response.max_score}`);
      return NextResponse.json({ success: true, newScore: Math.round(percentageScore) });
    }

    return NextResponse.json({ error: 'Unsupported assessment type' }, { status: 400 });

  } catch (error: any) {
    console.error('[Manual Override] Exception:', error);
    return NextResponse.json({ error: 'Server error', message: error?.message }, { status: 500 });
  }
}
