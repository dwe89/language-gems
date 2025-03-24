'use client';

// Add export config to skip static generation
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import React, { useState, useEffect, use } from 'react';
import { useAuth } from '../../../../../components/auth/AuthProvider';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Save, Loader2
} from 'lucide-react';
import { Button } from "../../../../../components/ui/button";
import { Card, CardContent } from "../../../../../components/ui/card";
import { Label } from "../../../../../components/ui/label";
import { Input } from "../../../../../components/ui/input";
import { Textarea } from "../../../../../components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../../../../../components/ui/select-components";

// Define types
type ClassData = {
  id: string;
  name: string;
  description: string;
  level: string;
  code: string;
  teacher_id: string;
};

export default function EditClassPage({ params }: { params: Promise<{ classId: string }> }) {
  // Properly use React.use() to access params
  const { classId } = use(params);
  
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [classData, setClassData] = useState<ClassData>({
    id: classId,
    name: '',
    description: '',
    level: 'beginner',
    code: '',
    teacher_id: ''
  });
  const [error, setError] = useState('');
  
  useEffect(() => {
    async function fetchClassData() {
      if (!user) return;
      
      try {
        setLoading(true);
        const supabase = createClientComponentClient();
        
        // Fetch class data
        const { data: classDataResult, error: classError } = await supabase
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
        
        setClassData(classDataResult);
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
  
  const handleSelectChange = (name: string, value: string) => {
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
      const supabase = createClientComponentClient();
      
      const { error: updateError } = await supabase
        .from('classes')
        .update({
          name: classData.name,
          description: classData.description,
          level: classData.level,
          code: classData.code,
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
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }
  
  return (
    <div className="container py-10">
      <div className="mb-8">
        <Link 
          href={`/dashboard/classes/${classId}`} 
          className="inline-flex items-center text-cyan-400 hover:text-cyan-300 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Class
        </Link>
        <h1 className="text-3xl font-bold text-white">Edit Class</h1>
      </div>
      
      <Card className="border border-gray-700 bg-gray-800 shadow-lg">
        <CardContent className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-800/50 rounded-md text-red-300">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-white text-base">Class Name</Label>
                <Input 
                  id="name"
                  name="name"
                  value={classData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Beginner Spanish"
                  className="mt-1.5 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500"
                />
              </div>
              
              <div>
                <Label htmlFor="description" className="text-white text-base">Description</Label>
                <Textarea 
                  id="description"
                  name="description"
                  value={classData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your class"
                  rows={3}
                  className="mt-1.5 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="level" className="text-white text-base">Level</Label>
                  <Select 
                    value={classData.level} 
                    onValueChange={(value: string) => handleSelectChange('level', value)}
                  >
                    <SelectTrigger className="mt-1.5 bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      <SelectItem value="beginner" className="text-white focus:bg-gray-700 hover:bg-gray-700">Beginner</SelectItem>
                      <SelectItem value="intermediate" className="text-white focus:bg-gray-700 hover:bg-gray-700">Intermediate</SelectItem>
                      <SelectItem value="advanced" className="text-white focus:bg-gray-700 hover:bg-gray-700">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="code" className="text-white text-base">Class Code</Label>
                  <Input 
                    id="code"
                    name="code"
                    value={classData.code}
                    onChange={handleInputChange}
                    placeholder="e.g. SPA101"
                    className="mt-1.5 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500"
                  />
                </div>
              </div>
              
              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={saving} className="bg-cyan-600 hover:bg-cyan-700">
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
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
  );
} 