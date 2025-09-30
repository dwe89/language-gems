# 🔧 Assignment Vocabulary Selection - Complete Fix

## 📋 Problem Summary

When creating an assignment with **multiple subcategories** (e.g., "Holidays travel culture" with 7 subcategories), the system was:
1. ❌ Not saving the selected subcategories to the database
2. ❌ Not creating a vocabulary list
3. ❌ Falling back to default vocabulary (colours) when students played games

**Root Cause**: The system only supported **single** category/subcategory selection, not **arrays** of multiple selections.

---

## ✅ Solution Implemented

### **1. Backend Changes**

#### **A. Enhanced Assignment Service** (`src/services/enhancedAssignmentService.ts`)

Added support for multiple categories/subcategories in `transformVocabularyConfig()`:

```typescript
// NEW: Handle multiple subcategories (Enhanced Creator)
if (vocabularyConfig.subcategories?.length > 0) {
  return {
    type: 'multiple_subcategory_based', // New type
    categories: vocabularyConfig.categories || [],
    subcategories: vocabularyConfig.subcategories, // Array
    language: vocabularyConfig.language || 'es',
    wordCount: vocabularyConfig.wordCount || 20, // Default 20 for multiple
    difficulty: vocabularyConfig.difficulty || 'intermediate',
    curriculumLevel: vocabularyConfig.curriculumLevel || 'KS3'
  };
}

// NEW: Handle multiple categories (Enhanced Creator)
if (vocabularyConfig.categories?.length > 0 && !vocabularyConfig.subcategories?.length) {
  return {
    type: 'multiple_category_based', // New type
    categories: vocabularyConfig.categories,
    wordCount: vocabularyConfig.wordCount || 20,
    ...
  };
}

// LEGACY: Single subcategory (Quick Creator)
if (vocabularyConfig.subcategory && vocabularyConfig.subcategory !== '') {
  return {
    type: 'subcategory_based',
    category: category,
    subcategory: vocabularyConfig.subcategory,
    wordCount: vocabularyConfig.wordCount || 10 // Default 10 for single
  };
}
```

**Key Changes**:
- ✅ Check for **arrays first** (`subcategories`, `categories`)
- ✅ Fall back to **single values** for backward compatibility
- ✅ Use **higher default** (20 words) for multiple selections
- ✅ Use **lower default** (10 words) for single selections

---

#### **B. API Route** (`src/app/api/assignments/create/route.ts`)

Added new cases in `populateVocabularyList()` switch statement:

```typescript
switch (criteria.type) {
  case 'multiple_subcategory_based':
    // NEW: Handle multiple subcategories
    if (criteria.subcategories && criteria.subcategories.length > 0) {
      query = query.in('subcategory', criteria.subcategories); // Use .in() for arrays
    }
    if (criteria.categories && criteria.categories.length > 0) {
      query = query.in('category', criteria.categories);
    }
    break;

  case 'multiple_category_based':
    // NEW: Handle multiple categories
    if (criteria.categories && criteria.categories.length > 0) {
      query = query.in('category', criteria.categories);
    }
    break;

  case 'subcategory_based':
    // LEGACY: Single subcategory
    if (criteria.subcategory) {
      query = query.eq('subcategory', criteria.subcategory);
    }
    break;
}
```

**Key Changes**:
- ✅ Use `.in()` for array matching (multiple values)
- ✅ Use `.eq()` for single value matching (legacy)
- ✅ Maintain backward compatibility

---

#### **C. Game Assignment Wrapper** (`src/components/games/templates/GameAssignmentWrapper.tsx`)

Updated vocabulary loading logic to handle multiple subcategories:

```typescript
// Handle multiple subcategories (Enhanced Creator)
if (vocabConfig.subcategories && vocabConfig.subcategories.length > 0) {
  console.log('🎯 [KS3] Applying MULTIPLE subcategory filter:', vocabConfig.subcategories);
  query = query.in('subcategory', vocabConfig.subcategories);
  
  if (vocabConfig.categories && vocabConfig.categories.length > 0) {
    query = query.in('category', vocabConfig.categories);
  }
}
// Handle multiple categories (Enhanced Creator)
else if (vocabConfig.categories && vocabConfig.categories.length > 0) {
  query = query.in('category', vocabConfig.categories);
}
// Handle single category/subcategory (Quick Creator / Legacy)
else {
  if (vocabConfig.category) {
    query = query.eq('category', vocabConfig.category);
  }
  if (vocabConfig.subcategory) {
    query = query.eq('subcategory', vocabConfig.subcategory);
  }
}

// Fetch ALL matching vocabulary first (no limit)
const { data: allVocab, error: fetchError } = await query;

// Randomly shuffle and select the specified number of words
if (allVocab && allVocab.length > 0 && vocabConfig.wordCount) {
  const shuffled = [...allVocab].sort(() => 0.5 - Math.random());
  fallbackVocab = shuffled.slice(0, vocabConfig.wordCount);
  console.log(`🎲 [KS3] Randomly selected ${fallbackVocab.length} words from ${allVocab.length} available`);
}
```

**Key Changes**:
- ✅ Fetch **ALL** matching vocabulary first (no limit)
- ✅ **Randomly shuffle** and select specified word count
- ✅ Ensures diverse selection across all subcategories

---

### **2. Frontend Changes**

#### **A. Word Count Configuration** (`src/components/assignments/EnhancedAssignmentCreator.tsx`)

Added a new "Vocabulary Settings" section with:

1. **Total Words Input**: Teacher can set 5-100 words
2. **Assignment Preview**: Shows selection summary
3. **Auto-adjustment**: Defaults to 20 for multiple selections, 10 for single

```typescript
<div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-6 border border-amber-100 mb-6">
  <h4>Vocabulary Settings</h4>
  
  <input
    type="number"
    min="5"
    max="100"
    value={gameConfig.vocabularyConfig.wordCount || 20}
    onChange={(e) => {
      const wordCount = parseInt(e.target.value) || 20;
      setGameConfig(prev => ({
        ...prev,
        vocabularyConfig: { ...prev.vocabularyConfig, wordCount }
      }));
    }}
  />
  
  <div className="bg-white rounded-xl p-4">
    <div>📊 Assignment Preview</div>
    <p>✅ {subcategories.length} subcategories selected</p>
    <p>📝 {wordCount} words will be randomly sampled</p>
    <p>Words will be selected from: {subcategories.slice(0, 3).join(', ')}...</p>
  </div>
</div>
```

**Features**:
- ✅ Clear word count control (5-100 range)
- ✅ Real-time preview of selection
- ✅ Shows which subcategories are selected
- ✅ Recommended ranges (10-20 for quick, 30-50 for comprehensive)

---

#### **B. Selection Counter** (`src/components/assignments/DatabaseCategorySelector.tsx`)

Enhanced the selection display:

```typescript
<div className="flex items-center justify-between">
  <div className="flex items-center">
    <CheckCircle className="h-5 w-5 text-blue-600 mr-2" />
    <h4>Selected Content</h4>
  </div>
  <div className="flex items-center space-x-4">
    {selectedSubcategories.length > 0 && (
      <div className="px-3 py-1 bg-blue-100 rounded-full">
        <span className="font-semibold">{selectedSubcategories.length}</span>
        <span className="ml-1">subcategories</span>
      </div>
    )}
  </div>
</div>
```

**Features**:
- ✅ Badge showing count of selected subcategories
- ✅ Separate badge for categories
- ✅ Clear visual feedback

---

#### **C. Select All Button** (`src/components/assignments/DatabaseCategorySelector.tsx`)

Added "Select All" / "Deselect All" button for each category:

```typescript
<button
  onClick={() => {
    const categorySubcategoryIds = category.subcategories.map(s => s.id);
    const allSelected = categorySubcategoryIds.every(id => selectedSubcategories.includes(id));
    
    if (allSelected) {
      // Deselect all
      const newSubcategories = selectedSubcategories.filter(id => !categorySubcategoryIds.includes(id));
      onChange(selectedCategories, newSubcategories);
    } else {
      // Select all
      const newSubcategories = [...new Set([...selectedSubcategories, ...categorySubcategoryIds])];
      onChange(selectedCategories, newSubcategories);
    }
  }}
>
  {allSelected ? 'Deselect All' : 'Select All'}
</button>
```

**Features**:
- ✅ One-click to select all subcategories in a category
- ✅ Toggle between "Select All" and "Deselect All"
- ✅ Smart detection of current state

---

## 📊 Word Count Strategy

### **Default Behavior**

| Selection Type | Default Word Count | Rationale |
|----------------|-------------------|-----------|
| Single subcategory | 10 words | Quick, focused practice |
| Multiple subcategories | 20 words | Diverse selection across topics |
| Single category | 10 words | Focused on one theme |
| Multiple categories | 20 words | Broad coverage |

### **Teacher Control**

- ✅ Teachers can override the default (5-100 words)
- ✅ Recommended ranges shown in UI
- ✅ Preview shows exact word count

### **Random Sampling**

When multiple subcategories are selected:
1. Fetch **ALL** vocabulary from all selected subcategories
2. **Randomly shuffle** the combined list
3. Select the **first N words** (where N = word count)

**Example**: If you select 7 subcategories with 50 words each (350 total), and set word count to 20, the system will randomly select 20 words from the 350 available.

---

## 🎯 User Experience Improvements

### **Before**
- ❌ No indication of how many subcategories selected
- ❌ No control over word count
- ❌ No preview of what will be loaded
- ❌ Confusing when assignment loaded wrong vocabulary

### **After**
- ✅ Clear counter: "7 subcategories selected"
- ✅ Word count input with recommendations
- ✅ Preview: "20 words will be randomly sampled from..."
- ✅ "Select All" button for quick selection
- ✅ Real-time feedback on selection

---

## 🧪 Testing

### **Test Case 1: Multiple Subcategories**
1. Create Comprehensive Assignment
2. Select "Holidays travel culture" category
3. Click "Select All" (selects all 7 subcategories)
4. Set word count to 25
5. Create assignment
6. **Expected**: Assignment loads 25 random words from all 7 subcategories

### **Test Case 2: Single Subcategory**
1. Create Quick Assignment
2. Select "Holidays travel culture" > "Accommodation"
3. Default word count: 10
4. Create assignment
5. **Expected**: Assignment loads 10 words from "Accommodation" only

### **Test Case 3: Word Count Override**
1. Create Comprehensive Assignment
2. Select 3 subcategories
3. Change word count to 50
4. Create assignment
5. **Expected**: Assignment loads 50 random words from 3 subcategories

---

## 📝 Files Modified

1. `src/services/enhancedAssignmentService.ts` - Multiple subcategory support
2. `src/app/api/assignments/create/route.ts` - API route for multiple selections
3. `src/components/games/templates/GameAssignmentWrapper.tsx` - Vocabulary loading
4. `src/components/assignments/EnhancedAssignmentCreator.tsx` - Word count UI
5. `src/components/assignments/DatabaseCategorySelector.tsx` - Selection counter & Select All button

---

## ✅ Summary

**Problem**: Assignments with multiple subcategories weren't saving selections and fell back to default vocabulary.

**Solution**: 
- Added support for **arrays** of categories/subcategories
- Implemented **random sampling** across all selected subcategories
- Added **word count control** with smart defaults
- Enhanced **UI feedback** with counters, previews, and Select All button

**Result**: Teachers can now create assignments with multiple subcategories, control word count, and students will see the correct vocabulary!

