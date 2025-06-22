'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../../../components/auth/AuthProvider';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { supabaseBrowser } from '../../../../../components/auth/AuthProvider';
import EnhancedAssignmentCreator from '../../../../../components/assignments/EnhancedAssignmentCreator';

export default function EnhancedAssignmentPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('');

  const supabase = supabaseBrowser;

  // Get class ID from URL params if provided
  useEffect(() => {
    const classId = searchParams?.get('classId');
    if (classId) {
      setSelectedClassId(classId);
    }
  }, [searchParams]);

  // Fetch teacher's classes
  useEffect(() => {
    if (!user) return;

    const fetchClasses = async () => {
      try {
        const { data: classesData, error } = await supabase
          .from('classes')
          .select(`
            *,
            student_classes!inner(count)
          `)
          .eq('teacher_id', user.id)
          .order('name');

        if (error) {
          console.error('Error fetching classes:', error);
          setClasses([]);
        } else {
          setClasses(classesData || []);
          
          // If no class selected and we have classes, select the first one
          if (!selectedClassId && classesData && classesData.length > 0) {
            setSelectedClassId(classesData[0].id);
          }
        }
      } catch (error) {
        console.error('Error fetching classes:', error);
        setClasses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [user, supabase, selectedClassId]);

  const handleAssignmentCreated = (assignmentId: string) => {
    // Redirect to assignment details or assignments list
    router.push('/dashboard/assignments');
  };

  const handleCancel = () => {
    router.push('/dashboard/assignments');
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-gray-600 mb-8">You need to be logged in to create assignments.</p>
            <Link href="/auth/login" className="text-indigo-600 hover:text-indigo-700">
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (classes.length === 0) {
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
          </div>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">No Classes Found</h1>
            <p className="text-gray-600 mb-8">You need to create a class before you can create assignments.</p>
            <Link 
              href="/dashboard/classes" 
              className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
            >
              Create Your First Class
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
        </div>

        {/* Class Selection */}
        {classes.length > 1 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-indigo-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Class</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {classes.map((cls) => (
                <button
                  key={cls.id}
                  onClick={() => setSelectedClassId(cls.id)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    selectedClassId === cls.id
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <h3 className="font-medium text-gray-900">{cls.name}</h3>
                  <p className="text-sm text-gray-600">{cls.description || 'No description'}</p>
                  <div className="text-xs text-gray-500 mt-2">
                    {cls.student_classes?.length || 0} students
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Assignment Creator */}
        {selectedClassId && (
          <EnhancedAssignmentCreator
            classId={selectedClassId}
            onAssignmentCreated={handleAssignmentCreated}
            onCancel={handleCancel}
          />
        )}
      </div>
    </div>
  );
} 