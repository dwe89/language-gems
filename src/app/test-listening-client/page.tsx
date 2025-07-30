'use client';

import React, { useState, useEffect } from 'react';
import { AQAListeningAssessmentService } from '../../services/aqaListeningAssessmentService';

export default function TestListeningClient() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testService = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Testing client-side service...');
      const service = new AQAListeningAssessmentService();
      
      console.log('Service created, testing getAssessmentsByLevel...');
      const assessments = await service.getAssessmentsByLevel('foundation', 'es');
      console.log('Assessments result:', assessments);
      
      console.log('Testing getAssessmentByLevel...');
      const assessment = await service.getAssessmentByLevel('foundation', 'es', 'paper-1');
      console.log('Single assessment result:', assessment);
      
      let questions = null;
      if (assessment) {
        console.log('Testing getAssessmentQuestions...');
        questions = await service.getAssessmentQuestions(assessment.id);
        console.log('Questions result:', questions);
      }
      
      setResult({
        assessments,
        assessment,
        questions,
        questionsCount: questions?.length || 0
      });
      
    } catch (err) {
      console.error('Client-side service error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testService();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Client-Side Listening Service Test</h1>
      
      <div className="mb-4">
        <button 
          onClick={testService}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Service'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded">
          <h3 className="font-semibold text-red-900">Error:</h3>
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded">
            <h3 className="font-semibold text-green-900">Success!</h3>
            <p className="text-green-800">Service is working on client-side</p>
          </div>

          <div className="p-4 bg-gray-50 border border-gray-200 rounded">
            <h3 className="font-semibold mb-2">Assessments Found:</h3>
            <p>Count: {result.assessments?.length || 0}</p>
            {result.assessments?.length > 0 && (
              <pre className="text-xs mt-2 overflow-auto">
                {JSON.stringify(result.assessments[0], null, 2)}
              </pre>
            )}
          </div>

          <div className="p-4 bg-gray-50 border border-gray-200 rounded">
            <h3 className="font-semibold mb-2">Single Assessment:</h3>
            <p>Found: {result.assessment ? 'Yes' : 'No'}</p>
            {result.assessment && (
              <div className="text-sm mt-2">
                <p>ID: {result.assessment.id}</p>
                <p>Title: {result.assessment.title}</p>
                <p>Level: {result.assessment.level}</p>
                <p>Language: {result.assessment.language}</p>
              </div>
            )}
          </div>

          <div className="p-4 bg-gray-50 border border-gray-200 rounded">
            <h3 className="font-semibold mb-2">Questions:</h3>
            <p>Count: {result.questionsCount}</p>
            {result.questions?.length > 0 && (
              <div className="text-sm mt-2">
                <p>First question: {result.questions[0].title}</p>
                <p>Question type: {result.questions[0].question_type}</p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded">
        <h3 className="font-semibold text-blue-900 mb-2">Instructions:</h3>
        <p className="text-blue-800 text-sm">
          This page tests the client-side AQA Listening Assessment Service. 
          Check the browser console for detailed logs and any errors.
        </p>
      </div>
    </div>
  );
}
