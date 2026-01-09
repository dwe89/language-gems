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
import { Label } from "../ui/label";
import { Loader2, Copy, CheckCircle, Lightbulb } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
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
        setError('Please enter at least one student name.');
        setIsLoading(false);
        return;
      }

      const students = bulkStudentData
        .split('\n')
        .filter(line => line.trim())
        .map(line => {
          // Replace tabs with spaces before returning
          return { name: line.replace(/\t/g, ' ').trim() };
        });

      let schoolCode = "LG"; // Default fallback

      try {
        const response = await fetch('/api/user/profile');
        if (response.ok) {
          const profileData = await response.json();
          if (profileData.school_code) {
            schoolCode = profileData.school_code;
          }
        }
      } catch (profileError) {
        console.log('Could not fetch profile, using default school code');
      }

      console.log('Sending student data:', { students, classId, schoolCode });

      const response = await fetch('/api/students/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          students,
          classId,
          schoolCode: schoolCode,
        }),
      });

      const data = await response.json();
      console.log('Response from API:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add students.');
      }

      setAddedStudents(data.results || []);

      if (data.errors && data.errors.length > 0) {
        console.error('Student addition errors:', data.errors);
        let errorMsg = `${data.errors.length} student(s) could not be added.`;

        const commonError = data.errors.every((err: { error: string }) =>
          err.error === data.errors[0].error);

        if (commonError && data.errors.length === students.length) {
          errorMsg = `Error: ${data.errors[0].error}`;
        } else {
          const hasAlreadyEnrolledError = data.errors.some((err: { name: string; error: string }) =>
            err.error && err.error.includes('already enrolled')
          );
          const hasDuplicateKeyError = data.errors.some((err: { name: string; error: string }) =>
            err.error && err.error.includes('duplicate key value')
          );
          const hasPermissionError = data.errors.some((err: { name: string; error: string }) =>
            err.error && err.error.includes('not allowed')
          );

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
      setError(error instanceof Error ? error.message : 'An unexpected error occurred while adding students.');
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
      setError('Failed to copy credentials to clipboard. Please copy manually.');
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto bg-white border border-gray-200 text-gray-800 rounded-lg shadow-xl">
        <DialogHeader className="pb-4 border-b border-gray-200">
          <DialogTitle className="text-2xl font-bold text-cyan-700">Add Multiple Students to Class</DialogTitle>
          <DialogDescription className="text-gray-600 text-base mt-1">
            Streamline class setup by adding several students at once. Usernames and secure passwords will be generated automatically.
          </DialogDescription>
        </DialogHeader>

        {addedStudents.length > 0 ? (
          <div className="space-y-6 py-4">
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-xl text-gray-800 flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-green-600" /> Successfully Added Students
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyCredentialsToClipboard}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-300
                    ${credentialsCopied
                      ? 'bg-green-100 text-green-700 border-green-300 hover:bg-green-200'
                      : 'border-cyan-500 text-cyan-600 hover:text-white hover:bg-cyan-600 hover:border-cyan-600'
                    }`}
                >
                  {credentialsCopied ? (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      Credentials Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy All Credentials
                    </>
                  )}
                </Button>
              </div>
              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                {addedStudents.map((student, index) => (
                  <div key={index} className="border border-gray-200 p-4 rounded-md bg-white hover:bg-gray-50 transition-colors duration-200 ease-in-out">
                    <p className="font-bold text-lg text-gray-800 mb-2">{student.name}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-gray-100 p-3 rounded border border-gray-200">
                      <div className="flex flex-col">
                        <span className="text-gray-500 text-sm">Username:</span>
                        <span className="font-mono text-base font-semibold text-cyan-700 break-all">{student.username}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-500 text-sm">Password:</span>
                        <span className="font-mono text-base font-semibold text-cyan-700 break-all">{student.password}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-3">
                      {student.password === '(existing user)'
                        ? 'This student account already exists and was enrolled.'
                        : 'Students should log in with their **USERNAME** (not email) and password at the login screen.'}
                    </p>
                  </div>
                ))}
              </div>

              <Alert className="mt-6 bg-blue-50 border-blue-200 text-blue-700">
                <Lightbulb className="h-5 w-5 mr-3 text-blue-500" />
                <AlertTitle className="text-blue-700 font-semibold mb-1">Important Note</AlertTitle>
                <AlertDescription className="text-sm">
                  These credentials are only shown once for security. **Please save them securely** and distribute them to your students.
                </AlertDescription>
              </Alert>
            </div>

            <Button onClick={onClose} className="w-full bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-700 hover:to-teal-600 text-white font-semibold py-3 rounded-md shadow-lg transition-all duration-300">
              Finish
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-6 py-4">
              <div>
                <Label htmlFor="bulkStudents" className="text-gray-800 text-lg font-medium mb-2 block">
                  Enter Student Names
                </Label>
                <p className="text-sm text-gray-600 mb-3">
                  Type one student name per line. When copying from Excel, tabs will automatically be converted to spaces.
                </p>
                <Textarea
                  id="bulkStudents"
                  placeholder={`Example:
Jane Smith
John Doe
Maria Garcia

From Excel (tabs become spaces):
Alex Johnson
Emily Davis`}
                  rows={10}
                  value={bulkStudentData}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBulkStudentData(e.target.value)}
                  className="font-mono bg-white border-gray-300 placeholder-gray-400 text-gray-800 p-4 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>

              {error && (
                <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-700">
                  <AlertDescription className="font-medium">{error}</AlertDescription>
                </Alert>
              )}
            </div>

            <DialogFooter className="pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
                className="border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-800 transition-colors duration-200"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-700 hover:to-teal-600 text-white font-semibold shadow-md transition-all duration-300"
              >
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