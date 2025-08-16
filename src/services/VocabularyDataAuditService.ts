/**
 * Vocabulary Data Audit Service
 * 
 * Comprehensive analysis and categorization of centralized_vocabulary entries
 * to identify data quality issues and prepare for hybrid curation approach.
 */

import { SupabaseClient } from '@supabase/supabase-js';

export interface VocabularyEntry {
  id: string;
  word: string;
  translation: string;
  language: string;
  is_mwe?: boolean;
  mwe_type?: string;
  component_words?: string[];
  base_word?: string;
  should_track_for_fsrs: boolean;
}

export interface DataIssue {
  id: string;
  word: string;
  language: string;
  issueType: 'conjugated_verb' | 'plural_noun' | 'incorrect_mwe' | 'missing_mwe' | 
             'wrong_mwe_type' | 'punctuation_issue' | 'inconsistent_base_word';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  suggestedFix?: any;
  confidence: number;
  category: 'A' | 'B'; // A = Automated fix, B = AI review needed
}

export interface AuditResults {
  totalEntries: number;
  categoryA: DataIssue[]; // Simple automated fixes
  categoryB: DataIssue[]; // Complex cases needing AI review
  alreadyCorrect: number;
  summary: {
    conjugatedVerbs: number;
    pluralNouns: number;
    incorrectMWEs: number;
    missingMWEs: number;
    wrongMWETypes: number;
    punctuationIssues: number;
    inconsistentBaseWords: number;
  };
}

export class VocabularyDataAuditService {
  private supabase: SupabaseClient;

  // Common verb endings for conjugation detection
  private verbEndings = {
    es: {
      present: ['o', 'as', 'a', 'amos', 'áis', 'an', 'es', 'e', 'emos', 'éis', 'en', 'imos', 'ís'],
      preterite: ['é', 'aste', 'ó', 'amos', 'asteis', 'aron', 'í', 'iste', 'ió', 'imos', 'isteis', 'ieron'],
      imperfect: ['aba', 'abas', 'aba', 'ábamos', 'abais', 'aban', 'ía', 'ías', 'ía', 'íamos', 'íais', 'ían']
    },
    fr: {
      present: ['e', 'es', 'e', 'ons', 'ez', 'ent', 'is', 'it', 'issons', 'issez', 'issent'],
      past: ['ai', 'as', 'a', 'âmes', 'âtes', 'èrent', 'is', 'it', 'îmes', 'îtes', 'irent']
    },
    de: {
      present: ['e', 'st', 't', 'en', 't', 'en'],
      past: ['te', 'test', 'te', 'ten', 'tet', 'ten']
    }
  };

  // Common plural patterns
  private pluralPatterns = {
    es: [/s$/, /es$/],
    fr: [/s$/, /x$/],
    de: [/e$/, /er$/, /en$/]
  };

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  /**
   * Run comprehensive audit of centralized_vocabulary
   */
  async auditVocabularyData(): Promise<AuditResults> {
    console.log('🔍 Starting comprehensive vocabulary data audit...');

    // Get all vocabulary entries
    const { data: entries, error } = await this.supabase
      .from('centralized_vocabulary')
      .select('*')
      .eq('should_track_for_fsrs', true)
      .order('language, word');

    if (error || !entries) {
      throw new Error(`Failed to fetch vocabulary data: ${error?.message}`);
    }

    console.log(`📊 Analyzing ${entries.length} vocabulary entries...`);

    const issues: DataIssue[] = [];
    let alreadyCorrect = 0;

    // Analyze each entry
    for (const entry of entries) {
      const entryIssues = await this.analyzeEntry(entry);
      if (entryIssues.length === 0) {
        alreadyCorrect++;
      } else {
        issues.push(...entryIssues);
      }
    }

    // Categorize issues
    const categoryA = issues.filter(issue => issue.category === 'A');
    const categoryB = issues.filter(issue => issue.category === 'B');

    // Generate summary
    const summary = this.generateSummary(issues);

    const results: AuditResults = {
      totalEntries: entries.length,
      categoryA,
      categoryB,
      alreadyCorrect,
      summary
    };

    console.log('✅ Audit completed:', {
      total: results.totalEntries,
      alreadyCorrect: results.alreadyCorrect,
      categoryA: results.categoryA.length,
      categoryB: results.categoryB.length
    });

    return results;
  }

  /**
   * Analyze individual vocabulary entry for issues
   */
  private async analyzeEntry(entry: VocabularyEntry): Promise<DataIssue[]> {
    const issues: DataIssue[] = [];

    // Check for conjugated verbs
    const conjugationIssue = this.checkConjugatedVerb(entry);
    if (conjugationIssue) issues.push(conjugationIssue);

    // Check for plural nouns
    const pluralIssue = this.checkPluralNoun(entry);
    if (pluralIssue) issues.push(pluralIssue);

    // Check MWE classification
    const mweIssues = this.checkMWEClassification(entry);
    issues.push(...mweIssues);

    // Check for punctuation issues
    const punctuationIssue = this.checkPunctuationIssues(entry);
    if (punctuationIssue) issues.push(punctuationIssue);

    // Check base_word consistency
    const baseWordIssue = this.checkBaseWordConsistency(entry);
    if (baseWordIssue) issues.push(baseWordIssue);

    return issues;
  }

  /**
   * Check if entry contains conjugated verb instead of infinitive
   */
  private checkConjugatedVerb(entry: VocabularyEntry): DataIssue | null {
    const { word, language } = entry;
    
    // Skip if already marked as MWE
    if (entry.is_mwe) return null;

    // Check against known conjugated forms
    const knownConjugated = [
      'prefiero', 'prefieres', 'prefiere', 'preferimos', 'preferís', 'prefieren',
      'bailo', 'bailas', 'baila', 'bailamos', 'bailáis', 'bailan',
      'como', 'comes', 'come', 'comemos', 'coméis', 'comen',
      'hablo', 'hablas', 'habla', 'hablamos', 'habláis', 'hablan'
    ];

    if (knownConjugated.includes(word.toLowerCase())) {
      return {
        id: entry.id,
        word: entry.word,
        language: entry.language,
        issueType: 'conjugated_verb',
        severity: 'high',
        description: `"${word}" appears to be a conjugated form, should be infinitive`,
        confidence: 0.9,
        category: 'B' // Needs AI to determine correct infinitive
      };
    }

    // Check patterns for potential conjugations
    const endings = this.verbEndings[language as keyof typeof this.verbEndings];
    if (endings) {
      const allEndings = [
        ...endings.present,
        ...(endings.preterite || []),
        ...(endings.imperfect || []),
        ...(endings.past || [])
      ];
      const hasConjugatedEnding = allEndings.some(ending =>
        word.length > ending.length + 2 && word.endsWith(ending)
      );

      if (hasConjugatedEnding && !word.endsWith('ar') && !word.endsWith('er') && !word.endsWith('ir')) {
        return {
          id: entry.id,
          word: entry.word,
          language: entry.language,
          issueType: 'conjugated_verb',
          severity: 'medium',
          description: `"${word}" may be conjugated (ends with ${word.slice(-2)})`,
          confidence: 0.6,
          category: 'B'
        };
      }
    }

    return null;
  }

  /**
   * Check if entry contains plural noun instead of singular
   */
  private checkPluralNoun(entry: VocabularyEntry): DataIssue | null {
    const { word, language } = entry;
    
    // Skip if already marked as MWE
    if (entry.is_mwe) return null;

    const patterns = this.pluralPatterns[language as keyof typeof this.pluralPatterns];
    if (!patterns) return null;

    // Check for obvious plurals
    const obviousPlurals = ['casas', 'libros', 'coches', 'maisons', 'livres', 'voitures'];
    if (obviousPlurals.includes(word.toLowerCase())) {
      const singular = word.endsWith('s') ? word.slice(0, -1) : word;
      return {
        id: entry.id,
        word: entry.word,
        language: entry.language,
        issueType: 'plural_noun',
        severity: 'medium',
        description: `"${word}" appears to be plural, should be "${singular}"`,
        suggestedFix: { word: singular, base_word: singular },
        confidence: 0.8,
        category: 'A' // Can be automated
      };
    }

    return null;
  }

  /**
   * Check MWE classification issues
   */
  private checkMWEClassification(entry: VocabularyEntry): DataIssue[] {
    const issues: DataIssue[] = [];
    const { word, is_mwe, mwe_type } = entry;

    // Check for missing MWE classification
    if (word.includes(' ') || word.includes("'")) {
      if (!is_mwe) {
        // French contractions
        if (word.match(/^[ld]'/)) {
          issues.push({
            id: entry.id,
            word: entry.word,
            language: entry.language,
            issueType: 'missing_mwe',
            severity: 'medium',
            description: `"${word}" is a contraction, should be marked as MWE`,
            suggestedFix: {
              is_mwe: true,
              mwe_type: 'contraction',
              component_words: word.split("'")
            },
            confidence: 0.9,
            category: 'A'
          });
        } else {
          issues.push({
            id: entry.id,
            word: entry.word,
            language: entry.language,
            issueType: 'missing_mwe',
            severity: 'medium',
            description: `"${word}" contains spaces/apostrophes but not marked as MWE`,
            confidence: 0.7,
            category: 'B'
          });
        }
      }
    }

    // Check for incorrect MWE type
    if (is_mwe && mwe_type) {
      const obviousNounPhrases = ['la maison', 'la casa', 'das Haus', 'le livre'];
      if (obviousNounPhrases.some(phrase => word.toLowerCase().includes(phrase.toLowerCase()))) {
        if (mwe_type !== 'noun_phrase') {
          issues.push({
            id: entry.id,
            word: entry.word,
            language: entry.language,
            issueType: 'wrong_mwe_type',
            severity: 'low',
            description: `"${word}" should be mwe_type: "noun_phrase", not "${mwe_type}"`,
            suggestedFix: { mwe_type: 'noun_phrase' },
            confidence: 0.8,
            category: 'A'
          });
        }
      }
    }

    return issues;
  }

  /**
   * Check for punctuation issues
   */
  private checkPunctuationIssues(entry: VocabularyEntry): DataIssue | null {
    const { word } = entry;
    
    const hasPunctuation = /[¿¡!?.,;:]/.test(word);
    if (hasPunctuation) {
      return {
        id: entry.id,
        word: entry.word,
        language: entry.language,
        issueType: 'punctuation_issue',
        severity: 'medium',
        description: `"${word}" contains punctuation that may need special handling`,
        confidence: 0.8,
        category: 'B' // Needs careful AI analysis
      };
    }

    return null;
  }

  /**
   * Check base_word consistency
   */
  private checkBaseWordConsistency(entry: VocabularyEntry): DataIssue | null {
    const { word, base_word, is_mwe } = entry;

    if (!base_word) {
      return {
        id: entry.id,
        word: entry.word,
        language: entry.language,
        issueType: 'inconsistent_base_word',
        severity: 'low',
        description: `Missing base_word, should be "${word}"`,
        suggestedFix: { base_word: word },
        confidence: 0.9,
        category: 'A'
      };
    }

    // For single words, base_word should match word (after lemmatization)
    // For MWEs, base_word should match word
    if (is_mwe && base_word !== word) {
      return {
        id: entry.id,
        word: entry.word,
        language: entry.language,
        issueType: 'inconsistent_base_word',
        severity: 'low',
        description: `MWE base_word "${base_word}" should match word "${word}"`,
        suggestedFix: { base_word: word },
        confidence: 0.8,
        category: 'A'
      };
    }

    return null;
  }

  /**
   * Generate summary statistics
   */
  private generateSummary(issues: DataIssue[]) {
    const summary = {
      conjugatedVerbs: 0,
      pluralNouns: 0,
      incorrectMWEs: 0,
      missingMWEs: 0,
      wrongMWETypes: 0,
      punctuationIssues: 0,
      inconsistentBaseWords: 0
    };

    issues.forEach(issue => {
      switch (issue.issueType) {
        case 'conjugated_verb': summary.conjugatedVerbs++; break;
        case 'plural_noun': summary.pluralNouns++; break;
        case 'incorrect_mwe': summary.incorrectMWEs++; break;
        case 'missing_mwe': summary.missingMWEs++; break;
        case 'wrong_mwe_type': summary.wrongMWETypes++; break;
        case 'punctuation_issue': summary.punctuationIssues++; break;
        case 'inconsistent_base_word': summary.inconsistentBaseWords++; break;
      }
    });

    return summary;
  }

  /**
   * Export audit results to JSON file
   */
  async exportAuditResults(results: AuditResults, filename: string = 'vocabulary-audit-results.json') {
    const fs = await import('fs/promises');
    await fs.writeFile(filename, JSON.stringify(results, null, 2));
    console.log(`📄 Audit results exported to ${filename}`);
  }
}
