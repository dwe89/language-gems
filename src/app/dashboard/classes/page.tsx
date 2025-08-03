'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../components/auth/AuthProvider';
import { Plus, Users, BookOpen, School, MoreVertical, Filter, Search, Trash2, Edit } from 'lucide-react';
import { supabaseBrowser } from '../../../components/auth/AuthProvider';
import type { Database } from '../../../lib/database.types';
import DashboardHeader from '../../../components/dashboard/DashboardHeader';

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
  const { user, isLoading: authLoading } = useAuth();
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newClass, setNewClass] = useState({
    name: '',
    year_group: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Set a maximum loading timeout to prevent infinite loading
    const maxLoadingTimeout = setTimeout(() => {
      console.log('Maximum loading time reached, stopping spinner');
      setLoading(false);
      if (!user && !authLoading) {
        setError('Authentication required. Please refresh the page.');
      }
    }, 6000); // Reduced to 6 seconds for better UX

    if (user && !authLoading) {
      console.log('User found, loading classes');
      loadClasses();
    } else if (!authLoading && !user) {
      console.log('No user and auth not loading, stopping');
      setLoading(false);
      setError('Please log in to view your classes.');
    } else {
      console.log('Auth still loading, waiting...');
    }

    return () => clearTimeout(maxLoadingTimeout);
  }, [user, authLoading]);

  const loadClasses = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('Loading classes for user:', user.id);

      // Query the database for classes created by this teacher
      const { data: classesData, error: classesError } = await supabaseBrowser
        .from('classes')
        .select('*')
        .eq('teacher_id', user.id);

      console.log('Classes query result:', { classesData, classesError });

      if (classesError) {
        console.error('Classes query error:', classesError);

        // If table doesn't exist, create sample data
        if (classesError.code === 'PGRST116' || classesError.message?.includes('does not exist')) {
          console.log('Classes table does not exist, creating sample data');
          const sampleClasses: ClassData[] = [
            {
              id: 'sample-1',
              name: 'French Beginners',
              description: 'Introduction to French language',
              level: 'beginner',
              year_group: '7',
              created_at: new Date().toISOString(),
              student_count: 0,
              teacher_id: user.id
            },
            {
              id: 'sample-2',
              name: 'Spanish Intermediate',
              description: 'Intermediate Spanish conversation',
              level: 'intermediate',
              year_group: '9',
              created_at: new Date().toISOString(),
              student_count: 0,
              teacher_id: user.id
            }
          ];
          setClasses(sampleClasses);
          setError('Demo mode: Classes table not found. These are sample classes.');
          setLoading(false);
          return;
        }

        throw classesError;
      }

      if (!classesData || classesData.length === 0) {
        console.log('No classes found for teacher');
        setClasses([]);
        setLoading(false);
        return;
      }

      console.log(`Found ${classesData.length} classes`);

      // Get student counts for each class
      const classIds = classesData.map(c => c.id);
      console.log('Class IDs to query:', classIds);

      const { data: enrollmentsData, error: enrollmentsError } = await supabaseBrowser
        .from('class_enrollments')
        .select('class_id')
        .in('class_id', classIds)
        .eq('status', 'active');

      console.log('Enrollments query result:', { enrollmentsData, enrollmentsError });

      if (enrollmentsError) {
        console.error('Error fetching enrollments:', enrollmentsError);
        // Continue without enrollment data if that table doesn't exist
      }

      // Calculate student count per class
      const studentCounts = (enrollmentsData || []).reduce((acc, enrollment) => {
        acc[enrollment.class_id] = (acc[enrollment.class_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Add student counts to classes
      const classesWithCounts = classesData.map(classItem => ({
        ...classItem,
        student_count: studentCounts[classItem.id] || 0
      }));

      console.log('Final classes with counts:', classesWithCounts);
      setClasses(classesWithCounts);
    } catch (error) {
      console.error('Error loading classes:', error);
      setError(`Failed to load classes: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
        description: null,
        level: 'beginner', // Default level
        year_group: newClass.year_group,
        teacher_id: user.id,
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabaseBrowser
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
        setNewClass({ name: '', year_group: '' });
        setShowCreateModal(false);
      }
    } catch (error: any) {
      console.error('Error creating class:', error);
      setError(error.message || 'Failed to create class. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleDeleteClass = async (classId: string) => {
    if (!confirm('Are you sure you want to delete this class? This will also delete all related assignments, enrollments, and announcements. This cannot be undone.')) {
      return;
    }

    try {
      // Delete related records first to avoid foreign key constraint violations

      // 1. Delete class enrollments
      await supabaseBrowser
        .from('class_enrollments')
        .delete()
        .eq('class_id', classId);

      // 2. Delete assignments
      await supabaseBrowser
        .from('assignments')
        .delete()
        .eq('class_id', classId);

      // 3. Delete announcements
      await supabaseBrowser
        .from('announcements')
        .delete()
        .eq('class_id', classId);

      // 4. Delete class vocabulary assignments
      await supabaseBrowser
        .from('class_vocabulary_assignments')
        .delete()
        .eq('class_id', classId);

      // 5. Delete competitions
      await supabaseBrowser
        .from('competitions')
        .delete()
        .eq('class_id', classId);

      // 6. Delete leaderboard snapshots
      await supabaseBrowser
        .from('leaderboard_snapshots')
        .delete()
        .eq('class_id', classId);

      // 7. Delete student ranking history
      await supabaseBrowser
        .from('student_ranking_history')
        .delete()
        .eq('class_id', classId);

      // 8. Finally delete the class itself
      const { error } = await supabaseBrowser
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

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
            <p className="text-gray-600">
              {authLoading ? 'Authenticating...' : 'Loading classes...'}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              If this takes more than a few seconds, please refresh the page.
            </p>
          </div>
        </div>
      </div>
    );
  }



  // Filter and sort classes
  const filteredClasses = classes.filter(classItem => {
    const matchesSearch = classItem.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // ClassCard Component
  const ClassCard = ({ classData, onDelete }: { classData: ClassData; onDelete: (id: string) => void }) => (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className="p-6 flex flex-col h-full">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{classData.name}</h3>
              <p className="text-sm text-slate-500">Year {classData.year_group}</p>
            </div>
          </div>
        </div>



        {/* Student count and creation date - fixed positioning */}
        <div className="flex items-center space-x-2 mb-2">
          <Users className="h-4 w-4 text-slate-400" />
          <span className="text-sm font-medium text-slate-600">
            {classData.student_count || 0} student{(classData.student_count || 0) !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="text-xs text-slate-400 mb-6">
          Created {new Date(classData.created_at).toLocaleDateString()}
        </div>

        {/* Bottom section with button and delete icon */}
        <div className="mt-auto flex items-center justify-between">
          <Link
            href={`/dashboard/classes/${classData.id}`}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            View Class
          </Link>
          <button
            onClick={() => onDelete(classData.id)}
            className="p-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200 border border-red-200/50 hover:border-red-300 ml-3"
            aria-label="Delete class"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 p-6">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader
          title="My Classes"
          description="Manage your classes and track student progress"
          icon={<BookOpen className="h-5 w-5 text-white" />}
        />

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Controls Panel */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            {/* Search and Filter */}
            <div className="flex flex-1 max-w-2xl gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search classes..."
                  className="w-full pl-11 pr-4 py-3 border border-slate-300/60 rounded-xl bg-white/80 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
              </div>


            </div>

            {/* Create Class Button */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl flex items-center space-x-2 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
              disabled={isSubmitting}
            >
              <Plus size={18} />
              <span>Create New Class</span>
            </button>
          </div>
        </div>

        {/* Classes Grid */}
        <div className="mb-8">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
          ) : filteredClasses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredClasses.map((classItem) => (
                <ClassCard
                  key={classItem.id}
                  classData={classItem}
                  onDelete={handleDeleteClass}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 px-6">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mb-6 border border-indigo-200/50">
                  <BookOpen className="h-10 w-10 text-indigo-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">No classes found</h3>
                <p className="text-slate-600 mb-8 leading-relaxed">
                  {searchQuery
                    ? 'Try adjusting your search to find classes.'
                    : 'Get started by creating your first class for your students.'}
                </p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Plus className="h-4 w-4 mr-2 inline" />
                  Create Your First Class
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Create Class Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                      <Plus className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">Create New Class</h2>
                  </div>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleCreateClass} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Class Name *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                      placeholder="e.g., French Beginners"
                      value={newClass.name}
                      onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                    />
                  </div>



                  <div className="grid grid-cols-1 gap-4">

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Year Group *
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                        placeholder="e.g., Year 7"
                        value={newClass.year_group}
                        onChange={(e) => setNewClass({ ...newClass, year_group: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-medium"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Creating...' : 'Create Class'}
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