/**
 * Demo Data for Language Gems Dashboard Showcase
 * 
 * This file contains comprehensive fake data to demonstrate the full
 * capabilities of our teacher and student dashboards.
 */

import { GemRarity } from '../../services/rewards/RewardEngine';

// =====================================================
// DEMO TEACHER DATA
// =====================================================

export const DEMO_TEACHER = {
  id: 'demo-teacher-001',
  email: 'demo.teacher@languagegems.com',
  name: 'Mrs. Sarah Mitchell',
  role: 'teacher',
  school: 'Westfield Academy',
  avatar_url: null,
  created_at: '2024-09-01T00:00:00Z',
};

// =====================================================
// DEMO CLASSES
// =====================================================

export const DEMO_CLASSES = [
  {
    id: 'demo-class-french-001',
    name: 'French GCSE - Year 10',
    language: 'French',
    description: 'AQA French GCSE Foundation & Higher Tier',
    teacher_id: DEMO_TEACHER.id,
    class_code: 'FR10-DEMO',
    student_count: 28,
    created_at: '2024-09-01T00:00:00Z',
    color: '#3B82F6', // blue
    icon: '🇫🇷',
  },
  {
    id: 'demo-class-spanish-001',
    name: 'Spanish GCSE - Year 11',
    language: 'Spanish',
    description: 'AQA Spanish GCSE Higher Tier - Exam Year',
    teacher_id: DEMO_TEACHER.id,
    class_code: 'SP11-DEMO',
    student_count: 24,
    created_at: '2024-09-01T00:00:00Z',
    color: '#EF4444', // red
    icon: '🇪🇸',
  },
  {
    id: 'demo-class-german-001',
    name: 'German GCSE - Year 10',
    language: 'German',
    description: 'Edexcel German GCSE Foundation Tier',
    teacher_id: DEMO_TEACHER.id,
    class_code: 'DE10-DEMO',
    student_count: 22,
    created_at: '2024-09-01T00:00:00Z',
    color: '#FBBF24', // yellow
    icon: '🇩🇪',
  },
];

// =====================================================
// DEMO STUDENTS
// =====================================================

const FIRST_NAMES = [
  'Emma', 'Oliver', 'Sophia', 'Liam', 'Ava', 'Noah', 'Isabella', 'James',
  'Mia', 'William', 'Charlotte', 'Benjamin', 'Amelia', 'Lucas', 'Harper',
  'Henry', 'Evelyn', 'Alexander', 'Luna', 'Mason', 'Ella', 'Ethan', 'Grace',
  'Michael', 'Chloe', 'Daniel', 'Victoria', 'Jacob', 'Lily', 'Sebastian',
  'Zoey', 'Jack', 'Hannah', 'Owen', 'Nora', 'Samuel', 'Riley', 'David',
  'Layla', 'Joseph', 'Ellie', 'John', 'Hazel', 'Leo', 'Aurora', 'Matthew',
  'Savannah', 'Dylan', 'Audrey', 'Luke', 'Brooklyn', 'Gabriel', 'Bella',
];

const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
  'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
  'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
  'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen',
  'Hill', 'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera',
];

function generateStudents(classId: string, count: number, language: string) {
  const students = [];
  const shuffledFirst = [...FIRST_NAMES].sort(() => Math.random() - 0.5);
  const shuffledLast = [...LAST_NAMES].sort(() => Math.random() - 0.5);
  
  for (let i = 0; i < count; i++) {
    const firstName = shuffledFirst[i % shuffledFirst.length];
    const lastName = shuffledLast[i % shuffledLast.length];
    const level = Math.floor(Math.random() * 15) + 1;
    const xp = (level - 1) * 1000 + Math.floor(Math.random() * 1000);
    const streak = Math.floor(Math.random() * 30);
    const accuracy = 45 + Math.floor(Math.random() * 50);
    const totalGems = Math.floor(Math.random() * 500) + 50;
    
    students.push({
      id: `demo-student-${classId}-${i + 1}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@student.demo.com`,
      name: `${firstName} ${lastName}`,
      role: 'student',
      class_id: classId,
      language,
      created_at: new Date(Date.now() - Math.random() * 120 * 24 * 60 * 60 * 1000).toISOString(),
      // Performance data
      level,
      xp,
      streak,
      accuracy,
      totalGems,
      wordsLearned: Math.floor(Math.random() * 300) + 50,
      sessionsCompleted: Math.floor(Math.random() * 100) + 10,
      assignmentsCompleted: Math.floor(Math.random() * 20) + 1,
      lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      // Trend
      trend: ['improving', 'stable', 'declining'][Math.floor(Math.random() * 3)] as 'improving' | 'stable' | 'declining',
    });
  }
  
  return students;
}

export const DEMO_STUDENTS = {
  [DEMO_CLASSES[0].id]: generateStudents(DEMO_CLASSES[0].id, 28, 'French'),
  [DEMO_CLASSES[1].id]: generateStudents(DEMO_CLASSES[1].id, 24, 'Spanish'),
  [DEMO_CLASSES[2].id]: generateStudents(DEMO_CLASSES[2].id, 22, 'German'),
};

export const ALL_DEMO_STUDENTS = [
  ...DEMO_STUDENTS[DEMO_CLASSES[0].id],
  ...DEMO_STUDENTS[DEMO_CLASSES[1].id],
  ...DEMO_STUDENTS[DEMO_CLASSES[2].id],
];

// =====================================================
// DEMO ASSIGNMENTS
// =====================================================

const GAME_TYPES = [
  'vocab-master',
  'memory-game',
  'hangman',
  'word-scramble',
  'speed-builder',
  'sentence-towers',
  'detective-listening',
  'noughts-and-crosses',
  'conjugation-duel',
];

const FRENCH_TOPICS = [
  { name: 'Family & Relationships', unit: 'Theme 1: Identity & Culture' },
  { name: 'Free-time Activities', unit: 'Theme 1: Identity & Culture' },
  { name: 'Food & Eating Out', unit: 'Theme 1: Identity & Culture' },
  { name: 'School Life', unit: 'Theme 2: Local & Global' },
  { name: 'My Town & Region', unit: 'Theme 2: Local & Global' },
  { name: 'Environment', unit: 'Theme 2: Local & Global' },
  { name: 'Travel & Tourism', unit: 'Theme 3: Current & Future' },
  { name: 'Jobs & Career', unit: 'Theme 3: Current & Future' },
];

const SPANISH_TOPICS = [
  { name: 'Mi familia', unit: 'Tema 1: Identidad y Cultura' },
  { name: 'Tiempo libre', unit: 'Tema 1: Identidad y Cultura' },
  { name: 'La comida', unit: 'Tema 1: Identidad y Cultura' },
  { name: 'El instituto', unit: 'Tema 2: Local y Global' },
  { name: 'Mi ciudad', unit: 'Tema 2: Local y Global' },
  { name: 'El medio ambiente', unit: 'Tema 2: Local y Global' },
  { name: 'Los viajes', unit: 'Tema 3: Actual y Futuro' },
  { name: 'El trabajo', unit: 'Tema 3: Actual y Futuro' },
];

const GERMAN_TOPICS = [
  { name: 'Meine Familie', unit: 'Thema 1: Identität und Kultur' },
  { name: 'Freizeit', unit: 'Thema 1: Identität und Kultur' },
  { name: 'Essen und Trinken', unit: 'Thema 1: Identität und Kultur' },
  { name: 'Schule', unit: 'Thema 2: Lokal und Global' },
  { name: 'Meine Stadt', unit: 'Thema 2: Lokal und Global' },
  { name: 'Umwelt', unit: 'Thema 2: Lokal und Global' },
  { name: 'Reisen', unit: 'Thema 3: Aktuell und Zukunft' },
  { name: 'Beruf', unit: 'Thema 3: Aktuell und Zukunft' },
];

function generateAssignments(classData: typeof DEMO_CLASSES[0], topics: typeof FRENCH_TOPICS) {
  const assignments = [];
  const now = Date.now();
  
  for (let i = 0; i < 12; i++) {
    const topic = topics[i % topics.length];
    const gameType = GAME_TYPES[i % GAME_TYPES.length];
    const isCompleted = i < 8;
    const isPast = i < 5;
    const isFuture = i >= 10;
    
    const dueDate = isFuture 
      ? new Date(now + (i - 9) * 7 * 24 * 60 * 60 * 1000)
      : isPast
        ? new Date(now - (8 - i) * 7 * 24 * 60 * 60 * 1000)
        : new Date(now + (i - 4) * 2 * 24 * 60 * 60 * 1000);
    
    assignments.push({
      id: `demo-assignment-${classData.id}-${i + 1}`,
      title: `${topic.name} - ${gameType.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}`,
      description: `Practice ${topic.name} vocabulary using ${gameType.replace(/-/g, ' ')}`,
      class_id: classData.id,
      teacher_id: DEMO_TEACHER.id,
      game_type: gameType,
      topic: topic.name,
      unit: topic.unit,
      language: classData.language,
      due_date: dueDate.toISOString(),
      created_at: new Date(dueDate.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      points: 100,
      max_attempts: 3,
      time_limit: 30,
      status: isCompleted ? 'completed' : isFuture ? 'not_started' : 'in_progress',
      // Analytics
      submissions: isCompleted ? classData.student_count : Math.floor(Math.random() * classData.student_count),
      averageScore: 60 + Math.floor(Math.random() * 35),
      averageAccuracy: 55 + Math.floor(Math.random() * 40),
      completionRate: isCompleted ? 95 + Math.floor(Math.random() * 5) : 20 + Math.floor(Math.random() * 60),
    });
  }
  
  return assignments;
}

export const DEMO_ASSIGNMENTS = {
  [DEMO_CLASSES[0].id]: generateAssignments(DEMO_CLASSES[0], FRENCH_TOPICS),
  [DEMO_CLASSES[1].id]: generateAssignments(DEMO_CLASSES[1], SPANISH_TOPICS),
  [DEMO_CLASSES[2].id]: generateAssignments(DEMO_CLASSES[2], GERMAN_TOPICS),
};

export const ALL_DEMO_ASSIGNMENTS = [
  ...DEMO_ASSIGNMENTS[DEMO_CLASSES[0].id],
  ...DEMO_ASSIGNMENTS[DEMO_CLASSES[1].id],
  ...DEMO_ASSIGNMENTS[DEMO_CLASSES[2].id],
];

// =====================================================
// DEMO GAME SESSIONS
// =====================================================

function generateGameSessions(studentId: string, language: string, count: number) {
  const sessions = [];
  const now = Date.now();
  
  for (let i = 0; i < count; i++) {
    const gameType = GAME_TYPES[Math.floor(Math.random() * GAME_TYPES.length)];
    const accuracy = 40 + Math.floor(Math.random() * 55);
    const score = Math.floor(accuracy * 10 * (0.8 + Math.random() * 0.4));
    const gemsTotal = Math.floor(score / 50) + Math.floor(Math.random() * 10);
    const xpEarned = Math.floor(gemsTotal * 15);
    
    const gemsByRarity: Record<GemRarity, number> = {
      new_discovery: Math.floor(Math.random() * 3),
      common: Math.floor(Math.random() * 5),
      uncommon: Math.floor(Math.random() * 3),
      rare: Math.floor(Math.random() * 2),
      epic: Math.random() > 0.7 ? 1 : 0,
      legendary: Math.random() > 0.95 ? 1 : 0,
    };
    
    sessions.push({
      id: `demo-session-${studentId}-${i + 1}`,
      student_id: studentId,
      game_type: gameType,
      language,
      started_at: new Date(now - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      completed_at: new Date(now - Math.random() * 30 * 24 * 60 * 60 * 1000 + 15 * 60 * 1000).toISOString(),
      duration_seconds: 300 + Math.floor(Math.random() * 900),
      score,
      accuracy_percentage: accuracy,
      gems_total: gemsTotal,
      gems_by_rarity: gemsByRarity,
      xp_earned: xpEarned,
      words_practiced: 10 + Math.floor(Math.random() * 30),
      words_correct: Math.floor((10 + Math.floor(Math.random() * 30)) * accuracy / 100),
    });
  }
  
  return sessions;
}

// =====================================================
// DEMO ASSESSMENT DATA
// =====================================================

const ASSESSMENT_TYPES = [
  { type: 'listening', name: 'AQA Listening Assessment' },
  { type: 'reading', name: 'AQA Reading Assessment' },
  { type: 'writing', name: 'AQA Writing Assessment' },
  { type: 'speaking', name: 'AQA Speaking Practice' },
];

function generateAssessmentResults(studentId: string, language: string) {
  return ASSESSMENT_TYPES.map((assessment, i) => ({
    id: `demo-assessment-${studentId}-${i + 1}`,
    student_id: studentId,
    assessment_type: assessment.type,
    assessment_name: `${language} ${assessment.name}`,
    language,
    score: 40 + Math.floor(Math.random() * 55),
    max_score: 100,
    percentage_score: 40 + Math.floor(Math.random() * 55),
    gcse_grade: Math.floor(Math.random() * 4) + 5, // 5-8
    time_spent_seconds: 1800 + Math.floor(Math.random() * 1800),
    completed_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    performance_by_theme: {
      'Identity and Culture': 60 + Math.floor(Math.random() * 35),
      'Local and Global': 55 + Math.floor(Math.random() * 40),
      'Current and Future': 50 + Math.floor(Math.random() * 45),
    },
    performance_by_question_type: {
      'Multiple Choice': 70 + Math.floor(Math.random() * 25),
      'Gap Fill': 55 + Math.floor(Math.random() * 40),
      'Translation': 45 + Math.floor(Math.random() * 50),
    },
  }));
}

// =====================================================
// DEMO VOCABULARY DATA
// =====================================================

const FRENCH_VOCABULARY = [
  { word: 'bonjour', translation: 'hello', category: 'Greetings' },
  { word: 'merci', translation: 'thank you', category: 'Greetings' },
  { word: 'la famille', translation: 'family', category: 'Family' },
  { word: 'le frère', translation: 'brother', category: 'Family' },
  { word: 'la sœur', translation: 'sister', category: 'Family' },
  { word: 'manger', translation: 'to eat', category: 'Food' },
  { word: 'boire', translation: 'to drink', category: 'Food' },
  { word: 'le pain', translation: 'bread', category: 'Food' },
  { word: 'le fromage', translation: 'cheese', category: 'Food' },
  { word: 'voyager', translation: 'to travel', category: 'Travel' },
  { word: 'l\'avion', translation: 'plane', category: 'Travel' },
  { word: 'la gare', translation: 'train station', category: 'Travel' },
  { word: 'travailler', translation: 'to work', category: 'Work' },
  { word: 'le bureau', translation: 'office', category: 'Work' },
  { word: 'l\'école', translation: 'school', category: 'School' },
  { word: 'apprendre', translation: 'to learn', category: 'School' },
  { word: 'le professeur', translation: 'teacher', category: 'School' },
  { word: 'les devoirs', translation: 'homework', category: 'School' },
  { word: 'jouer', translation: 'to play', category: 'Free Time' },
  { word: 'regarder', translation: 'to watch', category: 'Free Time' },
];

const SPANISH_VOCABULARY = [
  { word: 'hola', translation: 'hello', category: 'Saludos' },
  { word: 'gracias', translation: 'thank you', category: 'Saludos' },
  { word: 'la familia', translation: 'family', category: 'Familia' },
  { word: 'el hermano', translation: 'brother', category: 'Familia' },
  { word: 'la hermana', translation: 'sister', category: 'Familia' },
  { word: 'comer', translation: 'to eat', category: 'Comida' },
  { word: 'beber', translation: 'to drink', category: 'Comida' },
  { word: 'el pan', translation: 'bread', category: 'Comida' },
  { word: 'el queso', translation: 'cheese', category: 'Comida' },
  { word: 'viajar', translation: 'to travel', category: 'Viajes' },
  { word: 'el avión', translation: 'plane', category: 'Viajes' },
  { word: 'la estación', translation: 'station', category: 'Viajes' },
  { word: 'trabajar', translation: 'to work', category: 'Trabajo' },
  { word: 'la oficina', translation: 'office', category: 'Trabajo' },
  { word: 'el colegio', translation: 'school', category: 'Instituto' },
  { word: 'aprender', translation: 'to learn', category: 'Instituto' },
  { word: 'el profesor', translation: 'teacher', category: 'Instituto' },
  { word: 'los deberes', translation: 'homework', category: 'Instituto' },
  { word: 'jugar', translation: 'to play', category: 'Tiempo Libre' },
  { word: 'ver', translation: 'to watch', category: 'Tiempo Libre' },
];

const GERMAN_VOCABULARY = [
  { word: 'hallo', translation: 'hello', category: 'Begrüßungen' },
  { word: 'danke', translation: 'thank you', category: 'Begrüßungen' },
  { word: 'die Familie', translation: 'family', category: 'Familie' },
  { word: 'der Bruder', translation: 'brother', category: 'Familie' },
  { word: 'die Schwester', translation: 'sister', category: 'Familie' },
  { word: 'essen', translation: 'to eat', category: 'Essen' },
  { word: 'trinken', translation: 'to drink', category: 'Essen' },
  { word: 'das Brot', translation: 'bread', category: 'Essen' },
  { word: 'der Käse', translation: 'cheese', category: 'Essen' },
  { word: 'reisen', translation: 'to travel', category: 'Reisen' },
  { word: 'das Flugzeug', translation: 'plane', category: 'Reisen' },
  { word: 'der Bahnhof', translation: 'train station', category: 'Reisen' },
  { word: 'arbeiten', translation: 'to work', category: 'Arbeit' },
  { word: 'das Büro', translation: 'office', category: 'Arbeit' },
  { word: 'die Schule', translation: 'school', category: 'Schule' },
  { word: 'lernen', translation: 'to learn', category: 'Schule' },
  { word: 'der Lehrer', translation: 'teacher', category: 'Schule' },
  { word: 'die Hausaufgaben', translation: 'homework', category: 'Schule' },
  { word: 'spielen', translation: 'to play', category: 'Freizeit' },
  { word: 'sehen', translation: 'to watch', category: 'Freizeit' },
];

function generateVocabularyProgress(studentId: string, vocabulary: typeof FRENCH_VOCABULARY) {
  return vocabulary.map((vocab, i) => {
    const totalEncounters = 5 + Math.floor(Math.random() * 30);
    const correctEncounters = Math.floor(totalEncounters * (0.4 + Math.random() * 0.55));
    const accuracy = Math.round((correctEncounters / totalEncounters) * 100);
    const masteryLevel = Math.min(5, Math.floor(correctEncounters / 5));
    
    return {
      id: `demo-vocab-${studentId}-${i + 1}`,
      student_id: studentId,
      word: vocab.word,
      translation: vocab.translation,
      category: vocab.category,
      total_encounters: totalEncounters,
      correct_encounters: correctEncounters,
      accuracy,
      mastery_level: masteryLevel,
      fsrs_difficulty: 0.3 + Math.random() * 0.4,
      fsrs_stability: 1 + Math.random() * 20,
      fsrs_retrievability: 0.5 + Math.random() * 0.5,
      next_review_at: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      last_reviewed_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    };
  });
}

// =====================================================
// DEMO ACHIEVEMENTS
// =====================================================

const ACHIEVEMENT_TEMPLATES = [
  { id: 'first_session', name: 'First Steps', description: 'Complete your first learning session', icon: '🚀', rarity: 'common' },
  { id: 'streak_3', name: 'On Fire', description: '3 day learning streak', icon: '🔥', rarity: 'common' },
  { id: 'streak_7', name: 'Week Warrior', description: '7 day learning streak', icon: '⚡', rarity: 'uncommon' },
  { id: 'streak_30', name: 'Monthly Master', description: '30 day learning streak', icon: '🏆', rarity: 'rare' },
  { id: 'perfect_session', name: 'Perfect Score', description: '100% accuracy in a session', icon: '💯', rarity: 'uncommon' },
  { id: 'words_50', name: 'Word Collector', description: 'Learn 50 words', icon: '📚', rarity: 'common' },
  { id: 'words_100', name: 'Vocabulary Builder', description: 'Learn 100 words', icon: '📖', rarity: 'uncommon' },
  { id: 'words_250', name: 'Word Master', description: 'Learn 250 words', icon: '🎓', rarity: 'rare' },
  { id: 'gem_collector', name: 'Gem Collector', description: 'Collect 100 gems', icon: '💎', rarity: 'common' },
  { id: 'legendary_gem', name: 'Legendary Find', description: 'Earn a legendary gem', icon: '👑', rarity: 'legendary' },
  { id: 'speed_demon', name: 'Speed Demon', description: 'Answer 10 questions under 2 seconds each', icon: '⚡', rarity: 'rare' },
  { id: 'night_owl', name: 'Night Owl', description: 'Study after 10 PM', icon: '🦉', rarity: 'common' },
  { id: 'early_bird', name: 'Early Bird', description: 'Study before 7 AM', icon: '🐦', rarity: 'common' },
  { id: 'all_games', name: 'Game Explorer', description: 'Play all game types', icon: '🎮', rarity: 'uncommon' },
  { id: 'assessment_ace', name: 'Assessment Ace', description: 'Score 90%+ on an assessment', icon: '🌟', rarity: 'rare' },
];

function generateStudentAchievements(studentId: string) {
  const achievementCount = 3 + Math.floor(Math.random() * 8);
  const shuffled = [...ACHIEVEMENT_TEMPLATES].sort(() => Math.random() - 0.5);
  
  return shuffled.slice(0, achievementCount).map((achievement, i) => ({
    id: `demo-achievement-${studentId}-${i + 1}`,
    user_id: studentId,
    achievement_id: achievement.id,
    name: achievement.name,
    description: achievement.description,
    icon: achievement.icon,
    rarity: achievement.rarity,
    achieved_at: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
  }));
}

// =====================================================
// DEMO RECENT ACTIVITY
// =====================================================

function generateRecentActivity(classId: string) {
  const students = DEMO_STUDENTS[classId];
  const activities = [];
  
  for (let i = 0; i < 15; i++) {
    const student = students[Math.floor(Math.random() * students.length)];
    const type = ['assignment_completed', 'achievement_earned', 'game_session', 'assessment_completed'][Math.floor(Math.random() * 4)];
    const gameType = GAME_TYPES[Math.floor(Math.random() * GAME_TYPES.length)];
    
    let description = '';
    let score: number | undefined;
    let achievement: string | undefined;
    
    switch (type) {
      case 'assignment_completed':
        description = `Completed "${gameType.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}" assignment`;
        score = 700 + Math.floor(Math.random() * 300);
        break;
      case 'achievement_earned':
        const randomAchievement = ACHIEVEMENT_TEMPLATES[Math.floor(Math.random() * ACHIEVEMENT_TEMPLATES.length)];
        description = `Earned "${randomAchievement.name}" achievement`;
        achievement = randomAchievement.name;
        break;
      case 'game_session':
        description = `Played ${gameType.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}`;
        score = 500 + Math.floor(Math.random() * 500);
        break;
      case 'assessment_completed':
        const assessmentType = ASSESSMENT_TYPES[Math.floor(Math.random() * ASSESSMENT_TYPES.length)];
        description = `Completed ${assessmentType.name}`;
        score = 50 + Math.floor(Math.random() * 50);
        break;
    }
    
    const minutesAgo = Math.floor(Math.random() * 60 * 24);
    const timestamp = minutesAgo < 60 
      ? `${minutesAgo} minutes ago`
      : minutesAgo < 60 * 24 
        ? `${Math.floor(minutesAgo / 60)} hours ago`
        : `${Math.floor(minutesAgo / 60 / 24)} days ago`;
    
    activities.push({
      id: `demo-activity-${classId}-${i + 1}`,
      type,
      studentId: student.id,
      studentName: student.name,
      description,
      timestamp,
      timestampDate: new Date(Date.now() - minutesAgo * 60 * 1000).toISOString(),
      score,
      achievement,
    });
  }
  
  return activities.sort((a, b) => new Date(b.timestampDate).getTime() - new Date(a.timestampDate).getTime());
}

export const DEMO_RECENT_ACTIVITY = {
  [DEMO_CLASSES[0].id]: generateRecentActivity(DEMO_CLASSES[0].id),
  [DEMO_CLASSES[1].id]: generateRecentActivity(DEMO_CLASSES[1].id),
  [DEMO_CLASSES[2].id]: generateRecentActivity(DEMO_CLASSES[2].id),
};

// =====================================================
// DEMO TEACHER DASHBOARD STATS
// =====================================================

export const DEMO_TEACHER_STATS = {
  totalStudents: DEMO_CLASSES.reduce((sum, c) => sum + c.student_count, 0),
  activeAssignments: 9,
  completedAssignments: 24,
  averageClassScore: 847,
  averageAccuracy: 78.5,
  totalGameSessions: 3247,
  studentsOnline: 12,
  improvementRate: 15.3,
};

export const DEMO_CLASS_OVERVIEWS = DEMO_CLASSES.map((cls, i) => {
  const students = DEMO_STUDENTS[cls.id];
  const avgScore = Math.round(students.reduce((sum, s) => sum + s.accuracy * 10, 0) / students.length);
  const avgAccuracy = Math.round(students.reduce((sum, s) => sum + s.accuracy, 0) / students.length);
  
  return {
    id: cls.id,
    name: cls.name,
    language: cls.language,
    icon: cls.icon,
    color: cls.color,
    studentCount: cls.student_count,
    activeAssignments: 3 - i,
    averageScore: avgScore,
    averageAccuracy: avgAccuracy,
    lastActivity: ['2 minutes ago', '15 minutes ago', '1 hour ago'][i],
    engagementScore: 75 + Math.floor(Math.random() * 20),
    strugglingStudents: 2 + Math.floor(Math.random() * 4),
    topPerformers: 4 + Math.floor(Math.random() * 5),
  };
});

// =====================================================
// SELECTED DEMO STUDENT (for student dashboard)
// =====================================================

export const DEMO_SELECTED_STUDENT = DEMO_STUDENTS[DEMO_CLASSES[0].id][0]; // Emma Smith from French class

export function getDemoStudentData(studentId: string = DEMO_SELECTED_STUDENT.id) {
  const student = ALL_DEMO_STUDENTS.find(s => s.id === studentId) || DEMO_SELECTED_STUDENT;
  const classData = DEMO_CLASSES.find(c => c.id === student.class_id)!;
  const vocabulary = classData.language === 'French' 
    ? FRENCH_VOCABULARY 
    : classData.language === 'Spanish' 
      ? SPANISH_VOCABULARY 
      : GERMAN_VOCABULARY;
  
  return {
    student,
    class: classData,
    assignments: DEMO_ASSIGNMENTS[classData.id].map(a => ({
      ...a,
      // Generate student-specific progress
      status: Math.random() > 0.3 ? 'completed' : Math.random() > 0.5 ? 'in_progress' : 'not_started',
      score: Math.floor(Math.random() * 400) + 600,
      bestAccuracy: 50 + Math.floor(Math.random() * 45),
      attempts: Math.floor(Math.random() * 3) + 1,
    })),
    gameSessions: generateGameSessions(studentId, classData.language, 30),
    assessmentResults: generateAssessmentResults(studentId, classData.language),
    vocabularyProgress: generateVocabularyProgress(studentId, vocabulary),
    achievements: generateStudentAchievements(studentId),
    gemsAnalytics: {
      studentId,
      totalGems: student.totalGems,
      gemsByRarity: {
        new_discovery: Math.floor(student.totalGems * 0.1),
        common: Math.floor(student.totalGems * 0.4),
        uncommon: Math.floor(student.totalGems * 0.25),
        rare: Math.floor(student.totalGems * 0.15),
        epic: Math.floor(student.totalGems * 0.08),
        legendary: Math.floor(student.totalGems * 0.02),
      } as Record<GemRarity, number>,
      totalXP: student.xp,
      currentLevel: student.level,
      xpToNextLevel: 1000 - (student.xp % 1000),
      gemsEarnedToday: 5 + Math.floor(Math.random() * 15),
      gemsByRarityToday: {
        new_discovery: Math.floor(Math.random() * 2),
        common: Math.floor(Math.random() * 5),
        uncommon: Math.floor(Math.random() * 3),
        rare: Math.floor(Math.random() * 2),
        epic: 0,
        legendary: 0,
      } as Record<GemRarity, number>,
      gemsThisWeek: 50 + Math.floor(Math.random() * 100),
      gemsThisMonth: 200 + Math.floor(Math.random() * 300),
      averageGemsPerSession: 8 + Math.floor(Math.random() * 12),
      favoriteGameType: GAME_TYPES[Math.floor(Math.random() * GAME_TYPES.length)],
      recentSessions: [],
      xpBreakdown: {
        activityXP: Math.floor(student.xp * 0.4),
        masteryXP: Math.floor(student.xp * 0.4),
        grammarXP: Math.floor(student.xp * 0.2),
      },
      activityGemsToday: 3 + Math.floor(Math.random() * 5),
      masteryGemsToday: 2 + Math.floor(Math.random() * 4),
      grammarGemsToday: 1 + Math.floor(Math.random() * 3),
    },
    dashboardMetrics: {
      totalWordsTracked: vocabulary.length,
      totalAttempts: student.sessionsCompleted * 15,
      overallAccuracy: student.accuracy,
      averageResponseTime: 2000 + Math.floor(Math.random() * 2000),
      memoryStrength: 60 + Math.floor(Math.random() * 30),
      wordsReadyForReview: 5 + Math.floor(Math.random() * 10),
      overdueWords: Math.floor(Math.random() * 5),
      masteredWords: Math.floor(vocabulary.length * 0.3),
      strugglingWords: Math.floor(vocabulary.length * 0.15),
      recentAccuracyTrend: Array.from({ length: 7 }, () => 50 + Math.floor(Math.random() * 45)),
      responseTimeImprovement: 10 + Math.floor(Math.random() * 20),
      consistencyScore: 60 + Math.floor(Math.random() * 35),
      categoryBreakdown: [],
      recommendedStudyTime: 15 + Math.floor(Math.random() * 20),
      priorityWords: [],
    },
  };
}

// =====================================================
// NOTIFICATIONS DATA
// =====================================================

export const DEMO_TEACHER_NOTIFICATIONS = [
  {
    id: '1',
    type: 'assignment_due',
    title: 'Assignments Due Soon',
    message: '4 assignments have due dates within the next 48 hours',
    priority: 'high',
    timestamp: '1 hour ago',
  },
  {
    id: '2',
    type: 'student_struggling',
    title: 'Students Need Support',
    message: '6 students in French GCSE are showing declining performance this week',
    priority: 'medium',
    timestamp: '3 hours ago',
  },
  {
    id: '3',
    type: 'achievement_milestone',
    title: 'Class Milestone Reached!',
    message: 'Spanish GCSE class has collectively earned 5,000 gems! 🎉',
    priority: 'low',
    timestamp: '1 day ago',
  },
  {
    id: '4',
    type: 'new_assessment',
    title: 'Assessment Results Ready',
    message: '18 students have completed the Listening Assessment',
    priority: 'medium',
    timestamp: '2 days ago',
  },
];

export const DEMO_STUDENT_NOTIFICATIONS = [
  {
    id: '1',
    type: 'assignment',
    title: 'Assignment Due Tomorrow',
    message: '"Family Vocabulary - Memory Game" is due tomorrow!',
    timestamp: new Date().toISOString(),
    isNew: true,
  },
  {
    id: '2',
    type: 'achievement',
    title: 'New Achievement!',
    message: 'You earned the "Week Warrior" badge for your 7-day streak! 🔥',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    isNew: true,
  },
  {
    id: '3',
    type: 'streak',
    title: "Don't Break Your Streak!",
    message: 'Keep your 12-day streak alive by practicing today',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    isNew: false,
  },
];

// =====================================================
// EXPORT HELPER FUNCTIONS
// =====================================================

export function getDemoTeacherDashboardData() {
  return {
    teacher: DEMO_TEACHER,
    classes: DEMO_CLASSES,
    classOverviews: DEMO_CLASS_OVERVIEWS,
    stats: DEMO_TEACHER_STATS,
    notifications: DEMO_TEACHER_NOTIFICATIONS,
    recentActivity: Object.values(DEMO_RECENT_ACTIVITY).flat().sort(
      (a, b) => new Date(b.timestampDate).getTime() - new Date(a.timestampDate).getTime()
    ).slice(0, 20),
    allStudents: ALL_DEMO_STUDENTS,
    allAssignments: ALL_DEMO_ASSIGNMENTS,
  };
}
