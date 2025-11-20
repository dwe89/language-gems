'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabaseBrowser } from '@/components/auth/AuthProvider';
import AssessmentAssignmentView from '@/components/student-dashboard/AssessmentAssignmentView';

export default function StudentAssessmentDetailPage() {
  const { user } = useAuth();
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [assignment, setAssignment] = useState<any>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!user || !id) return;

    const fetchAssignment = async () => {
      try {
        setLoading(true);
        const supabase = supabaseBrowser;

        const { data, error } = await supabase
          .from('assignments')
          .select('id, title, description, due_date')
          .eq('id', id)
          .single();

        if (error) throw error;

        setAssignment(data);
      } catch (err) {
        console.error('Error fetching assessment:', err);
        setError('Failed to load assessment details');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignment();
  }, [user, id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !assignment) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error || 'Assessment not found'}
          </div>
          <Link
            href="/student-dashboard/assessments"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Assessments
          </Link>
        </div>
      </div>
    );
  }

  return (
    <AssessmentAssignmentView
      assignmentId={assignment.id}
      studentId={user!.id}
      assignmentTitle={assignment.title}
      assignmentDescription={assignment.description}
      dueDate={assignment.due_date ? new Date(assignment.due_date).toLocaleDateString() : undefined}
    />
  );
}
