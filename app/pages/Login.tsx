import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password validation
  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (emailError) {
      setEmailError("");
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (passwordError) {
      setPasswordError("");
    }
  };

  const handleLogin = async () => {
    // Reset errors
    setEmailError("");
    setPasswordError("");

    // Validate inputs
    let hasError = false;

    if (!email.trim()) {
      setEmailError("Email is required");
      hasError = true;
    } else if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      hasError = true;
    }

    if (!password.trim()) {
      setPasswordError("Password is required");
      hasError = true;
    } else if (!validatePassword(password)) {
      setPasswordError("Password must be at least 6 characters");
      hasError = true;
    }

    if (hasError) return;

    setIsLoading(true);
    
    try {
      // Simulate login process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, navigate to home on successful login
      Alert.alert(
        "Login Successful!",
        "Welcome to your learning journey!",
        [
          {
            text: "Continue",
            onPress: () => router.push("/(tabs)"),
          },
        ]
      );
    } catch (error) {
      Alert.alert("Login Failed", "Please check your credentials and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      "Forgot Password",
      "Password reset functionality will be implemented soon.",
      [{ text: "OK" }]
    );
  };

  const handleSignUp = () => {
    Alert.alert(
      "Sign Up",
      "Registration functionality will be implemented soon.",
      [{ text: "OK" }]
    );
  };

  const handleSocialLogin = (provider: string) => {
    Alert.alert(
      `${provider} Login`,
      `${provider} authentication will be implemented soon.`,
      [{ text: "OK" }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardContainer}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Image */}
          <View style={styles.imageContainer}>
            <Image
              source={require("../../assets/images/login.png")}
              resizeMode="cover"
              style={styles.headerImage}
            />
            <View style={styles.overlay} />
          </View>

          {/* Login Form */}
          <View style={styles.formContainer}>
            <View style={styles.welcomeContainer}>
              <ThemedText type="title" style={styles.welcomeTitle}>
                Welcome Back!
              </ThemedText>
              <ThemedText type="subtitle" style={styles.welcomeSubtitle}>
                Sign in to continue your learning journey
              </ThemedText>
            </View>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <ThemedText style={styles.inputLabel}>Email</ThemedText>
              <View style={[styles.inputWrapper, emailError && styles.inputError]}>
                <Ionicons 
                  name="mail-outline" 
                  size={20} 
                  color={emailError ? "#EF4444" : Colors.light.icon} 
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.textInput, styles.textInputWithIcon]}
                  placeholder="Enter your email"
                  placeholderTextColor={Colors.light.icon}
                  value={email}
                  onChangeText={handleEmailChange}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                />
              </View>
              {emailError ? (
                <ThemedText style={styles.errorText}>{emailError}</ThemedText>
              ) : null}
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <ThemedText style={styles.inputLabel}>Password</ThemedText>
              <View style={[styles.inputWrapper, passwordError && styles.inputError]}>
                <Ionicons 
                  name="lock-closed-outline" 
                  size={20} 
                  color={passwordError ? "#EF4444" : Colors.light.icon} 
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.textInput, styles.textInputWithIcon, styles.passwordInput]}
                  placeholder="Enter your password"
                  placeholderTextColor={Colors.light.icon}
                  value={password}
                  onChangeText={handlePasswordChange}
                  secureTextEntry={!isPasswordVisible}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                  activeOpacity={0.7}
                >
                  <Ionicons 
                    name={isPasswordVisible ? "eye-outline" : "eye-off-outline"} 
                    size={20} 
                    color={Colors.light.icon}
                  />
                </TouchableOpacity>
              </View>
              {passwordError ? (
                <ThemedText style={styles.errorText}>{passwordError}</ThemedText>
              ) : null}
            </View>

            {/* Forgot Password */}
            <TouchableOpacity
              style={styles.forgotPasswordContainer}
              onPress={handleForgotPassword}
            >
              <ThemedText type="link" style={styles.forgotPasswordText}>
                Forgot Password?
              </ThemedText>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity 
              style={[styles.loginButton, isLoading && styles.loginButtonDisabled]} 
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <ThemedText style={styles.loginButtonText}>Signing In...</ThemedText>
                </View>
              ) : (
                <Text style={styles.loginButtonText}>Sign In</Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <ThemedText style={styles.dividerText}>or</ThemedText>
              <View style={styles.divider} />
            </View>

            {/* Social Login Buttons */}
            <View style={styles.socialContainer}>
              <TouchableOpacity 
                style={styles.socialButton}
                onPress={() => handleSocialLogin("Google")}
                activeOpacity={0.8}
              >
                <Ionicons name="logo-google" size={20} color="#4285F4" style={styles.socialIcon} />
                <Text style={styles.socialButtonText}>Google</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.socialButton}
                onPress={() => handleSocialLogin("Apple")}
                activeOpacity={0.8}
              >
                <Ionicons name="logo-apple" size={20} color="#000000" style={styles.socialIcon} />
                <Text style={styles.socialButtonText}>Apple</Text>
              </TouchableOpacity>
            </View>

            {/* Sign Up Link */}
            <View style={styles.signUpContainer}>
              <ThemedText style={styles.signUpText}>
                Don't have an account?{" "}
              </ThemedText>
              <TouchableOpacity onPress={handleSignUp}>
                <ThemedText type="link" style={styles.signUpLink}>
                  Sign Up
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  imageContainer: {
    height: height * 0.35,
    width: "100%",
    position: "relative",
  },
  headerImage: {
    width: "100%",
    height: "100%",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
  },
  welcomeContainer: {
    marginBottom: 32,
    alignItems: "center",
  },
  welcomeTitle: {
    marginBottom: 8,
    textAlign: "center",
    color: Colors.light.text,
  },
  welcomeSubtitle: {
    textAlign: "center",
    color: Colors.light.icon,
    fontSize: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: Colors.light.text,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 16,
  },
  inputError: {
    borderColor: "#EF4444",
    backgroundColor: "#FEF2F2",
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.light.text,
  },
  textInputWithIcon: {
    paddingLeft: 0,
  },
  errorText: {
    fontSize: 14,
    color: "#EF4444",
    marginTop: 4,
    marginLeft: 4,
  },
  passwordInput: {
    paddingRight: 40,
  },
  eyeButton: {
    position: "absolute",
    right: 16,
    padding: 4,
  },
  forgotPasswordContainer: {
    alignItems: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: Colors.light.tint,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 24,
    shadowColor: Colors.light.tint,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  loginButtonDisabled: {
    backgroundColor: "#9CA3AF",
    shadowOpacity: 0.1,
  },
  loginButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  dividerText: {
    marginHorizontal: 16,
    color: Colors.light.icon,
    fontSize: 14,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
    gap: 12,
  },
  socialButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingVertical: 14,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  socialIcon: {
    marginRight: 8,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signUpText: {
    fontSize: 16,
    color: Colors.light.icon,
  },
  signUpLink: {
    fontSize: 16,
    fontWeight: "600",
  },
});
