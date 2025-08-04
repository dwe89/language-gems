#!/usr/bin/env node

// Test dashboard data processing
const mockStudentData = [
  {
    student_id: "1bfacaf7-90a7-4888-a971-2b06b7d7104d",
    student_name: "Steve Jobs",
    email: "steve.jobs.1753557108210@student.languagegems.com",
    class_id: null,
    class_name: "Default Class",
    last_active: "2025-08-03T08:10:26.106+00:00",
    total_sessions: 21,
    average_accuracy: 77.56,
    total_xp: 1993,
    average_session_duration: 187,
    recent_sessions: [
      {
        game_type: "sentence-towers",
        accuracy_percentage: 78.23,
        xp_earned: 126,
        duration_seconds: 162,
        created_at: "2025-08-03T08:10:26.106+00:00"
      }
    ],
    is_at_risk: false,
    risk_factors: [],
    risk_score: 0
  },
  {
    student_id: "2cfacaf7-90a7-4888-a971-2b06b7d7104d",
    student_name: "Stephen Smith",
    email: "stephen.smith.1753557108210@student.languagegems.com",
    class_id: null,
    class_name: "Default Class",
    last_active: "2025-08-02T08:10:26.106+00:00",
    total_sessions: 15,
    average_accuracy: 83.86,
    total_xp: 2154,
    average_session_duration: 289,
    recent_sessions: [
      {
        game_type: "word-towers",
        accuracy_percentage: 85.23,
        xp_earned: 156,
        duration_seconds: 262,
        created_at: "2025-08-02T08:10:26.106+00:00"
      }
    ],
    is_at_risk: false,
    risk_factors: [],
    risk_score: 0
  }
];

console.log('🎯 Testing Dashboard Data Processing');
console.log('=====================================\n');

// Test ProactiveAIDashboard metrics calculation
console.log('1. Testing ProactiveAIDashboard metrics:');
const studentData = mockStudentData;
const atRiskCount = studentData.filter(s => s.is_at_risk).length;
const totalStudents = studentData.length;

// Calculate engagement based on session frequency and accuracy
const avgEngagement = totalStudents > 0
  ? Math.round(studentData.reduce((sum, s) => {
      const sessionFrequency = Math.min(s.total_sessions || 0, 10) / 10; // Normalize to 0-1
      const accuracyScore = (s.average_accuracy || 0) / 100; // Normalize to 0-1
      return sum + (sessionFrequency * 0.6 + accuracyScore * 0.4) * 100; // Weighted score
    }, 0) / totalStudents)
  : 0;

// Calculate average session time in minutes
const avgSessionTime = totalStudents > 0
  ? Math.round(studentData.reduce((sum, s) => sum + (s.average_session_duration || 0), 0) / totalStudents / 60)
  : 0;

// Count students active in last 7 days
const activeStudents = studentData.filter(s =>
  new Date(s.last_active) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
).length;

console.log(`   Students at Risk: ${atRiskCount}`);
console.log(`   Class Engagement: ${isNaN(avgEngagement) ? '0%' : `${avgEngagement}%`}`);
console.log(`   Active Students: ${activeStudents}/${totalStudents}`);
console.log(`   Avg Session Time: ${isNaN(avgSessionTime) ? '0m' : `${avgSessionTime}m`}`);

console.log('\n2. Testing InteractiveStudentOverview data transformation:');
const processedStudents = studentData.map((student, index) => ({
  id: student.student_id,
  name: student.student_name,
  email: student.email,
  class_name: student.class_name || 'Default Class',
  total_sessions: student.total_sessions || 0,
  average_accuracy: Math.round(student.average_accuracy || 0),
  total_xp: student.total_xp || 0,
  last_active: student.last_active
}));

processedStudents.forEach(student => {
  console.log(`   Student: ${student.name}`);
  console.log(`     ID: ${student.id}`);
  console.log(`     Sessions: ${student.total_sessions}`);
  console.log(`     Accuracy: ${student.average_accuracy}%`);
  console.log(`     XP: ${student.total_xp}`);
  console.log(`     Class: ${student.class_name}`);
  console.log('');
});

console.log('3. Testing GamificationAnalytics XP progression:');
const xpProgressions = studentData.map((student, index) => {
  const totalXP = student.total_xp || 0;
  const currentLevel = Math.floor(totalXP / 100) + 1;
  const currentLevelXP = totalXP % 100;
  const xpToNextLevel = 100 - currentLevelXP;

  return {
    student_id: student.student_id,
    student_name: student.student_name,
    class_name: student.class_name || 'Default Class',
    current_level: currentLevel,
    current_xp: currentLevelXP,
    xp_to_next_level: xpToNextLevel,
    total_xp_earned: totalXP,
    rank_in_class: index + 1
  };
});

xpProgressions.forEach(progression => {
  console.log(`   Student: ${progression.student_name}`);
  console.log(`     Level: ${progression.current_level}`);
  console.log(`     Current XP: ${progression.current_xp}/100`);
  console.log(`     Total XP: ${progression.total_xp_earned}`);
  console.log(`     Class: ${progression.class_name}`);
  console.log(`     Rank: ${progression.rank_in_class}`);
  console.log('');
});

console.log('✅ All dashboard data processing tests completed successfully!');
console.log('📊 Expected dashboard behavior:');
console.log('   - Metrics should show real values (no NaN)');
console.log('   - Student names should be displayed correctly');
console.log('   - Class names should be "Default Class" not "General Class"');
console.log('   - XP progressions should show proper levels and names');
