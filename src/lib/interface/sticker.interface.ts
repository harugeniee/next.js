import type {
  StickerFormat,
  StickerStatus,
  StickerPackStatus,
} from "@/lib/constants/sticker.constants";

export interface Sticker {
  id: string;
  name: string;
  mediaId: string;
  format: StickerFormat;
  size: number;
  width: number;
  height: number;
  isAnimated: boolean;
  status: StickerStatus;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  media?: {
    url: string;
    thumbnailUrl?: string;
  };
}

export interface StickerPack {
  id: string;
  name: string;
  description?: string;
  coverMediaId?: string;
  status: StickerPackStatus;
  stickers: Sticker[];
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  coverMedia?: {
    url: string;
    thumbnailUrl?: string;
  };
}

export interface CreateStickerDto {
  name: string;
  mediaId: string;
  tags?: string[];
  isAnimated?: boolean;
}

export interface UpdateStickerDto {
  name?: string;
  mediaId?: string;
  tags?: string[];
  isAnimated?: boolean;
  status?: StickerStatus;
}

export interface CreateStickerPackDto {
  name: string;
  description?: string;
  coverMediaId?: string;
  status?: StickerPackStatus;
}

export interface UpdateStickerPackDto {
  name?: string;
  description?: string;
  coverMediaId?: string;
  status?: StickerPackStatus;
}

export interface StickerPackItemDto {
  stickerId: string;
}

export interface StickerQueryDto {
  page?: number;
  limit?: number;
  query?: string;
  format?: StickerFormat;
  isAnimated?: boolean;
  status?: StickerStatus;
  tags?: string[];
}

export interface StickerPackQueryDto {
  page?: number;
  limit?: number;
  query?: string;
  status?: StickerPackStatus;
}
