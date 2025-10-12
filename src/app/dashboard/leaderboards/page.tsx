'use client';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import {
  Trophy,
  Medal,
  Award,
  Star,
  Target,
  TrendingUp,
  Users,
  Filter,
  Crown,
  Zap,
  Calendar,
  User,
  BarChart3,
  ChevronRight,
  Search,
  RefreshCw,
  Flame,
  Gamepad2
} from 'lucide-react';

import { useAuth } from '../../../components/auth/AuthProvider';
import CrossGameLeaderboard from '../../../components/leaderboards/CrossGameLeaderboard';
import DashboardHeader from '../../../components/dashboard/DashboardHeader';
import type {
  TeacherLeaderboardsResponse,
  StudentLeaderboardEntry,
  ClassLeaderboardEntry,
  LeaderboardTimePeriod
} from '../../../services/leaderboards/TeacherLeaderboardsService';

const TIME_PERIOD_OPTIONS: Array<{ id: LeaderboardTimePeriod; label: string }> = [
  { id: 'daily', label: 'Today' },
  { id: 'weekly', label: 'This Week' },
  { id: 'monthly', label: 'This Month' },
  { id: 'all_time', label: 'All Time' }
];

type ViewMode = 'cross-game' | 'students' | 'classes';

const DEFAULT_SUMMARY: TeacherLeaderboardsResponse['summary'] = {
  totalStudents: 0,
  totalClasses: 0,
  totalXP: 0,
  totalGems: 0,
  timePeriod: 'weekly',
  generatedAt: new Date().toISOString()
};

export default function LeaderboardsPage() {
  const { user } = useAuth();
  const [leaderboards, setLeaderboards] = useState<TeacherLeaderboardsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<'all' | string>('all');
  const [view, setView] = useState<ViewMode>('cross-game');
  const [searchQuery, setSearchQuery] = useState('');
  const [timePeriod, setTimePeriod] = useState<LeaderboardTimePeriod>('weekly');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchLeaderboards = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        teacherId: user.id,
        timePeriod,
        limit: '200'
      });

      const response = await fetch(`/api/dashboard/leaderboards?${params.toString()}`, {
        cache: 'no-store'
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body?.error ?? 'Failed to load leaderboards');
      }

      const payload = (await response.json()) as { leaderboards: TeacherLeaderboardsResponse };
      setLeaderboards(payload.leaderboards);
    } catch (err) {
      console.error('[LeaderboardsPage] Failed to load data', err);
      setLeaderboards(null);
      setError(err instanceof Error ? err.message : 'Failed to load leaderboards');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLeaderboards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, timePeriod]);

  useEffect(() => {
    if (!leaderboards) return;
    if (selectedClass !== 'all' && !leaderboards.classes.some(cls => cls.classId === selectedClass)) {
      setSelectedClass('all');
    }
  }, [leaderboards, selectedClass]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchLeaderboards();
  };

  const students = leaderboards?.students ?? [];
  const classes = leaderboards?.classes ?? [];
  const crossEntries = leaderboards?.crossLeaderboard ?? [];
  const summary = leaderboards?.summary ?? { ...DEFAULT_SUMMARY, timePeriod };

  const filteredStudents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return students.filter(student => {
      const matchesClass = selectedClass === 'all' || student.classId === selectedClass;
      const matchesSearch =
        query.length === 0 ||
        student.studentName.toLowerCase().includes(query) ||
        student.email.toLowerCase().includes(query);
      return matchesClass && matchesSearch;
    });
  }, [students, selectedClass, searchQuery]);

  const filteredClasses = useMemo(() => {
    if (selectedClass === 'all') return classes;
    return classes.filter(cls => cls.classId === selectedClass);
  }, [classes, selectedClass]);

  const filteredCrossEntries = useMemo(() => {
    if (selectedClass === 'all') return crossEntries;
    return crossEntries.filter(entry => entry.class_id === selectedClass);
  }, [crossEntries, selectedClass]);

  const summaryForSelection = useMemo(() => {
    if (selectedClass === 'all') {
      return summary;
    }

    const totalXP = filteredStudents.reduce((sum, student) => sum + student.stats.xp, 0);
    const totalGems = filteredStudents.reduce((sum, student) => sum + student.stats.gems, 0);

    return {
      totalStudents: filteredStudents.length,
      totalClasses: filteredClasses.length,
      totalXP,
      totalGems,
      timePeriod: summary.timePeriod,
      generatedAt: summary.generatedAt
    } satisfies TeacherLeaderboardsResponse['summary'];
  }, [filteredClasses.length, filteredStudents, selectedClass, summary]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-2">
          <User className="h-10 w-10 mx-auto text-slate-400" />
          <p className="text-slate-600 font-medium">Please sign in to view leaderboards.</p>
        </div>
      </div>
    );
  }

  if (loading && !leaderboards) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <DashboardHeader
          title="Leaderboards & Rankings"
          description="Track competition and motivate your students with achievements"
          icon={<Trophy className="h-5 w-5 text-white" />}
        />

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center justify-between">
            <div>
              <p className="font-semibold">We couldn't load the latest rankings.</p>
              <p className="text-sm text-red-600/80">{error}</p>
            </div>
            <button
              onClick={handleRefresh}
              className="inline-flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg shadow-sm hover:bg-red-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4 animate-spin-slow" />
              Retry
            </button>
          </div>
        )}

        <SummaryCards summary={summaryForSelection} isRefreshing={isRefreshing} onRefresh={handleRefresh} />

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-lg p-6">
          <div className="flex flex-col lg:flex-row justify-between gap-6">
            <div className="flex flex-1 flex-wrap gap-3">
              <div className="relative flex-1 min-w-[240px]">
                <input
                  type="text"
                  placeholder="Search students..."
                  className="w-full pl-11 pr-4 py-3 border border-slate-300/60 rounded-xl bg-white/90 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-sm"
                  value={searchQuery}
                  onChange={event => setSearchQuery(event.target.value)}
                />
                <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
              </div>

              <div className="relative min-w-[180px]">
                <select
                  className="pl-4 pr-10 py-3 border border-slate-300/60 rounded-xl bg-white/90 appearance-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-sm font-medium text-slate-700"
                  value={selectedClass}
                  onChange={event => setSelectedClass(event.target.value)}
                >
                  <option value="all">All Classes</option>
                  {classes.map(cls => (
                    <option key={cls.classId} value={cls.classId}>
                      {cls.className}
                    </option>
                  ))}
                </select>
                <Filter className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" size={16} />
              </div>

              <div className="relative min-w-[180px]">
                <select
                  className="pl-4 pr-10 py-3 border border-slate-300/60 rounded-xl bg-white/90 appearance-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-sm font-medium text-slate-700"
                  value={timePeriod}
                  onChange={event => setTimePeriod(event.target.value as LeaderboardTimePeriod)}
                >
                  {TIME_PERIOD_OPTIONS.map(option => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <Calendar className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" size={16} />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-slate-100/80 rounded-xl p-1 flex">
                <TabButton active={view === 'cross-game'} onClick={() => setView('cross-game')} icon={Gamepad2}>
                  Cross-Game
                </TabButton>
                <TabButton active={view === 'students'} onClick={() => setView('students')} icon={Users}>
                  Students
                </TabButton>
                <TabButton active={view === 'classes'} onClick={() => setView('classes')} icon={Trophy}>
                  Classes
                </TabButton>
              </div>

              <button
                onClick={handleRefresh}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 transition-colors"
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin-slow' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {view === 'cross-game' && (
          <CrossGameLeaderboard
            classId={selectedClass !== 'all' ? selectedClass : undefined}
            entries={leaderboards ? filteredCrossEntries : undefined}
            autoFetch={false}
            loadingOverride={loading}
            timePeriod={timePeriod}
            onTimePeriodChange={period => setTimePeriod(period)}
            onRefresh={handleRefresh}
            limit={filteredCrossEntries.length || 10}
            showFilters={true}
            compact={false}
          />
        )}

        {view === 'students' && (
          <StudentLeaderboard students={filteredStudents} loading={loading} />
        )}

        {view === 'classes' && (
          <ClassLeaderboard classes={filteredClasses} loading={loading} />
        )}
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon: Icon,
  children
}: {
  active: boolean;
  onClick: () => void;
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 inline-flex items-center gap-2 ${
        active ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-800'
      }`}
    >
      <Icon className="h-4 w-4" />
      {children}
    </button>
  );
}

function SummaryCards({
  summary,
  isRefreshing,
  onRefresh
}: {
  summary: TeacherLeaderboardsResponse['summary'];
  isRefreshing: boolean;
  onRefresh: () => void;
}) {
  const formattedTime = new Date(summary.generatedAt).toLocaleString();

  const cards = [
    {
      title: 'Active Students',
      value: summary.totalStudents,
      icon: Users,
      trend: '+12% vs last period',
      accent: 'bg-indigo-100 text-indigo-600'
    },
    {
      title: 'Classes Tracked',
      value: summary.totalClasses,
      icon: BarChart3,
      trend: 'Across selected filters',
      accent: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Total XP Earned',
      value: summary.totalXP,
      icon: Zap,
      trend: timePeriodLabel(summary.timePeriod),
      accent: 'bg-purple-100 text-purple-600'
    },
    {
      title: 'Gems Collected',
      value: summary.totalGems,
      icon: Trophy,
      trend: 'Motivation streaks',
      accent: 'bg-amber-100 text-amber-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map(card => (
        <div key={card.title} className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-lg p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">{card.title}</span>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.accent}`}>
              <card.icon className="h-5 w-5" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-slate-900">{card.value.toLocaleString()}</p>
            <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
              {card.trend}
            </p>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Last updated {formattedTime}</span>
            <button
              onClick={onRefresh}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin-slow' : ''}`} />
              Sync
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function StudentLeaderboard({ students, loading }: { students: StudentLeaderboardEntry[]; loading: boolean }) {
  if (loading) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-lg p-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
        <p className="mt-6 text-slate-600">Loading student rankings...</p>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-lg p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mb-6 border border-indigo-200/50">
            <Trophy className="h-10 w-10 text-indigo-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">No student rankings yet</h3>
          <p className="text-slate-600 mb-8 leading-relaxed">
            Encourage your students to play learning games. Their progress, achievements and streaks will appear here in real time.
          </p>
          <Link
            href="/dashboard/classes"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl inline-flex items-center space-x-2"
          >
            <Users className="h-4 w-4" />
            <span>Manage Classes</span>
          </Link>
        </div>
      </div>
    );
  }

  const topThree = students.slice(0, 3);

  return (
    <div className="space-y-6">
      {topThree.length >= 3 && (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-lg p-8">
          <h3 className="text-xl font-bold text-slate-900 mb-6 text-center">🏆 Top Performers</h3>
          <div className="flex justify-center items-end gap-6">
            {topThree[1] && <PodiumCard student={topThree[1]} position={2} />}
            {topThree[0] && <PodiumCard student={topThree[0]} position={1} />}
            {topThree[2] && <PodiumCard student={topThree[2]} position={3} />}
          </div>
        </div>
      )}

      <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-lg overflow-hidden">
        <div className="p-6 border-b border-slate-200/60 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Student Rankings</h3>
            <p className="text-slate-600 text-sm mt-1">{students.length} students</p>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {students.map(student => (
            <div key={student.studentId} className="p-5 hover:bg-slate-50/60 transition-colors">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg ${
                    student.rank === 1
                      ? 'bg-gradient-to-br from-yellow-400 to-yellow-500'
                      : student.rank === 2
                      ? 'bg-gradient-to-br from-slate-400 to-slate-500'
                      : student.rank === 3
                      ? 'bg-gradient-to-br from-amber-600 to-amber-700'
                      : 'bg-slate-300'
                  }`}>
                    {student.rank <= 3 ? <MedalIcon rank={student.rank} /> : `#${student.rank}`}
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                      {student.avatarInitials}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{student.studentName}</div>
                      <div className="text-sm text-slate-500">{student.className}</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm flex-1">
                  <StatBlock label="Points" value={student.stats.points.toLocaleString()} icon={Trophy} accent="text-indigo-600" />
                  <StatBlock label="XP" value={student.stats.xp.toLocaleString()} icon={Zap} accent="text-purple-600" />
                  <StatBlock label="Gems" value={student.stats.gems.toLocaleString()} icon={Star} accent="text-amber-600" />
                  <StatBlock label="Accuracy" value={`${student.stats.accuracy.toFixed(1)}%`} icon={Target} accent="text-emerald-600" />
                  <StatBlock label="Completion" value={`${student.stats.completion.toFixed(1)}%`} icon={BarChart3} accent="text-blue-600" />
                  <StatBlock label="Games" value={student.stats.gamesPlayed} icon={Gamepad2} accent="text-slate-600" />
                  <StatBlock label="Streak" value={`${student.stats.streak} days`} icon={Flame} accent="text-orange-500" />
                  <StatBlock label="Longest Streak" value={`${student.stats.longestStreak} days`} icon={TrendingUp} accent="text-pink-500" />
                </div>

                <div className="flex flex-col gap-3 min-w-[220px]">
                  <div>
                    <p className="text-xs uppercase text-slate-400 mb-1">Recent Achievements</p>
                    {student.achievements.recent.length === 0 ? (
                      <p className="text-sm text-slate-500">No achievements yet</p>
                    ) : (
                      <div className="space-y-1">
                        {student.achievements.recent.map(achievement => (
                          <div key={`${achievement.title}-${achievement.earnedAt}`} className="flex items-center justify-between text-sm bg-slate-100/70 px-3 py-1.5 rounded-lg">
                            <span className="font-medium text-slate-700">{achievement.title}</span>
                            <span className="text-xs text-slate-500">{new Date(achievement.earnedAt).toLocaleDateString()}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-slate-400">Last active: {formatRelativeTime(student.lastActivity)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ClassLeaderboard({ classes, loading }: { classes: ClassLeaderboardEntry[]; loading: boolean }) {
  if (loading) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-lg p-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
        <p className="mt-6 text-slate-600">Loading class standings...</p>
      </div>
    );
  }

  if (classes.length === 0) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-lg p-12 text-center">
        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mb-6 border border-slate-200">
          <Users className="h-10 w-10 text-slate-500" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-3">No classes selected</h3>
        <p className="text-slate-600 mb-4">Choose a class from the filters to inspect its performance.</p>
        <Link
          href="/dashboard/classes"
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg shadow-sm hover:bg-slate-700 transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
          Manage Classes
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-lg">
      <div className="p-6 border-b border-slate-200/60">
        <h3 className="text-lg font-bold text-slate-900">Class Leaderboard</h3>
        <p className="text-slate-600 text-sm mt-1">Sorted by total points earned</p>
      </div>
      <div className="divide-y divide-slate-100">
        {classes.map(cls => (
          <div key={cls.classId} className="p-6 hover:bg-slate-50/60 transition-colors">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg ${
                  cls.rank === 1
                    ? 'bg-gradient-to-br from-indigo-500 to-indigo-600'
                    : cls.rank === 2
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600'
                    : cls.rank === 3
                    ? 'bg-gradient-to-br from-violet-500 to-violet-600'
                    : 'bg-slate-300'
                }`}>
                  {cls.rank <= 3 ? <MedalIcon rank={cls.rank} /> : `#${cls.rank}`}
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-slate-900">{cls.className}</h4>
                  <p className="text-sm text-slate-500">{cls.studentCount} students</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
                <StatBlock label="Total Points" value={cls.totalPoints.toLocaleString()} icon={Trophy} accent="text-indigo-600" />
                <StatBlock label="Gems" value={cls.totalGems.toLocaleString()} icon={Star} accent="text-amber-600" />
                <StatBlock label="Avg Accuracy" value={`${cls.averageAccuracy.toFixed(1)}%`} icon={Target} accent="text-emerald-600" />
                <StatBlock label="Avg Completion" value={`${cls.averageCompletion.toFixed(1)}%`} icon={BarChart3} accent="text-blue-600" />
              </div>

              {cls.topStudent && (
                <div className="min-w-[220px] bg-slate-100/70 rounded-xl p-4">
                  <p className="text-xs uppercase text-slate-400 mb-1">Top Student</p>
                  <p className="text-sm font-semibold text-slate-800">{cls.topStudent.studentName}</p>
                  <p className="text-xs text-slate-500">{cls.topStudent.points.toLocaleString()} pts</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PodiumCard({ student, position }: { student: StudentLeaderboardEntry; position: 1 | 2 | 3 }) {
  const podiumStyles = {
    1: {
      container: 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200',
      badge: 'bg-gradient-to-br from-yellow-400 to-yellow-500',
      size: 'w-20 h-20 text-2xl'
    },
    2: {
      container: 'bg-slate-100 border-slate-200',
      badge: 'bg-gradient-to-br from-slate-400 to-slate-500',
      size: 'w-16 h-16 text-xl'
    },
    3: {
      container: 'bg-amber-50 border-amber-200',
      badge: 'bg-gradient-to-br from-amber-600 to-amber-700',
      size: 'w-16 h-16 text-xl'
    }
  } as const;

  const style = podiumStyles[position];

  return (
    <div className={`text-center transform ${position === 1 ? '-translate-y-4' : ''}`}>
      <div className={`${style.size} mx-auto rounded-2xl flex items-center justify-center text-white font-bold mb-3 ${style.badge}`}>
        {student.avatarInitials}
      </div>
      <div className={`px-6 py-4 rounded-xl border ${style.container}`}>
        <div className="font-bold text-slate-900">{student.studentName}</div>
        <div className="text-sm text-slate-600">{student.className}</div>
        <div className="mt-3 flex items-center justify-center gap-2 text-sm font-semibold text-slate-800">
          <Trophy className="h-4 w-4 text-amber-500" />
          {student.stats.points.toLocaleString()} pts
        </div>
        <div className="mt-3 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-900 text-white text-xs">
          {position === 1 ? <Crown className="h-5 w-5" /> : <MedalIcon rank={position} />}
          {position === 1 ? 'Champion' : `Rank ${position}`}
        </div>
      </div>
    </div>
  );
}

function StatBlock({
  label,
  value,
  icon: Icon,
  accent
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accent: string;
}) {
  return (
    <div className="bg-slate-100/60 rounded-xl px-4 py-3 flex items-center gap-3">
      <div className={`p-2 rounded-lg bg-white shadow-sm ${accent}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-xs uppercase text-slate-400">{label}</p>
        <p className="text-sm font-semibold text-slate-800">{value}</p>
      </div>
    </div>
  );
}

function MedalIcon({ rank }: { rank: number }) {
  if (rank === 1) return <Crown className="h-5 w-5" />;
  if (rank === 2) return <Medal className="h-5 w-5" />;
  if (rank === 3) return <Award className="h-5 w-5" />;
  return <span className="font-bold">#{rank}</span>;
}

function timePeriodLabel(period: LeaderboardTimePeriod) {
  const option = TIME_PERIOD_OPTIONS.find(opt => opt.id === period);
  return option ? option.label : 'This Week';
}

function formatRelativeTime(date: string | null) {
  if (!date) return 'No activity yet';
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString();
}