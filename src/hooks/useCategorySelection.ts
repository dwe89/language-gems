import { useState } from 'react';
import { VOCABULARY_CATEGORIES, Category, Subcategory } from '../components/games/ModernCategorySelector';

export interface CategorySelection {
  categoryId: string;
  subcategoryId: string | null;
  category?: Category;
  subcategory?: Subcategory;
}

export function useCategorySelection() {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [showCategorySelector, setShowCategorySelector] = useState(false);

  const handleCategorySelect = (categoryId: string, subcategoryId: string | null) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory(subcategoryId || '');
    setShowCategorySelector(false);
  };

  const getCurrentSelection = (): CategorySelection | null => {
    if (!selectedCategory) return null;

    const category = VOCABULARY_CATEGORIES.find(c => c.id === selectedCategory);
    const subcategory = category?.subcategories.find(s => s.id === selectedSubcategory);

    return {
      categoryId: selectedCategory,
      subcategoryId: selectedSubcategory || null,
      category,
      subcategory
    };
  };

  const getCategoryDisplayName = (categoryId: string): string => {
    const category = VOCABULARY_CATEGORIES.find(c => c.id === categoryId);
    return category?.displayName || categoryId;
  };

  const getSubcategoryDisplayName = (categoryId: string, subcategoryId: string): string => {
    const category = VOCABULARY_CATEGORIES.find(c => c.id === categoryId);
    const subcategory = category?.subcategories.find(s => s.id === subcategoryId);
    return subcategory?.displayName || subcategoryId;
  };

  const reset = () => {
    setSelectedCategory('');
    setSelectedSubcategory('');
    setShowCategorySelector(false);
  };

  return {
    selectedCategory,
    selectedSubcategory,
    showCategorySelector,
    setShowCategorySelector,
    handleCategorySelect,
    getCurrentSelection,
    getCategoryDisplayName,
    getSubcategoryDisplayName,
    reset
  };
}
