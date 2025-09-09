// Subject management system for LanguageGems
// This module handles subject definitions and lookups for worksheet generation

export interface SubjectMeta {
  id: string;
  name: string;
  category?: string;
  description?: string;
}

// Define the subjects available in LanguageGems
// Focus on language learning subjects since this is LanguageGems
const SUBJECTS: SubjectMeta[] = [
  // Language subjects
  { id: 'spanish', name: 'Spanish', category: 'languages', description: 'Spanish language learning' },
  { id: 'french', name: 'French', category: 'languages', description: 'French language learning' },
  { id: 'german', name: 'German', category: 'languages', description: 'German language learning' },
  { id: 'italian', name: 'Italian', category: 'languages', description: 'Italian language learning' },
  { id: 'portuguese', name: 'Portuguese', category: 'languages', description: 'Portuguese language learning' },
  { id: 'chinese', name: 'Chinese', category: 'languages', description: 'Chinese language learning' },
  { id: 'japanese', name: 'Japanese', category: 'languages', description: 'Japanese language learning' },
  { id: 'russian', name: 'Russian', category: 'languages', description: 'Russian language learning' },
  { id: 'arabic', name: 'Arabic', category: 'languages', description: 'Arabic language learning' },
  
  // Generic language category
  { id: 'languages', name: 'Languages', category: 'languages', description: 'General language learning' },
  
  // Core academic subjects (for broader worksheet support)
  { id: 'english', name: 'English', category: 'core', description: 'English language and literature' },
  { id: 'mathematics', name: 'Mathematics', category: 'core', description: 'Mathematics and numeracy' },
  { id: 'science', name: 'Science', category: 'core', description: 'General science subjects' },
  { id: 'history', name: 'History', category: 'humanities', description: 'History and social studies' },
  { id: 'geography', name: 'Geography', category: 'humanities', description: 'Geography and environmental studies' },
  
  // Science sub-subjects
  { id: 'biology', name: 'Biology', category: 'science', description: 'Biology and life sciences' },
  { id: 'chemistry', name: 'Chemistry', category: 'science', description: 'Chemistry and chemical sciences' },
  { id: 'physics', name: 'Physics', category: 'science', description: 'Physics and physical sciences' },
  
  // Additional subjects
  { id: 'art', name: 'Art', category: 'creative', description: 'Art and design' },
  { id: 'music', name: 'Music', category: 'creative', description: 'Music and performing arts' },
  { id: 'pe', name: 'Physical Education', category: 'practical', description: 'Physical education and sports' },
  { id: 'computer_science', name: 'Computer Science', category: 'technology', description: 'Computing and technology' }
];

// Parent-child relationships for subjects
const SUBJECT_HIERARCHY: Record<string, string> = {
  'biology': 'science',
  'chemistry': 'science',
  'physics': 'science',
  'spanish': 'languages',
  'french': 'languages',
  'german': 'languages',
  'italian': 'languages',
  'portuguese': 'languages',
  'chinese': 'languages',
  'japanese': 'languages',
  'russian': 'languages',
  'arabic': 'languages'
};

/**
 * Find a subject by name or ID (case-insensitive)
 */
export function findSubject(nameOrId: string): SubjectMeta | null {
  if (!nameOrId) return null;
  
  const searchTerm = nameOrId.toLowerCase().trim();
  
  // First try exact ID match
  let subject = SUBJECTS.find(s => s.id.toLowerCase() === searchTerm);
  if (subject) return subject;
  
  // Then try exact name match
  subject = SUBJECTS.find(s => s.name.toLowerCase() === searchTerm);
  if (subject) return subject;
  
  // Try partial matches
  subject = SUBJECTS.find(s => 
    s.name.toLowerCase().includes(searchTerm) || 
    s.id.toLowerCase().includes(searchTerm)
  );
  
  return subject || null;
}

/**
 * Get parent subject information
 */
export function getParentSubject(subjectName: string): { name: string; id: string } | null {
  const subject = findSubject(subjectName);
  if (!subject) return null;
  
  const parentId = SUBJECT_HIERARCHY[subject.id];
  if (!parentId) return null;
  
  const parent = findSubject(parentId);
  return parent ? { name: parent.name, id: parent.id } : null;
}

/**
 * Get all subjects in a category
 */
export function getSubjectsByCategory(category: string): SubjectMeta[] {
  return SUBJECTS.filter(s => s.category === category);
}

/**
 * Get all available subjects
 */
export function getAllSubjects(): SubjectMeta[] {
  return [...SUBJECTS];
}

/**
 * Check if a subject is a language subject
 */
export function isLanguageSubject(subjectName: string): boolean {
  const subject = findSubject(subjectName);
  return subject?.category === 'languages' || subject?.id === 'languages';
}

/**
 * Get language-specific subjects only
 */
export function getLanguageSubjects(): SubjectMeta[] {
  return SUBJECTS.filter(s => s.category === 'languages');
}

/**
 * Normalize subject name for consistent handling
 */
export function normalizeSubjectName(name: string): string {
  const subject = findSubject(name);
  return subject?.name || name;
}
