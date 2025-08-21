'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Edit3, Sparkles, AlertTriangle, Loader2 } from 'lucide-react';
import { vocabularyCategorizationService } from '../../services/VocabularyCategorizationService';

interface CategorySuggestion {
  id: string;
  term: string;
  translation: string;
  suggestedCategory?: string;
  suggestedSubcategory?: string;
  suggested_category?: string; // Keep for backward compatibility
  suggested_subcategory?: string; // Keep for backward compatibility
  confidence: number;
  needs_review?: boolean;
  teacherApprovedCategory?: string;
}

interface CategoryReviewInterfaceProps {
  vocabularyItems: CategorySuggestion[]; // Pass items directly instead of IDs
  onReviewComplete: () => void;
}

export default function CategoryReviewInterface({
  vocabularyItems,
  onReviewComplete
}: CategoryReviewInterfaceProps) {
  const [suggestions, setSuggestions] = useState<CategorySuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<Set<string>>(new Set());
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editCategory, setEditCategory] = useState('');
  const [editSubcategory, setEditSubcategory] = useState('');

  useEffect(() => {
    // Convert passed items to CategorySuggestion format
    const suggestions: CategorySuggestion[] = vocabularyItems.map(item => ({
      id: item.id,
      term: item.term,
      translation: item.translation,
      suggested_category: item.suggestedCategory || item.suggested_category || 'General',
      suggested_subcategory: item.suggestedSubcategory || item.suggested_subcategory || 'Uncategorized',
      confidence: item.confidence || 0.5,
      needs_review: true,
      teacherApprovedCategory: item.teacherApprovedCategory
    }));

    setSuggestions(suggestions);
    setLoading(false);
  }, [vocabularyItems]);

  const handleApprove = async (id: string) => {
    setProcessing(prev => new Set([...prev, id]));
    try {
      await vocabularyCategorizationService.approveCategorization(id, true);
      setSuggestions(prev => prev.map(item => 
        item.id === id ? { ...item, needs_review: false } : item
      ));
    } catch (error) {
      console.error('Error approving categorization:', error);
    } finally {
      setProcessing(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleReject = async (id: string) => {
    setProcessing(prev => new Set([...prev, id]));
    try {
      await vocabularyCategorizationService.approveCategorization(id, false);
      setSuggestions(prev => prev.map(item => 
        item.id === id ? { ...item, needs_review: true } : item
      ));
    } catch (error) {
      console.error('Error rejecting categorization:', error);
    } finally {
      setProcessing(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleEdit = (item: CategorySuggestion) => {
    setEditingItem(item.id);
    setEditCategory(item.suggested_category);
    setEditSubcategory(item.suggested_subcategory);
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;
    
    setProcessing(prev => new Set([...prev, editingItem]));
    try {
      await vocabularyCategorizationService.approveCategorization(
        editingItem,
        true,
        editCategory,
        editSubcategory
      );
      
      setSuggestions(prev => prev.map(item => 
        item.id === editingItem ? {
          ...item,
          suggested_category: editCategory,
          suggested_subcategory: editSubcategory,
          needs_review: false
        } : item
      ));
      
      setEditingItem(null);
    } catch (error) {
      console.error('Error saving edit:', error);
    } finally {
      setProcessing(prev => {
        const newSet = new Set(prev);
        newSet.delete(editingItem);
        return newSet;
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setEditCategory('');
    setEditSubcategory('');
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-100';
    if (confidence >= 0.6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.8) return 'High';
    if (confidence >= 0.6) return 'Medium';
    return 'Low';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const needsReviewCount = suggestions.filter(s => s.needs_review).length;
  const approvedCount = suggestions.length - needsReviewCount;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">AI Categorization Review</h3>
          <p className="text-sm text-gray-600">
            Review and approve AI-generated categories for your vocabulary
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm">
            <span className="text-green-600 font-medium">{approvedCount} approved</span>
            <span className="text-gray-400 mx-2">•</span>
            <span className="text-yellow-600 font-medium">{needsReviewCount} need review</span>
          </div>
          {needsReviewCount === 0 && (
            <button
              onClick={onReviewComplete}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Complete Review
            </button>
          )}
        </div>
      </div>

      {/* Suggestions List */}
      <div className="space-y-4">
        {suggestions.map((suggestion) => (
          <div
            key={suggestion.id}
            className={`border rounded-lg p-4 ${
              suggestion.needs_review ? 'border-yellow-200 bg-yellow-50' : 'border-green-200 bg-green-50'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div>
                    <span className="font-medium text-gray-900">{suggestion.term}</span>
                    <span className="text-gray-500 mx-2">→</span>
                    <span className="text-gray-700">{suggestion.translation}</span>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(suggestion.confidence)}`}>
                    {getConfidenceLabel(suggestion.confidence)} ({Math.round(suggestion.confidence * 100)}%)
                  </div>
                </div>

                {editingItem === suggestion.id ? (
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Food and Drink">Food and Drink</option>
                        <option value="Family and Relationships">Family and Relationships</option>
                        <option value="Home and Living">Home and Living</option>
                        <option value="School and Education">School and Education</option>
                        <option value="Work and Professions">Work and Professions</option>
                        <option value="Travel and Transport">Travel and Transport</option>
                        <option value="Health and Body">Health and Body</option>
                        <option value="Hobbies and Leisure">Hobbies and Leisure</option>
                        <option value="Shopping and Money">Shopping and Money</option>
                        <option value="Weather and Environment">Weather and Environment</option>
                        <option value="Descriptions">Descriptions</option>
                        <option value="Numbers and Time">Numbers and Time</option>
                        <option value="Actions and Verbs">Actions and Verbs</option>
                        <option value="General">General</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory</label>
                      <input
                        type="text"
                        value={editSubcategory}
                        onChange={(e) => setEditSubcategory(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter subcategory"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="mb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-purple-600" />
                      <span className="text-sm text-gray-700">
                        <strong>Category:</strong> {suggestion.suggested_category}
                        {suggestion.suggested_subcategory && (
                          <> → <strong>Subcategory:</strong> {suggestion.suggested_subcategory}</>
                        )}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 ml-4">
                {editingItem === suggestion.id ? (
                  <>
                    <button
                      onClick={handleSaveEdit}
                      disabled={processing.has(suggestion.id)}
                      className="p-2 text-green-600 hover:bg-green-100 rounded-md disabled:opacity-50"
                    >
                      {processing.has(suggestion.id) ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
                    >
                      <XCircle className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEdit(suggestion)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-md"
                      title="Edit categorization"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    
                    {suggestion.needs_review ? (
                      <>
                        <button
                          onClick={() => handleApprove(suggestion.id)}
                          disabled={processing.has(suggestion.id)}
                          className="p-2 text-green-600 hover:bg-green-100 rounded-md disabled:opacity-50"
                          title="Approve categorization"
                        >
                          {processing.has(suggestion.id) ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <CheckCircle className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleReject(suggestion.id)}
                          disabled={processing.has(suggestion.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-md disabled:opacity-50"
                          title="Reject categorization"
                        >
                          {processing.has(suggestion.id) ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <XCircle className="h-4 w-4" />
                          )}
                        </button>
                      </>
                    ) : (
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-xs">Approved</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {suggestions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
          <p>No vocabulary items found for review.</p>
        </div>
      )}
    </div>
  );
}
