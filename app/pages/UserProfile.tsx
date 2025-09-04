import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Dimensions,
    Image,
    SafeAreaView,
    ScrollView,
    Share,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

const { width } = Dimensions.get("window");

// User profile data interface
interface UserProfile {
  name: string;
  email: string;
  joinDate: string;
  coursesCompleted: number;
  totalLessons: number;
  learningStreak: number;
  profileImage: any;
}

// Mock user data
const userData: UserProfile = {
  name: "Rahul Sanap",
  email: "rahul.sanap@example.com",
  joinDate: "January 2024",
  coursesCompleted: 3,
  totalLessons: 42,
  learningStreak: 15,
  profileImage: require("@/assets/images/home/user-profile.png"),
};

// Profile menu item interface
interface ProfileMenuItem {
  id: string;
  title: string;
  icon: string;
  action: () => void;
  showArrow?: boolean;
  color?: string;
}

export default function UserProfile() {
  const router = useRouter();
  const [completionStats, setCompletionStats] = useState({
    completedLessons: 0,
    totalCourses: 6,
  });

  // Load completion statistics
  useEffect(() => {
    const loadCompletionStats = async () => {
      try {
        const completionData = await AsyncStorage.getItem('lesson_completions');
        const completions = completionData ? JSON.parse(completionData) : {};
        const completedCount = Object.keys(completions).length;
        setCompletionStats(prev => ({
          ...prev,
          completedLessons: completedCount,
        }));
      } catch (error) {
        console.error('Error loading completion stats:', error);
      }
    };

    loadCompletionStats();
  }, []);

  const handleBack = () => {
    router.back();
  };

  const handleEditProfile = () => {
    Alert.alert(
      "Edit Profile",
      "Profile editing functionality will be implemented soon.",
      [{ text: "OK" }]
    );
  };

  const handleSettings = () => {
    Alert.alert(
      "Settings",
      "Settings page will be implemented soon.",
      [{ text: "OK" }]
    );
  };

  const handleNotifications = () => {
    Alert.alert(
      "Notifications",
      "Notification settings will be implemented soon.",
      [{ text: "OK" }]
    );
  };

  const handleHelp = () => {
    Alert.alert(
      "Help & Support",
      "Help and support features will be implemented soon.",
      [{ text: "OK" }]
    );
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: "Check out this amazing education app! Join me in learning new skills.",
        title: "Education App",
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleClearData = () => {
    Alert.alert(
      "Clear Learning Data",
      "This will remove all your progress and completed lessons. This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear Data",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('lesson_completions');
              setCompletionStats(prev => ({
                ...prev,
                completedLessons: 0,
              }));
              Alert.alert("Success", "Learning data has been cleared.");
            } catch (error) {
              Alert.alert("Error", "Failed to clear data. Please try again.");
            }
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout? You will need to sign in again to access the app.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              // Clear all user session data
              await AsyncStorage.multiRemove([
                'user_session',
                'user_token',
                'auto_login',
                'user_preferences'
              ]);
              
              // Show logout success message
              Alert.alert(
                "Logged Out",
                "You have been successfully logged out. Please sign in to continue.",
                [
                  {
                    text: "OK",
                    onPress: () => {
                      // Replace with login screen - user cannot go back
                      router.replace("/pages/Login");
                    }
                  }
                ]
              );
            } catch (error) {
              console.error('Error during logout:', error);
              Alert.alert(
                "Logout Error",
                "There was an error logging out. Please try again.",
                [
                  {
                    text: "Retry",
                    onPress: handleLogout
                  },
                  {
                    text: "Force Logout",
                    style: "destructive",
                    onPress: () => router.replace("/pages/Login")
                  }
                ]
              );
            }
          },
        },
      ]
    );
  };

  // Profile menu items
  const profileMenuItems: ProfileMenuItem[] = [
    {
      id: "edit",
      title: "Edit Profile",
      icon: "person-outline",
      action: handleEditProfile,
      showArrow: true,
    },
    {
      id: "settings",
      title: "Settings",
      icon: "settings-outline",
      action: handleSettings,
      showArrow: true,
    },
    {
      id: "notifications",
      title: "Notifications",
      icon: "notifications-outline",
      action: handleNotifications,
      showArrow: true,
    },
    {
      id: "help",
      title: "Help & Support",
      icon: "help-circle-outline",
      action: handleHelp,
      showArrow: true,
    },
    {
      id: "share",
      title: "Share App",
      icon: "share-outline",
      action: handleShare,
      showArrow: true,
    },
    {
      id: "clear",
      title: "Clear Learning Data",
      icon: "trash-outline",
      action: handleClearData,
      showArrow: true,
      color: "#EF4444",
    },
    {
      id: "logout",
      title: "Logout",
      icon: "log-out-outline",
      action: handleLogout,
      showArrow: false,
      color: "#EF4444",
    },
  ];

  const ProfileMenuItem: React.FC<{ item: ProfileMenuItem }> = ({ item }) => (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={item.action}
      activeOpacity={0.7}
    >
      <View style={styles.menuItemLeft}>
        <Ionicons
          name={item.icon as any}
          size={24}
          color={item.color || Colors.light.text}
          style={styles.menuIcon}
        />
        <ThemedText style={[styles.menuTitle, item.color && { color: item.color }]}>
          {item.title}
        </ThemedText>
      </View>
      {item.showArrow && (
        <Ionicons
          name="chevron-forward"
          size={20}
          color={Colors.light.icon}
        />
      )}
    </TouchableOpacity>
  );

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
            <ThemedText style={styles.headerTitle}>Profile</ThemedText>
            <View style={styles.headerRight} />
          </View>

          {/* Profile Info Section */}
          <View style={styles.profileSection}>
            <View style={styles.profileImageContainer}>
              <Image
                source={userData.profileImage}
                style={styles.profileImage}
                resizeMode="cover"
              />
              <TouchableOpacity
                style={styles.editImageButton}
                onPress={handleEditProfile}
                activeOpacity={0.8}
              >
                <Ionicons name="camera" size={16} color={Colors.light.background} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.profileInfo}>
              <ThemedText style={styles.userName}>{userData.name}</ThemedText>
              <ThemedText style={styles.userEmail}>{userData.email}</ThemedText>
              <ThemedText style={styles.joinDate}>Member since {userData.joinDate}</ThemedText>
            </View>
          </View>

          {/* Stats Section */}
          <View style={styles.statsSection}>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <View style={styles.statIconContainer}>
                  <Ionicons name="book-outline" size={24} color="#1D92FF" />
                </View>
                <ThemedText style={styles.statNumber}>{completionStats.totalCourses}</ThemedText>
                <ThemedText style={styles.statLabel}>Courses</ThemedText>
              </View>
              
              <View style={styles.statItem}>
                <View style={styles.statIconContainer}>
                  <Ionicons name="checkmark-circle-outline" size={24} color="#10B981" />
                </View>
                <ThemedText style={styles.statNumber}>{completionStats.completedLessons}</ThemedText>
                <ThemedText style={styles.statLabel}>Completed</ThemedText>
              </View>
              
              <View style={styles.statItem}>
                <View style={styles.statIconContainer}>
                  <Ionicons name="flame-outline" size={24} color="#F59E0B" />
                </View>
                <ThemedText style={styles.statNumber}>{userData.learningStreak}</ThemedText>
                <ThemedText style={styles.statLabel}>Day Streak</ThemedText>
              </View>
            </View>
          </View>

          {/* Menu Section */}
          <View style={styles.menuSection}>
            <ThemedText style={styles.sectionTitle}>Account</ThemedText>
            <View style={styles.menuContainer}>
              {profileMenuItems.map((item) => (
                <ProfileMenuItem key={item.id} item={item} />
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
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.light.text,
  },
  headerRight: {
    width: 24,
  },
  profileSection: {
    alignItems: "center",
    paddingHorizontal: 30,
    paddingVertical: 20,
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: Colors.light.background,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  editImageButton: {
    position: "absolute",
    bottom: 4,
    right: 4,
    backgroundColor: Colors.light.tint,
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.light.background,
  },
  profileInfo: {
    alignItems: "center",
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.light.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: Colors.light.icon,
    marginBottom: 8,
  },
  joinDate: {
    fontSize: 14,
    color: Colors.light.icon,
  },
  statsSection: {
    paddingHorizontal: 30,
    marginBottom: 30,
  },
  statsGrid: {
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
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.light.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.light.icon,
    textAlign: "center",
  },
  menuSection: {
    paddingHorizontal: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 16,
  },
  menuContainer: {
    backgroundColor: Colors.light.background,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuIcon: {
    marginRight: 16,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.light.text,
  },
});