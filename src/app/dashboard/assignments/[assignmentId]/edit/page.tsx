'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../../../components/auth/AuthProvider';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, FileText, BookOpen, Clock, Calendar, Save, 
  Trash2, Users, Eye, AlertCircle 
} from 'lucide-react';
import { supabaseBrowser } from '../../../../../components/auth/AuthProvider';

interface Assignment {
  id: string;
  title: string;
  description: string;
  due_date: string;
  assigned_to: string;
  status: string;
  points: number;
  time_limit: number;
  created_at: string;
  classes?: { name: string };
}

interface Class {
  id: string;
  name: string;
}

export default function EditAssignmentPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const assignmentId = params?.assignmentId as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [classes, setClasses] = useState<Class[]>([]);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: '',
    assigned_to: '',
    status: 'active',
    points: 10,
    time_limit: 30
  });

  const supabase = supabaseBrowser;

  useEffect(() => {
    if (!user || !assignmentId) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch assignment details
        const { data: assignmentData, error: assignmentError } = await supabase
          .from('assignments')
          .select(`
            *,
            classes!inner(name)
          `)
          .eq('id', assignmentId)
          .eq('created_by', user.id)
          .single();

        if (assignmentError) {
          console.error('Error fetching assignment:', assignmentError);
          setError('Assignment not found or you do not have permission to edit it.');
          return;
        }

        setAssignment(assignmentData);
        setFormData({
          title: assignmentData.title || '',
          description: assignmentData.description || '',
          due_date: assignmentData.due_date || '',
          assigned_to: assignmentData.assigned_to || '',
          status: assignmentData.status || 'active',
          points: assignmentData.points || 10,
          time_limit: assignmentData.time_limit || 30
        });

        // Fetch teacher's classes
        const { data: classesData, error: classesError } = await supabase
          .from('classes')
          .select('id, name')
          .eq('teacher_id', user.id);

        if (classesError) {
          console.error('Error fetching classes:', classesError);
        } else {
          setClasses(classesData || []);
        }

      } catch (err) {
        console.error('Error in fetchData:', err);
        setError('Failed to load assignment data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, assignmentId, supabase]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignment) return;

    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const { error: updateError } = await supabase
        .from('assignments')
        .update({
          title: formData.title,
          description: formData.description,
          due_date: formData.due_date,
          assigned_to: formData.assigned_to,
          status: formData.status,
          points: formData.points,
          time_limit: formData.time_limit,
          updated_at: new Date().toISOString()
        })
        .eq('id', assignment.id)
        .eq('created_by', user?.id);

      if (updateError) {
        throw new Error(updateError.message);
      }

      setSuccess('Assignment updated successfully!');

      // Use a more reliable navigation approach to avoid DOM manipulation conflicts
      setTimeout(() => {
        try {
          router.push('/dashboard/assignments');
        } catch (navError) {
          console.error('Navigation error:', navError);
          // Fallback: use window.location if router fails
          window.location.href = '/dashboard/assignments';
        }
      }, 1500);

    } catch (err) {
      console.error('Error updating assignment:', err);
      setError(err instanceof Error ? err.message : 'Failed to update assignment');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!assignment) return;
    
    const confirmed = window.confirm('Are you sure you want to delete this assignment? This action cannot be undone.');
    if (!confirmed) return;

    try {
      const { error: deleteError } = await supabase
        .from('assignments')
        .delete()
        .eq('id', assignment.id)
        .eq('created_by', user?.id);

      if (deleteError) {
        throw new Error(deleteError.message);
      }

      router.push('/dashboard/assignments');
    } catch (err) {
      console.error('Error deleting assignment:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete assignment');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !assignment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-6">
              <AlertCircle className="mx-auto h-16 w-16 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Assignment Not Found</h1>
            <p className="text-gray-600 mb-8">{error}</p>
            <Link 
              href="/dashboard/assignments" 
              className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Assignments
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/dashboard/assignments" 
            className="flex items-center text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Assignments
          </Link>
          
          <div className="flex items-center space-x-3">
            {assignment && (
              <Link
                href={`/dashboard/assignments/${assignment.id}/analytics`}
                className="flex items-center px-4 py-2 text-indigo-600 hover:text-indigo-700 border border-indigo-300 hover:border-indigo-400 rounded-lg transition-colors"
              >
                <Eye size={16} className="mr-2" />
                View Analytics
              </Link>
            )}
            <button
              type="button"
              onClick={handleDelete}
              className="flex items-center px-4 py-2 text-red-600 hover:text-red-700 border border-red-300 hover:border-red-400 rounded-lg transition-colors"
            >
              <Trash2 size={16} className="mr-2" />
              Delete
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Edit Assignment</h1>
            <p className="text-lg text-gray-600">
              Update the details and settings for your assignment
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center">
              <AlertCircle size={20} className="mr-2" />
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-6 p-6 bg-green-50 border-2 border-green-200 rounded-xl text-green-800 shadow-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-green-800">Assignment Updated Successfully!</h3>
                  <p className="text-green-700 mt-1">{success}</p>
                  <p className="text-green-600 text-sm mt-2">Redirecting to assignments page...</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-indigo-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="mr-2 text-indigo-600" size={24} />
                Assignment Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Assignment Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Week 3 Vocabulary Practice"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="assigned_to" className="block text-sm font-medium text-gray-700 mb-2">
                    Assign to Class *
                  </label>
                  <select
                    id="assigned_to"
                    name="assigned_to"
                    value={formData.assigned_to}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    required
                  >
                    <option value="">Select a class</option>
                    {classes.map(cls => (
                      <option key={cls.id} value={cls.id}>{cls.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Add instructions or context for this assignment..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
                  />
                </div>
                
                <div>
                  <label htmlFor="due_date" className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date *
                  </label>
                  <input
                    type="date"
                    id="due_date"
                    name="due_date"
                    value={formData.due_date}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  >
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="points" className="block text-sm font-medium text-gray-700 mb-2">
                    Points
                  </label>
                  <input
                    type="number"
                    id="points"
                    name="points"
                    value={formData.points}
                    onChange={handleChange}
                    min="1"
                    max="100"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                </div>
                
                <div>
                  <label htmlFor="time_limit" className="block text-sm font-medium text-gray-700 mb-2">
                    Time Limit (minutes)
                  </label>
                  <input
                    type="number"
                    id="time_limit"
                    name="time_limit"
                    value={formData.time_limit}
                    onChange={handleChange}
                    min="5"
                    max="180"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Link
                href="/dashboard/assignments"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg transition-colors font-medium flex items-center"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} className="mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 