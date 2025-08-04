'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';



export default function ExamPrepPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to assessments page - middleware will handle routing properly
    router.push('/assessments');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Redirecting to Assessments...</h1>
        <p className="text-indigo-200">You will be redirected to the assessments page shortly.</p>
      </div>
    </div>
  );
}