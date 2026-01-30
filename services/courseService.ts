import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    API_BASE_URL,
    API_ENDPOINTS,
    ApiResponse,
    Course,
    CourseProgress,
    Lesson
} from './apiConfig';

class CourseService {
  private async getHeaders(): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const token = await AsyncStorage.getItem('auth_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  async getAllCourses(): Promise<Course[]> {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.COURSES_LIST}`, {
        method: 'GET',
        headers: await this.getHeaders(),
      });

      const data: ApiResponse<Course[]> = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch courses');
      }

      return data.data || [];
    } catch (error) {
      throw error instanceof Error ? error : new Error('Network error');
    }
  }

  async getCourseById(courseId: string): Promise<Course> {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.COURSE_DETAIL(courseId)}`, {
        method: 'GET',
        headers: await this.getHeaders(),
      });

      const data: ApiResponse<Course> = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch course');
      }

      return data.data!;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Network error');
    }
  }

  async getCourseLessons(courseId: string): Promise<Lesson[]> {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.COURSE_LESSONS(courseId)}`, {
        method: 'GET',
        headers: await this.getHeaders(),
      });

      const data: ApiResponse<Lesson[]> = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch lessons');
      }

      return data.data || [];
    } catch (error) {
      throw error instanceof Error ? error : new Error('Network error');
    }
  }

  async getCourseProgress(courseId: string): Promise<CourseProgress> {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.COURSE_PROGRESS(courseId)}`, {
        method: 'GET',
        headers: await this.getHeaders(),
      });

      const data: ApiResponse<CourseProgress> = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch progress');
      }

      return data.data!;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Network error');
    }
  }

  async updateLessonProgress(
    courseId: string, 
    lessonId: number, 
    completed: boolean, 
    score?: number
  ): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.UPDATE_PROGRESS(courseId)}`, {
        method: 'POST',
        headers: await this.getHeaders(),
        body: JSON.stringify({
          courseId: parseInt(courseId),
          lessonId,
          completed,
          score
        }),
      });

      const data: ApiResponse<null> = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to update progress');
      }
    } catch (error) {
      throw error instanceof Error ? error : new Error('Network error');
    }
  }

  // Mock data for offline/testing purposes
  getMockCourses(): Course[] {
    return [
      {
        id: 1,
        title: 'Python Basics',
        description: 'Learn Python fundamentals',
        category: 'Programming',
        difficulty: 'Beginner',
        thumbnail: 'course-python.png',
        duration: '30 min',
        published: true
      },
      {
        id: 2,
        title: 'React Concepts',
        description: 'Comprehensive React concepts and hooks',
        category: 'Programming',
        difficulty: 'Intermediate',
        thumbnail: 'course-react.png',
        duration: '45 min',
        published: true
      },
      {
        id: 3,
        title: 'Database Fundamentals',
        description: 'SQL queries and database design',
        category: 'Database',
        difficulty: 'Intermediate',
        thumbnail: 'course-react.png',
        duration: '40 min',
        published: true
      }
    ];
  }

  getMockLessons(courseId: number): Lesson[] {
    return [
      {
        id: 1,
        courseId,
        title: 'Introduction',
        content: 'Welcome to the course!',
        lessonType: 'Theory',
        orderNumber: 1,
        duration: '5 min'
      },
      {
        id: 2,
        courseId,
        title: 'Getting Started',
        content: 'Let\'s begin with the basics',
        lessonType: 'Code',
        orderNumber: 2,
        duration: '10 min'
      },
      {
        id: 3,
        courseId,
        title: 'Practice Quiz',
        content: 'Test your knowledge',
        lessonType: 'Quiz',
        orderNumber: 3,
        duration: '15 min'
      }
    ];
  }
}

export default new CourseService();