// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { createServiceRoleClient } from '@/utils/supabase/client';

export const dynamic = 'force-dynamic';

// Type helper for Supabase responses - fixes TypeScript 'never' inference issues
type SupabaseResponse<T> = { data: T | null; error: any };

interface Question {
  questionId: string;
  questionNumber: number;
  questionText: string;
  studentAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  points: number;
  maxPoints: number;
  timeSpent?: number;
  feedback?: string;
  holisticScores?: { AO1?: number; AO3?: number };
  aiGrading?: any;
}

interface StudentResult {
  studentId: string;
  studentName: string;
  score: number;
  maxScore: number;
  percentage: number;
  timeSpent: number;
  questions: Question[];
}

export async function GET(request: NextRequest) {
  try {
    // Use regular client for auth check
    const authClient = await createClient();

    // Use service role client for data queries to bypass RLS
    const supabase = createServiceRoleClient();

    // Get authenticated user using the regular client
    const { data: { user }, error: authError } = await authClient.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const assignmentId = searchParams.get('assignmentId');
    const assessmentType = searchParams.get('assessmentType');

    if (!assignmentId || !assessmentType) {
      return NextResponse.json(
        { error: 'Missing assignmentId or assessmentType' },
        { status: 400 }
      );
    }

    // Get assessment results based on type
    let results: StudentResult[] = [];

    if (assessmentType === 'reading-comprehension') {
      const { data: rcResults, error } = await supabase
        .from('reading_comprehension_results')
        .select('id, user_id, score, total_questions, correct_answers, time_spent, question_results, completed_at')
        .eq('assignment_id', assignmentId)
        .order('completed_at', { ascending: false });

      if (error) {
        console.error('Error fetching question details:', error);
        throw error;
      }

      // Fetch user profiles separately
      let userProfiles = new Map<string, string>();
      if (rcResults && rcResults.length > 0) {
        const userIds = [...new Set(rcResults.map(r => r.user_id))];
        const { data: profiles } = await supabase
          .from('user_profiles')
          .select('user_id, display_name')
          .in('user_id', userIds);

        if (profiles) {
          profiles.forEach(p => userProfiles.set(p.user_id, p.display_name));
        }
      }

      results = (rcResults || []).map((result: any) => {
        const questionResults = result.question_results || [];
        const questions: Question[] = [];

        // Parse question_results array
        if (Array.isArray(questionResults)) {
          questionResults.forEach((q: any, index: number) => {
            questions.push({
              questionId: q.questionId || `q${index + 1}`,
              questionNumber: index + 1,
              questionText: q.questionText || `Question ${index + 1}`,
              studentAnswer: q.userAnswer || '',
              correctAnswer: Array.isArray(q.correctAnswer) ? q.correctAnswer.join(', ') : q.correctAnswer || '',
              isCorrect: q.isCorrect || false,
              points: q.isCorrect ? q.points : 0,
              maxPoints: q.points || 1,
              timeSpent: q.timeSpent
            });
          });
        }

        return {
          resultId: result.id,
          studentId: result.user_id,
          studentName: userProfiles.get(result.user_id) || 'Unknown Student',
          score: result.correct_answers || 0,
          maxScore: result.total_questions || 0,
          percentage: result.score || 0,
          timeSpent: result.time_spent || 0,
          questions
        };
      });
    } else if (assessmentType === 'gcse-reading' || assessmentType === 'aqa-reading') {
      // Handle GCSE Reading assessment type

      const { data: readingResults, error } = await supabase
        .from('aqa_reading_results')
        .select('id, student_id, raw_score, total_possible_score, percentage_score, total_time_seconds, status, created_at')
        .eq('assignment_id', assignmentId)
        .order('created_at', { ascending: false });


      if (error) {
        console.error('Error fetching GCSE reading results:', error);
        throw error;
      }

      if (readingResults && readingResults.length > 0) {
        // Fetch user profiles
        const studentIds = [...new Set(readingResults.map(r => r.student_id))];
        let userProfiles = new Map<string, string>();

        const { data: profiles } = await supabase
          .from('user_profiles')
          .select('user_id, display_name')
          .in('user_id', studentIds);

        if (profiles) {
          profiles.forEach(p => userProfiles.set(p.user_id, p.display_name));
        }

        // Process each result
        results = await Promise.all(readingResults.map(async (result: any) => {
          // Fetch question responses for this result
          const { data: responses } = await supabase
            .from('aqa_reading_question_responses')
            .select('question_id, question_number, student_answer, is_correct, points_awarded, marks_possible, time_spent_seconds, question_type, sub_question_scores')
            .eq('result_id', result.id)
            .order('question_number', { ascending: true });

          // Fetch question details (including question_data with correct answers)
          let questionDetailsMap = new Map<string, any>();
          if (responses && responses.length > 0) {
            const questionIds = [...new Set(responses.map(r => r.question_id))];
            const { data: questions } = await supabase
              .from('aqa_reading_questions')
              .select('id, title, instructions, question_data, question_type')
              .in('id', questionIds);

            if (questions) {
              questions.forEach((q: any) => questionDetailsMap.set(q.id, q));
            }
          }

          // Helper function to format student answer
          const formatStudentAnswer = (answer: string, questionType: string): string => {
            if (!answer) return 'No answer';

            try {
              // Try to parse if it looks like JSON
              if (answer.startsWith('{') || answer.startsWith('[')) {
                const parsed = JSON.parse(answer);

                // Handle different formats based on type or structure
                if (typeof parsed === 'object' && parsed !== null) {
                  if (Array.isArray(parsed)) {
                    return parsed.join(', ');
                  }

                  // Key-value pairs (like letter matching)
                  return Object.entries(parsed)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join(', ');
                }
                return String(parsed);
              }
            } catch (e) {
              // If parse fails, return original
            }

            return answer;
          };

          // Helper function to extract correct answers
          const extractCorrectAnswer = (questionData: any, questionType: string): string => {
            if (!questionData) return 'See mark scheme';

            try {
              switch (questionType) {
                case 'letter-matching':
                  // Check for correctAnswers object first
                  if (questionData.correctAnswers && typeof questionData.correctAnswers === 'object') {
                    return Object.entries(questionData.correctAnswers)
                      .map(([name, letter]) => `${name}: ${letter}`)
                      .join(', ');
                  } else if (questionData.students && Array.isArray(questionData.students)) {
                    return questionData.students
                      .filter((s: any) => s.correctLetter || s.correct)
                      .map((s: any) => `${s.name}: ${s.correctLetter || s.correct}`)
                      .join(', ') || 'See mark scheme';
                  } else if (questionData.pairs && Array.isArray(questionData.pairs)) {
                    // Alternate structure for matching
                    return questionData.pairs
                      .map((p: any) => `${p.item}: ${p.match}`)
                      .join(', ');
                  }
                  break;
                case 'multiple-choice':
                  if (questionData.questions && Array.isArray(questionData.questions)) {
                    return questionData.questions
                      .map((q: any, i: number) => {
                        const correct = q.correctAnswer || q.correct;
                        return correct ? `Q${i + 1}: ${correct}` : null;
                      })
                      .filter(Boolean)
                      .join(', ') || 'See mark scheme';
                  } else if (questionData.options && Array.isArray(questionData.options)) {
                    // Single multiple choice question
                    const correct = questionData.options.find((o: any) => o.correct);
                    return correct ? correct.text || correct.value || correct.label : 'See mark scheme';
                  }
                  break;
                case 'student-grid':
                  if (questionData.questions && Array.isArray(questionData.questions)) {
                    return questionData.questions
                      .map((q: any, i: number) => {
                        const correct = q.correctStudent || q.correct;
                        return correct ? `Q${i + 1}: ${correct}` : null;
                      })
                      .filter(Boolean)
                      .join(', ') || 'See mark scheme';
                  }
                  break;
                case 'time-sequence':
                  if (questionData.events && Array.isArray(questionData.events)) {
                    return questionData.events
                      .map((e: any, i: number) => {
                        const correct = e.correctSequence || e.correct;
                        return correct ? `Q${i + 1}: ${correct}` : null;
                      })
                      .filter(Boolean)
                      .join(', ') || 'See mark scheme';
                  }
                  break;
                case 'sentence-completion':
                  if (questionData.sentences && Array.isArray(questionData.sentences)) {
                    return questionData.sentences
                      .map((s: any, i: number) => {
                        const correct = s.correctCompletion || s.correct;
                        return correct ? `${i + 1}: ${correct}` : null;
                      })
                      .filter(Boolean)
                      .join('; ') || 'See mark scheme';
                  }
                  break;
                case 'headline-matching':
                  if (questionData.articles && Array.isArray(questionData.articles)) {
                    return questionData.articles
                      .map((a: any, i: number) => {
                        const correct = a.correctHeadline || a.correct;
                        return correct ? `Q${i + 1}: ${correct}` : null;
                      })
                      .filter(Boolean)
                      .join(', ') || 'See mark scheme';
                  }
                  break;
                case 'open-response':
                  if (questionData.questions && Array.isArray(questionData.questions)) {
                    return questionData.questions
                      .map((q: any, i: number) => {
                        const correct = q.expectedAnswer || q.acceptableAnswers?.join(' / ') || q.correct;
                        return correct ? `Q${i + 1}: ${correct}` : null;
                      })
                      .filter(Boolean)
                      .join('; ') || 'Requires manual marking';
                  } else if (questionData.expectedAnswer) {
                    return questionData.expectedAnswer;
                  }
                  break;
                case 'translation':
                  if (questionData.sentences && Array.isArray(questionData.sentences)) {
                    return questionData.sentences
                      .map((s: any, i: number) => {
                        const correct = s.expectedTranslation || s.acceptableTranslations?.[0] || s.english;
                        return correct ? `${i + 1}: ${correct}` : null;
                      })
                      .filter(Boolean)
                      .join('; ') || 'Requires manual marking';
                  }
                  break;
              }
            } catch (e) {
              console.error('Error extracting correct answer:', e);
            }
            return 'See mark scheme';
          };

          // Build questions array - expanding multi-part questions into sub-questions
          const questions: Question[] = [];

          for (const r of (responses || [])) {
            const qDetails = questionDetailsMap.get(r.question_id);
            const questionType = r.question_type || qDetails?.question_type;
            const questionData = qDetails?.question_data;

            // Parse student answer if it's JSON
            let parsedStudentAnswer: any = r.student_answer;
            if (typeof r.student_answer === 'string') {
              try {
                if (r.student_answer.startsWith('{') || r.student_answer.startsWith('[')) {
                  parsedStudentAnswer = JSON.parse(r.student_answer);
                }
              } catch (e) {
                // Keep as string
              }
            }

            // Check if this is a multi-part question that should be expanded
            const shouldExpand = questionType && ['letter-matching', 'multiple-choice', 'student-grid', 'open-response', 'headline-matching', 'sentence-completion', 'time-sequence', 'translation'].includes(questionType)
              && typeof parsedStudentAnswer === 'object' && parsedStudentAnswer !== null;

            // Debug logging for specific problematic questions help identify structure mismatch
            if (questionType === 'headline-matching' || questionType === 'sentence-completion' || !shouldExpand) {
              console.log(`[DEBUG] Question ${r.question_number} (${questionType}):`, {
                shouldExpand,
                hasData: !!questionData,
                answerParams: Object.keys(parsedStudentAnswer || {}),
                dataKeys: Object.keys(questionData || {})
              });
            }

            if (shouldExpand && questionData) {
              // Expand into sub-questions
              let subQuestionIndex = 1;

              if (questionType === 'letter-matching' && questionData.students) {
                // Letter matching: student names with letter answers
                // Check if correct answers are in a separate object (correctAnswers) or embedded in students array
                const correctAnswersMap = questionData.correctAnswers || {};

                for (const student of questionData.students) {
                  const studentName = student.name;
                  // Try multiple sources for correct answer
                  const correctLetter = correctAnswersMap[studentName] || student.correctLetter || student.correct || '?';
                  const studentAnswerValue = parsedStudentAnswer[studentName] || 'No answer';
                  const isSubCorrect = studentAnswerValue === correctLetter;

                  questions.push({
                    questionId: `${r.question_id}-${subQuestionIndex}`,
                    questionNumber: parseFloat(`${r.question_number}.${subQuestionIndex}`),
                    questionText: `${qDetails?.title || 'Question'} - ${studentName}`,
                    studentAnswer: studentAnswerValue,
                    correctAnswer: correctLetter,
                    isCorrect: isSubCorrect,
                    points: isSubCorrect ? 1 : 0,
                    maxPoints: 1,
                    timeSpent: Math.round((r.time_spent_seconds || 0) / questionData.students.length)
                  });
                  subQuestionIndex++;
                }
              } else if (questionType === 'multiple-choice' && questionData.questions) {
                // Multiple choice array
                for (let i = 0; i < questionData.questions.length; i++) {
                  const q = questionData.questions[i];
                  const correctAnswer = q.correctAnswer || q.correct || '?';
                  // Student answer might be keyed by index
                  const studentAnswerValue = parsedStudentAnswer[i] || parsedStudentAnswer[String(i)] || 'No answer';
                  const isSubCorrect = studentAnswerValue === correctAnswer;

                  questions.push({
                    questionId: `${r.question_id}-${subQuestionIndex}`,
                    questionNumber: parseFloat(`${r.question_number}.${subQuestionIndex}`),
                    questionText: q.text || q.question || `${qDetails?.title || 'Question'} - Part ${subQuestionIndex}`,
                    studentAnswer: studentAnswerValue,
                    correctAnswer: correctAnswer,
                    isCorrect: isSubCorrect,
                    points: isSubCorrect ? 1 : 0,
                    maxPoints: 1,
                    timeSpent: Math.round((r.time_spent_seconds || 0) / questionData.questions.length)
                  });
                  subQuestionIndex++;
                }
              } else if (questionType === 'student-grid' && questionData.questions) {
                // Student grid questions
                for (let i = 0; i < questionData.questions.length; i++) {
                  const q = questionData.questions[i];
                  const correctAnswer = q.correctStudent || q.correct || '?';
                  const studentAnswerValue = parsedStudentAnswer[i] || parsedStudentAnswer[String(i)] || 'No answer';
                  const isSubCorrect = studentAnswerValue === correctAnswer;

                  questions.push({
                    questionId: `${r.question_id}-${subQuestionIndex}`,
                    questionNumber: parseFloat(`${r.question_number}.${subQuestionIndex}`),
                    questionText: q.text || q.question || `${qDetails?.title || 'Question'} - Part ${subQuestionIndex}`,
                    studentAnswer: studentAnswerValue,
                    correctAnswer: correctAnswer,
                    isCorrect: isSubCorrect,
                    points: isSubCorrect ? 1 : 0,
                    maxPoints: 1,
                    timeSpent: Math.round((r.time_spent_seconds || 0) / questionData.questions.length)
                  });
                  subQuestionIndex++;
                }
              } else if (questionType === 'open-response' && questionData.questions) {
                // Open response questions
                for (let i = 0; i < questionData.questions.length; i++) {
                  const q = questionData.questions[i];
                  const correctAnswer = q.expectedAnswer || q.acceptableAnswers?.join(' / ') || 'See mark scheme';
                  const studentAnswerValue = parsedStudentAnswer[i] || parsedStudentAnswer[String(i)] || 'No answer';

                  questions.push({
                    questionId: `${r.question_id}-${subQuestionIndex}`,
                    questionNumber: parseFloat(`${r.question_number}.${subQuestionIndex}`),
                    questionText: q.text || q.question || `${qDetails?.title || 'Question'} - Part ${subQuestionIndex}`,
                    studentAnswer: studentAnswerValue,
                    correctAnswer: correctAnswer,
                    isCorrect: r.is_correct, // Open response needs manual check
                    points: r.points_awarded || 0,
                    maxPoints: q.marks || 1,
                    timeSpent: Math.round((r.time_spent_seconds || 0) / questionData.questions.length)
                  });
                  subQuestionIndex++;
                }
              } else if (questionType === 'headline-matching' && questionData.articles) {
                // Headline matching
                for (let i = 0; i < questionData.articles.length; i++) {
                  const q = questionData.articles[i];
                  const correctAnswer = q.correctHeadline || q.correct || '?';
                  const studentAnswerValue = parsedStudentAnswer[String(i)] || parsedStudentAnswer[i] || 'No answer';
                  const isSubCorrect = String(studentAnswerValue) === String(correctAnswer);

                  questions.push({
                    questionId: `${r.question_id}-${subQuestionIndex}`,
                    questionNumber: parseFloat(`${r.question_number}.${subQuestionIndex}`),
                    questionText: `Pt ${subQuestionIndex}: ${q.title || q.text || 'Article'}`,
                    studentAnswer: studentAnswerValue,
                    correctAnswer: correctAnswer,
                    isCorrect: isSubCorrect,
                    points: isSubCorrect ? 1 : 0,
                    maxPoints: 1,
                    timeSpent: Math.round((r.time_spent_seconds || 0) / questionData.articles.length)
                  });
                  subQuestionIndex++;
                }
              } else if (questionType === 'sentence-completion' && questionData.sentences) {
                // Sentence completion
                for (let i = 0; i < questionData.sentences.length; i++) {
                  const s = questionData.sentences[i];
                  const correctAnswer = s.correctCompletion || s.correct || '?';
                  const studentAnswerValue = parsedStudentAnswer[String(i)] || parsedStudentAnswer[i] || 'No answer';
                  const isSubCorrect = String(studentAnswerValue).trim().toLowerCase() === String(correctAnswer).trim().toLowerCase();

                  questions.push({
                    questionId: `${r.question_id}-${subQuestionIndex}`,
                    questionNumber: parseFloat(`${r.question_number}.${subQuestionIndex}`),
                    questionText: `Pt ${subQuestionIndex}: ${s.text || 'Sentence'}`,
                    studentAnswer: studentAnswerValue,
                    correctAnswer: correctAnswer,
                    isCorrect: isSubCorrect,
                    points: isSubCorrect ? 1 : 0,
                    maxPoints: 1,
                    timeSpent: Math.round((r.time_spent_seconds || 0) / questionData.sentences.length)
                  });
                  subQuestionIndex++;
                }
              } else if (questionType === 'time-sequence' && questionData.events) {
                // Time sequence
                for (let i = 0; i < questionData.events.length; i++) {
                  const e = questionData.events[i];
                  const correctAnswer = e.correctSequence || e.correct || '?';
                  const studentAnswerValue = parsedStudentAnswer[String(i)] || parsedStudentAnswer[i] || 'No answer';
                  const isSubCorrect = String(studentAnswerValue) === String(correctAnswer);

                  questions.push({
                    questionId: `${r.question_id}-${subQuestionIndex}`,
                    questionNumber: parseFloat(`${r.question_number}.${subQuestionIndex}`),
                    questionText: `Pt ${subQuestionIndex}: ${e.event || e.text || 'Event'}`,
                    studentAnswer: studentAnswerValue,
                    correctAnswer: correctAnswer,
                    isCorrect: isSubCorrect,
                    points: isSubCorrect ? 1 : 0,
                    maxPoints: 1,
                    timeSpent: Math.round((r.time_spent_seconds || 0) / questionData.events.length)
                  });
                  subQuestionIndex++;
                }
              } else if (questionType === 'translation' && questionData.sentences) {
                // Translation - use stored sub-question scores if available
                const storedScores = r.sub_question_scores || {};

                for (let i = 0; i < questionData.sentences.length; i++) {
                  const s = questionData.sentences[i];
                  const correctAnswer = s.expectedTranslation || s.acceptableTranslations?.[0] || s.english || s.translation || s.answer || s.correct || s.spanish || 'See mark scheme';
                  const studentAnswerValue = parsedStudentAnswer[String(i)] || parsedStudentAnswer[i] || 'No answer';
                  const subQuestionMarks = s.marks || 2;

                  // Use stored score if available, otherwise distribute proportionally
                  const subQuestionPoints = storedScores[subQuestionIndex] !== undefined
                    ? storedScores[subQuestionIndex]
                    : Math.round((r.points_awarded / r.marks_possible) * subQuestionMarks);

                  questions.push({
                    questionId: `${r.question_id}-${subQuestionIndex}`,
                    questionNumber: parseFloat(`${r.question_number}.${subQuestionIndex}`),
                    questionText: `Pt ${subQuestionIndex}: ${s.spanish || s.text || 'Translation'}`,
                    studentAnswer: studentAnswerValue,
                    correctAnswer: correctAnswer,
                    isCorrect: subQuestionPoints === subQuestionMarks,
                    points: subQuestionPoints,
                    maxPoints: subQuestionMarks,
                    timeSpent: Math.round((r.time_spent_seconds || 0) / questionData.sentences.length)
                  });
                  subQuestionIndex++;
                }
              } else {
                // Fallback: expand object keys as sub-questions
                const entries = Array.isArray(parsedStudentAnswer)
                  ? parsedStudentAnswer.map((v, i) => [String(i), v])
                  : Object.entries(parsedStudentAnswer);

                for (const [key, value] of entries) {
                  // Try to make title nicer
                  let displayKey = key;
                  if (!isNaN(parseInt(key))) {
                    displayKey = `Part ${parseInt(key) + 1}`;
                  }

                  questions.push({
                    questionId: `${r.question_id}-${subQuestionIndex}`,
                    questionNumber: parseFloat(`${r.question_number}.${subQuestionIndex}`),
                    questionText: `${qDetails?.title || 'Question'} - ${displayKey}`,
                    studentAnswer: String(value),
                    correctAnswer: 'See mark scheme',
                    isCorrect: r.is_correct,
                    points: r.points_awarded || 0,
                    maxPoints: r.marks_possible || 1,
                    timeSpent: Math.round((r.time_spent_seconds || 0) / entries.length)
                  });
                  subQuestionIndex++;
                }
              }
            } else {
              // Single question - keep as is
              const correctAnswer = qDetails?.question_data
                ? extractCorrectAnswer(qDetails.question_data, questionType)
                : 'See mark scheme';

              questions.push({
                questionId: r.question_id,
                questionNumber: r.question_number,
                questionText: qDetails?.title || `Question ${r.question_number}`,
                studentAnswer: formatStudentAnswer(
                  typeof r.student_answer === 'string' ? r.student_answer : JSON.stringify(r.student_answer),
                  questionType
                ),
                correctAnswer: correctAnswer,
                isCorrect: r.is_correct,
                points: r.points_awarded || 0,
                maxPoints: r.marks_possible || 1,
                timeSpent: r.time_spent_seconds
              });
            }
          }

          return {
            resultId: result.id,
            studentId: result.student_id,
            studentName: userProfiles.get(result.student_id) || 'Unknown Student',
            score: result.raw_score || 0,
            maxScore: result.total_possible_score || 40,
            percentage: Math.round(result.percentage_score || 0),
            timeSpent: result.total_time_seconds || 0,
            questions
          };
        }));
      }
    } else if (assessmentType === 'gcse-listening' || assessmentType === 'aqa-listening') {
      // Handle GCSE/AQA Listening assessment type - similar to reading
      const { data: listeningResults, error } = await supabase
        .from('aqa_listening_results')
        .select('id, student_id, raw_score, total_possible_score, percentage_score, total_time_seconds, responses, created_at')
        .eq('assignment_id', assignmentId)
        .eq('status', 'completed')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching GCSE listening results:', error);
        throw error;
      }

      if (listeningResults && listeningResults.length > 0) {
        const studentIds = [...new Set(listeningResults.map(r => r.student_id))];
        let userProfiles = new Map<string, string>();

        const { data: profiles } = await supabase
          .from('user_profiles')
          .select('user_id, display_name')
          .in('user_id', studentIds);

        if (profiles) {
          profiles.forEach(p => userProfiles.set(p.user_id, p.display_name));
        }

        // Helper function to extract correct answer for a specific sub-question from listening question_data
        const extractListeningSubQuestionCorrectAnswer = (
          questionData: any,
          questionType: string,
          subQuestionId: string | null
        ): string => {
          if (!questionData) return 'See mark scheme';

          try {
            switch (questionType) {
              case 'letter-matching':
                // Look up the specific sub-question by id
                if (questionData.questions && Array.isArray(questionData.questions)) {
                  const subQ = questionData.questions.find((q: any) => q.id === subQuestionId);
                  if (subQ) {
                    return subQ.correctAnswer || subQ.correct || '?';
                  }
                }
                break;
              case 'multiple-choice':
                // Look up by question id (e.g., 'q1', 'q2')
                if (questionData.questions && Array.isArray(questionData.questions)) {
                  const qIndex = parseInt(subQuestionId?.replace('q', '') || '1') - 1;
                  const subQ = questionData.questions[qIndex];
                  if (subQ) {
                    return subQ.correctAnswer || subQ.correct || '?';
                  }
                }
                break;
              case 'lifestyle-grid':
                // Format: ana_good, ana_needs, carlos_good, carlos_needs, etc.
                if (questionData.speakers && Array.isArray(questionData.speakers)) {
                  const parts = subQuestionId?.split('_') || [];
                  const speakerId = parts[0];
                  const answerType = parts[1]; // 'good' or 'needs'
                  const speaker = questionData.speakers.find((s: any) => s.id === speakerId);
                  if (speaker) {
                    if (answerType === 'good') {
                      return speaker.correctGood || '?';
                    } else if (answerType === 'needs') {
                      return speaker.correctNeedsImprovement || '?';
                    }
                  }
                }
                break;
              case 'opinion-rating':
                // Look up by aspect id
                if (questionData.aspects && Array.isArray(questionData.aspects)) {
                  const aspect = questionData.aspects.find((a: any) => a.id === subQuestionId);
                  if (aspect) {
                    return aspect.correctAnswer || '?';
                  }
                }
                break;
              case 'open-response':
                // Look up by question id (e.g., 'q1', 'q2')
                if (questionData.questions && Array.isArray(questionData.questions)) {
                  const subQ = questionData.questions.find((q: any) => q.id === subQuestionId);
                  if (subQ) {
                    return subQ.sampleAnswer || subQ.expectedAnswer || subQ.acceptableAnswers?.join(' / ') || 'See mark scheme';
                  }
                }
                break;
              case 'activity-timing':
                // Complex type - show general answer format
                if (questionData.questions && Array.isArray(questionData.questions)) {
                  const qIndex = parseInt(subQuestionId?.replace('q', '') || '1') - 1;
                  const subQ = questionData.questions[qIndex];
                  if (subQ) {
                    return `Activity: ${subQ.correctActivity}, Time: ${subQ.correctTime}`;
                  }
                }
                return 'See mark scheme';
              case 'multi-part':
                // Look up by part id (e.g., 'part1', 'part2')
                if (questionData.parts && Array.isArray(questionData.parts)) {
                  const partIndex = parseInt(subQuestionId?.replace('part', '') || '1') - 1;
                  const part = questionData.parts[partIndex];
                  if (part) {
                    return part.correctAnswer || part.correct || '?';
                  }
                }
                break;
              case 'dictation':
                // Look up by sentence number
                if (questionData.sentences && Array.isArray(questionData.sentences)) {
                  const sentenceIndex = parseInt(subQuestionId?.replace('sentence', '') || '1') - 1;
                  const sentence = questionData.sentences[sentenceIndex];
                  if (sentence) {
                    return sentence.text || sentence.sentence || sentence;
                  }
                }
                break;
            }
          } catch (e) {
            console.error('Error extracting listening correct answer:', e);
          }
          return 'See mark scheme';
        };

        // Helper to format sub-question label nicely
        const formatSubQuestionLabel = (subQuestionId: string | null, questionType: string): string => {
          if (!subQuestionId) return '';

          // Capitalize first letter and replace underscores with spaces
          const formatted = subQuestionId
            .replace(/_/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());

          // For certain types, format more nicely
          if (questionType === 'lifestyle-grid') {
            const parts = subQuestionId.split('_');
            const speaker = parts[0]?.charAt(0).toUpperCase() + parts[0]?.slice(1);
            const type = parts[1] === 'good' ? 'Good at' : 'Needs to improve';
            return `${speaker} - ${type}`;
          }

          if (questionType === 'letter-matching') {
            return formatted; // e.g., "Monday", "Tuesday"
          }

          if (subQuestionId.startsWith('q')) {
            return `Part ${subQuestionId.replace('q', '')}`;
          }

          if (subQuestionId.startsWith('part')) {
            return `Part ${subQuestionId.replace('part', '')}`;
          }

          if (subQuestionId.startsWith('sentence')) {
            return `Sentence ${subQuestionId.replace('sentence', '')}`;
          }

          return formatted;
        };

        // Helper to parse JSON student answer
        const parseStudentAnswer = (answer: string): string => {
          if (!answer) return 'No answer';

          try {
            if (answer.startsWith('{') || answer.startsWith('[')) {
              const parsed = JSON.parse(answer);
              if (typeof parsed === 'object' && parsed !== null) {
                if (Array.isArray(parsed)) {
                  return parsed.join(', ');
                }
                // Key-value pairs
                return Object.entries(parsed)
                  .map(([key, value]) => {
                    let formattedValue = value;
                    if (typeof value === 'object' && value !== null) {
                      // Handle formatting of nested objects like {activity: 3, time: "C"}
                      if ('activity' in value && 'time' in value) {
                        formattedValue = `Activity: ${value.activity}, Time: ${value.time}`;
                      } else {
                        formattedValue = JSON.stringify(value);
                      }
                    }

                    // Format keys if they are q1, q2, etc.
                    let formattedKey = key;
                    if (/^q\d+$/.test(key)) {
                      formattedKey = `Part ${key.substring(1)}`;
                    } else if (/^part\d+$/.test(key)) {
                      formattedKey = `Part ${key.substring(4)}`;
                    } else if (/^sentence\d+$/.test(key)) {
                      formattedKey = `Sentence ${key.substring(8)}`;
                    } else {
                      // Capitalize
                      formattedKey = key.charAt(0).toUpperCase() + key.slice(1);
                    }

                    return `${formattedKey}: ${formattedValue}`;
                  })
                  .join(', ');
              }
              return String(parsed);
            }
          } catch (e) {
            // If parse fails, return original
          }
          return answer;
        };

        // Process each result
        results = await Promise.all(listeningResults.map(async (result: any) => {
          const responses = result.responses || [];
          const questionIds = [...new Set(responses.map((r: any) => r.question_id).filter(Boolean))];

          // Fetch question details
          let questionDetailsMap = new Map<string, any>();
          if (questionIds.length > 0) {
            const { data: questions } = await supabase
              .from('aqa_listening_questions')
              .select('id, title, question_type, question_data')
              .in('id', questionIds);

            if (questions) {
              questions.forEach((q: any) => questionDetailsMap.set(q.id, q));
            }
          }

          // Group responses by question_id to determine sub-question numbering
          const questionGroups = new Map<string, number>();
          responses.forEach((r: any) => {
            const count = questionGroups.get(r.question_id) || 0;
            questionGroups.set(r.question_id, count + 1);
          });

          // Track sub-question index within each question
          const subQuestionCounters = new Map<string, number>();

          const questions: Question[] = responses.flatMap((r: any, index: number) => {
            const qDetails = questionDetailsMap.get(r.question_id);
            const questionType = r.question_type || qDetails?.question_type || 'unknown';

            // Check if this response needs expansion (single row in DB but multiple sub-questions in data)
            const questionData = qDetails?.question_data;
            const needsExpansion = !r.sub_question_number && questionData && (
              (questionType === 'opinion-rating' && questionData.aspects) ||
              (questionType === 'open-response' && questionData.questions) ||
              (questionType === 'activity-timing' && questionData.questions) ||
              (questionType === 'multi-part' && questionData.parts) ||
              (questionType === 'dictation' && questionData.sentences)
            );

            if (needsExpansion) {
              let parsedAnswer: any = {};
              try {
                if (typeof r.student_answer === 'string' && (r.student_answer.startsWith('{') || r.student_answer.startsWith('['))) {
                  parsedAnswer = JSON.parse(r.student_answer);
                } else {
                  parsedAnswer = r.student_answer;
                }
              } catch (e) {
                parsedAnswer = {};
              }

              const expandedQuestions: Question[] = [];
              let localSubIndex = 1;

              if (questionType === 'opinion-rating' && questionData.aspects) {
                questionData.aspects.forEach((aspect: any) => {
                  const subId = aspect.id;
                  const studentVal = parsedAnswer[subId];
                  const correctVal = aspect.correctAnswer || aspect.correct || '?';

                  // Check for manual override
                  let points = String(studentVal) === String(correctVal) ? 1 : 0;
                  if (r.sub_question_scores && r.sub_question_scores[subId] !== undefined) {
                    points = r.sub_question_scores[subId];
                  }

                  expandedQuestions.push({
                    questionId: `${r.question_id}-${subId}`,
                    questionNumber: parseFloat(`${r.question_number}.${localSubIndex}`),
                    questionText: `${qDetails?.title || 'Question'} - ${aspect.label || aspect.aspect || 'Aspect'}`,
                    studentAnswer: studentVal || 'No answer',
                    correctAnswer: correctVal,
                    isCorrect: points === 1,
                    points: points,
                    maxPoints: 1,
                    timeSpent: undefined
                  });
                  localSubIndex++;
                });
              } else if (questionType === 'open-response' && questionData.questions) {
                questionData.questions.forEach((q: any) => {
                  const subId = q.id || `q${localSubIndex}`;
                  const studentVal = parsedAnswer[subId];
                  const correctVal = q.sampleAnswer || q.expectedAnswer || '?';
                  const maxP = q.marks || 1;

                  // Check for manual override
                  let points = 0; // Default to 0 for open response unless marked
                  if (r.sub_question_scores && r.sub_question_scores[subId] !== undefined) {
                    points = r.sub_question_scores[subId];
                  } else if (r.is_correct) {
                    // Fallback to average/total if no specific score? No, dangerous.
                    // Just keep 0 if not auto-gradable.
                  }

                  expandedQuestions.push({
                    questionId: `${r.question_id}-${subId}`,
                    questionNumber: parseFloat(`${r.question_number}.${localSubIndex}`),
                    questionText: `${qDetails?.title || 'Question'} - ${q.question || `Part ${localSubIndex}`}`,
                    studentAnswer: studentVal || 'No answer',
                    correctAnswer: correctVal,
                    isCorrect: points === maxP,
                    points: points,
                    maxPoints: maxP,
                    timeSpent: undefined
                  });
                  localSubIndex++;
                });
              } else if (questionType === 'activity-timing' && questionData.questions) {
                questionData.questions.forEach((q: any) => {
                  const subId = q.id || `q${localSubIndex}`;
                  const studentVal = parsedAnswer[subId];
                  // Format nested student answer: {activity: 3, time: "C"}
                  let formattedStudentVal = 'No answer';
                  if (studentVal) {
                    if (typeof studentVal === 'object') {
                      formattedStudentVal = `Activity: ${studentVal.activity}, Time: ${studentVal.time}`;
                    } else {
                      formattedStudentVal = String(studentVal);
                    }
                  }

                  const correctVal = `Activity: ${q.correctActivity}, Time: ${q.correctTime}`;

                  // Partial scoring: 1 point activity, 1 point time
                  let points = 0;
                  if (studentVal && typeof studentVal === 'object') {
                    if (String(studentVal.activity) === String(q.correctActivity)) points += 1;
                    if (String(studentVal.time) === String(q.correctTime)) points += 1;
                  }

                  // Check for manual override
                  if (r.sub_question_scores && r.sub_question_scores[subId] !== undefined) {
                    points = r.sub_question_scores[subId];
                  }

                  expandedQuestions.push({
                    questionId: `${r.question_id}-${subId}`,
                    questionNumber: parseFloat(`${r.question_number}.${localSubIndex}`),
                    questionText: `${qDetails?.title || 'Question'} - Part ${localSubIndex}`,
                    studentAnswer: formattedStudentVal,
                    correctAnswer: correctVal,
                    isCorrect: points === 2,
                    points: points,
                    maxPoints: 2,
                    timeSpent: undefined
                  });
                  localSubIndex++;
                });
              } else if (questionType === 'multi-part' && questionData.parts) {
                questionData.parts.forEach((p: any) => {
                  const subId = p.id || `part${localSubIndex}`;
                  const studentVal = parsedAnswer[subId];
                  const correctVal = p.correctAnswer || p.correct || '?';

                  let points = String(studentVal) === String(correctVal) ? 1 : 0;
                  if (r.sub_question_scores && r.sub_question_scores[subId] !== undefined) {
                    points = r.sub_question_scores[subId];
                  }

                  expandedQuestions.push({
                    questionId: `${r.question_id}-${subId}`,
                    questionNumber: parseFloat(`${r.question_number}.${localSubIndex}`),
                    questionText: `${qDetails?.title || 'Question'} - ${p.question || `Part ${localSubIndex}`}`,
                    studentAnswer: studentVal || 'No answer',
                    correctAnswer: correctVal,
                    isCorrect: points === 1,
                    points: points,
                    maxPoints: 1,
                    timeSpent: undefined
                  });
                  localSubIndex++;
                });
              } else if (questionType === 'dictation' && questionData.sentences) {
                questionData.sentences.forEach((s: any) => {
                  const subId = s.id || `sentence${localSubIndex}`;
                  const studentVal = parsedAnswer[subId];
                  const correctVal = s.text || s.sentence || s.correctText || '?';

                  // Simple scoring heuristic
                  let points = 0;
                  const normStudent = String(studentVal || '').trim().toLowerCase();
                  const normCorrect = String(correctVal).trim().toLowerCase();

                  if (normStudent === normCorrect && normStudent.length > 0) {
                    points = 2;
                  } else if (normStudent.length > 5 && normCorrect.includes(normStudent.substring(0, Math.min(10, normStudent.length)))) {
                    points = 1;
                  }

                  // Check for manual override
                  if (r.sub_question_scores && r.sub_question_scores[subId] !== undefined) {
                    points = r.sub_question_scores[subId];
                  }

                  expandedQuestions.push({
                    questionId: `${r.question_id}-${subId}`,
                    questionNumber: parseFloat(`${r.question_number}.${localSubIndex}`),
                    questionText: `${qDetails?.title || 'Dictation'} - Sentence ${localSubIndex}`,
                    studentAnswer: studentVal || 'No answer',
                    correctAnswer: correctVal,
                    isCorrect: points === 2,
                    points: points,
                    maxPoints: 2,
                    timeSpent: undefined
                  });
                  localSubIndex++;
                });
              }

              if (expandedQuestions.length > 0) {
                return expandedQuestions;
              }
            }

            // Standard processing (existing logic)

            // Get or increment sub-question counter for this question
            const subIndex = (subQuestionCounters.get(r.question_id) || 0) + 1;
            subQuestionCounters.set(r.question_id, subIndex);

            // Determine correct answer for this specific sub-question
            const correctAnswer = qDetails?.question_data
              ? extractListeningSubQuestionCorrectAnswer(
                qDetails.question_data,
                questionType,
                r.sub_question_number
              )
              : 'See mark scheme';

            // Build question text with sub-question label
            let questionText = qDetails?.title || `Question ${r.question_number || index + 1}`;
            if (r.sub_question_number) {
              const subLabel = formatSubQuestionLabel(r.sub_question_number, questionType);
              questionText = `${questionText} - ${subLabel}`;
            }

            // Calculate question number (e.g., 1.1, 1.2, 2.1, etc.)
            const hasSubQuestions = questionGroups.get(r.question_id)! > 1;
            const questionNumber = hasSubQuestions
              ? parseFloat(`${r.question_number}.${subIndex}`)
              : r.question_number || index + 1;

            // Parse student answer if it's JSON
            const studentAnswer = typeof r.student_answer === 'string' && r.student_answer.startsWith('{')
              ? parseStudentAnswer(r.student_answer)
              : r.student_answer || 'No answer';

            return [{
              questionId: r.sub_question_number
                ? `${r.question_id}-${r.sub_question_number}`
                : r.question_id || `q${index + 1}`,
              questionNumber: questionNumber,
              questionText: questionText,
              studentAnswer: studentAnswer,
              correctAnswer: correctAnswer,
              isCorrect: r.is_correct || false,
              points: r.points_awarded || 0,
              maxPoints: r.marks_possible || 1,
              timeSpent: r.time_spent_seconds || undefined
            }];
          });

          return {
            resultId: result.id,
            studentId: result.student_id,
            studentName: userProfiles.get(result.student_id) || 'Unknown Student',
            score: result.raw_score || 0,
            maxScore: result.total_possible_score || 40,
            percentage: Math.round(result.percentage_score || 0),
            timeSpent: result.total_time_seconds || 0,
            questions
          };
        }));
      }
    } else if (assessmentType === 'gcse-writing' || assessmentType === 'aqa-writing' || assessmentType === 'writing') {
      // Handle GCSE/AQA Writing assessment type
      const { data: writingResults, error } = await supabase
        .from('aqa_writing_results')
        .select('id, student_id, total_score, max_score, percentage_score, time_spent_seconds, created_at')
        .eq('assignment_id', assignmentId)
        .eq('is_completed', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching GCSE writing results:', error);
        throw error;
      }

      if (writingResults && writingResults.length > 0) {
        const studentIds = [...new Set(writingResults.map(r => r.student_id))];
        let userProfiles = new Map<string, string>();

        const { data: profiles } = await supabase
          .from('user_profiles')
          .select('user_id, display_name')
          .in('user_id', studentIds);

        if (profiles) {
          profiles.forEach(p => userProfiles.set(p.user_id, p.display_name));
        }

        // Fetch question responses for writing
        results = await Promise.all(writingResults.map(async (result: any) => {
          const { data: responses } = await supabase
            .from('aqa_writing_question_responses')
            .select('question_id, response_data, score, max_score, feedback, is_correct, ai_grading')
            .eq('result_id', result.id)
            .order('created_at', { ascending: true });

          // Fetch question details to get proper titles and types
          const questionIds = (responses || []).map((r: any) => r.question_id).filter(Boolean);
          let questionDetails = new Map<string, any>();
          
          if (questionIds.length > 0) {
            const { data: questions } = await supabase
              .from('aqa_writing_questions')
              .select('id, title, question_type, question_number, marks')
              .in('id', questionIds);
            
            if (questions) {
              questions.forEach((q: any) => {
                questionDetails.set(q.id, {
                  title: q.title,
                  type: q.question_type,
                  number: q.question_number,
                  marks: q.marks
                });
              });
            }
          }

          // Helper function to format response data for display
          const formatResponseData = (responseData: any, questionType: string, questionNumber: number): string => {
            if (!responseData) return '(No response)';
            if (typeof responseData === 'string') return responseData;
            
            if (typeof responseData === 'object') {
              // Photo description: sentences array
              if (questionType === 'photo-description' && responseData.sentences) {
                return responseData.sentences.map((s: string, i: number) => 
                  `${questionNumber}.${i + 1}: ${s}`
                ).join('\n');
              }
              // Short message
              if (responseData.message) {
                return responseData.message;
              }
              // Extended writing article
              if (responseData.article) {
                return responseData.article;
              }
              // Gap-fill: question-0, question-1, etc.
              if (questionType === 'gap-fill') {
                const entries = Object.entries(responseData);
                return entries.map(([key, value]) => {
                  const num = key.replace('question-', '');
                  return `${questionNumber}.${parseInt(num) + 1}: ${value}`;
                }).join('\n');
              }
              // Translation
              if (questionType === 'translation') {
                const entries = Object.entries(responseData);
                return entries.map(([key, value]) => {
                  if (key.startsWith('translation-')) {
                    const num = key.replace('translation-', '');
                    return `${questionNumber}.${parseInt(num) + 1}: ${value}`;
                  }
                  return `${value}`;
                }).join('\n');
              }
              // Fallback: show key-value pairs
              const entries = Object.entries(responseData);
              if (entries.length > 0) {
                return entries.map(([k, v]) => `${k}: ${v}`).join('\n');
              }
            }
            
            return String(responseData);
          };

          // Build question list with proper formatting
          const questions: Question[] = (responses || []).map((r: any, index: number) => {
            const qDetails = questionDetails.get(r.question_id);
            const questionType = qDetails?.type || 'unknown';
            const questionNumber = qDetails?.number || (index + 1);
            
            return {
              questionId: r.question_id || `q${index + 1}`,
              questionNumber: questionNumber,
              questionText: qDetails?.title || `Writing Task ${index + 1}`,
              studentAnswer: formatResponseData(r.response_data, questionType, questionNumber),
              correctAnswer: 'AI-marked - see feedback below',
              isCorrect: r.is_correct || false,
              points: r.score || 0,
              maxPoints: r.max_score || qDetails?.marks || 10,
              timeSpent: undefined,
              feedback: r.feedback || '',  // Include AI feedback from database
              aiGrading: r.ai_grading
            };
          });

          return {
            resultId: result.id,
            studentId: result.student_id,
            studentName: userProfiles.get(result.student_id) || 'Unknown Student',
            score: result.total_score || 0,
            maxScore: result.max_score || 50,
            percentage: Math.round(result.percentage_score || 0),
            timeSpent: result.time_spent_seconds || 0,
            questions
          };
        }));
      }
    } else if (assessmentType === 'gcse-speaking' || assessmentType === 'aqa-speaking' || assessmentType === 'speaking') {
      // Handle GCSE/AQA Speaking assessment type
      const { data: speakingResults, error } = await supabase
        .from('aqa_speaking_results')
        .select('id, student_id, total_score, max_score, percentage_score, time_spent_seconds, created_at')
        .eq('assignment_id', assignmentId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching GCSE speaking results:', error);
        throw error;
      }

      if (speakingResults && speakingResults.length > 0) {
        const studentIds = [...new Set(speakingResults.map(r => r.student_id))];
        let userProfiles = new Map<string, string>();

        const { data: profiles } = await supabase
          .from('user_profiles')
          .select('user_id, display_name')
          .in('user_id', studentIds);

        if (profiles) {
          profiles.forEach(p => userProfiles.set(p.user_id, p.display_name));
        }

        // Speaking assessments are manually graded based on recorded responses
        results = speakingResults.map((result: any) => ({
          resultId: result.id,
          studentId: result.student_id,
          studentName: userProfiles.get(result.student_id) || 'Unknown Student',
          score: result.total_score || 0,
          maxScore: result.max_score || 40,
          percentage: Math.round(result.percentage_score || 0),
          timeSpent: result.time_spent_seconds || 0,
          questions: [] // Speaking typically doesn't have discrete questions with answers
        }));
      }
    } else if (assessmentType === 'dictation' || assessmentType === 'aqa-dictation' || assessmentType === 'gcse-dictation') {
      // Handle Dictation assessment type
      const { data: dictationResults, error } = await supabase
        .from('aqa_dictation_results')
        .select('id, student_id, raw_score, total_possible_score, percentage_score, total_time_seconds, responses, created_at, holistic_scores')
        .eq('assignment_id', assignmentId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching dictation results:', error);
        throw error;
      }

      if (dictationResults && dictationResults.length > 0) {
        const studentIds = [...new Set(dictationResults.map(r => r.student_id))];
        let userProfiles = new Map<string, string>();

        const { data: profiles } = await supabase
          .from('user_profiles')
          .select('user_id, display_name')
          .in('user_id', studentIds);

        if (profiles) {
          profiles.forEach(p => userProfiles.set(p.user_id, p.display_name));
        }

        // Dictation responses include the correct answer as the original sentence
        results = dictationResults.map((result: any) => {
          const questions: Question[] = (result.responses || []).map((r: any, index: number) => ({
            questionId: r.question_id || `q${index + 1}`,
            questionNumber: r.question_number || index + 1,
            questionText: `Dictation Sentence ${r.question_number || index + 1}`,
            studentAnswer: r.student_answer || '',
            correctAnswer: r.correct_answer || 'See original sentence',
            isCorrect: r.is_correct || false,
            points: r.points_awarded || 0,
            maxPoints: r.marks_possible || 2,
            timeSpent: undefined,
            holisticScores: result.holistic_scores
          }));

          return {
            resultId: result.id,
            studentId: result.student_id,
            studentName: userProfiles.get(result.student_id) || 'Unknown Student',
            score: result.raw_score || 0,
            maxScore: result.total_possible_score || 20,
            percentage: Math.round(result.percentage_score || 0),
            timeSpent: result.total_time_seconds || 0,
            questions
          };
        });
      }
    }

    return NextResponse.json({ results });
  } catch (error: any) {
    console.error('Error fetching question details:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch question details' },
      { status: 500 }
    );
  }
}
