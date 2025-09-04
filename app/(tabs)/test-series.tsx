import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
    Alert,
    Dimensions,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

const { width } = Dimensions.get("window");

// Test Series data structure
interface TestSeries {
  id: string;
  title: string;
  description: string;
  duration: string;
  questions: number;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  image: any;
  isCompleted?: boolean;
  score?: number;
}

// Mock test series data
const testSeriesData: TestSeries[] = [
  {
    id: "ts1",
    title: "Python Basics Quiz",
    description: "Test your understanding of Python fundamentals",
    duration: "30 min",
    questions: 25,
    difficulty: "Easy",
    category: "Python",
    image: require("@/assets/images/home/course-python.png"),
    isCompleted: false,
  },
  {
    id: "ts2", 
    title: "React Concepts Test",
    description: "Comprehensive test on React concepts and hooks",
    duration: "45 min",
    questions: 30,
    difficulty: "Medium",
    category: "React",
    image: require("@/assets/images/home/course-react.png"),
    isCompleted: true,
    score: 85,
  },
  {
    id: "ts3",
    title: "Advanced Python",
    description: "Advanced Python programming concepts and patterns",
    duration: "60 min", 
    questions: 40,
    difficulty: "Hard",
    category: "Python",
    image: require("@/assets/images/home/course-python.png"),
    isCompleted: false,
  },
  {
    id: "ts4",
    title: "Database Fundamentals",
    description: "SQL queries, database design and optimization",
    duration: "40 min",
    questions: 35,
    difficulty: "Medium", 
    category: "Database",
    image: require("@/assets/images/home/course-react.png"),
    isCompleted: false,
  },
  {
    id: "ts5",
    title: "React Native Mastery",
    description: "Mobile app development with React Native",
    duration: "50 min",
    questions: 35,
    difficulty: "Hard",
    category: "React Native",
    image: require("@/assets/images/home/course-python.png"),
    isCompleted: false,
  },
];

// Test Series Card Component
interface TestSeriesCardProps {
  testSeries: TestSeries;
  onPress: () => void;
}

const TestSeriesCard: React.FC<TestSeriesCardProps> = ({ testSeries, onPress }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "#10B981";
      case "Medium":
        return "#F59E0B";
      case "Hard":
        return "#EF4444";
      default:
        return Colors.light.text;
    }
  };

  return (
    <TouchableOpacity style={styles.testCard} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.testImageContainer}>
        <Image source={testSeries.image} style={styles.testImage} resizeMode="cover" />
        {testSeries.isCompleted && (
          <View style={styles.completedBadge}>
            <Ionicons name="checkmark-circle" size={24} color="#10B981" />
          </View>
        )}
      </View>
      
      <View style={styles.testContent}>
        <View style={styles.testHeader}>
          <ThemedText style={styles.testTitle}>{testSeries.title}</ThemedText>
          <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(testSeries.difficulty) }]}>
            <ThemedText style={styles.difficultyText}>{testSeries.difficulty}</ThemedText>
          </View>
        </View>
        
        <ThemedText style={styles.testDescription}>{testSeries.description}</ThemedText>
        
        <View style={styles.testStats}>
          <View style={styles.statItem}>
            <Ionicons name="time-outline" size={16} color={Colors.light.icon} />
            <ThemedText style={styles.statText}>{testSeries.duration}</ThemedText>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="help-circle-outline" size={16} color={Colors.light.icon} />
            <ThemedText style={styles.statText}>{testSeries.questions} Questions</ThemedText>
          </View>
        </View>
        
        {testSeries.isCompleted && testSeries.score && (
          <View style={styles.scoreContainer}>
            <ThemedText style={styles.scoreText}>Score: {testSeries.score}%</ThemedText>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default function TestSeriesScreen() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [completedTests, setCompletedTests] = useState<Set<string>>(new Set());

  // Check authentication status when screen comes into focus
  const checkAuthStatus = useCallback(async () => {
    try {
      const userToken = await AsyncStorage.getItem('user_token');
      const userSession = await AsyncStorage.getItem('user_session');
      
      if (!userToken || !userSession) {
        router.replace('/pages/Login');
        return;
      }
      
      const session = JSON.parse(userSession);
      if (!session.isAuthenticated) {
        router.replace('/pages/Login');
        return;
      }
      
      setIsCheckingAuth(false);
    } catch (error) {
      console.error('Error checking auth status:', error);
      router.replace('/pages/Login');
    }
  }, [router]);

  // Load completed test series
  const loadCompletedTests = useCallback(async () => {
    try {
      const completionData = await AsyncStorage.getItem('test_completions');
      const completions = completionData ? JSON.parse(completionData) : {};
      const completedIds = new Set(Object.keys(completions));
      setCompletedTests(completedIds);
    } catch (error) {
      console.error('Error loading completed tests:', error);
    }
  }, []);

  // Check auth on screen focus
  useFocusEffect(
    useCallback(() => {
      checkAuthStatus();
      loadCompletedTests();
    }, [checkAuthStatus, loadCompletedTests])
  );

  // Show loading while checking authentication
  if (isCheckingAuth) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ThemedText style={styles.loadingText}>Checking authentication...</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  const handleTestPress = (testId: string) => {
    Alert.alert(
      "Start Test",
      "Test functionality will be implemented soon. This will navigate to the test interface.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Start Test",
          onPress: () => {
            console.log("Starting test:", testId);
            // TODO: Navigate to test interface
            // router.push(`/pages/TestInterface?testId=${testId}`);
          },
        },
      ]
    );
  };

  const renderTestsByCategory = (category: string, tests: TestSeries[]) => {
    const categoryTests = tests.filter(test => test.category === category);
    if (categoryTests.length === 0) return null;

    return (
      <View style={styles.categorySection} key={category}>
        <ThemedText style={styles.categoryTitle}>{category} Tests</ThemedText>
        {categoryTests.map((test) => (
          <TestSeriesCard
            key={test.id}
            testSeries={test}
            onPress={() => handleTestPress(test.id)}
          />
        ))}
      </View>
    );
  };

  const categories = [...new Set(testSeriesData.map(test => test.category))];
  const completedTestsCount = testSeriesData.filter(test => test.isCompleted).length;
  const totalTests = testSeriesData.length;

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
            <ThemedText style={styles.greeting}>Test Your Knowledge</ThemedText>
            <ThemedText style={styles.subtitle}>Challenge yourself with our test series</ThemedText>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Ionicons name="trophy-outline" size={24} color="#F59E0B" />
              <ThemedText style={styles.statNumber}>{completedTestsCount}</ThemedText>
              <ThemedText style={styles.statLabel}>Completed</ThemedText>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="document-text-outline" size={24} color="#1D92FF" />
              <ThemedText style={styles.statNumber}>{totalTests}</ThemedText>
              <ThemedText style={styles.statLabel}>Total Tests</ThemedText>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="trending-up-outline" size={24} color="#10B981" />
              <ThemedText style={styles.statNumber}>{Math.round((completedTestsCount / totalTests) * 100)}%</ThemedText>
              <ThemedText style={styles.statLabel}>Progress</ThemedText>
            </View>
          </View>
        </View>

        {/* Test Series by Category */}
        {categories.map(category => renderTestsByCategory(category, testSeriesData))}
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F6F8FC",
  },
  loadingText: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.light.text,
  },
  header: {
    paddingHorizontal: 30,
    paddingTop: 20,
    paddingBottom: 20,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.light.text,
    marginBottom: 4,
    marginTop: 30,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "400",
    color: Colors.light.icon,
  },
  statsSection: {
    paddingHorizontal: 30,
    marginBottom: 25,
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: Colors.light.background,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.light.text,
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.light.icon,
    textAlign: "center",
  },
  categorySection: {
    paddingHorizontal: 30,
    marginBottom: 25,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.light.text,
    marginBottom: 15,
  },
  testCard: {
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    overflow: "hidden",
  },
  testImageContainer: {
    position: "relative",
    height: 120,
  },
  testImage: {
    width: "100%",
    height: "100%",
  },
  completedBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: Colors.light.background,
    borderRadius: 20,
    padding: 4,
  },
  testContent: {
    padding: 16,
  },
  testHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  testTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.light.text,
    flex: 1,
    marginRight: 10,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.light.background,
  },
  testDescription: {
    fontSize: 14,
    color: Colors.light.icon,
    marginBottom: 12,
    lineHeight: 20,
  },
  testStats: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 8,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: Colors.light.icon,
  },
  scoreContainer: {
    backgroundColor: "#F0FDF4",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  scoreText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#10B981",
  },
});