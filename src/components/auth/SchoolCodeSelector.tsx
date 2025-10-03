import React, { useState, useEffect } from 'react';
import { Check, Loader2, AlertCircle } from 'lucide-react';

interface SchoolCodeSelectorProps {
  schoolName: string;
  onCodeSelect: (code: string) => void;
  selectedCode?: string;
}

interface Suggestion {
  suggestion: string;
  is_available: boolean;
}

export default function SchoolCodeSelector({ schoolName, onCodeSelect, selectedCode }: SchoolCodeSelectorProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [customCode, setCustomCode] = useState('');
  const [isCustomCodeAvailable, setIsCustomCodeAvailable] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingCustom, setCheckingCustom] = useState(false);

  // Generate suggestions when school name changes
  useEffect(() => {
    if (!schoolName.trim()) {
      setSuggestions([]);
      return;
    }

    const generateSuggestions = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/school-codes/suggestions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ schoolName }),
        });

        const data = await response.json();
        if (data.success) {
          setSuggestions(data.suggestions || []);
          // Auto-select first available suggestion if none selected
          if (!selectedCode && data.suggestions?.length > 0) {
            onCodeSelect(data.suggestions[0].suggestion);
          }
        }
      } catch (error) {
        console.error('Error generating suggestions:', error);
      } finally {
        setLoading(false);
      }
    };

    generateSuggestions();
  }, [schoolName]);

  // Check custom code availability
  useEffect(() => {
    if (!customCode.trim() || customCode.length < 2) {
      setIsCustomCodeAvailable(null);
      return;
    }

    const checkAvailability = async () => {
      setCheckingCustom(true);
      try {
        const response = await fetch(`/api/school-codes/suggestions?code=${encodeURIComponent(customCode)}`);
        const data = await response.json();
        setIsCustomCodeAvailable(data.available);
      } catch (error) {
        console.error('Error checking code availability:', error);
        setIsCustomCodeAvailable(null);
      } finally {
        setCheckingCustom(false);
      }
    };

    const timeoutId = setTimeout(checkAvailability, 500);
    return () => clearTimeout(timeoutId);
  }, [customCode]);

  const handleSuggestionSelect = (code: string) => {
    onCodeSelect(code);
    setCustomCode(''); // Clear custom input when selecting suggestion
  };

  const handleCustomCodeSelect = () => {
    if (customCode.trim() && isCustomCodeAvailable) {
      onCodeSelect(customCode.toUpperCase());
    }
  };

  if (!schoolName.trim()) {
    return null;
  }

  return (
    <div className="space-y-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1">
          Choose Your School Code
        </label>
        <p className="text-xs text-gray-600">
          Students will use this code to login. Pick from suggestions or create your own.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-3">
          <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-700 text-sm">Generating suggestions...</span>
        </div>
      ) : (
        <>
          {/* Suggested Codes */}
          {suggestions.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Suggested Codes:</h4>
              <div className="grid grid-cols-1 gap-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.suggestion}
                    type="button"
                    onClick={() => handleSuggestionSelect(suggestion.suggestion)}
                    className={`p-2.5 rounded-lg border text-left transition-all text-sm ${
                      selectedCode === suggestion.suggestion
                        ? 'border-blue-600 bg-blue-100 text-blue-900 shadow-sm'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-blue-400 hover:bg-blue-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold">{suggestion.suggestion}</span>
                      {selectedCode === suggestion.suggestion && (
                        <Check className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Custom Code Input */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Or Create Your Own:</h4>
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={customCode}
                  onChange={(e) => setCustomCode(e.target.value.toUpperCase())}
                  className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="MYSCHOOL2024"
                  maxLength={12}
                />
                {checkingCustom && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                  </div>
                )}
                {!checkingCustom && customCode.trim() && isCustomCodeAvailable !== null && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {isCustomCodeAvailable ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={handleCustomCodeSelect}
                disabled={!customCode.trim() || !isCustomCodeAvailable || checkingCustom}
                className="px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Use This
              </button>
            </div>
            {customCode.trim() && isCustomCodeAvailable === false && (
              <p className="text-xs text-red-600 mt-1.5">
                This code is already taken. Please try another.
              </p>
            )}
            {customCode.trim() && isCustomCodeAvailable === true && (
              <p className="text-xs text-green-600 mt-1.5">
                This code is available!
              </p>
            )}
          </div>

          {/* Selected Code Display */}
          {selectedCode && (
            <div className="p-3 bg-green-50 border border-green-300 rounded-lg">
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                <span className="text-green-800 text-sm">
                  Selected: <span className="font-mono font-bold">{selectedCode}</span>
                </span>
              </div>
              <p className="text-xs text-green-700 mt-1">
                Students will use this code to login to your school.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
