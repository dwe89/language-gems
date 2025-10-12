'use client';

import { useState } from 'react';
import { Download, Eye, FileText } from 'lucide-react';

export default function AQASpanishWorkbookPage() {
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handlePreview = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/workbooks/generate-aqa-spanish?format=html');
      const html = await response.text();
      
      // Create a blob URL for preview
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
      
      // Open in new window
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error previewing workbook:', error);
      alert('Failed to preview workbook');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/workbooks/generate-aqa-spanish?format=pdf');
      
      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'AQA_GCSE_Spanish_Writing_Exam_Kit_Foundation.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download PDF');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-blue-600 p-3 rounded-lg">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                AQA GCSE Spanish Writing Exam Kit
              </h1>
              <p className="text-gray-600">Foundation Tier - 50 Page Workbook</p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold mb-4">Workbook Details</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Exam Board:</span>
                <p className="text-gray-600">AQA 8698/WF</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Level:</span>
                <p className="text-gray-600">Foundation Tier</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Pages:</span>
                <p className="text-gray-600">50 Pages</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Price:</span>
                <p className="text-gray-600">£8.99</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Overview */}
        <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">What's Inside</h2>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Introduction & Exam Strategy</h3>
                <p className="text-gray-600 text-sm">Exam blueprint, mark schemes, tense toolkit, and success acronyms (P.P.O.F. & J.O.E.)</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Question 1 - Photo Card (8 Marks)</h3>
                <p className="text-gray-600 text-sm">Model answers, practice prompts, and strategies for describing images</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Question 2 - 40-Word Response (16 Marks)</h3>
                <p className="text-gray-600 text-sm">Bullet point strategies, grammar focus, and scaffolded practice</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                4
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Question 3 - Translation (10 Marks)</h3>
                <p className="text-gray-600 text-sm">Common errors, translation practice blocks, and mixed tense exercises</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                5
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Question 4 - 90-Word Response (16 Marks)</h3>
                <p className="text-gray-600 text-sm">Advanced planning sheets, model answers, and exam-style practice questions</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-yellow-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                6
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Answer Key & Resources</h3>
                <p className="text-gray-600 text-sm">Complete answer key and QR code for digital resources</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-bold mb-6">Generate Workbook</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={handlePreview}
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-lg transition-colors"
            >
              <Eye className="w-5 h-5" />
              {loading ? 'Generating...' : 'Preview HTML'}
            </button>

            <button
              onClick={handleDownloadPDF}
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-lg transition-colors"
            >
              <Download className="w-5 h-5" />
              {loading ? 'Generating...' : 'Download PDF'}
            </button>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> The workbook is generated using professional Canva-inspired templates
              with color-coded sections, practice pages with writing lines, model answers, and a complete answer key.
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-bold mb-6">Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <div className="text-2xl">🎨</div>
              <div>
                <h3 className="font-semibold">Professional Design</h3>
                <p className="text-sm text-gray-600">Canva-quality layouts with color-coded sections</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="text-2xl">📝</div>
              <div>
                <h3 className="font-semibold">Practice Pages</h3>
                <p className="text-sm text-gray-600">Writing lines optimized for student responses</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="text-2xl">✅</div>
              <div>
                <h3 className="font-semibold">Model Answers</h3>
                <p className="text-sm text-gray-600">Annotated examples with analysis</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="text-2xl">🔑</div>
              <div>
                <h3 className="font-semibold">Complete Answer Key</h3>
                <p className="text-sm text-gray-600">All answers for teacher reference</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

