'use client';

import { useState } from 'react';
import { useAuth } from '../../../../components/auth/AuthProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, Upload, Plus, Trash2, Save, HelpCircle, X
} from 'lucide-react';
import { supabaseBrowser } from '../../../../components/auth/AuthProvider';
import type { Database } from '../../../../lib/database.types';

type WordPair = {
  term: string;
  definition: string;
};

export default function CreateContentPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showTips, setShowTips] = useState(false);
  
  const supabase = supabaseBrowser;
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_public: false,
    words: [{ term: '', definition: '' }] as WordPair[]
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleWordChange = (index: number, field: keyof WordPair, value: string) => {
    const updatedWords = [...formData.words];
    updatedWords[index][field] = value;
    setFormData({
      ...formData,
      words: updatedWords
    });
  };

  const addWordPair = () => {
    setFormData({
      ...formData,
      words: [...formData.words, { term: '', definition: '' }]
    });
  };

  const removeWordPair = (index: number) => {
    if (formData.words.length === 1) {
      return; // Keep at least one word pair
    }
    const updatedWords = [...formData.words];
    updatedWords.splice(index, 1);
    setFormData({
      ...formData,
      words: updatedWords
    });
  };

  const handleBulkImport = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (!text.trim()) return;

    try {
      // Split by new lines and then by delimiter (tab or comma)
      const lines = text.split('\n').filter(line => line.trim());
      const wordPairs: WordPair[] = [];

      lines.forEach(line => {
        const parts = line.includes('\t') 
          ? line.split('\t') 
          : line.includes(',') 
            ? line.split(',') 
            : null;
            
        if (parts && parts.length >= 2) {
          wordPairs.push({
            term: parts[0].trim(),
            definition: parts[1].trim()
          });
        }
      });

      if (wordPairs.length > 0) {
        setFormData({
          ...formData,
          words: wordPairs
        });
      } else {
        setError('No valid word pairs found. Make sure each line has a term and definition separated by a tab or comma.');
      }
    } catch (err) {
      setError('Failed to parse the imported text.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    try {
      // Validate form
      if (!formData.name.trim()) {
        throw new Error('Name is required');
      }
      
      // Filter out empty word pairs
      const filteredWords = formData.words.filter(word => word.term.trim() && word.definition.trim());
      
      if (filteredWords.length === 0) {
        throw new Error('Please add at least one word pair');
      }
      
      // In a real implementation, we would save to the database
      // const { data, error } = await supabase
      //   .from('custom_wordlists')
      //   .insert([{
      //     name: formData.name,
      //     description: formData.description,
      //     is_public: formData.is_public,
      //     words: filteredWords,
      //     creator_id: user?.id
      //   }])
      //   .select();
      
      // if (error) throw error;
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Redirect to content page
      router.push('/dashboard/content');
    } catch (err: any) {
      setError(err.message || 'Failed to create word list');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-teal-100 to-rose-100 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex items-center">
          <Link 
            href="/dashboard/content" 
            className="mr-4 p-2 rounded-full hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="text-teal-700" size={24} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-teal-800 mb-2">Create Vocabulary List</h1>
            <p className="text-teal-600">Create custom vocabulary for your students</p>
          </div>
        </header>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 mb-8">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Vocabulary List Name*
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="e.g. French Food Vocabulary"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="What is this vocabulary list about?"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_public"
                  name="is_public"
                  checked={formData.is_public}
                  onChange={handleChange}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                />
                <label htmlFor="is_public" className="ml-2 block text-sm text-gray-700">
                  Make this vocabulary list public (other teachers can use it)
                </label>
              </div>
            </div>
            
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Enter Vocabulary</h3>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowTips(!showTips)}
                    className="text-teal-600 hover:text-teal-800 flex items-center text-sm"
                  >
                    <HelpCircle size={16} className="mr-1" />
                    {showTips ? 'Hide Tips' : 'Show Tips'}
                  </button>
                  <button
                    type="button"
                    onClick={addWordPair}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 rounded flex items-center text-sm"
                  >
                    <Plus size={16} className="mr-1" />
                    Add Word
                  </button>
                </div>
              </div>
              
              {showTips && (
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <div className="flex justify-between">
                    <h4 className="font-medium text-blue-800 mb-2">Tips for creating effective vocabulary lists</h4>
                    <button 
                      type="button" 
                      onClick={() => setShowTips(false)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <ul className="list-disc pl-5 text-sm text-blue-700 space-y-1">
                    <li>Group related words together to help with memorization</li>
                    <li>Include example sentences for context when possible</li>
                    <li>Add pronunciation guides for difficult words</li>
                    <li>Import existing lists using the bulk import feature</li>
                    <li>Consider organizing by theme or difficulty level</li>
                  </ul>
                </div>
              )}
              
              <div className="border border-gray-300 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-gray-700 mb-2">Bulk Import</h4>
                <p className="text-sm text-gray-500 mb-2">
                  Paste your vocabulary list below with each term and definition on a new line, separated by a comma or tab.
                </p>
                <textarea
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="apple, une pomme&#10;bread, du pain&#10;water, de l'eau"
                  onChange={handleBulkImport}
                ></textarea>
              </div>
              
              <div className="space-y-3">
                {formData.words.map((word, index) => (
                  <div key={index} className="flex space-x-3 items-start">
                    <div className="grid grid-cols-2 gap-3 flex-grow">
                      <input
                        type="text"
                        value={word.term}
                        onChange={(e) => handleWordChange(index, 'term', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        placeholder="Term (e.g. apple)"
                      />
                      <input
                        type="text"
                        value={word.definition}
                        onChange={(e) => handleWordChange(index, 'definition', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        placeholder="Definition (e.g. une pomme)"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeWordPair(index)}
                      className="p-2 text-red-500 hover:text-red-700 focus:outline-none"
                      aria-label="Remove word pair"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="pt-4 flex justify-end space-x-3 border-t border-gray-200">
              <Link 
                href="/dashboard/content"
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Saving...' : (
                  <>
                    <Save size={18} className="mr-2" />
                    Save Vocabulary List
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 