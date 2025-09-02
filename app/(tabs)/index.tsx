import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

const { width } = Dimensions.get("window");

// Course data structure
interface Course {
  id: string;
  title: string;
  lessons: number;
  image: any;
  category: string;
}

const courseData: Course[] = [
  {
    id: "1",
    title: "Basic Python",
    lessons: 15,
    image: require("@/assets/images/home/course-python.png"),
    category: "basic",
  },
  {
    id: "2",
    title: "Basic React Js",
    lessons: 15,
    image: require("@/assets/images/home/course-react.png"),
    category: "basic",
  },
  {
    id: "3",
    title: "React Native",
    lessons: 15,
    image: require("@/assets/images/home/course-python.png"),
    category: "basic",
  },
  {
    id: "4",
    title: "MySQL",
    lessons: 15,
    image: require("@/assets/images/home/course-react.png"),
    category: "basic",
  },
  {
    id: "5",
    title: "Advanced Python",
    lessons: 20,
    image: require("@/assets/images/home/course-python.png"),
    category: "advanced",
  },
  {
    id: "6",
    title: "Advanced React",
    lessons: 25,
    image: require("@/assets/images/home/course-react.png"),
    category: "advanced",
  },
];

const videoCoursesData = [
  {
    id: "v1",
    title: "Disney App Clone",
    image: require("@/assets/images/home/video-course-1.png"),
  },
  {
    id: "v2",
    title: "Hulu Clone",
    image: require("@/assets/images/home/video-course-2.png"),
  },
];

// Skeleton Component
const SkeletonCard = () => (
  <View style={styles.skeletonCard}>
    <View style={styles.skeletonImage} />
    <View style={styles.skeletonContent}>
      <View style={styles.skeletonTitle} />
      <View style={styles.skeletonSubtitle} />
    </View>
  </View>
);

// Course Card Component
interface CourseCardProps {
  course: Course;
  onPress?: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onPress }) => (
  <TouchableOpacity style={styles.courseCard} onPress={onPress} activeOpacity={0.8}>
    <Image source={course.image} style={styles.courseImage} resizeMode="cover" />
    <View style={styles.courseContent}>
      <ThemedText style={styles.courseTitle}>{course.title}</ThemedText>
      <ThemedText style={styles.courseLessons}>{course.lessons} Lessons</ThemedText>
    </View>
  </TouchableOpacity>
);

// Video Course Card Component
interface VideoCardProps {
  course: { id: string; title: string; image: any };
  onPress?: () => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ course, onPress }) => (
  <TouchableOpacity style={styles.videoCard} onPress={onPress} activeOpacity={0.8}>
    <Image source={course.image} style={styles.videoImage} resizeMode="cover" />
  </TouchableOpacity>
);

// Collapsible Section Component
interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  children,
  defaultExpanded = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <View style={styles.sectionContainer}>
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.7}
      >
        <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
        <Ionicons
          name={isExpanded ? "chevron-down" : "chevron-forward"}
          size={20}
          color={Colors.light.text}
        />
      </TouchableOpacity>
      {isExpanded && <View style={styles.sectionContent}>{children}</View>}
    </View>
  );
};

export default function HomeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const handleCoursePress = (courseId: string) => {
    console.log("Course pressed:", courseId);
    router.push(`/pages/CourseDetails?courseId=${courseId}`);
  };

  const handleVideoCoursePress = (courseId: string) => {
    console.log("Video course pressed:", courseId);
    router.push(`/pages/VideoCourseDetails?courseId=${courseId}`);
  };

  const handleProfilePress = () => {
    console.log("Profile pressed");
    router.push("/pages/UserProfile");
  };

  const renderCourseGrid = (courses: Course[]) => {
    if (isLoading) {
      return (
        <View style={styles.courseGrid}>
          {[1, 2, 3, 4].map((item) => (
            <SkeletonCard key={item} />
          ))}
        </View>
      );
    }

    return (
      <View style={styles.courseGrid}>
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            onPress={() => handleCoursePress(course.id)}
          />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <ThemedText style={styles.greeting}>Hello</ThemedText>
            <ThemedText style={styles.userName}>Rahul Sanap</ThemedText>
          </View>
          <TouchableOpacity onPress={handleProfilePress} activeOpacity={0.8}>
            <Image
              source={require("@/assets/images/home/user-profile.png")}
              style={styles.profileImage}
              resizeMode="cover"
            />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons
              name="search"
              size={20}
              color={Colors.light.icon}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor={Colors.light.icon}
              value={searchQuery}
              onChangeText={handleSearch}
            />
          </View>
        </View>

        {/* Hero Banner */}
        <View style={styles.heroBannerContainer}>
          <Image
            source={require("@/assets/images/home/hero-banner.png")}
            style={styles.heroBanner}
            resizeMode="cover"
          />
        </View>

        {/* Video Courses Section */}
        <CollapsibleSection title="Video Course">
          <View style={styles.videoCoursesContainer}>
            {videoCoursesData.map((course) => (
              <VideoCard
                key={course.id}
                course={course}
                onPress={() => handleVideoCoursePress(course.id)}
              />
            ))}
          </View>
        </CollapsibleSection>

        {/* Basic Popular Courses Section */}
        <CollapsibleSection title="Basic Popular Course">
          {renderCourseGrid(courseData.filter((course) => course.category === "basic"))}
        </CollapsibleSection>

        {/* Advanced Courses Section */}
        <CollapsibleSection title="Advance Courses">
          {renderCourseGrid(courseData.filter((course) => course.category === "advanced"))}
        </CollapsibleSection>
      </ScrollView>
    </SafeAreaView>
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
    paddingBottom: 10,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 12,
    fontWeight: "400",
    color: Colors.light.text,
    marginBottom: 4,
  },
  userName: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.text,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  searchContainer: {
    paddingHorizontal: 30,
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.background,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.09,
    shadowRadius: 4,
    elevation: 4,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.light.text,
  },
  heroBannerContainer: {
    paddingHorizontal: 30,
    marginBottom: 25,
  },
  heroBanner: {
    width: "100%",
    height: (width - 60) * 0.42, // Maintain aspect ratio
    borderRadius: 10,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.light.text,
  },
  sectionContent: {
    paddingHorizontal: 30,
  },
  videoCoursesContainer: {
    flexDirection: "row",
    gap: 12,
  },
  videoCard: {
    flex: 1,
    borderRadius: 5,
    overflow: "hidden",
  },
  videoImage: {
    width: "100%",
    height: (width - 84) / 2 * 0.56, // 16:9 aspect ratio for video cards
    borderRadius: 5,
  },
  courseGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
    justifyContent: "space-between",
  },
  courseCard: {
    width: (width - 75) / 2, // Responsive width for 2 columns
    backgroundColor: Colors.light.background,
    borderRadius: 6,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    overflow: "hidden",
  },
  courseImage: {
    width: "100%",
    height: (width - 75) / 2 * 0.7, // Responsive height
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  courseContent: {
    padding: 12,
    backgroundColor: Colors.light.background,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
  },
  courseTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.light.text,
    marginBottom: 4,
  },
  courseLessons: {
    fontSize: 9,
    fontWeight: "300",
    color: Colors.light.text,
  },
  // Skeleton Styles
  skeletonCard: {
    width: (width - 75) / 2,
    backgroundColor: Colors.light.background,
    borderRadius: 6,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    overflow: "hidden",
  },
  skeletonImage: {
    width: "100%",
    height: (width - 75) / 2 * 0.7,
    backgroundColor: "#E1E5E9",
  },
  skeletonContent: {
    padding: 12,
  },
  skeletonTitle: {
    height: 12,
    backgroundColor: "#E1E5E9",
    borderRadius: 4,
    marginBottom: 8,
    width: "80%",
  },
  skeletonSubtitle: {
    height: 9,
    backgroundColor: "#E1E5E9",
    borderRadius: 4,
    width: "60%",
  },
});
