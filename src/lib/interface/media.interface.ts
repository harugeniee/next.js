import { BaseEntityCustom } from "./base.interface";
import { User } from "./user.interface";

/**
 * Image scrambler metadata for scrambled images
 * Contains information needed to unscramble images on the client side
 */
export interface ImageScramblerMetadata {
  enabled: boolean;
  version: number;
  salt: string;
  tileRows: number;
  tileCols: number;
}

export interface Media extends BaseEntityCustom {
  status?: string;
  name?: string;
  title?: string;
  altText?: string;
  path?: string;
  mimeType?: string;
  extension?: string;
  size: number;
  description?: string;
  type?: string;
  url: string;
  key?: string;
  originalName: string;
  thumbnailUrl: string;
  previewUrl: string;
  large?: string; // Large image URL for thumbnails/covers
  medium?: string; // Medium image URL
  userId?: string;
  user?: User;
  metadata: string; // JSON string for additional media metadata
  storageProvider?: string;
  width?: number;
  height?: number;
  duration?: number; // For video/audio files in seconds
  downloadCount?: number;
  viewCount?: number;
  isPublic?: boolean;
  tags?: string; // JSON array of tags
}
