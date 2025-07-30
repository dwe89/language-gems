import { supabase } from '../lib/supabase';
import { GeminiTTSService } from './geminiTTS';

export interface CachedAudioEntry {
  id: string;
  question_id: string;
  audio_text_hash: string;
  audio_url: string;
  tts_config_hash: string;
  language: string;
  file_size: number;
  created_at: string;
  last_accessed: string;
  access_count: number;
}

export interface AudioGenerationRequest {
  questionId: string;
  audioText: string;
  language: string;
  ttsConfig?: {
    voiceName?: string;
    multiSpeaker?: boolean;
    speakers?: Array<{ name: string; voiceName: string }>;
    style?: string;
  };
}

export class ListeningAudioCache {
  private ttsService: GeminiTTSService;
  private memoryCache: Map<string, string> = new Map();
  private readonly CACHE_EXPIRY_DAYS = 30;
  private readonly MAX_MEMORY_CACHE_SIZE = 100;

  constructor(useProModel: boolean = false) {
    this.ttsService = new GeminiTTSService(useProModel);
  }

  /**
   * Generate a hash for the audio text and TTS configuration
   */
  private generateHash(text: string, config?: any): string {
    const crypto = require('crypto');
    const combined = JSON.stringify({ text, config });
    return crypto.createHash('sha256').update(combined).digest('hex');
  }

  /**
   * Get cached audio URL or generate new one
   */
  async getOrGenerateAudio(request: AudioGenerationRequest): Promise<string> {
    const audioTextHash = this.generateHash(request.audioText);
    const ttsConfigHash = this.generateHash(request.ttsConfig || {});
    
    // Check memory cache first
    const memoryCacheKey = `${request.questionId}_${audioTextHash}_${ttsConfigHash}`;
    if (this.memoryCache.has(memoryCacheKey)) {
      console.log(`🎵 Found audio in memory cache for question: ${request.questionId}`);
      await this.updateAccessStats(request.questionId, audioTextHash, ttsConfigHash);
      return this.memoryCache.get(memoryCacheKey)!;
    }

    // Check database cache
    const cachedEntry = await this.getCachedEntry(request.questionId, audioTextHash, ttsConfigHash);
    if (cachedEntry) {
      console.log(`🎵 Found cached audio for question: ${request.questionId}`);
      
      // Verify the file still exists in storage
      const fileExists = await this.verifyFileExists(cachedEntry.audio_url);
      if (fileExists) {
        // Update memory cache
        this.updateMemoryCache(memoryCacheKey, cachedEntry.audio_url);
        await this.updateAccessStats(request.questionId, audioTextHash, ttsConfigHash);
        return cachedEntry.audio_url;
      } else {
        // File missing, remove from cache and regenerate
        console.warn(`🗑️ Cached audio file missing, removing from cache: ${cachedEntry.audio_url}`);
        await this.removeCachedEntry(cachedEntry.id);
      }
    }

    // Generate new audio
    console.log(`🎵 Generating new audio for question: ${request.questionId}`);
    const audioUrl = await this.generateNewAudio(request);
    
    // Cache the result
    await this.cacheAudioEntry({
      question_id: request.questionId,
      audio_text_hash: audioTextHash,
      audio_url: audioUrl,
      tts_config_hash: ttsConfigHash,
      language: request.language,
      file_size: 0, // Will be updated later if needed
      access_count: 1
    });

    // Update memory cache
    this.updateMemoryCache(memoryCacheKey, audioUrl);

    return audioUrl;
  }

  /**
   * Get cached entry from database
   */
  private async getCachedEntry(
    questionId: string, 
    audioTextHash: string, 
    ttsConfigHash: string
  ): Promise<CachedAudioEntry | null> {
    const { data, error } = await supabase
      .from('aqa_listening_audio_cache')
      .select('*')
      .eq('question_id', questionId)
      .eq('audio_text_hash', audioTextHash)
      .eq('tts_config_hash', ttsConfigHash)
      .gte('created_at', new Date(Date.now() - this.CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000).toISOString())
      .single();

    if (error) {
      if (error.code !== 'PGRST116') { // Not found error
        console.error('Error fetching cached audio:', error);
      }
      return null;
    }

    return data;
  }

  /**
   * Cache new audio entry
   */
  private async cacheAudioEntry(entry: Omit<CachedAudioEntry, 'id' | 'created_at' | 'last_accessed'>): Promise<void> {
    const { error } = await supabase
      .from('aqa_listening_audio_cache')
      .insert({
        ...entry,
        created_at: new Date().toISOString(),
        last_accessed: new Date().toISOString()
      });

    if (error) {
      console.error('Error caching audio entry:', error);
    }
  }

  /**
   * Update access statistics
   */
  private async updateAccessStats(questionId: string, audioTextHash: string, ttsConfigHash: string): Promise<void> {
    const { error } = await supabase
      .from('aqa_listening_audio_cache')
      .update({
        last_accessed: new Date().toISOString(),
        access_count: supabase.raw('access_count + 1')
      })
      .eq('question_id', questionId)
      .eq('audio_text_hash', audioTextHash)
      .eq('tts_config_hash', ttsConfigHash);

    if (error) {
      console.error('Error updating access stats:', error);
    }
  }

  /**
   * Remove cached entry
   */
  private async removeCachedEntry(id: string): Promise<void> {
    const { error } = await supabase
      .from('aqa_listening_audio_cache')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error removing cached entry:', error);
    }
  }

  /**
   * Verify file exists in Supabase Storage
   */
  private async verifyFileExists(audioUrl: string): Promise<boolean> {
    try {
      const response = await fetch(audioUrl, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  /**
   * Generate new audio using Gemini TTS
   */
  private async generateNewAudio(request: AudioGenerationRequest): Promise<string> {
    const filename = `listening_${request.language}_${request.questionId}_${Date.now()}.wav`;

    if (request.ttsConfig?.multiSpeaker && request.ttsConfig?.speakers) {
      return await this.ttsService.generateMultiSpeakerAudio(
        request.audioText,
        { speakers: request.ttsConfig.speakers },
        filename
      );
    } else {
      return await this.ttsService.generateExamAudio(
        request.audioText,
        request.language,
        request.questionId,
        {
          includeInstructions: true,
          speakingSpeed: 'normal',
          tone: 'neutral'
        }
      );
    }
  }

  /**
   * Update memory cache with LRU eviction
   */
  private updateMemoryCache(key: string, url: string): void {
    // Remove if already exists to update position
    if (this.memoryCache.has(key)) {
      this.memoryCache.delete(key);
    }

    // Add to end (most recent)
    this.memoryCache.set(key, url);

    // Evict oldest if over limit
    if (this.memoryCache.size > this.MAX_MEMORY_CACHE_SIZE) {
      const firstKey = this.memoryCache.keys().next().value;
      this.memoryCache.delete(firstKey);
    }
  }

  /**
   * Clean up expired cache entries
   */
  async cleanupExpiredEntries(): Promise<number> {
    const expiryDate = new Date(Date.now() - this.CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
    
    const { data, error } = await supabase
      .from('aqa_listening_audio_cache')
      .delete()
      .lt('created_at', expiryDate.toISOString())
      .select('id');

    if (error) {
      console.error('Error cleaning up expired entries:', error);
      return 0;
    }

    const deletedCount = data?.length || 0;
    console.log(`🧹 Cleaned up ${deletedCount} expired audio cache entries`);
    return deletedCount;
  }

  /**
   * Get cache statistics
   */
  async getCacheStats(): Promise<{
    totalEntries: number;
    totalSize: number;
    byLanguage: Record<string, number>;
    recentlyAccessed: number;
  }> {
    const { data, error } = await supabase
      .from('aqa_listening_audio_cache')
      .select('language, file_size, last_accessed');

    if (error) {
      console.error('Error fetching cache stats:', error);
      return { totalEntries: 0, totalSize: 0, byLanguage: {}, recentlyAccessed: 0 };
    }

    const stats = {
      totalEntries: data.length,
      totalSize: data.reduce((sum, entry) => sum + (entry.file_size || 0), 0),
      byLanguage: {} as Record<string, number>,
      recentlyAccessed: 0
    };

    const recentThreshold = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 days ago

    data.forEach(entry => {
      stats.byLanguage[entry.language] = (stats.byLanguage[entry.language] || 0) + 1;
      if (new Date(entry.last_accessed) > recentThreshold) {
        stats.recentlyAccessed++;
      }
    });

    return stats;
  }

  /**
   * Clear memory cache
   */
  clearMemoryCache(): void {
    this.memoryCache.clear();
    console.log('🧹 Cleared memory cache');
  }

  /**
   * Preload audio for multiple questions
   */
  async preloadAudio(requests: AudioGenerationRequest[]): Promise<Map<string, string>> {
    const results = new Map<string, string>();
    
    console.log(`🎵 Preloading audio for ${requests.length} questions...`);
    
    // Process in batches to avoid overwhelming the TTS service
    const batchSize = 3;
    for (let i = 0; i < requests.length; i += batchSize) {
      const batch = requests.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (request) => {
        try {
          const audioUrl = await this.getOrGenerateAudio(request);
          results.set(request.questionId, audioUrl);
          return { questionId: request.questionId, success: true };
        } catch (error) {
          console.error(`Failed to preload audio for question ${request.questionId}:`, error);
          return { questionId: request.questionId, success: false };
        }
      });

      await Promise.all(batchPromises);
      
      // Small delay between batches
      if (i + batchSize < requests.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log(`✅ Preloaded audio for ${results.size}/${requests.length} questions`);
    return results;
  }
}
