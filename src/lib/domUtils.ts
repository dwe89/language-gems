/**
 * Utility functions for safe DOM manipulation
 */

/**
 * Safely downloads a file by creating a temporary anchor element
 * This prevents DOM manipulation errors by ensuring proper cleanup
 */
export function downloadFile(url: string, filename: string): void {
  try {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none'; // Hide the element
    
    // Add to DOM, trigger download, then cleanup
    document.body.appendChild(link);
    link.click();
    
    // Use setTimeout to ensure the click event has been processed
    setTimeout(() => {
      try {
        if (link.parentNode === document.body) {
          document.body.removeChild(link);
        }
      } catch (error) {
        console.warn('Failed to remove download link from DOM:', error);
      }
    }, 100);
    
  } catch (error) {
    console.error('Error downloading file:', error);
    throw error;
  }
}

/**
 * Safely removes a DOM element, checking if it exists and has the expected parent
 */
export function safeRemoveElement(element: HTMLElement, parent?: HTMLElement): boolean {
  try {
    const parentElement = parent || element.parentNode;
    if (parentElement && parentElement.contains(element)) {
      parentElement.removeChild(element);
      return true;
    }
    return false;
  } catch (error) {
    console.warn('Failed to remove element from DOM:', error);
    return false;
  }
}

/**
 * Creates a temporary DOM element, executes a callback, then safely removes it
 */
export function withTempElement<T>(
  tagName: string,
  parent: HTMLElement,
  callback: (element: HTMLElement) => T
): T {
  const element = document.createElement(tagName);
  parent.appendChild(element);
  
  try {
    return callback(element);
  } finally {
    safeRemoveElement(element, parent);
  }
}
