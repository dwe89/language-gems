'use client';

// Add export config to skip static generation
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../../components/auth/AuthProvider';
import { supabaseBrowser } from '../../../../../components/auth/AuthProvider';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2, Settings, BookOpen } from 'lucide-react';
import { Button } from "../../../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../components/ui/card";
import { Label } from "../../../../../components/ui/label";
import { Input } from "../../../../../components/ui/input";

// Define types
type ClassData = {
  id: string;
  name: string;
  year_group: string;
  teacher_id: string;
};

export default function EditClassPage({ params }: { params: { classId: string } }) {
  // Access params directly
  const { classId } = params;
  
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [classData, setClassData] = useState<ClassData>({
    id: classId,
    name: '',
    year_group: '',
    teacher_id: ''
  });
  const [error, setError] = useState('');
  
  useEffect(() => {
    async function fetchClassData() {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Fetch class data
        const { data: classDataResult, error: classError } = await supabaseBrowser
          .from('classes')
          .select('*')
          .eq('id', classId)
          .single();
        
        if (classError) {
          console.error('Error fetching class:', classError);
          setError('Unable to load class data. Please try again later.');
          setLoading(false);
          return;
        }
        
        if (!classDataResult) {
          setError('Class not found.');
          setLoading(false);
          return;
        }
        
        setClassData({
          id: classDataResult.id,
          name: classDataResult.name || '',
          year_group: classDataResult.year_group || '',
          teacher_id: classDataResult.teacher_id || ''
        });
      } catch (error) {
        console.error('Error fetching class data:', error);
        setError('An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchClassData();
  }, [classId, user]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setClassData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!classData.name.trim()) {
      setError('Class name is required');
      return;
    }
    
    try {
      setSaving(true);
      
      const { error: updateError } = await supabaseBrowser
        .from('classes')
        .update({
          name: classData.name,
          year_group: classData.year_group,
        })
        .eq('id', classId);
      
      if (updateError) {
        throw new Error(updateError.message);
      }
      
      // Redirect back to class page
      router.push(`/dashboard/classes/${classId}`);
    } catch (error) {
      console.error('Error updating class:', error);
      setError('Failed to update class. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white/20 shadow-2xl p-16 text-center">
            <div className="relative mb-8">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mx-auto"></div>
              <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-r-purple-400 animate-pulse mx-auto"></div>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Loading Class Settings</h2>
            <p className="text-slate-600 font-medium">Preparing your class configuration...</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header Section */}
      <div className="bg-white/70 backdrop-blur-sm border-b border-slate-200/50 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link 
            href={`/dashboard/classes/${classId}`} 
            className="inline-flex items-center text-slate-600 hover:text-indigo-600 transition-colors duration-200 group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
            <span className="font-medium">Back to Class</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Settings className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Edit Class Settings</h1>
              <p className="text-slate-600 mt-1">Update your class information and preferences</p>
            </div>
          </div>
        </div>
        
        {/* Form Card */}
        <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-xl shadow-slate-200/50 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
            
            <div className="relative z-10">
              <CardTitle className="text-2xl font-bold flex items-center">
                <BookOpen className="h-6 w-6 mr-3" />
                Class Configuration
              </CardTitle>
              <p className="text-indigo-100 mt-2">
                Customize how your class appears to students and manage basic settings
              </p>
            </div>
          </CardHeader>
          
          <CardContent className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-start space-x-3">
                <div className="w-5 h-5 bg-red-500 rounded-full flex-shrink-0 mt-0.5"></div>
                <div>
                  <p className="font-semibold">Error</p>
                  <p className="text-sm mt-1">{error}</p>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information Section */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <BookOpen className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800">Basic Information</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-slate-700 font-medium text-base flex items-center">
                      Class Name
                      <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input 
                      id="name"
                      name="name"
                      value={classData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Advanced Spanish - Fall 2024"
                      className="mt-2 bg-white/80 border-slate-200 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-xl h-12 text-lg"
                    />
                  </div>

                  <div>
                    <Label htmlFor="year_group" className="text-slate-700 font-medium text-base">Year Group</Label>
                    <p className="text-sm text-slate-500 mt-1 mb-2">Academic year or grade level for this class</p>
                    <Input 
                      id="year_group"
                      name="year_group"
                      value={classData.year_group}
                      onChange={handleInputChange}
                      placeholder="e.g. Year 7, 9th Grade, Form 4"
                      className="mt-1 bg-white/80 border-slate-200 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-xl h-12 text-base"
                    />
                  </div>
                </div>
              </div>

              
              
              {/* Action Buttons */}
              <div className="border-t border-slate-200 pt-8">
                <div className="flex justify-end space-x-4">
                  <Link href={`/dashboard/classes/${classId}`}>
                    <Button 
                      type="button"
                      variant="outline" 
                      className="border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl px-6 py-3 font-medium"
                    >
                      Cancel
                    </Button>
                  </Link>
                  <Button 
                    type="submit" 
                    disabled={saving} 
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl px-8 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Saving Changes...
                      </>
                    ) : (
                      <>
                        <Save className="h-5 w-5 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 