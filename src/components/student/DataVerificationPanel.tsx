'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  RefreshCw, 
  Shield,
  TrendingUp,
  Clock,
  Trophy,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';
import { useSupabase } from '../supabase/SupabaseProvider';
import { StudentDataVerificationService, DataVerificationResult } from '../../services/studentDataVerificationService';

interface DataVerificationPanelProps {
  studentId?: string;
  showDetailed?: boolean;
}

export default function DataVerificationPanel({ 
  studentId, 
  showDetailed = false 
}: DataVerificationPanelProps) {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  const [verificationService] = useState(() => new StudentDataVerificationService(supabase));
  const [verificationResult, setVerificationResult] = useState<DataVerificationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastVerified, setLastVerified] = useState<Date | null>(null);

  const effectiveStudentId = studentId || user?.id;

  useEffect(() => {
    if (effectiveStudentId) {
      runVerification();
    }
  }, [effectiveStudentId]);

  const runVerification = async () => {
    if (!effectiveStudentId) return;
    
    setLoading(true);
    try {
      const result = await verificationService.verifyStudentData(effectiveStudentId);
      setVerificationResult(result);
      setLastVerified(new Date());
    } catch (error) {
      console.error('Verification failed:', error);
      setVerificationResult({
        isValid: false,
        errors: ['Failed to run verification'],
        warnings: [],
        metrics: {
          totalXP: 0,
          calculatedLevel: 1,
          gamesPlayed: 0,
          averageAccuracy: 0,
          totalTimeSpent: 0,
          achievementCount: 0,
          assignmentCount: 0
        }
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-3">
          <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />
          <span className="text-gray-600">Verifying data integrity...</span>
        </div>
      </div>
    );
  }

  if (!verificationResult) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="text-center text-gray-500">
          <Shield className="h-8 w-8 mx-auto mb-2 text-gray-300" />
          <p>Unable to verify data</p>
        </div>
      </div>
    );
  }

  const getStatusIcon = () => {
    if (verificationResult.isValid && verificationResult.warnings.length === 0) {
      return <CheckCircle className="h-6 w-6 text-green-500" />;
    } else if (verificationResult.isValid && verificationResult.warnings.length > 0) {
      return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
    } else {
      return <XCircle className="h-6 w-6 text-red-500" />;
    }
  };

  const getStatusColor = () => {
    if (verificationResult.isValid && verificationResult.warnings.length === 0) {
      return 'text-green-700 bg-green-50 border-green-200';
    } else if (verificationResult.isValid && verificationResult.warnings.length > 0) {
      return 'text-yellow-700 bg-yellow-50 border-yellow-200';
    } else {
      return 'text-red-700 bg-red-50 border-red-200';
    }
  };

  const getStatusText = () => {
    if (verificationResult.isValid && verificationResult.warnings.length === 0) {
      return 'All data verified';
    } else if (verificationResult.isValid && verificationResult.warnings.length > 0) {
      return `${verificationResult.warnings.length} warning${verificationResult.warnings.length > 1 ? 's' : ''}`;
    } else {
      return `${verificationResult.errors.length} error${verificationResult.errors.length > 1 ? 's' : ''} found`;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Shield className="h-6 w-6 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Data Integrity</h3>
        </div>
        <button
          onClick={runVerification}
          className="flex items-center space-x-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Status Summary */}
      <div className={`flex items-center space-x-3 p-4 rounded-lg border ${getStatusColor()}`}>
        {getStatusIcon()}
        <div className="flex-1">
          <div className="font-medium">{getStatusText()}</div>
          {lastVerified && (
            <div className="text-sm opacity-75">
              Last verified: {lastVerified.toLocaleTimeString()}
            </div>
          )}
        </div>
      </div>

      {/* Metrics Summary */}
      {showDetailed && (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <TrendingUp className="h-5 w-5 text-blue-500 mx-auto mb-1" />
            <div className="text-lg font-semibold text-gray-900">
              {verificationResult.metrics.totalXP.toLocaleString()}
            </div>
            <div className="text-xs text-gray-600">Total XP</div>
          </div>
          
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <Trophy className="h-5 w-5 text-yellow-500 mx-auto mb-1" />
            <div className="text-lg font-semibold text-gray-900">
              {verificationResult.metrics.achievementCount}
            </div>
            <div className="text-xs text-gray-600">Achievements</div>
          </div>
          
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <BookOpen className="h-5 w-5 text-green-500 mx-auto mb-1" />
            <div className="text-lg font-semibold text-gray-900">
              {verificationResult.metrics.gamesPlayed}
            </div>
            <div className="text-xs text-gray-600">Games Played</div>
          </div>
          
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <Clock className="h-5 w-5 text-purple-500 mx-auto mb-1" />
            <div className="text-lg font-semibold text-gray-900">
              {verificationResult.metrics.totalTimeSpent}m
            </div>
            <div className="text-xs text-gray-600">Time Spent</div>
          </div>
        </div>
      )}

      {/* Issues List */}
      {(verificationResult.errors.length > 0 || verificationResult.warnings.length > 0) && (
        <div className="mt-6 space-y-3">
          {verificationResult.errors.map((error, index) => (
            <div key={`error-${index}`} className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
              <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-700">{error}</div>
            </div>
          ))}
          
          {verificationResult.warnings.map((warning, index) => (
            <div key={`warning-${index}`} className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-yellow-700">{warning}</div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
