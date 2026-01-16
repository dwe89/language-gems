/**
 * TTS Caching Service
 * 
 * PURPOSE: Implement "Check-Before-Create" pattern for TTS audio generation
 * This prevents expensive TTS API calls when audio already exists in storage
 * 
 * STRATEGY:
 * 1. Generate a deterministic cache key from text + config
 * 2. Check if audio exists in Supabase Storage
 * 3. If exists, return the existing URL immediately (no TTS call)
 * 4. If not exists, generate TTS and store with cache key
 * 
 * EXPECTED SAVINGS: Significant reduction in TTS API costs for repeated content
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { createHash } from 'crypto';

export interface TTSCacheConfig {
    text: string;
    language: string;
    voice?: string;
    provider?: 'gemini' | 'polly' | 'google';
    speakingRate?: number;
}

export interface TTSCacheResult {
    url: string;
    cached: boolean;
    cacheKey: string;
}

export class TTSCacheService {
    private supabase: SupabaseClient;
    private bucketName: string = 'audio';
    private cacheFolder: string = 'tts-cache';

    constructor(supabaseClient?: SupabaseClient) {
        if (supabaseClient) {
            this.supabase = supabaseClient;
        } else {
            const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
            const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

            if (!url || !key) {
                throw new Error('Supabase credentials not configured for TTS cache');
            }

            this.supabase = createClient(url, key);
        }
    }

    /**
     * Generate a deterministic cache key from TTS configuration
     * This ensures the same text + config always produces the same key
     */
    generateCacheKey(config: TTSCacheConfig): string {
        const normalizedConfig = {
            text: config.text.trim().toLowerCase(),
            language: config.language.toLowerCase(),
            voice: config.voice?.toLowerCase() || 'default',
            provider: config.provider || 'gemini',
            speakingRate: config.speakingRate || 1.0
        };

        const hash = createHash('sha256')
            .update(JSON.stringify(normalizedConfig))
            .digest('hex')
            .substring(0, 16); // Use first 16 chars for shorter filenames

        return `${config.language}_${config.provider || 'gemini'}_${hash}`;
    }

    /**
     * Get the storage path for a cache key
     */
    getStoragePath(cacheKey: string, extension: string = 'mp3'): string {
        return `${this.cacheFolder}/${cacheKey}.${extension}`;
    }

    /**
     * Check if audio exists in cache
     * Returns the public URL if exists, null otherwise
     */
    async checkCache(config: TTSCacheConfig): Promise<TTSCacheResult | null> {
        try {
            const cacheKey = this.generateCacheKey(config);
            const storagePath = this.getStoragePath(cacheKey);

            console.log(`🔍 [TTSCache] Checking cache for: "${config.text.substring(0, 30)}..." (${cacheKey})`);

            // Try to get file info (this is cheaper than downloading)
            const { data: files, error } = await this.supabase.storage
                .from(this.bucketName)
                .list(this.cacheFolder, {
                    search: `${cacheKey}`
                });

            if (error) {
                console.warn(`⚠️ [TTSCache] Error checking cache:`, error.message);
                return null;
            }

            // Check if our file exists
            const matchingFile = files?.find(f => f.name.startsWith(cacheKey));

            if (matchingFile) {
                // File exists - get public URL
                const fullPath = `${this.cacheFolder}/${matchingFile.name}`;
                const { data: urlData } = this.supabase.storage
                    .from(this.bucketName)
                    .getPublicUrl(fullPath);

                console.log(`✅ [TTSCache] Cache HIT for: "${config.text.substring(0, 30)}..."`);

                return {
                    url: urlData.publicUrl,
                    cached: true,
                    cacheKey
                };
            }

            console.log(`❌ [TTSCache] Cache MISS for: "${config.text.substring(0, 30)}..."`);
            return null;

        } catch (error) {
            console.error('❌ [TTSCache] Error in checkCache:', error);
            return null;
        }
    }

    /**
     * Store generated audio in cache
     */
    async storeInCache(
        config: TTSCacheConfig,
        audioBuffer: Buffer | Uint8Array,
        extension: string = 'mp3',
        contentType: string = 'audio/mpeg'
    ): Promise<TTSCacheResult | null> {
        try {
            const cacheKey = this.generateCacheKey(config);
            const storagePath = this.getStoragePath(cacheKey, extension);

            console.log(`💾 [TTSCache] Storing audio: "${config.text.substring(0, 30)}..." (${cacheKey})`);

            const { data, error } = await this.supabase.storage
                .from(this.bucketName)
                .upload(storagePath, audioBuffer, {
                    contentType,
                    cacheControl: '31536000', // 1 year cache
                    upsert: true
                });

            if (error) {
                console.error(`❌ [TTSCache] Error storing audio:`, error);
                return null;
            }

            // Get public URL
            const { data: urlData } = this.supabase.storage
                .from(this.bucketName)
                .getPublicUrl(storagePath);

            console.log(`✅ [TTSCache] Audio stored successfully: ${cacheKey}`);

            return {
                url: urlData.publicUrl,
                cached: false,
                cacheKey
            };

        } catch (error) {
            console.error('❌ [TTSCache] Error in storeInCache:', error);
            return null;
        }
    }

    /**
     * Get or generate audio - the main entry point
     * Uses check-before-create pattern
     */
    async getOrGenerate(
        config: TTSCacheConfig,
        generateFn: () => Promise<Buffer | Uint8Array>,
        extension: string = 'mp3',
        contentType: string = 'audio/mpeg'
    ): Promise<TTSCacheResult> {
        // Step 1: Check cache
        const cached = await this.checkCache(config);
        if (cached) {
            return cached;
        }

        // Step 2: Generate audio (expensive operation)
        console.log(`🎵 [TTSCache] Generating audio for: "${config.text.substring(0, 30)}..."`);
        const audioBuffer = await generateFn();

        // Step 3: Store in cache
        const stored = await this.storeInCache(config, audioBuffer, extension, contentType);

        if (stored) {
            return stored;
        }

        // Fallback: Return a data URL if storage fails
        const base64 = Buffer.from(audioBuffer).toString('base64');
        return {
            url: `data:${contentType};base64,${base64}`,
            cached: false,
            cacheKey: this.generateCacheKey(config)
        };
    }

    /**
     * Get cache statistics
     */
    async getCacheStats(): Promise<{
        totalFiles: number;
        totalSizeBytes: number;
        oldestFile?: Date;
        newestFile?: Date;
    }> {
        try {
            const { data: files, error } = await this.supabase.storage
                .from(this.bucketName)
                .list(this.cacheFolder, {
                    limit: 1000
                });

            if (error || !files) {
                return { totalFiles: 0, totalSizeBytes: 0 };
            }

            const totalSizeBytes = files.reduce((sum, f) => sum + (f.metadata?.size || 0), 0);
            const dates = files
                .filter(f => f.created_at)
                .map(f => new Date(f.created_at!));

            return {
                totalFiles: files.length,
                totalSizeBytes,
                oldestFile: dates.length > 0 ? new Date(Math.min(...dates.map(d => d.getTime()))) : undefined,
                newestFile: dates.length > 0 ? new Date(Math.max(...dates.map(d => d.getTime()))) : undefined
            };
        } catch (error) {
            console.error('❌ [TTSCache] Error getting stats:', error);
            return { totalFiles: 0, totalSizeBytes: 0 };
        }
    }

    /**
     * Clear old cache entries (older than specified days)
     */
    async clearOldCache(olderThanDays: number = 90): Promise<number> {
        try {
            const { data: files, error } = await this.supabase.storage
                .from(this.bucketName)
                .list(this.cacheFolder, {
                    limit: 1000
                });

            if (error || !files) {
                return 0;
            }

            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

            const filesToDelete = files
                .filter(f => f.created_at && new Date(f.created_at) < cutoffDate)
                .map(f => `${this.cacheFolder}/${f.name}`);

            if (filesToDelete.length === 0) {
                return 0;
            }

            const { error: deleteError } = await this.supabase.storage
                .from(this.bucketName)
                .remove(filesToDelete);

            if (deleteError) {
                console.error('❌ [TTSCache] Error deleting old cache:', deleteError);
                return 0;
            }

            console.log(`🧹 [TTSCache] Cleared ${filesToDelete.length} old cache entries`);
            return filesToDelete.length;

        } catch (error) {
            console.error('❌ [TTSCache] Error in clearOldCache:', error);
            return 0;
        }
    }
}

// Singleton instance for easy import
let ttsCacheInstance: TTSCacheService | null = null;

export function getTTSCacheService(): TTSCacheService {
    if (!ttsCacheInstance) {
        ttsCacheInstance = new TTSCacheService();
    }
    return ttsCacheInstance;
}
