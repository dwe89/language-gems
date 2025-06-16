import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Alert, AlertDescription } from "../ui/alert";
import { Loader2, UserPlus } from "lucide-react";
import { useAuth } from "../auth/AuthProvider";

export type AddStudentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  classId: string;
  onStudentAdded: (newStudent: {
    id: string;
    name: string;
    username: string;
    progress: number;
    joined_date: string;
  }) => void;
};

export function AddStudentModal({
  isOpen,
  onClose,
  classId,
  onStudentAdded,
}: AddStudentModalProps) {
  const { user } = useAuth();
  const [studentName, setStudentName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!studentName.trim()) {
      setError("Please enter the student's full name (e.g., 'Jane Smith')");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Get teacher's school initials from their profile or use default
      let schoolInitials = "LG"; // Default fallback
      
      if (user) {
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
      }

      const response = await fetch("/api/students/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          students: [{ name: studentName.trim() }],
          classId,
          schoolInitials, // Now included in the request
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add student");
      }

      if (data.results && data.results.length > 0) {
        const s = data.results[0];
        onStudentAdded({
          id: s.userId,
          name: s.name,
          username: s.username,
          progress: 0,
          joined_date: new Date().toISOString(),
        });
        
        // Reset form
        setStudentName("");
        onClose();
      }
    } catch (err: any) {
      console.error("Error adding student:", err);
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-sm border border-slate-200/60 text-slate-900 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-slate-900 flex items-center gap-2 text-xl font-bold">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
              <UserPlus className="h-4 w-4 text-white" />
            </div>
            Add Student
          </DialogTitle>
          <DialogDescription className="text-slate-600 leading-relaxed">
            Enter the student's full name. A unique username and password will be
            created automatically.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="Jane Smith"
            className="bg-white border-slate-300 placeholder-slate-400 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />

          {error && (
            <Alert variant="destructive" className="bg-red-50 border-red-200">
              <AlertDescription className="text-red-700">{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="gap-3">
          <Button
            variant="outline"
            disabled={isLoading}
            onClick={onClose}
            className="border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Add Student
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 