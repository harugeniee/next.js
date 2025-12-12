"use client";

// import pacmanLoading from "@/assets/lottiefiles/pacman-loading.json";
import rainbowCatRemixLoading from "@/assets/lottiefiles/rainbow-cat-remix-loading.json";
import { MediaAPI } from "@/lib/api/media";
import { cn, generatePermutation } from "@/lib/utils";
import Lottie from "lottie-react";
import { useEffect, useRef, useState } from "react";

/**
 * Props for the ScrambledImageCanvas component
 */
interface ScrambledImageCanvasProps {
  /** Unique identifier of the media item */
  mediaId: string;
  /** URL of the scrambled image from the backend */
  src: string;
  /** Alternative text for accessibility */
  alt?: string;
  /** Additional CSS classes */
  className?: string;
  /** Maximum width constraint */
  maxWidth?: number;
  /** Maximum height constraint */
  maxHeight?: number;
  /** Enable tile-by-tile animation (default: true) */
  animate?: boolean;
  /** Animation duration in milliseconds (default: 1500) */
  animationDuration?: number;
  /** Stagger delay between tiles in milliseconds (default: 5) */
  staggerDelay?: number;
}

/**
 * ScrambledImageCanvas Component
 *
 * Client component that reconstructs the original image from scrambled tiles.
 * Uses canvas to render the unscrambled image by rearranging tiles according to
 * the permutation seed fetched from the backend.
 */
export function ScrambledImageCanvas({
  mediaId,
  src,
  alt,
  className,
  maxWidth,
  maxHeight,
  animate = true,
  animationDuration = 1500,
  staggerDelay = 5,
}: ScrambledImageCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const blobUrlRef = useRef<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [animationStarted, setAnimationStarted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Image dimensions for potential future use (e.g., responsive sizing)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  // Animation progress (0-1) for potential future use (e.g., progress indicator)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    let cancelled = false;

    /**
     * Async function to load and unscramble the image
     */
    async function loadAndUnscrambleImage() {
      try {
        setLoading(true);
        setAnimationStarted(false); // Reset when starting new load
        setError(null);

        // Wait for canvas to be mounted with retry logic
        // This is important because without DevTools, code runs faster and canvas might not be ready
        let retries = 0;
        const maxRetries = 10;
        while (!canvasRef.current && retries < maxRetries) {
          await new Promise<void>((resolve) => {
            // Wait for multiple frames to ensure canvas is fully rendered
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                  resolve();
                });
              });
            });
          });
          retries++;
        }

        if (cancelled) return;

        // Verify canvas ref is available
        if (!canvasRef.current) {
          throw new Error(
            "Canvas element not mounted after retries. Please ensure the component is properly rendered.",
          );
        }

        // Additional check: ensure canvas has valid dimensions
        if (
          canvasRef.current &&
          (canvasRef.current.width === 0 || canvasRef.current.height === 0)
        ) {
          // Wait a bit more for canvas to be properly initialized
          await new Promise((resolve) => setTimeout(resolve, 500));
        }

        // Step 1: Fetch scramble key from backend
        const scrambleKeyResponse = await MediaAPI.getScrambleKey(mediaId);

        if (cancelled) return;

        if (!scrambleKeyResponse.success) {
          throw new Error(
            scrambleKeyResponse.message || "Failed to fetch scramble key",
          );
        }

        const { permutationSeed, tileRows, tileCols } =
          scrambleKeyResponse.data;

        // Step 2: Generate permutation mapping
        const { inversePermutation } = generatePermutation(
          permutationSeed,
          tileRows,
          tileCols,
        );

        // Step 3: Load the scrambled image
        const isHttps = src.startsWith("https://");

        // Test CORS configuration first (non-blocking)
        // This is just for diagnostics - we'll still try to load the image even if test fails
        if (isHttps && !src.includes("localhost")) {
          try {
            // Add delay before CORS test to ensure preflight can complete
            // This is critical when DevTools is closed
            await new Promise((resolve) => {
              requestAnimationFrame(() => {
                setTimeout(resolve, 200); // Delay for CORS preflight
              });
            });

            await fetch(src, {
              method: "HEAD",
              mode: "cors",
            });
          } catch {
            // CORS test failed, but continue with image load
          }
        }

        // Load image using fetch() + blob approach for better CORS handling
        // This approach is more reliable than Image() element when DevTools is closed
        // because fetch() handles CORS preflight more predictably
        const img = new Image();
        let corsAttempted = false;
        let imageBlobUrl: string | null = null;
        let useDirectLoad = false;

        if (isHttps && !src.includes("localhost")) {
          // External HTTPS URL - try fetch() first, fallback to direct load if it fails
          corsAttempted = true;

          // CRITICAL: Pre-warm CORS before first fetch attempt
          // This is essential when DevTools is closed (code runs faster)
          // We need to ensure CORS preflight completes before actual fetch

          // Strategy: Use a small test fetch to trigger and wait for CORS preflight
          // This ensures the browser has processed CORS before we do the actual fetch
          let preflightReady = false;
          let preflightAttempts = 0;
          const maxPreflightAttempts = 5;

          while (!preflightReady && preflightAttempts < maxPreflightAttempts) {
            preflightAttempts++;

            try {
              // Make a small HEAD request to trigger CORS preflight
              const preflightResponse = await fetch(src, {
                method: "HEAD",
                mode: "cors",
                credentials: "omit",
                cache: "no-cache", // Force fresh request
              });

              // Check if we got CORS headers
              const corsHeader = preflightResponse.headers.get(
                "access-control-allow-origin",
              );
              if (corsHeader) {
                preflightReady = true;
              } else {
                // Wait a bit and retry
                await new Promise((resolve) =>
                  setTimeout(resolve, 200 * preflightAttempts),
                );
              }
            } catch {
              // Wait longer between retries to give browser time to process
              await new Promise((resolve) => {
                requestAnimationFrame(() => {
                  requestAnimationFrame(() => {
                    setTimeout(() => {
                      resolve(undefined);
                    }, 500 * preflightAttempts); // Increasing delay
                  });
                });
              });
            }
          }

          // Additional delay to ensure preflight is fully processed by browser
          // This is critical when DevTools is closed (code runs faster)
          // Multiple animation frames + timeout to ensure browser processes CORS
          await new Promise((resolve) => {
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                  requestAnimationFrame(() => {
                    setTimeout(() => {
                      resolve(undefined);
                    }, 500); // Increased delay for better reliability
                  });
                });
              });
            });
          });

          let fetchAttempts = 0;
          const maxFetchAttempts = 3;
          let fetchSuccess = false;

          while (!fetchSuccess && fetchAttempts < maxFetchAttempts) {
            fetchAttempts++;

            if (fetchAttempts > 1) {
              // Increase delay between retries
              await new Promise((resolve) =>
                setTimeout(resolve, 1000 * fetchAttempts),
              );
            }

            try {
              const response = await fetch(src, {
                method: "GET",
                mode: "cors",
                credentials: "omit", // Don't send cookies
                cache: "default",
              });

              if (!response.ok) {
                throw new Error(
                  `HTTP ${response.status}: ${response.statusText}`,
                );
              }

              const blob = await response.blob();

              imageBlobUrl = URL.createObjectURL(blob);
              blobUrlRef.current = imageBlobUrl; // Store for cleanup
              fetchSuccess = true;
            } catch {
              if (fetchAttempts >= maxFetchAttempts) {
                useDirectLoad = true;
                break; // Exit loop, will use direct load
              }
            }
          }
        } else {
          useDirectLoad = true;
        }

        // Load image into Image element
        // If we used fetch(), use the blob URL; otherwise use original src with crossOrigin
        const imageSrc = imageBlobUrl || src;

        if (useDirectLoad && isHttps && !src.includes("localhost")) {
          // For direct load, we need crossOrigin set BEFORE src
          // CRITICAL: When DevTools is closed, code runs faster and CORS preflight
          // may not complete before image load. We need to ensure preflight completes.
          img.crossOrigin = "anonymous";

          // CRITICAL FIX: Pre-warm CORS by making a preflight request
          // This ensures CORS preflight completes before we set img.src
          // This is essential when DevTools is closed (code runs faster)
          try {
            // Make a HEAD request to trigger CORS preflight
            await fetch(src, {
              method: "HEAD",
              mode: "cors",
              credentials: "omit",
            });
          } catch {
            // CORS preflight failed, but continue
          }

          // Additional delay to ensure preflight is fully processed
          // Multiple animation frames + timeout to ensure browser processes CORS
          await new Promise((resolve) => {
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                  // Additional delay - critical when DevTools is closed
                  setTimeout(() => {
                    resolve(undefined);
                  }, 500); // Increased delay to 500ms
                });
              });
            });
          });
        }

        await new Promise<void>((resolve, reject) => {
          const timeout = setTimeout(() => {
            if (imageBlobUrl) {
              URL.revokeObjectURL(imageBlobUrl);
              blobUrlRef.current = null;
            }
            reject(new Error(`Image load timeout after 15 seconds: ${src}`));
          }, 15000); // Increased timeout to 15 seconds

          img.onload = () => {
            clearTimeout(timeout);
            // Small delay to ensure image is fully decoded
            // This is especially important when DevTools is closed
            setTimeout(() => {
              resolve();
            }, 100); // Increased delay for better stability
          };

          img.onerror = () => {
            clearTimeout(timeout);
            if (imageBlobUrl) {
              URL.revokeObjectURL(imageBlobUrl);
              blobUrlRef.current = null;
            }

            let corsMessage = "";
            if (corsAttempted && useDirectLoad) {
              corsMessage = `You have been blocked for suspicious activity.`;
            }

            reject(
              new Error(
                `Failed to load image into Image element from ${src}.${corsMessage}`,
              ),
            );
          };

          img.src = imageSrc;
        });

        if (cancelled) return;

        const scrambledWidth = img.naturalWidth;
        const scrambledHeight = img.naturalHeight;

        // Validate dimensions
        if (scrambledWidth <= 0 || scrambledHeight <= 0) {
          throw new Error(
            `Invalid image dimensions: ${scrambledWidth}x${scrambledHeight}`,
          );
        }

        if (tileRows <= 0 || tileCols <= 0) {
          throw new Error(
            `Invalid tile configuration: ${tileRows} rows x ${tileCols} cols`,
          );
        }

        // Step 4: Calculate tile dimensions
        // Use exact division to match backend behavior
        const tileWidth = Math.floor(scrambledWidth / tileCols);
        const tileHeight = Math.floor(scrambledHeight / tileRows);

        // Step 5: Set up canvas for unscrambled image
        const canvas = canvasRef.current;
        if (!canvas) {
          throw new Error(
            "Canvas element was unmounted during image processing. Please try again.",
          );
        }

        const canvasWidth = tileWidth * tileCols;
        const canvasHeight = tileHeight * tileRows;

        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        // Store dimensions for responsive rendering
        setImageDimensions({ width: canvasWidth, height: canvasHeight });

        // Small delay to ensure canvas dimensions are applied
        // This is critical when DevTools is closed (code runs faster)
        await new Promise((resolve) => {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              resolve(undefined);
            });
          });
        });

        if (cancelled) return;

        // Step 6: Get canvas context and render unscrambled image
        const ctx = canvas.getContext("2d", {
          willReadFrequently: false,
          alpha: true,
        });
        if (!ctx) {
          throw new Error("Canvas context not available");
        }

        // Disable image smoothing for pixel-perfect tile rendering
        ctx.imageSmoothingEnabled = false;
        ctx.imageSmoothingQuality = "low";

        // Clear canvas
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        // Prepare tile data for drawing
        interface TileData {
          scrambledIndex: number;
          originalIndex: number;
          sx: number;
          sy: number;
          dx: number;
          dy: number;
        }

        const tiles: TileData[] = [];

        // Pre-calculate all tile positions
        for (
          let scrambledIndex = 0;
          scrambledIndex < inversePermutation.length;
          scrambledIndex++
        ) {
          const originalIndex = inversePermutation[scrambledIndex];

          // Validate indices
          if (originalIndex < 0 || originalIndex >= inversePermutation.length) {
            continue;
          }

          // Calculate source position (from scrambled image)
          const srcRow = Math.floor(scrambledIndex / tileCols);
          const srcCol = scrambledIndex % tileCols;

          // Calculate destination position (in original layout)
          const destRow = Math.floor(originalIndex / tileCols);
          const destCol = originalIndex % tileCols;

          const sx = srcCol * tileWidth;
          const sy = srcRow * tileHeight;
          const dx = destCol * tileWidth;
          const dy = destRow * tileHeight;

          // Validate coordinates
          if (
            sx < 0 ||
            sy < 0 ||
            sx + tileWidth > scrambledWidth ||
            sy + tileHeight > scrambledHeight
          ) {
            continue;
          }

          if (
            dx < 0 ||
            dy < 0 ||
            dx + tileWidth > canvasWidth ||
            dy + tileHeight > canvasHeight
          ) {
            continue;
          }

          tiles.push({
            scrambledIndex,
            originalIndex,
            sx,
            sy,
            dx,
            dy,
          });
        }

        // Draw tiles with or without animation
        if (animate && tiles.length > 0) {
          // Animated drawing
          // Small delay before starting animation to ensure everything is ready
          // This is critical when DevTools is closed (code runs faster)
          await new Promise((resolve) => {
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                resolve(undefined);
              });
            });
          });

          if (cancelled) return;

          const startTime = performance.now();

          const drawFrame = (currentTime: number) => {
            if (cancelled) return;

            // Clear canvas
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);

            const elapsed = currentTime - startTime;

            // Draw each tile with fade-in animation
            for (let i = 0; i < tiles.length; i++) {
              const tile = tiles[i];

              // Calculate when this tile should start animating (staggered)
              const tileStartTime = i * staggerDelay;
              const tileElapsed = elapsed - tileStartTime;

              if (tileElapsed < 0) {
                // Tile hasn't started animating yet
                continue;
              }

              // Calculate opacity (0 to 1) using ease-out curve
              let opacity = Math.min(1, tileElapsed / animationDuration);
              // Apply ease-out easing function
              opacity = 1 - Math.pow(1 - opacity, 3);

              if (opacity > 0) {
                // Save context state
                ctx.save();

                // Set global alpha for fade effect
                ctx.globalAlpha = opacity;

                // Draw the tile
                ctx.drawImage(
                  img,
                  tile.sx,
                  tile.sy,
                  tileWidth,
                  tileHeight, // Source rectangle
                  tile.dx,
                  tile.dy,
                  tileWidth,
                  tileHeight, // Destination rectangle
                );

                // Restore context state
                ctx.restore();
              }
            }

            // Update animation progress
            const totalDuration =
              tiles.length * staggerDelay + animationDuration;
            const progress = Math.min(1, elapsed / totalDuration);
            setAnimationProgress(progress);

            // Check if animation is complete
            const lastTileStartTime = (tiles.length - 1) * staggerDelay;
            if (elapsed >= lastTileStartTime + animationDuration) {
              // Draw all tiles at full opacity to ensure nothing is missing
              ctx.clearRect(0, 0, canvasWidth, canvasHeight);
              for (const tile of tiles) {
                ctx.drawImage(
                  img,
                  tile.sx,
                  tile.sy,
                  tileWidth,
                  tileHeight,
                  tile.dx,
                  tile.dy,
                  tileWidth,
                  tileHeight,
                );
              }
              setAnimationProgress(1);
              setLoading(false);
            } else {
              // Continue animation
              animationFrameRef.current = requestAnimationFrame(drawFrame);
            }
          };

          // Start animation - hide loading overlay when animation begins
          setAnimationStarted(true);
          animationFrameRef.current = requestAnimationFrame(drawFrame);
        } else {
          // Non-animated drawing (instant) - hide loading overlay when drawing starts
          setAnimationStarted(true);

          for (const tile of tiles) {
            ctx.drawImage(
              img,
              tile.sx,
              tile.sy,
              tileWidth,
              tileHeight,
              tile.dx,
              tile.dy,
              tileWidth,
              tileHeight,
            );
          }

          setLoading(false);
        }
      } catch (err) {
        const error = err as Error;
        if (!cancelled) {
          setError(
            error?.message ?? "Unknown error occurred while unscrambling image",
          );
          setLoading(false);
        }
      }
    }

    // Execute the unscrambling process
    loadAndUnscrambleImage();

    // Cleanup function to cancel ongoing operations
    return () => {
      cancelled = true;
      // Cancel animation frame if it's running
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      // Revoke blob URL to free memory
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
    };
  }, [mediaId, src, animate, animationDuration, staggerDelay]);

  // Always render canvas (even when loading) so ref is available
  // Show skeleton overlay when loading

  // Render error state
  if (error) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-muted/50 border border-destructive/20 rounded-md text-destructive text-sm p-4",
          className,
        )}
        style={{
          minHeight: "200px",
          maxWidth: maxWidth || "100%",
        }}
      >
        <div className="text-center">
          <svg
            className="mx-auto h-8 w-8 mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <p>You have been blocked for suspicious activity.</p>
        </div>
      </div>
    );
  }

  // Always render canvas (even when loading) so ref is available
  // Animation will handle the visual loading state
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <canvas
        ref={canvasRef}
        className="max-w-full h-auto"
        style={{
          maxWidth: maxWidth || "100%",
          maxHeight: maxHeight || "auto",
          backgroundColor: loading ? "transparent" : undefined,
        }}
        aria-label={alt ?? "Unscrambled image"}
        aria-busy={loading}
      />
      {loading && !animationStarted && (
        // Show Lottie loading animation while fetching scramble key and loading image
        // Hide when animation/drawing starts (even if loading is still true)
        <div className="absolute inset-0 flex items-center justify-center bg-muted/30 backdrop-blur-sm z-20">
          <Lottie
            animationData={rainbowCatRemixLoading}
            loop
            autoplay
            style={{
              width: "50%",
              height: "50%",
            }}
          />
        </div>
      )}
    </div>
  );
}
