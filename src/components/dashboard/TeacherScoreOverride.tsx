'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  AlertCircle,
  CheckCircle,
  Edit3,
  Save,
  X,
  History,
  Shield
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface OverrideHistory {
  id: string;
  originalScore: number;
  overrideScore: number;
  reason: string;
  overriddenBy: string;
  overriddenAt: string;
}

interface TeacherScoreOverrideProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: string;
  studentName: string;
  assignmentId: string;
  assessmentType: string;
  currentScore: number;
  maxScore: number;
  onOverride: (newScore: number, reason: string) => Promise<void>;
}

export function TeacherScoreOverride({
  isOpen,
  onClose,
  studentId,
  studentName,
  assignmentId,
  assessmentType,
  currentScore,
  maxScore,
  onOverride
}: TeacherScoreOverrideProps) {
  const [overrideScore, setOverrideScore] = useState(currentScore.toString());
  const [reason, setReason] = useState('');
  const [saving, setSaving] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [overrideHistory, setOverrideHistory] = useState<OverrideHistory[]>([]);
  const [error, setError] = useState<string | null>(null);

  const currentPercentage = maxScore > 0 ? Math.round((currentScore / maxScore) * 100) : 0;
  const overridePercentage = maxScore > 0 && overrideScore 
    ? Math.round((parseInt(overrideScore) / maxScore) * 100) 
    : 0;

  const isScoreChanged = parseInt(overrideScore) !== currentScore;
  const isValidScore = overrideScore && 
    !isNaN(parseInt(overrideScore)) && 
    parseInt(overrideScore) >= 0 && 
    parseInt(overrideScore) <= maxScore;

  const handleSubmit = async () => {
    if (!isValidScore) {
      setError(`Score must be between 0 and ${maxScore}`);
      return;
    }

    if (!reason.trim()) {
      setError('Please provide a reason for the override');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      await onOverride(parseInt(overrideScore), reason);
      onClose();
    } catch (err) {
      setError('Failed to save override. Please try again.');
      console.error('Override error:', err);
    } finally {
      setSaving(false);
    }
  };

  const loadHistory = async () => {
    try {
      const response = await fetch(
        `/api/teacher/override-history?assignmentId=${assignmentId}&studentId=${studentId}&assessmentType=${assessmentType}`
      );
      if (response.ok) {
        const data = await response.json();
        setOverrideHistory(data.history || []);
      }
    } catch (error) {
      console.error('Failed to load override history:', error);
    }
  };

  const handleShowHistory = () => {
    if (!showHistory) {
      loadHistory();
    }
    setShowHistory(!showHistory);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3 pb-4 border-b">
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Shield className="h-6 w-6 text-indigo-600" />
            </div>
            Override Assessment Score
          </DialogTitle>
          <DialogDescription className="text-base">
            Manually adjust the score for <span className="font-semibold text-slate-900">{studentName}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Warning Banner */}
          <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-400 rounded-r-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-amber-900">
                  Use Override Carefully
                </p>
                <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                  Score overrides should only be used for clear reasons (technical issues, partial credit, etc.). 
                  All changes are logged and auditable.
                </p>
              </div>
            </div>
          </div>

          {/* Current vs New Score Comparison */}
          <div className="grid grid-cols-2 gap-4">
            <div className="group">
              <Card className="border-2 border-slate-200 hover:border-slate-300 transition-colors">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-slate-700">Current Score</p>
                    <Badge variant="secondary" className="text-xs">Original</Badge>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-bold text-slate-900">{currentScore}</p>
                    <p className="text-xl text-slate-500">/ {maxScore}</p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <Badge variant="outline" className="text-sm font-semibold">
                      {currentPercentage}%
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="group">
              <Card className={`border-2 transition-all ${isScoreChanged ? 'border-indigo-400 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-md' : 'border-slate-200'}`}>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-slate-700">New Score</p>
                    {isScoreChanged && (
                      <Badge className="text-xs bg-indigo-600">
                        <Edit3 className="h-3 w-3 mr-1" />
                        Modified
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-baseline gap-2">
                    <p className={`text-4xl font-bold ${isScoreChanged ? 'text-indigo-900' : 'text-slate-400'}`}>
                      {overrideScore || '—'}
                    </p>
                    <p className="text-xl text-slate-500">/ {maxScore}</p>
                  </div>
                  {overrideScore && (
                    <div className="mt-3 pt-3 border-t border-slate-100">
                      <Badge className={isScoreChanged ? 'bg-indigo-600 text-sm font-semibold' : 'text-sm font-semibold'}>
                        {overridePercentage}%
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Override Input Form */}
          <div className="space-y-5 bg-slate-50 p-5 rounded-lg border border-slate-200">
            <div>
              <label htmlFor="override-score" className="block text-sm font-semibold text-slate-800 mb-2">
                Override Score <span className="text-red-500">*</span>
              </label>
              <Input
                id="override-score"
                type="number"
                min={0}
                max={maxScore}
                value={overrideScore}
                onChange={(e) => setOverrideScore(e.target.value)}
                placeholder={`Enter score (0-${maxScore})`}
                className={`text-lg h-12 ${!isValidScore && overrideScore ? 'border-red-400 focus:ring-red-400' : 'border-slate-300'}`}
              />
              {!isValidScore && overrideScore && (
                <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  Score must be between 0 and {maxScore}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="override-reason" className="block text-sm font-semibold text-slate-800 mb-2">
                Reason for Override <span className="text-red-500">*</span>
              </label>
              <Textarea
                id="override-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g., 'Partial credit for demonstrated understanding despite minor spelling errors'"
                rows={3}
                className="resize-none border-slate-300"
              />
              <p className="text-xs text-slate-600 mt-2 flex items-center gap-1">
                <History className="h-3 w-3" />
                This will be visible in the audit log
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
              <p className="text-sm text-red-900 font-medium">{error}</p>
            </div>
          )}

          {/* Override History */}
          <div className="space-y-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShowHistory}
              className="flex items-center gap-2 hover:bg-slate-100"
            >
              <History className="h-4 w-4" />
              {showHistory ? 'Hide' : 'Show'} Override History
            </Button>

            {showHistory && (
              <div className="space-y-2 max-h-48 overflow-y-auto p-4 bg-slate-50 rounded-lg border border-slate-200">
                {overrideHistory.length > 0 ? (
                  overrideHistory.map((entry) => (
                    <div
                      key={entry.id}
                      className="p-3 bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-slate-900">
                          {entry.originalScore} → {entry.overrideScore}
                        </span>
                        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                          {new Date(entry.overriddenAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-slate-700 text-sm mb-1">{entry.reason}</p>
                      <p className="text-slate-500 text-xs">By: {entry.overriddenBy}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500 text-center py-6">
                    No previous overrides
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2 pt-4 border-t">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={saving}
            className="px-6"
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isScoreChanged || !isValidScore || !reason.trim() || saving}
            className="bg-indigo-600 hover:bg-indigo-700 px-6"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Override
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
