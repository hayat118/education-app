import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { Lesson as ApiLesson, Course } from '@/services/apiConfig';
import courseService from '@/services/courseService';
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

// Lesson interface
interface Lesson {
  id: string;
  title: string;
  number: string;
  duration?: string;
  apiLesson?: ApiLesson;
}

// Map API course to local course format
const mapApiCourseToLocal = (apiCourse: Course, apiLessons: ApiLesson[]): any => {
  return {
    id: apiCourse.id.toString(),
    title: apiCourse.title,
    author: "Tubeguruji",
    description: apiCourse.description,
    totalLessons: apiLessons.length,
    category: apiCourse.category.toLowerCase(),
    image: require("@/assets/images/home/course-detail-hero.png"),
    lessons: apiLessons.map((lesson, index) => ({
      id: lesson.id.toString(),
      title: lesson.title,
      number: (index + 1).toString().padStart(2, '0'),
      duration: lesson.duration,
      apiLesson: lesson
    }))
  };
};

// Lesson Item Component
interface LessonItemProps {
  lesson: Lesson;
  onPress: () => void;
  isCompleted?: boolean;
  courseId: string;
}

const LessonItem: React.FC<LessonItemProps> = ({ lesson, onPress, isCompleted = false, courseId }) => (
  <TouchableOpacity style={styles.lessonItem} onPress={onPress} activeOpacity={0.8}>
    <View style={styles.lessonNumber}>
      <ThemedText style={styles.lessonNumberText}>{lesson.number}</ThemedText>
    </View>
    <View style={styles.lessonContent}>
      <ThemedText style={styles.lessonTitle}>{lesson.title}</ThemedText>
    </View>
    <View style={styles.lessonActions}>
      {isCompleted && (
        <View style={styles.completedIcon}>
          <Ionicons name="checkmark-circle" size={20} color="#10B981" />
        </View>
      )}
      <TouchableOpacity style={styles.playButton} onPress={onPress}>
        <Ionicons name="play-circle" size={24} color="#1D92FF" />
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
);

export default function CourseDetails() {
  const router = useRouter();
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [courseDetail, setCourseDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch course details from API
  const fetchCourseDetails = useCallback(async () => {
    if (!courseId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Try to fetch from API first
      const [apiCourse, apiLessons] = await Promise.all([
        courseService.getCourseById(courseId),
        courseService.getCourseLessons(courseId)
      ]);
      
      const mappedCourse = mapApiCourseToLocal(apiCourse, apiLessons);
      setCourseDetail(mappedCourse);
      
    } catch (err) {
      console.warn('API fetch failed, using mock data:', err);
      // Fallback to mock data
      const mockCourses = courseService.getMockCourses();
      const mockCourse = mockCourses.find(c => c.id.toString() === courseId);
      
      if (mockCourse) {
        const mockLessons = courseService.getMockLessons(mockCourse.id);
        const mappedCourse = mapApiCourseToLocal(mockCourse, mockLessons);
        setCourseDetail(mappedCourse);
      } else {
        setError('Course not found');
      }
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  // Load completed lessons on component mount and when returning from lesson
  const loadCompletedLessons = useCallback(async () => {
    if (!courseId) return;
    
    try {
      const completionData = await AsyncStorage.getItem('lesson_completions');
      const completions = completionData ? JSON.parse(completionData) : {};
      
      const completedLessonIds = new Set<string>();
      Object.keys(completions).forEach(key => {
        const [cId, lessonId] = key.split('-');
        if (cId === courseId && completions[key].completed) {
          completedLessonIds.add(lessonId);
        }
      });
      
      setCompletedLessons(completedLessonIds);
    } catch (error) {
      console.error('Error loading completed lessons:', error);
    }
  }, [courseId]);

  // Load course details and completions on mount
  useEffect(() => {
    fetchCourseDetails();
    loadCompletedLessons();
  }, [fetchCourseDetails, loadCompletedLessons]);

  // Reload when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadCompletedLessons();
    }, [loadCompletedLessons])
  );

  const handleBack = () => {
    router.back();
  };

  const handleMoreOptions = () => {
    console.log("More options pressed");
    // More options functionality will be implemented later
  };

  const handleLessonPlay = (lessonId: string) => {
    console.log("Play lesson:", lessonId);
    router.push(`/pages/LessonContent?courseId=${courseId}&lessonId=${lessonId}`);
  };

  if (loading) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <SafeAreaView style={styles.container}>
          <View style={styles.loadingContainer}>
            <ThemedText style={styles.loadingText}>Loading course...</ThemedText>
          </View>
        </SafeAreaView>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <SafeAreaView style={styles.container}>
          <View style={styles.errorContainer}>
            <ThemedText style={styles.errorText}>{error}</ThemedText>
            <TouchableOpacity style={styles.retryButton} onPress={fetchCourseDetails}>
              <ThemedText style={styles.retryButtonText}>Retry</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <ThemedText style={styles.backButtonText}>Go Back</ThemedText>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </>
    );
  }

  if (!courseDetail) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <SafeAreaView style={styles.container}>
          <View style={styles.errorContainer}>
            <ThemedText style={styles.errorText}>Course not found</ThemedText>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <ThemedText style={styles.backButtonText}>Go Back</ThemedText>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={24} style={{marginTop:20}} color={Colors.light.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleMoreOptions} activeOpacity={0.7}>
            <Ionicons name="ellipsis-vertical" size={24} color={Colors.light.text} />
          </TouchableOpacity>
        </View>

        {/* Course Title and Author */}
        <View style={styles.titleSection}>
          <ThemedText style={styles.courseTitle}>{courseDetail.title}</ThemedText>
          <ThemedText style={styles.courseAuthor}>By {courseDetail.author}</ThemedText>
        </View>

        {/* Hero Image */}
        <View style={styles.heroImageContainer}>
          <Image
            source={courseDetail.image}
            style={styles.heroImage}
            resizeMode="cover"
          />
        </View>

        {/* About Course Section */}
        <View style={styles.aboutSection}>
          <ThemedText style={styles.sectionTitle}>About Course</ThemedText>
          <ThemedText style={styles.courseDescription}>
            {courseDetail.description}
          </ThemedText>
        </View>

        {/* Course Content Section */}
        <View style={styles.courseContentSection}>
          <ThemedText style={styles.sectionTitle}>Course Content</ThemedText>
          <View style={styles.lessonsList}>
            {courseDetail.lessons.map((lesson: Lesson) => (
              <LessonItem
                key={lesson.id}
                lesson={lesson}
                courseId={courseId || ''}
                isCompleted={completedLessons.has(lesson.id)}
                onPress={() => handleLessonPlay(lesson.id)}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F8FC",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingTop: 20,
    paddingBottom: 15,
  },
  titleSection: {
    paddingHorizontal: 30,
    marginBottom: 20,
  },
  courseTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 5,
  },
  courseAuthor: {
    fontSize: 12,
    fontWeight: "400",
    color: Colors.light.text,
  },
  heroImageContainer: {
    paddingHorizontal: 30,
    marginBottom: 25,
  },
  heroImage: {
    width: "100%",
    height: (width - 60) * 0.5, // Maintain aspect ratio
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  aboutSection: {
    paddingHorizontal: 30,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.light.text,
    marginBottom: 12,
  },
  courseDescription: {
    fontSize: 13,
    fontWeight: "300",
    color: Colors.light.text,
    lineHeight: 20,
  },
  courseContentSection: {
    paddingHorizontal: 30,
    marginBottom: 25,
  },
  lessonsList: {
    gap: 10,
  },
  lessonItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.background,
    borderRadius: 5,
    paddingVertical: 18,
    paddingHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  lessonNumber: {
    width: 50,
    alignItems: "center",
  },
  lessonNumberText: {
    fontSize: 25,
    fontWeight: "700",
    color: "rgba(0, 0, 0, 0.29)",
  },
  lessonContent: {
    flex: 1,
    marginLeft: 10,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.light.text,
  },
  lessonActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  completedIcon: {
    marginRight: 4,
  },
  playButton: {
    padding: 5,
  },
  relatedCourseSection: {
    paddingHorizontal: 30,
    alignItems: "center",
  },
  relatedCourseCard: {
    backgroundColor: Colors.light.background,
    borderRadius: 5,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: "center",
    minWidth: 158,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  relatedCourseTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.light.text,
    marginBottom: 3,
  },
  relatedCourseLessons: {
    fontSize: 9,
    fontWeight: "300",
    color: Colors.light.text,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.light.text,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  errorText: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 20,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#F59E0B",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  retryButtonText: {
    color: "white",
    fontWeight: "600",
  },
  backButton: {
    backgroundColor: Colors.light.tint,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: "white",
    fontWeight: "600",
  },
});