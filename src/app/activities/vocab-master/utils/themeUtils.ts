/**
 * Shared styling utilities for VocabMaster game modes
 * Implements the blue brand palette for consistent theming
 */

export interface ThemeColors {
  primary: string;
  secondary: string;
  muted: string;
  background: string;
  card: string;
}

/**
 * Get theme colors based on adventure mode state
 */
export const getThemeColors = (isAdventureMode: boolean): ThemeColors => {
  if (isAdventureMode) {
    return {
      primary: "text-white",
      secondary: "text-white/80", 
      muted: "text-white/60",
      background: "min-h-screen bg-gradient-to-br from-blue-900 via-indigo-950 to-purple-950",
      card: "bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl p-8 border-2 border-slate-600/30 shadow-2xl"
    };
  }

  return {
    primary: "text-blue-800",
    secondary: "text-blue-600",
    muted: "text-blue-500", 
    background: "min-h-screen bg-gradient-to-br from-blue-50 to-blue-100",
    card: "bg-white rounded-3xl shadow-sm border border-blue-200 p-8"
  };
};

/**
 * Get button styling based on variant and mode
 */
export const getButtonStyles = (
  variant: 'primary' | 'secondary' | 'outline',
  isAdventureMode: boolean,
  disabled: boolean = false
): string => {
  const baseClasses = "py-3 rounded-xl font-semibold transition-all duration-200";
  
  if (disabled) {
    return `${baseClasses} ${
      isAdventureMode 
        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
        : 'bg-blue-200 text-blue-400 cursor-not-allowed'
    }`;
  }

  switch (variant) {
    case 'primary':
      return `${baseClasses} ${
        isAdventureMode
          ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-blue-500/25'
          : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg'
      }`;
    
    case 'secondary':
      return `${baseClasses} ${
        isAdventureMode
          ? 'bg-purple-500 hover:bg-purple-600 text-white shadow-lg hover:shadow-purple-500/25'
          : 'bg-purple-500 hover:bg-purple-600 text-white shadow-lg'
      }`;
    
    case 'outline':
      return `${baseClasses} border ${
        isAdventureMode
          ? 'border-slate-600 text-slate-300 hover:bg-slate-700/50'
          : 'border-blue-500 text-blue-700 hover:bg-blue-100'
      }`;
    
    default:
      return baseClasses;
  }
};

/**
 * Get input field styling
 */
export const getInputStyles = (isAdventureMode: boolean): string => {
  return `w-full p-4 rounded-xl text-lg font-medium transition-all duration-200 ${
    isAdventureMode
      ? 'bg-slate-700/50 text-white placeholder-slate-400 border border-slate-500/30 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20'
      : 'bg-blue-50 text-blue-800 placeholder-blue-400 border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
  }`;
};

/**
 * Get audio button styling
 */
export const getAudioButtonStyles = (
  isAdventureMode: boolean,
  isPlaying: boolean
): string => {
  return `p-4 rounded-full transition-colors border-2 shadow-lg ${
    isPlaying
      ? 'bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300'
      : isAdventureMode
        ? 'bg-blue-500/30 hover:bg-blue-500/40 text-blue-200 border-blue-400/50'
        : 'bg-blue-500 hover:bg-blue-600 text-white border-blue-300'
  }`;
};

/**
 * Get part of speech tag styling
 */
export const getPartOfSpeechStyles = (isAdventureMode: boolean): string => {
  return `inline-block px-3 py-1 rounded-full text-sm ${
    isAdventureMode
      ? 'bg-purple-500/20 text-purple-200 border border-purple-400/30'
      : 'bg-blue-200 text-blue-800 border border-blue-300'
  }`;
};

/**
 * Get progress bar container styling
 */
export const getProgressBarContainerStyles = (): string => {
  return "bg-white rounded-2xl shadow-sm border border-blue-200 p-6";
};

/**
 * Get progress bar styling
 */
export const getProgressBarStyles = (): string => {
  return "bg-blue-100 rounded-full h-3 overflow-hidden";
};

/**
 * Get progress bar fill styling
 */
export const getProgressBarFillStyles = (): string => {
  return "bg-gradient-to-r from-blue-400 to-blue-600 h-full rounded-full transition-all duration-500";
};
