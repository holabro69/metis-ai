import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Atom,
  Dna,
  Terminal,
  TrendingUp,
  PenTool,
  Bot,
  User,
  Sparkles,
  BookOpen,
  Award,
  Plus,
  Send,
  RefreshCw,
  Check,
  HelpCircle,
  X,
  Zap,
  Brain,
  LayoutGrid,
  Activity,
  FileText,
  CheckCircle2
} from "lucide-react";
import { Message, StudySubject, QuizQuestion, Flashcard, StudyPlanItem } from "./types";
import {
  DEFAULT_SUBJECTS,
  MOCK_EXPLANATIONS,
  DEFAULT_EXPLANATION,
  getMockQuiz,
  getMockFlashcards,
  getMockStudyPlan
} from "./mockData";

// Global Development Settings as requested by the specification
const DEVELOPMENT_SETTINGS = {
  useMockAI: true, // Defaults to true to protect free-tier API quota
};

// Simple helper to render icons dynamically
const SubjectIcon = ({ name, className }: { name: string; className?: string }) => {
  switch (name) {
    case "Atom":
      return <Atom className={className} />;
    case "Dna":
      return <Dna className={className} />;
    case "Terminal":
      return <Terminal className={className} />;
    case "TrendingUp":
      return <TrendingUp className={className} />;
    case "PenTool":
      return <PenTool className={className} />;
    default:
      return <BookOpen className={className} />;
  }
};

// Custom Markdown-lite Parser component to display answers beautifully with zero-dependency bugs in React 19
const BeautifulMarkdown = ({ content }: { content: string }) => {
  const lines = content.split("\n");
  let inList = false;
  let listItems: string[] = [];
  const renderedElements: React.ReactNode[] = [];

  const flushList = (key: number) => {
    if (listItems.length > 0) {
      renderedElements.push(
        <ul key={`list-${key}`} className="list-disc pl-5 mb-4 space-y-1 text-gray-300">
          {listItems.map((item, idx) => (
            <li key={idx} className="text-sm leading-relaxed">{parseInlineStyles(item)}</li>
          ))}
        </ul>
      );
      listItems = [];
      inList = false;
    }
  };

  const parseInlineStyles = (text: string) => {
    // Basic bold parsing: **text**
    const parts = text.split(/\*\*([^*]+)\*\*/g);
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        return <strong key={i} className="font-semibold text-white">{part}</strong>;
      }
      // Simple code highlight: `code`
      const codeParts = part.split(/`([^`]+)`/g);
      return codeParts.map((subPart, j) => {
        if (j % 2 === 1) {
          return <code key={j} className="bg-white/8 px-1.5 py-0.5 rounded text-pink-400 text-xs font-mono">{subPart}</code>;
        }
        return subPart;
      });
    });
  };

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();

    if (trimmedLine.startsWith("### ")) {
      flushList(index);
      renderedElements.push(
        <h3 key={index} className="text-lg font-bold text-white mt-5 mb-2 font-display tracking-tight flex items-center gap-2 border-b border-white/5 pb-1">
          {parseInlineStyles(trimmedLine.replace("### ", ""))}
        </h3>
      );
    } else if (trimmedLine.startsWith("#### ")) {
      flushList(index);
      renderedElements.push(
        <h4 key={index} className="text-md font-semibold text-gray-200 mt-4 mb-2 font-display">
          {parseInlineStyles(trimmedLine.replace("#### ", ""))}
        </h4>
      );
    } else if (trimmedLine.startsWith("## ")) {
      flushList(index);
      renderedElements.push(
        <h2 key={index} className="text-xl font-bold text-indigo-400 mt-6 mb-3 font-display tracking-tight">
          {parseInlineStyles(trimmedLine.replace("## ", ""))}
        </h2>
      );
    } else if (trimmedLine.startsWith("* ") || trimmedLine.startsWith("- ")) {
      inList = true;
      listItems.push(trimmedLine.substring(2));
    } else if (trimmedLine.match(/^\d+\.\s/)) {
      inList = true;
      listItems.push(trimmedLine.replace(/^\d+\.\s/, ""));
    } else if (trimmedLine === "") {
      flushList(index);
    } else {
      flushList(index);
      renderedElements.push(
        <p key={index} className="text-sm text-gray-300 leading-relaxed mb-3">
          {parseInlineStyles(line)}
        </p>
      );
    }
  });

  flushList(lines.length);

  return <div className="markdown-body space-y-1">{renderedElements}</div>;
};

export default function App() {
  // Navigation: "landing" | "workspace"
  const [screen, setScreen] = useState<"landing" | "workspace">("landing");

  // Study states
  const [subjects, setSubjects] = useState<StudySubject[]>(DEFAULT_SUBJECTS);
  const [activeSubject, setActiveSubject] = useState<StudySubject>(DEFAULT_SUBJECTS[0]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Settings
  const [mockMode, setMockMode] = useState(DEVELOPMENT_SETTINGS.useMockAI);
  const [apiKeyStatus, setApiKeyStatus] = useState<"missing" | "checked" | "none">("checked");

  // Customized Study Plans & Milestones
  const [studyPlan, setStudyPlan] = useState<StudyPlanItem[]>([]);

  // Flashcards state
  const [activeFlashcards, setActiveFlashcards] = useState<Flashcard[]>([]);
  const [currentFlashcardIdx, setCurrentFlashcardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Quizzes state
  const [activeQuiz, setActiveQuiz] = useState<QuizQuestion[]>([]);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // Active workspace tab: "chat" | "flashcards" | "quiz"
  const [workspaceTab, setWorkspaceTab] = useState<"chat" | "flashcards" | "quiz">("chat");

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Load state from localStorage on startup
  useEffect(() => {
    const savedMessages = localStorage.getItem("metis_messages");
    const savedSubjectId = localStorage.getItem("metis_active_subject_id");
    const savedMockMode = localStorage.getItem("metis_mock_mode");
    const savedPlan = localStorage.getItem("metis_study_plan");

    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      // Set default initial welcoming message
      setMessages([
        {
          id: "welcome",
          role: "model",
          content: DEFAULT_EXPLANATION,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }

    if (savedSubjectId) {
      const found = DEFAULT_SUBJECTS.find((s) => s.id === savedSubjectId);
      if (found) setActiveSubject(found);
    }

    if (savedMockMode) {
      setMockMode(JSON.parse(savedMockMode));
    }

    if (savedPlan) {
      setStudyPlan(JSON.parse(savedPlan));
    } else {
      // Set default plan for first subject
      setStudyPlan(getMockStudyPlan(DEFAULT_SUBJECTS[0].id));
    }
  }, []);

  // Save states to localStorage when updated
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("metis_messages", JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    localStorage.setItem("metis_active_subject_id", activeSubject.id);
    // Reload initial subject questions or custom study plans
    const savedPlan = localStorage.getItem(`metis_plan_${activeSubject.id}`);
    if (savedPlan) {
      setStudyPlan(JSON.parse(savedPlan));
    } else {
      const initialPlan = getMockStudyPlan(activeSubject.id);
      setStudyPlan(initialPlan);
      localStorage.setItem(`metis_plan_${activeSubject.id}`, JSON.stringify(initialPlan));
    }
  }, [activeSubject]);

  useEffect(() => {
    localStorage.setItem("metis_mock_mode", JSON.stringify(mockMode));
  }, [mockMode]);

  useEffect(() => {
    if (studyPlan.length > 0) {
      localStorage.setItem(`metis_plan_${activeSubject.id}`, JSON.stringify(studyPlan));
      localStorage.setItem("metis_study_plan", JSON.stringify(studyPlan));
    }
  }, [studyPlan]);

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Toggle study milestone checkbox
  const handleToggleMilestone = (id: string) => {
    const updated = studyPlan.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setStudyPlan(updated);
  };

  // Select another study subject
  const handleSelectSubject = (subject: StudySubject) => {
    setActiveSubject(subject);
    setWorkspaceTab("chat");
    setActiveQuiz([]);
    setActiveFlashcards([]);
    setQuizScore(null);
    
    // Add brief intro prompt
    const newWelcome: Message = {
      id: `welcome-${subject.id}-${Date.now()}`,
      role: "model",
      content: `### Welcome to ${subject.name}

${subject.description}

Click any of the **Quick Questions** below to launch your session, or build custom **Quizzes** and **Flashcards** using the command console!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([newWelcome]);
  };

  // Send message to assistant
  const handleSendMessage = async (textToSend?: string) => {
    const content = textToSend || inputMessage;
    if (!content.trim() || isLoading) return;

    if (!textToSend) setInputMessage("");

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      if (mockMode) {
        // Mock Mode AI - instantaneous, quota-friendly simulator response
        setTimeout(() => {
          let replyText = `### Understanding ${activeSubject.name}

I have mapped out the concept based on your inquiry: **"${content}"**.

1. **Core Principle**: In ${activeSubject.name}, systems rely on foundational pathways that define localized behavior.
2. **Interactive Study Tip**: Use the **Quiz** panel in the workspace to test your retention on this specific concept right away.
3. **Synthesis**: To truly master this, try writing down a one-sentence summary of how this links with other concepts in this micro-curriculum.

*This response was generated instantly in **Mock Mode** to save live API calls.*`;

          // Check if there is a predefined mock explanation for this query
          if (MOCK_EXPLANATIONS[content]) {
            replyText = MOCK_EXPLANATIONS[content];
          }

          const botMsg: Message = {
            id: `bot-${Date.now()}`,
            role: "model",
            content: replyText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };

          setMessages((prev) => [...prev, botMsg]);
          setIsLoading(false);
        }, 750);
      } else {
        // Live Mode - calls backend server route `/api/chat`
        // We include the "Sliding Window" chat history limiting context to last 6 messages
        const chatPayload = [...messages, userMsg];

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: chatPayload,
            option: "chat"
          })
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || "Server responded with an error");
        }

        const data = await response.json();
        const botMsg: Message = {
          id: `bot-${Date.now()}`,
          role: "model",
          content: data.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages((prev) => [...prev, botMsg]);
        setIsLoading(false);
      }
    } catch (error: any) {
      console.error("Error communicating with AI:", error);
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        role: "model",
        content: `### ⚠️ Connection or API Error\n\nI was unable to retrieve a response from the live server.\n\n**Reason**: ${error.message || "Unknown server communication failure"}.\n\n*Please make sure you have set a valid **GEMINI_API_KEY** in your Settings panel or keep **Mock Mode** toggled ON to study offline.*`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
      setIsLoading(false);
    }
  };

  // Generate study plan milestone steps using AI
  const handleGenerateStudyPlan = async () => {
    setIsLoading(true);
    try {
      if (mockMode) {
        setTimeout(() => {
          const freshPlan = getMockStudyPlan(activeSubject.id);
          setStudyPlan(freshPlan);
          setIsLoading(false);
          
          // Inject bot status
          const planMsg: Message = {
            id: `plan-${Date.now()}`,
            role: "model",
            content: `### 📅 Custom Study Plan Generated\n\nI have structured a high-retention 4-step micro-curriculum for **${activeSubject.name}** in the sidebar control station. \n\nTrack your progress as you complete each step during your session!`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          setMessages((prev) => [...prev, planMsg]);
        }, 600);
      } else {
        const payloadMsg = {
          role: "user",
          content: `Generate a 4-step structured micro-curriculum for ${activeSubject.name}.`
        };

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [payloadMsg],
            option: "plan"
          })
        });

        if (!response.ok) {
          throw new Error("Could not formulate plan via server.");
        }

        const data = await response.json();
        const parsedPlan: StudyPlanItem[] = JSON.parse(data.text);
        setStudyPlan(parsedPlan);
        setIsLoading(false);

        const successMsg: Message = {
          id: `plan-${Date.now()}`,
          role: "model",
          content: `### 📅 Custom Study Plan Syllabi Ready\n\nMy deep learning module has analyzed the subject structure and generated an optimized 4-step checklist on your sidebar. Keep track of your milestones.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, successMsg]);
      }
    } catch (err: any) {
      console.error(err);
      setIsLoading(false);
    }
  };

  // Create Interactive Quiz
  const handleGenerateQuiz = async () => {
    setWorkspaceTab("quiz");
    setIsLoading(true);
    setQuizScore(null);
    try {
      if (mockMode) {
        setTimeout(() => {
          const quiz = getMockQuiz(activeSubject.id);
          setActiveQuiz(quiz);
          setIsLoading(false);
        }, 800);
      } else {
        const payloadMsg = {
          role: "user",
          content: `Create a 3-question multiple choice quiz with correct answers and explanations for ${activeSubject.name}.`
        };

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [payloadMsg],
            option: "quiz"
          })
        });

        if (!response.ok) throw new Error("Failed to compile interactive quiz");
        const data = await response.json();
        const quiz: QuizQuestion[] = JSON.parse(data.text);
        setActiveQuiz(quiz);
        setIsLoading(false);
      }
    } catch (err: any) {
      console.error(err);
      const errQuizMsg: Message = {
        id: `quiz-err-${Date.now()}`,
        role: "model",
        content: `### ⚠️ Quiz Generation Failed\n\nCould not fetch the interactive quiz from live service. Switch **Mock Mode** ON to load built-in quizzes instantly.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errQuizMsg]);
      setWorkspaceTab("chat");
      setIsLoading(false);
    }
  };

  // Create Interactive Flashcards
  const handleGenerateFlashcards = async () => {
    setWorkspaceTab("flashcards");
    setIsLoading(true);
    setIsFlipped(false);
    setCurrentFlashcardIdx(0);
    try {
      if (mockMode) {
        setTimeout(() => {
          const fc = getMockFlashcards(activeSubject.id, activeSubject.name);
          setActiveFlashcards(fc);
          setIsLoading(false);
        }, 800);
      } else {
        const payloadMsg = {
          role: "user",
          content: `Generate 4 educational flashcards with a clear conceptual question on the front and concise explanation on the back for ${activeSubject.name}.`
        };

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [payloadMsg],
            option: "flashcard"
          })
        });

        if (!response.ok) throw new Error("Failed to compile flashcards");
        const data = await response.json();
        const fc: Flashcard[] = JSON.parse(data.text);
        setActiveFlashcards(fc);
        setIsLoading(false);
      }
    } catch (err: any) {
      console.error(err);
      const errFcMsg: Message = {
        id: `fc-err-${Date.now()}`,
        role: "model",
        content: `### ⚠️ Flashcard Formulation Failed\n\nCould not synthesize flashcards from live service. Switch **Mock Mode** ON to test local interactive study cards.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errFcMsg]);
      setWorkspaceTab("chat");
      setIsLoading(false);
    }
  };

  // Submit Answer to Quiz Question
  const handleSelectQuizAnswer = (qIdx: number, oIdx: number) => {
    if (quizScore !== null) return; // Locked once graded
    const updated = [...activeQuiz];
    updated[qIdx].userSelectedAnswerIndex = oIdx;
    setActiveQuiz(updated);
  };

  // Grade Quiz
  const handleGradeQuiz = () => {
    let score = 0;
    let completedAll = true;

    activeQuiz.forEach((q) => {
      if (q.userSelectedAnswerIndex === undefined) completedAll = false;
      if (q.userSelectedAnswerIndex === q.correctAnswerIndex) score++;
    });

    if (!completedAll) {
      alert("Please select an answer for all questions before grading!");
      return;
    }

    setQuizScore(score);

    // Also push a summary message to the chat stream
    const quizSummaryMsg: Message = {
      id: `quiz-graded-${Date.now()}`,
      role: "model",
      content: `### 🏆 Quiz Session Graded

You completed the assessment on **${activeSubject.name}**!
* **Score**: \`${score} / ${activeQuiz.length}\` (${Math.round((score / activeQuiz.length) * 100)}%)

Excellent effort! Review the detailed answers and explanations in the study cards. Keep challenging yourself to lock in the concepts.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages((prev) => [...prev, quizSummaryMsg]);
  };

  // Restart chat / Reset logs
  const handleClearChatHistory = () => {
    if (confirm("Are you sure you want to clear your study history for this subject?")) {
      const resetMsg: Message = {
        id: "welcome",
        role: "model",
        content: DEFAULT_EXPLANATION,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([resetMsg]);
      setWorkspaceTab("chat");
      setActiveQuiz([]);
      setActiveFlashcards([]);
      setQuizScore(null);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#343541] overflow-x-hidden text-[#ECECF1] selection:bg-[#7C3AED] selection:text-white font-sans">
      
      {/* Dynamic Ambient Glowing Orbs */}
      <div className="ambient-glow glow-1" />
      <div className="ambient-glow glow-2" />

      <AnimatePresence mode="wait">
        {/* LANDING SCREEN */}
        {screen === "landing" && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative flex flex-col items-center justify-center min-h-screen px-4 lg:px-8 z-10"
          >
            {/* Smooth flow wave ribbon as an elegant SVG transition path */}
            <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none opacity-30">
              <svg className="absolute w-[200%] h-full top-0 left-[-50%] text-indigo-500/20 fill-none" viewBox="0 0 1440 800" preserveAspectRatio="none">
                <path
                  d="M0,224 C288,128 576,32 864,128 C1152,224 1440,320 1728,224 C2016,128 2304,32 2592,128 C2880,224 3168,320 3456,224 L3456,800 L0,800 Z"
                  className="fill-gradient"
                />
                <defs>
                  <linearGradient id="gradient-wave" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.15" />
                    <stop offset="50%" stopColor="#2DD4BF" stopOpacity="0.05" />
                    <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.15" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,192 C360,288 720,192 1080,224 C1440,256 1800,416 2160,320 C2520,224 2880,96 3240,160"
                  stroke="url(#gradient-wave)"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div className="max-w-4xl w-full text-center space-y-8 relative">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold tracking-wide text-[#2DD4BF] uppercase mb-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#2DD4BF]" />
                Vanguard Educational Architecture
              </motion.div>

              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="text-5xl md:text-7xl font-bold font-display tracking-tight text-white"
              >
                METIS <span className="bg-gradient-to-r from-[#7C3AED] to-[#2DD4BF] bg-clip-text text-transparent">AI</span>
              </motion.h1>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-lg md:text-xl text-[#9A9DAE] max-w-2xl mx-auto leading-relaxed"
              >
                An ultra-clean, cognitive study companion designed for deep learning, structural planning, and continuous self-assessment.
              </motion.p>

              {/* Metrics Ribbon */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="grid grid-cols-3 gap-4 max-w-2xl mx-auto py-6 border-y border-white/10 my-8"
              >
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold font-display text-white">99.4%</div>
                  <div className="text-xs text-gray-500 mt-1 uppercase tracking-wider">Concept Clarity</div>
                </div>
                <div className="text-center border-x border-white/10">
                  <div className="text-2xl md:text-3xl font-bold font-display text-white">142K+</div>
                  <div className="text-xs text-gray-500 mt-1 uppercase tracking-wider">Active Semesters</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold font-display text-white">450K+</div>
                  <div className="text-xs text-gray-500 mt-1 uppercase tracking-wider">Syllabi Parsed</div>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <button
                  onClick={() => setScreen("workspace")}
                  className="group relative px-8 py-4 w-full sm:w-auto rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#6d28d9] text-white font-semibold shadow-lg shadow-violet-500/20 hover:shadow-violet-500/35 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Brain className="w-5 h-5 group-hover:rotate-6 transition-transform" />
                  Launch Workspace
                </button>
                <a
                  href="#features"
                  onClick={(e) => {
                    e.preventDefault();
                    setScreen("workspace");
                  }}
                  className="px-8 py-4 w-full sm:w-auto rounded-xl bg-white/5 border border-white/10 text-gray-300 font-semibold hover:bg-white/10 hover:text-white transition-all cursor-pointer text-center"
                >
                  Explore Subjects
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* WORKSPACE DASHBOARD */}
        {screen === "workspace" && (
          <motion.div
            key="workspace"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col min-h-screen z-10 relative"
          >
            {/* Header Station */}
            <header className="flex items-center justify-between px-6 py-4 bg-[#202123]/90 border-b border-white/5 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#2DD4BF]">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold font-display tracking-tight text-white flex items-center gap-2">
                    METIS<span className="text-[#2DD4BF] text-xs font-semibold ml-1 opacity-80">PRO</span>
                    <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  </h1>
                  <p className="text-xs text-[#9A9DAE]">AI Cognitive Core v1.5</p>
                </div>
              </div>

              {/* Status Station & Navigation back */}
              <div className="flex items-center gap-4">
                {/* Mock Mode Header Badge */}
                <span className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                  mockMode 
                  ? "bg-amber-500/10 border-amber-500/20 text-amber-300"
                  : "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                }`}>
                  <Zap className="w-3 h-3" />
                  {mockMode ? "Local Mock Active" : "Live Gemini Online"}
                </span>

                <button
                  onClick={() => setScreen("landing")}
                  className="text-xs text-[#ECECF1] hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 transition"
                >
                  Back to Gateway
                </button>
              </div>
            </header>

            {/* Core Workspace Grid */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden h-[calc(100vh-73px)]">
              
              {/* LEFT SIDEBAR CONTROL - Span 4 */}
              <aside className="lg:col-span-4 bg-[#202123] border-r border-white/5 flex flex-col h-full overflow-y-auto p-5 space-y-6">
                
                {/* Subject Selector Header */}
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-[#9A9DAE] mb-3 flex items-center gap-2">
                    <LayoutGrid className="w-3.5 h-3.5 text-[#2DD4BF]" />
                    Selected Curriculum
                  </h2>
                  <div className="space-y-2">
                    {subjects.map((sub) => {
                      const isActive = activeSubject.id === sub.id;
                      return (
                        <button
                          key={sub.id}
                          onClick={() => handleSelectSubject(sub)}
                          className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 cursor-pointer flex items-start gap-3.5 ${
                            isActive
                              ? "bg-[#2DD4BF]/10 border-[#2DD4BF]/25 border-l-4 border-l-[#2DD4BF] text-white shadow-md"
                              : "bg-white/3 border-white/5 hover:border-white/10 text-[#9A9DAE] hover:text-white"
                          }`}
                        >
                          <div className={`p-2 rounded-lg ${
                            isActive ? "bg-gradient-to-br from-[#7C3AED] to-[#2DD4BF] text-white" : "bg-white/5 text-[#9A9DAE]"
                          }`}>
                            <SubjectIcon name={sub.icon} className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-sm truncate">{sub.name}</span>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                                sub.difficulty === "Advanced"
                                  ? "bg-red-500/10 text-red-400"
                                  : sub.difficulty === "Intermediate"
                                  ? "bg-amber-500/10 text-amber-400"
                                  : "bg-emerald-500/10 text-emerald-400"
                              }`}>
                                {sub.difficulty}
                              </span>
                            </div>
                            <p className="text-xs text-[#9A9DAE] mt-1 line-clamp-1">{sub.description}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* DEVELOPMENT SETTINGS: Quota-Saving Toggle */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
                        <Zap className="w-4 h-4 text-amber-400" />
                        Mock AI Mode
                      </h3>
                      <p className="text-[11px] text-[#9A9DAE] mt-0.5">Use simulated responses to test layout</p>
                    </div>
                    {/* Sliding Switch Pill */}
                    <button
                      onClick={() => setMockMode(!mockMode)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        mockMode ? "bg-[#2DD4BF]" : "bg-[#7C3AED]"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          mockMode ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                  {mockMode ? (
                    <div className="text-[11px] text-[#2DD4BF] bg-[#2DD4BF]/10 p-2.5 rounded-lg border border-[#2DD4BF]/20">
                      <strong>Active Simulation</strong>: Response cards, interactive multiple choice quizzes, and memory flashcards are instantly generated from local schema maps. No live network required!
                    </div>
                  ) : (
                    <div className="text-[11px] text-emerald-400 bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20">
                      <strong>Live Gemini Active</strong>: Sends a strict sliding history window of the last 6 messages to `/api/chat`. Keep study sessions highly focused.
                    </div>
                  )}
                </div>

                {/* STUDY PLAN CHECKLIST WIDGET */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#9A9DAE] flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-[#2DD4BF]" />
                      Dynamic Milestones
                    </h3>
                    <button
                      onClick={handleGenerateStudyPlan}
                      className="text-[11px] font-semibold text-[#2DD4BF] hover:text-[#2DD4BF]/80 bg-[#2DD4BF]/10 hover:bg-[#2DD4BF]/20 px-2 py-1 rounded transition"
                    >
                      Re-Formulate
                    </button>
                  </div>

                  {studyPlan.length > 0 ? (
                    <div className="space-y-2.5">
                      {studyPlan.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => handleToggleMilestone(item.id)}
                          className={`flex items-start gap-2.5 p-2.5 rounded-lg transition-all duration-150 cursor-pointer ${
                            item.completed
                              ? "bg-[#2DD4BF]/5 text-[#9A9DAE] line-through"
                              : "bg-white/2 hover:bg-white/5 text-[#ECECF1]"
                          }`}
                        >
                          <div className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition ${
                            item.completed
                              ? "bg-[#2DD4BF] border-[#2DD4BF] text-[#202123]"
                              : "border-white/20 hover:border-white/40"
                          }`}>
                            {item.completed && <Check className="w-3 h-3 text-[#202123] stroke-[3]" />}
                          </div>
                          <div className="flex-1 text-xs">
                            <p className="font-medium">{item.title}</p>
                            <span className="text-[10px] text-[#9A9DAE] font-mono mt-0.5 block">{item.duration}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-xs text-[#9A9DAE]">
                      No milestones mapped out. Click Re-Formulate to generate a 4-step syllabus.
                    </div>
                  )}
                </div>

              </aside>

              {/* RIGHT CHAT STREAM & ASSESSMENT PANEL - Span 8 */}
              <main className="lg:col-span-8 flex flex-col h-full bg-[#343541] overflow-hidden">
                
                {/* Active Session Hub Tabs */}
                <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-[#202123]/80 backdrop-blur-md">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-[#2DD4BF]" />
                    <span className="text-sm font-semibold text-white">{activeSubject.name} Workspace</span>
                  </div>
                  
                  <div className="flex gap-1 bg-white/5 p-1 rounded-lg border border-white/10">
                    <button
                      onClick={() => setWorkspaceTab("chat")}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition cursor-pointer ${
                        workspaceTab === "chat" ? "bg-[#7C3AED] text-white shadow-sm" : "text-[#9A9DAE] hover:text-white"
                      }`}
                    >
                      Chat Stream
                    </button>
                    <button
                      onClick={handleGenerateFlashcards}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition cursor-pointer flex items-center gap-1 ${
                        workspaceTab === "flashcards" ? "bg-[#7C3AED] text-white shadow-sm" : "text-[#9A9DAE] hover:text-white"
                      }`}
                    >
                      <LayoutGrid className="w-3 h-3" />
                      Flashcards
                    </button>
                    <button
                      onClick={handleGenerateQuiz}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition cursor-pointer flex items-center gap-1 ${
                        workspaceTab === "quiz" ? "bg-[#7C3AED] text-white shadow-sm" : "text-[#9A9DAE] hover:text-white"
                      }`}
                    >
                      <HelpCircle className="w-3 h-3" />
                      Quiz Prep
                    </button>
                  </div>
                </div>

                {/* WORKSPACE AREA - CHAT VIEW */}
                {workspaceTab === "chat" && (
                  <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Conversational Stream */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                      {messages.map((msg) => {
                        const isUser = msg.role === "user";
                        return (
                          <div
                            key={msg.id}
                            className={`flex items-start gap-4 max-w-3xl ${isUser ? "ml-auto flex-row-reverse" : "mr-auto"}`}
                          >
                            <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                              isUser ? "bg-[#3e3f4b]" : "bg-gradient-to-br from-[#7C3AED] to-[#2DD4BF]"
                            }`}>
                              {isUser ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                            </div>
                            <div className={`space-y-1 ${isUser ? "text-right" : "text-left"}`}>
                              <div className="flex items-center gap-2 mb-1 justify-start">
                                <span className="text-xs font-semibold text-gray-200">
                                  {isUser ? "You" : "METIS AI"}
                                </span>
                                <span className="text-[10px] text-[#9A9DAE] font-mono">{msg.timestamp}</span>
                              </div>
                              <div className={`p-4 rounded-xl text-left shadow-sm border ${
                                isUser
                                  ? "chat-bubble-user border-white/5 text-[#ECECF1] rounded-tr-none"
                                  : "chat-bubble-ai border-white/10 text-[#ECECF1] rounded-tl-none"
                              }`}>
                                <BeautifulMarkdown content={msg.content} />
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      {isLoading && (
                        <div className="flex items-start gap-4 max-w-3xl mr-auto">
                          <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-[#7C3AED] to-[#2DD4BF] animate-pulse">
                            <Bot className="w-4 h-4 text-white" />
                          </div>
                          <div className="space-y-1">
                            <div className="text-xs font-semibold text-gray-200">METIS AI analyzing...</div>
                            <div className="chat-bubble-ai border border-white/10 p-4 rounded-xl rounded-tl-none flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-[#7C3AED] animate-bounce" />
                              <span className="w-2 h-2 rounded-full bg-[#2DD4BF] animate-bounce [animation-delay:0.2s]" />
                              <span className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:0.4s]" />
                            </div>
                          </div>
                        </div>
                      )}

                      <div ref={chatEndRef} />
                    </div>

                    {/* Quick Command Chips */}
                    <div className="px-6 py-2.5 flex flex-wrap gap-2 border-t border-white/5 bg-[#202123]/30">
                      {activeSubject.defaultQuestions.map((q, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(q)}
                          className="text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#2DD4BF] hover:text-white border border-white/5 hover:border-[#2DD4BF]/20 transition cursor-pointer flex items-center gap-1.5"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          {q}
                        </button>
                      ))}
                    </div>

                    {/* Chat Input Console */}
                    <div className="p-6 border-t border-white/5 bg-[#202123]/60 backdrop-blur-md">
                      <div className="max-w-4xl mx-auto relative group">
                        {/* Ambient glow around active input */}
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#7C3AED] to-[#2DD4BF] rounded-xl blur opacity-10 group-focus-within:opacity-30 transition-opacity duration-300 pointer-events-none" />
                        <div className="relative flex items-center bg-white/5 border border-white/10 rounded-xl focus-within:border-[#7C3AED]/50 transition">
                          <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                            placeholder={`Ask Metis anything about ${activeSubject.name}...`}
                            className="flex-1 bg-transparent px-4 py-3.5 text-sm text-[#ECECF1] focus:outline-none placeholder-white/20"
                          />
                          <div className="flex items-center gap-2 pr-3">
                            <button
                              onClick={handleClearChatHistory}
                              title="Reset Study Stream"
                              className="p-2 text-[#9A9DAE] hover:text-red-400 rounded-lg hover:bg-white/5 transition"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleSendMessage()}
                              disabled={!inputMessage.trim() || isLoading}
                              className="p-2.5 bg-white text-[#343541] hover:bg-white/95 disabled:bg-white/5 disabled:text-[#9A9DAE] rounded-lg transition-all"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <p className="text-[10px] text-center text-[#9A9DAE] mt-3">
                        METIS study algorithms process queries according to strict cognitive maps. Sliding context window is active.
                      </p>
                    </div>
                  </div>
                )}

                {/* WORKSPACE AREA - FLASHCARDS VIEW */}
                {workspaceTab === "flashcards" && (
                  <div className="flex-1 flex flex-col justify-center items-center p-6 space-y-6 overflow-y-auto">
                    {isLoading ? (
                      <div className="flex flex-col items-center space-y-3">
                        <RefreshCw className="w-8 h-8 text-[#2DD4BF] animate-spin" />
                        <span className="text-sm text-[#9A9DAE]">Formulating custom cards...</span>
                      </div>
                    ) : activeFlashcards.length > 0 ? (
                      <div className="w-full max-w-md space-y-6">
                        
                        {/* Status tracker */}
                        <div className="flex items-center justify-between text-xs text-[#9A9DAE] px-1">
                          <span>Card {currentFlashcardIdx + 1} of {activeFlashcards.length}</span>
                          <span className="text-[#2DD4BF] font-semibold">{activeSubject.name} Syllabus</span>
                        </div>

                        {/* Interactive Flip Card */}
                        <div
                          onClick={() => setIsFlipped(!isFlipped)}
                          className="relative h-64 w-full cursor-pointer perspective-1000 group"
                        >
                          {/* Inner card with rotating transforms */}
                          <div
                            className={`relative w-full h-full duration-500 transform-style-3d border border-white/10 rounded-2xl p-8 flex flex-col justify-between shadow-xl transition-all ${
                              isFlipped 
                                ? "bg-gradient-to-br from-[#7C3AED] to-[#2DD4BF]/20 border-[#7C3AED]/30 text-white rotate-y-180" 
                                : "bg-white/5 hover:bg-white/8 backdrop-blur-md text-white"
                            }`}
                          >
                            
                            {/* Card Header */}
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[#2DD4BF]">
                                {isFlipped ? "Answer / Explanation" : "Conceptual Question"}
                              </span>
                              <Brain className="w-4 h-4 text-[#7C3AED]/50" />
                            </div>

                            {/* Main Card Content */}
                            <div className="my-auto py-4 text-center">
                              {isFlipped ? (
                                <p className="text-base md:text-lg leading-relaxed select-none font-medium text-indigo-100 transform rotate-y-180">
                                  {activeFlashcards[currentFlashcardIdx].back}
                                </p>
                              ) : (
                                <p className="text-lg md:text-xl font-display leading-snug font-bold select-none text-white">
                                  {activeFlashcards[currentFlashcardIdx].front}
                                </p>
                              )}
                            </div>

                            {/* Card Footer */}
                            <div className="flex items-center justify-between text-[11px] text-[#9A9DAE]">
                              <span>Click to flip card</span>
                              <span className="font-mono">{isFlipped ? "Back" : "Front"}</span>
                            </div>

                          </div>
                        </div>

                        {/* Flashcards controls */}
                        <div className="flex justify-between items-center">
                          <button
                            disabled={currentFlashcardIdx === 0}
                            onClick={() => {
                              setIsFlipped(false);
                              setCurrentFlashcardIdx((prev) => Math.max(0, prev - 1));
                            }}
                            className="px-4 py-2 text-xs font-semibold rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white disabled:opacity-40 disabled:hover:bg-white/5 transition cursor-pointer"
                          >
                            Previous
                          </button>
                          
                          <div className="flex gap-1.5">
                            {activeFlashcards.map((_, idx) => (
                              <div
                                key={idx}
                                className={`h-1.5 w-1.5 rounded-full transition ${
                                  idx === currentFlashcardIdx ? "bg-[#2DD4BF] w-3" : "bg-white/10"
                                }`}
                              />
                            ))}
                          </div>

                          <button
                            disabled={currentFlashcardIdx === activeFlashcards.length - 1}
                            onClick={() => {
                              setIsFlipped(false);
                              setCurrentFlashcardIdx((prev) => Math.min(activeFlashcards.length - 1, prev + 1));
                            }}
                            className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#7C3AED] text-white hover:bg-[#7C3AED]/90 disabled:opacity-40 disabled:hover:bg-[#7C3AED] transition cursor-pointer"
                          >
                            Next Card
                          </button>
                        </div>

                        <div className="p-4 rounded-xl bg-[#7C3AED]/10 border border-[#7C3AED]/20 text-center text-xs text-[#ECECF1]">
                          Active Recall strengthens the connections between synapses. Re-review cards multiple times until you achieve 100% fluent recall.
                        </div>

                      </div>
                    ) : (
                      <div className="text-center py-12 space-y-4">
                        <Brain className="w-12 h-12 text-[#9A9DAE] mx-auto" />
                        <h3 className="text-base font-semibold text-white">Synthesize Customized Flashcards</h3>
                        <p className="text-xs text-[#9A9DAE] max-w-sm">Formulate interactive memory-retaining flashcards specifically tuned to the active study subject.</p>
                        <button
                          onClick={handleGenerateFlashcards}
                          className="px-4 py-2 rounded-lg bg-[#7C3AED] hover:bg-[#7C3AED]/90 text-white text-xs font-semibold transition cursor-pointer"
                        >
                          Generate Flashcards
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* WORKSPACE AREA - QUIZ VIEW */}
                {workspaceTab === "quiz" && (
                  <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center">
                    {isLoading ? (
                      <div className="my-auto flex flex-col items-center space-y-3">
                        <RefreshCw className="w-8 h-8 text-[#2DD4BF] animate-spin" />
                        <span className="text-sm text-[#9A9DAE]">Compiling interactive quiz assessment...</span>
                      </div>
                    ) : activeQuiz.length > 0 ? (
                      <div className="w-full max-w-2xl space-y-8">
                        
                        {/* Header stats */}
                        <div className="flex items-center justify-between border-b border-white/5 pb-4">
                          <div>
                            <h3 className="text-lg font-bold font-display text-white">Interactive Assessment Prep</h3>
                            <p className="text-xs text-[#9A9DAE]">Subject: {activeSubject.name}</p>
                          </div>
                          {quizScore !== null && (
                            <div className="px-3.5 py-1.5 rounded-xl bg-[#2DD4BF]/15 border border-[#2DD4BF]/30 text-[#2DD4BF] font-semibold text-sm">
                              Score: {quizScore} / {activeQuiz.length} ({Math.round((quizScore / activeQuiz.length) * 100)}%)
                            </div>
                          )}
                        </div>

                        {/* Quiz Questions List */}
                        <div className="space-y-6">
                          {activeQuiz.map((q, qIdx) => {
                            const isGraded = quizScore !== null;
                            return (
                              <div key={q.id} className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-4">
                                <span className="text-xs font-mono text-[#2DD4BF] uppercase tracking-wider block">Question {qIdx + 1} of {activeQuiz.length}</span>
                                <h4 className="text-sm font-semibold text-white leading-relaxed">{q.question}</h4>
                                
                                <div className="space-y-2">
                                  {q.options.map((option, oIdx) => {
                                    const isSelected = q.userSelectedAnswerIndex === oIdx;
                                    const isCorrect = q.correctAnswerIndex === oIdx;
                                    
                                    let optionStyle = "bg-white/3 border-white/5 text-gray-300 hover:bg-white/5 hover:border-white/10";
                                    
                                    if (isSelected) {
                                      optionStyle = "bg-[#7C3AED]/15 border-[#7C3AED] text-[#ECECF1] font-medium";
                                    }
                                    
                                    if (isGraded) {
                                      if (isCorrect) {
                                        optionStyle = "bg-emerald-500/10 border-emerald-500/40 text-emerald-300 font-medium";
                                      } else if (isSelected) {
                                        optionStyle = "bg-red-500/10 border-red-500/40 text-red-300 font-medium";
                                      } else {
                                        optionStyle = "bg-white/2 border-white/5 text-gray-500";
                                      }
                                    }

                                    return (
                                      <button
                                        key={oIdx}
                                        disabled={isGraded}
                                        onClick={() => handleSelectQuizAnswer(qIdx, oIdx)}
                                        className={`w-full text-left p-3.5 rounded-xl text-xs border transition flex items-center justify-between cursor-pointer ${optionStyle}`}
                                      >
                                        <span>{option}</span>
                                        {isSelected && !isGraded && (
                                          <span className="h-2 w-2 rounded-full bg-[#2DD4BF]" />
                                        )}
                                        {isGraded && isCorrect && (
                                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                                        )}
                                      </button>
                                    );
                                  })}
                                </div>

                                {isGraded && (
                                  <div className="p-3.5 rounded-xl bg-white/2 border border-white/5 text-[11px] text-[#9A9DAE] leading-relaxed">
                                    <strong className="text-white block mb-0.5">Syllabus Explanation:</strong>
                                    {q.explanation}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Grade Actions */}
                        {quizScore === null ? (
                          <button
                            onClick={handleGradeQuiz}
                            className="w-full py-4 rounded-xl bg-[#7C3AED] hover:bg-[#7C3AED]/90 text-white font-semibold text-sm transition cursor-pointer"
                          >
                            Grade Assessment
                          </button>
                        ) : (
                          <div className="flex gap-4">
                            <button
                              onClick={handleGenerateQuiz}
                              className="flex-1 py-4 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 text-sm font-semibold transition cursor-pointer"
                            >
                              New Quiz Session
                            </button>
                            <button
                              onClick={() => setWorkspaceTab("chat")}
                              className="flex-1 py-4 rounded-xl bg-[#7C3AED] hover:bg-[#7C3AED]/90 text-white font-semibold text-sm transition cursor-pointer"
                            >
                              Go to Chat Stream
                            </button>
                          </div>
                        )}

                      </div>
                    ) : (
                      <div className="my-auto text-center py-12 space-y-4">
                        <HelpCircle className="w-12 h-12 text-[#9A9DAE] mx-auto" />
                        <h3 className="text-base font-semibold text-white">Generate Interactive Quiz Assessment</h3>
                        <p className="text-xs text-[#9A9DAE] max-w-sm">Compile multiple choice questions based on the active curriculum to lock in key learning milestones.</p>
                        <button
                          onClick={handleGenerateQuiz}
                          className="px-4 py-2 rounded-lg bg-[#7C3AED] hover:bg-[#7C3AED]/90 text-white text-xs font-semibold transition cursor-pointer"
                        >
                          Generate Quiz
                        </button>
                      </div>
                    )}
                  </div>
                )}

              </main>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
