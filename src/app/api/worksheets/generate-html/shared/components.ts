// Reusable HTML components for worksheet generation

export function generateHeader(title: string, subject?: string, topic?: string): string {
  return `
    <div class="header">
      <div class="logo-section">
        <div class="logo-icon"><i data-lucide="gem" class="w-5 h-5"></i></div>
        <div class="logo-text">LanguageGems</div>
      </div>
      <h1 class="worksheet-title">${title}</h1>
      <div class="worksheet-subtitle">${subject || ''}${topic ? ` • ${topic}` : ''}</div>
    </div>
  `;
}

export function generateStudentInfo(): string {
  return `
    <div class="student-info">
      <div class="info-field">
        <div class="info-label">Name</div>
        <div class="info-line"></div>
      </div>
      <div class="info-field">
        <div class="info-label">Class</div>
        <div class="info-line"></div>
      </div>
      <div class="info-field">
        <div class="info-label">Teacher</div>
        <div class="info-line"></div>
      </div>
    </div>
  `;
}

export function generateInstructions(instructions: string): string {
  return `
    <div class="instructions">
      <div class="instructions-title">Instructions</div>
      <div>${instructions}</div>
    </div>
  `;
}

export function generateFooter(): string {
  return `
    <div class="footer">
      <div class="footer-brand">LanguageGems</div>
      <div>Empowering language learners worldwide</div>
    </div>
  `;
}

export function generateScripts(): string {
  return `
    <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
    <script>
      lucide.createIcons();
    </script>
  `;
}

export function generateMultipleChoiceQuestion(
  questionNumber: number,
  questionText: string,
  options: string[]
): string {
  return `
    <div class="question">
      <div class="question-text">
        <strong>${questionNumber}.</strong> ${questionText}
      </div>
      <div class="multiple-choice-options">
        ${options.map((option, index) => `
          <div class="option-item">
            <span class="option-letter">${String.fromCharCode(65 + index)}</span>
            <span class="option-text">${option}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

export function generateTrueFalseQuestion(
  questionNumber: number,
  statement: string
): string {
  return `
    <div class="question">
      <div class="question-text">
        <strong>${questionNumber}.</strong> ${statement}
      </div>
      <div class="checkbox-grid">
        <div></div>
        <div class="checkbox-item">
          <div class="checkbox"></div>
          <span class="checkbox-label">True</span>
        </div>
        <div class="checkbox-item">
          <div class="checkbox"></div>
          <span class="checkbox-label">False</span>
        </div>
      </div>
    </div>
  `;
}

export function generateFillInBlankQuestion(
  questionNumber: number,
  questionText: string
): string {
  return `
    <div class="question">
      <div class="question-text">
        <strong>${questionNumber}.</strong> ${questionText}
      </div>
      <div class="answer-space"></div>
    </div>
  `;
}

export function generateMatchingQuestion(
  questionNumber: number,
  questionText: string,
  items: string[]
): string {
  return `
    <div class="question">
      <div class="question-text">
        <strong>${questionNumber}.</strong> ${questionText}
      </div>
      <div class="matching-section">
        <div class="matching-grid">
          <div class="matching-column">
            <div class="matching-title">Items</div>
            ${items.map((item, index) => `
              <div class="matching-item">
                <span class="matching-text">${item}</span>
                <span class="matching-line"></span>
                <span class="matching-text">${index + 1}</span>
              </div>
            `).join('')}
          </div>
          <div class="matching-column">
            <div class="matching-title">Matches</div>
            <div class="answer-space tall"></div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function generateSection(
  sectionNumber: number,
  title: string,
  content: string,
  instructions?: string
): string {
  return `
    <div class="section">
      <h2 class="section-title">
        <span class="section-number">${sectionNumber}</span>
        ${title}
      </h2>
      ${instructions ? `<p style="font-size: 13px; color: #64748b; margin-bottom: 15px;"><em>${instructions}</em></p>` : ''}
      ${content}
    </div>
  `;
}

export function generateActivitySection(
  activityNumber: number,
  title: string,
  description: string,
  icon: string,
  content: string
): string {
  return `
    <div class="activity-section activity-${activityNumber}">
      <div class="activity-header">
        <div class="activity-icon"><i data-lucide="${icon}" class="w-3.5 h-3.5"></i></div>
        <div>
          <h3 class="activity-title">${title}</h3>
          <div class="activity-description">${description}</div>
        </div>
      </div>
      ${content}
    </div>
  `;
}

export function generateVocabularyGrid(items: Array<{word?: string, definition: string}>): string {
  return `
    <div class="vocabulary-list">
      ${items.map((item, index) => `
        <div class="vocabulary-item">
          <div class="vocab-number">${index + 1}</div>
          <div class="vocab-definition">${item.definition}</div>
          <div class="vocab-line"></div>
        </div>
      `).join('')}
    </div>
  `;
}

export function generateWordHuntGrid(items: Array<{word: string}>): string {
  return `
    <div class="word-hunt-grid">
      ${items.map((item) => `
        <div class="word-hunt-item">
          <div class="word-hunt-label">${item.word}</div>
          <input type="text" class="word-hunt-input">
        </div>
      `).join('')}
    </div>
  `;
}
