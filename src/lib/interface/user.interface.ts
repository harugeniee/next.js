import { BaseEntityCustom } from "./base.interface";
import { Media } from "./media.interface";

export interface User extends BaseEntityCustom {
  name?: string;
  username?: string;
  status?: string;
  role?: string;
  email?: string;
  dob?: Date;
  phoneNumber?: string;
  password?: string;
  oauthProvider?: string; // google, facebook, github, etc.
  oauthId?: string; // Unique ID from OAuth provider
  firebaseUid?: string; // Firebase UID
  photoUrl?: string; // Profile photo URL from Firebase
  authMethod?: string; // email_password, oauth, phone_otp
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  avatarId?: string;
  avatar?: Media; // Avatar media
}

export interface AuthorCardData {
  id: string;
  name: string;
  bio?: string;
  website?: string;
  avatar?: string;
  socialLinks?: {
    github?: string;
    x?: string;
    instagram?: string;
    rss?: string;
  };
  stats?: {
    followers?: number;
    articles?: number;
  };
}
