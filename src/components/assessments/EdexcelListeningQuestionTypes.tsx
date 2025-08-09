'use client';

import React, { useState, useRef } from 'react';
import { CheckCircle, XCircle, Play, Pause, Volume2 } from 'lucide-react';

// Interface for Edexcel question components
interface EdexcelQuestionComponentProps {
  question: any;
  userAnswer: any;
  onAnswerChange: (answer: any) => void;
}

// Edexcel Multiple Choice Question
// Foundation: Q1, Q5, Q7, Q10 | Higher: Q1, Q4, Q8
export function EdexcelMultipleChoiceQuestion({ question, userAnswer, onAnswerChange }: EdexcelQuestionComponentProps) {
  const answers = userAnswer || {};

  const handleAnswerSelect = (questionId: string, letter: string) => {
    const newAnswers = { ...answers, [questionId]: letter };
    onAnswerChange(newAnswers);
  };

  // Handle missing or invalid data
  if (!question?.data?.questions) {
    return (
      <div className="text-center text-gray-500 p-8">
        <p>Question data is not available or invalid.</p>
        <details className="mt-4 text-left">
          <summary className="cursor-pointer text-blue-600">Debug Info</summary>
          <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
            {JSON.stringify({
              questionId: question.id,
              questionType: question.question_type,
              data: question.data,
              hasData: !!question.data,
              hasQuestions: !!(question.data && question.data.questions),
              dataKeys: question.data ? Object.keys(question.data) : 'no data'
            }, null, 2)}
          </pre>
        </details>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">Multiple Choice</h4>
        <p className="text-sm text-blue-800">
          Listen to the recording and complete the sentences by selecting the correct letter.
        </p>
      </div>

      {question.data?.questions?.map((q: any, index: number) => (
        <div key={q.id} className="border border-gray-200 rounded-lg p-4">
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-gray-900 mb-2">
              ({String.fromCharCode(97 + index)}) {q.question}
            </h4>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {q.options.map((option: any) => (
              <label
                key={option.letter}
                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                  answers[q.id] === option.letter
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name={q.id}
                  value={option.letter}
                  checked={answers[q.id] === option.letter}
                  onChange={() => handleAnswerSelect(q.id, option.letter)}
                  className="sr-only"
                />
                <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                  answers[q.id] === option.letter
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300'
                }`}>
                  {answers[q.id] === option.letter && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
                <span className="font-bold text-blue-600 mr-3 w-6">{option.letter}</span>
                <span className="text-gray-700">{option.text}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// Edexcel Multiple Response Question
// Foundation: Q2, Q4, Q9 | Higher: Q3, Q9(a)
export function EdexcelMultipleResponseQuestion({ question, userAnswer, onAnswerChange }: EdexcelQuestionComponentProps) {
  const selectedAnswers = userAnswer || [];

  const handleAnswerToggle = (letter: string) => {
    const newAnswers = selectedAnswers.includes(letter)
      ? selectedAnswers.filter((a: string) => a !== letter)
      : [...selectedAnswers, letter];
    onAnswerChange(newAnswers);
  };

  // Handle missing or invalid data
  if (!question?.data?.options) {
    return (
      <div className="text-center text-gray-500 p-8">
        <p>Question data is not available or invalid.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-semibold text-green-900 mb-2">Multiple Response</h4>
        <p className="text-sm text-green-800">
          Listen to the recording and put a cross in each one of the correct boxes. Select multiple answers.
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <h4 className="font-semibold text-gray-900 mb-3">{question.data?.prompt}</h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {question.data?.options?.map((option: any) => (
          <label
            key={option.letter}
            className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
              selectedAnswers.includes(option.letter)
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <input
              type="checkbox"
              checked={selectedAnswers.includes(option.letter)}
              onChange={() => handleAnswerToggle(option.letter)}
              className="sr-only"
            />
            <div className={`w-6 h-6 border-2 rounded mr-3 flex items-center justify-center ${
              selectedAnswers.includes(option.letter)
                ? 'border-green-500 bg-green-500'
                : 'border-gray-300'
            }`}>
              {selectedAnswers.includes(option.letter) && (
                <CheckCircle className="w-4 h-4 text-white" />
              )}
            </div>
            <span className="font-bold text-green-600 mr-3 w-6">{option.letter}</span>
            <span className="text-gray-700">{option.text}</span>
          </label>
        ))}
      </div>

      <div className="text-sm text-gray-600 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <strong>Note:</strong> Select all correct answers. You may select multiple options.
      </div>
    </div>
  );
}

// Edexcel Word Cloud Question
// Foundation: Q3, Q8 | Higher: Q2, Q6
export function EdexcelWordCloudQuestion({ question, userAnswer, onAnswerChange }: EdexcelQuestionComponentProps) {
  const answers = userAnswer || {};

  const handleAnswerChange = (questionId: string, value: string) => {
    const newAnswers = { ...answers, [questionId]: value };
    onAnswerChange(newAnswers);
  };

  // Handle missing or invalid data
  if (!question?.data?.questions || !question?.data?.wordCloud) {
    return (
      <div className="text-center text-gray-500 p-8">
        <p>Question data is not available or invalid.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h4 className="font-semibold text-purple-900 mb-2">Word Cloud</h4>
        <p className="text-sm text-purple-800">
          Complete the gap in each sentence using a word or phrase from the box below. 
          There are more words/phrases than gaps.
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <h4 className="font-semibold text-gray-900 mb-3">{question.data?.prompt}</h4>
      </div>

      {/* Word Cloud */}
      <div className="border-2 border-gray-300 rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-2 justify-center">
          {question.data?.wordCloud?.map((word: string, index: number) => (
            <span
              key={index}
              className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 font-medium"
            >
              {word}
            </span>
          ))}
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {question.data?.questions?.map((q: any, index: number) => (
          <div key={q.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <span className="font-bold text-purple-600">
                ({String.fromCharCode(97 + index)})
              </span>
              <div className="flex-1 flex items-center space-x-2">
                <span className="text-gray-700">{q.textBefore}</span>
                <input
                  type="text"
                  value={answers[q.id] || ''}
                  onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                  className="border-b-2 border-purple-300 bg-transparent px-2 py-1 min-w-[120px] focus:border-purple-500 focus:outline-none"
                  placeholder="Type answer..."
                />
                <span className="text-gray-700">{q.textAfter}</span>
                <span className="text-sm text-gray-500">({q.marks})</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Edexcel Open Response Question - Example A
// Foundation: Q6, Q11(b) | Higher: Q5, Q7
export function EdexcelOpenResponseAQuestion({ question, userAnswer, onAnswerChange }: EdexcelQuestionComponentProps) {
  const answers = userAnswer || {};

  const handleAnswerChange = (questionId: string, value: string) => {
    const newAnswers = { ...answers, [questionId]: value };
    onAnswerChange(newAnswers);
  };

  return (
    <div className="space-y-6">
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <h4 className="font-semibold text-orange-900 mb-2">Open Response - Example A</h4>
        <p className="text-sm text-orange-800">
          Listen to the recording and complete the gaps. Write your answers in English. 
          Complete sentences are not required.
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <h4 className="font-semibold text-gray-900 mb-3">{question.data?.prompt}</h4>
        <p className="text-sm text-gray-600 mb-2">Topic: {question.data?.topic}</p>
      </div>

      <div className="space-y-4">
        {question.data?.speakers?.map((speaker: any) => (
          <div key={speaker.id} className="border border-gray-200 rounded-lg p-4">
            <h5 className="font-semibold text-gray-900 mb-3">{speaker.name}:</h5>
            <div className="space-y-2">
              {speaker.gaps.map((gap: any, index: number) => (
                <div key={gap.id} className="flex items-center space-x-2">
                  <span className="text-gray-700 min-w-[100px]">{gap.label}:</span>
                  <input
                    type="text"
                    value={answers[gap.id] || ''}
                    onChange={(e) => handleAnswerChange(gap.id, e.target.value)}
                    className="flex-1 border border-gray-300 rounded px-3 py-2 focus:border-orange-500 focus:outline-none"
                    placeholder="Write your answer in English..."
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Edexcel Open Response B Question (Table format with likes/dislikes)
// Higher: Q7
export function EdexcelOpenResponseBQuestion({ question, userAnswer, onAnswerChange }: EdexcelQuestionComponentProps) {
  const answers = userAnswer || {};

  const handleAnswerChange = (fieldId: string, value: string) => {
    const newAnswers = { ...answers, [fieldId]: value };
    onAnswerChange(newAnswers);
  };

  // Handle missing or invalid data
  if (!question?.data?.speakers) {
    return (
      <div className="text-center text-gray-500 p-8">
        <p>Question data is not available or invalid.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h4 className="font-semibold text-purple-900 mb-2">Open Response - Example B</h4>
        <p className="text-sm text-purple-800">
          Listen to the recording and complete the following tables in English.
          You do not need to write in full sentences.
        </p>
      </div>

      <div className="space-y-6">
        {question.data?.speakers?.map((speaker: any, speakerIndex: number) => (
          <div key={speaker.id} className="border border-gray-200 rounded-lg p-4">
            <h5 className="font-semibold text-gray-900 mb-4">
              ({String.fromCharCode(97 + speakerIndex)}) {speaker.name}
            </h5>

            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <table className="w-full">
                <tbody>
                  <tr className="border-b border-gray-300">
                    <td className="w-32 p-4 bg-gray-50 font-medium text-gray-900 border-r border-gray-300">
                      Advantage
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-between">
                        <input
                          type="text"
                          value={answers[speaker.likes?.id] || ''}
                          onChange={(e) => handleAnswerChange(speaker.likes?.id, e.target.value)}
                          className="flex-1 border-0 border-b border-dotted border-gray-400 bg-transparent focus:border-purple-500 focus:outline-none px-2 py-1"
                          placeholder="Write your answer..."
                        />
                        <span className="ml-2 text-sm text-gray-500">(1)</span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="w-32 p-4 bg-gray-50 font-medium text-gray-900 border-r border-gray-300">
                      Disadvantage
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-between">
                        <input
                          type="text"
                          value={answers[speaker.dislikes?.id] || ''}
                          onChange={(e) => handleAnswerChange(speaker.dislikes?.id, e.target.value)}
                          className="flex-1 border-0 border-b border-dotted border-gray-400 bg-transparent focus:border-purple-500 focus:outline-none px-2 py-1"
                          placeholder="Write your answer..."
                        />
                        <span className="ml-2 text-sm text-gray-500">(1)</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      <div className="text-right text-sm text-gray-600 font-medium">
        (Total for Question {question.question_number} = {question.marks} marks)
      </div>
    </div>
  );
}

// Edexcel Open Response Question - Example C
// Foundation: Q11(a) | Higher: Q9(b)
export function EdexcelOpenResponseCQuestion({ question, userAnswer, onAnswerChange }: EdexcelQuestionComponentProps) {
  const answers = userAnswer || {};

  const handleAnswerChange = (questionId: string, value: string) => {
    const newAnswers = { ...answers, [questionId]: value };
    onAnswerChange(newAnswers);
  };

  return (
    <div className="space-y-6">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h4 className="font-semibold text-red-900 mb-2">Open Response - Example C</h4>
        <p className="text-sm text-red-800">
          Listen to the report and answer the questions in English. 
          Complete sentences are not required.
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <h4 className="font-semibold text-gray-900 mb-3">You hear a report on {question.data?.topic}.</h4>
      </div>

      <div className="space-y-4">
        {question.data?.questions?.map((q: any, index: number) => (
          <div key={q.id} className="border border-gray-200 rounded-lg p-4">
            <div className="mb-3">
              <span className="font-bold text-red-600">
                ({String.fromCharCode(105 + index)}) {q.question}
              </span>
            </div>
            <textarea
              value={answers[q.id] || ''}
              onChange={(e) => handleAnswerChange(q.id, e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:border-red-500 focus:outline-none resize-none"
              rows={3}
              placeholder="Write your answer in English..."
            />
            <div className="text-xs text-gray-500 mt-1">
              {q.marks} mark{q.marks !== 1 ? 's' : ''}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Edexcel Multi-Part Question (combines different question types)
// Foundation: Q11 (Open Response C + Open Response B)
export function EdexcelMultiPartQuestion({ question, userAnswer, onAnswerChange }: EdexcelQuestionComponentProps) {
  const answers = userAnswer || {};

  const handleAnswerChange = (fieldId: string, value: string) => {
    const newAnswers = { ...answers, [fieldId]: value };
    onAnswerChange(newAnswers);
  };

  // Handle missing or invalid data
  if (!question?.data?.parts) {
    return (
      <div className="text-center text-gray-500 p-8">
        <p>Question data is not available or invalid.</p>
      </div>
    );
  }

  const renderPart = (part: any) => {
    if (part.type === 'multiple-choice') {
      return (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">{part.title}</h4>
            <p className="text-sm text-blue-800">{part.instructions}</p>
          </div>

          <div className="space-y-4">
            {part.questions?.map((q: any, index: number) => (
              <div key={q.id} className="border border-gray-200 rounded-lg p-4">
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">{q.question}</h4>
                </div>

                <div className="space-y-2">
                  {q.options?.map((option: any) => (
                    <label key={option.letter} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name={q.id}
                        value={option.letter}
                        checked={answers[q.id] === option.letter}
                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="font-medium text-blue-600">{option.letter}</span>
                      <span className="text-gray-700">{option.text}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    } else if (part.type === 'open-response-c') {
      return (
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-semibold text-red-900 mb-2">{part.title}</h4>
            <p className="text-sm text-red-800">{part.instructions}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-gray-900 mb-3">You hear a report on {part.topic}.</h4>
          </div>

          <div className="space-y-4">
            {part.questions?.map((q: any, index: number) => (
              <div key={q.id} className="border border-gray-200 rounded-lg p-4">
                <div className="mb-3">
                  <span className="font-bold text-red-600">{q.question}</span>
                </div>
                <textarea
                  value={answers[q.id] || ''}
                  onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:border-red-500 focus:outline-none resize-none"
                  rows={2}
                  placeholder="Write your answer in English..."
                />
              </div>
            ))}
          </div>
        </div>
      );
    } else if (part.type === 'open-response-b') {
      return (
        <div className="space-y-4">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="font-semibold text-purple-900 mb-2">{part.title}</h4>
            <p className="text-sm text-purple-800">{part.instructions}</p>
          </div>

          <div className="space-y-6">
            {part.speakers?.map((speaker: any, speakerIndex: number) => (
              <div key={speaker.id} className="border border-gray-200 rounded-lg p-4">
                <h5 className="font-semibold text-gray-900 mb-4">
                  ({String.fromCharCode(97 + speakerIndex)}) {speaker.name}
                </h5>

                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <tbody>
                      <tr className="border-b border-gray-300">
                        <td className="w-32 p-4 bg-gray-50 font-medium text-gray-900 border-r border-gray-300">
                          Advantage
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-between">
                            <input
                              type="text"
                              value={answers[speaker.likes?.id] || ''}
                              onChange={(e) => handleAnswerChange(speaker.likes?.id, e.target.value)}
                              className="flex-1 border-0 border-b border-dotted border-gray-400 bg-transparent focus:border-purple-500 focus:outline-none px-2 py-1"
                              placeholder="Write your answer..."
                            />
                            <span className="ml-2 text-sm text-gray-500">({speaker.likes?.marks})</span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="w-32 p-4 bg-gray-50 font-medium text-gray-900 border-r border-gray-300">
                          Disadvantage
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-between">
                            <input
                              type="text"
                              value={answers[speaker.dislikes?.id] || ''}
                              onChange={(e) => handleAnswerChange(speaker.dislikes?.id, e.target.value)}
                              className="flex-1 border-0 border-b border-dotted border-gray-400 bg-transparent focus:border-purple-500 focus:outline-none px-2 py-1"
                              placeholder="Write your answer..."
                            />
                            <span className="ml-2 text-sm text-gray-500">({speaker.dislikes?.marks})</span>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {question.data?.parts?.map((part: any, index: number) => (
        <div key={part.id} className="border-2 border-gray-300 rounded-lg p-6">
          {renderPart(part)}
        </div>
      ))}

      <div className="text-right text-sm text-gray-600 font-medium">
        (Total for Question {question.question_number} = {question.marks} marks)
      </div>
    </div>
  );
}

// Edexcel Dictation Question
// Foundation: Q12 (6 sentences) | Higher: Q10 (6 sentences)
export function EdexcelDictationQuestion({ question, userAnswer, onAnswerChange }: EdexcelQuestionComponentProps) {
  const answers = userAnswer || {};
  const [currentSentence, setCurrentSentence] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleAnswerChange = (sentenceId: string, value: string) => {
    const newAnswers = { ...answers, [sentenceId]: value };
    onAnswerChange(newAnswers);
  };

  const playAudio = (audioUrl: string) => {
    if (audioRef.current) {
      // Stop any currently playing audio
      audioRef.current.pause();
      audioRef.current.currentTime = 0;

      // Set new source and play
      audioRef.current.src = audioUrl;
      audioRef.current.play().catch(error => {
        console.error('Error playing dictation audio:', error);
        setIsPlaying(false);
      });
      setIsPlaying(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hidden audio element for dictation playback */}
      <audio
        ref={audioRef}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />

      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
        <h4 className="font-semibold text-indigo-900 mb-2">Section B: Dictation</h4>
        <p className="text-sm text-indigo-800 mb-2">
          <strong>10 marks</strong> • Listen to each sentence and fill in the missing words.
        </p>
        <p className="text-sm text-indigo-800">
          <strong>Instructions:</strong> {question.data?.instructions}
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-2">Subject: {question.data?.subject}</h4>
        <p className="text-sm text-gray-600">{question.data?.introduction}</p>
      </div>

      <div className="space-y-4">
        {question.data?.sentences?.map((sentence: any, index: number) => (
          <div key={sentence.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h5 className="font-semibold text-gray-900">
                Sentence {index + 1} ({sentence.marks} mark{sentence.marks !== 1 ? 's' : ''})
              </h5>
              <button
                onClick={() => playAudio(sentence.audioUrl)}
                disabled={isPlaying}
                className="flex items-center px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600 disabled:opacity-50"
              >
                {isPlaying ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
                Play
              </button>
            </div>

            <div className="space-y-2">
              {sentence.gaps.map((gap: any, gapIndex: number) => (
                <div key={gap.id} className="flex items-center space-x-2">
                  <span className="text-gray-700">{gap.textBefore}</span>
                  <input
                    type="text"
                    value={answers[gap.id] || ''}
                    onChange={(e) => handleAnswerChange(gap.id, e.target.value)}
                    className="border-b-2 border-indigo-300 bg-transparent px-2 py-1 min-w-[100px] focus:border-indigo-500 focus:outline-none"
                    placeholder="..."
                  />
                  <span className="text-gray-700">{gap.textAfter}</span>
                </div>
              ))}
            </div>

            <div className="text-xs text-gray-500 mt-2">
              {sentence.description}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> Each transcript is heard 3 times. Listen carefully and fill in all gaps.
        </p>
      </div>
    </div>
  );
}
