import { describe, it, expect } from 'vitest';
import { escapeHtml } from '../html';

describe('escapeHtml', () => {
  it('returns normal text unchanged', () => {
    expect(escapeHtml('hello world')).toBe('hello world');
  });

  it('escapes HTML angle brackets', () => {
    expect(escapeHtml('<div>')).toBe('&lt;div&gt;');
  });

  it('escapes script tags (XSS prevention)', () => {
    expect(escapeHtml('<script>alert(1)</script>')).toBe(
      '&lt;script&gt;alert(1)&lt;/script&gt;'
    );
  });

  it('escapes ampersands', () => {
    expect(escapeHtml('A & B')).toBe('A &amp; B');
  });

  it('escapes double quotes', () => {
    expect(escapeHtml('"hello"')).toBe('&quot;hello&quot;');
  });

  it('escapes single quotes', () => {
    expect(escapeHtml("it's")).toBe("it&#039;s");
  });

  it('handles empty string', () => {
    expect(escapeHtml('')).toBe('');
  });

  it('escapes all special characters in one string', () => {
    expect(escapeHtml('<img src="x" onerror=\'alert(1)\'>&')).toBe(
      '&lt;img src=&quot;x&quot; onerror=&#039;alert(1)&#039;&gt;&amp;'
    );
  });
});
