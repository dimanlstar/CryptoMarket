
export enum UserRole {
  GUEST = 'guest',
  USER = 'user',
  ADMIN = 'admin'
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  balance: number; // CMK Tokens / Points
  referralCode: string;
  referralReward?: number; // Custom amount of points a new user gets when using this code
  achievements: string[]; // IDs of unlocked achievements
  lastDailyBonus?: string; // ISO Date string of last mining claim
  courseProgress?: Record<string, number>; // Mapping: courseId -> number of completed lessons
  avatar?: string; // URL to user avatar image
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  threshold: number; // Tokens needed to unlock automatically (optional logic)
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  image: string;
  features: string[];
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  date: string;
  fullContent?: string;
}

export interface Course {
  id: string;
  title: string;
  level: 'Beginner' | 'Advanced' | 'Expert';
  lessons: number;
  price: number;
  image: string;
}

export interface ExchangeService {
  id: string;
  title: string;
  features: string[];
  type: 'Partner' | 'CEX' | 'DEX';
}