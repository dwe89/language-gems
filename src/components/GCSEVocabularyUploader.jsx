import React, { useState, useRef } from 'react';
import GCSEVocabularyProcessor from '../utils/GCSEVocabularyProcessor';

const GCSEVocabularyUploader = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const processor = useRef(new GCSEVocabularyProcessor());

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setIsProcessing(true);
    setError(null);
    setResults(null);

    try {
      console.log(`Processing ${files.length} CSV files...`);
      const uploadResults = await processor.current.processMultipleCSVs(files);
      setResults(uploadResults);
      console.log('✅ Upload completed successfully!', uploadResults);
    } catch (err) {
      console.error('❌ Upload failed:', err);
      setError(err.message);
    } finally {
      setIsProcessing(false);
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        GCSE Vocabulary Uploader
      </h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select CSV Files (supports multiple files)
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          multiple
          onChange={handleFileUpload}
          disabled={isProcessing}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
        />
        <p className="text-xs text-gray-500 mt-1">
          Select all CSV files at once - the system will automatically deduplicate vocabulary
        </p>
      </div>

      {isProcessing && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            <span className="text-blue-800">Processing vocabulary files...</span>
          </div>
          <p className="text-sm text-blue-600 mt-1">
            This may take a moment for large files. Check the console for detailed progress.
          </p>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-red-800 font-semibold">Upload Error</h3>
          <p className="text-red-600 text-sm mt-1">{error}</p>
          <p className="text-red-500 text-xs mt-2">
            Check the browser console for detailed error information.
          </p>
        </div>
      )}

      {results && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="text-green-800 font-semibold mb-2">✅ Upload Successful!</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-green-700">Unique Words:</span>
              <span className="ml-2 text-green-600">{results.vocabularyCount}</span>
            </div>
            <div>
              <span className="font-medium text-green-700">Assignments:</span>
              <span className="ml-2 text-green-600">{results.assignmentCount}</span>
            </div>
            <div>
              <span className="font-medium text-green-700">Files Processed:</span>
              <span className="ml-2 text-green-600">{results.filesProcessed}</span>
            </div>
            <div>
              <span className="font-medium text-green-700">Languages:</span>
              <span className="ml-2 text-green-600">{results.languages?.join(', ')}</span>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-2">Expected CSV Format:</h3>
        <code className="text-xs text-gray-600 block bg-white p-2 rounded border">
          language,word,translation,word_type,gender,article,display_word,<br/>
          example_sentence_original,example_sentence_translation,frequency_rank,<br/>
          exam_board_code,theme_name,unit_name,tier,is_required
        </code>
        <p className="text-xs text-gray-500 mt-2">
          The system automatically handles deduplication across multiple files and exam boards.
        </p>
      </div>
    </div>
  );
};

export default GCSEVocabularyUploader;
