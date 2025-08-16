/**
 * Vocabulary Preprocessing Service
 * 
 * Cleans and standardizes the 'word' column in centralized_vocabulary
 * before AI processing to maximize the value of GPT-5-Nano analysis.
 */

import { SupabaseClient } from '@supabase/supabase-js';

export interface PreprocessingRule {
  name: string;
  description: string;
  pattern: RegExp;
  replacement: (match: string, ...groups: string[]) => string;
  examples: { before: string; after: string }[];
}

export interface PreprocessingResult {
  id: string;
  originalWord: string;
  cleanedWord: string;
  appliedRules: string[];
  confidence: number;
}

export interface PreprocessingSummary {
  totalProcessed: number;
  totalChanged: number;
  ruleApplications: Record<string, number>;
  results: PreprocessingResult[];
  dryRun: boolean;
}

export class VocabularyPreprocessingService {
  private supabase: SupabaseClient;

  // Preprocessing rules in order of application
  private rules: PreprocessingRule[] = [
    {
      name: 'remove_grammatical_notes',
      description: 'Remove grammatical information in parentheses',
      pattern: /^(.+?)\s*\([^)]*\)$/,
      replacement: (match, baseWord) => baseWord.trim(),
      examples: [
        { before: 'erzählen (von + noun)', after: 'erzählen' },
        { before: 'warten (auf acc. + noun)', after: 'warten' },
        { before: 'formar; formarse (en, como)', after: 'formar; formarse' }
      ]
    },
    {
      name: 'extract_primary_verb_form',
      description: 'Extract primary verb from multiple forms with semicolons',
      pattern: /^([^;]+);.+$/,
      replacement: (match, primaryForm) => primaryForm.trim(),
      examples: [
        { before: 'formar; formarse (en, como)', after: 'formar' },
        { before: 'amüsieren; sich acc. amüsieren', after: 'amüsieren' }
      ]
    },
    {
      name: 'remove_gender_articles',
      description: 'Remove gender variants with articles',
      pattern: /^(le\/la|la\/le|el\/la|la\/el|der\/die|die\/der)\s+(.+)$/,
      replacement: (match, articles, noun) => noun.trim(),
      examples: [
        { before: 'le/la pilote', after: 'pilote' },
        { before: 'el/la estudiante', after: 'estudiante' },
        { before: 'der/die Lehrer', after: 'Lehrer' }
      ]
    },
    {
      name: 'extract_primary_variant',
      description: 'Extract primary form from comma-separated variants',
      pattern: /^([^,]+),\s*.+$/,
      replacement: (match, primaryForm) => primaryForm.trim(),
      examples: [
        { before: 'parce que, parce qu\'', after: 'parce que' },
        { before: 'allein, alleine', after: 'allein' }
      ]
    },
    {
      name: 'extract_masculine_singular',
      description: 'Extract masculine singular from inflected forms',
      pattern: /^(vuestro|nuestro|este|ese|aquel),\s+(vuestra|nuestra|esta|esa|aquella),?\s*.+$/,
      replacement: (match, masculine) => masculine.trim(),
      examples: [
        { before: 'vuestro, vuestra, vuestros, vuestras', after: 'vuestro' },
        { before: 'nuestro, nuestra, nuestros, nuestras', after: 'nuestro' }
      ]
    },
    {
      name: 'clean_parenthetical_variants',
      description: 'Remove parenthetical verb variants',
      pattern: /^(\w+)\s*\((\w+)\)$/,
      replacement: (match, base, variant) => base.trim(),
      examples: [
        { before: '(an)bieten', after: 'anbieten' },
        { before: '(sich) waschen', after: 'waschen' }
      ]
    },
    {
      name: 'normalize_whitespace',
      description: 'Normalize multiple spaces and trim',
      pattern: /\s+/g,
      replacement: () => ' ',
      examples: [
        { before: 'word   with    spaces', after: 'word with spaces' }
      ]
    }
  ];

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  /**
   * Apply preprocessing rules to clean a single word
   */
  cleanWord(word: string): { cleanedWord: string; appliedRules: string[] } {
    let cleaned = word.trim();
    const appliedRules: string[] = [];

    for (const rule of this.rules) {
      const before = cleaned;
      cleaned = cleaned.replace(rule.pattern, rule.replacement);
      
      if (cleaned !== before) {
        appliedRules.push(rule.name);
      }
    }

    // Final cleanup
    cleaned = cleaned.trim();

    return { cleanedWord: cleaned, appliedRules };
  }

  /**
   * Process all vocabulary entries with preprocessing rules
   */
  async preprocessVocabulary(dryRun: boolean = true): Promise<PreprocessingSummary> {
    console.log(`🧹 ${dryRun ? 'DRY RUN:' : ''} Starting vocabulary preprocessing...`);

    // Get all vocabulary entries
    const { data: entries, error } = await this.supabase
      .from('centralized_vocabulary')
      .select('id, word, base_word, language')
      .eq('should_track_for_fsrs', true)
      .order('language, word');

    if (error || !entries) {
      throw new Error(`Failed to fetch vocabulary data: ${error?.message}`);
    }

    console.log(`📊 Processing ${entries.length} vocabulary entries...`);

    const results: PreprocessingResult[] = [];
    const ruleApplications: Record<string, number> = {};
    let totalChanged = 0;

    // Initialize rule counters
    this.rules.forEach(rule => {
      ruleApplications[rule.name] = 0;
    });

    // Process each entry
    for (const entry of entries) {
      const { cleanedWord, appliedRules } = this.cleanWord(entry.word);
      
      // Calculate confidence based on number of rules applied
      const confidence = appliedRules.length === 0 ? 1.0 : 
                        Math.max(0.7, 1.0 - (appliedRules.length * 0.1));

      const result: PreprocessingResult = {
        id: entry.id,
        originalWord: entry.word,
        cleanedWord,
        appliedRules,
        confidence
      };

      results.push(result);

      // Track changes
      if (cleanedWord !== entry.word) {
        totalChanged++;
        appliedRules.forEach(rule => {
          ruleApplications[rule]++;
        });
      }
    }

    // Apply changes to database if not dry run
    if (!dryRun && totalChanged > 0) {
      console.log(`💾 Applying ${totalChanged} changes to database...`);
      await this.applyChangesToDatabase(results.filter(r => r.cleanedWord !== r.originalWord));
    }

    const summary: PreprocessingSummary = {
      totalProcessed: entries.length,
      totalChanged,
      ruleApplications,
      results: results.filter(r => r.cleanedWord !== r.originalWord), // Only return changed entries
      dryRun
    };

    console.log(`✅ Preprocessing ${dryRun ? 'analysis' : 'application'} complete!`);
    return summary;
  }

  /**
   * Apply preprocessing changes to the database
   */
  private async applyChangesToDatabase(changes: PreprocessingResult[]): Promise<void> {
    console.log(`🔄 Updating ${changes.length} entries in database...`);

    const batchSize = 100;
    let processed = 0;

    for (let i = 0; i < changes.length; i += batchSize) {
      const batch = changes.slice(i, i + batchSize);
      
      // Execute individual updates to avoid RLS issues
      for (const change of batch) {
        const { error } = await this.supabase
          .from('centralized_vocabulary')
          .update({
            word: change.cleanedWord,
            base_word: change.cleanedWord
          })
          .eq('id', change.id);

        if (error) {
          console.error(`❌ Failed to update entry ${change.id}:`, error);
          throw new Error(`Database update failed: ${error.message}`);
        }
      }

      processed += batch.length;
      console.log(`   Updated ${processed}/${changes.length} entries...`);
    }

    console.log(`✅ Database updates complete!`);
  }

  /**
   * Show examples of what each rule does
   */
  showRuleExamples(): void {
    console.log('🔍 PREPROCESSING RULES EXAMPLES');
    console.log('=' .repeat(60));

    this.rules.forEach((rule, index) => {
      console.log(`${index + 1}. ${rule.name.toUpperCase()}`);
      console.log(`   Description: ${rule.description}`);
      console.log(`   Examples:`);
      
      rule.examples.forEach(example => {
        console.log(`      "${example.before}" → "${example.after}"`);
      });
      console.log('');
    });
  }

  /**
   * Test preprocessing rules on sample data
   */
  testRules(sampleWords: string[]): void {
    console.log('🧪 TESTING PREPROCESSING RULES');
    console.log('=' .repeat(60));

    sampleWords.forEach((word, index) => {
      const { cleanedWord, appliedRules } = this.cleanWord(word);
      console.log(`${index + 1}. "${word}"`);
      
      if (cleanedWord !== word) {
        console.log(`   → "${cleanedWord}"`);
        console.log(`   Rules applied: ${appliedRules.join(', ')}`);
      } else {
        console.log(`   → No changes needed`);
      }
      console.log('');
    });
  }

  /**
   * Export preprocessing results for review
   */
  async exportResults(summary: PreprocessingSummary, filename: string = 'preprocessing-results.json'): Promise<void> {
    const fs = await import('fs/promises');
    
    const exportData = {
      exportedAt: new Date().toISOString(),
      summary: {
        totalProcessed: summary.totalProcessed,
        totalChanged: summary.totalChanged,
        changePercentage: ((summary.totalChanged / summary.totalProcessed) * 100).toFixed(1),
        dryRun: summary.dryRun
      },
      ruleApplications: summary.ruleApplications,
      changes: summary.results,
      ruleDefinitions: this.rules.map(rule => ({
        name: rule.name,
        description: rule.description,
        examples: rule.examples
      }))
    };

    await fs.writeFile(filename, JSON.stringify(exportData, null, 2));
    console.log(`📄 Preprocessing results exported to ${filename}`);
  }
}
