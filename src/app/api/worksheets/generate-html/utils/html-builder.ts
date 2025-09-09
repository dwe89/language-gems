// HTML building utilities for worksheet generation

import { getBaseStyles } from '../shared/base-styles';

export interface HTMLDocumentOptions {
  title: string;
  additionalStyles?: string;
  additionalHead?: string;
}

export function createHTMLDocument(
  options: HTMLDocumentOptions,
  bodyContent: string
): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${options.title} - LanguageGems</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://unpkg.com/lucide@latest/dist/umd/lucide.css">
    <style>
        ${getBaseStyles()}
        ${options.additionalStyles || ''}
    </style>
    ${options.additionalHead || ''}
</head>
<body>
    <div class="page">
        ${bodyContent}
    </div>
    <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
    <script>
        lucide.createIcons();
    </script>
</body>
</html>`;
}

export function wrapInContainer(content: string, className?: string): string {
  return `<div class="${className || 'container'}">${content}</div>`;
}

export function createGrid(items: string[], columns: number = 2): string {
  const gridClass = `grid-cols-${columns}`;
  return `
    <div class="grid ${gridClass} gap-4">
      ${items.map(item => `<div class="grid-item">${item}</div>`).join('')}
    </div>
  `;
}

export function createList(items: string[], ordered: boolean = false): string {
  const tag = ordered ? 'ol' : 'ul';
  return `
    <${tag} class="list">
      ${items.map(item => `<li class="list-item">${item}</li>`).join('')}
    </${tag}>
  `;
}

export function createTable(
  headers: string[],
  rows: string[][],
  className?: string
): string {
  return `
    <table class="table ${className || ''}">
      <thead>
        <tr>
          ${headers.map(header => `<th class="table-header">${header}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
        ${rows.map(row => `
          <tr>
            ${row.map(cell => `<td class="table-cell">${cell}</td>`).join('')}
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

export function createCard(title: string, content: string, className?: string): string {
  return `
    <div class="card ${className || ''}">
      <div class="card-header">
        <h3 class="card-title">${title}</h3>
      </div>
      <div class="card-content">
        ${content}
      </div>
    </div>
  `;
}

export function createInputField(
  type: 'text' | 'textarea' | 'select',
  placeholder?: string,
  options?: string[]
): string {
  switch (type) {
    case 'text':
      return `<input type="text" class="input-field" placeholder="${placeholder || ''}" />`;
    case 'textarea':
      return `<textarea class="textarea-field" placeholder="${placeholder || ''}"></textarea>`;
    case 'select':
      return `
        <select class="select-field">
          ${options?.map(option => `<option value="${option}">${option}</option>`).join('') || ''}
        </select>
      `;
    default:
      return '';
  }
}

export function createButton(text: string, className?: string): string {
  return `<button class="button ${className || ''}">${text}</button>`;
}

export function createIcon(iconName: string, size?: string): string {
  const sizeClass = size ? `w-${size} h-${size}` : 'w-4 h-4';
  return `<i data-lucide="${iconName}" class="${sizeClass}"></i>`;
}

export function createBadge(text: string, variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error'): string {
  const variantClass = variant ? `badge-${variant}` : 'badge-primary';
  return `<span class="badge ${variantClass}">${text}</span>`;
}

export function createProgressBar(percentage: number): string {
  return `
    <div class="progress-bar">
      <div class="progress-fill" style="width: ${percentage}%"></div>
    </div>
  `;
}

export function createAlert(message: string, type?: 'info' | 'success' | 'warning' | 'error'): string {
  const typeClass = type ? `alert-${type}` : 'alert-info';
  return `
    <div class="alert ${typeClass}">
      ${message}
    </div>
  `;
}

export function sanitizeHTML(html: string): string {
  // Basic HTML sanitization - in production, use a proper library like DOMPurify
  return html
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

export function escapeHTML(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function joinWithSeparator(items: string[], separator: string = ' '): string {
  return items.filter(Boolean).join(separator);
}

export function conditionalWrap(
  content: string,
  condition: boolean,
  wrapper: (content: string) => string
): string {
  return condition ? wrapper(content) : content;
}
