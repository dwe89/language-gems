'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../../components/auth/AuthProvider';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { supabaseBrowser } from '../../../../components/auth/AuthProvider';
import EnhancedAssignmentCreator from '../../../../components/assignments/EnhancedAssignmentCreator';

// Import test functions for development
if (process.env.NODE_ENV === 'development') {
  import('../../../../utils/testGrammarSystem');
}

export default function EnhancedAssignmentPage() {
  console.log('🎯 [ENHANCED ASSIGNMENT PAGE] Component loaded');

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
    // Redirect to assignment details or assignments list with error handling
    setTimeout(() => {
      try {
        router.push('/dashboard/assignments');
      } catch (navError) {
        console.error('Navigation error:', navError);
        // Fallback: use window.location if router fails
        window.location.href = '/dashboard/assignments';
      }
    }, 100);
  };

  const handleCancel = () => {
    try {
      router.push('/dashboard/assignments');
    } catch (navError) {
      console.error('Navigation error:', navError);
      window.location.href = '/dashboard/assignments';
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

        {/* Enhanced Assignment Creator */}
        <EnhancedAssignmentCreator
          onAssignmentCreated={handleAssignmentCreated}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
} 