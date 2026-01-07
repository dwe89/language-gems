'use client';

// Add export config to skip static generation
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../components/auth/AuthProvider';
import Link from 'next/link';
import {
  Search, FileText, Edit, Trash2, Plus, Filter, Calendar, Clock,
  BookOpen, CheckCircle, XCircle, Users, BookmarkIcon, BarChart3, GraduationCap
} from 'lucide-react';
import { supabaseBrowser } from '../../../components/auth/AuthProvider';
import { AssignmentCard } from '../../../components/classes/AssignmentCard';
import DashboardHeader from '../../../components/dashboard/DashboardHeader';
import ConfirmationDialog from '../../../components/ui/ConfirmationDialog';

export default function AssessmentsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [filter, setFilter] = useState('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewScope, setViewScope] = useState<'my' | 'school'>('my');
  const [hasSchoolAccess, setHasSchoolAccess] = useState(false);
  const [schoolCode, setSchoolCode] = useState<string | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    assignmentId: string;
    assignmentName: string;
  }>({
    isOpen: false,
    assignmentId: '',
    assignmentName: ''
  });

  const supabase = supabaseBrowser;

  // Fetch real data from database
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        // Fetch teacher's profile to check school access
        const { data: profileData } = await supabase
          .from('user_profiles')
          .select('school_code, school_initials, is_school_owner, school_owner_id')
          .eq('user_id', user.id)
          .single();

        if (profileData) {
          const schoolIdentifier = profileData.school_code || profileData.school_initials;
          setSchoolCode(schoolIdentifier);

          const hasAccess = !!(
            profileData.is_school_owner ||
            profileData.school_owner_id ||
            schoolIdentifier
          );
          setHasSchoolAccess(hasAccess);
        }

        // Fetch assignments based on viewScope
        let assignmentsData;
        if (viewScope === 'school' && profileData?.school_code) {
          // Get all teachers in the school
          const { data: teacherProfiles } = await supabase
            .from('user_profiles')
            .select('user_id')
            .eq('school_code', profileData.school_code)
            .in('role', ['teacher', 'admin']);

          const teacherIds = teacherProfiles?.map(t => t.user_id) || [];

          // Fetch assignments from all teachers in school
          const { data, error: assignmentsError } = await supabase
            .from('assignments')
            .select(`
              *,
              classes!inner(name)
            `)
            .in('created_by', teacherIds)
            .eq('game_type', 'assessment') // Filter for assessments
            .neq('status', 'archived')
            .order('created_at', { ascending: false });

          if (assignmentsError) {
            console.error('Error fetching assignments:', assignmentsError);
          }
          assignmentsData = data;
        } else {
          // Fetch only this teacher's assignments
          const { data, error: assignmentsError } = await supabase
            .from('assignments')
            .select(`
              *,
              classes!inner(name)
            `)
            .eq('created_by', user.id)
            .eq('game_type', 'assessment') // Filter for assessments
            .neq('status', 'archived')
            .order('created_at', { ascending: false });

          if (assignmentsError) {
            console.error('Error fetching assignments:', assignmentsError);
          }
          assignmentsData = data;
        }

        setAssignments(assignmentsData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setAssignments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, supabase, viewScope]);

  // Filter assignments based on status and search query
  const filteredAssignments = assignments.filter(assignment => {
    // Check if assignment is past due date
    const isPastDue = assignment.due_date && new Date(assignment.due_date) < new Date();

    // Determine effective status (past due = completed)
    const effectiveStatus = isPastDue ? 'completed' : assignment.status;

    const matchesFilter = filter === 'all' || effectiveStatus === filter;
    const matchesSearch = (assignment.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (assignment.description || '').toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const deleteAssignment = async (id: string) => {
    // Find assignment and prepare confirmation dialog
    const assignment = assignments.find(a => a.id === id);
    const assignmentName = assignment?.title || assignment?.name || 'Untitled Assessment';
    
    setDeleteConfirmation({
      isOpen: true,
      assignmentId: id,
      assignmentName
    });
  };

  const confirmDeleteAssignment = async () => {
    try {
      const assignmentId = deleteConfirmation.assignmentId;

      // SOFT DELETE: Archive the assignment instead of deleting it
      const { error } = await supabase
        .from('assignments')
        .update({ status: 'archived' })
        .eq('id', assignmentId);

      if (error) {
        console.error('Error archiving assessment:', error);
        return;
      }

      // Update local state
      setAssignments(assignments.filter(a => a.id !== assignmentId));
      setDeleteConfirmation({ isOpen: false, assignmentId: '', assignmentName: '' });
    } catch (error) {
      console.error('Error deleting assessment:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader 
        title="Assessments" 
        subtitle="Create and track student assessments"
        icon={<GraduationCap className="w-8 h-8 text-indigo-600" />}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Actions Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center space-x-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search assessments..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex bg-white rounded-lg border border-gray-200 p-1">
              <button
                onClick={() => setFilter('active')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  filter === 'active' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  filter === 'completed' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Completed
              </button>
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  filter === 'all' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                All
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-3 w-full md:w-auto">
            {hasSchoolAccess && (
              <div className="flex bg-white rounded-lg border border-gray-200 p-1">
                <button
                  onClick={() => setViewScope('my')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    viewScope === 'my' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  My Assessments
                </button>
                <button
                  onClick={() => setViewScope('school')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    viewScope === 'school' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  School
                </button>
              </div>
            )}

            <Link
              href="/dashboard/assessments/new"
              className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm hover:shadow md:w-auto w-full"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Assessment
            </Link>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : filteredAssignments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssignments.map((assignment) => (
              <AssignmentCard
                key={assignment.id}
                assignment={assignment}
                onDelete={deleteAssignment}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
            <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-8 h-8 text-indigo-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No assessments found</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {searchQuery 
                ? `No assessments match "${searchQuery}"`
                : "You haven't created any assessments yet. Get started by creating your first assessment."}
            </p>
            {!searchQuery && (
              <Link
                href="/dashboard/assessments/new"
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Assessment
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation({ isOpen: false, assignmentId: '', assignmentName: '' })}
        onConfirm={confirmDeleteAssignment}
        title="Delete Assessment"
        message={`Are you sure you want to delete "${deleteConfirmation.assignmentName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
}
