'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../../components/auth/AuthProvider';
import { useSupabase } from '../../../../components/supabase/SupabaseProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, BookOpen, Search, Plus, X, 
  Check, Filter, Eye, Trash2, Save,
  AlertCircle, CheckCircle2
} from 'lucide-react';

interface VocabularyItem {
  id: number;
  spanish: string;
  english: string;
  french?: string;
  theme: string;
  topic: string;
  part_of_speech: string;
  difficulty_level?: string;
  language: 'spanish' | 'french';
}

interface CustomVocabularyItem {
  id: string; // temporary ID for UI
  term: string;
  translation: string;
  part_of_speech: string;
  language: 'spanish' | 'french';
}

export default function CreateVocabularyListPage() {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  const router = useRouter();
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    theme: '',
    topic: '',
    difficulty_level: '',
    is_public: false,
    language: 'spanish' as 'spanish' | 'french',
    folder: ''
  });
  
  // Available vocabulary and selection state
  const [availableVocabulary, setAvailableVocabulary] = useState<VocabularyItem[]>([]);
  const [selectedVocabulary, setSelectedVocabulary] = useState<VocabularyItem[]>([]);
  const [customVocabulary, setCustomVocabulary] = useState<CustomVocabularyItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [themeFilter, setThemeFilter] = useState('');
  const [topicFilter, setTopicFilter] = useState('');
  const [themes, setThemes] = useState<string[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  const [folders, setFolders] = useState<string[]>([]);
  
  // Custom vocabulary form
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customForm, setCustomForm] = useState({
    term: '',
    translation: '',
    part_of_speech: 'noun'
  });
  
  // UI state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load vocabulary and themes/topics
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Fetch vocabulary based on selected language
        const { data: vocabData, error: vocabError } = await supabase
          .from('vocabulary')
          .select('*')
          .order(formData.language === 'spanish' ? 'spanish' : 'french');
        
        if (vocabError) throw vocabError;
        
        // Filter and map vocabulary based on language
        const processedVocab = (vocabData || [])
          .filter(item => formData.language === 'spanish' ? item.spanish : item.french)
          .map(item => ({
            ...item,
            language: formData.language,
            term: formData.language === 'spanish' ? item.spanish : item.french || '',
            translation: item.english
          }));
        
        setAvailableVocabulary(processedVocab);
        
        // Extract unique themes and topics
        const uniqueThemes = [...new Set(vocabData?.map(item => item.theme).filter(Boolean))];
        const uniqueTopics = [...new Set(vocabData?.map(item => item.topic).filter(Boolean))];
        
        setThemes(uniqueThemes);
        setTopics(uniqueTopics);
        
        // Load existing folders (vocabulary lists for folder structure)
        const { data: listsData } = await supabase
          .from('vocabulary_assignment_lists')
          .select('theme, topic')
          .eq('teacher_id', user?.id);
        
        const existingFolders = [...new Set([
          ...listsData?.map(list => list.theme).filter(Boolean) || [],
          ...listsData?.map(list => list.topic).filter(Boolean) || []
        ])];
        
        setFolders(existingFolders);
        
      } catch (err: any) {
        setError('Failed to load vocabulary data');
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      loadData();
    }
  }, [user, supabase, formData.language]);
  
  // Filter vocabulary based on search and filters
  const filteredVocabulary = availableVocabulary.filter(item => {
    const termField = formData.language === 'spanish' ? item.spanish : (item.french || '');
    const matchesSearch = termField.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.english.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTheme = !themeFilter || item.theme === themeFilter;
    const matchesTopic = !topicFilter || item.topic === topicFilter;
    const notSelected = !selectedVocabulary.find(selected => selected.id === item.id);
    
    return matchesSearch && matchesTheme && matchesTopic && notSelected;
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleCustomFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCustomForm(prev => ({ ...prev, [name]: value }));
  };

  const addCustomVocabulary = () => {
    if (!customForm.term.trim() || !customForm.translation.trim()) {
      setError('Please fill in both term and translation');
      return;
    }

    const newCustomItem: CustomVocabularyItem = {
      id: Date.now().toString(), // temporary ID
      term: customForm.term.trim(),
      translation: customForm.translation.trim(),
      part_of_speech: customForm.part_of_speech,
      language: formData.language
    };

    setCustomVocabulary(prev => [...prev, newCustomItem]);
    setCustomForm({ term: '', translation: '', part_of_speech: 'noun' });
    setShowCustomForm(false);
    setError('');
  };

  const removeCustomVocabulary = (itemId: string) => {
    setCustomVocabulary(prev => prev.filter(item => item.id !== itemId));
  };

  const addVocabularyItem = (item: VocabularyItem) => {
    setSelectedVocabulary(prev => [...prev, item]);
  };

  const removeVocabularyItem = (itemId: number) => {
    setSelectedVocabulary(prev => prev.filter(item => item.id !== itemId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('List name is required');
      return;
    }
    
    if (selectedVocabulary.length === 0 && customVocabulary.length === 0) {
      setError('Please select or add at least one vocabulary item');
      return;
    }
    
    try {
      setSaving(true);
      setError('');
      
      // First, insert any custom vocabulary into the main vocabulary table
      let customVocabIds: number[] = [];
      
      if (customVocabulary.length > 0) {
        const customVocabInserts = customVocabulary.map(item => ({
          [formData.language]: item.term,
          english: item.translation,
          theme: formData.theme || 'Custom',
          topic: formData.topic || 'User Created',
          part_of_speech: item.part_of_speech
        }));
        
        const { data: insertedCustomVocab, error: customVocabError } = await supabase
          .from('vocabulary')
          .insert(customVocabInserts)
          .select('id');
        
        if (customVocabError) throw customVocabError;
        customVocabIds = insertedCustomVocab?.map(item => item.id) || [];
      }
      
      // Combine selected vocabulary IDs with newly created custom vocabulary IDs
      const allVocabIds = [
        ...selectedVocabulary.map(item => item.id),
        ...customVocabIds
      ];
      
      // Create the vocabulary list
      const { data: listData, error: listError } = await supabase
        .from('vocabulary_assignment_lists')
        .insert({
          name: formData.name,
          description: formData.description,
          teacher_id: user?.id,
          theme: formData.folder || formData.theme || null,
          topic: formData.topic || null,
          difficulty_level: formData.difficulty_level || null,
          vocabulary_items: allVocabIds,
          word_count: allVocabIds.length,
          is_public: formData.is_public
        })
        .select()
        .single();
      
      if (listError) throw listError;
      
      // Create vocabulary assignment items for all vocabulary
      const vocabularyItems = allVocabIds.map((vocabId, index) => ({
        assignment_list_id: listData.id,
        vocabulary_id: vocabId,
        order_position: index,
        is_required: true
      }));
      
      const { error: itemsError } = await supabase
        .from('vocabulary_assignment_items')
        .insert(vocabularyItems);
      
      if (itemsError) throw itemsError;
      
      setSuccess('Vocabulary list created successfully!');
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/dashboard/vocabulary');
      }, 1500);
      
    } catch (err: any) {
      setError('Failed to create vocabulary list: ' + err.message);
      console.error('Error creating list:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading vocabulary...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/vocabulary"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Vocabulary Lists
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create Vocabulary List</h1>
              <p className="mt-2 text-gray-600">
                Create a custom vocabulary list for your assignments
              </p>
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="mr-2 text-red-600" size={20} />
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <CheckCircle2 className="mr-2 text-green-600" size={20} />
              <p className="text-green-800">{success}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Form */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">List Details</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
                  Language *
                </label>
                <select
                  id="language"
                  name="language"
                  value={formData.language}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="spanish">Spanish</option>
                  <option value="french">French</option>
                </select>
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  List Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., Spanish Colors Vocabulary"
                  required
                />
              </div>

              <div>
                <label htmlFor="folder" className="block text-sm font-medium text-gray-700 mb-2">
                  Folder/Category
                </label>
                <div className="flex space-x-2">
                  <select
                    id="folder"
                    name="folder"
                    value={formData.folder}
                    onChange={handleFormChange}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select existing folder</option>
                    {folders.map(folder => (
                      <option key={folder} value={folder}>{folder}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Or create new folder"
                    value={formData.folder}
                    onChange={(e) => setFormData(prev => ({ ...prev, folder: e.target.value }))}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Organize your vocabulary lists into folders for better management
                </p>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Optional description of this vocabulary list..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-2">
                    Theme (Optional)
                  </label>
                  <select
                    id="theme"
                    name="theme"
                    value={formData.theme}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select theme</option>
                    {themes.map(theme => (
                      <option key={theme} value={theme}>{theme}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
                    Topic (Optional)
                  </label>
                  <select
                    id="topic"
                    name="topic"
                    value={formData.topic}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select topic</option>
                    {topics.map(topic => (
                      <option key={topic} value={topic}>{topic}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="difficulty_level" className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty Level (Optional)
                </label>
                <select
                  id="difficulty_level"
                  name="difficulty_level"
                  value={formData.difficulty_level}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select difficulty</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_public"
                  name="is_public"
                  checked={formData.is_public}
                  onChange={handleFormChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="is_public" className="ml-2 block text-sm text-gray-700">
                  Make this list public (other teachers can use it)
                </label>
              </div>

              {/* Selected vocabulary count */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">{selectedVocabulary.length + customVocabulary.length}</span> vocabulary items selected
                  {customVocabulary.length > 0 && (
                    <span className="text-indigo-600 ml-2">
                      ({customVocabulary.length} custom)
                    </span>
                  )}
                </p>
              </div>

              <button
                type="submit"
                disabled={saving || (selectedVocabulary.length === 0 && customVocabulary.length === 0)}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating List...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Save className="mr-2" size={16} />
                    Create Vocabulary List
                  </div>
                )}
              </button>
            </form>
          </div>

          {/* Right Column: Vocabulary Selection */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Select Vocabulary</h2>
                <button
                  type="button"
                  onClick={() => setShowCustomForm(!showCustomForm)}
                  className="inline-flex items-center px-3 py-2 border border-indigo-300 shadow-sm text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-50 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Plus size={16} className="mr-1" />
                  Add Custom
                </button>
              </div>
              
              {/* Custom Vocabulary Form */}
              {showCustomForm && (
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">
                    Add Custom {formData.language === 'spanish' ? 'Spanish' : 'French'} Vocabulary
                  </h3>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <input
                      type="text"
                      placeholder={`${formData.language === 'spanish' ? 'Spanish' : 'French'} word`}
                      value={customForm.term}
                      name="term"
                      onChange={handleCustomFormChange}
                      className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <input
                      type="text"
                      placeholder="English translation"
                      value={customForm.translation}
                      name="translation"
                      onChange={handleCustomFormChange}
                      className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <select
                      value={customForm.part_of_speech}
                      name="part_of_speech"
                      onChange={handleCustomFormChange}
                      className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="noun">Noun</option>
                      <option value="verb">Verb</option>
                      <option value="adjective">Adjective</option>
                      <option value="adverb">Adverb</option>
                      <option value="preposition">Preposition</option>
                      <option value="conjunction">Conjunction</option>
                      <option value="interjection">Interjection</option>
                    </select>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => setShowCustomForm(false)}
                        className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={addCustomVocabulary}
                        className="px-3 py-2 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Search and Filters */}
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search vocabulary..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={themeFilter}
                    onChange={(e) => setThemeFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">All themes</option>
                    {themes.map(theme => (
                      <option key={theme} value={theme}>{theme}</option>
                    ))}
                  </select>
                  
                  <select
                    value={topicFilter}
                    onChange={(e) => setTopicFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">All topics</option>
                    {topics.map(topic => (
                      <option key={topic} value={topic}>{topic}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Selected Vocabulary */}
            {(selectedVocabulary.length > 0 || customVocabulary.length > 0) && (
              <div className="p-6 border-b bg-green-50">
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Selected Vocabulary ({selectedVocabulary.length + customVocabulary.length})
                </h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {/* Existing vocabulary from database */}
                  {selectedVocabulary.map(item => (
                    <div key={item.id} className="flex items-center justify-between bg-white p-2 rounded border">
                      <div className="flex-1">
                        <span className="font-medium text-sm">
                          {formData.language === 'spanish' ? item.spanish : item.french}
                        </span>
                        <span className="text-gray-500 text-sm ml-2">→ {item.english}</span>
                      </div>
                      <button
                        onClick={() => removeVocabularyItem(item.id)}
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  
                  {/* Custom vocabulary */}
                  {customVocabulary.map(item => (
                    <div key={item.id} className="flex items-center justify-between bg-blue-50 p-2 rounded border border-blue-200">
                      <div className="flex-1">
                        <span className="font-medium text-sm">{item.term}</span>
                        <span className="text-gray-500 text-sm ml-2">→ {item.translation}</span>
                        <span className="text-xs text-blue-600 ml-2">(custom)</span>
                      </div>
                      <button
                        onClick={() => removeCustomVocabulary(item.id)}
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Available Vocabulary */}
            <div className="p-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Available {formData.language === 'spanish' ? 'Spanish' : 'French'} Vocabulary ({filteredVocabulary.length})
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredVocabulary.map(item => {
                  const termField = formData.language === 'spanish' ? item.spanish : item.french;
                  if (!termField) return null;
                  
                  return (
                    <div key={item.id} className="flex items-center justify-between p-2 border border-gray-200 rounded hover:bg-gray-50">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{termField} → {item.english}</div>
                        <div className="text-xs text-gray-500">
                          {item.theme} • {item.topic} • {item.part_of_speech}
                        </div>
                      </div>
                      <button
                        onClick={() => addVocabularyItem(item)}
                        className="text-indigo-600 hover:text-indigo-800 ml-2"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  );
                })}
                
                {filteredVocabulary.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <BookOpen size={48} className="mx-auto mb-4 text-gray-300" />
                    <p>No {formData.language === 'spanish' ? 'Spanish' : 'French'} vocabulary items found matching your criteria.</p>
                    <p className="text-sm mt-2">Try adjusting your filters or add custom vocabulary above.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
