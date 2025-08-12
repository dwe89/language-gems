# KS4 Theme and Unit Selection Implementation

## Overview

The ContentConfigurationStep in the assignment creation process has been enhanced to provide proper KS4 (GCSE) content selection based on actual curriculum themes and units stored in the `centralized_vocabulary` table.

## Changes Made

### 1. New KS4ThemeUnitSelector Component

Created a new component (`/src/components/assignments/KS4ThemeUnitSelector.tsx`) that:

- Reads theme and unit data directly from the `centralized_vocabulary` table
- Supports both AQA and Edexcel exam boards
- Handles compound theme names (separated by semicolons) 
- Provides a hierarchical selection interface with themes containing units
- Includes search functionality
- Enforces selection limits
- Shows real-time selection summaries

### 2. Updated CurriculumContentSelector

Modified `/src/components/assignments/CurriculumContentSelector.tsx` to:

- Import and use the new `KS4ThemeUnitSelector` for KS4 content selection
- Update the `ContentConfig` interface to include `units` field
- Replace the generic DatabaseCategorySelector with the specialized KS4 component

### 3. Enhanced ContentConfigurationStep

Updated `/src/components/assignments/steps/ContentConfigurationStep.tsx` to:

- Support both legacy category/subcategory and new theme/unit structures
- Properly map KS4 themes and units to game and assessment configurations
- Maintain backward compatibility with existing assignments

### 4. Extended Type Definitions

Enhanced `/src/components/assignments/types/AssignmentTypes.ts` to:

- Add `themes` and `units` arrays to `VocabularyConfig`
- Include `examBoard` and `tier` fields for KS4 support
- Maintain backward compatibility with existing interfaces

## Database Integration

The component directly queries the `centralized_vocabulary` table using these fields:

- `theme_name`: The curriculum theme (e.g., "People and lifestyle")
- `unit_name`: The specific unit within a theme (e.g., "Identity and relationships")
- `exam_board_code`: Distinguishes between "AQA" and "edexcel" content
- `curriculum_level`: Filters for "KS4" content
- `language`: Filters by target language ("es", "fr", "de")

## Theme and Unit Structure

### AQA Themes:
- Communication and the world around us
- People and lifestyle  
- Popular culture
- Cultural items
- General

### Edexcel Themes:
- My personal world
- My neighborhood
- Studying and my future
- Travel and tourism
- Media and technology
- Cultural
- General

Each theme contains multiple units that teachers can select individually or as part of theme selection.

## User Experience

1. **Exam Board Selection**: Teachers first select AQA or Edexcel
2. **Tier Selection**: Choose Foundation or Higher tier
3. **Theme Selection**: Browse and select relevant curriculum themes
4. **Unit Selection**: Expand themes to select specific units
5. **Search**: Quick filtering of themes and units
6. **Summary**: Real-time display of selected content

## Backward Compatibility

The system maintains full backward compatibility by:

- Mapping KS4 themes to the `categories` field in existing game configs
- Mapping KS4 units to the `subcategories` field in existing configs
- Preserving all existing KS3 functionality unchanged
- Supporting legacy assignments without modification

## Benefits

- **Curriculum Aligned**: Content selection now matches official GCSE specifications
- **Exam Board Specific**: Proper separation of AQA and Edexcel content
- **Hierarchical Organization**: Logical theme → unit structure
- **Real Data**: Content based on actual vocabulary database entries
- **Flexible Selection**: Teachers can select themes, units, or combinations
- **Better UX**: Specialized interface designed for GCSE content structure

This implementation provides teachers with a much more intuitive and curriculum-aligned way to select content for KS4 assignments while maintaining full compatibility with the existing system.
