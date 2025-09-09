'use client';

import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  CheckCircle,
  BookOpen,
  MessageSquare,
  PenSquare,
  RotateCcw,
  Globe,
  Languages
} from 'lucide-react';

interface LanguageWorksheetBuilderProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  isPremium?: boolean;
}

// Worksheet type option component
const WorksheetTypeOption = ({
  value,
  title,
  description,
  icon,
  selected,
  onClick
}: {
  value: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  selected: boolean;
  onClick: () => void;
}) => (
  <Card
    className={`cursor-pointer transition-all ${selected ? 'border-primary bg-primary/5' : 'hover:border-gray-400'}`}
    onClick={onClick}
  >
    <CardHeader className="p-4 pb-2 flex flex-row items-start space-y-0">
      <div className="flex-1">
        <CardTitle className="text-base flex items-center">
          {icon}
          <span className="ml-2">{title}</span>
        </CardTitle>
        <p className="text-xs text-gray-600 mt-1">{description}</p>
      </div>
      {selected && <CheckCircle className="h-5 w-5 text-primary" />}
    </CardHeader>
  </Card>
);

// Languages with icons for visual selection
const LANGUAGES = [
  { id: 'spanish', name: 'Spanish', icon: Globe, color: 'red' },
  { id: 'french', name: 'French', icon: Globe, color: 'blue' },
  { id: 'german', name: 'German', icon: Globe, color: 'yellow' },
  { id: 'italian', name: 'Italian', icon: Globe, color: 'green' },
  { id: 'chinese', name: 'Chinese', icon: Languages, color: 'red' },
  { id: 'japanese', name: 'Japanese', icon: Languages, color: 'pink' },
  { id: 'russian', name: 'Russian', icon: Globe, color: 'blue' },
  { id: 'arabic', name: 'Arabic', icon: Languages, color: 'green' },
];

export function LanguageWorksheetBuilder({ formData, onChange, isPremium = false }: LanguageWorksheetBuilderProps) {
  // Get or set defaults
  const targetLanguage = formData.targetLanguage || 'spanish';
  const worksheetType = formData.languageWorksheetType || 'general';

  // Handle worksheet type selection
  const handleTypeSelect = (type: string) => {
    onChange('languageWorksheetType', type);
  };

  return (
    <div className="space-y-6">
      {/* Target Language Selection */}
      <div>
        <h4 className="text-base font-medium mb-3">Target Language</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {LANGUAGES.map(language => {
            const isSelected = targetLanguage === language.id;
            const IconComponent = language.icon;

            return (
              <div
                key={language.id}
                className={`
                  cursor-pointer rounded-lg border-2 p-3 transition-all duration-200
                  flex flex-col items-center justify-center text-center
                  ${isSelected ? 'ring-2 ring-primary border-primary scale-105 bg-primary/5' : 'border-gray-200 hover:border-gray-300'}
                `}
                onClick={() => onChange('targetLanguage', language.id)}
              >
                <IconComponent className={`h-6 w-6 mb-2 ${isSelected ? 'text-primary' : 'text-gray-600'}`} />
                <span className={`text-sm font-medium ${isSelected ? 'text-primary' : 'text-gray-800'}`}>
                  {language.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Worksheet Type */}
      <div>
        <h4 className="text-base font-medium mb-3">Worksheet Type</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <WorksheetTypeOption
            value="grammar"
            title="Grammar Focus"
            description="Practice specific grammar rules and structures"
            icon={<PenSquare className="h-4 w-4 text-blue-600" />}
            selected={worksheetType === 'grammar'}
            onClick={() => handleTypeSelect('grammar')}
          />
          <WorksheetTypeOption
            value="vocabulary"
            title="Vocabulary Building"
            description="Learn and practice new words and phrases"
            icon={<BookOpen className="h-4 w-4 text-green-600" />}
            selected={worksheetType === 'vocabulary'}
            onClick={() => handleTypeSelect('vocabulary')}
          />
          <WorksheetTypeOption
            value="reading"
            title="Reading Comprehension"
            description="Understand and analyze text in the target language"
            icon={<BookOpen className="h-4 w-4 text-purple-600" />}
            selected={worksheetType === 'reading'}
            onClick={() => handleTypeSelect('reading')}
          />
          <WorksheetTypeOption
            value="conjugation"
            title="Verb Conjugation"
            description="Practice conjugating verbs in different tenses"
            icon={<RotateCcw className="h-4 w-4 text-indigo-600" />}
            selected={worksheetType === 'conjugation'}
            onClick={() => handleTypeSelect('conjugation')}
          />
          <WorksheetTypeOption
            value="conversation"
            title="Conversation Practice"
            description="Dialogues and prompts for speaking practice"
            icon={<MessageSquare className="h-4 w-4 text-yellow-600" />}
            selected={worksheetType === 'conversation'}
            onClick={() => handleTypeSelect('conversation')}
          />
          <WorksheetTypeOption
            value="writing"
            title="Writing Exercise"
            description="Activities based on writing practice"
            icon={<PenSquare className="h-4 w-4 text-pink-600" />}
            selected={worksheetType === 'writing'}
            onClick={() => handleTypeSelect('writing')}
          />
        </div>
      </div>

      {/* Custom Vocabulary */}
      <div>
        <Label className="mb-2 block">Custom Vocabulary (Optional)</Label>
        <Textarea
          value={formData.customVocabulary || ""}
          onChange={(e) => onChange('customVocabulary', e.target.value)}
          placeholder="Enter specific words to include, separated by commas (e.g., casa, familia, amigo)"
          className="min-h-[80px]"
        />
        <p className="text-xs text-gray-500 mt-1">
          Leave blank to use general vocabulary for the selected topic
        </p>
      </div>

      {/* Additional Requirements */}
      <div>
        <Label className="mb-2 block">Additional Requirements or Context</Label>
        <Textarea
          value={formData.languageAdditionalNotes || ""}
          onChange={(e) => onChange('languageAdditionalNotes', e.target.value)}
          placeholder="Add any specific requirements or context (e.g., include cultural notes about Spain, focus on business vocabulary, make suitable for young learners)"
          className="min-h-[80px]"
        />
      </div>
    </div>
  );
}
