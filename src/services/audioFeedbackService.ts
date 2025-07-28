import { GemType } from '../components/ui/GemIcon';

export class AudioFeedbackService {
  private audioCache: Map<string, HTMLAudioElement> = new Map();

  // Audio file paths
  private audioFiles = {
    gems: {
      common: '/audio/gems/gem-common.mp3',
      uncommon: '/audio/gems/gem-uncommon.mp3',
      rare: '/audio/gems/gem-rare.mp3',
      epic: '/audio/gems/gem-epic.mp3',
      legendary: '/audio/gems/gem-legendary.mp3'
    },
    achievements: {
      unlock: '/audio/achievements/achievement-unlock.mp3',
      rare: '/audio/achievements/achievement-rare.mp3',
      legendary: '/audio/achievements/achievement-legendary.mp3'
    },
    feedback: {
      incorrect: '/audio/sfx/wrong-answer.mp3',
      levelComplete: '/audio/battle/victory.mp3'
    }
  };

  constructor() {
    // Preload audio files
    this.preloadAudio();
  }

  private preloadAudio() {
    // Only preload audio in the browser (not during SSR)
    if (typeof window === 'undefined') return;

    console.log('🎵 AudioFeedbackService: Preloading audio files...');

    // Preload gem sounds
    Object.entries(this.audioFiles.gems).forEach(([key, path]) => {
      const audio = new Audio(path);
      audio.preload = 'auto';
      audio.loop = false; // Ensure no looping
      this.audioCache.set(`gem-${key}`, audio);
      console.log(`💎 Preloaded gem sound: ${key} -> ${path}`);
    });

    // Preload achievement sounds
    Object.entries(this.audioFiles.achievements).forEach(([key, path]) => {
      const audio = new Audio(path);
      audio.preload = 'auto';
      audio.loop = false; // Ensure no looping
      this.audioCache.set(`achievement-${key}`, audio);
      console.log(`🏆 Preloaded achievement sound: ${key} -> ${path}`);
    });

    // Preload feedback sounds
    Object.entries(this.audioFiles.feedback).forEach(([key, path]) => {
      const audio = new Audio(path);
      audio.preload = 'auto';
      audio.loop = false; // Ensure no looping
      this.audioCache.set(`feedback-${key}`, audio);
      console.log(`🔊 Preloaded feedback sound: ${key} -> ${path}`);
    });

    console.log('✅ AudioFeedbackService: Audio preloading complete!');
    console.log('📋 Cached audio keys:', Array.from(this.audioCache.keys()));
  }

  private async playAudio(key: string, volume: number = 0.7): Promise<void> {
    // Only play audio in the browser
    if (typeof window === 'undefined') return;

    console.log(`🎵 AudioFeedbackService: Attempting to play audio: ${key}`);

    try {
      const audio = this.audioCache.get(key);
      if (!audio) {
        console.warn(`🚫 Audio not found in cache: ${key}`);
        console.log('Available audio keys:', Array.from(this.audioCache.keys()));
        return;
      }

      // Clone the audio element to allow overlapping sounds
      const audioClone = audio.cloneNode() as HTMLAudioElement;
      audioClone.volume = volume;
      audioClone.loop = false; // Explicitly prevent looping

      console.log(`🔊 Playing audio: ${key} at volume ${volume}`);
      await audioClone.play();
      console.log(`✅ Successfully played audio: ${key}`);
    } catch (error) {
      console.error(`❌ Error playing audio ${key}:`, error);
    }
  }

  // Play gem collection sound based on gem type
  async playGemCollectionSound(gemType: GemType): Promise<void> {
    await this.playAudio(`gem-${gemType}`, 0.8);
  }

  // Play achievement unlock sound
  async playAchievementSound(rarity: 'common' | 'rare' | 'legendary' = 'common'): Promise<void> {
    const soundKey = rarity === 'common' ? 'unlock' : rarity;
    await this.playAudio(`achievement-${soundKey}`, 0.7);
  }

  // Play error sound for incorrect answers
  async playErrorSound(): Promise<void> {
    await this.playAudio('feedback-incorrect', 0.6);
  }

  // Play level complete sound
  async playLevelCompleteSound(): Promise<void> {
    await this.playAudio('feedback-levelComplete', 0.8);
  }

  // Keep success sound for non-gem related success (like achievements)
  async playSuccessSound(): Promise<void> {
    // Use the common gem sound as a fallback success sound
    await this.playAudio('gem-common', 0.5);
  }

  // Cleanup
  dispose(): void {
    this.audioCache.clear();
  }
}

// Singleton instance
export const audioFeedbackService = new AudioFeedbackService();
