/**
 * Audio utilities for handling cross-subdomain audio file access
 *
 * This utility ensures that audio files are loaded from the correct domain,
 * especially when games are played on the student subdomain but audio files
 * are hosted on the main domain.
 */

/**
 * Get the correct audio URL for the current domain context
 *
 * @param audioPath - The relative path to the audio file (e.g., '/audio/themes/classic.mp3')
 * @returns The correct URL for the audio file
 */
export function getAudioUrl(audioPath: string): string {
  // If we're not in a browser environment, return the original path
  if (typeof window === 'undefined') {
    return audioPath;
  }

  // If the path is already absolute (starts with http/https), return as-is
  if (audioPath.startsWith('http://') || audioPath.startsWith('https://')) {
    return audioPath;
  }

  // Ensure the path starts with '/'
  const normalizedPath = audioPath.startsWith('/') ? audioPath : `/${audioPath}`;

  const currentHostname = window.location.hostname;
  const protocol = window.location.protocol;
  const port = window.location.port ? `:${window.location.port}` : '';

  // --- Define your main domain base for development and production ---
  // For local development, your main domain is typically 'localhost' or '127.0.0.1' with a port.
  // For production, it's your actual production domain (e.g., 'languagegems.com').
  // It's highly recommended to use an environment variable for the production main domain.
  const MAIN_DOMAIN_BASE = process.env.NEXT_PUBLIC_MAIN_DOMAIN_BASE || 'localhost'; // e.g., 'localhost' or 'languagegems.com'

  // Construct the full origin of the main domain
  const mainDomainOrigin = `${protocol}//${MAIN_DOMAIN_BASE}${port}`;

  // --- Determine if the current origin is the main domain or a subdomain ---
  const currentOrigin = window.location.origin;

  // If the current origin EXACTLY matches the main domain's origin, use a relative path.
  // This covers `http://localhost:3001` or `https://www.languagegems.com`
  if (currentOrigin === mainDomainOrigin) {
    return normalizedPath;
  }

  // Check if the current hostname is a subdomain of the main production domain (e.g., students.languagegems.com)
  // This is for production environments where the main domain is not 'localhost'.
  if (currentHostname.endsWith(`.${MAIN_DOMAIN_BASE}`) && !currentHostname.includes('localhost')) {
    const finalUrl = `${protocol}//${MAIN_DOMAIN_BASE}${port}${normalizedPath}`;
    return finalUrl;
  }

  // If we reach here, and the current hostname is a 'localhost' but NOT the exact `MAIN_DOMAIN_BASE` (e.g., students.localhost)
  // this means it's a development subdomain and we *must* construct an absolute URL to the main development domain.
  if (currentHostname.includes('localhost') && currentHostname !== MAIN_DOMAIN_BASE && currentHostname !== '127.0.0.1') {
      const finalUrl = `${protocol}//${MAIN_DOMAIN_BASE}${port}${normalizedPath}`;
      return finalUrl;
  }

  // Fallback: If none of the above, return the normalized path.
  // This might catch unusual configurations or cases where a relative path is implicitly desired.
  return normalizedPath;
}

/**
 * Create an Audio object with the correct URL for the current domain context
 *
 * @param audioPath - The relative path to the audio file
 * @returns A new Audio object with the correct URL
 */
export function createAudio(audioPath: string): HTMLAudioElement {
  const audioUrl = getAudioUrl(audioPath);
  return new Audio(audioUrl);
}

/**
 * Preload an audio file with the correct URL for the current domain context
 *
 * @param audioPath - The relative path to the audio file
 * @param options - Optional audio configuration
 * @returns A promise that resolves when the audio is loaded
 */
export function preloadAudio(
  audioPath: string,
  options: { volume?: number; loop?: boolean } = {}
): Promise<HTMLAudioElement> {
  return new Promise((resolve, reject) => {
    const audio = createAudio(audioPath);

    if (options.volume !== undefined) {
      audio.volume = options.volume;
    }

    if (options.loop !== undefined) {
      audio.loop = options.loop;
    }

    audio.preload = 'auto';

    audio.addEventListener('canplaythrough', () => resolve(audio), { once: true });
    audio.addEventListener('error', (error) => reject(error), { once: true });

    audio.load();
  });
}

/**
 * Play an audio file with error handling
 *
 * @param audioPath - The relative path to the audio file or an Audio object
 * @param options - Optional audio configuration
 * @returns A promise that resolves when playback starts
 */
export async function playAudio(
  audioPath: string | HTMLAudioElement,
  options: { volume?: number; loop?: boolean } = {}
): Promise<void> {
  try {
    const audio = typeof audioPath === 'string' ? createAudio(audioPath) : audioPath;

    if (options.volume !== undefined) {
      audio.volume = options.volume;
    }

    if (options.loop !== undefined) {
      audio.loop = options.loop;
    }

    await audio.play();
  } catch (error) {
    console.warn('Failed to play audio:', error);
    throw error;
  }
}