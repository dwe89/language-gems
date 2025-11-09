'use client';

import React, { useEffect, useRef } from 'react';
import { X, Bold, Italic, Underline, List, ListOrdered, Eraser } from 'lucide-react';
import { sanitizeInlineHtml } from '@/utils/richTextHelpers';

interface RichTextPopoverProps {
  initialValue: string;
  onSave: (value: string) => void;
  onCancel: () => void;
}

const TOOLBAR_BUTTONS: Array<{
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  command: string;
  value?: string;
}> = [
  { icon: Bold, label: 'Bold', command: 'bold' },
  { icon: Italic, label: 'Italic', command: 'italic' },
  { icon: Underline, label: 'Underline', command: 'underline' },
  { icon: List, label: 'Bulleted list', command: 'insertUnorderedList' },
  { icon: ListOrdered, label: 'Numbered list', command: 'insertOrderedList' },
  { icon: Eraser, label: 'Clear formatting', command: 'removeFormat' },
];

const handleCommand = (command: string, value?: string) => {
  if (typeof document === 'undefined') {
    return;
  }
  document.execCommand(command, false, value ?? undefined);
};

export default function RichTextPopover({ initialValue, onSave, onCancel }: RichTextPopoverProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = sanitizeInlineHtml(initialValue);
      editorRef.current.focus();
    }
  }, [initialValue]);

  const handleSave = () => {
    const html = sanitizeInlineHtml(editorRef.current?.innerHTML || '');
    onSave(html);
  };

  return (
    <div className="fixed inset-0 z-[130] bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Rich Text Editing</h3>
            <p className="text-sm text-gray-500">Use formatting sparingly to highlight key language elements.</p>
          </div>
          <button
            onClick={onCancel}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700"
            aria-label="Close rich text editor"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 border-b bg-gray-50">
          {TOOLBAR_BUTTONS.map(({ icon: Icon, label, command, value }) => (
            <button
              key={label}
              type="button"
              onClick={() => {
                handleCommand(command, value);
                editorRef.current?.focus();
              }}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 hover:text-gray-900"
              title={label}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        <div className="px-4 py-3">
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            className="min-h-[220px] max-h-[360px] overflow-y-auto border border-gray-200 rounded-xl p-4 text-base leading-relaxed focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-400"
          />
        </div>

        <div className="flex justify-end gap-3 px-4 py-3 border-t bg-gray-50">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg shadow hover:from-purple-700 hover:to-blue-700"
          >
            Apply Formatting
          </button>
        </div>
      </div>
    </div>
  );
}
