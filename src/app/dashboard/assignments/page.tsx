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
  BookOpen, CheckCircle, XCircle, Users, BookmarkIcon, BarChart3
} from 'lucide-react';
import { supabaseBrowser } from '../../../components/auth/AuthProvider';
import { AssignmentCard } from '../../../components/classes/AssignmentCard';
import DashboardHeader from '../../../components/dashboard/DashboardHeader';
import ConfirmationDialog from '../../../components/ui/ConfirmationDialog';

export default function AssignmentsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [filter, setFilter] = useState('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
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
        // Fetch real assignments for this teacher (exclude archived)
        const { data: assignmentsData, error: assignmentsError } = await supabase
          .from('assignments')
          .select(`
            *,
            classes!inner(name)
          `)
          .eq('created_by', user.id)
          .neq('status', 'archived')
          .order('created_at', { ascending: false });

        if (assignmentsError) {
          console.error('Error fetching assignments:', assignmentsError);
        }

        // Fetch teacher's classes
        const { data: classesData, error: classesError } = await supabase
          .from('classes')
          .select('*')
          .eq('teacher_id', user.id);

        if (classesError) {
          console.error('Error fetching classes:', classesError);
        }

        setAssignments(assignmentsData || []);
        setClasses(classesData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setAssignments([]);
        setClasses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, supabase]);

  // Filter assignments based on status and search query
  const filteredAssignments = assignments.filter(assignment => {
    // Check if assignment is past due date
    const isPastDue = assignment.due_date && new Date(assignment.due_date) < new Date();

    // Determine effective status (past due = completed)
    const effectiveStatus = isPastDue ? 'completed' : assignment.status;

    const matchesFilter = filter === 'all' || effectiveStatus === filter;
    const matchesSearch = assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const createAssignment = async (assignmentData: any) => {
    try {
      const { data, error } = await supabase
        .from('assignments')
        .insert([{ ...assignmentData, created_by: user?.id }])
        .select()
        .single();

      if (error) {
        console.error('Error creating assignment:', error);
        return;
      }

      // Refresh assignments list
      const { data: updatedAssignments } = await supabase
        .from('assignments')
        .select(`
          *,
          classes!inner(name)
        `)
        .eq('created_by', user?.id)
        .order('created_at', { ascending: false });

      setAssignments(updatedAssignments || []);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating assignment:', error);
    }
  };

  const deleteAssignment = async (id: string) => {
    // Find assignment and prepare confirmation dialog
    const assignment = assignments.find(a => a.id === id);
    const assignmentName = assignment?.title || assignment?.name || 'Untitled Assignment';
    
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
      // This preserves all student data, analytics, and learning history
      const { error } = await supabase
        .from('assignments')
        .update({
          status: 'archived',
          archived_at: new Date().toISOString()
        })
        .eq('id', assignmentId)
        .eq('created_by', user?.id);

      if (error) {
        console.error('Error archiving assignment:', error);
        alert('Failed to archive assignment. Please try again.');
        return;
      }

      // Remove from UI (it will be filtered out by status)
      setAssignments(assignments.filter(a => a.id !== assignmentId));

      // Close confirmation dialog
      setDeleteConfirmation({
        isOpen: false,
        assignmentId: '',
        assignmentName: ''
      });
    } catch (error) {
      console.error('Error archiving assignment:', error);
      alert('Failed to archive assignment. Please try again.');
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 p-6">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader
          title="Assignments"
          description="Create and manage assignments for your classes"
          icon={<FileText className="h-5 w-5 text-white" />}
        />

        {/* Controls Panel */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search assignments..."
                className="w-full pl-11 pr-4 py-3 border border-slate-300/60 rounded-xl bg-white/80 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
            </div>
            
            {/* Filter and Create */}
            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <select
                  className="pl-4 pr-10 py-3 border border-slate-300/60 rounded-xl bg-white/80 appearance-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-sm font-medium text-slate-700"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">All Assignments</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="draft">Drafts</option>
                </select>
                <Filter className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" size={16} />
              </div>
              
              <div className="relative inline-block">
                <button
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl flex items-center space-x-2 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
                  onClick={() => router.push('/dashboard/assignments/new')}
                >
                  <Plus size={18} />
                  <span>Create Assignment</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Assignments Grid */}
        <div className="mb-8">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
          ) : filteredAssignments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAssignments.map((assignment) => (
                <AssignmentCard key={assignment.id} assignment={assignment} onDelete={deleteAssignment} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 px-6">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mb-6 border border-indigo-200/50">
                  <FileText className="h-10 w-10 text-indigo-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">No assignments found</h3>
                <p className="text-slate-600 mb-8 leading-relaxed">
                  {searchQuery || filter !== 'all' 
                    ? 'Try adjusting your search or filter to find assignments.' 
                    : 'Get started by creating your first assignment for your students.'}
                </p>
                <Link href="/dashboard/assignments/new">
                  <button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl">
                    <Plus className="h-4 w-4 mr-2 inline" />
                    Create Your First Assignment
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Create Assignment Dropdown */}
        {dropdownOpen && (
          <>
            {/* Overlay to close dropdown when clicking outside */}
            <div 
              className="fixed inset-0 z-[99998]" 
              onClick={() => setDropdownOpen(false)}
            />
            <div className="fixed top-32 right-8 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 z-[99999]">
              <div className="py-2">
                <Link
                  href="/dashboard/assignments/new"
                  className="block px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors font-medium"
                  onClick={() => setDropdownOpen(false)}
                >
                  <div className="flex items-center">
                    <span className="text-lg mr-3">📝</span>
                    <div>
                      <div className="font-semibold text-indigo-600">Create Assignment</div>
                      <div className="text-xs text-slate-500">Games, assessments, grammar practice & more</div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </>
        )}

        {/* Create Assignment Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <CreateAssignmentForm 
                classes={classes}
                onSubmit={createAssignment}
                onCancel={() => setShowCreateModal(false)}
              />
            </div>
          </div>
        )}

        {/* Confirmation Dialog */}
        <ConfirmationDialog
          isOpen={deleteConfirmation.isOpen}
          onClose={() => setDeleteConfirmation({ isOpen: false, assignmentId: '', assignmentName: '' })}
          onConfirm={confirmDeleteAssignment}
          title="Archive Assignment"
          message={`Are you sure you want to archive "${deleteConfirmation.assignmentName}"? The assignment will be hidden from your list, but all student data and analytics will be preserved. You can restore it later if needed.`}
          confirmText="Archive Assignment"
          cancelText="Keep Assignment"
          variant="danger"
        />
      </div>
    </div>
  );
}

function CreateAssignmentForm({ 
  classes, 
  onSubmit, 
  onCancel 
}: { 
  classes: any[],
  onSubmit: (data: any) => void,
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: '',
    assigned_to: '',
    type: 'quiz',
    status: 'active'
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Assignment Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Assignment Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          >
            <option value="quiz">Quiz</option>
            <option value="exercise">Exercise</option>
            <option value="project">Project</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Assign to Class</label>
          <select
            name="assigned_to"
            value={formData.assigned_to}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            required
          >
            <option value="">Select a class</option>
            {classes.map(cls => (
              <option key={cls.id} value={cls.name}>{cls.name}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
          <input
            type="date"
            name="due_date"
            value={formData.due_date}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            required
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="status"
                value="active"
                checked={formData.status === 'active'}
                onChange={handleChange}
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Active</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="status"
                value="draft"
                checked={formData.status === 'draft'}
                onChange={handleChange}
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Save as Draft</span>
            </label>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
        >
          Create Assignment
        </button>
      </div>
    </form>
  );
} 