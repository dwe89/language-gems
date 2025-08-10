'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { 
  Checkbox 
} from "../ui/checkbox";
import { Label } from "../ui/label";
import { Loader2, Copy, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";
import { useAuth } from "../auth/AuthProvider";

type Student = {
  name: string;
  username: string;
  password: string;
  userId: string;
};

type BulkAddStudentsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  classId: string;
  onStudentsAdded: (newStudents: any[]) => void;
};

export function BulkAddStudentsModal({
  isOpen,
  onClose,
  classId,
  onStudentsAdded
}: BulkAddStudentsModalProps) {
  const { user } = useAuth();
  const [bulkStudentData, setBulkStudentData] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [addedStudents, setAddedStudents] = useState<Student[]>([]);
  const [credentialsCopied, setCredentialsCopied] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');
    setAddedStudents([]);

    try {
      if (!bulkStudentData.trim()) {
        setError('Please enter at least one student name');
        setIsLoading(false);
        return;
      }

      const students = bulkStudentData
        .split('\n')
        .filter(line => line.trim())
        .map(line => {
          return { name: line.trim() };
        });

      // Get teacher's school initials from their profile or use default
      let schoolInitials = "LG"; // Default fallback

      try {
        const response = await fetch('/api/user/profile');
        if (response.ok) {
          const profileData = await response.json();
          if (profileData.school_initials) {
            schoolInitials = profileData.school_initials;
          }
        }
      } catch (profileError) {
        console.log('Could not fetch profile, using default school initials');
      }

      console.log('Sending student data:', { students, classId, schoolInitials });

      const response = await fetch('/api/students/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          students,
          classId,
          schoolInitials, // Now included in the request
        }),
      });
      
      const data = await response.json();
      console.log('Response from API:', data);
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to add students');
      }
      
      setAddedStudents(data.results || []);
      
      if (data.errors && data.errors.length > 0) {
        console.error('Student addition errors:', data.errors);
        let errorMsg = `${data.errors.length} students could not be added.`;
        
        // Check if all students had the same error
        const commonError = data.errors.every((err: { error: string}) => 
          err.error === data.errors[0].error);
          
        if (commonError && data.errors.length === students.length) {
          // If all students have the same error, show that specific error
          errorMsg = `Error: ${data.errors[0].error}`;
        } else {
          // Categorize errors
          const hasAlreadyEnrolledError = data.errors.some((err: { name: string; error: string }) => 
            err.error && err.error.includes('already enrolled')
          );
          
          const hasDuplicateKeyError = data.errors.some((err: { name: string; error: string }) => 
            err.error && err.error.includes('duplicate key value')
          );
          
          const hasPermissionError = data.errors.some((err: { name: string; error: string }) => 
            err.error && err.error.includes('not allowed')
          );
          
          // Add more specific error messages
          if (hasAlreadyEnrolledError) {
            errorMsg += ' Some students are already enrolled in this class.';
          }
          
          if (hasDuplicateKeyError) {
            errorMsg += ' Some students already exist in the system.';
          }
          
          if (hasPermissionError) {
            errorMsg += ' Permission error: Admin rights may be required for some operations.';
          }
          
          if (!hasAlreadyEnrolledError && !hasDuplicateKeyError && !hasPermissionError) {
            errorMsg += ' Please check the information and try again.';
          }
        }
        
        setError(errorMsg);
      }
      
      if (data.results.length > 0) {
        onStudentsAdded(data.results.map((student: Student) => ({
          id: student.userId,
          name: student.name,
          username: student.username,
          joined_date: new Date().toISOString(),
          last_active: new Date().toISOString()
        })));
      }
    } catch (error) {
      console.error('Error adding students:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while adding students');
    } finally {
      setIsLoading(false);
    }
  };
  
  const copyCredentialsToClipboard = () => {
    if (addedStudents.length === 0) return;
    
    const credentialText = addedStudents.map(student => 
      `${student.name}: Username: ${student.username}, Password: ${student.password}`
    ).join('\n');
    
    navigator.clipboard.writeText(credentialText).then(() => {
      setCredentialsCopied(true);
      setTimeout(() => setCredentialsCopied(false), 3000);
    }).catch(err => {
      console.error('Could not copy credentials:', err);
      setError('Could not copy credentials to clipboard');
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-gray-800 border border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Add Multiple Students</DialogTitle>
          <DialogDescription className="text-gray-300">
            Enter student names below to add them to your class. Usernames and passwords will be generated automatically. 
            Students with the same name will get unique usernames.
          </DialogDescription>
        </DialogHeader>
        
        {addedStudents.length > 0 ? (
          <div className="space-y-4">
            <div className="bg-gray-900 p-4 rounded-md border border-gray-700">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-white">Student Credentials</h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={copyCredentialsToClipboard}
                  className="flex items-center gap-1 border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700"
                >
                  {credentialsCopied ? (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy All
                    </>
                  )}
                </Button>
              </div>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {addedStudents.map((student, index) => (
                  <div key={index} className="border border-gray-700 p-3 rounded-md bg-gray-800 hover:bg-gray-750 transition-colors">
                    <p className="font-medium text-white">{student.name}</p>
                    <div className="mt-1 p-2 bg-gray-900 rounded border border-gray-700">
                      <p className="flex justify-between items-center">
                        <span className="text-gray-400">Username:</span> 
                        <span className="font-mono font-medium text-cyan-300">{student.username}</span>
                      </p>
                      <p className="flex justify-between items-center mt-1">
                        <span className="text-gray-400">Password:</span> 
                        <span className="font-mono font-medium text-cyan-300">{student.password}</span>
                      </p>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      {student.password === '(existing user)' 
                        ? 'This student account already exists.' 
                        : 'Students should log in with their USERNAME (not email) and password at the login screen.'}
                    </p>
                  </div>
                ))}
              </div>
              
              <Alert className="mt-4 bg-yellow-900/30 border-yellow-700/50">
                <AlertDescription className="text-yellow-300 text-sm">
                  <strong>Important:</strong> These credentials are only shown once. Make sure to save them securely and distribute them to your students.
                  Students will use their USERNAME to log in, not their email address.
                </AlertDescription>
              </Alert>
            </div>
            
            <Button onClick={onClose} className="w-full bg-cyan-600 hover:bg-cyan-700">Done</Button>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <div>
                <Label htmlFor="bulkStudents" className="text-white">
                  Enter one student per line
                </Label>
                <p className="text-sm text-gray-300 mb-2">
                  Just enter student names (e.g., "John Smith")
                </p>
                <Textarea
                  id="bulkStudents"
                  placeholder="Jane Smith
John Doe
Maria Garcia"
                  rows={8}
                  value={bulkStudentData}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBulkStudentData(e.target.value)}
                  className="font-mono bg-gray-700 border-gray-600 placeholder-gray-400 text-white"
                />
              </div>
              
              {error && (
                <Alert variant="destructive" className="bg-red-900/30 border-red-800/40">
                  <AlertDescription className="text-red-300">{error}</AlertDescription>
                </Alert>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={onClose} disabled={isLoading} className="border-gray-600 text-white hover:bg-gray-700">
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isLoading} className="bg-cyan-600 hover:bg-cyan-700">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Students
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
} 