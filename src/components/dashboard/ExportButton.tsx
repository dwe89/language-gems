'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileSpreadsheet, Loader2 } from 'lucide-react';
import { StudentProgress, AssignmentOverviewMetrics } from '@/services/teacherAssignmentAnalytics';

interface ExportButtonProps {
  overview: AssignmentOverviewMetrics;
  studentRoster: StudentProgress[];
  assignmentTitle: string;
}

export function ExportButton({ overview, studentRoster, assignmentTitle }: ExportButtonProps) {
  const [exporting, setExporting] = useState(false);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m`;
  };

  const exportToCSV = () => {
    setExporting(true);
    try {
      // Prepare CSV data
      const headers = [
        'Student Name',
        'Status',
        'Score (%)',
        'Time Spent',
        'Weak Retrieval (%)',
        'Failure Rate (%)',
        'Key Struggle Words',
        'Intervention Flag',
        'Last Attempt'
      ];

      const rows = studentRoster.map(student => [
        student.studentName,
        student.status,
        student.successScore.toString(),
        formatTime(student.timeSpentMinutes * 60),
        student.weakRetrievalPercent.toString(),
        student.failureRate.toString(),
        student.keyStruggleWords.join('; '),
        student.interventionFlag || 'None',
        student.lastAttempt || 'N/A'
      ]);

      // Add summary row
      const summaryRows = [
        [],
        ['SUMMARY'],
        ['Total Students', overview.totalStudents.toString()],
        ['Completed', overview.completedStudents.toString()],
        ['In Progress', overview.inProgressStudents.toString()],
        ['Not Started', overview.notStartedStudents.toString()],
        ['Class Average', `${overview.classSuccessScore}%`],
        ['Completion Rate', `${overview.completionRate}%`],
        ['Students Needing Help', overview.studentsNeedingHelp.toString()]
      ];

      // Add assessment summary if available
      if (overview.assessmentSummary && overview.assessmentSummary.length > 0) {
        summaryRows.push([]);
        summaryRows.push(['ASSESSMENT BREAKDOWN']);
        summaryRows.push(['Type', 'Avg Score', 'Attempts', 'Papers', 'Avg Time']);
        
        overview.assessmentSummary.forEach(summary => {
          summaryRows.push([
            summary.assessmentType,
            `${Math.round(summary.avgScore)}%`,
            summary.attempts.toString(),
            summary.paperCount.toString(),
            formatTime(summary.avgTimeMinutes * 60)
          ]);
        });
      }

      // Combine all data
      const csvContent = [
        [`Assignment: ${assignmentTitle}`],
        [`Exported: ${new Date().toLocaleString()}`],
        [],
        headers,
        ...rows,
        ...summaryRows
      ].map(row => row.join(',')).join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `${assignmentTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_analytics_${Date.now()}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      alert('Failed to export data. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <Button
      onClick={exportToCSV}
      disabled={exporting}
      variant="outline"
      className="flex items-center gap-2"
    >
      {exporting ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Exporting...
        </>
      ) : (
        <>
          <Download className="h-4 w-4" />
          <FileSpreadsheet className="h-4 w-4" />
          Export to CSV
        </>
      )}
    </Button>
  );
}
