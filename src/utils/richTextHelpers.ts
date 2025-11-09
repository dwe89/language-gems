export const hasRichTextFormatting = (input: string | undefined | null): boolean => {
  if (!input) {
    return false;
  }
  return /<\/?[a-z][\s\S]*>/i.test(input);
};

export const stripHtmlTags = (input: string | undefined | null): string => {
  if (!input) {
    return '';
  }
  const withoutTags = input.replace(/<[^>]*>/g, '');
  return withoutTags
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"');
};

const ALLOWED_TAGS = new Set([
  'B',
  'STRONG',
  'I',
  'EM',
  'U',
  'BR',
  'SUP',
  'SUB',
  'UL',
  'OL',
  'LI',
  'SPAN'
]);

const ALLOWED_STYLES = new Set([
  'font-weight',
  'font-style',
  'text-decoration',
  'color',
  'background-color',
  'text-transform'
]);

const sanitizeStyleAttribute = (styleValue: string): string | null => {
  const sanitized = styleValue
    .split(';')
    .map((declaration) => {
      const [property, value] = declaration.split(':').map((part) => part.trim());
      if (!property || !value) {
        return null;
      }
      if (!ALLOWED_STYLES.has(property.toLowerCase())) {
        return null;
      }
      return `${property}: ${value}`;
    })
    .filter((declaration): declaration is string => Boolean(declaration))
    .join('; ');

  return sanitized.length > 0 ? sanitized : null;
};

const stripDisallowedTags = (input: string): string => {
  return input
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/ on[a-z]+="[^"]*"/gi, '')
    .replace(/<[^>]+>/gi, (match) => {
      const tagNameMatch = match.match(/^<\/?\s*([a-z0-9]+)/i);
      const tagName = tagNameMatch ? tagNameMatch[1].toUpperCase() : '';
      if (!ALLOWED_TAGS.has(tagName)) {
        return '';
      }
      if (match.includes('style=')) {
        const styleMatch = match.match(/style="([^"]*)"/i);
        if (styleMatch) {
          const sanitizedStyle = sanitizeStyleAttribute(styleMatch[1]);
          const cleanedTag = match.replace(/style="([^"]*)"/i, () => {
            return sanitizedStyle ? `style="${sanitizedStyle}"` : '';
          });
          return cleanedTag;
        }
      }
      return match;
    });
};

export const sanitizeInlineHtml = (input: string | undefined | null): string => {
  if (!input) {
    return '';
  }

  if (typeof window === 'undefined' || typeof window.DOMParser === 'undefined') {
    return stripDisallowedTags(input);
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(input, 'text/html');

  const sanitizeNode = (node: Node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;
      if (!ALLOWED_TAGS.has(element.tagName)) {
        const parent = element.parentNode;
        if (parent) {
          while (element.firstChild) {
            parent.insertBefore(element.firstChild, element);
          }
          parent.removeChild(element);
        }
        return;
      }

      Array.from(element.attributes).forEach((attribute) => {
        if (attribute.name === 'style') {
          const sanitizedStyle = sanitizeStyleAttribute(attribute.value);
          if (sanitizedStyle) {
            element.setAttribute('style', sanitizedStyle);
          } else {
            element.removeAttribute('style');
          }
        } else {
          element.removeAttribute(attribute.name);
        }
      });

      if (element.tagName === 'SPAN' && !element.getAttribute('style')) {
        const parent = element.parentNode;
        if (parent) {
          while (element.firstChild) {
            parent.insertBefore(element.firstChild, element);
          }
          parent.removeChild(element);
        }
        return;
      }
    }

    Array.from(node.childNodes).forEach(sanitizeNode);
  };

  Array.from(doc.body.childNodes).forEach(sanitizeNode);

  return doc.body.innerHTML;
};

export const emphasizeBlankSpaces = (input: string): string => {
  if (!input) {
    return '';
  }
  return input.replace(/_{3,}/g, (match) => '_'.repeat(Math.min(match.length + 2, 10)));
};
