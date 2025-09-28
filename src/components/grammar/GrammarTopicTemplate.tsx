'use client';

import React from 'react';
import GrammarPageTemplate from './GrammarPageTemplate';

interface Example {
  spanish?: string;
  french?: string;
  german?: string;
  english: string;
  explanation?: string;
}

interface TopicContent {
  overview: string;
  keyPoints: string[];
  examples: Example[];
}

interface GrammarTopicTemplateProps {
  language: 'spanish' | 'french' | 'german';
  category: string;
  topic: string;
  title: string;
  description: string;
  backUrl: string;
  content: TopicContent;
}

export default function GrammarTopicTemplate({
  language,
  category,
  topic,
  title,
  description,
  backUrl,
  content
}: GrammarTopicTemplateProps) {
  // Convert the simple content format to the full GrammarPageTemplate format
  const sections = [
    {
      title: 'Overview',
      content: content.overview
    },
    {
      title: 'Key Points',
      content: content.keyPoints.map(point => `• ${point}`).join('\n\n')
    },
    {
      title: 'Examples',
      content: 'Study these examples to understand how to apply the rules:',
      examples: content.examples.map(example => ({
        spanish: example.spanish,
        french: example.french,
        german: example.german,
        english: example.english,
        highlight: example.explanation ? [example.explanation] : undefined
      }))
    }
  ];

  return (
    <GrammarPageTemplate
      language={language}
      category={category}
      topic={topic}
      title={title}
      description={description}
      difficulty="intermediate"
      estimatedTime={15}
      sections={sections}
      backUrl={backUrl}
      practiceUrl={`/grammar/${language}/${category}/${topic}/practice`}
      quizUrl={`/grammar/${language}/${category}/${topic}/test`}
    />
  );
}
