'use client';

import React from 'react';
import { 
  BarChart2, TrendingUp, Clock, Calendar, Award, Target, 
  Book, MessageSquare, Mic, Pen, CheckCircle, Hexagon
} from 'lucide-react';

type ProgressCategory = {
  id: string;
  name: string;
  score: number;
  total: number;
  icon: React.ReactNode;
  gemColor: string;
  lastAssessment: string;
};

type LanguageSkill = {
  id: string;
  name: string;
  progress: number;
  level: string;
  icon: React.ReactNode;
};

const ProgressCard = ({ category }: { category: ProgressCategory }) => {
  const percentage = Math.round((category.score / category.total) * 100);
  
  return (
    <div className="bg-white rounded-xl shadow-md p-5">
      <div className="flex items-center mb-4">
        <div className={`${category.gemColor} p-3 rounded-full mr-4`}>
          {category.icon}
        </div>
        <div>
          <h3 className="font-bold text-lg">{category.name}</h3>
          <div className="text-sm text-gray-500 flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>Last assessment: {category.lastAssessment}</span>
          </div>
        </div>
      </div>
      
      <div className="mb-2 flex justify-between items-center">
        <span className="text-sm font-medium">{category.score} / {category.total} points</span>
        <span className="text-sm font-medium">{percentage}%</span>
      </div>
      
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-indigo-600 rounded-full" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      
      <button className="w-full mt-4 border border-indigo-600 text-indigo-600 py-2 rounded-lg hover:bg-indigo-50 transition-colors">
        See Detailed Report
      </button>
    </div>
  );
};

const SkillProgressBar = ({ skill }: { skill: LanguageSkill }) => {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <div className="bg-indigo-100 p-2 rounded-full mr-3">
            {skill.icon}
          </div>
          <span className="font-medium">{skill.name}</span>
        </div>
        <div className="text-sm font-medium text-indigo-700">{skill.level}</div>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-indigo-600 rounded-full" 
          style={{ width: `${skill.progress}%` }}
        ></div>
      </div>
    </div>
  );
};

const AchievementCard = ({ 
  title, 
  date, 
  description, 
  icon, 
  color = 'bg-indigo-500' 
}: { 
  title: string; 
  date: string; 
  description: string; 
  icon: React.ReactNode;
  color?: string;
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-5 flex">
      <div className={`${color} text-white p-3 rounded-full mr-4 h-14 w-14 flex items-center justify-center flex-shrink-0`}>
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-lg">{title}</h3>
        <div className="text-sm text-gray-500 mb-2">
          <span>{date}</span>
        </div>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default function ProgressPage() {
  // Sample data
  const categories: ProgressCategory[] = [
    {
      id: '1',
      name: 'Vocabulary',
      score: 840,
      total: 1000,
      icon: <Book className="h-6 w-6 text-white" />,
      gemColor: 'bg-blue-500',
      lastAssessment: '3 days ago'
    },
    {
      id: '2',
      name: 'Grammar',
      score: 680,
      total: 1000,
      icon: <Pen className="h-6 w-6 text-white" />,
      gemColor: 'bg-purple-500',
      lastAssessment: '1 week ago'
    },
    {
      id: '3',
      name: 'Speaking',
      score: 750,
      total: 1000,
      icon: <Mic className="h-6 w-6 text-white" />,
      gemColor: 'bg-green-500',
      lastAssessment: '2 days ago'
    },
    {
      id: '4',
      name: 'Comprehension',
      score: 820,
      total: 1000,
      icon: <MessageSquare className="h-6 w-6 text-white" />,
      gemColor: 'bg-yellow-500',
      lastAssessment: '5 days ago'
    }
  ];
  
  const skills: LanguageSkill[] = [
    {
      id: '1',
      name: 'Reading',
      progress: 85,
      level: 'Advanced',
      icon: <Book className="h-5 w-5 text-indigo-600" />
    },
    {
      id: '2',
      name: 'Writing',
      progress: 70,
      level: 'Intermediate',
      icon: <Pen className="h-5 w-5 text-indigo-600" />
    },
    {
      id: '3',
      name: 'Listening',
      progress: 60,
      level: 'Intermediate',
      icon: <MessageSquare className="h-5 w-5 text-indigo-600" />
    },
    {
      id: '4',
      name: 'Speaking',
      progress: 50,
      level: 'Intermediate',
      icon: <Mic className="h-5 w-5 text-indigo-600" />
    }
  ];
  
  const achievements = [
    {
      title: 'Vocabulary Master',
      date: 'Earned 2 days ago',
      description: 'Learned 500 new words in Spanish.',
      icon: <Hexagon className="h-6 w-6" />,
      color: 'bg-blue-500'
    },
    {
      title: 'Perfect Streak',
      date: 'Earned 1 week ago',
      description: 'Completed exercises for 30 days in a row.',
      icon: <TrendingUp className="h-6 w-6" />,
      color: 'bg-green-500'
    },
    {
      title: 'Grammar Expert',
      date: 'Earned 2 weeks ago',
      description: 'Mastered advanced verb conjugation.',
      icon: <CheckCircle className="h-6 w-6" />,
      color: 'bg-purple-500'
    }
  ];

  // Calculate total progress score
  const totalScore = categories.reduce((sum, category) => sum + category.score, 0);
  const totalPossible = categories.reduce((sum, category) => sum + category.total, 0);
  const overallPercentage = Math.round((totalScore / totalPossible) * 100);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white mb-2">Progress Tracking</h1>
      
      {/* Overall Progress Card */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Overall Progress</h2>
            <p className="text-gray-600">You're making great progress!</p>
          </div>
          <div className="text-3xl font-bold text-indigo-600">{overallPercentage}%</div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map(category => (
            <ProgressCard key={category.id} category={category} />
          ))}
        </div>
      </div>
      
      {/* Language Skills Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-6">Language Skills</h2>
          <div className="space-y-6">
            {skills.map(skill => (
              <SkillProgressBar key={skill.id} skill={skill} />
            ))}
          </div>
        </div>
        
        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-6">Recent Achievements</h2>
          <div className="space-y-4">
            {achievements.map((achievement, index) => (
              <AchievementCard 
                key={index}
                title={achievement.title}
                date={achievement.date}
                description={achievement.description}
                icon={achievement.icon}
                color={achievement.color}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 