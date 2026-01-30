// API Configuration
export const API_BASE_URL = 'http://localhost:3000';
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH_REGISTER: '/api/auth/register',
  AUTH_LOGIN: '/api/auth/login',
  AUTH_PROFILE: '/api/auth/profile',
  
  // Course endpoints
  COURSES_LIST: '/api/courses',
  COURSE_DETAIL: (id: string) => `/api/courses/${id}`,
  COURSE_LESSONS: (courseId: string) => `/api/courses/${courseId}/lessons`,
  COURSE_PROGRESS: (courseId: string) => `/api/courses/${courseId}/progress`,
  UPDATE_PROGRESS: (courseId: string) => `/api/courses/${courseId}/progress`,
} as const;

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// Auth Types
export interface User {
  id: number;
  email: string;
  fullName: string;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Course Types
export interface Course {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  thumbnail: string;
  duration: string;
  published: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Lesson {
  id: number;
  courseId: number;
  title: string;
  content?: string;
  videoUrl?: string;
  lessonType: 'Theory' | 'Code' | 'Quiz';
  orderNumber: number;
  duration: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LessonProgress {
  lessonId: number;
  lessonTitle: string;
  lessonType: string;
  completed: boolean;
  score?: number;
}

export interface CourseProgress {
  lessons: LessonProgress[];
  progress: {
    totalLessons: number;
    completedLessons: number;
    progressPercentage: number;
  };
}