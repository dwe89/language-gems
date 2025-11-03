import { getBaseStyles } from '../shared/base-styles';

export function generateWorksheetHTML(worksheet: any, options: any = {}): string {
  console.log('[STANDARD GENERATOR] Generating standard worksheet HTML for:', worksheet.title);

  const { title, subject, topic, difficulty, content, estimated_time_minutes } = worksheet;

  // Extract sections from content - handle both direct sections and nested content
  const sections = content?.sections || worksheet.sections || [];
  const instructions = content?.instructions || worksheet.instructions || 'Complete all activities below.';

  console.log('[STANDARD GENERATOR] Found sections:', sections.length);

  if (sections.length === 0) {
  console.log('[STANDARD GENERATOR] No sections found, creating fallback HTML');
    return createFallbackHTML(worksheet);
  }

  let html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        ${getBaseStyles()}
    </style>
</head>
<body>
    <div class="header">
        <div class="title">${title}</div>
        <div class="subtitle">${subject} • ${topic}</div>
        <div class="meta-info">
            <span>Difficulty: <strong>${difficulty}</strong></span>
            <span>Time: <strong>${estimated_time_minutes || 30} minutes</strong></span>
            <span>Date: <strong>_____________</strong></span>
        </div>
    </div>

    <div class="instructions">
        <strong>Instructions:</strong> ${instructions}
    </div>
`;

  // Generate sections
  sections.forEach((section: any, index: number) => {
    html += generateSection(section, index);
  });

  html += `
</body>
</html>`;

  return html;
}

function generateSection(section: any, index: number): string {
  const sectionTitle = section.title || `Section ${index + 1}`;
  
  let sectionHTML = `
    <div class="section">
        <div class="section-title">${sectionTitle}</div>
`;

  if (section.content) {
    sectionHTML += `
        <div class="section-content">
            ${section.content}
        </div>
`;
  }

  if (section.questions && section.questions.length > 0) {
    section.questions.forEach((question: any, qIndex: number) => {
      sectionHTML += generateQuestion(question, qIndex);
    });
  }

  sectionHTML += `
    </div>
`;

  return sectionHTML;
}

function generateQuestion(question: any, index: number): string {
  let questionHTML = `
    <div class="question">
        <div class="question-number">Question ${index + 1}</div>
        <div class="question-text">${question.text || question.question}</div>
`;

  // Handle different question types
  if (question.type === 'multiple_choice' && question.options) {
    questionHTML += `
        <ul class="options">
`;
    question.options.forEach((option: any, optIndex: number) => {
      const optionLetter = String.fromCharCode(65 + optIndex); // A, B, C, D...
      questionHTML += `
            <li>
                <input type="checkbox" id="q${index}_${optionLetter}" name="q${index}" value="${optionLetter}">
                <label for="q${index}_${optionLetter}">${optionLetter}. ${option.text || option}</label>
            </li>
`;
    });
    questionHTML += `
        </ul>
`;
  } else if (question.type === 'true_false') {
    questionHTML += `
        <div class="tf-options">
            <input type="checkbox" id="tf_${index}_true" name="tf_${index}" value="true">
            <label for="tf_${index}_true">True</label>
            <input type="checkbox" id="tf_${index}_false" name="tf_${index}" value="false">
            <label for="tf_${index}_false">False</label>
        </div>
`;
  } else {
    // Default to open-ended question with answer space
    questionHTML += `
        <div class="answer-space"></div>
`;
  }

  questionHTML += `
    </div>
`;

  return questionHTML;
}

function createFallbackHTML(worksheet: any): string {
  const { title, subject, topic, difficulty, estimated_time_minutes } = worksheet;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        ${getBaseStyles()}
    </style>
</head>
<body>
    <div class="header">
        <div class="title">${title}</div>
        <div class="subtitle">${subject} • ${topic}</div>
        <div class="meta-info">
            <span>Difficulty: <strong>${difficulty}</strong></span>
            <span>Time: <strong>${estimated_time_minutes || 30} minutes</strong></span>
            <span>Date: <strong>_____________</strong></span>
        </div>
    </div>

    <div class="instructions">
        <strong>Instructions:</strong> Complete all activities below.
    </div>

    <div class="section">
        <div class="section-title">Worksheet Content</div>
        <p><em>This worksheet is being generated. Please refresh the page in a moment.</em></p>
    </div>
</body>
</html>`;
}
