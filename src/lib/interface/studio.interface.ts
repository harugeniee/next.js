import type { StudioStatus, StudioType } from "@/lib/constants/studio.constants";

export interface Studio {
  id: string;
  name: string;
  myAnimeListId?: string;
  aniListId?: string;
  type?: StudioType;
  siteUrl?: string;
  status?: StudioStatus;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  seriesRoles?: Array<{
    id: string;
    role: string;
    seriesId: string;
  }>;
}

export interface CreateStudioDto {
  name: string;
  myAnimeListId?: string;
  aniListId?: string;
  type?: StudioType;
  siteUrl?: string;
  status?: StudioStatus;
  metadata?: Record<string, unknown>;
}

export interface UpdateStudioDto {
  name?: string;
  myAnimeListId?: string;
  aniListId?: string;
  type?: StudioType;
  siteUrl?: string;
  status?: StudioStatus;
  metadata?: Record<string, unknown>;
}

export interface StudioQueryDto {
  page?: number;
  limit?: number;
  query?: string;
  type?: StudioType;
  status?: StudioStatus;
}

