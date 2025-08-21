import { describe, it, expect, beforeEach, vi } from 'vitest';
import { VocabularyUploadService, UploadedVocabularyList } from '../services/vocabularyUploadService';
import { EnhancedVocabularyService } from '../services/enhancedVocabularyService';

// Mock Supabase client
const mockSupabase = {
  from: vi.fn(() => ({
    insert: vi.fn(() => ({
      select: vi.fn(() => ({
        single: vi.fn(() => Promise.resolve({ data: { id: 'test-id' }, error: null }))
      }))
    })),
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        order: vi.fn(() => Promise.resolve({ data: [], error: null }))
      }))
    })),
    delete: vi.fn(() => ({
      eq: vi.fn(() => Promise.resolve({ error: null }))
    })),
    update: vi.fn(() => ({
      eq: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: { id: 'test-id' }, error: null }))
        }))
      }))
    }))
  }))
};

describe('VocabularyUploadService', () => {
  let uploadService: VocabularyUploadService;

  beforeEach(() => {
    uploadService = new VocabularyUploadService(mockSupabase as any);
  });

  describe('parseContent', () => {
    it('should parse tab-separated content correctly', () => {
      const content = `gato\tcat\tnoun\tEl gato es negro\tThe cat is black
perro\tdog\tnoun\tMi perro es grande\tMy dog is big`;

      const result = uploadService.parseContent(content, 'words', 'intermediate');

      expect(result.items).toHaveLength(2);
      expect(result.errors).toHaveLength(0);
      expect(result.detectedFormat).toBe('tab');
      expect(result.items[0]).toEqual({
        type: 'word',
        term: 'gato',
        translation: 'cat',
        part_of_speech: 'noun',
        context_sentence: 'El gato es negro',
        context_translation: 'The cat is black',
        difficulty_level: 'intermediate',
        notes: undefined,
        tags: []
      });
    });

    it('should parse comma-separated content correctly', () => {
      const content = `gato, cat, noun, "El gato es negro", "The cat is black"
perro, dog, noun, "Mi perro es grande", "My dog is big"`;

      const result = uploadService.parseContent(content, 'words', 'intermediate');

      expect(result.items).toHaveLength(2);
      expect(result.errors).toHaveLength(0);
      expect(result.detectedFormat).toBe('comma');
    });

    it('should handle quoted CSV content with commas inside quotes', () => {
      const content = `"Hello, world", "Hola, mundo", phrase, "This is a greeting, used daily", "Esto es un saludo, usado diariamente"`;

      const result = uploadService.parseContent(content, 'words', 'intermediate');

      expect(result.items).toHaveLength(1);
      expect(result.errors).toHaveLength(0);
      expect(result.items[0].term).toBe('Hello, world');
      expect(result.items[0].translation).toBe('Hola, mundo');
    });

    it('should detect sentence content type automatically', () => {
      const content = `Me gusta comer pizza los viernes por la noche\tI like to eat pizza on Friday nights`;

      const result = uploadService.parseContent(content, 'words', 'intermediate');

      expect(result.items).toHaveLength(1);
      expect(result.items[0].type).toBe('sentence');
    });

    it('should handle errors for malformed content', () => {
      const content = `gato
incomplete line without translation`;

      const result = uploadService.parseContent(content, 'words', 'intermediate');

      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toContain('At least term and translation are required');
    });

    it('should generate warnings for very long content', () => {
      const longTerm = 'a'.repeat(600);
      const content = `${longTerm}\tcat`;

      const result = uploadService.parseContent(content, 'words', 'intermediate');

      expect(result.warnings).toHaveLength(1);
      expect(result.warnings[0]).toContain('Term is very long');
    });
  });

  describe('validateVocabularyList', () => {
    it('should validate a correct vocabulary list', () => {
      const validList: UploadedVocabularyList = {
        name: 'Test List',
        description: 'A test vocabulary list',
        language: 'spanish',
        difficulty_level: 'intermediate',
        content_type: 'words',
        is_public: false,
        items: [
          {
            type: 'word',
            term: 'gato',
            translation: 'cat',
            difficulty_level: 'intermediate'
          }
        ]
      };

      const errors = uploadService.validateVocabularyList(validList);
      expect(errors).toHaveLength(0);
    });

    it('should return errors for invalid vocabulary list', () => {
      const invalidList: UploadedVocabularyList = {
        name: '',
        description: '',
        language: 'spanish',
        difficulty_level: 'intermediate',
        content_type: 'words',
        is_public: false,
        items: []
      };

      const errors = uploadService.validateVocabularyList(invalidList);
      expect(errors).toContain('List name is required');
      expect(errors).toContain('At least one vocabulary item is required');
    });

    it('should validate maximum item count', () => {
      const items = Array.from({ length: 1001 }, (_, i) => ({
        type: 'word' as const,
        term: `word${i}`,
        translation: `translation${i}`,
        difficulty_level: 'intermediate' as const
      }));

      const listWithTooManyItems: UploadedVocabularyList = {
        name: 'Large List',
        description: 'A list with too many items',
        language: 'spanish',
        difficulty_level: 'intermediate',
        content_type: 'words',
        is_public: false,
        items
      };

      const errors = uploadService.validateVocabularyList(listWithTooManyItems);
      expect(errors).toContain('Maximum 1000 vocabulary items allowed per list');
    });
  });

  describe('uploadVocabularyList', () => {
    it('should upload vocabulary list successfully', async () => {
      const testList: UploadedVocabularyList = {
        name: 'Test List',
        description: 'A test vocabulary list',
        language: 'spanish',
        difficulty_level: 'intermediate',
        content_type: 'words',
        is_public: false,
        items: [
          {
            type: 'word',
            term: 'gato',
            translation: 'cat',
            difficulty_level: 'intermediate'
          }
        ]
      };

      const listId = await uploadService.uploadVocabularyList(testList, 'teacher-id', false);
      expect(listId).toBe('test-id');
    });
  });

  describe('folder management', () => {
    it('should create folder successfully', async () => {
      const folder = await uploadService.createFolder('Test Folder', 'teacher-id', 'Test description');
      expect(folder.id).toBe('test-id');
    });

    it('should get folders for teacher', async () => {
      const folders = await uploadService.getFolders('teacher-id');
      expect(Array.isArray(folders)).toBe(true);
    });
  });
});

describe('EnhancedVocabularyService', () => {
  let vocabularyService: EnhancedVocabularyService;

  beforeEach(() => {
    vocabularyService = new EnhancedVocabularyService(mockSupabase as any);
  });

  describe('createVocabularyList', () => {
    it('should create vocabulary list with items', async () => {
      const listData = {
        name: 'Test List',
        description: 'A test list',
        teacher_id: 'teacher-id',
        language: 'spanish' as const,
        difficulty_level: 'intermediate' as const,
        content_type: 'words' as const,
        is_public: false,
        word_count: 1
      };

      const items = [
        {
          type: 'word' as const,
          term: 'gato',
          translation: 'cat',
          difficulty_level: 'intermediate' as const
        }
      ];

      const result = await vocabularyService.createVocabularyList(listData, items);
      expect(result.id).toBe('test-id');
    });
  });

  describe('getVocabularyLists', () => {
    it('should retrieve vocabulary lists for teacher', async () => {
      const lists = await vocabularyService.getVocabularyLists({ teacher_id: 'teacher-id' });
      expect(Array.isArray(lists)).toBe(true);
    });

    it('should filter by language', async () => {
      const lists = await vocabularyService.getVocabularyLists({ 
        teacher_id: 'teacher-id',
        language: 'spanish'
      });
      expect(Array.isArray(lists)).toBe(true);
    });

    it('should filter by content type', async () => {
      const lists = await vocabularyService.getVocabularyLists({ 
        teacher_id: 'teacher-id',
        content_type: 'words'
      });
      expect(Array.isArray(lists)).toBe(true);
    });
  });

  describe('game compatibility', () => {
    it('should check list compatibility with games', () => {
      const testList = {
        id: 'test-id',
        name: 'Test List',
        description: 'A test list',
        teacher_id: 'teacher-id',
        language: 'spanish' as const,
        difficulty_level: 'intermediate' as const,
        content_type: 'words' as const,
        is_public: false,
        word_count: 10,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const compatibility = vocabularyService.isListCompatibleWithGame(testList, 'noughts-and-crosses');
      expect(compatibility.compatible).toBe(true);
      expect(compatibility.issues).toHaveLength(0);
    });

    it('should detect incompatibility issues', () => {
      const testList = {
        id: 'test-id',
        name: 'Test List',
        description: 'A test list',
        teacher_id: 'teacher-id',
        language: 'spanish' as const,
        difficulty_level: 'intermediate' as const,
        content_type: 'sentences' as const,
        is_public: false,
        word_count: 10,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const compatibility = vocabularyService.isListCompatibleWithGame(testList, 'noughts-and-crosses');
      expect(compatibility.compatible).toBe(false);
      expect(compatibility.issues.length).toBeGreaterThan(0);
    });
  });

  describe('static methods', () => {
    it('should get game compatibility info', () => {
      const compatibility = EnhancedVocabularyService.getGameCompatibility('noughts-and-crosses');
      expect(compatibility).toBeDefined();
      expect(compatibility?.game_type).toBe('noughts-and-crosses');
    });

    it('should get supported game types', () => {
      const gameTypes = EnhancedVocabularyService.getSupportedGameTypes();
      expect(Array.isArray(gameTypes)).toBe(true);
      expect(gameTypes.length).toBeGreaterThan(0);
    });
  });
});

describe('Integration Tests', () => {
  it('should handle complete workflow: parse -> validate -> upload', async () => {
    const uploadService = new VocabularyUploadService(mockSupabase as any);
    
    // Step 1: Parse content
    const content = `gato\tcat\tnoun
perro\tdog\tnoun
correr\tto run\tverb`;

    const parsed = uploadService.parseContent(content, 'words', 'intermediate');
    expect(parsed.items).toHaveLength(3);
    expect(parsed.errors).toHaveLength(0);

    // Step 2: Create vocabulary list
    const listData: UploadedVocabularyList = {
      name: 'Integration Test List',
      description: 'A test list for integration testing',
      language: 'spanish',
      difficulty_level: 'intermediate',
      content_type: 'words',
      is_public: false,
      items: parsed.items
    };

    // Step 3: Validate
    const errors = uploadService.validateVocabularyList(listData);
    expect(errors).toHaveLength(0);

    // Step 4: Upload
    const listId = await uploadService.uploadVocabularyList(listData, 'teacher-id', false);
    expect(listId).toBe('test-id');
  });
});
