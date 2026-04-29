import { describe, it, expect, vi } from 'vitest';
import { createCommandHandlers } from '../commandHandlers';

// Minimal mocks for the deps that createCommandHandlers needs
const mockSetShowGlobe = vi.fn();
const mockSetHistory = vi.fn();

const createHandlers = (showGlobe = false) =>
  createCommandHandlers({
    setShowGlobe: mockSetShowGlobe,
    setHistory: mockSetHistory,
    showGlobe,
  });

describe('commandHandlers', () => {
  describe('help', () => {
    it('returns a string containing "Available commands"', () => {
      const handlers = createHandlers();
      const output = handlers.help([]);
      expect(typeof output).toBe('string');
      expect(output).toContain('Available commands');
    });

    it('includes at least one command name', () => {
      const handlers = createHandlers();
      const output = handlers.help([]) as string;
      // help should list the 'help' command itself
      expect(output).toContain('help');
    });
  });

  describe('echo', () => {
    it('returns the arguments joined by spaces', () => {
      const handlers = createHandlers();
      expect(handlers.echo(['hello', 'world'])).toBe('hello world');
    });

    it('escapes HTML in echo input', () => {
      const handlers = createHandlers();
      expect(handlers.echo(['<script>alert(1)</script>'])).toBe(
        '&lt;script&gt;alert(1)&lt;/script&gt;'
      );
    });

    it('returns empty string for no arguments', () => {
      const handlers = createHandlers();
      expect(handlers.echo([])).toBe('');
    });
  });

  describe('date', () => {
    it('returns a valid date string', () => {
      const handlers = createHandlers();
      const output = handlers.date([]) as string;
      // Date.toString() produces a parseable date
      expect(new Date(output).toString()).not.toBe('Invalid Date');
    });
  });

  describe('whoami', () => {
    it('returns "daroh@terminal"', () => {
      const handlers = createHandlers();
      expect(handlers.whoami([])).toBe('daroh@terminal');
    });
  });

  describe('about', () => {
    it('returns a non-empty string', () => {
      const handlers = createHandlers();
      const output = handlers.about([]);
      expect(typeof output).toBe('string');
      expect((output as string).length).toBeGreaterThan(0);
    });
  });

  describe('projects', () => {
    it('returns HTML containing all project category headings', () => {
      const handlers = createHandlers();
      const output = handlers.projects([]) as string;
      expect(output).toContain('Development Projects');
      expect(output).toContain('Machine Learning Projects');
      expect(output).toContain('Personal Projects');
    });
  });

  describe('skills', () => {
    it('returns HTML containing "Technical Skills"', () => {
      const handlers = createHandlers();
      const output = handlers.skills([]) as string;
      expect(output).toContain('Technical Skills');
    });
  });

  describe('sudo', () => {
    it('returns a permission denied message', () => {
      const handlers = createHandlers();
      const output = handlers.sudo([]) as string;
      expect(output).toContain('Permission denied');
    });
  });

  describe('globe', () => {
    it('calls setShowGlobe(true)', () => {
      mockSetShowGlobe.mockClear();
      const handlers = createHandlers();
      handlers.globe([]);
      expect(mockSetShowGlobe).toHaveBeenCalledWith(true);
    });

    it('returns a launch message', () => {
      const handlers = createHandlers();
      const output = handlers.globe([]) as string;
      expect(output).toContain('Launching globe');
    });
  });

  describe('clear', () => {
    it('calls setHistory([]) when globe is not active', () => {
      mockSetHistory.mockClear();
      const handlers = createHandlers(false);
      handlers.clear([]);
      expect(mockSetHistory).toHaveBeenCalledWith([]);
    });

    it('returns warning message when globe is active', () => {
      const handlers = createHandlers(true);
      const output = handlers.clear([]) as string;
      expect(output).toContain('Cannot clear');
    });
  });

  describe('cv', () => {
    it('returns HTML with a link to the CV', () => {
      const handlers = createHandlers();
      const output = handlers.cv([]) as string;
      expect(output).toContain('href=');
      expect(output).toContain('CV');
    });
  });

  describe('contact', () => {
    it('returns HTML with contact information', () => {
      const handlers = createHandlers();
      const output = handlers.contact([]) as string;
      expect(output).toContain('Contact Information');
      expect(output).toContain('mailto:');
      expect(output).toContain('github.com');
      expect(output).toContain('linkedin.com');
    });
  });
});
