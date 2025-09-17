'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ChevronRight, ChevronDown, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSupabase } from '@/hooks/useSupabase';

interface GrammarNote {
  id: string;
  title: string;
  content: string;
  section_order: number;
  example?: string;
}

interface VideoGrammarNotesProps {
  videoId: string;
}

export default function VideoGrammarNotes({ videoId }: VideoGrammarNotesProps) {
  const [notes, setNotes] = useState<GrammarNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set());

  const { supabase } = useSupabase();

  // Load grammar notes
  useEffect(() => {
    async function loadGrammarNotes() {
      try {
        const { data, error } = await supabase
          .from('video_grammar_notes')
          .select('*')
          .eq('video_id', videoId)
          .order('section_order');

        if (error) throw error;

        setNotes(data || []);
      } catch (error) {
        console.error('Error loading grammar notes:', error);
      } finally {
        setLoading(false);
      }
    }

    loadGrammarNotes();
  }, [videoId, supabase]);

  const toggleNote = (noteId: string) => {
    setExpandedNotes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(noteId)) {
        newSet.delete(noteId);
      } else {
        newSet.add(noteId);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p>Loading grammar notes...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (notes.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No grammar notes available for this video yet.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
            Grammar Notes
            <Badge variant="secondary" className="ml-2">
              {notes.length} {notes.length === 1 ? 'note' : 'notes'}
            </Badge>
          </CardTitle>
        </CardHeader>
      </Card>

      {notes.map((note, index) => {
        const isExpanded = expandedNotes.has(note.id);
        
        return (
          <motion.div
            key={note.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden">
              <CardHeader 
                className="cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleNote(note.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                      {note.section_order}
                    </div>
                    <CardTitle className="text-lg">{note.title}</CardTitle>
                  </div>
                  <motion.div
                    animate={{ rotate: isExpanded ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </motion.div>
                </div>
              </CardHeader>

              <motion.div
                initial={false}
                animate={{
                  height: isExpanded ? 'auto' : 0,
                  opacity: isExpanded ? 1 : 0
                }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                style={{ overflow: 'hidden' }}
              >
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    {/* Main content */}
                    <div className="prose prose-sm max-w-none">
                      <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                        {note.content}
                      </div>
                    </div>

                    {/* Example section */}
                    {note.example && (
                      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                        <div className="flex items-start">
                          <Lightbulb className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="font-medium text-yellow-800 mb-1">Example:</div>
                            <div className="text-yellow-700 whitespace-pre-line">
                              {note.example}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </motion.div>
            </Card>
          </motion.div>
        );
      })}

      {/* Summary card */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center">
            <BookOpen className="w-5 h-5 text-blue-600 mr-2" />
            <div className="text-sm text-blue-800">
              <strong>Study Tip:</strong> Review these grammar points while watching the video to reinforce your learning!
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
