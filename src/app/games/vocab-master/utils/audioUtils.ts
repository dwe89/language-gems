import { VocabularyWord } from '../types';

/**
 * Audio utility functions for VocabMaster game modes
 */

export class AudioManager {
  private audioRef: HTMLAudioElement | null = null;
  private isPlaying = false;
  private soundEnabled = true;

  constructor(soundEnabled = true) {
    this.soundEnabled = soundEnabled;
  }

  setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  async playPronunciation(
    text: string,
    language: 'es' | 'en' = 'es',
    word?: VocabularyWord
  ): Promise<void> {
    if (this.isPlaying || !this.soundEnabled) return;

    try {
      this.isPlaying = true;

      // Stop any currently playing audio first
      if (this.audioRef) {
        this.audioRef.pause();
        this.audioRef.currentTime = 0;
        this.audioRef = null;
      }

      // Try to use the word's audio URL first
      if (word?.audio_url && word.audio_url.trim()) {
        console.log('Playing word audio:', word.audio_url);
        await this.playAudioFile(word.audio_url);
        return;
      }

      // Fallback to text-to-speech
      console.log('Using text-to-speech for:', text, language);
      await this.playTextToSpeech(text, language);
    } catch (error) {
      console.error('Error playing pronunciation:', error);
      // Try fallback TTS if audio file fails
      if (word?.audio_url) {
        try {
          console.log('Audio file failed, trying TTS fallback');
          await this.playTextToSpeech(text, language);
        } catch (ttsError) {
          console.error('TTS fallback also failed:', ttsError);
        }
      }
    } finally {
      this.isPlaying = false;
    }
  }

  private async playAudioFile(audioUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.audioRef) {
        this.audioRef.pause();
        this.audioRef = null;
      }

      // Validate URL
      if (!audioUrl || !audioUrl.trim()) {
        reject(new Error('Invalid audio URL'));
        return;
      }

      this.audioRef = new Audio(audioUrl);

      this.audioRef.onended = () => {
        console.log('Audio playback completed');
        resolve();
      };

      this.audioRef.onerror = (e) => {
        console.error('Audio file failed to load:', audioUrl, e);
        reject(new Error(`Audio file failed to load: ${audioUrl}`));
      };

      // Add timeout to prevent hanging
      const timeout = setTimeout(() => {
        if (this.audioRef) {
          this.audioRef.pause();
          this.audioRef = null;
        }
        reject(new Error('Audio loading timeout'));
      }, 10000);

      this.audioRef.onloadeddata = () => {
        clearTimeout(timeout);
        console.log('Audio ready to play:', audioUrl);
      };

      this.audioRef.play().catch(playError => {
        clearTimeout(timeout);
        console.error('Audio play failed:', playError);
        reject(playError);
      });
    });
  }

  private async playTextToSpeech(text: string, language: 'es' | 'en'): Promise<void> {
    if (!('speechSynthesis' in window)) {
      throw new Error('Speech synthesis not supported');
    }

    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'es' ? 'es-ES' : 'en-US';
      utterance.rate = 0.8;
      utterance.pitch = 1;

      utterance.onend = () => resolve();
      utterance.onerror = () => reject(new Error('Speech synthesis failed'));

      speechSynthesis.speak(utterance);
    });
  }

  stop() {
    if (this.audioRef) {
      this.audioRef.pause();
      this.audioRef = null;
    }
    
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
    
    this.isPlaying = false;
  }

  isCurrentlyPlaying(): boolean {
    return this.isPlaying;
  }
}

/**
 * Determines if a game mode should auto-play audio
 */
export function shouldAutoPlayAudio(gameMode: string): boolean {
  return ['listening', 'dictation'].includes(gameMode);
}

/**
 * Gets the appropriate language for audio playback based on game mode
 */
export function getAudioLanguage(gameMode: string): 'es' | 'en' {
  switch (gameMode) {
    case 'listening':
    case 'dictation':
      return 'es'; // Play Spanish audio
    default:
      return 'es'; // Default to Spanish for vocabulary learning
  }
}

/**
 * Creates a delay for audio playback timing
 */
export function createAudioDelay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
