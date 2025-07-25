"use client";

import React from 'react';
import DOMPurify from 'dompurify';

interface TerminalOutputProps {
  html: string;
}

// Server-side safe HTML escaping function
const escapeHtml = (unsafe: string): string => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

// Safe HTML sanitization that works on both client and server
const sanitizeHtml = (html: string): string => {
  // Client-side: Use DOMPurify if available
  if (typeof window !== 'undefined' && DOMPurify.isSupported) {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['span', 'br', 'div', 'a', 'strong', 'em', 'i', 'svg', 'path', 'rect'],
      ALLOWED_ATTR: [
        'class', 'href', 'target', 'rel',
        'width', 'height', 'fill', 'viewBox', 'style', 'd', 'xmlns', 'color', 'rx'
      ],
      ALLOW_DATA_ATTR: false
    });
  }
  
  // Server-side or fallback: Only allow safe, pre-approved HTML patterns
  // This is a whitelist approach for trusted terminal content
  const safeTags = /^<\/?(span|br|div|a|strong|em|i|svg|path|rect)(\s+[^>]*)?>$/;
  
  // Split by < and > to check each potential tag
  const parts = html.split(/(<[^>]*>)/);
  const sanitizedParts = parts.map(part => {
    if (part.startsWith('<') && part.endsWith('>')) {
      // If it's a tag, check if it's in our safe list
      if (safeTags.test(part)) {
        return part;
      } else {
        // Escape unsafe tags
        return escapeHtml(part);
      }
    }
    // For text content, no need to escape as it's already safe
    return part;
  });
  
  return sanitizedParts.join('');
};

const TerminalOutput: React.FC<TerminalOutputProps> = ({ html }) => {
  const linkedinMarker = '{linkedinIcon}';
  if (html.includes(linkedinMarker)) {
    const [before, after] = html.split(linkedinMarker);
    return (
      <div>
        <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(before) }} />
        <span dangerouslySetInnerHTML={{ __html: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 448 448" style="vertical-align:middle;"><rect width="448" height="448" rx="64" fill="#0A66C2"/><path d="M100.28 150.64h60.84v195.82h-60.84zM130.7 75.85c19.43 0 35.17 15.75 35.17 35.17s-15.74 35.17-35.17 35.17-35.17-15.75-35.17-35.17 15.74-35.17 35.17-35.17zm69.43 74.79h58.34v26.77h.83c8.12-15.38 27.98-31.59 57.57-31.59 61.56 0 72.93 40.52 72.93 93.21v107.43h-60.62V251.8c0-22.68-.43-51.83-31.59-51.83-31.63 0-36.45 24.69-36.45 50.18v96.31h-60.41V150.64z" fill="#fff"/></svg>` }} />
        <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(after) }} />
      </div>
    );
  }
  const sanitizedHtml = sanitizeHtml(html);
  return (
    <div 
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }} 
      suppressHydrationWarning={true}
    />
  );
};

export default TerminalOutput; 