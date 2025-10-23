import React from 'react';
import 'server-only';

import { ReferenceSection as Ref, EndingPattern, ConjugationTable } from '@/types/worksheet';

interface Props {
  section?: Ref;
}

const ReferenceSection: React.FC<Props> = ({ section }) => {
  if (!section) return null;

  const hasContent = Boolean(section.content);
  const hasPatterns = section.endingPatterns && section.endingPatterns.length > 0;
  const hasTables = section.conjugationTables && section.conjugationTables.length > 0;

  return (
    <div className="lg-intro-section">
      <h3>{section.title}</h3>
      {hasContent && <p>{section.content}</p>}

      {hasPatterns && (
        <div style={{ marginTop: 12 }}>
          {section.endingPatterns!.map((p: EndingPattern, i) => (
            <div key={i} style={{ marginBottom: 6 }}>
              <strong>{p.type.toUpperCase()}:</strong> {p.endings.join(', ')}
            </div>
          ))}
        </div>
      )}

      {hasTables && (
        <div style={{ marginTop: 12 }}>
          {section.conjugationTables!.map((t: ConjugationTable, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <strong>{t.verb.toUpperCase()}</strong> ({t.english})
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReferenceSection;

