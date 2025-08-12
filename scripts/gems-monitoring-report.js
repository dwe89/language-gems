/**
 * Gems Monitoring Report Generator
 * Generates comprehensive monitoring reports for the gems-first reward system
 */

const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function generateMonitoringReport() {
  console.log('🔍 GEMS MONITORING REPORT');
  console.log('========================\n');
  
  try {
    // 1. System Health Check
    console.log('📊 SYSTEM HEALTH METRICS');
    console.log('-------------------------');
    
    const healthMetrics = await getSystemHealthMetrics();
    console.log(`✅ Total Sessions: ${healthMetrics.totalSessions}`);
    console.log(`✅ Sessions with Gems: ${healthMetrics.sessionsWithGems}`);
    console.log(`✅ Gems Coverage: ${((healthMetrics.sessionsWithGems / healthMetrics.totalSessions) * 100).toFixed(1)}%`);
    console.log(`✅ Average Gems per Session: ${healthMetrics.averageGemsPerSession.toFixed(2)}`);
    
    // 2. Gem Integrity Validation
    console.log('\n🔒 GEM INTEGRITY VALIDATION');
    console.log('----------------------------');
    
    const integrityResults = await validateGemIntegrity();
    console.log(`✅ Integrity Score: ${integrityResults.score.toFixed(1)}%`);
    console.log(`✅ Valid Sessions: ${integrityResults.validSessions}/${integrityResults.totalSessions}`);
    
    if (integrityResults.issues.length > 0) {
      console.log(`⚠️  Issues Found: ${integrityResults.issues.length}`);
      integrityResults.issues.slice(0, 5).forEach(issue => {
        console.log(`   - ${issue}`);
      });
    } else {
      console.log('✅ No integrity issues detected');
    }
    
    // 3. Gem Distribution Analysis
    console.log('\n💎 GEM DISTRIBUTION ANALYSIS');
    console.log('-----------------------------');
    
    const distribution = await analyzeGemDistribution();
    console.log(`✅ Common Gems: ${distribution.common.toFixed(1)}%`);
    console.log(`✅ Uncommon Gems: ${distribution.uncommon.toFixed(1)}%`);
    console.log(`✅ Rare Gems: ${distribution.rare.toFixed(1)}%`);
    console.log(`✅ Epic Gems: ${distribution.epic.toFixed(1)}%`);
    console.log(`✅ Legendary Gems: ${distribution.legendary.toFixed(1)}%`);
    console.log(`✅ Distribution Balance Score: ${distribution.balanceScore.toFixed(1)}%`);
    
    // 4. Anti-Grinding Effectiveness
    console.log('\n🛡️  ANTI-GRINDING EFFECTIVENESS');
    console.log('-------------------------------');
    
    const antiGrinding = await analyzeAntiGrindingEffectiveness();
    console.log(`✅ Mastery Level Distribution:`);
    Object.entries(antiGrinding.masteryDistribution).forEach(([level, count]) => {
      console.log(`   Level ${level}: ${count} words`);
    });
    console.log(`✅ Max Gem Rarity Distribution:`);
    Object.entries(antiGrinding.maxRarityDistribution).forEach(([rarity, count]) => {
      console.log(`   ${rarity}: ${count} words`);
    });
    
    // 5. Learning Effectiveness Metrics
    console.log('\n📈 LEARNING EFFECTIVENESS');
    console.log('-------------------------');
    
    const learning = await analyzeLearningEffectiveness();
    console.log(`✅ Average Accuracy: ${learning.averageAccuracy.toFixed(1)}%`);
    console.log(`✅ Accuracy Trend: ${learning.accuracyTrend > 0 ? '📈 Improving' : learning.accuracyTrend < 0 ? '📉 Declining' : '➡️  Stable'}`);
    console.log(`✅ Session Duration: ${learning.averageSessionDuration.toFixed(1)} seconds`);
    console.log(`✅ Words per Session: ${learning.averageWordsPerSession.toFixed(1)}`);
    
    // 6. Performance Alerts
    console.log('\n🚨 PERFORMANCE ALERTS');
    console.log('---------------------');
    
    const alerts = generateAlerts({
      healthMetrics,
      integrityResults,
      distribution,
      antiGrinding,
      learning
    });
    
    if (alerts.length === 0) {
      console.log('✅ No alerts - system is performing optimally');
    } else {
      alerts.forEach(alert => {
        const icon = alert.severity === 'critical' ? '🔴' : alert.severity === 'high' ? '🟠' : '🟡';
        console.log(`${icon} ${alert.message}`);
        console.log(`   ${alert.details}`);
      });
    }
    
    // 7. Recommendations
    console.log('\n💡 RECOMMENDATIONS');
    console.log('------------------');
    
    const recommendations = generateRecommendations({
      healthMetrics,
      integrityResults,
      distribution,
      antiGrinding,
      learning
    });
    
    recommendations.forEach((rec, index) => {
      console.log(`${index + 1}. ${rec}`);
    });
    
    console.log('\n✅ Monitoring report completed successfully!');
    
  } catch (error) {
    console.error('❌ Error generating monitoring report:', error);
  }
}

async function getSystemHealthMetrics() {
  const { data: sessions, error } = await supabase
    .from('enhanced_game_sessions')
    .select('gems_total')
    .limit(1000);
    
  if (error) throw error;
  
  const totalSessions = sessions.length;
  const sessionsWithGems = sessions.filter(s => s.gems_total && s.gems_total > 0).length;
  const totalGems = sessions.reduce((sum, s) => sum + (s.gems_total || 0), 0);
  const averageGemsPerSession = sessionsWithGems > 0 ? totalGems / sessionsWithGems : 0;
  
  return { totalSessions, sessionsWithGems, averageGemsPerSession };
}

async function validateGemIntegrity() {
  const { data: sessions, error } = await supabase
    .from('enhanced_game_sessions')
    .select('id, gems_total, gems_by_rarity, xp_earned')
    .not('gems_total', 'is', null)
    .limit(500);
    
  if (error) throw error;
  
  const issues = [];
  let validSessions = 0;
  
  sessions.forEach(session => {
    const gemsByRarity = session.gems_by_rarity || {};
    const expectedXP = 
      (gemsByRarity.common || 0) * 10 +
      (gemsByRarity.uncommon || 0) * 25 +
      (gemsByRarity.rare || 0) * 50 +
      (gemsByRarity.epic || 0) * 100 +
      (gemsByRarity.legendary || 0) * 200;
      
    const actualXP = session.xp_earned || 0;
    const variance = Math.abs(actualXP - expectedXP) / Math.max(expectedXP, 1);
    
    if (variance > 0.5) {
      issues.push(`Session ${session.id}: Expected ${expectedXP} XP, got ${actualXP} XP`);
    } else {
      validSessions++;
    }
  });
  
  const score = sessions.length > 0 ? (validSessions / sessions.length) * 100 : 100;
  return { score, validSessions, totalSessions: sessions.length, issues };
}

async function analyzeGemDistribution() {
  const { data: sessions, error } = await supabase
    .from('enhanced_game_sessions')
    .select('gems_by_rarity')
    .not('gems_by_rarity', 'is', null)
    .limit(1000);
    
  if (error) throw error;
  
  const distribution = { common: 0, uncommon: 0, rare: 0, epic: 0, legendary: 0 };
  
  sessions.forEach(session => {
    if (session.gems_by_rarity) {
      Object.entries(session.gems_by_rarity).forEach(([rarity, count]) => {
        distribution[rarity] += count;
      });
    }
  });
  
  const total = Object.values(distribution).reduce((sum, count) => sum + count, 0);
  
  // Convert to percentages
  const percentages = {};
  Object.entries(distribution).forEach(([rarity, count]) => {
    percentages[rarity] = total > 0 ? (count / total) * 100 : 0;
  });
  
  // Calculate balance score
  const expected = { common: 60, uncommon: 25, rare: 10, epic: 4, legendary: 1 };
  let deviationSum = 0;
  Object.entries(expected).forEach(([rarity, expectedPercent]) => {
    deviationSum += Math.abs(percentages[rarity] - expectedPercent);
  });
  const balanceScore = Math.max(0, 100 - (deviationSum / 2));
  
  return { ...percentages, balanceScore };
}

async function analyzeAntiGrindingEffectiveness() {
  const { data: vocabulary, error } = await supabase
    .from('vocabulary_gem_collection')
    .select('mastery_level, max_gem_rarity')
    .limit(1000);
    
  if (error) throw error;
  
  const masteryDistribution = {};
  const maxRarityDistribution = {};
  
  vocabulary.forEach(word => {
    masteryDistribution[word.mastery_level] = (masteryDistribution[word.mastery_level] || 0) + 1;
    maxRarityDistribution[word.max_gem_rarity] = (maxRarityDistribution[word.max_gem_rarity] || 0) + 1;
  });
  
  return { masteryDistribution, maxRarityDistribution };
}

async function analyzeLearningEffectiveness() {
  const { data: sessions, error } = await supabase
    .from('enhanced_game_sessions')
    .select('accuracy_percentage, duration_seconds, words_correct')
    .not('accuracy_percentage', 'is', null)
    .limit(500);
    
  if (error) throw error;
  
  const averageAccuracy = sessions.reduce((sum, s) => sum + (s.accuracy_percentage || 0), 0) / sessions.length;
  const averageSessionDuration = sessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) / sessions.length;
  const averageWordsPerSession = sessions.reduce((sum, s) => sum + (s.words_correct || 0), 0) / sessions.length;
  
  // Simple trend calculation (would be more sophisticated in production)
  const accuracyTrend = 0; // Placeholder
  
  return { averageAccuracy, accuracyTrend, averageSessionDuration, averageWordsPerSession };
}

function generateAlerts(metrics) {
  const alerts = [];
  
  if (metrics.integrityResults.score < 90) {
    alerts.push({
      severity: 'high',
      message: 'Gem integrity below threshold',
      details: `${metrics.integrityResults.issues.length} sessions have XP-gem mismatches`
    });
  }
  
  if (metrics.distribution.balanceScore < 70) {
    alerts.push({
      severity: 'medium',
      message: 'Gem distribution imbalance',
      details: `Distribution balance score: ${metrics.distribution.balanceScore.toFixed(1)}%`
    });
  }
  
  return alerts;
}

function generateRecommendations(metrics) {
  const recommendations = [];
  
  if (metrics.integrityResults.score < 95) {
    recommendations.push('Review XP calculation logic in games to ensure consistency with gem values');
  }
  
  if (metrics.distribution.legendary > 2) {
    recommendations.push('Consider adjusting legendary gem thresholds - distribution is higher than expected');
  }
  
  if (metrics.learning.averageAccuracy < 75) {
    recommendations.push('Consider implementing additional learning support features to improve accuracy');
  }
  
  if (recommendations.length === 0) {
    recommendations.push('System is performing optimally - continue monitoring');
  }
  
  return recommendations;
}

generateMonitoringReport().catch(console.error);
