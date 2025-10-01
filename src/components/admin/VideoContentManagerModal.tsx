'use client';

import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import VideoContentManager from './VideoContentManager';

interface VideoContentManagerModalProps {
  video: {
    id: string;
    title?: string | null;
    language: string;
    transcript?: string | null;
    transcript_translation?: string | null;
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onContentUpdated?: () => void;
}

export default function VideoContentManagerModal({ video, isOpen, onClose, onContentUpdated }: VideoContentManagerModalProps) {
  if (!isOpen || !video) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto border border-slate-200">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-slate-900">Video Content Manager</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="px-6 py-6">
          <VideoContentManager
            video={{
              id: video.id,
              language: video.language,
              transcript: video.transcript ?? null,
              transcript_translation: video.transcript_translation ?? null,
              title: video.title ?? undefined
            }}
            onContentUpdated={onContentUpdated}
          />
        </div>
      </div>
    </div>
  );
}
