/**
 * Gems Monitoring Dashboard
 * Real-time monitoring and alerts for the gems-first reward system
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, AlertTriangle, CheckCircle, TrendingUp, 
  Activity, Gem, Users, BarChart3, RefreshCw,
  AlertCircle, Info, XCircle, Clock
} from 'lucide-react';
import { GemsMonitoringService, SystemHealthMetrics, SystemAlert } from '../../services/monitoring/GemsMonitoringService';

interface GemsMonitoringDashboardProps {
  className?: string;
}

const ALERT_ICONS = {
  warning: AlertTriangle,
  error: XCircle,
  info: Info
};

const ALERT_COLORS = {
  warning: 'text-yellow-500 bg-yellow-50 border-yellow-200',
  error: 'text-red-500 bg-red-50 border-red-200',
  info: 'text-blue-500 bg-blue-50 border-blue-200'
};

const SEVERITY_COLORS = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800'
};

export default function GemsMonitoringDashboard({ className = '' }: GemsMonitoringDashboardProps) {
  const [monitoringService] = useState(() => new GemsMonitoringService());
  const [healthMetrics, setHealthMetrics] = useState<SystemHealthMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    loadHealthMetrics();
    
    // Set up auto-refresh every 5 minutes
    const interval = setInterval(loadHealthMetrics, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const loadHealthMetrics = async () => {
    try {
      setLoading(true);
      const metrics = await monitoringService.getSystemHealthMetrics();
      setHealthMetrics(metrics);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load health metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getHealthScore = (): number => {
    if (!healthMetrics) return 0;
    
    const scores = [
      healthMetrics.gemsIntegrityScore,
      healthMetrics.gemDistributionHealth.distributionBalance || 0,
      healthMetrics.antiGrindingEffectiveness,
      healthMetrics.learningEffectivenessScore
    ];
    
    return scores.reduce((sum, score) => sum + score, 0) / scores.length;
  };

  const getHealthStatus = (score: number): { label: string; color: string; icon: React.ComponentType } => {
    if (score >= 90) return { label: 'Excellent', color: 'text-green-600', icon: CheckCircle };
    if (score >= 80) return { label: 'Good', color: 'text-blue-600', icon: Activity };
    if (score >= 70) return { label: 'Fair', color: 'text-yellow-600', icon: AlertTriangle };
    return { label: 'Needs Attention', color: 'text-red-600', icon: AlertCircle };
  };

  const criticalAlerts = healthMetrics?.alerts.filter(a => a.severity === 'critical') || [];
  const highAlerts = healthMetrics?.alerts.filter(a => a.severity === 'high') || [];
  const totalAlerts = healthMetrics?.alerts.length || 0;

  if (loading && !healthMetrics) {
    return (
      <div className={`bg-white rounded-xl shadow-lg p-8 ${className}`}>
        <div className="flex items-center justify-center">
          <RefreshCw className="h-8 w-8 text-blue-500 animate-spin mr-3" />
          <span className="text-gray-600">Loading system health metrics...</span>
        </div>
      </div>
    );
  }

  const healthScore = getHealthScore();
  const healthStatus = getHealthStatus(healthScore);
  const StatusIcon = healthStatus.icon;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">System Health Monitor</h2>
            <p className="text-gray-600">Real-time monitoring of the gems reward system</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {lastUpdated && (
            <div className="text-sm text-gray-500 flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>Updated {lastUpdated.toLocaleTimeString()}</span>
            </div>
          )}
          <button
            onClick={loadHealthMetrics}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-2 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Overall Health Score */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <StatusIcon className={`h-12 w-12 ${healthStatus.color}`} />
            <div>
              <h3 className="text-2xl font-bold text-gray-900">System Health: {healthStatus.label}</h3>
              <p className="text-gray-600">Overall health score: {healthScore.toFixed(1)}%</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-3xl font-bold text-gray-900">{healthScore.toFixed(0)}%</div>
            <div className="text-sm text-gray-500">Health Score</div>
          </div>
        </div>
        
        {/* Health Score Progress Bar */}
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <motion.div
              className={`h-3 rounded-full ${
                healthScore >= 90 ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
                healthScore >= 80 ? 'bg-gradient-to-r from-blue-500 to-cyan-600' :
                healthScore >= 70 ? 'bg-gradient-to-r from-yellow-500 to-orange-600' :
                'bg-gradient-to-r from-red-500 to-pink-600'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${healthScore}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3">
            <Gem className="h-8 w-8 text-purple-500" />
            <div>
              <div className="text-2xl font-bold text-gray-900">{healthMetrics?.gemsIntegrityScore.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">Gems Integrity</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3">
            <Users className="h-8 w-8 text-blue-500" />
            <div>
              <div className="text-2xl font-bold text-gray-900">{healthMetrics?.sessionsWithGems || 0}</div>
              <div className="text-sm text-gray-600">Sessions with Gems</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3">
            <BarChart3 className="h-8 w-8 text-green-500" />
            <div>
              <div className="text-2xl font-bold text-gray-900">{healthMetrics?.averageGemsPerSession.toFixed(1) || 0}</div>
              <div className="text-sm text-gray-600">Avg Gems/Session</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3">
            <TrendingUp className="h-8 w-8 text-orange-500" />
            <div>
              <div className="text-2xl font-bold text-gray-900">{healthMetrics?.antiGrindingEffectiveness || 0}%</div>
              <div className="text-sm text-gray-600">Anti-Grinding</div>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      {totalAlerts > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">System Alerts</h3>
            <div className="flex items-center space-x-2">
              {criticalAlerts.length > 0 && (
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                  {criticalAlerts.length} Critical
                </span>
              )}
              {highAlerts.length > 0 && (
                <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                  {highAlerts.length} High
                </span>
              )}
            </div>
          </div>
          
          <div className="space-y-3">
            {healthMetrics?.alerts.slice(0, 5).map((alert, index) => {
              const AlertIcon = ALERT_ICONS[alert.type];
              const alertColorClass = ALERT_COLORS[alert.type];
              const severityColorClass = SEVERITY_COLORS[alert.severity];
              
              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`border rounded-lg p-4 ${alertColorClass}`}
                >
                  <div className="flex items-start space-x-3">
                    <AlertIcon className="h-5 w-5 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{alert.message}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${severityColorClass}`}>
                          {alert.severity}
                        </span>
                      </div>
                      <p className="text-sm mt-1 opacity-80">{alert.details}</p>
                      <p className="text-xs mt-2 opacity-60">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* No Alerts State */}
      {totalAlerts === 0 && (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">All Systems Operational</h3>
          <p className="text-gray-600">No alerts detected. The gems reward system is running smoothly.</p>
        </div>
      )}
    </div>
  );
}
