import { SupabaseClient } from '@supabase/supabase-js';

export type LeaderboardTimePeriod = 'daily' | 'weekly' | 'monthly' | 'all_time';

export interface StudentLeaderboardEntry {
  studentId: string;
  studentName: string;
  email: string;
  avatarInitials: string;
  classId: string;
  className: string;
  stats: {
    points: number;
    xp: number;
    gems: number;
    accuracy: number;
    completion: number;
    streak: number;
    longestStreak: number;
    gamesPlayed: number;
    totalTime: number;
    masteredWords: number;
  };
  achievements: {
    total: number;
    rare: number;
    epic: number;
    legendary: number;
    recent: Array<{
      title: string;
      earnedAt: string;
      rarity: string;
      points: number;
    }>;
  };
  lastActivity: string | null;
  rank: number;
  dataQualityWarnings?: string[]; // Warnings about suspicious activity patterns
}

export interface ClassLeaderboardEntry {
  classId: string;
  className: string;
  totalPoints: number;
  totalGems: number;
  studentCount: number;
  averageAccuracy: number;
  averageCompletion: number;
  averageStreak: number;
  topStudent?: {
    studentId: string;
    studentName: string;
    points: number;
  };
  rank: number;
}

export interface CrossGameLeaderboardEntry {
  id: string;
  student_id: string;
  student_name: string;
  student_avatar?: string;
  class_id?: string;
  class_name?: string;
  total_points: number;
  total_xp: number;
  total_gems: number;
  current_level: number;
  games_played: number;
  average_accuracy: number;
  average_completion: number;
  total_time_played: number;
  current_streak: number;
  longest_streak: number;
  last_activity: string | null;
  total_achievements: number;
  rare_achievements: number;
  epic_achievements: number;
  legendary_achievements: number;
  words_learned: number;
  overall_rank: number;
  class_rank?: number;
  weekly_rank?: number;
  monthly_rank?: number;
  game_scores: Record<string, {
    best_score: number;
    best_accuracy: number;
    games_played: number;
    last_played: string | null;
  }>;
  data_quality_warnings?: string[]; // Warnings about suspicious activity patterns
}

export interface TeacherLeaderboardsResponse {
  students: StudentLeaderboardEntry[];
  classes: ClassLeaderboardEntry[];
  crossLeaderboard: CrossGameLeaderboardEntry[];
  summary: {
    totalStudents: number;
    totalClasses: number;
    totalXP: number;
    totalGems: number;
    timePeriod: LeaderboardTimePeriod;
    generatedAt: string;
  };
}

interface ClassInfo {
  id: string;
  name: string;
}

interface StudentProfile {
  user_id: string;
  display_name: string | null;
  email: string;
}

interface AchievementRow {
  student_id: string;
  title: string;
  rarity: string;
  icon_name?: string;
  points_awarded?: number | null;
  earned_at: string;
}

interface StreakAggregateRow {
  student_id: string;
  max_current_streak: number;
  max_best_streak: number;
  total_words: number;
}

interface MasteredWordsRow {
  student_id: string;
  mastered_words: number;
}

interface SessionRow {
  id: string;
  student_id: string;
  game_type: string;
  final_score: number | null;
  accuracy_percentage: number | null;
  completion_percentage: number | null;
  duration_seconds: number | null;
  started_at: string;
  ended_at: string | null;
  gems_total: number | null;
  xp_earned: number | null;
}

interface TeacherLeaderboardsOptions {
  classId?: string;
  limit?: number;
  timePeriod?: LeaderboardTimePeriod;
  scope?: 'my-classes' | 'school';
}

export class TeacherLeaderboardsService {
  constructor(private readonly supabase: SupabaseClient<any>) {}

  async getLeaderboards(teacherId: string, options: TeacherLeaderboardsOptions = {}): Promise<TeacherLeaderboardsResponse> {
    const { classId, limit = 100, timePeriod = 'weekly', scope = 'my-classes' } = options;

    // If scope is 'school', fetch school-wide data
    if (scope === 'school') {
      return this.getSchoolWideLeaderboards(teacherId, { classId, limit, timePeriod });
    }

    // Otherwise, fetch only teacher's classes
    const classes = await this.fetchClasses(teacherId, classId);
    if (classes.length === 0) {
      return this.getEmptyResponse(timePeriod);
    }

    const classIds = classes.map(cls => cls.id);
    const enrollments = await this.fetchEnrollments(classIds);
    const studentIds = Array.from(new Set(enrollments.map(enrollment => enrollment.student_id)));

    if (studentIds.length === 0) {
      return this.getEmptyResponse(timePeriod, classes);
    }

    const { startDate } = this.getTimePeriodRange(timePeriod);

    const [profiles, sessions, achievements, streaks, masteredWords] = await Promise.all([
      this.fetchProfiles(studentIds),
      this.fetchSessions(studentIds, startDate),
      this.fetchRecentAchievements(studentIds, timePeriod),
      this.fetchStreakAggregates(studentIds),
      this.fetchMasteredWords(studentIds)
    ]);

    const profileMap = new Map<string, StudentProfile>();
    profiles.forEach(profile => profileMap.set(profile.user_id, profile));

    const classMap = new Map<string, ClassInfo>();
    classes.forEach(cls => classMap.set(cls.id, cls));

    const studentClassMap = new Map<string, string>();
    enrollments.forEach(enrollment => {
      if (!studentClassMap.has(enrollment.student_id)) {
        studentClassMap.set(enrollment.student_id, enrollment.class_id);
      }
    });

    const sessionsByStudent = new Map<string, SessionRow[]>();
    sessions.forEach(session => {
      const list = sessionsByStudent.get(session.student_id) ?? [];
      list.push(session);
      sessionsByStudent.set(session.student_id, list);
    });

    const streakMap = new Map<string, StreakAggregateRow>();
    streaks.forEach(row => {
      streakMap.set(row.student_id, row);
    });

    const masteredWordsMap = new Map<string, number>();
    masteredWords.forEach(row => {
      masteredWordsMap.set(row.student_id, row.mastered_words);
    });

    const achievementsMap = this.buildAchievementMap(achievements);

    const students = studentIds.map(studentId => {
      const profile = profileMap.get(studentId);
      const sessionsForStudent = sessionsByStudent.get(studentId) ?? [];
      const streakAggregate = streakMap.get(studentId);
      const masteredWordCount = masteredWordsMap.get(studentId) ?? 0;
      const classIdForStudent = studentClassMap.get(studentId);
      const classInfo = classIdForStudent ? classMap.get(classIdForStudent) : undefined;
      const achievementSummary = achievementsMap.get(studentId) ?? {
        total: 0,
        rare: 0,
        epic: 0,
        legendary: 0,
        recent: []
      };

    const xp = sessionsForStudent.reduce((sum, session) => sum + this.toNumber(session.xp_earned), 0);
    const gems = sessionsForStudent.reduce((sum, session) => sum + this.toNumber(session.gems_total), 0);
      const points = xp + gems * 5;

      const accuracyValues = sessionsForStudent.map(session => this.toNumber(session.accuracy_percentage));
      const completionValues = sessionsForStudent.map(session => this.toNumber(session.completion_percentage));
      const totalTime = sessionsForStudent.reduce((sum, session) => sum + this.toNumber(session.duration_seconds), 0);
      const lastActivity = sessionsForStudent.reduce<string | null>((latest, session) => {
        if (!session.ended_at) {
          return latest;
        }
        if (!latest) {
          return session.ended_at;
        }
        return new Date(session.ended_at) > new Date(latest) ? session.ended_at : latest;
      }, null);

      const averageAccuracy = accuracyValues.length > 0 ? this.average(accuracyValues) : 0;
      const averageCompletion = completionValues.length > 0 ? this.average(completionValues) : 0;
      const gamesPlayed = sessionsForStudent.length;

      const streak = streakAggregate?.max_current_streak ?? 0;
      const longestStreak = streakAggregate?.max_best_streak ?? 0;

      const avatarInitials = this.getInitials(profile?.display_name || profile?.email || 'Student');

      // Validate data quality
      const dataQualityWarnings = this.validateSessionQuality(sessionsForStudent);

      return {
        studentId,
        studentName: profile?.display_name || 'Unknown Student',
        email: profile?.email || '',
        avatarInitials,
        classId: classIdForStudent || '',
        className: classInfo?.name || 'Unassigned',
        stats: {
          points,
          xp,
          gems,
          accuracy: Number(averageAccuracy.toFixed(1)),
          completion: Number(averageCompletion.toFixed(1)),
          streak,
          longestStreak,
          gamesPlayed,
          totalTime,
          masteredWords: masteredWordCount
        },
        achievements: achievementSummary,
        lastActivity,
        rank: 0,
        dataQualityWarnings: dataQualityWarnings.length > 0 ? dataQualityWarnings : undefined
      } satisfies StudentLeaderboardEntry;
    });

    students.sort((a, b) => b.stats.points - a.stats.points);
    students.forEach((student, index) => {
      student.rank = index + 1;
    });

    const classesLeaderboard = this.buildClassLeaderboard(classes, students);

    const crossLeaderboard = this.buildCrossLeaderboard(students, sessionsByStudent, achievementsMap, streakMap, masteredWordsMap, limit);

    const totalXP = students.reduce((sum, student) => sum + student.stats.xp, 0);
    const totalGems = students.reduce((sum, student) => sum + student.stats.gems, 0);

    return {
      students,
      classes: classesLeaderboard,
      crossLeaderboard,
      summary: {
        totalStudents: students.length,
        totalClasses: classesLeaderboard.length,
        totalXP,
        totalGems,
        timePeriod,
        generatedAt: new Date().toISOString()
      }
    };
  }

  async getSchoolWideLeaderboards(teacherId: string, options: Omit<TeacherLeaderboardsOptions, 'scope'> = {}): Promise<TeacherLeaderboardsResponse> {
    const { limit = 100, timePeriod = 'weekly' } = options;

    console.log('[SchoolWide] Starting for teacher:', teacherId);

    // Get the teacher's profile to find their school_initials
    const { data: teacherProfile, error: profileError } = await this.supabase
      .from('user_profiles')
      .select('school_initials')
      .eq('user_id', teacherId)
      .single();

    console.log('[SchoolWide] Teacher profile:', { 
      school_initials: teacherProfile?.school_initials,
      error: profileError?.message 
    });

    // If teacher has no school_initials, try to get organization from their classes
    if (!teacherProfile?.school_initials) {
      console.log('[SchoolWide] No school_initials, trying via classes');
      const teacherClasses = await this.fetchClasses(teacherId);
      
      if (teacherClasses.length === 0) {
        console.log('[SchoolWide] No classes and no school_initials, returning empty');
        return this.getEmptyResponse(timePeriod);
      }

      // Get organization_id from one of the teacher's classes
      const { data: classData, error: classError } = await this.supabase
        .from('classes')
        .select('organization_id')
        .eq('id', teacherClasses[0].id)
        .single();

      if (classError || !classData?.organization_id) {
        console.log('[SchoolWide] No org_id from classes, falling back to my-classes');
        return this.getLeaderboards(teacherId, { limit, timePeriod, scope: 'my-classes' });
      }

      const organizationId = classData.organization_id;
      console.log('[SchoolWide] Organization ID from class:', organizationId);
      return this.fetchSchoolDataByOrgId(organizationId, timePeriod, limit);
    }

    // Teacher has school_initials - find the organization for their school
    const schoolInitials = teacherProfile.school_initials;
    console.log('[SchoolWide] Looking for organization with school:', schoolInitials);

    // Find organization by name (which we set to school_initials)
    const { data: org, error: orgError } = await this.supabase
      .from('organizations')
      .select('id')
      .eq('name', schoolInitials)
      .single();

    console.log('[SchoolWide] Organization lookup:', { 
      orgId: org?.id,
      error: orgError?.message 
    });

    if (orgError || !org?.id) {
      // No organization found for this school, fall back to teacher's classes
      console.log('[SchoolWide] No organization found for school, falling back');
      return this.getLeaderboards(teacherId, { limit, timePeriod, scope: 'my-classes' });
    }

    return this.fetchSchoolDataByOrgId(org.id, timePeriod, limit);
  }

  private async fetchSchoolDataByOrgId(organizationId: string, timePeriod: LeaderboardTimePeriod, limit: number): Promise<TeacherLeaderboardsResponse> {
    console.log('[SchoolWide] Fetching data for org:', organizationId);

    // Fetch all classes in the organization
    const { data: allClasses, error: allClassesError } = await this.supabase
      .from('classes')
      .select('id, name')
      .eq('organization_id', organizationId);

    console.log('[SchoolWide] Classes in org:', allClasses?.length, 'Error:', allClassesError?.message);

    if (allClassesError || !allClasses || allClasses.length === 0) {
      console.log('[SchoolWide] No classes in org, returning empty');
      return this.getEmptyResponse(timePeriod);
    }

    const classes = allClasses.map(cls => ({ id: cls.id, name: cls.name }));
    const classIds = classes.map(cls => cls.id);

    // Now continue with the same logic as regular leaderboards
    const enrollments = await this.fetchEnrollments(classIds);
    const studentIds = Array.from(new Set(enrollments.map(enrollment => enrollment.student_id)));

    if (studentIds.length === 0) {
      return this.getEmptyResponse(timePeriod, classes);
    }

    const { startDate } = this.getTimePeriodRange(timePeriod);

    const [profiles, sessions, achievements, streaks, masteredWords] = await Promise.all([
      this.fetchProfiles(studentIds),
      this.fetchSessions(studentIds, startDate),
      this.fetchRecentAchievements(studentIds, timePeriod),
      this.fetchStreakAggregates(studentIds),
      this.fetchMasteredWords(studentIds)
    ]);

    const profileMap = new Map<string, StudentProfile>();
    profiles.forEach(profile => profileMap.set(profile.user_id, profile));

    const classMap = new Map<string, ClassInfo>();
    classes.forEach(cls => classMap.set(cls.id, cls));

    const studentClassMap = new Map<string, string>();
    enrollments.forEach(enrollment => {
      if (!studentClassMap.has(enrollment.student_id)) {
        studentClassMap.set(enrollment.student_id, enrollment.class_id);
      }
    });

    const sessionsByStudent = new Map<string, SessionRow[]>();
    sessions.forEach(session => {
      const list = sessionsByStudent.get(session.student_id) ?? [];
      list.push(session);
      sessionsByStudent.set(session.student_id, list);
    });

    const streakMap = new Map<string, StreakAggregateRow>();
    streaks.forEach(row => {
      streakMap.set(row.student_id, row);
    });

    const masteredWordsMap = new Map<string, number>();
    masteredWords.forEach(row => {
      masteredWordsMap.set(row.student_id, row.mastered_words);
    });

    const achievementsMap = this.buildAchievementMap(achievements);

    const students = studentIds.map(studentId => {
      const profile = profileMap.get(studentId);
      const sessionsForStudent = sessionsByStudent.get(studentId) ?? [];
      const streakAggregate = streakMap.get(studentId);
      const masteredWordCount = masteredWordsMap.get(studentId) ?? 0;
      const classIdForStudent = studentClassMap.get(studentId);
      const classInfo = classIdForStudent ? classMap.get(classIdForStudent) : undefined;
      const achievementSummary = achievementsMap.get(studentId) ?? {
        total: 0,
        rare: 0,
        epic: 0,
        legendary: 0,
        recent: []
      };

      const xp = sessionsForStudent.reduce((sum, session) => sum + this.toNumber(session.xp_earned), 0);
      const gems = sessionsForStudent.reduce((sum, session) => sum + this.toNumber(session.gems_total), 0);
      const points = xp + gems * 5;

      const accuracyValues = sessionsForStudent.map(session => this.toNumber(session.accuracy_percentage));
      const completionValues = sessionsForStudent.map(session => this.toNumber(session.completion_percentage));
      const totalTime = sessionsForStudent.reduce((sum, session) => sum + this.toNumber(session.duration_seconds), 0);
      const lastActivity = sessionsForStudent.reduce<string | null>((latest, session) => {
        if (!session.ended_at) {
          return latest;
        }
        if (!latest) {
          return session.ended_at;
        }
        return new Date(session.ended_at) > new Date(latest) ? session.ended_at : latest;
      }, null);

      const averageAccuracy = accuracyValues.length > 0 ? this.average(accuracyValues) : 0;
      const averageCompletion = completionValues.length > 0 ? this.average(completionValues) : 0;
      const gamesPlayed = sessionsForStudent.length;

      const streak = streakAggregate?.max_current_streak ?? 0;
      const longestStreak = streakAggregate?.max_best_streak ?? 0;

      const avatarInitials = this.getInitials(profile?.display_name || profile?.email || 'Student');

      const dataQualityWarnings = this.validateSessionQuality(sessionsForStudent);

      return {
        studentId,
        studentName: profile?.display_name || 'Unknown Student',
        email: profile?.email || '',
        avatarInitials,
        classId: classIdForStudent || '',
        className: classInfo?.name || 'Unassigned',
        stats: {
          points,
          xp,
          gems,
          accuracy: Number(averageAccuracy.toFixed(1)),
          completion: Number(averageCompletion.toFixed(1)),
          streak,
          longestStreak,
          gamesPlayed,
          totalTime,
          masteredWords: masteredWordCount
        },
        achievements: achievementSummary,
        lastActivity,
        rank: 0,
        dataQualityWarnings: dataQualityWarnings.length > 0 ? dataQualityWarnings : undefined
      } satisfies StudentLeaderboardEntry;
    });

    students.sort((a, b) => b.stats.points - a.stats.points);
    students.forEach((student, index) => {
      student.rank = index + 1;
    });

    const classesLeaderboard = this.buildClassLeaderboard(classes, students);
    const crossLeaderboard = this.buildCrossLeaderboard(students, sessionsByStudent, achievementsMap, streakMap, masteredWordsMap, limit);

    const totalXP = students.reduce((sum, student) => sum + student.stats.xp, 0);
    const totalGems = students.reduce((sum, student) => sum + student.stats.gems, 0);

    return {
      students,
      classes: classesLeaderboard,
      crossLeaderboard,
      summary: {
        totalStudents: students.length,
        totalClasses: classesLeaderboard.length,
        totalXP,
        totalGems,
        timePeriod,
        generatedAt: new Date().toISOString()
      }
    };
  }

  private async fetchClasses(teacherId: string, classId?: string): Promise<ClassInfo[]> {
    let query = this.supabase
      .from('classes')
      .select('id, name')
      .eq('teacher_id', teacherId);

    if (classId) {
      query = query.eq('id', classId);
    }

    const { data, error } = await query;
    if (error) {
      throw error;
    }

    return data || [];
  }

  private async fetchEnrollments(classIds: string[]) {
    const { data, error } = await this.supabase
      .from('class_enrollments')
      .select('student_id, class_id')
      .in('class_id', classIds);

    if (error) {
      throw error;
    }

    return data || [];
  }

  private async fetchProfiles(studentIds: string[]): Promise<StudentProfile[]> {
    const { data, error } = await this.supabase
      .from('user_profiles')
      .select('user_id, display_name, email')
      .in('user_id', studentIds);

    if (error) {
      throw error;
    }

    return data || [];
  }

  private async fetchSessions(studentIds: string[], startDate: Date): Promise<SessionRow[]> {
    const { data, error } = await this.supabase
      .from('enhanced_game_sessions')
      .select('id, student_id, game_type, final_score, accuracy_percentage, completion_percentage, duration_seconds, started_at, ended_at, gems_total, xp_earned')
      .in('student_id', studentIds)
      .gte('started_at', startDate.toISOString())
      .not('ended_at', 'is', null); // Only include completed sessions

    if (error) {
      throw error;
    }

    // Filter out sessions with suspicious durations
    // Max 2 hours per session (most games should be 5-15 minutes)
    const MAX_REASONABLE_DURATION = 7200; // 2 hours in seconds
    const validSessions = (data || []).filter(session => {
      const duration = this.toNumber(session.duration_seconds);
      return duration > 0 && duration <= MAX_REASONABLE_DURATION;
    });

    return validSessions;
  }

  private async fetchRecentAchievements(studentIds: string[], timePeriod: LeaderboardTimePeriod): Promise<AchievementRow[]> {
    const { startDate } = this.getTimePeriodRange(timePeriod);

    const { data, error } = await this.supabase
      .from('student_achievements')
      .select('student_id, title, rarity, points_awarded, earned_at')
      .in('student_id', studentIds)
      .gte('earned_at', startDate.toISOString())
      .order('earned_at', { ascending: false })
      .limit(500);

    if (error) {
      throw error;
    }

    return data || [];
  }

  private async fetchStreakAggregates(studentIds: string[]): Promise<StreakAggregateRow[]> {
    const { data, error } = await this.supabase
      .from('vocabulary_gem_collection')
      .select('student_id, current_streak, best_streak')
      .in('student_id', studentIds);

    if (error) {
      throw error;
    }

    const aggregates = new Map<string, { max_current_streak: number; max_best_streak: number; total_words: number }>();

    (data ?? []).forEach(row => {
      const studentId = row.student_id as string;
      const current = aggregates.get(studentId) ?? { max_current_streak: 0, max_best_streak: 0, total_words: 0 };
      const currentStreak = this.toNumber(row.current_streak);
      const bestStreak = this.toNumber(row.best_streak);
      current.max_current_streak = Math.max(current.max_current_streak, currentStreak);
      current.max_best_streak = Math.max(current.max_best_streak, bestStreak);
      current.total_words += 1;
      aggregates.set(studentId, current);
    });

    return Array.from(aggregates.entries()).map(([student_id, totals]) => ({
      student_id,
      max_current_streak: totals.max_current_streak,
      max_best_streak: totals.max_best_streak,
      total_words: totals.total_words
    } satisfies StreakAggregateRow));
  }

  private async fetchMasteredWords(studentIds: string[]): Promise<MasteredWordsRow[]> {
    const { data, error } = await this.supabase
      .from('vocabulary_gem_collection')
      .select('student_id')
      .in('student_id', studentIds)
      .gte('mastery_level', 3);

    if (error) {
      throw error;
    }

    const counts = new Map<string, number>();
    (data ?? []).forEach(row => {
      const studentId = row.student_id as string;
      counts.set(studentId, (counts.get(studentId) ?? 0) + 1);
    });

    return Array.from(counts.entries()).map(([student_id, mastered_words]) => ({
      student_id,
      mastered_words
    } satisfies MasteredWordsRow));
  }

  private buildAchievementMap(rows: AchievementRow[]) {
    const map = new Map<string, StudentLeaderboardEntry['achievements']>();

    rows.forEach(row => {
      const existing = map.get(row.student_id) ?? {
        total: 0,
        rare: 0,
        epic: 0,
        legendary: 0,
        recent: [] as StudentLeaderboardEntry['achievements']['recent']
      };

      existing.total += 1;
      if (row.rarity === 'rare') existing.rare += 1;
      if (row.rarity === 'epic') existing.epic += 1;
      if (row.rarity === 'legendary') existing.legendary += 1;

      if (existing.recent.length < 5) {
        existing.recent.push({
          title: row.title,
          earnedAt: row.earned_at,
          rarity: row.rarity,
          points: this.toNumber(row.points_awarded)
        });
      }

      map.set(row.student_id, existing);
    });

    return map;
  }

  private buildClassLeaderboard(classes: ClassInfo[], students: StudentLeaderboardEntry[]): ClassLeaderboardEntry[] {
    const classEntries: ClassLeaderboardEntry[] = classes.map(cls => {
      const classStudents = students.filter(student => student.classId === cls.id);
      const totalPoints = classStudents.reduce((sum, student) => sum + student.stats.points, 0);
      const totalGems = classStudents.reduce((sum, student) => sum + student.stats.gems, 0);
      const averageAccuracy = classStudents.length > 0
        ? classStudents.reduce((sum, student) => sum + student.stats.accuracy, 0) / classStudents.length
        : 0;
      const averageCompletion = classStudents.length > 0
        ? classStudents.reduce((sum, student) => sum + student.stats.completion, 0) / classStudents.length
        : 0;
      const averageStreak = classStudents.length > 0
        ? classStudents.reduce((sum, student) => sum + student.stats.streak, 0) / classStudents.length
        : 0;

      const topStudent = classStudents.length > 0
        ? [...classStudents].sort((a, b) => b.stats.points - a.stats.points)[0]
        : undefined;

      return {
        classId: cls.id,
        className: cls.name,
        totalPoints,
        totalGems,
        studentCount: classStudents.length,
        averageAccuracy: Number(averageAccuracy.toFixed(1)),
        averageCompletion: Number(averageCompletion.toFixed(1)),
        averageStreak: Number(averageStreak.toFixed(1)),
        topStudent: topStudent
          ? {
              studentId: topStudent.studentId,
              studentName: topStudent.studentName,
              points: topStudent.stats.points
            }
          : undefined,
        rank: 0
      };
    });

    classEntries.sort((a, b) => b.totalPoints - a.totalPoints);
    classEntries.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    return classEntries;
  }

  private buildCrossLeaderboard(
    students: StudentLeaderboardEntry[],
    sessionsByStudent: Map<string, SessionRow[]>,
    achievementsMap: Map<string, StudentLeaderboardEntry['achievements']>,
    streakMap: Map<string, StreakAggregateRow>,
    masteredWordsMap: Map<string, number>,
    limit: number
  ): CrossGameLeaderboardEntry[] {
    const classRankMap = new Map<string, number>();

    const studentsByClass = new Map<string, StudentLeaderboardEntry[]>();
    students.forEach(student => {
      const list = studentsByClass.get(student.classId) ?? [];
      list.push(student);
      studentsByClass.set(student.classId, list);
    });

    studentsByClass.forEach(classStudents => {
      classStudents.sort((a, b) => b.stats.points - a.stats.points);
      classStudents.forEach((student, index) => {
        classRankMap.set(student.studentId, index + 1);
      });
    });

    const entries = students.map(student => {
      const sessions = sessionsByStudent.get(student.studentId) ?? [];
      const achievements = achievementsMap.get(student.studentId);
      const streakAggregate = streakMap.get(student.studentId);
      const masteredWords = masteredWordsMap.get(student.studentId) ?? 0;

      // Validate data quality and get warnings
      const dataQualityWarnings = this.validateSessionQuality(sessions);

      const gameScores: CrossGameLeaderboardEntry['game_scores'] = {};

      sessions.forEach(session => {
        const key = session.game_type || 'unknown';
        if (!gameScores[key]) {
          gameScores[key] = {
            best_score: this.toNumber(session.final_score),
            best_accuracy: this.toNumber(session.accuracy_percentage),
            games_played: 1,
            last_played: session.ended_at
          };
        } else {
          gameScores[key].best_score = Math.max(gameScores[key].best_score, this.toNumber(session.final_score));
          gameScores[key].best_accuracy = Math.max(gameScores[key].best_accuracy, this.toNumber(session.accuracy_percentage));
          gameScores[key].games_played += 1;
          if (session.ended_at && (!gameScores[key].last_played || new Date(session.ended_at) > new Date(gameScores[key].last_played!))) {
            gameScores[key].last_played = session.ended_at;
          }
        }
      });

      const currentStreak = streakAggregate?.max_current_streak ?? student.stats.streak;
      const longestStreak = streakAggregate?.max_best_streak ?? student.stats.longestStreak;

      return {
        id: student.studentId,
        student_id: student.studentId,
        student_name: student.studentName,
        student_avatar: undefined,
        class_id: student.classId,
        class_name: student.className,
        total_points: student.stats.points,
        total_xp: student.stats.xp,
        total_gems: student.stats.gems,
        current_level: Math.floor(student.stats.xp / 1000) + 1,
        games_played: student.stats.gamesPlayed,
        average_accuracy: student.stats.accuracy,
        average_completion: student.stats.completion,
        total_time_played: student.stats.totalTime,
        current_streak: currentStreak,
        longest_streak: longestStreak,
        last_activity: student.lastActivity,
        total_achievements: achievements?.total ?? 0,
        rare_achievements: achievements?.rare ?? 0,
        epic_achievements: achievements?.epic ?? 0,
        legendary_achievements: achievements?.legendary ?? 0,
        words_learned: masteredWords,
        overall_rank: 0,
        class_rank: classRankMap.get(student.studentId),
        weekly_rank: undefined,
        monthly_rank: undefined,
        game_scores: gameScores,
        data_quality_warnings: dataQualityWarnings.length > 0 ? dataQualityWarnings : undefined
      } satisfies CrossGameLeaderboardEntry;
    });

    entries.sort((a, b) => b.total_points - a.total_points);
    entries.forEach((entry, index) => {
      entry.overall_rank = index + 1;
    });

    return entries.slice(0, limit);
  }

  private getTimePeriodRange(period: LeaderboardTimePeriod): { startDate: Date; endDate: Date } {
    const now = new Date();
    const endDate = new Date(now);

    switch (period) {
      case 'daily': {
        const start = new Date(now);
        start.setHours(0, 0, 0, 0);
        return { startDate: start, endDate };
      }
      case 'weekly': {
        const start = new Date(now);
        const day = start.getDay();
        const diff = start.getDate() - day + (day === 0 ? -6 : 1);
        start.setDate(diff);
        start.setHours(0, 0, 0, 0);
        return { startDate: start, endDate };
      }
      case 'monthly': {
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        return { startDate: start, endDate };
      }
      case 'all_time':
      default: {
        const start = new Date('2024-01-01T00:00:00Z');
        return { startDate: start, endDate };
      }
    }
  }

  private average(values: number[]): number {
    if (values.length === 0) return 0;
    const sum = values.reduce((acc, value) => acc + value, 0);
    return sum / values.length;
  }

  private toNumber(value: unknown): number {
    if (value === null || value === undefined) return 0;
    if (typeof value === 'number') return value;
    const parsed = Number(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  }

  private getInitials(name: string): string {
    const parts = name.trim().split(' ');
    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }

  /**
   * Validates session data quality and flags suspicious patterns
   * Returns warnings for unrealistic activity (e.g., >8 hours/day, >100 sessions/day)
   */
  private validateSessionQuality(sessions: SessionRow[]): string[] {
    const warnings: string[] = [];

    // Group sessions by date
    const sessionsByDate = new Map<string, SessionRow[]>();
    sessions.forEach(session => {
      const date = new Date(session.started_at).toISOString().split('T')[0];
      if (!sessionsByDate.has(date)) {
        sessionsByDate.set(date, []);
      }
      sessionsByDate.get(date)!.push(session);
    });

    // Check for unrealistic daily activity
    sessionsByDate.forEach((daySessions, date) => {
      const totalHours = daySessions.reduce((sum, s) => sum + this.toNumber(s.duration_seconds), 0) / 3600;
      const sessionCount = daySessions.length;

      // Flag if more than 8 hours in a single day
      if (totalHours > 8) {
        warnings.push(`${totalHours.toFixed(1)}h on ${date} (>8h/day)`);
      }

      // Flag if more than 100 sessions in a single day (likely bulk import)
      if (sessionCount > 100) {
        warnings.push(`${sessionCount} sessions on ${date} (bulk import?)`);
      }
    });

    return warnings;
  }

  private getEmptyResponse(timePeriod: LeaderboardTimePeriod, classes: ClassInfo[] = []): TeacherLeaderboardsResponse {
    const emptyClasses = classes.map<ClassLeaderboardEntry>(cls => ({
      classId: cls.id,
      className: cls.name,
      totalPoints: 0,
      totalGems: 0,
      studentCount: 0,
      averageAccuracy: 0,
      averageCompletion: 0,
      averageStreak: 0,
      rank: 1
    }));

    return {
      students: [],
      classes: emptyClasses,
      crossLeaderboard: [],
      summary: {
        totalStudents: 0,
        totalClasses: emptyClasses.length,
        totalXP: 0,
        totalGems: 0,
        timePeriod,
        generatedAt: new Date().toISOString()
      }
    };
  }
}
