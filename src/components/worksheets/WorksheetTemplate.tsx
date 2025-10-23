import React from 'react';
import 'server-only';

import { WorksheetContent } from '@/types/worksheet';
import ExerciseRenderer from './ExerciseRenderer';
import ReferenceSection from './ReferenceSection';

interface WorksheetTemplateProps {
  content: WorksheetContent;
}

const WorksheetTemplate: React.FC<WorksheetTemplateProps> = ({ content }) => {
  const Header = () => (
    <div className="lg-header">
      <div className="lg-brand-logo">💎</div>
      <div className="lg-title-block">
        <h1>{content.title?.toUpperCase()}</h1>
        {(content.language || content.level) && (
          <h2>
            {content.language ? `${content.language} Lesson` : ''}
            {content.language && content.level ? ' • ' : ''}
            {content.level ? `${content.level} Level` : ''}
          </h2>
        )}
      </div>
      <div className="lg-info-fields">
        {content.studentInfo?.nameField && (
          <div className="lg-info-item">Name: <span /></div>
        )}
        {content.studentInfo?.classField && (
          <div className="lg-info-item">Class: <span /></div>
        )}
        {content.studentInfo?.dateField && (
          <div className="lg-info-item">Date: <span /></div>
        )}
      </div>
    </div>
  );

  const Footer = () => (
    <div className="lg-footer">
      <div className="lg-footer-content">
        <span className="lg-gem-accent">LanguageGems</span> | Curriculum-Aware AI Generated Worksheet
      </div>
      <div className="lg-page-number">Page <span className="page-num"></span> of <span className="total-pages"></span></div>
    </div>
  );

  const introAndReference = (
    <>
      {content.introductoryExplanation && (
        <div className="lg-intro-section">
          <h3>{content.introductoryExplanation.title}</h3>
          <p>{content.introductoryExplanation.content}</p>
        </div>
      )}
      <ReferenceSection section={content.referenceSection} />
    </>
  );

  const pages: Array<{ key: string; content?: React.ReactNode; exercises: typeof content.exercises } > = [
    { key: 'page-1', content: introAndReference, exercises: content.exercises.slice(0, 2) },
    ...content.exercises.slice(2).map((ex, i) => ({ key: `page-${i + 2}`, exercises: [ex] }))
  ];

  return (
    <>
      {pages.map((pageData, pageIndex) => (
        <div key={pageData.key} className="lg-page">
          <Header />
          <div className="lg-content-area">
            {pageIndex === 0 && pageData.content}
            {pageData.exercises.map((exercise, exIndex) => (
              <div key={exIndex} className="lg-section-wrapper">
                <ExerciseRenderer exercise={exercise} index={content.exercises.indexOf(exercise)} />
              </div>
            ))}
          </div>
          <Footer />
        </div>
      ))}
    </>
  );
};

export default WorksheetTemplate;

