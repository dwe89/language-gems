/**
 * UUID Utilities
 * 
 * Provides UUID validation and generation utilities for the LanguageGems system.
 * Ensures proper UUID format for database operations, especially FSRS integration.
 */

/**
 * Generate a valid UUID v4
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Validate if a string is a valid UUID format
 */
export function isValidUUID(uuid: string): boolean {
  if (!uuid || typeof uuid !== 'string') {
    return false;
  }

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Generate a test UUID for testing purposes
 * Creates a valid UUID that can be used in tests
 */
export function generateTestUUID(prefix?: string): string {
  const uuid = generateUUID();
  
  if (prefix) {
    // Replace the first part of the UUID with a recognizable prefix
    // while maintaining valid UUID format
    const prefixHex = Buffer.from(prefix.substring(0, 8).padEnd(8, '0')).toString('hex').substring(0, 8);
    return `${prefixHex}-${uuid.substring(9)}`;
  }
  
  return uuid;
}

/**
 * Convert a simple string to a valid UUID format for testing
 * This is useful for converting test strings like "test" to valid UUIDs
 */
export function stringToTestUUID(input: string): string {
  if (isValidUUID(input)) {
    return input; // Already a valid UUID
  }

  // Create a deterministic UUID from the input string
  const hash = simpleHash(input);
  const hex = hash.toString(16).padStart(32, '0');

  // Create a valid UUID v4 format with proper length
  return `${hex.substring(0, 8)}-${hex.substring(8, 12)}-4${hex.substring(12, 15)}-8${hex.substring(15, 18)}-${hex.substring(18, 30)}`;
}

/**
 * Simple hash function for string to UUID conversion
 */
function simpleHash(str: string): number {
  let hash = 0;
  if (str.length === 0) return hash;
  
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return Math.abs(hash);
}

/**
 * Validate and convert student ID to proper UUID format
 * Used by FSRS service to ensure valid student IDs
 */
export function validateStudentId(studentId: string): string {
  if (!studentId) {
    throw new Error('Student ID is required');
  }

  if (isValidUUID(studentId)) {
    return studentId;
  }

  // For testing purposes, convert simple strings to valid UUIDs
  if (studentId.startsWith('test') || studentId.includes('test')) {
    return stringToTestUUID(studentId);
  }

  throw new Error(`Invalid student ID format: ${studentId}. Must be a valid UUID.`);
}

/**
 * Validate and convert vocabulary ID to proper UUID format
 * Used by FSRS service to ensure valid vocabulary IDs
 */
export function validateVocabularyId(vocabularyId: string): string {
  if (!vocabularyId) {
    throw new Error('Vocabulary ID is required');
  }

  if (isValidUUID(vocabularyId)) {
    return vocabularyId;
  }

  // For testing purposes, convert simple strings to valid UUIDs
  if (vocabularyId.startsWith('test') || vocabularyId.includes('test')) {
    return stringToTestUUID(vocabularyId);
  }

  throw new Error(`Invalid vocabulary ID format: ${vocabularyId}. Must be a valid UUID.`);
}

/**
 * Create a session ID with proper UUID format
 * Used for game sessions and testing
 */
export function createSessionId(prefix?: string): string {
  if (prefix) {
    return `${prefix}-${generateUUID()}`;
  }
  return generateUUID();
}

/**
 * Extract meaningful part from test UUID
 * Useful for debugging and logging
 */
export function getTestUUIDPrefix(uuid: string): string | null {
  if (!isValidUUID(uuid)) {
    return null;
  }

  try {
    const firstPart = uuid.substring(0, 8);
    const buffer = Buffer.from(firstPart, 'hex');
    const text = buffer.toString('utf8').replace(/\0/g, '');
    return text.length > 0 ? text : null;
  } catch {
    return null;
  }
}

/**
 * Generate a set of test UUIDs for common test scenarios
 */
export function generateTestUUIDs() {
  return {
    testStudent: stringToTestUUID('test-student'),
    testVocabulary: stringToTestUUID('test-vocabulary'),
    testSession: stringToTestUUID('test-session'),
    testAssignment: stringToTestUUID('test-assignment'),
    testGame: stringToTestUUID('test-game')
  };
}

/**
 * Validate session ID format
 * Ensures session IDs are proper UUIDs or UUID-like strings
 */
export function validateSessionId(sessionId: string): string {
  if (!sessionId) {
    throw new Error('Session ID is required');
  }

  // Allow session IDs with prefixes like "session-uuid" or just UUIDs
  if (sessionId.includes('-') && sessionId.length >= 36) {
    const parts = sessionId.split('-');
    if (parts.length >= 5) {
      // Looks like a UUID or UUID-based string
      return sessionId;
    }
  }

  if (isValidUUID(sessionId)) {
    return sessionId;
  }

  // For testing, convert to valid format
  if (sessionId.includes('test')) {
    return stringToTestUUID(sessionId);
  }

  throw new Error(`Invalid session ID format: ${sessionId}`);
}
