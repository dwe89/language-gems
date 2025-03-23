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

  const supabase = createClientComponentClient<Database>();

  // Create sample data - would be replaced with actual database calls
  useEffect(() => {
    const sampleAssignments = [
      {
        id: '1',
        title: 'French Food Vocabulary Quiz',
        description: 'Learn 20 common food words in French',
        due_date: '2023-07-15',
        status: 'active',
        assigned_to: 'Spanish 101',
        completion: 65,
        type: 'quiz',
      },
      {
        id: '2',
        title: 'Spanish Verb Conjugation',
        description: 'Practice regular -AR verbs in present tense',
        due_date: '2023-07-18',
        status: 'active',
        assigned_to: 'Spanish 201',
        completion: 32,
        type: 'exercise',
      },
      {
        id: '3',
        title: 'Japanese Hiragana Practice',
        description: 'Complete the hiragana character set practice',
        due_date: '2023-07-10',
        status: 'completed',
        assigned_to: 'Japanese Beginners',
        completion: 100,
        type: 'exercise',
      },
      {
        id: '4',
        title: 'German Culture Research',
        description: 'Research and write about a German cultural tradition',
        due_date: '2023-07-25',
        status: 'draft',
        assigned_to: 'German 301',
        completion: 0,
        type: 'project',
      },
    ];

    const sampleClasses = [
      { id: '1', name: 'Spanish 101', level: 'Beginner' },
      { id: '2', name: 'Spanish 201', level: 'Intermediate' },
      { id: '3', name: 'Japanese Beginners', level: 'Beginner' },
      { id: '4', name: 'German 301', level: 'Advanced' },
    ];
    
    // In a real implementation, we would fetch from the database
    // const fetchAssignments = async () => {
    //   const { data, error } = await supabase
    //     .from('assignments')
    //     .select('*')
    //     .eq('teacher_id', user?.id);
    //   
    //   if (error) console.error('Error fetching assignments:', error);
    //   else setAssignments(data || []);
    // };
    
    setAssignments(sampleAssignments);
    setClasses(sampleClasses);
    setLoading(false);
    
    // fetchAssignments();
  }, [user]);

  // Filter assignments based on status and search query
  const filteredAssignments = assignments.filter(assignment => {
    const matchesFilter = filter === 'all' || assignment.status === filter;
    const matchesSearch = assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const createAssignment = (assignmentData: any) => {
    // In a real implementation, we would save to the database
    // const { data, error } = await supabase
    //   .from('assignments')
    //   .insert([{ ...assignmentData, teacher_id: user?.id }]);
    
    setAssignments([...assignments, {
      id: String(assignments.length + 1),
      ...assignmentData,
      completion: 0
    }]);
    
    setShowCreateModal(false);
  };

  const deleteAssignment = (id: string) => {
    // In a real implementation, we would delete from the database
    // const { error } = await supabase
    //   .from('assignments')
    //   .delete()
    //   .eq('id', id)
    //   .eq('teacher_id', user?.id);
    
    setAssignments(assignments.filter(a => a.id !== id));
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
              
              <button
                className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                onClick={() => setShowCreateModal(true)}
              >
                <Plus size={18} />
                <span>Create Assignment</span>
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completion</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAssignments.length > 0 ? (
                  filteredAssignments.map((assignment) => (
                    <tr key={assignment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="mr-3">
                            {assignment.type === 'quiz' && <BookmarkIcon className="text-indigo-500" size={20} />}
                            {assignment.type === 'exercise' && <BookOpen className="text-emerald-500" size={20} />}
                            {assignment.type === 'project' && <FileText className="text-amber-500" size={20} />}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{assignment.title}</div>
                            <div className="text-sm text-gray-500">{assignment.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Users size={16} className="mr-2 text-teal-600" />
                          {assignment.assigned_to}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar size={16} className="mr-2 text-teal-600" />
                          {new Date(assignment.due_date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          assignment.status === 'active' ? 'bg-emerald-100 text-emerald-800' :
                          assignment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-teal-600 h-2.5 rounded-full" 
                            style={{ width: `${assignment.completion}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1 text-center">{assignment.completion}%</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-indigo-600 hover:text-indigo-900">
                            <Edit size={18} />
                          </button>
                          <button 
                            className="text-red-600 hover:text-red-900"
                            onClick={() => deleteAssignment(assignment.id)}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      No assignments found. Create your first assignment!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create Assignment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
            <h2 className="text-2xl font-bold text-teal-800 mb-4">Create New Assignment</h2>
            
            <CreateAssignmentForm 
              classes={classes}
              onSubmit={createAssignment}
              onCancel={() => setShowCreateModal(false)}
            />
          </div>
        </div>
      )}
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