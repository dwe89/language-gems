import Papa from 'papaparse';
import { createClient } from '@supabase/supabase-js';

class GCSEVocabularyProcessor {
  constructor() {
    // Use your existing Supabase config
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    this.vocabularyCache = new Map();
  }

  // Process multiple CSV files and handle all the deduplication automatically
  async processMultipleCSVs(csvFiles) {
    console.log(`Processing ${csvFiles.length} CSV files...`);
    
    const allVocabulary = [];
    const allAssignments = [];

    // Process each CSV file
    for (const file of csvFiles) {
      console.log(`Processing ${file.name}...`);
      const { vocabulary, assignments } = await this.processCSV(file);
      allVocabulary.push(...vocabulary);
      allAssignments.push(...assignments);
    }

    // Deduplicate vocabulary entries
    const uniqueVocabulary = this.deduplicateVocabulary(allVocabulary);
    console.log(`Deduplicated: ${allVocabulary.length} → ${uniqueVocabulary.length} unique words`);
    
    // Upload to your GCSE tables
    await this.uploadToSupabase(uniqueVocabulary, allAssignments);
    
    return {
      vocabularyCount: uniqueVocabulary.length,
      assignmentCount: allAssignments.length,
      filesProcessed: csvFiles.length
    };
  }

  // Process individual CSV file
  async processCSV(file) {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            console.warn(`Parsing warnings for ${file.name}:`, results.errors);
          }

          const vocabulary = [];
          const assignments = [];

          results.data.forEach((row, index) => {
            try {
              // Validate required fields
              if (!row.language || !row.word || !row.translation) {
                console.warn(`Skipping row ${index + 1}: Missing required fields`);
                return;
              }

              // Create vocabulary entry
              const vocabKey = `${row.language}-${row.word.trim()}-${row.translation.trim()}`;
              const vocabEntry = {
                key: vocabKey,
                language: row.language.trim(),
                word: row.word.trim(),
                translation: row.translation.trim(),
                word_type: row.word_type?.trim() || null,
                gender: row.gender?.trim() || null,
                article: row.article?.trim() || null,
                display_word: row.display_word?.trim() || null,
                example_sentence_original: row.example_sentence_original?.trim() || null,
                example_sentence_translation: row.example_sentence_translation?.trim() || null,
                frequency_rank: parseInt(row.frequency_rank) || null
              };

              vocabulary.push(vocabEntry);

              // Create assignment entry
              // Handle both "both" tier and specific tiers
              const tierValue = row.tier?.trim().toLowerCase();
              const tiers = tierValue === 'both' ? ['foundation', 'higher'] : [tierValue];
              
              tiers.forEach(tier => {
                assignments.push({
                  vocabulary_key: vocabKey,
                  exam_board_code: row.exam_board_code?.trim(),
                  theme_name: row.theme_name?.trim(),
                  unit_name: row.unit_name?.trim(),
                  tier: tier,
                  is_required: row.is_required === true || row.is_required === 'true'
                });
              });

            } catch (error) {
              console.error(`Error processing row ${index + 1}:`, error, row);
            }
          });

          resolve({ vocabulary, assignments });
        },
        error: (error) => {
          console.error(`Error parsing ${file.name}:`, error);
          reject(error);
        }
      });
    });
  }

  // Deduplicate vocabulary entries (keep the one with most complete data)
  deduplicateVocabulary(vocabularyArray) {
    const uniqueVocab = new Map();
    
    vocabularyArray.forEach(vocab => {
      const existing = uniqueVocab.get(vocab.key);
      
      if (!existing) {
        uniqueVocab.set(vocab.key, vocab);
      } else {
        // Keep the entry with more complete data
        const currentScore = this.calculateCompletenessScore(vocab);
        const existingScore = this.calculateCompletenessScore(existing);
        
        if (currentScore > existingScore) {
          uniqueVocab.set(vocab.key, vocab);
        }
      }
    });

    return Array.from(uniqueVocab.values());
  }

  // Calculate how complete a vocabulary entry is
  calculateCompletenessScore(vocab) {
    let score = 0;
    if (vocab.word_type) score += 1;
    if (vocab.gender) score += 1;
    if (vocab.article) score += 1;
    if (vocab.display_word && vocab.display_word !== vocab.word) score += 1;
    if (vocab.example_sentence_original) score += 2;
    if (vocab.example_sentence_translation) score += 2;
    if (vocab.frequency_rank) score += 1;
    return score;
  }

  // Upload to your Supabase GCSE tables
  async uploadToSupabase(vocabulary, assignments) {
    try {
      console.log('Starting upload process...');

      // Step 1: Ensure exam boards exist
      await this.ensureExamBoardsExist(assignments);

      // Step 2: Ensure specifications exist  
      await this.ensureSpecificationsExist(assignments);

      // Step 3: Ensure themes and units exist
      await this.ensureThemesAndUnitsExist(assignments);

      // Step 4: Upload vocabulary to gcse_core_vocabulary
      console.log('Uploading core vocabulary...');
      const { data: vocabData, error: vocabError } = await this.supabase
        .from('gcse_core_vocabulary')
        .upsert(vocabulary.map(v => ({
          language: v.language,
          word: v.word,
          translation: v.translation,
          word_type: v.word_type,
          gender: v.gender,
          article: v.article,
          display_word: v.display_word,
          example_sentence_original: v.example_sentence_original,
          example_sentence_translation: v.example_sentence_translation,
          frequency_rank: v.frequency_rank
        })), {
          onConflict: 'language,word,translation',
          ignoreDuplicates: false
        })
        .select('id, language, word, translation');

      if (vocabError) throw vocabError;

      // Step 5: Create key-to-ID mapping
      const keyToIdMap = new Map();
      vocabData.forEach(vocab => {
        const key = `${vocab.language}-${vocab.word}-${vocab.translation}`;
        keyToIdMap.set(key, vocab.id);
      });

      // Step 6: Upload assignments
      console.log('Uploading vocabulary assignments...');
      const assignmentsWithIds = await this.prepareAssignmentsWithIds(assignments, keyToIdMap);
      
      const { error: assignmentError } = await this.supabase
        .from('gcse_vocabulary_assignments')
        .upsert(assignmentsWithIds, {
          onConflict: 'vocabulary_id,specification_id,unit_id'
        });

      if (assignmentError) throw assignmentError;

      console.log('✅ Upload completed successfully!');
      
      // Generate summary
      const summary = await this.generateUploadSummary(vocabData, assignmentsWithIds);
      console.log('📊 Upload Summary:', summary);
      
      return summary;

    } catch (error) {
      console.error('❌ Upload failed:', error);
      throw error;
    }
  }

  // Ensure exam boards exist in database
  async ensureExamBoardsExist(assignments) {
    const examBoards = [...new Set(assignments.map(a => a.exam_board_code).filter(Boolean))];
    
    for (const boardCode of examBoards) {
      await this.supabase
        .from('exam_boards')
        .upsert({ 
          code: boardCode, 
          name: this.getExamBoardName(boardCode),
          description: `${this.getExamBoardName(boardCode)} examination board`
        }, { 
          onConflict: 'code' 
        });
    }
  }

  // Helper to get full exam board names
  getExamBoardName(code) {
    const names = {
      'AQA': 'Assessment and Qualifications Alliance',
      'Edexcel': 'Pearson Edexcel',
      'OCR': 'Oxford, Cambridge and RSA Examinations'
    };
    return names[code] || code;
  }

  // Ensure specifications exist
  async ensureSpecificationsExist(assignments) {
    const languages = [...new Set(assignments.map(a => a.vocabulary_key.split('-')[0]))];
    const examBoards = [...new Set(assignments.map(a => a.exam_board_code).filter(Boolean))];

    for (const language of languages) {
      for (const boardCode of examBoards) {
        // Get exam board ID
        const { data: boardData } = await this.supabase
          .from('exam_boards')
          .select('id')
          .eq('code', boardCode)
          .single();

        if (boardData) {
          await this.supabase
            .from('gcse_specifications')
            .upsert({
              exam_board_id: boardData.id,
              language: language,
              level: 'GCSE',
              year: 2024
            }, {
              onConflict: 'exam_board_id,language,level,year'
            });
        }
      }
    }
  }

  // Ensure themes and units exist
  async ensureThemesAndUnitsExist(assignments) {
    const themeUnits = new Map();
    
    // Group units by theme
    assignments.forEach(assignment => {
      if (assignment.theme_name && assignment.unit_name) {
        if (!themeUnits.has(assignment.theme_name)) {
          themeUnits.set(assignment.theme_name, new Set());
        }
        themeUnits.get(assignment.theme_name).add(assignment.unit_name);
      }
    });

    // Create themes and units for each specification
    const { data: specifications } = await this.supabase
      .from('gcse_specifications')
      .select('id, language, exam_board_id');

    for (const spec of specifications) {
      let themeOrder = 1;
      for (const [themeName, units] of themeUnits) {
        // Create theme
        const { data: themeData } = await this.supabase
          .from('gcse_themes')
          .upsert({
            specification_id: spec.id,
            name: themeName,
            sort_order: themeOrder++
          }, {
            onConflict: 'specification_id,name'
          })
          .select('id')
          .single();

        // Create units
        let unitNumber = 1;
        for (const unitName of units) {
          await this.supabase
            .from('gcse_units')
            .upsert({
              theme_id: themeData.id,
              name: unitName,
              unit_number: unitNumber++
            }, {
              onConflict: 'theme_id,name'
            });
        }
      }
    }
  }

  // Prepare assignments with proper IDs
  async prepareAssignmentsWithIds(assignments, keyToIdMap) {
    const result = [];

    // Get all the specs, themes, units we'll need
    const { data: specsWithStructure } = await this.supabase
      .from('gcse_specifications')
      .select(`
        id,
        language,
        exam_boards!inner(code),
        gcse_themes(
          id,
          name,
          gcse_units(id, name)
        )
      `);

    for (const assignment of assignments) {
      const vocabularyId = keyToIdMap.get(assignment.vocabulary_key);
      if (!vocabularyId) {
        console.warn(`No vocabulary ID found for key: ${assignment.vocabulary_key}`);
        continue;
      }

      // Find matching specification
      const language = assignment.vocabulary_key.split('-')[0];
      const spec = specsWithStructure.find(s => 
        s.language === language && 
        s.exam_boards.code === assignment.exam_board_code
      );

      if (spec) {
        // Find matching theme
        const theme = spec.gcse_themes.find(t => t.name === assignment.theme_name);
        if (theme) {
          // Find matching unit
          const unit = theme.gcse_units.find(u => u.name === assignment.unit_name);
          if (unit) {
            result.push({
              vocabulary_id: vocabularyId,
              specification_id: spec.id,
              unit_id: unit.id,
              tier: assignment.tier,
              is_required: assignment.is_required
            });
          } else {
            console.warn(`Unit not found: ${assignment.unit_name} in theme ${assignment.theme_name}`);
          }
        } else {
          console.warn(`Theme not found: ${assignment.theme_name}`);
        }
      } else {
        console.warn(`Specification not found for ${language} ${assignment.exam_board_code}`);
      }
    }

    return result;
  }

  // Generate upload summary
  async generateUploadSummary(vocabData, assignments) {
    const languages = [...new Set(vocabData.map(v => v.language))];
    const tiers = [...new Set(assignments.map(a => a.tier))];
    
    return {
      vocabularyCount: vocabData.length,
      assignmentCount: assignments.length,
      languages: languages,
      tiers: tiers,
      avgAssignmentsPerWord: (assignments.length / vocabData.length).toFixed(2)
    };
  }
}

export default GCSEVocabularyProcessor;
