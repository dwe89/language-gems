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
    // Preload gem sounds
    Object.entries(this.audioFiles.gems).forEach(([key, path]) => {
      const audio = new Audio(path);
      audio.preload = 'auto';
      audio.loop = false; // Ensure no looping
      this.audioCache.set(`gem-${key}`, audio);
    });

    // Preload achievement sounds
    Object.entries(this.audioFiles.achievements).forEach(([key, path]) => {
      const audio = new Audio(path);
      audio.preload = 'auto';
      audio.loop = false; // Ensure no looping
      this.audioCache.set(`achievement-${key}`, audio);
    });

    // Preload feedback sounds
    Object.entries(this.audioFiles.feedback).forEach(([key, path]) => {
      const audio = new Audio(path);
      audio.preload = 'auto';
      audio.loop = false; // Ensure no looping
      this.audioCache.set(`feedback-${key}`, audio);
    });
  }

  private async playAudio(key: string, volume: number = 0.7): Promise<void> {
    try {
      const audio = this.audioCache.get(key);
      if (!audio) {
        console.warn(`Audio not found: ${key}`);
        return;
      }

      // Clone the audio element to allow overlapping sounds
      const audioClone = audio.cloneNode() as HTMLAudioElement;
      audioClone.volume = volume;
      audioClone.loop = false; // Explicitly prevent looping

      await audioClone.play();
    } catch (error) {
      console.error(`Error playing audio ${key}:`, error);
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
