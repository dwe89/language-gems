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
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2">
          Choose Your School Code
        </label>
        <p className="text-xs text-gray-400 mb-3">
          Students will use this code to login. Pick from suggestions or create your own.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-4">
          <Loader2 className="h-5 w-5 animate-spin text-cyan-400" />
          <span className="ml-2 text-gray-300">Generating suggestions...</span>
        </div>
      ) : (
        <>
          {/* Suggested Codes */}
          {suggestions.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-2">Suggested Codes:</h4>
              <div className="grid grid-cols-1 gap-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.suggestion}
                    type="button"
                    onClick={() => handleSuggestionSelect(suggestion.suggestion)}
                    className={`p-3 rounded-md border text-left transition-colors ${
                      selectedCode === suggestion.suggestion
                        ? 'border-cyan-400 bg-cyan-400/10 text-cyan-400'
                        : 'border-indigo-600 bg-indigo-800/30 text-gray-200 hover:border-cyan-400 hover:bg-cyan-400/5'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold">{suggestion.suggestion}</span>
                      {selectedCode === suggestion.suggestion && (
                        <Check className="h-4 w-4 text-cyan-400" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Custom Code Input */}
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-2">Or Create Your Own:</h4>
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={customCode}
                  onChange={(e) => setCustomCode(e.target.value.toUpperCase())}
                  className="w-full p-3 bg-indigo-800/50 border border-indigo-600 rounded-md text-white font-mono focus:outline-none focus:ring-2 focus:ring-cyan-400"
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
                      <Check className="h-4 w-4 text-green-400" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-400" />
                    )}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={handleCustomCodeSelect}
                disabled={!customCode.trim() || !isCustomCodeAvailable || checkingCustom}
                className="px-4 py-3 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Use This
              </button>
            </div>
            {customCode.trim() && isCustomCodeAvailable === false && (
              <p className="text-xs text-red-400 mt-1">
                This code is already taken. Please try another.
              </p>
            )}
            {customCode.trim() && isCustomCodeAvailable === true && (
              <p className="text-xs text-green-400 mt-1">
                This code is available!
              </p>
            )}
          </div>

          {/* Selected Code Display */}
          {selectedCode && (
            <div className="p-3 bg-green-900/20 border border-green-600 rounded-md">
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-400 mr-2" />
                <span className="text-green-400 text-sm">
                  Selected: <span className="font-mono font-bold">{selectedCode}</span>
                </span>
              </div>
              <p className="text-xs text-green-300 mt-1">
                Students will use this code to login to your school.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
