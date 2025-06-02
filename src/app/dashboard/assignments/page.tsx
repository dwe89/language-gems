'use client';

// Add export config to skip static generation
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../components/auth/AuthProvider';
import Link from 'next/link';
import { 
  Search, FileText, Edit, Trash2, Plus, Filter, Calendar, Clock,
  BookOpen, CheckCircle, XCircle, Users, BookmarkIcon
} from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '../../../lib/database.types';

export default function AssignmentsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const supabase = createClientComponentClient<Database>();

  // Fetch real data from database
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        // Fetch real assignments for this teacher
        const { data: assignmentsData, error: assignmentsError } = await supabase
          .from('assignments')
          .select(`
            *,
            classes!inner(name)
          `)
          .eq('created_by', user.id)
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
    const matchesFilter = filter === 'all' || assignment.status === filter;
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
        .eq('created_by', user.id)
        .order('created_at', { ascending: false });

      setAssignments(updatedAssignments || []);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating assignment:', error);
    }
  };

  const deleteAssignment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('assignments')
        .delete()
        .eq('id', id)
        .eq('created_by', user?.id);

      if (error) {
        console.error('Error deleting assignment:', error);
        return;
      }

      setAssignments(assignments.filter(a => a.id !== id));
    } catch (error) {
      console.error('Error deleting assignment:', error);
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
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-teal-100 to-rose-100 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-teal-800 mb-2">Assignments</h1>
          <p className="text-teal-600">Create and manage assignments for your classes</p>
        </header>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="relative w-full sm:w-1/3">
              <input
                type="text"
                placeholder="Search assignments..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
            
            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <select
                  className="pl-3 pr-8 py-2 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">All Assignments</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="draft">Drafts</option>
                </select>
                <Filter className="absolute right-2 top-2.5 text-gray-400 pointer-events-none" size={16} />
              </div>
              
              <div className="relative inline-block">
                <button
                  className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <Plus size={18} />
                  <span>Create Assignment</span>
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10">
                    <div className="py-1">
                      <Link href="/dashboard/assignments/new" legacyBehavior>
                        <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Standard Assignment
                        </a>
                      </Link>
                      <Link href="/dashboard/assignments/new/exam" legacyBehavior>
                        <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Exam Assignment
                        </a>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Assignments Table */}
          {filteredAssignments.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments found</h3>
              <p className="text-gray-500 mb-6">
                {assignments.length === 0 
                  ? "Get started by creating your first assignment for your students."
                  : "Try adjusting your search or filter criteria."
                }
              </p>
              {assignments.length === 0 && (
                <Link 
                  href="/dashboard/assignments/new"
                  className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Assignment
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assignment
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Class
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Progress
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAssignments.map((assignment) => (
                    <tr key={assignment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                              <FileText className="h-5 w-5 text-indigo-600" />
                            </div>
                          </div>
                          <div className="ml-4 flex-1">
                            <div className="text-sm font-medium text-gray-900">
                              {assignment.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {assignment.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {assignment.classes?.name || 'Unknown Class'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="mr-1.5 h-4 w-4 text-gray-400" />
                          {assignment.due_date ? new Date(assignment.due_date).toLocaleDateString() : 'No due date'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          assignment.status === 'active' ? 'bg-green-100 text-green-800' :
                          assignment.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                          assignment.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {assignment.status?.charAt(0).toUpperCase() + assignment.status?.slice(1) || 'Unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-indigo-600 h-2 rounded-full" 
                              style={{ width: '0%' }}
                            ></div>
                          </div>
                          <span>0%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <Link
                            href={`/dashboard/assignments/${assignment.id}/edit`}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => deleteAssignment(assignment.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Create Assignment Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <CreateAssignmentForm 
                classes={classes}
                onSubmit={createAssignment}
                onCancel={() => setShowCreateModal(false)}
              />
            </div>
          </div>
        )}
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