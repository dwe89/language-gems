'use client';

import React, { useState } from 'react';
import { UserCircle2, User, Calendar, Key, RefreshCw, Trash2, Eye, EyeOff, Copy, CheckCircle } from 'lucide-react';
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "../ui/dropdown-menu";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "../ui/dialog";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Alert, AlertDescription } from "../ui/alert";

type StudentProps = {
  student: {
    id: string;
    name: string;
    username: string;
    progress: number;
    joined_date: string;
  };
  classId: string;
  onStudentDeleted: (studentId: string) => void;
};

export function StudentCard({ student, classId, onStudentDeleted }: StudentProps) {
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [password, setPassword] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  const getActivityStatus = (joinedDate: string) => {
    const now = new Date();
    const joined = new Date(joinedDate);
    const diffInDays = Math.floor((now.getTime() - joined.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays < 2) return { status: 'Active', color: 'text-green-400' };
    if (diffInDays < 7) return { status: 'Recent', color: 'text-teal-400' };
    if (diffInDays < 14) return { status: 'Away', color: 'text-yellow-400' };
    return { status: 'Inactive', color: 'text-red-400' };
  };
  
  const activityStatus = getActivityStatus(student.joined_date);
  
  const fetchStudentPassword = async () => {
    setLoading(true);
    setError('');
    setPassword(null);
    
    try {
      const supabase = createClientComponentClient();
      const { data, error } = await supabase
        .from('user_profiles')
        .select('initial_password')
        .eq('user_id', student.id)
        .single();
      
      if (error) throw error;
      
      if (data && data.initial_password) {
        setPassword(data.initial_password);
      } else {
        setPassword('(Password not available)');
      }
    } catch (err) {
      console.error('Error fetching password:', err);
      setError('Failed to retrieve password');
    } finally {
      setLoading(false);
    }
  };
  
  const resetStudentPassword = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Generate a new random password
      const newPassword = Math.random().toString(36).slice(-8) + Math.random().toString(10).slice(-2);
      
      // Call the server to reset the password
      const response = await fetch('/api/students/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: student.id,
          newPassword
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to reset password');
      }
      
      setPassword(newPassword);
      setSuccess('Password reset successfully');
      setShowPassword(true);
    } catch (err) {
      console.error('Error resetting password:', err);
      setError('Failed to reset password');
    } finally {
      setLoading(false);
    }
  };
  
  const deleteStudent = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Call the server to delete the student
      const response = await fetch('/api/students/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: student.id,
          classId
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete student');
      }
      
      // Close the dialog
      setShowDeleteDialog(false);
      
      // Notify parent component
      onStudentDeleted(student.id);
    } catch (err) {
      console.error('Error deleting student:', err);
      setError('Failed to delete student');
    } finally {
      setLoading(false);
    }
  };
  
  const copyPasswordToClipboard = () => {
    if (!password) return;
    
    navigator.clipboard.writeText(password).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }).catch(err => {
      console.error('Could not copy password:', err);
      setError('Could not copy password to clipboard');
    });
  };
  
  return (
    <>
      <Card className="overflow-hidden border border-slate-700/50 bg-slate-800/80 hover:bg-slate-800 transition-colors shadow-md">
        <CardContent className="p-0">
          <div className="bg-gradient-to-r from-indigo-950 via-indigo-900 to-indigo-800 p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-14 w-14 rounded-full bg-indigo-700/50 border border-indigo-600/50 text-white flex items-center justify-center mr-4">
                  <UserCircle2 className="h-10 w-10" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-lg">{student.name}</h3>
                  <div className="flex items-center text-indigo-200 text-sm mt-1">
                    <User className="h-3.5 w-3.5 mr-1.5" />
                    <span>@{student.username}</span>
                  </div>
                </div>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:text-white hover:bg-indigo-800 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-more-vertical"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem onClick={() => {
                    setShowPasswordDialog(true);
                    fetchStudentPassword();
                  }} className="cursor-pointer">
                    <Key className="h-4 w-4 mr-2" />
                    View Password
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {
                    setShowPasswordDialog(true);
                    resetStudentPassword();
                  }} className="cursor-pointer">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset Password
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-400 hover:text-red-300 hover:bg-red-900/50 cursor-pointer" onClick={() => setShowDeleteDialog(true)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove Student
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          <div className="p-5">
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-300 flex items-center">
                  <Calendar className="h-4 w-4 mr-1.5 text-gray-400" />
                  Joined {formatDate(student.joined_date)}
                </div>
                <div className={`text-sm px-2.5 py-1 rounded-full font-medium ${
                  activityStatus.status === 'Active' ? 'bg-green-900/40 text-green-300 border border-green-800/50' :
                  activityStatus.status === 'Recent' ? 'bg-teal-900/40 text-teal-300 border border-teal-800/50' :
                  activityStatus.status === 'Away' ? 'bg-yellow-900/40 text-yellow-300 border border-yellow-800/50' :
                  'bg-red-900/40 text-red-300 border border-red-800/50'
                }`}>
                  {activityStatus.status}
                </div>
              </div>
              
              <div className="mt-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-300">Progress</span>
                  <span className="text-sm font-medium px-2 py-0.5 rounded bg-slate-700/50 text-white">
                    {student.progress}%
                  </span>
                </div>
                <div className="w-full bg-slate-700/50 rounded-full h-2.5 overflow-hidden border border-slate-600/30">
                  <div 
                    className={`h-2.5 rounded-full ${
                      student.progress < 30 ? 'bg-gradient-to-r from-red-600 to-red-500' :
                      student.progress < 70 ? 'bg-gradient-to-r from-amber-500 to-yellow-500' :
                      'bg-gradient-to-r from-emerald-600 to-green-500'
                    }`}
                    style={{ width: `${student.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Password Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="sm:max-w-[425px] bg-slate-900 border border-slate-700 text-white shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-white text-xl">Student Password</DialogTitle>
            <DialogDescription className="text-gray-300">
              {password ? 'View or copy the student password below.' : 'Loading student password...'}
            </DialogDescription>
          </DialogHeader>
          
          {error && (
            <Alert variant="destructive" className="my-2 bg-red-900/50 border border-red-800/70">
              <AlertDescription className="text-red-300">{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert className="my-2 bg-green-900/50 border border-green-800/70">
              <AlertDescription className="text-green-300">{success}</AlertDescription>
            </Alert>
          )}
          
          {loading ? (
            <div className="flex justify-center py-6">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-cyan-500"></div>
            </div>
          ) : password ? (
            <div className="space-y-4 py-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none text-white">Password for {student.name}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full px-4 py-2.5 border border-slate-600 rounded-md bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={password}
                    readOnly
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1.5 h-8 w-8 text-gray-300 hover:text-white hover:bg-slate-700/70"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <Button 
                  size="icon"
                  variant="outline" 
                  onClick={copyPasswordToClipboard}
                  className="h-10 w-10 text-gray-300 hover:text-white hover:bg-indigo-900/60 border-slate-600"
                >
                  {copied ? <CheckCircle className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          ) : null}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPasswordDialog(false)} className="border-slate-600 hover:bg-slate-700 text-white">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[425px] bg-slate-900 border border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-white text-xl">Remove Student</DialogTitle>
            <DialogDescription className="text-gray-300">
              Are you sure you want to remove {student.name} from this class? This will only remove them from the class, not delete their account.
            </DialogDescription>
          </DialogHeader>
          
          {error && (
            <Alert variant="destructive" className="my-2 bg-red-900/50 border-red-800">
              <AlertDescription className="text-red-300">{error}</AlertDescription>
            </Alert>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteDialog(false)} 
              disabled={loading}
              className="border-slate-600 hover:bg-slate-700 text-white"
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={deleteStudent} 
              disabled={loading}
              className="bg-red-700 hover:bg-red-800 text-white"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Removing...
                </>
              ) : (
                <>Remove</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 