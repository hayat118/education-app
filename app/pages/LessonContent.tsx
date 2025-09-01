import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    Dimensions,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const { width } = Dimensions.get("window");

// Lesson content types
type LessonType = "code" | "theory" | "quiz";

// Lesson page interface
interface LessonPage {
  id: string;
  type: LessonType;
  title: string;
  content: string;
  codeExample?: string;
  expectedOutput?: string;
  quizQuestion?: string;
  quizOptions?: string[];
  quizCorrectAnswer?: number;
}

// Extended lesson interface with multiple pages
interface LessonContent {
  id: string;
  title: string;
  courseId: string;
  pages: LessonPage[];
  totalPages: number;
}

// Comprehensive lesson data with multiple pages and types
const lessonContentData: { [key: string]: LessonContent } = {
  "1-1": {
    id: "1-1",
    title: "Introduction",
    courseId: "1",
    totalPages: 3,
    pages: [
      {
        id: "1-1-1",
        type: "theory",
        title: "What is Python?",
        content: "Python is a general-purpose, high-level programming language. Its design philosophy emphasizes code readability with its notable use of significant whitespace.",
      },
      {
        id: "1-1-2", 
        type: "code",
        title: "Basic Python Syntax",
        content: "Let's start with a simple Python example that demonstrates variable assignment and type checking.",
        codeExample: `x = 5
y = "John"
print(type(x))
print(type(y))`,
        expectedOutput: `<class 'int'>
<class 'str'>`,
      },
      {
        id: "1-1-3",
        type: "quiz",
        title: "Test Your Knowledge",
        content: "Let's check what you've learned about Python basics.",
        quizQuestion: "What type of language is Python?",
        quizOptions: [
          "Low-level programming language",
          "High-level programming language", 
          "Assembly language",
          "Machine language"
        ],
        quizCorrectAnswer: 1,
      }
    ]
  },
  "1-2": {
    id: "1-2", 
    title: "Variables",
    courseId: "1",
    totalPages: 2,
    pages: [
      {
        id: "1-2-1",
        type: "theory",
        title: "Understanding Variables",
        content: "Variables are containers for storing data values. In Python, you don't need to declare variables before using them.",
      },
      {
        id: "1-2-2",
        type: "code", 
        title: "Variable Assignment",
        content: "Here's how you can create and use variables in Python.",
        codeExample: `name = "Alice"
age = 30
height = 5.6
is_student = True
print(f"Name: {name}")
print(f"Age: {age}")`,
        expectedOutput: `Name: Alice
Age: 30`,
      }
    ]
  },
  "2-1": {
    id: "2-1",
    title: "Getting Started",
    courseId: "2", 
    totalPages: 2,
    pages: [
      {
        id: "2-1-1",
        type: "theory",
        title: "What is React?",
        content: "React is a JavaScript library for building user interfaces. It lets you compose complex UIs from small and isolated pieces of code called components.",
      },
      {
        id: "2-1-2",
        type: "code",
        title: "Your First Component",
        content: "Let's create a simple React component.",
        codeExample: `function Welcome(props) {
  return <h1>Hello, {props.name}!</h1>;
}

const element = <Welcome name="Sara" />;`,
        expectedOutput: `<h1>Hello, Sara!</h1>`,
      }
    ]
  }
};

// Code execution simulator
const executeCode = (code: string, lessonId: string): string => {
  const lesson = Object.values(lessonContentData)
    .flatMap(l => l.pages)
    .find(page => page.codeExample === code);
  
  if (lesson?.expectedOutput) {
    return lesson.expectedOutput;
  }
  
  // Simple code execution simulation
  try {
    // This is a simplified simulation - in a real app you'd use a proper code execution service
    if (code.includes('print(type(')) {
      return `<class 'int'>
<class 'str'>`;
    }
    if (code.includes('print(f"Name:')) {
      return `Name: Alice
Age: 30`;
    }
    return "Code executed successfully!";
  } catch (error) {
    return "Error executing code";
  }
};

// Syntax highlighting function (simplified)
const highlightSyntax = (code: string): React.ReactNode => {
  const keywords = ['print', 'def', 'class', 'if', 'else', 'for', 'while', 'import', 'from', 'return', 'function', 'const', 'let', 'var'];
  const lines = code.split('\n');
  
  return lines.map((line, lineIndex) => {
    let highlighted = line;
    
    // Highlight strings
    highlighted = highlighted.replace(/(["'].*?["'])/g, '<string>$1</string>');
    
    // Highlight keywords
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g');
      highlighted = highlighted.replace(regex, `<keyword>${keyword}</keyword>`);
    });
    
    // Highlight numbers
    highlighted = highlighted.replace(/\b(\d+)\b/g, '<number>$1</number>');
    
    return (
      <ThemedText key={lineIndex} style={styles.codeLine}>
        {highlighted.split('<').map((part, partIndex) => {
          if (part.startsWith('string>')) {
            return <ThemedText key={partIndex} style={styles.codeString}>{part.replace('string>', '').replace('</string', '')}</ThemedText>;
          }
          if (part.startsWith('keyword>')) {
            return <ThemedText key={partIndex} style={styles.codeKeyword}>{part.replace('keyword>', '').replace('</keyword', '')}</ThemedText>;
          }
          if (part.startsWith('number>')) {
            return <ThemedText key={partIndex} style={styles.codeNumber}>{part.replace('number>', '').replace('</number', '')}</ThemedText>;
          }
          return <ThemedText key={partIndex} style={styles.codeText}>{part}</ThemedText>;
        })}
      </ThemedText>
    );
  });
};

export default function LessonContent() {
  const router = useRouter();
  const { courseId, lessonId } = useLocalSearchParams<{ courseId: string; lessonId: string }>();
  
  // Get lesson content
  const lessonKey = `${courseId}-${lessonId}`;
  const lessonContent = lessonContentData[lessonKey];
  
  // State management
  const [currentPage, setCurrentPage] = useState(0);
  const [codeInput, setCodeInput] = useState("");
  const [codeOutput, setCodeOutput] = useState("");
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [showQuizResult, setShowQuizResult] = useState(false);
  
  // Initialize code input when page changes
  React.useEffect(() => {
    if (lessonContent?.pages[currentPage]?.codeExample) {
      setCodeInput(lessonContent.pages[currentPage].codeExample || "");
      setCodeOutput("");
    }
    // Reset quiz state
    setSelectedQuizAnswer(null);
    setShowQuizResult(false);
  }, [currentPage, lessonContent]);

  const handleBack = () => {
    router.back();
  };

  const handleMoreOptions = () => {
    console.log("More options pressed");
  };

  const handleRunCode = () => {
    if (!codeInput.trim()) {
      Alert.alert("Error", "Please enter some code to run");
      return;
    }
    
    const output = executeCode(codeInput, lessonKey);
    setCodeOutput(output);
  };

  const handleNextPage = () => {
    if (lessonContent && currentPage < lessonContent.totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageDot = (pageIndex: number) => {
    setCurrentPage(pageIndex);
  };

  const handleQuizAnswer = (answerIndex: number) => {
    setSelectedQuizAnswer(answerIndex);
    setShowQuizResult(true);
  };

  if (!lessonContent) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <SafeAreaView style={styles.container}>
          <View style={styles.errorContainer}>
            <ThemedText style={styles.errorText}>Lesson not found</ThemedText>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <ThemedText style={styles.backButtonText}>Go Back</ThemedText>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </>
    );
  }

  const currentPageData = lessonContent.pages[currentPage];

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

        {/* Course Title */}
        <View style={styles.titleSection}>
          <ThemedText style={styles.courseTitle}>{lessonContent.title}</ThemedText>
        </View>

        {/* Progress Dots */}
        <View style={styles.progressContainer}>
          {Array.from({ length: lessonContent.totalPages }, (_, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.progressDot,
                index === currentPage ? styles.progressDotActive : styles.progressDotInactive
              ]}
              onPress={() => handlePageDot(index)}
              activeOpacity={0.7}
            />
          ))}
        </View>

        {/* Content based on lesson type */}
        {currentPageData.type === "theory" && (
          <View style={styles.theorySection}>
            <ThemedText style={styles.lessonContent}>
              {currentPageData.content}
            </ThemedText>
          </View>
        )}

        {currentPageData.type === "code" && (
          <>
            {/* Lesson Description */}
            <View style={styles.descriptionSection}>
              <ThemedText style={styles.lessonContent}>
                {currentPageData.content}
              </ThemedText>
            </View>

            {/* Code Editor */}
            <View style={styles.codeEditorContainer}>
              <View style={styles.codeEditor}>
                <TextInput
                  style={styles.codeInput}
                  multiline
                  value={codeInput}
                  onChangeText={setCodeInput}
                  placeholder="Enter your code here..."
                  placeholderTextColor="#888"
                />
              </View>
              
              {/* Run Button */}
              <View style={styles.runButtonContainer}>
                <TouchableOpacity style={styles.runButton} onPress={handleRunCode} activeOpacity={0.8}>
                  <Ionicons name="play-circle" size={20} color={Colors.light.background} style={styles.playIcon} />
                  <ThemedText style={styles.runButtonText}>Run</ThemedText>
                </TouchableOpacity>
              </View>
            </View>

            {/* Output Section */}
            {codeOutput ? (
              <>
                <ThemedText style={styles.outputTitle}>Output</ThemedText>
                <View style={styles.outputContainer}>
                  <ThemedText style={styles.outputText}>{codeOutput}</ThemedText>
                </View>
              </>
            ) : null}
          </>
        )}

        {currentPageData.type === "quiz" && (
          <>
            <View style={styles.descriptionSection}>
              <ThemedText style={styles.lessonContent}>
                {currentPageData.content}
              </ThemedText>
            </View>
            
            <View style={styles.quizSection}>
              <ThemedText style={styles.quizQuestion}>
                {currentPageData.quizQuestion}
              </ThemedText>
              
              {currentPageData.quizOptions?.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.quizOption,
                    selectedQuizAnswer === index ? styles.quizOptionSelected : null,
                    showQuizResult && index === currentPageData.quizCorrectAnswer ? styles.quizOptionCorrect : null,
                    showQuizResult && selectedQuizAnswer === index && index !== currentPageData.quizCorrectAnswer ? styles.quizOptionIncorrect : null,
                  ]}
                  onPress={() => handleQuizAnswer(index)}
                  disabled={showQuizResult}
                  activeOpacity={0.8}
                >
                  <ThemedText style={styles.quizOptionText}>{option}</ThemedText>
                </TouchableOpacity>
              ))}
              
              {showQuizResult && (
                <View style={styles.quizResult}>
                  <ThemedText style={[
                    styles.quizResultText,
                    selectedQuizAnswer === currentPageData.quizCorrectAnswer ? styles.quizResultCorrect : styles.quizResultIncorrect
                  ]}>
                    {selectedQuizAnswer === currentPageData.quizCorrectAnswer ? "Correct! Well done!" : "Incorrect. Try again!"}
                  </ThemedText>
                </View>
              )}
            </View>
          </>
        )}

        {/* Navigation Buttons */}
        <View style={styles.navigationContainer}>
          {currentPage > 0 && (
            <TouchableOpacity style={styles.prevButton} onPress={handlePreviousPage} activeOpacity={0.8}>
              <Ionicons name="chevron-back" size={20} color={Colors.light.background} />
              <ThemedText style={styles.prevButtonText}>Previous</ThemedText>
            </TouchableOpacity>
          )}
          
          {currentPage < lessonContent.totalPages - 1 && (
            <TouchableOpacity style={styles.nextButton} onPress={handleNextPage} activeOpacity={0.8}>
              <ThemedText style={styles.nextButtonText}>Next</ThemedText>
              <Ionicons name="chevron-forward" size={20} color={Colors.light.background} />
            </TouchableOpacity>
          )}
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
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    marginBottom: 25,
    gap: 8,
  },
  progressDot: {
    width: 62,
    height: 6,
    borderRadius: 10,
  },
  progressDotActive: {
    backgroundColor: "#1D92FF",
  },
  progressDotInactive: {
    backgroundColor: "#D6DEE5",
  },
  theorySection: {
    paddingHorizontal: 24,
    marginBottom: 25,
  },
  descriptionSection: {
    paddingHorizontal: 24,
    marginBottom: 25,
  },
  lessonContent: {
    fontSize: 18,
    fontWeight: "300",
    color: Colors.light.text,
    lineHeight: 30,
  },
  codeEditorContainer: {
    paddingHorizontal: 24,
    marginBottom: 25,
  },
  codeEditor: {
    backgroundColor: "#2B2424",
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 15,
    minHeight: 144,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  codeInput: {
    color: Colors.light.background,
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "monospace",
    textAlignVertical: "top",
    minHeight: 100,
  },
  codeLine: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "monospace",
  },
  codeText: {
    color: Colors.light.background,
  },
  codeKeyword: {
    color: "#569CD6",
  },
  codeString: {
    color: "#CE9178",
  },
  codeNumber: {
    color: "#B5CEA8",
  },
  runButtonContainer: {
    alignItems: "flex-end",
    marginTop: 15,
  },
  runButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1D92FF",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 3,
    gap: 5,
  },
  playIcon: {
    marginRight: 3,
  },
  runButtonText: {
    color: Colors.light.background,
    fontSize: 16,
    fontWeight: "700",
  },
  outputTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.light.text,
    paddingHorizontal: 24,
    marginBottom: 15,
  },
  outputContainer: {
    marginHorizontal: 24,
    backgroundColor: "#2B2424",
    borderRadius: 10,
    paddingHorizontal: 25,
    paddingVertical: 15,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  outputText: {
    color: Colors.light.background,
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "monospace",
    lineHeight: 22,
  },
  quizSection: {
    paddingHorizontal: 24,
    marginBottom: 25,
  },
  quizQuestion: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 20,
  },
  quizOption: {
    backgroundColor: Colors.light.background,
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  quizOptionSelected: {
    borderColor: "#1D92FF",
    backgroundColor: "#F0F8FF",
  },
  quizOptionCorrect: {
    borderColor: "#10B981",
    backgroundColor: "#F0FDF4",
  },
  quizOptionIncorrect: {
    borderColor: "#EF4444",
    backgroundColor: "#FEF2F2",
  },
  quizOptionText: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.light.text,
  },
  quizResult: {
    marginTop: 15,
    padding: 15,
    borderRadius: 8,
    backgroundColor: Colors.light.background,
  },
  quizResultText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  quizResultCorrect: {
    color: "#10B981",
  },
  quizResultIncorrect: {
    color: "#EF4444",
  },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    marginTop: 20,
  },
  prevButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6B7280",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 5,
  },
  prevButtonText: {
    color: Colors.light.background,
    fontSize: 16,
    fontWeight: "600",
  },
  nextButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1D92FF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 5,
  },
  nextButtonText: {
    color: Colors.light.background,
    fontSize: 16,
    fontWeight: "600",
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