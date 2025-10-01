"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertCircle,
  BookOpen,
  CheckCircle,
  Clock,
  FileText,
  Lightbulb,
  ListPlus,
  Loader2,
  Play,
  Plus,
  Search,
  Trash2,
  Upload
} from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { supabaseBrowser } from "@/components/auth/AuthProvider";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface VideoRecord {
  id: string;
  language: string;
  transcript: string | null;
  transcript_translation: string | null;
  title?: string | null;
}

type StatusState = {
  type: "idle" | "success" | "error";
  message?: string;
};

interface VocabularyLink {
  id: string;
  vocabulary_id: string;
  word: string;
  translation: string;
  timestamp_seconds: number | null;
  context_text: string | null;
}

interface VocabularySearchResult {
  id: string;
  word: string;
  translation: string;
  language: string;
}

interface QuizQuestion {
  id: string;
  question_text: string;
  options: string[];
  correct_answer: string;
  explanation: string | null;
  difficulty_level: string;
  timestamp_seconds: number | null;
  question_type: string;
  points: number;
  order_index: number;
}

interface GrammarNote {
  id: string;
  title: string;
  content: string;
  example: string | null;
  section_order: number;
}

interface VideoContentManagerProps {
  video: VideoRecord;
  onContentUpdated?: () => void;
}

export default function VideoContentManager({ video, onContentUpdated }: VideoContentManagerProps) {
  const [activeTab, setActiveTab] = useState("transcript");

  const [transcript, setTranscript] = useState(video.transcript || "");
  const [transcriptTranslation, setTranscriptTranslation] = useState(video.transcript_translation || "");
  const [transcriptStatus, setTranscriptStatus] = useState<StatusState>({ type: "idle" });
  const [transcriptSaving, setTranscriptSaving] = useState(false);

  const [vocabItems, setVocabItems] = useState<VocabularyLink[]>([]);
  const [vocabLoading, setVocabLoading] = useState(true);
  const [vocabStatus, setVocabStatus] = useState<StatusState>({ type: "idle" });
  const [vocabSearch, setVocabSearch] = useState("");
  const [vocabSearchResults, setVocabSearchResults] = useState<VocabularySearchResult[]>([]);
  const [vocabSearchLoading, setVocabSearchLoading] = useState(false);
  const [selectedVocabId, setSelectedVocabId] = useState<string | null>(null);
  const [newVocabTimestamp, setNewVocabTimestamp] = useState<string>("");
  const [newVocabContext, setNewVocabContext] = useState("");

  const [quizLoading, setQuizLoading] = useState(true);
  const [quizStatus, setQuizStatus] = useState<StatusState>({ type: "idle" });
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [jsonImportText, setJsonImportText] = useState("");
  const [jsonImportStatus, setJsonImportStatus] = useState<StatusState>({ type: "idle" });
  const [jsonImportLoading, setJsonImportLoading] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctOption: "A",
    explanation: "",
    difficulty: "beginner",
    timestamp: "",
    points: "1",
    questionType: "multiple_choice"
  });
  const [quizSaving, setQuizSaving] = useState(false);

  const [grammarLoading, setGrammarLoading] = useState(true);
  const [grammarStatus, setGrammarStatus] = useState<StatusState>({ type: "idle" });
  const [grammarNotes, setGrammarNotes] = useState<GrammarNote[]>([]);
  const [newGrammarNote, setNewGrammarNote] = useState({
    title: "",
    content: "",
    example: "",
    sectionOrder: "1"
  });
  const [grammarSaving, setGrammarSaving] = useState(false);

  const supabase = useMemo(() => supabaseBrowser, []);

  useEffect(() => {
    setTranscript(video.transcript || "");
    setTranscriptTranslation(video.transcript_translation || "");
  }, [video.id, video.transcript, video.transcript_translation]);

  useEffect(() => {
    loadVocabulary();
    loadQuizQuestions();
    loadGrammarNotes();
  }, [video.id]);

  const loadVocabulary = async () => {
    setVocabLoading(true);
    setVocabStatus({ type: "idle" });
    try {
      const { data, error } = await supabase
        .from("video_vocabulary")
        .select(
          `
            id,
            vocabulary_id,
            timestamp_seconds,
            context_text,
            centralized_vocabulary:centralized_vocabulary!inner (
              id,
              word,
              translation,
              language
            )
          `
        )
        .eq("video_id", video.id)
        .order("timestamp_seconds", { ascending: true });

      if (error) throw error;

      const mapped = (data || []).map((item: any) => ({
        id: item.id,
        vocabulary_id: item.vocabulary_id || item.centralized_vocabulary?.id,
        word: item.centralized_vocabulary?.word ?? "",
        translation: item.centralized_vocabulary?.translation ?? "",
        timestamp_seconds: item.timestamp_seconds,
        context_text: item.context_text
      }));

      setVocabItems(mapped);
      void updateVocabularyCount(mapped.length);
    } catch (error: any) {
      console.error("Error loading vocabulary:", error);
      setVocabStatus({ type: "error", message: error.message || "Failed to load vocabulary" });
    } finally {
      setVocabLoading(false);
    }
  };

  const performVocabularySearch = async () => {
    if (!vocabSearch.trim()) {
      setVocabSearchResults([]);
      return;
    }

    setVocabSearchLoading(true);
    try {
      const languages = Array.from(new Set([
        video.language,
        video.language?.toUpperCase(),
        video.language?.toLowerCase()
      ].filter(Boolean))) as string[];

      const { data, error } = await supabase
        .from("centralized_vocabulary")
        .select("id, word, translation, language")
        .ilike("word", `%${vocabSearch.trim()}%`)
        .in("language", languages)
        .limit(12);

      if (error) throw error;

      setVocabSearchResults(data || []);
    } catch (error: any) {
      console.error("Vocabulary search failed:", error);
      setVocabStatus({ type: "error", message: error.message || "Search failed" });
    } finally {
      setVocabSearchLoading(false);
    }
  };

  const addVocabularyLink = async () => {
    if (!selectedVocabId) {
      setVocabStatus({ type: "error", message: "Select a vocabulary item first" });
      return;
    }

    const timestamp = newVocabTimestamp.trim() ? parseInt(newVocabTimestamp, 10) : null;
    if (newVocabTimestamp.trim() && Number.isNaN(timestamp)) {
      setVocabStatus({ type: "error", message: "Timestamp must be a number in seconds" });
      return;
    }

    setVocabStatus({ type: "idle" });
    try {
      const { data, error } = await supabase
        .from("video_vocabulary")
        .insert({
          video_id: video.id,
          vocabulary_id: selectedVocabId,
          timestamp_seconds: timestamp,
          context_text: newVocabContext.trim() || null
        })
        .select(
          `
            id,
            vocabulary_id,
            timestamp_seconds,
            context_text,
            centralized_vocabulary:centralized_vocabulary!inner (
              id,
              word,
              translation
            )
          `
        )
        .single();

      if (error) throw error;

      const central = Array.isArray(data.centralized_vocabulary)
        ? data.centralized_vocabulary[0]
        : data.centralized_vocabulary;

      const newItem: VocabularyLink = {
        id: data.id,
        vocabulary_id: data.vocabulary_id,
        word: central?.word ?? "",
        translation: central?.translation ?? "",
        timestamp_seconds: data.timestamp_seconds,
        context_text: data.context_text
      };

      setVocabItems(prev => {
        const updated = [...prev, newItem].sort((a, b) => (a.timestamp_seconds ?? 0) - (b.timestamp_seconds ?? 0));
        void updateVocabularyCount(updated.length);
        return updated;
      });
      setSelectedVocabId(null);
      setNewVocabTimestamp("");
      setNewVocabContext("");
      setVocabSearch("");
      setVocabSearchResults([]);
      setVocabStatus({ type: "success", message: "Vocabulary link added" });

      onContentUpdated?.();
    } catch (error: any) {
      console.error("Error adding vocabulary link:", error);
      setVocabStatus({ type: "error", message: error.message || "Failed to add vocabulary" });
    }
  };

  const removeVocabularyLink = async (id: string) => {
    try {
      const { error } = await supabase.from("video_vocabulary").delete().eq("id", id);
      if (error) throw error;

      setVocabItems(prev => {
        const updated = prev.filter(item => item.id !== id);
        void updateVocabularyCount(updated.length);
        return updated;
      });
      setVocabStatus({ type: "success", message: "Vocabulary removed" });
      onContentUpdated?.();
    } catch (error: any) {
      console.error("Error removing vocabulary:", error);
      setVocabStatus({ type: "error", message: error.message || "Failed to remove vocabulary" });
    }
  };

  const updateVocabularyCount = async (count: number) => {
    try {
      const { error } = await supabase
        .from("youtube_videos")
        .update({ vocabulary_count: count, updated_at: new Date().toISOString() })
        .eq("id", video.id);

      if (error) throw error;
    } catch (error) {
      console.error("Failed updating vocabulary count", error);
    }
  };

  const saveTranscript = async () => {
    setTranscriptSaving(true);
    setTranscriptStatus({ type: "idle" });

    try {
      const { error } = await supabase
        .from("youtube_videos")
        .update({
          transcript: transcript.trim() || null,
          transcript_translation: transcriptTranslation.trim() || null,
          updated_at: new Date().toISOString()
        })
        .eq("id", video.id);

      if (error) throw error;

      setTranscriptStatus({ type: "success", message: "Transcript saved" });
      onContentUpdated?.();
    } catch (error: any) {
      console.error("Error saving transcript:", error);
      setTranscriptStatus({ type: "error", message: error.message || "Failed to save transcript" });
    } finally {
      setTranscriptSaving(false);
    }
  };

  const loadQuizQuestions = async () => {
    setQuizLoading(true);
    setQuizStatus({ type: "idle" });
    try {
      const { data, error } = await supabase
        .from("video_quiz_questions")
        .select("id, question_text, options, correct_answer, explanation, difficulty_level, timestamp_seconds, question_type, points, order_index")
        .eq("video_id", video.id)
        .eq("is_active", true)
        .order("order_index", { ascending: true });

      if (error) throw error;

      const formatted = (data || []).map((item: any) => ({
        ...item,
        options: Array.isArray(item.options) ? item.options : (() => {
          try {
            return JSON.parse(item.options);
          } catch (e) {
            return [];
          }
        })()
      }));

      setQuizQuestions(formatted);
    } catch (error: any) {
      console.error("Error loading quiz questions:", error);
      setQuizStatus({ type: "error", message: error.message || "Failed to load quiz questions" });
    } finally {
      setQuizLoading(false);
    }
  };

  const addQuizQuestion = async () => {
    if (!newQuestion.question.trim()) {
      setQuizStatus({ type: "error", message: "Question text is required" });
      return;
    }

    const options = [newQuestion.optionA, newQuestion.optionB, newQuestion.optionC, newQuestion.optionD]
      .map(opt => opt.trim())
      .filter(Boolean);

    if (options.length < 2) {
      setQuizStatus({ type: "error", message: "Provide at least two answer options" });
      return;
    }

    const correctIndex = ["A", "B", "C", "D"].indexOf(newQuestion.correctOption);
    if (correctIndex === -1 || !options[correctIndex]) {
      setQuizStatus({ type: "error", message: "Select a valid correct answer" });
      return;
    }

    const timestamp = newQuestion.timestamp.trim() ? parseInt(newQuestion.timestamp, 10) : null;
    if (newQuestion.timestamp.trim() && Number.isNaN(timestamp)) {
      setQuizStatus({ type: "error", message: "Timestamp must be a number" });
      return;
    }

    const points = newQuestion.points.trim() ? parseInt(newQuestion.points, 10) : 1;
    if (Number.isNaN(points)) {
      setQuizStatus({ type: "error", message: "Points must be numeric" });
      return;
    }

    setQuizSaving(true);
    setQuizStatus({ type: "idle" });

    try {
      const { data, error } = await supabase
        .from("video_quiz_questions")
        .insert({
          video_id: video.id,
          question_text: newQuestion.question.trim(),
          options,
          correct_answer: options[correctIndex],
          explanation: newQuestion.explanation.trim() || null,
          difficulty_level: newQuestion.difficulty,
          timestamp_seconds: timestamp,
          question_type: newQuestion.questionType,
          points,
          order_index: quizQuestions.length + 1,
          is_active: true
        })
        .select("id, question_text, options, correct_answer, explanation, difficulty_level, timestamp_seconds, question_type, points, order_index")
        .single();

      if (error) throw error;

      const formatted: QuizQuestion = {
        ...data,
        options: Array.isArray(data.options) ? data.options : (() => {
          try {
            return JSON.parse(data.options);
          } catch {
            return [];
          }
        })()
      };

      setQuizQuestions(prev => [...prev, formatted]);
      setQuizStatus({ type: "success", message: "Quiz question added" });
      onContentUpdated?.();

      setNewQuestion({
        question: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        correctOption: "A",
        explanation: "",
        difficulty: newQuestion.difficulty,
        timestamp: "",
        points: newQuestion.points,
        questionType: newQuestion.questionType
      });
    } catch (error: any) {
      console.error("Error adding quiz question:", error);
      setQuizStatus({ type: "error", message: error.message || "Failed to add quiz question" });
    } finally {
      setQuizSaving(false);
    }
  };

  const removeQuizQuestion = async (id: string) => {
    try {
      const { error } = await supabase
        .from("video_quiz_questions")
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;

      setQuizQuestions(prev => prev.filter(q => q.id !== id));
      setQuizStatus({ type: "success", message: "Question archived" });
      onContentUpdated?.();
    } catch (error: any) {
      console.error("Failed to remove quiz question:", error);
      setQuizStatus({ type: "error", message: error.message || "Unable to remove question" });
    }
  };

  const importQuizQuestionsFromJson = async () => {
    if (!jsonImportText.trim()) {
      setJsonImportStatus({ type: "error", message: "Please provide JSON data" });
      return;
    }

    setJsonImportLoading(true);
    setJsonImportStatus({ type: "idle" });

    try {
      const questions = JSON.parse(jsonImportText);

      if (!Array.isArray(questions)) {
        throw new Error("JSON must be an array of questions");
      }

      const validQuestions = [];
      const errors = [];

      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        const questionNumber = i + 1;

        // Validate required fields
        if (!q.question_text && !q.question) {
          errors.push(`Question ${questionNumber}: Missing question text`);
          continue;
        }

        if (!q.question_type && !q.type) {
          errors.push(`Question ${questionNumber}: Missing question type`);
          continue;
        }

        const questionType = q.question_type || q.type;
        const validTypes = ['multiple_choice', 'true_false', 'fill_blank', 'vocabulary_match'];
        if (!validTypes.includes(questionType)) {
          errors.push(`Question ${questionNumber}: Invalid question type "${questionType}". Must be one of: ${validTypes.join(', ')}`);
          continue;
        }

        // Handle different question types
        let options = [];
        let correctAnswer = q.correct_answer || q.correctAnswer || q.answer;

        if (questionType === 'multiple_choice') {
          if (q.options && Array.isArray(q.options)) {
            options = q.options;
          } else if (q.optionA || q.optionB || q.optionC || q.optionD) {
            options = [q.optionA, q.optionB, q.optionC, q.optionD].filter(Boolean);
          } else {
            errors.push(`Question ${questionNumber}: Multiple choice questions need options array or optionA-D fields`);
            continue;
          }

          if (options.length < 2) {
            errors.push(`Question ${questionNumber}: Multiple choice questions need at least 2 options`);
            continue;
          }

          // If correct answer is an index, convert to the actual option
          if (typeof correctAnswer === 'number' && correctAnswer >= 0 && correctAnswer < options.length) {
            correctAnswer = options[correctAnswer];
          } else if (typeof correctAnswer === 'string' && ['A', 'B', 'C', 'D'].includes(correctAnswer.toUpperCase())) {
            const index = ['A', 'B', 'C', 'D'].indexOf(correctAnswer.toUpperCase());
            if (index < options.length) {
              correctAnswer = options[index];
            }
          }

          if (!options.includes(correctAnswer)) {
            errors.push(`Question ${questionNumber}: Correct answer "${correctAnswer}" not found in options`);
            continue;
          }

        } else if (questionType === 'true_false') {
          options = ['True', 'False'];
          if (typeof correctAnswer === 'boolean') {
            correctAnswer = correctAnswer ? 'True' : 'False';
          } else if (typeof correctAnswer === 'string') {
            correctAnswer = correctAnswer.toLowerCase() === 'true' ? 'True' : 'False';
          } else {
            correctAnswer = 'True'; // default
          }

        } else if (questionType === 'fill_blank') {
          options = [correctAnswer]; // For fill in blank, the correct answer is the only option

        } else if (questionType === 'vocabulary_match') {
          if (!q.options && !q.pairs) {
            errors.push(`Question ${questionNumber}: Vocabulary match questions need options or pairs array`);
            continue;
          }
          options = q.options || q.pairs;
          if (!Array.isArray(options) || options.length < 2) {
            errors.push(`Question ${questionNumber}: Vocabulary match needs at least 2 pairs`);
            continue;
          }
        }

        validQuestions.push({
          video_id: video.id,
          question_text: q.question_text || q.question,
          options,
          correct_answer: correctAnswer,
          explanation: q.explanation || null,
          difficulty_level: q.difficulty_level || q.difficulty || 'beginner',
          timestamp_seconds: q.timestamp_seconds || q.timestamp || null,
          question_type: questionType,
          points: q.points || 1,
          order_index: quizQuestions.length + validQuestions.length + 1,
          is_active: true
        });
      }

      if (errors.length > 0) {
        setJsonImportStatus({ type: "error", message: `Validation errors:\n${errors.join('\n')}` });
        return;
      }

      if (validQuestions.length === 0) {
        setJsonImportStatus({ type: "error", message: "No valid questions found in JSON" });
        return;
      }

      const { data, error } = await supabase
        .from("video_quiz_questions")
        .insert(validQuestions)
        .select("id, question_text, options, correct_answer, explanation, difficulty_level, timestamp_seconds, question_type, points, order_index");

      if (error) throw error;

      const formatted = (data || []).map((item: any) => ({
        ...item,
        options: Array.isArray(item.options) ? item.options : (() => {
          try {
            return JSON.parse(item.options);
          } catch {
            return [];
          }
        })()
      }));

      setQuizQuestions(prev => [...prev, ...formatted]);
      setJsonImportStatus({ type: "success", message: `Successfully imported ${validQuestions.length} question(s)` });
      setJsonImportText("");
      onContentUpdated?.();

    } catch (error: any) {
      console.error("Error importing quiz questions:", error);
      if (error instanceof SyntaxError) {
        setJsonImportStatus({ type: "error", message: "Invalid JSON format. Please check your JSON syntax." });
      } else {
        setJsonImportStatus({ type: "error", message: error.message || "Failed to import questions" });
      }
    } finally {
      setJsonImportLoading(false);
    }
  };

  const loadGrammarNotes = async () => {
    setGrammarLoading(true);
    setGrammarStatus({ type: "idle" });
    try {
      const { data, error } = await supabase
        .from("video_grammar_notes")
        .select("id, title, content, example, section_order")
        .eq("video_id", video.id)
        .order("section_order", { ascending: true });

      if (error) throw error;

      setGrammarNotes(data || []);
    } catch (error: any) {
      console.error("Error loading grammar notes:", error);
      setGrammarStatus({ type: "error", message: error.message || "Failed to load grammar notes" });
    } finally {
      setGrammarLoading(false);
    }
  };

  const addGrammarNote = async () => {
    if (!newGrammarNote.title.trim() || !newGrammarNote.content.trim()) {
      setGrammarStatus({ type: "error", message: "Title and content are required" });
      return;
    }

    const sectionOrder = parseInt(newGrammarNote.sectionOrder, 10) || grammarNotes.length + 1;

    setGrammarSaving(true);
    setGrammarStatus({ type: "idle" });

    try {
      const { data, error } = await supabase
        .from("video_grammar_notes")
        .insert({
          video_id: video.id,
          title: newGrammarNote.title.trim(),
          content: newGrammarNote.content.trim(),
          example: newGrammarNote.example.trim() || null,
          section_order: sectionOrder
        })
        .select("id, title, content, example, section_order")
        .single();

      if (error) throw error;

      setGrammarNotes(prev => [...prev, data].sort((a, b) => a.section_order - b.section_order));
      setGrammarStatus({ type: "success", message: "Grammar note added" });
      setNewGrammarNote({ title: "", content: "", example: "", sectionOrder: String(sectionOrder + 1) });
      onContentUpdated?.();
    } catch (error: any) {
      console.error("Failed to add grammar note:", error);
      setGrammarStatus({ type: "error", message: error.message || "Unable to add grammar note" });
    } finally {
      setGrammarSaving(false);
    }
  };

  const removeGrammarNote = async (id: string) => {
    try {
      const { error } = await supabase.from("video_grammar_notes").delete().eq("id", id);
      if (error) throw error;

      setGrammarNotes(prev => prev.filter(note => note.id !== id));
      setGrammarStatus({ type: "success", message: "Grammar note deleted" });
      onContentUpdated?.();
    } catch (error: any) {
      console.error("Error removing grammar note:", error);
      setGrammarStatus({ type: "error", message: error.message || "Failed to remove note" });
    }
  };

  const renderStatus = (state: StatusState) => {
    if (state.type === "idle") return null;

    const Icon = state.type === "success" ? CheckCircle : AlertCircle;
    const color = state.type === "success" ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50";

    return (
      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${color}`}>
        <Icon className="w-4 h-4" />
        <span className="text-sm font-medium">{state.message}</span>
      </div>
    );
  };

  const emptyState = (icon: React.ReactNode, title: string, description: string, cta?: React.ReactNode) => (
    <Card className="border-dashed">
      <CardContent className="py-12">
        <div className="flex flex-col items-center text-center gap-3 max-w-md mx-auto">
          {icon}
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <p className="text-gray-500 text-sm">{description}</p>
          {cta}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900 mb-1">Manage "{video.title ?? "Selected Video"}"</h2>
        <p className="text-sm text-slate-600">Add transcript, vocabulary, quiz questions, and grammar notes to enrich this video experience.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 gap-2 bg-white p-1 border rounded-xl shadow-sm">
          <TabsTrigger value="transcript" className="gap-2">
            <FileText className="w-4 h-4" /> Transcript
          </TabsTrigger>
          <TabsTrigger value="vocabulary" className="gap-2">
            <BookOpen className="w-4 h-4" /> Vocabulary
          </TabsTrigger>
          <TabsTrigger value="quiz" className="gap-2">
            <Play className="w-4 h-4" /> Quiz
          </TabsTrigger>
          <TabsTrigger value="grammar" className="gap-2">
            <Lightbulb className="w-4 h-4" /> Grammar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="transcript" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="w-5 h-5 text-blue-600" />
                Transcript Editor
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="transcript">Transcript / Lyrics</Label>
                  <Textarea
                    id="transcript"
                    rows={10}
                    value={transcript}
                    onChange={event => setTranscript(event.target.value)}
                    placeholder="Paste the transcript or lyrics here..."
                  />
                  <p className="text-xs text-gray-500">Supports multi-line text. Leave empty to clear the transcript.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="transcript-translation">English Translation</Label>
                  <Textarea
                    id="transcript-translation"
                    rows={10}
                    value={transcriptTranslation}
                    onChange={event => setTranscriptTranslation(event.target.value)}
                    placeholder="Provide an English translation for the transcript (optional)..."
                  />
                  <p className="text-xs text-gray-500">Translation appears in the student Transcript tab when available.</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                {renderStatus(transcriptStatus)}
                <Button onClick={saveTranscript} disabled={transcriptSaving} className="min-w-[140px]">
                  {transcriptSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Save Transcript
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vocabulary" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <BookOpen className="w-5 h-5 text-purple-600" />
                Linked Vocabulary
                <Badge variant="secondary" className="ml-2">
                  {vocabItems.length} words
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-3">
                <Label className="text-sm font-medium">Find vocabulary to link</Label>
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <Input
                      value={vocabSearch}
                      onChange={event => setVocabSearch(event.target.value)}
                      placeholder="Search centralized vocabulary by word"
                      className="pl-9"
                    />
                  </div>
                  <Button onClick={performVocabularySearch} disabled={vocabSearchLoading} variant="outline">
                    {vocabSearchLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
                  </Button>
                </div>

                {vocabSearchResults.length > 0 && (
                  <div className="border rounded-lg divide-y">
                    {vocabSearchResults.map(result => {
                      const isSelected = selectedVocabId === result.id;
                      return (
                        <div key={result.id} className="flex items-center justify-between px-4 py-3 bg-white">
                          <div>
                            <p className="font-medium text-gray-800">{result.word}</p>
                            <p className="text-sm text-gray-500">{result.translation}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="text-xs">{result.language}</Badge>
                            <Checkbox checked={isSelected} onCheckedChange={() => setSelectedVocabId(isSelected ? null : result.id)} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timestamp">Timestamp (seconds)</Label>
                  <Input
                    id="timestamp"
                    value={newVocabTimestamp}
                    onChange={event => setNewVocabTimestamp(event.target.value)}
                    placeholder="e.g., 42"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="context">Context / Lyrics snippet</Label>
                  <Input
                    id="context"
                    value={newVocabContext}
                    onChange={event => setNewVocabContext(event.target.value)}
                    placeholder="Optional context to display with the word"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                {renderStatus(vocabStatus)}
                <Button onClick={addVocabularyLink} disabled={!selectedVocabId}>
                  <Plus className="w-4 h-4 mr-2" />
                  Link Vocabulary
                </Button>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-700">Linked words ({vocabItems.length})</h4>
                {vocabLoading ? (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Loader2 className="w-4 h-4 animate-spin" /> Loading vocabulary...
                  </div>
                ) : vocabItems.length === 0 ? (
                  emptyState(
                    <BookOpen className="w-10 h-10 text-purple-400" />,
                    "No vocabulary linked yet",
                    "Add centralized vocabulary words so students can study them alongside the video."
                  )
                ) : (
                  <div className="border rounded-lg overflow-hidden">
                    <div className="grid grid-cols-12 bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-500">
                      <div className="col-span-4">Word</div>
                      <div className="col-span-4">Translation</div>
                      <div className="col-span-2">Timestamp</div>
                      <div className="col-span-1">Context</div>
                      <div className="col-span-1 text-right">Actions</div>
                    </div>
                    <div className="divide-y">
                      {vocabItems.map(item => (
                        <div key={item.id} className="grid grid-cols-12 px-4 py-2 items-center">
                          <div className="col-span-4 font-medium text-gray-800 truncate">{item.word}</div>
                          <div className="col-span-4 text-sm text-gray-600 truncate">{item.translation}</div>
                          <div className="col-span-2 text-sm text-gray-500">
                            {item.timestamp_seconds != null ? `${item.timestamp_seconds}s` : "—"}
                          </div>
                          <div className="col-span-1 text-xs text-gray-500 truncate">
                            {item.context_text ?? "—"}
                          </div>
                          <div className="col-span-1 flex justify-end">
                            <Button variant="ghost" size="icon" onClick={() => removeVocabularyLink(item.id)}>
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quiz" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Play className="w-5 h-5 text-indigo-600" />
                Quiz Questions
                <Badge variant="secondary" className="ml-2">{quizQuestions.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* JSON Import Section */}
              <div className="space-y-3 border-b pb-6">
                <Label className="text-sm font-medium">Import Questions from JSON</Label>
                <p className="text-xs text-gray-600">
                  Paste JSON array of questions to bulk import. Supports multiple_choice, true_false, fill_blank, and vocabulary_match types.
                </p>
                <Textarea
                  rows={8}
                  value={jsonImportText}
                  onChange={event => setJsonImportText(event.target.value)}
                  placeholder={`Example:
[
  {
    "question": "What is the capital of France?",
    "question_type": "multiple_choice",
    "options": ["London", "Paris", "Berlin", "Madrid"],
    "correct_answer": "Paris",
    "explanation": "Paris is the capital and largest city of France.",
    "difficulty_level": "beginner",
    "points": 1
  },
  {
    "question": "The sky is blue.",
    "question_type": "true_false",
    "correct_answer": true,
    "explanation": "The sky appears blue due to Rayleigh scattering.",
    "difficulty_level": "intermediate"
  }
]`}
                />
                <div className="flex items-center justify-between">
                  {renderStatus(jsonImportStatus)}
                  <Button onClick={importQuizQuestionsFromJson} disabled={jsonImportLoading}>
                    {jsonImportLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Importing...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Import Questions
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium">Create a new question</Label>
                <div className="space-y-3">
                  <Textarea
                    rows={3}
                    value={newQuestion.question}
                    onChange={event => setNewQuestion(prev => ({ ...prev, question: event.target.value }))}
                    placeholder="Enter the question prompt"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                      value={newQuestion.optionA}
                      onChange={event => setNewQuestion(prev => ({ ...prev, optionA: event.target.value }))}
                      placeholder="Option A"
                    />
                    <Input
                      value={newQuestion.optionB}
                      onChange={event => setNewQuestion(prev => ({ ...prev, optionB: event.target.value }))}
                      placeholder="Option B"
                    />
                    <Input
                      value={newQuestion.optionC}
                      onChange={event => setNewQuestion(prev => ({ ...prev, optionC: event.target.value }))}
                      placeholder="Option C (optional)"
                    />
                    <Input
                      value={newQuestion.optionD}
                      onChange={event => setNewQuestion(prev => ({ ...prev, optionD: event.target.value }))}
                      placeholder="Option D (optional)"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Correct answer</Label>
                      <Select
                        value={newQuestion.correctOption}
                        onValueChange={value => setNewQuestion(prev => ({ ...prev, correctOption: value as "A" | "B" | "C" | "D" }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A">Option A</SelectItem>
                          <SelectItem value="B">Option B</SelectItem>
                          <SelectItem value="C">Option C</SelectItem>
                          <SelectItem value="D">Option D</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Difficulty</Label>
                      <Select
                        value={newQuestion.difficulty}
                        onValueChange={value => setNewQuestion(prev => ({ ...prev, difficulty: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <Label>Timestamp (seconds)</Label>
                      <Input
                        value={newQuestion.timestamp}
                        onChange={event => setNewQuestion(prev => ({ ...prev, timestamp: event.target.value }))}
                        placeholder="Optional"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Points</Label>
                      <Input
                        value={newQuestion.points}
                        onChange={event => setNewQuestion(prev => ({ ...prev, points: event.target.value }))}
                        placeholder="1"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Question type</Label>
                      <Select
                        value={newQuestion.questionType}
                        onValueChange={value => setNewQuestion(prev => ({ ...prev, questionType: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                          <SelectItem value="true_false">True / False</SelectItem>
                          <SelectItem value="fill_blank">Fill in the Blank</SelectItem>
                          <SelectItem value="vocabulary_match">Vocabulary Match</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Textarea
                    rows={3}
                    value={newQuestion.explanation}
                    onChange={event => setNewQuestion(prev => ({ ...prev, explanation: event.target.value }))}
                    placeholder="Explanation shown after students answer (optional)"
                  />

                  <div className="flex items-center justify-between">
                    {renderStatus(quizStatus)}
                    <Button onClick={addQuizQuestion} disabled={quizSaving}>
                      {quizSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Question
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-700">Existing questions</h4>
                {quizLoading ? (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Loader2 className="w-4 h-4 animate-spin" /> Loading quiz questions...
                  </div>
                ) : quizQuestions.length === 0 ? (
                  emptyState(
                    <ListPlus className="w-10 h-10 text-indigo-400" />,
                    "No quiz questions yet",
                    "Add comprehension questions to reinforce learning after the video."
                  )
                ) : (
                  <div className="space-y-3">
                    {quizQuestions.map((question, index) => (
                      <motion.div
                        key={question.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card className="border">
                          <CardContent className="p-4 space-y-3">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                  <Badge variant="outline">Question {index + 1}</Badge>
                                  <Badge variant="secondary">{question.difficulty_level}</Badge>
                                  {question.timestamp_seconds != null && (
                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {question.timestamp_seconds}s</span>
                                  )}
                                  <span className="flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" /> {question.points} pts
                                  </span>
                                </div>
                                <p className="font-medium text-gray-800 mt-1">{question.question_text}</p>
                              </div>
                              <Button variant="ghost" size="icon" onClick={() => removeQuizQuestion(question.id)}>
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>

                            <div className="grid md:grid-cols-2 gap-2">
                              {question.options.map(option => {
                                const isCorrect = option === question.correct_answer;
                                return (
                                  <div
                                    key={option}
                                    className={`px-3 py-2 rounded-lg text-sm border ${isCorrect ? "border-green-400 bg-green-50" : "border-gray-200"}`}
                                  >
                                    {option}
                                  </div>
                                );
                              })}
                            </div>

                            {question.explanation && (
                              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
                                <strong>Explanation:</strong> {question.explanation}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grammar" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                Grammar Notes
                <Badge variant="secondary" className="ml-2">{grammarNotes.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="grammar-title">Title</Label>
                  <Input
                    id="grammar-title"
                    value={newGrammarNote.title}
                    onChange={event => setNewGrammarNote(prev => ({ ...prev, title: event.target.value }))}
                    placeholder="e.g., Present tense of être"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grammar-order">Section order</Label>
                  <Input
                    id="grammar-order"
                    value={newGrammarNote.sectionOrder}
                    onChange={event => setNewGrammarNote(prev => ({ ...prev, sectionOrder: event.target.value }))}
                    placeholder="Display order"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="grammar-content">Explanation</Label>
                <Textarea
                  id="grammar-content"
                  rows={5}
                  value={newGrammarNote.content}
                  onChange={event => setNewGrammarNote(prev => ({ ...prev, content: event.target.value }))}
                  placeholder="Provide the grammar explanation students should read."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="grammar-example">Example sentence</Label>
                <Textarea
                  id="grammar-example"
                  rows={3}
                  value={newGrammarNote.example}
                  onChange={event => setNewGrammarNote(prev => ({ ...prev, example: event.target.value }))}
                  placeholder="Optional example to highlight the grammar point"
                />
              </div>

              <div className="flex items-center justify-between">
                {renderStatus(grammarStatus)}
                <Button onClick={addGrammarNote} disabled={grammarSaving}>
                  {grammarSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Grammar Note
                    </>
                  )}
                </Button>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-700">Existing notes</h4>
                {grammarLoading ? (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Loader2 className="w-4 h-4 animate-spin" /> Loading grammar notes...
                  </div>
                ) : grammarNotes.length === 0 ? (
                  emptyState(
                    <Lightbulb className="w-10 h-10 text-amber-300" />,
                    "No grammar notes yet",
                    "Add explanations to help students understand grammar highlighted in this video."
                  )
                ) : (
                  <div className="space-y-3">
                    {grammarNotes.map((note, index) => (
                      <motion.div
                        key={note.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card className="border">
                          <CardContent className="p-4 space-y-3">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                  <Badge variant="outline">#{note.section_order}</Badge>
                                </div>
                                <p className="font-semibold text-gray-800 mt-1">{note.title}</p>
                              </div>
                              <Button variant="ghost" size="icon" onClick={() => removeGrammarNote(note.id)}>
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>

                            <div className="text-sm text-gray-700 whitespace-pre-line">{note.content}</div>

                            {note.example && (
                              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
                                <strong>Example:</strong> {note.example}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
