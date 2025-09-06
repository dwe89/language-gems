'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, Search, X, CheckCircle, BookOpen } from 'lucide-react';
import { supabaseBrowser } from '../auth/AuthProvider';

interface KS4Theme {
  name: string;
  displayName: string;
  units: KS4Unit[];
}

interface KS4Unit {
  name: string;
  displayName: string;
  themeName: string;
}

interface KS4ThemeUnitSelectorProps {
  language: string; // 'es', 'fr', 'de'
  examBoard: 'AQA' | 'Edexcel';
  selectedThemes: string[];
  selectedUnits: string[];
  onChange: (themes: string[], units: string[]) => void;
  maxSelections?: number;
  showSearch?: boolean;
}

export default function KS4ThemeUnitSelector({
  language,
  examBoard,
  selectedThemes,
  selectedUnits,
  onChange,
  maxSelections = 10,
  showSearch = true
}: KS4ThemeUnitSelectorProps) {
  const [themes, setThemes] = useState<KS4Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedThemes, setExpandedThemes] = useState<Set<string>>(new Set());

  // Load themes and units from database
  useEffect(() => {
    const loadThemesAndUnits = async () => {
      try {
        setLoading(true);
        setError(null);

        const examBoardCode = examBoard === 'AQA' ? 'AQA' : 'edexcel';

        console.log('🔍 [KS4 THEME SELECTOR] Loading themes and units:', {
          language,
          examBoard,
          examBoardCode,
          curriculumLevel: 'KS4'
        });

        const { data, error: queryError } = await supabaseBrowser
          .from('centralized_vocabulary')
          .select('theme_name, unit_name')
          .eq('language', language)
          .eq('curriculum_level', 'KS4')
          .eq('exam_board_code', examBoardCode)
          .not('theme_name', 'is', null)
          .not('unit_name', 'is', null);

        console.log('🔍 [KS4 THEME SELECTOR] Query result:', { data, queryError, dataLength: data?.length });

        if (queryError) {
          throw queryError;
        }

        // Normalize data to canonical structure
        const canonicalThemeMap = new Map<string, Set<string>>();

        if (examBoard === 'AQA') {
          // For AQA, use canonical structure
          const AQA_CANONICAL_THEMES = [
            'Communication and the world around us',
            'People and lifestyle',
            'Popular culture'
          ];

          const AQA_CANONICAL_UNITS = {
            'Communication and the world around us': [
              'Environment and where people live',
              'Media and technology',
              'Travel and tourism'
            ],
            'People and lifestyle': [
              'Education and work',
              'Healthy living and lifestyle',
              'Identity and relationships'
            ],
            'Popular culture': [
              'Celebrity culture',
              'Customs, festivals and celebrations',
              'Free time activities'
            ]
          };

          // Initialize canonical structure
          AQA_CANONICAL_THEMES.forEach(theme => {
            canonicalThemeMap.set(theme, new Set());
          });

          // Map database data to canonical structure
          const normalize = (s: string) => (s || '').toString().toLowerCase().replace(/[\s\-_,.;:()]+/g, ' ').trim();

          data?.forEach(item => {
            const themeNames = item.theme_name.split(';').map((t: string) => t.trim());
            const unitNames = item.unit_name.split(';').map((u: string) => u.trim());

            themeNames.forEach((themeName: string) => {
              // Skip "General" themes as they're not part of canonical structure
              if (themeName === 'General') return;

              // Find matching canonical theme
              const canonicalTheme = AQA_CANONICAL_THEMES.find(canonical =>
                normalize(canonical) === normalize(themeName)
              );

              if (canonicalTheme) {
                unitNames.forEach((unitName: string) => {
                  // Skip "General" units
                  if (unitName === 'General') return;

                  // Find matching canonical unit for this theme
                  const canonicalUnits = AQA_CANONICAL_UNITS[canonicalTheme as keyof typeof AQA_CANONICAL_UNITS];
                  const canonicalUnit = canonicalUnits.find(canonical =>
                    normalize(canonical) === normalize(unitName)
                  );

                  if (canonicalUnit) {
                    canonicalThemeMap.get(canonicalTheme)?.add(canonicalUnit);
                  }
                });
              }
            });
          });

        } else {
          // For Edexcel, use actual database themes and units directly
          if (data && data.length > 0) {
            data.forEach(item => {
              if (!canonicalThemeMap.has(item.theme_name)) {
                canonicalThemeMap.set(item.theme_name, new Set());
              }
              canonicalThemeMap.get(item.theme_name)!.add(item.unit_name);
            });
          }
        }

        console.log('🔍 [KS4 THEME SELECTOR] Final theme map:', {
          examBoard,
          themes: Array.from(canonicalThemeMap.entries()).map(([theme, units]) => ({
            theme,
            units: Array.from(units)
          }))
        });

        // Use canonical structure instead of raw database grouping
        const themeMap = canonicalThemeMap;

        // Helper function to format display names
        const formatDisplayName = (text: string): string => {
          return text
            .replace(/\b\w/g, l => l.toUpperCase())
            .replace(/\s+/g, ' ')
            .trim();
        };

        // Convert to theme structure
        const themesData: KS4Theme[] = Array.from(themeMap.entries()).map(([themeName, unitSet]) => ({
          name: themeName,
          displayName: formatDisplayName(themeName),
          units: Array.from(unitSet).map(unitName => ({
            name: unitName,
            displayName: formatDisplayName(unitName),
            themeName
          }))
        }));

        // Sort themes and units alphabetically
        themesData.sort((a, b) => a.displayName.localeCompare(b.displayName));

        // Sort units within themes alphabetically
        themesData.forEach(theme => {
          theme.units.sort((a, b) => a.displayName.localeCompare(b.displayName));
        });

        console.log('🔍 [KS4 THEME SELECTOR] Final themes data:', {
          themesCount: themesData.length,
          themes: themesData.map(t => ({ name: t.name, unitsCount: t.units.length }))
        });

        setThemes(themesData);
      } catch (err) {
        console.error('Error loading themes and units:', err);
        setError('Failed to load themes and units');
      } finally {
        setLoading(false);
      }
    };

    loadThemesAndUnits();
  }, [language, examBoard]);

  // Filter themes based on search
  const filteredThemes = themes.filter(theme =>
    theme.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    theme.units.some(unit => 
      unit.displayName.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const toggleTheme = (themeName: string) => {
    const newThemes = selectedThemes.includes(themeName)
      ? selectedThemes.filter(name => name !== themeName)
      : [...selectedThemes, themeName];

    // Remove units that belong to deselected themes
    const newUnits = selectedUnits.filter(unitName => {
      const theme = themes.find(t => t.units.some(u => u.name === unitName));
      return theme && newThemes.includes(theme.name);
    });

    onChange(newThemes, newUnits);
  };

  const toggleUnit = (unitName: string) => {
    const newUnits = selectedUnits.includes(unitName)
      ? selectedUnits.filter(name => name !== unitName)
      : [...selectedUnits, unitName];

    onChange(selectedThemes, newUnits);
  };

  const toggleThemeExpansion = (themeName: string) => {
    const newExpanded = new Set(expandedThemes);
    if (newExpanded.has(themeName)) {
      newExpanded.delete(themeName);
    } else {
      newExpanded.add(themeName);
    }
    setExpandedThemes(newExpanded);
  };

  const clearAll = () => {
    onChange([], []);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <span className="ml-3 text-gray-600">Loading {examBoard} content...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  const totalSelections = selectedThemes.length + selectedUnits.length;

  return (
    <div className="space-y-4">
      {/* Header with search and clear */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-5 w-5 text-purple-600" />
          <h5 className="font-semibold text-gray-900">
            {examBoard} Themes & Units
          </h5>
          <span className="text-sm text-gray-500">
            ({totalSelections} selected)
          </span>
        </div>
        
        {totalSelections > 0 && (
          <button
            onClick={clearAll}
            className="text-sm text-purple-600 hover:text-purple-700 flex items-center"
          >
            <X className="h-4 w-4 mr-1" />
            Clear All
          </button>
        )}
      </div>

      {/* Search */}
      {showSearch && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search themes and units..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
      )}

      {/* Selection limit warning */}
      {totalSelections >= maxSelections && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <p className="text-sm text-amber-700">
            You've reached the maximum selection limit of {maxSelections} items.
          </p>
        </div>
      )}

      {/* Themes and Units List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {filteredThemes.map((theme) => (
            <motion.div
              key={theme.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="border border-gray-200 rounded-lg bg-white"
            >
              {/* Theme Header */}
              <div
                className={`p-3 cursor-pointer transition-all duration-200 rounded-t-lg ${
                  selectedThemes.includes(theme.name)
                    ? 'bg-purple-50 border-purple-200'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => toggleThemeExpansion(theme.name)}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      {expandedThemes.has(theme.name) ? (
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-gray-500" />
                      )}
                    </button>
                    
                    <button
                      onClick={() => toggleTheme(theme.name)}
                      className="flex items-center space-x-2 text-left flex-1"
                      disabled={!selectedThemes.includes(theme.name) && totalSelections >= maxSelections}
                    >
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        selectedThemes.includes(theme.name)
                          ? 'bg-purple-600 border-purple-600'
                          : 'border-gray-300'
                      }`}>
                        {selectedThemes.includes(theme.name) && (
                          <CheckCircle className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <span className="font-medium text-gray-900">{theme.displayName}</span>
                    </button>
                  </div>
                  
                  <span className="text-sm text-gray-500">
                    {theme.units.length} units
                  </span>
                </div>
              </div>

              {/* Units */}
              <AnimatePresence>
                {expandedThemes.has(theme.name) && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-3 pt-0 space-y-1 border-t border-gray-100">
                      {theme.units.map((unit) => (
                        <button
                          key={unit.name}
                          onClick={() => toggleUnit(unit.name)}
                          disabled={!selectedUnits.includes(unit.name) && totalSelections >= maxSelections}
                          className={`w-full text-left p-2 rounded flex items-center space-x-2 transition-all duration-200 ${
                            selectedUnits.includes(unit.name)
                              ? 'bg-purple-100 text-purple-900'
                              : 'hover:bg-gray-50'
                          } ${
                            !selectedUnits.includes(unit.name) && totalSelections >= maxSelections
                              ? 'opacity-50 cursor-not-allowed'
                              : ''
                          }`}
                        >
                          <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                            selectedUnits.includes(unit.name)
                              ? 'bg-purple-600 border-purple-600'
                              : 'border-gray-300'
                          }`}>
                            {selectedUnits.includes(unit.name) && (
                              <CheckCircle className="h-2.5 w-2.5 text-white" />
                            )}
                          </div>
                          <span className="text-sm">{unit.displayName}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredThemes.length === 0 && searchTerm && (
          <div className="text-center py-8">
            <p className="text-gray-500">No themes or units found matching "{searchTerm}"</p>
          </div>
        )}
      </div>

      {/* Summary */}
      {totalSelections > 0 && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
          <h6 className="font-medium text-purple-900 mb-2">Selected Content:</h6>
          <div className="space-y-1">
            {selectedThemes.length > 0 && (
              <p className="text-sm text-purple-700">
                <strong>Themes:</strong> {selectedThemes.join(', ')}
              </p>
            )}
            {selectedUnits.length > 0 && (
              <p className="text-sm text-purple-700">
                <strong>Units:</strong> {selectedUnits.join(', ')}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
