'use client';

type ThemeOption = {
  id: string;
  name: string;
  icon: string;
  accentColor: string;
};

type ThemeSelectorProps = {
  selectedTheme: string;
  onThemeChange: (themeId: string) => void;
};

const themes: ThemeOption[] = [
  {
    id: 'default',
    name: 'Classic',
    icon: '🎮',
    accentColor: 'bg-blue-500'
  },
  {
    id: 'tokyo',
    name: 'Tokyo Nights',
    icon: '🏙️',
    accentColor: 'bg-pink-600'
  },
  {
    id: 'pirate',
    name: 'Pirate Adventure',
    icon: '🏴‍☠️',
    accentColor: 'bg-amber-600'
  },
  {
    id: 'space',
    name: 'Space Explorer',
    icon: '🚀',
    accentColor: 'bg-purple-600'
  },
  {
    id: 'temple',
    name: 'Lava Temple',
    icon: '🌋',
    accentColor: 'bg-orange-600'
  }
];

export default function ThemeSelector({ selectedTheme, onThemeChange }: ThemeSelectorProps) {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-500 mb-2">Game Theme</h3>
      <div className="flex flex-wrap gap-2 justify-center">
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => onThemeChange(theme.id)}
            className={`
              px-3 py-2 rounded-lg flex items-center gap-2 transition-all
              ${selectedTheme === theme.id 
                ? `${theme.accentColor} text-white shadow-md ring-2 ring-offset-2 ring-${theme.accentColor.replace('bg-', '')}`
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
              }
            `}
          >
            <span>{theme.icon}</span>
            <span className="text-sm font-medium">{theme.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
} 