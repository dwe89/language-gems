'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AQAReadingFoundationPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to new URL structure
    router.replace('/aqa-reading-test/spanish/foundation');
  }, [router]);

  return (
    // Wrap all JSX elements in a single parent (e.g., a React Fragment or a div)
    <>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4"> {/* Added padding */}
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Redirecting...</h2>
          <p className="text-gray-600">
            Taking you to the updated assessment page.
          </p>
        </div>
      </div>

      {/* Footer Info - now correctly placed within the single parent element */}
      <div className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">About This Assessment</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• Based on AQA GCSE Spanish reading assessment format (Foundation)</p>
                <p>• 9 different question types matching AQA specification</p>
                <p>• Covers all three GCSE themes: People & lifestyle, Popular culture, Communication & world</p>
                <p>• Automatic scoring and detailed feedback</p>
                <p>• 45-minute time limit (as per AQA specification)</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Question Types Included</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p>1. Letter matching (School subjects)</p>
                <p>2. Multiple choice (Tourist information)</p>
                <p>3. Student grid (Free time activities)</p>
                <p>4. Open response (Environmental issues)</p>
                <p>5. Time sequence (Celebrity interview)</p>
                <p>6. Sentence completion (Health advice)</p>
                <p>7. Open response (Holiday preferences)</p>
                <p>8. Headline matching (News stories)</p>
                <p>9. Translation (Spanish to English)</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Assessment Information</h4>
            <p className="text-sm text-blue-800">
              This assessment follows the AQA GCSE Spanish Foundation reading paper format. 
              All content is original and covers the three main themes of the GCSE specification. 
              The assessment includes Section A (Reading Comprehension) and Section B (Translation).
            </p>
          </div>

          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <h4 className="font-semibold text-amber-900 mb-2">Legal Notice</h4>
            <p className="text-sm text-amber-800">
              This is a practice assessment created by Language Gems. While it follows AQA format and style, 
              it is not an official AQA assessment. All content is original and created for educational purposes.
            </p>
          </div>
        </div>
      </div>
    </> // Closing the React Fragment
  );
}
