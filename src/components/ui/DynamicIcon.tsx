import React from 'react';
import * as LucideIcons from 'lucide-react';

interface DynamicIconProps {
  name: string;
  className?: string;
  size?: number;
}

const DynamicIcon: React.FC<DynamicIconProps> = ({ name, className = '', size = 24 }) => {
  // Convert the icon name to PascalCase (Lucide uses PascalCase)
  const pascalCaseName = name
    .split(/[-_\s]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');

  // Get the icon component from lucide-react
  const IconComponent = (LucideIcons as any)[pascalCaseName];

  if (!IconComponent) {
    // Fallback to a default icon if the specified icon doesn't exist
    const DefaultIcon = LucideIcons.Book;
    return <DefaultIcon className={className} size={size} />;
  }

  return <IconComponent className={className} size={size} />;
};

export default DynamicIcon;
