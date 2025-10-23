/**
 * Chunk Loading Retry Handler
 * 
 * This script handles ChunkLoadError issues that can occur when:
 * 1. New deployments invalidate old chunk hashes
 * 2. CDN caching causes stale chunk references
 * 3. Browser caching (especially on Windows) serves outdated HTML
 * 
 * It automatically retries failed chunk loads and reloads the page if needed.
 */

// Only run on client side
if (typeof window !== 'undefined') {
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 1000; // 1 second
  const chunkRetries = new Map();
  const hasReloaded = sessionStorage.getItem('chunk-reload-attempted');

  // Store the original webpack chunk load function
  const originalChunkLoad = window.__webpack_require__?.l;

  if (originalChunkLoad) {
    // Override the chunk loading function
    window.__webpack_require__.l = function(url, done, key, chunkId) {
      const retryCount = chunkRetries.get(url) || 0;

      // Create a wrapper for the done callback
      const retryDone = (event) => {
        // If loading failed (403, 404, network error)
        if (event && event.type === 'error') {
          console.error(`[ChunkRetry] Failed to load chunk: ${url}`, {
            retryCount,
            chunkId,
            error: event
          });

          if (retryCount < MAX_RETRIES) {
            // Retry with exponential backoff
            const delay = RETRY_DELAY * Math.pow(2, retryCount);
            console.log(`[ChunkRetry] Retrying in ${delay}ms... (attempt ${retryCount + 1}/${MAX_RETRIES})`);
            
            chunkRetries.set(url, retryCount + 1);
            
            setTimeout(() => {
              // Try loading again
              originalChunkLoad.call(this, url, done, key, chunkId);
            }, delay);
            
            return;
          } else {
            console.error(`[ChunkRetry] Max retries exceeded for chunk: ${url}`);
            
            // If we haven't tried reloading the page yet, do it once
            if (!hasReloaded) {
              console.log('[ChunkRetry] Attempting page reload to fetch fresh chunks...');
              sessionStorage.setItem('chunk-reload-attempted', 'true');
              
              // Clear any service worker caches
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(registrations => {
                  registrations.forEach(registration => registration.unregister());
                });
              }
              
              // Force reload from server, bypassing cache
              window.location.reload(true);
              return;
            } else {
              // Already reloaded once, show error to user
              console.error('[ChunkRetry] Page already reloaded, chunk still failing');
              sessionStorage.removeItem('chunk-reload-attempted');
            }
          }
        } else {
          // Success - reset retry counter and reload flag
          chunkRetries.delete(url);
          if (retryCount > 0) {
            console.log(`[ChunkRetry] Successfully loaded chunk after ${retryCount} retries: ${url}`);
          }
          sessionStorage.removeItem('chunk-reload-attempted');
        }

        // Call the original done callback
        if (done) {
          done(event);
        }
      };

      // Call the original load function with our retry wrapper
      return originalChunkLoad.call(this, url, retryDone, key, chunkId);
    };

    console.log('[ChunkRetry] Chunk loading retry handler installed');
  }

  // Also catch unhandled promise rejections from dynamic imports
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason && event.reason.name === 'ChunkLoadError') {
      console.error('[ChunkRetry] Caught unhandled ChunkLoadError:', event.reason);
      event.preventDefault(); // Prevent error from being logged to console again
      
      // Try page reload if not done yet
      if (!hasReloaded) {
        console.log('[ChunkRetry] Reloading page due to unhandled chunk error...');
        sessionStorage.setItem('chunk-reload-attempted', 'true');
        window.location.reload(true);
      }
    }
  });

  // Clear the reload flag after successful page load
  window.addEventListener('load', () => {
    // If page loaded successfully, clear the flag after a delay
    setTimeout(() => {
      sessionStorage.removeItem('chunk-reload-attempted');
    }, 5000);
  });
}
