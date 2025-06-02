'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../components/auth/AuthProvider';
import { Plus, Users, BookOpen, School, MoreVertical, Filter, Search, Trash2, Edit } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '../../../lib/database.types';

// Add export config to skip static generation
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

type ClassData = {
  id: string;
  name: string;
  description: string | null;
  level: string;
  year_group: string;
  created_at: string;
  student_count?: number;
  teacher_id?: string;
};

export default function ClassesPage() {
  const { user } = useAuth();
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newClass, setNewClass] = useState({
    name: '',
    description: '',
    level: 'beginner',
    year_group: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    if (user) {
      loadClasses();
    }
  }, [user]);

  const loadClasses = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Query the database for classes created by this teacher
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .eq('teacher_id', user.id);
      
      if (error) {
        throw error;
      }
      
      // Set real data from database (empty array if no classes)
      setClasses(data || []);
    } catch (error) {
      console.error('Error loading classes:', error);
      setError('Failed to load classes. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Validate inputs
      if (!newClass.name.trim()) {
        throw new Error('Class name is required');
      }
      
      if (!newClass.year_group.trim()) {
        throw new Error('Year group/grade is required');
      }
      
      // Create the new class in the database
      const newClassData = {
        name: newClass.name,
        description: newClass.description || null,
        level: newClass.level,
        year_group: newClass.year_group,
        teacher_id: user.id,
        created_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('classes')
        .insert([newClassData])
        .select();
      
      if (error) {
        throw error;
      }
      
      // Add the new class to the state with the ID from the database
      if (data && data.length > 0) {
        setClasses([...classes, { 
          ...data[0], 
          student_count: 0 
        }]);
        
        // Reset form and close modal
        setNewClass({ name: '', description: '', level: 'beginner', year_group: '' });
        setShowCreateModal(false);
      }
    } catch (error: any) {
      console.error('Error creating class:', error);
      setError(error.message || 'Failed to create class. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter and search classes
  const filteredClasses = classes.filter(classItem => {
    const matchesSearch = searchQuery === '' || 
      classItem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (classItem.description && classItem.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesLevel = levelFilter === 'all' || classItem.level === levelFilter;
    
    return matchesSearch && matchesLevel;
  });
  
  const handleDeleteClass = async (classId: string) => {
    if (!confirm('Are you sure you want to delete this class? This cannot be undone.')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('classes')
        .delete()
        .eq('id', classId);
        
      if (error) throw error;
      
      // Remove from state
      setClasses(classes.filter(c => c.id !== classId));
    } catch (error) {
      console.error('Error deleting class:', error);
      setError('Failed to delete class. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-emerald-100 text-emerald-800';
      case 'intermediate': return 'bg-amber-100 text-amber-800';
      case 'advanced': return 'bg-rose-100 text-rose-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-teal-100 to-rose-100 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-teal-800 mb-2">Your Classes</h1>
            <p className="text-teal-600">Manage your language classes</p>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="mt-4 md:mt-0 flex items-center px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-md shadow-md transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Class
          </button>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Search and Filter Bar */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="relative w-full md:w-auto flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Search classes..."
            />
          </div>
          
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <Filter className="h-5 w-5 text-gray-500" />
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>

        {filteredClasses.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-teal-100 text-teal-600 mb-4">
              <School className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No classes found</h3>
            <p className="text-gray-500 mb-6">
              {classes.length === 0 
                ? "Create your first class to start managing students and assignments" 
                : "No classes match your current filters"}
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-md transition-colors shadow-md"
            >
              Create Your First Class
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClasses.map((classItem) => (
              <div 
                key={classItem.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-teal-100 text-teal-600">
                      <BookOpen className="h-6 w-6" />
                    </div>
                    <div className="flex space-x-2">
                      <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${getLevelBadgeColor(classItem.level)}`}>
                        {classItem.level.charAt(0).toUpperCase() + classItem.level.slice(1)}
                      </span>
                      <span className="text-xs font-medium px-2.5 py-0.5 rounded bg-blue-100 text-blue-800">
                        {classItem.year_group}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{classItem.name}</h3>
                  {classItem.description && (
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{classItem.description}</p>
                  )}
                  <div className="flex items-center mb-4">
                    <Users className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-500">{classItem.student_count || 0} students</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <Link 
                      href={`/dashboard/classes/${classItem.id}`}
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded text-sm transition-colors"
                    >
                      View Class
                    </Link>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleDeleteClass(classItem.id)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                        aria-label="Delete class"
                      >
                        <Trash2 size={18} />
                      </button>
                      <Link 
                        href={`/dashboard/classes/${classItem.id}/edit`}
                        className="p-2 text-teal-500 hover:text-teal-700 hover:bg-teal-50 rounded-full transition-colors"
                        aria-label="Edit class"
                      >
                        <Edit size={18} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Class Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-[60] overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-[61]" aria-hidden="true" onClick={() => setShowCreateModal(false)}></div>
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full z-[62] relative">
                <form onSubmit={handleCreateClass}>
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Create New Class</h3>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="className" className="block text-sm font-medium text-gray-700 mb-1">
                          Class Name*
                        </label>
                        <input
                          id="className"
                          type="text"
                          value={newClass.name}
                          onChange={(e) => setNewClass({...newClass, name: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                          placeholder="e.g. Spanish for Beginners"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="classDescription" className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          id="classDescription"
                          value={newClass.description}
                          onChange={(e) => setNewClass({...newClass, description: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                          placeholder="Short description of the class"
                          rows={3}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="classLevel" className="block text-sm font-medium text-gray-700 mb-1">
                            Level
                          </label>
                          <select
                            id="classLevel"
                            value={newClass.level}
                            onChange={(e) => setNewClass({...newClass, level: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                          >
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="yearGroup" className="block text-sm font-medium text-gray-700 mb-1">
                            Year Group/Grade*
                          </label>
                          <select
                            id="yearGroup"
                            value={newClass.year_group}
                            onChange={(e) => setNewClass({...newClass, year_group: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                            required
                          >
                            <option value="">Select Year Group</option>
                            <option value="Year 7">Year 7</option>
                            <option value="Year 8">Year 8</option>
                            <option value="Year 9">Year 9</option>
                            <option value="Year 10">Year 10</option>
                            <option value="Year 11">Year 11</option>
                            <option value="Year 12">Year 12</option>
                            <option value="Year 13">Year 13</option>
                            <option value="Grade 6">Grade 6</option>
                            <option value="Grade 7">Grade 7</option>
                            <option value="Grade 8">Grade 8</option>
                            <option value="Grade 9">Grade 9</option>
                            <option value="Grade 10">Grade 10</option>
                            <option value="Grade 11">Grade 11</option>
                            <option value="Grade 12">Grade 12</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-teal-600 text-base font-medium text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 sm:ml-3 sm:w-auto sm:text-sm ${
                        isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      {isSubmitting ? 'Creating...' : 'Create Class'}
                    </button>
                    <button
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={() => setShowCreateModal(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 