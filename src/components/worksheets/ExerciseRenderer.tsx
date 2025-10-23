import React from 'react';
import 'server-only';

import { Exercise, Question } from '@/types/worksheet';

interface Props {
  exercise: Exercise;
  index: number; // overall index in worksheet (0-based)
}

function renderQuestion(ex: Exercise, q: Question, i: number) {
  const num = i + 1;
  const numberEl = <span className="lg-question-number">{num}.</span>;

  if (ex.type === 'multiple_choice') {
    const opts = q.options?.join(' / ') ?? '';
    return (
      <div className="lg-question-item" key={i}>
        {numberEl}
        <span>
          {q.sentence || ''} {opts && <em>({opts})</em>}
        </span>
      </div>
    );
  }

  if (ex.type === 'error_correction') {
    const text = q.incorrect || q.original || q.error || q.sentence || q.text || '';
    return (
      <div className="lg-question-item" key={i}>
        {numberEl}
        <span>
          {text} <span className="lg-blank" />
        </span>
      </div>
    );
  }

  if (ex.type === 'word_order') {
    const text = q.scrambled || q.sentence || '';
    return (
      <div className="lg-question-item" key={i}>
        {numberEl}
        <span>
          {text} <span className="lg-blank" />
        </span>
      </div>
    );
  }

  if (ex.type === 'translation' || ex.type.includes('translation')) {
    const base = q.english || q.sentence || q.spanish || '';
    return (
      <div className="lg-question-item" key={i}>
        {numberEl}
        <span>
          {base} <span className="lg-blank" />
        </span>
      </div>
    );
  }

  // default: fill_in_blanks or others
  const sentence = (q.sentence || '').replace(/\[.*?\]/g, '<span class="lg-blank"></span>');
  return (
    <div className="lg-question-item" key={i}>
      {numberEl}
      {/* eslint-disable-next-line react/no-danger */}
      <span dangerouslySetInnerHTML={{ __html: sentence }} />
    </div>
  );
}

const ExerciseRenderer: React.FC<Props> = ({ exercise, index }) => {
  // Special rendering for translation_both_ways
  if (exercise.type === 'translation_both_ways') {
    const leftItems = exercise.questions[0]?.items ?? [];
    const rightItems = exercise.questions[1]?.items ?? [];

    return (
      <div>
        <div className="lg-exercise-header">
          <div className="lg-exercise-number">{index + 1}</div>
          <h3>{exercise.title}</h3>
        </div>
        <div className="lg-instructions">{exercise.instructions}</div>
        <div className="lg-question-grid">
          <div>
            {leftItems.slice(0, 10).map((q, i) => (
              <div className="lg-question-item" key={`L-${i}`}>
                <span className="lg-question-number">{i + 1}.</span>
                <span>{q.spanish || q.sentence || ''} <span className="lg-blank" /></span>
              </div>
            ))}
          </div>
          <div>
            {rightItems.slice(0, 10).map((q, i) => (
              <div className="lg-question-item" key={`R-${i}`}>
                <span className="lg-question-number">{i + 1}.</span>
                <span>{q.english || q.sentence || ''} <span className="lg-blank" /></span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Normal rendering
  return (
    <div>
      <div className="lg-exercise-header">
        <div className="lg-exercise-number">{index + 1}</div>
        <h3>{exercise.title}</h3>
      </div>
      <div className="lg-instructions">{exercise.instructions}</div>
      <div className="lg-question-grid">
        {exercise.questions.map((q, i) => renderQuestion(exercise, q, i))}
      </div>
    </div>
  );
};

export default ExerciseRenderer;

