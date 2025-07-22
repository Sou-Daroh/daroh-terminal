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
      ALLOWED_TAGS: ['span', 'br', 'div', 'a', 'strong', 'em', 'i'],
      ALLOWED_ATTR: ['class', 'href', 'target', 'rel'],
      ALLOW_DATA_ATTR: false
    });
  }
  
  // Server-side or fallback: Only allow safe, pre-approved HTML patterns
  // This is a whitelist approach for trusted terminal content
  const safeTags = /^<\/(span|br|div|a|strong|em|i)>$|^<(span|br|div|a|strong|em|i)(\s+class="[^"]*"|\s+href="[^"]*"|\s+target="_blank"|\s+rel="noopener noreferrer")*\s*\/?>$/;
  
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
  const sanitizedHtml = sanitizeHtml(html);

  return (
    <div 
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }} 
      suppressHydrationWarning={true}
    />
  );
};

export default TerminalOutput; 