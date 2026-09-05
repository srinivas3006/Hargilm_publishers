import { describe, it, expect } from 'vitest';
import { getSafeRedirect } from './utils';

describe('getSafeRedirect', () => {
  it('allows a plain relative path', () => {
    expect(getSafeRedirect('/dashboard/orders')).toBe('/dashboard/orders');
  });

  it('preserves query strings and hashes on a relative path', () => {
    expect(getSafeRedirect('/books?category=fiction#top')).toBe('/books?category=fiction#top');
  });

  it('falls back on null or undefined', () => {
    expect(getSafeRedirect(null)).toBe('/');
    expect(getSafeRedirect(undefined)).toBe('/');
  });

  it('falls back on an empty string', () => {
    expect(getSafeRedirect('')).toBe('/');
  });

  it('rejects protocol-relative URLs (open-redirect vector)', () => {
    expect(getSafeRedirect('//evil.com')).toBe('/');
    expect(getSafeRedirect('//evil.com/phish')).toBe('/');
  });

  it('rejects absolute http(s) URLs', () => {
    expect(getSafeRedirect('https://evil.com')).toBe('/');
    expect(getSafeRedirect('http://evil.com/login')).toBe('/');
  });

  it('rejects javascript: and other non-http schemes', () => {
    expect(getSafeRedirect('javascript:alert(1)')).toBe('/');
    expect(getSafeRedirect('data:text/html,<script>alert(1)</script>')).toBe('/');
  });

  it('rejects a path that does not start with a slash', () => {
    expect(getSafeRedirect('dashboard')).toBe('/');
  });

  it('respects a custom fallback', () => {
    expect(getSafeRedirect(null, '/login')).toBe('/login');
    expect(getSafeRedirect('https://evil.com', '/login')).toBe('/login');
  });
});
