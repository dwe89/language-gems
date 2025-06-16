'use client';

import React, { useState } from 'react';
import { UserCircle2, User, Calendar, Key, RefreshCw, Trash2, Eye, EyeOff, Copy, CheckCircle } from 'lucide-react';
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { SimpleDropdown } from "../ui/simple-dropdown";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "../ui/dialog";
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
    setShowPasswordDialog(true);
    
    try {
      const response = await fetch('/api/students/password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: student.id
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch password');
      }
      
      setPassword(data.password);
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
      // Call the server to reset the password
      const response = await fetch('/api/students/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: student.id
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to reset password');
      }
      
      setPassword(data.password);
      setSuccess('Password reset successfully');
      setShowPassword(true);
      setShowPasswordDialog(true);
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
      <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white via-slate-50 to-indigo-50/30 hover:from-white hover:to-indigo-50/50 transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm border border-slate-200/60">
        <CardContent className="p-0">
          {/* Main card content */}
          <div className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg ring-4 ring-white/50">
                    <UserCircle2 className="h-8 w-8 text-white" />
                  </div>
                  <div className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-3 border-white shadow-sm ${
                    activityStatus.status === 'Active' ? 'bg-emerald-500' :
                    activityStatus.status === 'Recent' ? 'bg-teal-500' :
                    activityStatus.status === 'Away' ? 'bg-amber-500' :
                    'bg-red-500'
                  }`}></div>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-xl leading-tight">{student.name}</h3>
                  <div className="flex items-center text-slate-500 text-sm mt-1.5">
                    <User className="h-4 w-4 mr-2" />
                    <span className="font-medium bg-slate-100 px-2 py-1 rounded-md">@{student.username}</span>
                  </div>
                </div>
              </div>
              
              <div className="opacity-0 group-hover:opacity-100 transition-all duration-200">
                <SimpleDropdown
                  items={[
                    {
                      label: 'View Password',
                      onClick: fetchStudentPassword,
                      icon: <Key className="h-4 w-4" />
                    },
                    {
                      label: 'Reset Password',
                      onClick: resetStudentPassword,
                      icon: <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    },
                    {
                      label: 'Remove Student',
                      onClick: () => setShowDeleteDialog(true),
                      icon: <Trash2 className="h-4 w-4" />,
                      variant: 'destructive'
                    }
                  ]}
                />
              </div>
            </div>
            
            {/* Progress and stats */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 font-medium">Learning Progress</span>
                <span className="text-slate-900 font-bold text-lg">{student.progress}%</span>
              </div>
              <div className="w-full bg-slate-200/80 rounded-full h-3 overflow-hidden shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-full transition-all duration-700 ease-out shadow-sm"
                  style={{ width: `${student.progress}%` }}
                ></div>
              </div>
              
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div className="flex items-center text-slate-500 text-sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Joined {formatDate(student.joined_date)}</span>
                </div>
                <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${
                  activityStatus.status === 'Active' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                  activityStatus.status === 'Recent' ? 'bg-teal-100 text-teal-700 border border-teal-200' :
                  activityStatus.status === 'Away' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                  'bg-red-100 text-red-700 border border-red-200'
                }`}>
                  {activityStatus.status}
                </div>
              </div>
            </div>
          </div>
          
          {/* Success/Error messages */}
          {success && (
            <div className="px-6 pb-6">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-emerald-600 mr-3" />
                  <span className="text-emerald-800 text-sm font-medium">{success}</span>
                </div>
              </div>
            </div>
          )}
          
          {error && (
            <div className="px-6 pb-6">
              <Alert className="bg-red-50 border-red-200">
                <AlertDescription className="text-red-800 text-sm">{error}</AlertDescription>
              </Alert>
            </div>
          )}
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