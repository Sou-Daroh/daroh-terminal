import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getDeviceInfo } from '../deviceInfo';

// Mock browser APIs that don't exist in jsdom
beforeEach(() => {
  // Mock screen
  Object.defineProperty(window, 'screen', {
    value: { width: 1920, height: 1080, colorDepth: 24 },
    writable: true,
    configurable: true,
  });

  // Mock devicePixelRatio
  Object.defineProperty(window, 'devicePixelRatio', {
    value: 2,
    writable: true,
    configurable: true,
  });

  // Mock hardwareConcurrency
  Object.defineProperty(navigator, 'hardwareConcurrency', {
    value: 8,
    writable: true,
    configurable: true,
  });

  // Mock performance.now
  vi.spyOn(performance, 'now').mockReturnValue(3661000); // 1h 1m 1s

  // Mock canvas for GPU detection
  const mockCanvas = {
    getContext: () => null,
  };
  vi.spyOn(document, 'createElement').mockReturnValue(mockCanvas as unknown as HTMLElement);
});

describe('getDeviceInfo', () => {
  it('returns an object with all expected fields', () => {
    const info = getDeviceInfo();
    expect(info).toHaveProperty('os');
    expect(info).toHaveProperty('kernel');
    expect(info).toHaveProperty('deviceType');
    expect(info).toHaveProperty('shell');
    expect(info).toHaveProperty('terminal');
    expect(info).toHaveProperty('platform');
    expect(info).toHaveProperty('resolution');
    expect(info).toHaveProperty('cpu');
    expect(info).toHaveProperty('gpu');
    expect(info).toHaveProperty('timezone');
    expect(info).toHaveProperty('language');
    expect(info).toHaveProperty('uptime');
  });

  it('detects screen resolution from mocked screen', () => {
    const info = getDeviceInfo();
    expect(info.resolution).toBe('1920x1080');
  });

  it('detects CPU cores from mocked hardwareConcurrency', () => {
    const info = getDeviceInfo();
    expect(info.cpu).toBe('8 cores');
  });

  it('formats uptime correctly', () => {
    const info = getDeviceInfo();
    expect(info.uptime).toBe('1h 1m 1s');
  });

  it('detects pixel ratio', () => {
    const info = getDeviceInfo();
    expect(info.pixelRatio).toBe(2);
  });

  it('returns "Unknown GPU" when WebGL is unavailable', () => {
    const info = getDeviceInfo();
    expect(info.gpu).toBe('Unknown GPU');
  });

  it('detects Windows platform from user agent', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      writable: true,
      configurable: true,
    });
    const info = getDeviceInfo();
    expect(info.os).toBe('Windows');
    expect(info.kernel).toBe('NT');
    expect(info.shell).toBe('Chrome');
  });

  it('detects macOS platform from user agent', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
      writable: true,
      configurable: true,
    });
    const info = getDeviceInfo();
    expect(info.os).toBe('macOS');
    expect(info.kernel).toBe('Darwin');
    expect(info.shell).toBe('Safari');
  });

  it('detects Firefox browser from user agent', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (X11; Linux x86_64; rv:120.0) Gecko/20100101 Firefox/120.0',
      writable: true,
      configurable: true,
    });
    const info = getDeviceInfo();
    expect(info.os).toBe('Linux');
    expect(info.shell).toBe('Firefox');
    expect(info.terminal).toBe('Gecko Engine');
  });

  it('detects Edge browser from user agent', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
      writable: true,
      configurable: true,
    });
    const info = getDeviceInfo();
    expect(info.shell).toBe('Edge');
    expect(info.terminal).toBe('Chromium Engine');
  });
});
