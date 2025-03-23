'use client';

// Add export config to skip static generation
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../components/auth/AuthProvider';
import { 
  Trophy, Medal, Award, Star, Users, User, Filter, Clock, 
  ArrowUp, ChevronDown, CheckCircle, Zap, BookOpen, Crown
} from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '../../../lib/database.types';

// Define proper types for our data structures
interface Achievement {
  date: string;
  type: 'badge' | 'milestone';
  title: string;
  icon: 'medal' | 'trophy' | 'check';
  points: number;
}

interface StudentStats {
  points: number;
  streaks: number;
  accuracy: number;
  completion: number;
  rank: number;
}

interface Student {
  id: string;
  name: string;
  email: string;
  avatar: string;
  class: string;
  classId: string;
  stats: StudentStats;
  badges: string[];
  recentAchievements: Achievement[];
}

interface ClassData {
  id: string;
  name: string;
  level: string;
  totalPoints: number;
  studentCount: number;
  topStudent: string;
  rank: number;
}

export default function LeaderboardsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [selectedClass, setSelectedClass] = useState('all');
  const [timeframe, setTimeframe] = useState('week'); // 'week', 'month', 'semester'
  const [leaderboardType, setLeaderboardType] = useState<'points' | 'streaks' | 'accuracy' | 'completion'>('points');

  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const sampleStudents = [
      {
        id: '1',
        name: 'Alex Johnson',
        email: 'alex.j@example.com',
        avatar: 'A',
        class: 'Spanish 101',
        classId: '1',
        stats: {
          points: 3450,
          streaks: 15,
          accuracy: 88,
          completion: 92,
          rank: 2
        },
        badges: ['vocabulary-master', 'perfect-week', 'fast-learner'],
        recentAchievements: [
          { date: '2023-06-10', type: 'badge', title: 'Perfect Week', icon: 'medal', points: 500 },
          { date: '2023-06-08', type: 'milestone', title: 'Completed 50 Exercises', icon: 'check', points: 300 },
        ]
      },
      {
        id: '2',
        name: 'Maria Garcia',
        email: 'maria.g@example.com',
        avatar: 'M',
        class: 'Spanish 101',
        classId: '1',
        stats: {
          points: 4200,
          streaks: 22,
          accuracy: 94,
          completion: 98,
          rank: 1
        },
        badges: ['vocabulary-master', 'grammar-expert', 'perfect-month', 'fast-learner', 'top-student'],
        recentAchievements: [
          { date: '2023-06-12', type: 'badge', title: 'Top Student', icon: 'trophy', points: 1000 },
          { date: '2023-06-09', type: 'milestone', title: 'Completed 100 Exercises', icon: 'check', points: 500 },
        ]
      },
      {
        id: '3',
        name: 'James Wilson',
        email: 'james.w@example.com',
        avatar: 'J',
        class: 'Spanish 101',
        classId: '1',
        stats: {
          points: 2100,
          streaks: 8,
          accuracy: 76,
          completion: 85,
          rank: 5
        },
        badges: ['fast-learner'],
        recentAchievements: [
          { date: '2023-06-07', type: 'milestone', title: 'Completed 25 Exercises', icon: 'check', points: 100 },
        ]
      },
      {
        id: '4',
        name: 'Sophia Chen',
        email: 'sophia.c@example.com',
        avatar: 'S',
        class: 'Japanese Beginners',
        classId: '3',
        stats: {
          points: 3120,
          streaks: 12,
          accuracy: 91,
          completion: 94,
          rank: 1
        },
        badges: ['vocabulary-master', 'perfect-week', 'fast-learner'],
        recentAchievements: [
          { date: '2023-06-11', type: 'badge', title: 'Perfect Week', icon: 'medal', points: 500 },
          { date: '2023-06-09', type: 'milestone', title: 'Completed 50 Exercises', icon: 'check', points: 300 },
        ]
      },
      {
        id: '5',
        name: 'Ethan Roberts',
        email: 'ethan.r@example.com',
        avatar: 'E',
        class: 'German 301',
        classId: '4',
        stats: {
          points: 2900,
          streaks: 10,
          accuracy: 82,
          completion: 88,
          rank: 2
        },
        badges: ['fast-learner', 'perfect-week'],
        recentAchievements: [
          { date: '2023-06-08', type: 'badge', title: 'Perfect Week', icon: 'medal', points: 500 },
        ]
      },
      {
        id: '6',
        name: 'Olivia Lee',
        email: 'olivia.l@example.com',
        avatar: 'O',
        class: 'Spanish 101',
        classId: '1',
        stats: {
          points: 2800,
          streaks: 9,
          accuracy: 85,
          completion: 90,
          rank: 4
        },
        badges: ['vocabulary-master', 'fast-learner'],
        recentAchievements: [
          { date: '2023-06-10', type: 'milestone', title: 'Completed 40 Exercises', icon: 'check', points: 200 },
        ]
      },
      {
        id: '7',
        name: 'Noah Davis',
        email: 'noah.d@example.com',
        avatar: 'N',
        class: 'Spanish 101',
        classId: '1',
        stats: {
          points: 3100,
          streaks: 14,
          accuracy: 87,
          completion: 91,
          rank: 3
        },
        badges: ['fast-learner', 'perfect-week'],
        recentAchievements: [
          { date: '2023-06-09', type: 'badge', title: 'Perfect Week', icon: 'medal', points: 500 },
        ]
      }
    ];

    const sampleClasses = [
      { 
        id: '1', 
        name: 'Spanish 101', 
        level: 'Beginner', 
        totalPoints: 15650,
        studentCount: 5,
        topStudent: 'Maria Garcia',
        rank: 1
      },
      { 
        id: '2', 
        name: 'Spanish 201', 
        level: 'Intermediate', 
        totalPoints: 9200,
        studentCount: 4,
        topStudent: 'Rebecca Johnson',
        rank: 3
      },
      { 
        id: '3', 
        name: 'Japanese Beginners', 
        level: 'Beginner', 
        totalPoints: 11300,
        studentCount: 3,
        topStudent: 'Sophia Chen',
        rank: 2
      },
      { 
        id: '4', 
        name: 'German 301', 
        level: 'Advanced', 
        totalPoints: 8400,
        studentCount: 3,
        topStudent: 'Ethan Roberts',
        rank: 4
      }
    ];
    
    // In a real implementation, we would fetch from the database
    // const fetchLeaderboards = async () => {
    //   const { data, error } = await supabase
    //     .from('students')
    //     .select('*')
    //     .eq('teacher_id', user?.id);
    //   
    //   if (error) console.error('Error fetching students:', error);
    //   else setStudents(data || []);
    // };
    
    setStudents(sampleStudents as Student[]);
    setClasses(sampleClasses as ClassData[]);
    setLoading(false);
    
    // fetchLeaderboards();
  }, [user]);

  // Filter students based on selected class
  const filteredStudents = students.filter(student => {
    if (selectedClass === 'all') {
      return true;
    }
    return student.classId === selectedClass;
  });

  // Sort students based on selected leaderboard type
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    return b.stats[leaderboardType] - a.stats[leaderboardType];
  });

  // Sort classes by rank
  const sortedClasses = [...classes].sort((a, b) => a.rank - b.rank);

  const getBadgeIcon = (badge: string) => {
    switch(badge) {
      case 'vocabulary-master':
        return <BookOpen className="text-indigo-500" size={18} />;
      case 'grammar-expert':
        return <CheckCircle className="text-emerald-500" size={18} />;
      case 'perfect-week':
        return <Medal className="text-amber-500" size={18} />;
      case 'perfect-month':
        return <Trophy className="text-amber-500" size={18} />;
      case 'fast-learner':
        return <Zap className="text-blue-500" size={18} />;
      case 'top-student':
        return <Crown className="text-purple-500" size={18} />;
      default:
        return <Star className="text-gray-500" size={18} />;
    }
  };

  const getBadgeTitle = (badge: string) => {
    switch(badge) {
      case 'vocabulary-master':
        return 'Vocabulary Master';
      case 'grammar-expert':
        return 'Grammar Expert';
      case 'perfect-week':
        return 'Perfect Week';
      case 'perfect-month':
        return 'Perfect Month';
      case 'fast-learner':
        return 'Fast Learner';
      case 'top-student':
        return 'Top Student';
      default:
        return 'Achievement';
    }
  };

  const getStatIcon = (statType: string) => {
    switch(statType) {
      case 'points':
        return <Trophy className="text-amber-500" size={20} />;
      case 'streaks':
        return <Zap className="text-blue-500" size={20} />;
      case 'accuracy':
        return <CheckCircle className="text-emerald-500" size={20} />;
      case 'completion':
        return <Award className="text-indigo-500" size={20} />;
      default:
        return <Star className="text-gray-500" size={20} />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-teal-100 to-rose-100 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-teal-800 mb-2">Leaderboards</h1>
          <p className="text-teal-600">Celebrate achievements and foster healthy competition among your students</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="col-span-1 md:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 h-full">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <Trophy className="text-amber-500 mr-2" size={22} />
                  Student Leaderboard
                </h2>
                
                <div className="flex flex-wrap gap-3">
                  <div className="relative">
                    <select
                      className="pl-3 pr-8 py-2 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                    >
                      <option value="all">All Classes</option>
                      {classes.map(cls => (
                        <option key={cls.id} value={cls.id}>{cls.name}</option>
                      ))}
                    </select>
                    <Filter className="absolute right-2 top-2.5 text-gray-400 pointer-events-none" size={16} />
                  </div>
                  
                  <div className="relative">
                    <select
                      className="pl-3 pr-8 py-2 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      value={leaderboardType}
                      onChange={(e) => setLeaderboardType(e.target.value as any)}
                    >
                      <option value="points">Total Points</option>
                      <option value="streaks">Longest Streaks</option>
                      <option value="accuracy">Accuracy</option>
                      <option value="completion">Completion Rate</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-2.5 text-gray-400 pointer-events-none" size={16} />
                  </div>
                </div>
              </div>
              
              <div className="overflow-y-auto" style={{ maxHeight: '500px' }}>
                <ul className="space-y-3">
                  {sortedStudents.map((student, index) => (
                    <li 
                      key={student.id} 
                      className={`flex items-center p-3 rounded-lg border ${
                        index === 0 ? 'border-amber-300 bg-amber-50' : 
                        index === 1 ? 'border-gray-300 bg-gray-50' :
                        index === 2 ? 'border-amber-700 bg-amber-50' :
                        'border-gray-200 bg-white'
                      }`}
                    >
                      <div className="flex-shrink-0 w-10 text-center font-bold text-xl text-gray-500">
                        {index === 0 ? <Crown className="mx-auto text-amber-500" size={24} /> : 
                         index === 1 ? <Medal className="mx-auto text-gray-400" size={22} /> :
                         index === 2 ? <Medal className="mx-auto text-amber-700" size={22} /> :
                         `#${index + 1}`}
                      </div>
                      
                      <div className="ml-3 flex-shrink-0 h-10 w-10 bg-teal-600 rounded-full flex items-center justify-center text-white">
                        {student.avatar}
                      </div>
                      
                      <div className="ml-4 flex-grow">
                        <div className="font-medium text-gray-900">{student.name}</div>
                        <div className="text-sm text-gray-500">{student.class}</div>
                      </div>
                      
                      <div className="ml-2 flex-shrink-0">
                        <div className="flex items-center gap-1">
                          {getStatIcon(leaderboardType)}
                          <span className="font-bold text-gray-800">
                            {leaderboardType === 'accuracy' || leaderboardType === 'completion' 
                              ? `${student.stats[leaderboardType]}%`
                              : student.stats[leaderboardType]}
                          </span>
                          <span className="text-xs text-gray-500 ml-1">
                            {leaderboardType === 'points' ? 'pts' : 
                             leaderboardType === 'streaks' ? 'days' : ''}
                          </span>
                        </div>
                      </div>
                      
                      <div className="ml-6 flex-shrink-0">
                        <div className="flex -space-x-2">
                          {student.badges.slice(0, 3).map((badge: string, i: number) => (
                            <div 
                              key={i}
                              className="h-8 w-8 rounded-full bg-white border border-gray-200 flex items-center justify-center"
                              title={getBadgeTitle(badge)}
                            >
                              {getBadgeIcon(badge)}
                            </div>
                          ))}
                          {student.badges.length > 3 && (
                            <div className="h-8 w-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-xs text-gray-500 font-medium">
                              +{student.badges.length - 3}
                            </div>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          <div className="col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 h-full">
              <h2 className="text-xl font-bold text-gray-800 flex items-center mb-6">
                <Users className="text-teal-600 mr-2" size={22} />
                Class Rankings
              </h2>
              
              <div className="overflow-y-auto" style={{ maxHeight: '500px' }}>
                <ul className="space-y-3">
                  {sortedClasses.map((cls, index) => (
                    <li 
                      key={cls.id} 
                      className={`p-3 rounded-lg border ${
                        index === 0 ? 'border-amber-300 bg-amber-50' : 
                        index === 1 ? 'border-gray-300 bg-gray-50' :
                        index === 2 ? 'border-amber-700 bg-amber-50' :
                        'border-gray-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center mb-2">
                        <div className="flex-shrink-0 w-8 text-center font-bold text-lg text-gray-500">
                          {index === 0 ? <Trophy className="text-amber-500" size={20} /> : 
                          index === 1 ? <Trophy className="text-gray-400" size={20} /> :
                          index === 2 ? <Trophy className="text-amber-700" size={20} /> :
                          `#${index + 1}`}
                        </div>
                        <div className="ml-2 flex-grow">
                          <div className="font-medium text-gray-900">{cls.name}</div>
                          <div className="text-sm text-gray-500">{cls.level}</div>
                        </div>
                      </div>
                      
                      <div className="ml-8 grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500">Points:</span>
                          <span className="ml-1 font-medium text-gray-900">{cls.totalPoints}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Students:</span>
                          <span className="ml-1 font-medium text-gray-900">{cls.studentCount}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-gray-500">Top Student:</span>
                          <span className="ml-1 font-medium text-gray-900">{cls.topStudent}</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 flex items-center mb-6">
            <Award className="text-indigo-500 mr-2" size={22} />
            Recent Achievements
          </h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Achievement</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students
                  .flatMap(student => 
                    student.recentAchievements.map((achievement: Achievement) => ({
                      ...achievement,
                      studentName: student.name,
                      studentClass: student.class,
                      studentAvatar: student.avatar
                    }))
                  )
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 10)
                  .map((achievement, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 bg-teal-600 rounded-full flex items-center justify-center text-white text-sm">
                            {achievement.studentAvatar}
                          </div>
                          <div className="ml-3">
                            <div className="font-medium text-gray-900">{achievement.studentName}</div>
                            <div className="text-xs text-gray-500">{achievement.studentClass}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="mr-2">
                            {achievement.icon === 'medal' && <Medal className="text-amber-500" size={16} />}
                            {achievement.icon === 'trophy' && <Trophy className="text-amber-500" size={16} />}
                            {achievement.icon === 'check' && <CheckCircle className="text-emerald-500" size={16} />}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{achievement.title}</div>
                            <div className="text-xs text-gray-500">{achievement.type.charAt(0).toUpperCase() + achievement.type.slice(1)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Clock className="mr-1.5 text-gray-400" size={14} />
                          {new Date(achievement.date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center font-medium text-amber-600">
                          <Star className="mr-1 text-amber-500" size={14} />
                          {achievement.points} pts
                        </div>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 