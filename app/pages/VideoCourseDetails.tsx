import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
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

// Video Lesson interface
interface VideoLesson {
  id: string;
  title: string;
  number: string;
  duration?: string;
  isCompleted?: boolean;
}

// Video Course detail interface
interface VideoCourseDetail {
  id: string;
  title: string;
  author: string;
  description: string;
  lessons: VideoLesson[];
  bannerImage: any;
  totalLessons: number;
  category: string;
}

// Video course data structure based on Figma design
const videoCourseData: { [key: string]: VideoCourseDetail } = {
  "v1": {
    id: "v1",
    title: "Disney Clone",
    author: "Tubeguruji",
    description:
      "Python is a general-purpose, high-level programming language. Its design philosophy emphasizes code readability with its notable use of significant whitespace.",
    totalLessons: 5,
    category: "video",
    bannerImage: require("@/assets/images/video-courses/video-course-banner.png"),
    lessons: [
      { id: "1", title: "Introduction", number: "01" },
      { id: "2", title: "Variables", number: "02" },
      { id: "3", title: "Data Types", number: "03" },
      { id: "4", title: "Numbers", number: "04" },
      { id: "5", title: "Casting", number: "05" },
    ],
  },
};

// Video Lesson Item Component
interface VideoLessonItemProps {
  lesson: VideoLesson;
  onPress: () => void;
  isCompleted?: boolean;
  courseId: string;
}

const VideoLessonItem: React.FC<VideoLessonItemProps> = ({ lesson, onPress, isCompleted = false, courseId }) => (
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
          <Ionicons name="checkmark-circle" size={20} color="#0CD650" />
        </View>
      )}
      <TouchableOpacity style={styles.playButton} onPress={onPress}>
        <Ionicons name="play-circle" size={24} color="#1D92FF" />
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
);

export default function VideoCourseDetails() {
  const router = useRouter();
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  // Get video course details based on courseId
  const courseDetail = courseId ? videoCourseData[courseId] : null;

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

  // Load completions on mount
  useEffect(() => {
    loadCompletedLessons();
  }, [loadCompletedLessons]);

  // Reload completions when screen comes into focus
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
    console.log("Play video lesson:", lessonId);
    router.push(`/pages/LessonContent?courseId=${courseId}&lessonId=${lessonId}`);
  };

  const handleVideoPlay = () => {
    console.log("Play video course");
    // Video playback functionality will be implemented later
  };

  if (!courseDetail) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <SafeAreaView style={styles.container}>
          <View style={styles.errorContainer}>
            <ThemedText style={styles.errorText}>Video Course not found</ThemedText>
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
            <Ionicons name="arrow-back" size={24} color={Colors.light.text} />
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

        {/* Video Banner with Play Button */}
        <View style={styles.videoBannerContainer}>
          <Image
            source={courseDetail.bannerImage}
            style={styles.videoBanner}
            resizeMode="cover"
          />
          <View style={styles.videoOverlay} />
          <TouchableOpacity 
            style={styles.videoPlayButton} 
            onPress={handleVideoPlay}
            activeOpacity={0.8}
          >
            <Ionicons name="play-circle" size={50} color="rgba(255, 255, 255, 0.9)" />
          </TouchableOpacity>
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
            {courseDetail.lessons.map((lesson) => (
              <VideoLessonItem
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
  videoBannerContainer: {
    position: "relative",
    paddingHorizontal: 28,
    marginBottom: 25,
  },
  videoBanner: {
    width: "100%",
    height: (width - 56) * 0.527, // Maintain aspect ratio based on design
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
  videoOverlay: {
    position: "absolute",
    top: 0,
    left: 28,
    right: 28,
    bottom: 0,
    backgroundColor: "rgba(23, 22, 22, 0.26)",
    borderRadius: 10,
  },
  videoPlayButton: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -25,
    marginLeft: -25,
    zIndex: 1,
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