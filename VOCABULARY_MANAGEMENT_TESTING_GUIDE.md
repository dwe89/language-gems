# Vocabulary Management System - Testing Guide

## Overview
This document outlines comprehensive testing for the centralized vocabulary management system with article/base_word functionality.

## Key Features Implemented

### 1. **Article & Base Word System**
- **Problem Solved**: Avoids duplicate audio files for words with articles (el gato vs gato)
- **Solution**: Store article separately, generate audio only for base_word
- **Benefits**: 
  - Cleaner audio storage
  - Consistent game experience (Hangman shows just "gato")
  - Proper gender display (Flashcards show "el gato")

### 2. **Database Schema Enhancements**
- Added `article` column for storing articles (el, la, le, der, die, das, etc.)
- Added `base_word` column for the root word (used for audio generation)
- Added computed `display_word` column that combines article + base_word automatically
- Added proper indexing for performance

### 3. **Comprehensive Admin Interface**
- Full CRUD operations for vocabulary
- CSV upload with validation
- Manual entry form with all fields
- Automatic audio generation using AWS Polly
- Search across all fields including display_word and base_word

## Testing Checklist

### Phase 1: Database & API Testing
- [ ] Database migration applied successfully
- [ ] Article and base_word columns exist
- [ ] Display_word computed column works correctly
- [ ] Audio generation API accepts base_word parameter
- [ ] Audio files generated with base_word, not full word

### Phase 2: Template & Upload Testing
- [ ] Download CSV template includes article/base_word columns
- [ ] Template shows correct examples of article usage
- [ ] CSV upload handles article/base_word fields
- [ ] Validation works for new format
- [ ] Audio generation uses base_word from uploaded data

### Phase 3: Manual Entry Testing
- [ ] Manual entry form has article/base_word fields
- [ ] Form validation works correctly
- [ ] Audio generation uses base_word for manual entries
- [ ] Display shows article + base_word breakdown

### Phase 4: Display & Search Testing
- [ ] Vocabulary table shows display_word
- [ ] Article/base_word breakdown visible
- [ ] Search works across display_word and base_word
- [ ] Audio playback uses correct audio file

### Phase 5: Game Integration Testing
- [ ] VocabMaster loads vocabulary correctly
- [ ] Games show appropriate word format (base_word for Hangman, display_word for flashcards)
- [ ] Audio plays correctly in games

## Test Data

### Sample CSV Data
```csv
word,translation,language,category,subcategory,part_of_speech,difficulty_level,curriculum_level,example_sentence,example_translation,phonetic,gender,irregular_forms,synonyms,antonyms,tags,article,base_word
"el gato","cat","es","animals","pets","noun","beginner","KS3,GCSE_Foundation","El gato está en la casa.","The cat is in the house.","/ˈɡa.to/","masculine","gatos (plural)","felino","perro","animals,pets,basic","el","gato"
"el perro","dog","es","animals","pets","noun","beginner","KS3,GCSE_Foundation","El perro es muy amigable.","The dog is very friendly.","/ˈpe.ro/","masculine","perros (plural)","can","gato","animals,pets,basic","el","perro"
"la mesa","table","es","furniture","household","noun","beginner","KS3,GCSE_Foundation","La mesa está en la cocina.","The table is in the kitchen.","/ˈme.sa/","feminine","mesas (plural)","","","furniture,home,basic","la","mesa"
```

### Expected Behavior
1. **Audio Files**: Should be generated for "gato", "perro", "mesa" (base_word only)
2. **Display**: Should show "el gato", "el perro", "la mesa" (full display_word)
3. **Search**: Should find items when searching for "gato", "el gato", or "cat"

## Manual Test Cases

### Test Case 1: CSV Upload
1. Navigate to `/admin/vocabulary`
2. Download CSV template
3. Verify template includes article/base_word columns
4. Upload sample_vocabulary.csv file
5. Check upload success and audio generation
6. Verify display shows article + base_word breakdown

### Test Case 2: Manual Entry
1. Click "Add Word Manually"
2. Fill in: 
   - Word: "le chat"
   - Translation: "cat" 
   - Language: "fr"
   - Article: "le"
   - Base Word: "chat"
3. Submit and verify audio generation uses "chat"
4. Check display shows "le chat" with breakdown

### Test Case 3: Search Functionality
1. Enter "chat" in search - should find "le chat"
2. Enter "le" in search - should find all "le" articles
3. Enter "cat" in search - should find translation matches

### Test Case 4: Audio Generation
1. Check items without audio have "Generate Audio" button
2. Click button and verify audio generated for base_word
3. Play audio and verify it pronounces base_word only
4. Check file names use base_word pattern

## Validation Criteria

### Success Criteria
- ✅ Article/base_word separation working
- ✅ Audio files use base_word only
- ✅ Display shows full word with article
- ✅ Search works across all word variations
- ✅ Games use appropriate word format
- ✅ No duplicate audio files
- ✅ Performance remains good with new fields

### Performance Benchmarks
- CSV upload: < 30 seconds for 100 items
- Audio generation: < 5 seconds per word
- Search response: < 1 second for 1000+ items
- Page load: < 3 seconds for vocabulary management

## Common Issues & Solutions

### Issue: Audio not generating
**Solution**: Check AWS credentials and Polly permissions

### Issue: Display_word not showing
**Solution**: Verify database migration applied and base_word populated

### Issue: Upload failing with new format
**Solution**: Check CSV headers match exactly, including article/base_word

### Issue: Search not finding words
**Solution**: Verify search includes display_word and base_word fields

## Next Steps After Testing

1. **Production Deployment**: Apply database migrations to production
2. **User Training**: Create guide for educators on article usage
3. **Game Updates**: Ensure all games use appropriate word format
4. **Performance Monitoring**: Monitor audio storage usage and costs
5. **Feature Expansion**: Consider adding more language-specific features

## Access Information

- **Admin Dashboard**: http://localhost:3001/admin/vocabulary
- **Development Server**: Port 3001
- **Database**: Supabase centralized_vocabulary table
- **Audio Storage**: Supabase Storage /audio/vocabulary/ bucket
