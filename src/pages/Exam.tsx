import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  AlertTriangle,
  CheckCircle,
  Send,
  Shield,
  Eye
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { biologyQuestions } from '@/data/biologyQuestions';

const Exam = () => {
  const [studentInfo, setStudentInfo] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes in seconds
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const navigate = useNavigate();
  const timerRef = useRef<NodeJS.Timeout>();

  // Biology questions for SS2 students
  const questions = biologyQuestions;

  const questionsPerPage = 15;
  const totalPages = Math.ceil(questions.length / questionsPerPage);
  const currentQuestions = questions.slice(
    currentPage * questionsPerPage,
    (currentPage + 1) * questionsPerPage
  );

  // Anti-cheat system initialization
  useEffect(() => {
    const stored = localStorage.getItem('studentInfo');
    if (!stored) {
      navigate('/');
      return;
    }
    setStudentInfo(JSON.parse(stored));

    // Load saved answers
    const savedAnswers = localStorage.getItem('examAnswers');
    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers));
    }

    // Initialize anti-cheat measures
    initializeAntiCheatSystem();

    // Timer
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        if (prev === 301) { // 5 minutes warning
          toast({
            title: "Time Warning",
            description: "5 minutes remaining!",
            variant: "destructive"
          });
        }
        if (prev === 61) { // 1 minute warning
          toast({
            title: "Final Warning",
            description: "1 minute remaining!",
            variant: "destructive"
          });
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      cleanupAntiCheatSystem();
    };
  }, [navigate]);

  // Anti-cheat system functions
  const initializeAntiCheatSystem = () => {
    // Request fullscreen
    enterFullscreen();

    // Disable right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      toast({
        title: "Action Blocked",
        description: "Right-click is disabled during the exam",
        variant: "destructive"
      });
    };

    // Block copy, paste, and other keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Block Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+A, Ctrl+S, F12, etc.
      if ((e.ctrlKey || e.metaKey) && ['c', 'v', 'x', 'a', 's', 'p'].includes(e.key.toLowerCase())) {
        e.preventDefault();
        toast({
          title: "Action Blocked",
          description: "Copy/paste operations are disabled during the exam",
          variant: "destructive"
        });
      }
      
      // Block F12 (Developer Tools)
      if (e.key === 'F12') {
        e.preventDefault();
        toast({
          title: "Action Blocked",
          description: "Developer tools are disabled during the exam",
          variant: "destructive"
        });
      }

      // Block Alt+Tab (Windows) and Cmd+Tab (Mac)
      if ((e.altKey && e.key === 'Tab') || (e.metaKey && e.key === 'Tab')) {
        e.preventDefault();
        toast({
          title: "Action Blocked",
          description: "Tab switching is discouraged during the exam",
          variant: "destructive"
        });
      }
    };

    // Monitor tab visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        const newCount = tabSwitchCount + 1;
        setTabSwitchCount(newCount);
        
        toast({
          title: "⚠️ Tab Switch Detected",
          description: `You've switched tabs (${newCount} times). Please return to the exam window.`,
          variant: "destructive"
        });

        // Log suspicious behavior
        console.log(`Tab switch detected. Count: ${newCount}`);
        
        // Store in localStorage for dashboard tracking
        const existingLogs = JSON.parse(localStorage.getItem('examLogs') || '[]');
        existingLogs.push({
          type: 'tab_switch',
          timestamp: new Date().toISOString(),
          count: newCount
        });
        localStorage.setItem('examLogs', JSON.stringify(existingLogs));
      }
    };

    // Monitor fullscreen changes
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );
      
      setIsFullscreen(isCurrentlyFullscreen);
      
      if (!isCurrentlyFullscreen) {
        toast({
          title: "⚠️ Fullscreen Exit Detected",
          description: "Please return to fullscreen mode for the exam",
          variant: "destructive"
        });
        
        // Attempt to re-enter fullscreen
        setTimeout(() => {
          enterFullscreen();
        }, 1000);
      }
    };

    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    // Disable text selection using proper TypeScript approach
    const bodyStyle = document.body.style as any;
    bodyStyle.userSelect = 'none';
    bodyStyle.webkitUserSelect = 'none';
    // Only set vendor-specific properties if they exist
    if ('msUserSelect' in bodyStyle) {
      bodyStyle.msUserSelect = 'none';
    }
    if ('mozUserSelect' in bodyStyle) {
      bodyStyle.mozUserSelect = 'none';
    }

    // Store event listeners for cleanup
    (window as any).examEventListeners = {
      handleContextMenu,
      handleKeyDown,
      handleVisibilityChange,
      handleFullscreenChange
    };
  };

  const cleanupAntiCheatSystem = () => {
    const listeners = (window as any).examEventListeners;
    if (listeners) {
      document.removeEventListener('contextmenu', listeners.handleContextMenu);
      document.removeEventListener('keydown', listeners.handleKeyDown);
      document.removeEventListener('visibilitychange', listeners.handleVisibilityChange);
      document.removeEventListener('fullscreenchange', listeners.handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', listeners.handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', listeners.handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', listeners.handleFullscreenChange);
    }

    // Restore text selection using proper TypeScript approach
    const bodyStyle = document.body.style as any;
    bodyStyle.userSelect = 'auto';
    bodyStyle.webkitUserSelect = 'auto';
    // Only set vendor-specific properties if they exist
    if ('msUserSelect' in bodyStyle) {
      bodyStyle.msUserSelect = 'auto';
    }
    if ('mozUserSelect' in bodyStyle) {
      bodyStyle.mozUserSelect = 'auto';
    }

    // Exit fullscreen
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  };

  const enterFullscreen = () => {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if ((element as any).webkitRequestFullscreen) {
      (element as any).webkitRequestFullscreen();
    } else if ((element as any).mozRequestFullScreen) {
      (element as any).mozRequestFullScreen();
    } else if ((element as any).msRequestFullscreen) {
      (element as any).msRequestFullscreen();
    }
  };

  useEffect(() => {
    // Auto-save answers
    localStorage.setItem('examAnswers', JSON.stringify(answers));
  }, [answers]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = () => {
    const startTime = localStorage.getItem('examStartTime');
    const timeTaken = startTime ? Date.now() - parseInt(startTime) : 0;
    
    // Calculate score
    let score = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correct_answer) {
        score++;
      }
    });

    // Store results with anti-cheat logs
    const examLogs = JSON.parse(localStorage.getItem('examLogs') || '[]');
    const result = {
      student: studentInfo,
      answers,
      score,
      totalQuestions: questions.length,
      timeTaken: Math.floor(timeTaken / 1000),
      submittedAt: new Date().toISOString(),
      tabSwitchCount,
      securityLogs: examLogs
    };

    const existingResults = JSON.parse(localStorage.getItem('examResults') || '[]');
    existingResults.push(result);
    localStorage.setItem('examResults', JSON.stringify(existingResults));

    // Clear exam data
    localStorage.removeItem('examAnswers');
    localStorage.removeItem('examLogs');
    localStorage.removeItem('studentInfo');

    navigate('/submit');
  };

  const renderQuestion = (question: any, index: number) => {
    const questionNumber = currentPage * questionsPerPage + index + 1;
    
    return (
      <Card key={question.id} className="mb-4 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
              Q{questionNumber}
            </span>
            {question.question}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {question.type === 'multiple_choice' && (
            <RadioGroup
              value={answers[question.id] || ''}
              onValueChange={(value) => handleAnswerChange(question.id, value)}
              className="space-y-2"
            >
              {question.options.map((option: string, optionIndex: number) => (
                <div key={optionIndex} className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value={String.fromCharCode(65 + optionIndex)} 
                    id={`${question.id}-${optionIndex}`}
                    className="border-gray-300"
                  />
                  <Label 
                    htmlFor={`${question.id}-${optionIndex}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {String.fromCharCode(65 + optionIndex)}. {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {question.type === 'true_false' && (
            <RadioGroup
              value={answers[question.id] || ''}
              onValueChange={(value) => handleAnswerChange(question.id, value)}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="True" id={`${question.id}-true`} />
                <Label htmlFor={`${question.id}-true`} className="cursor-pointer">True</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="False" id={`${question.id}-false`} />
                <Label htmlFor={`${question.id}-false`} className="cursor-pointer">False</Label>
              </div>
            </RadioGroup>
          )}

          {question.type === 'short_answer' && (
            <Input
              value={answers[question.id] || ''}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              placeholder="Type your answer here..."
              className="mt-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          )}

          {answers[question.id] && (
            <div className="mt-2 flex items-center gap-2 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">Answered</span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const progress = ((currentPage + 1) / totalPages) * 100;
  const answeredCount = Object.keys(answers).length;

  if (!studentInfo) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 relative exam-mode">
      {/* Student Watermark */}
      <div className="fixed top-4 right-4 bg-black/5 text-gray-600 text-xs px-3 py-1 rounded-full pointer-events-none z-50">
        {studentInfo.name} | {studentInfo.class}
      </div>

      {/* Floating Security Watermark */}
      <div className="fixed bottom-4 left-4 opacity-20 text-xs pointer-events-none z-50 text-gray-500">
        Student: {studentInfo.name} | Class: {studentInfo.class} | MONITORED SESSION
      </div>

      {/* Security Status Indicators */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg px-3 py-1 z-50">
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <Shield className={`h-3 w-3 ${isFullscreen ? 'text-green-600' : 'text-red-600'}`} />
            <span className={isFullscreen ? 'text-green-600' : 'text-red-600'}>
              {isFullscreen ? 'Secured' : 'Not Secured'}
            </span>
          </div>
          {tabSwitchCount > 0 && (
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3 text-orange-600" />
              <span className="text-orange-600">Tab switches: {tabSwitchCount}</span>
            </div>
          )}
        </div>
      </div>

      {/* Timer */}
      <div className="fixed top-4 left-4 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg px-4 py-2 z-50">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-red-600" />
          <span className={`font-mono font-bold ${timeLeft < 300 ? 'text-red-600' : 'text-gray-900'}`}>
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 pt-20">
        {/* Security Warning */}
        <Alert className="mb-6 border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <strong>⚠️ Security Notice:</strong> This exam is monitored. Copying, pasting, screenshots, and tab switching are tracked. Stay focused on the exam window!
          </AlertDescription>
        </Alert>

        {/* Header */}
        <Card className="mb-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {studentInfo.subject} Examination
                </h1>
                <p className="text-sm text-gray-600">
                  Page {currentPage + 1} of {totalPages} | Questions {answeredCount}/{questions.length} answered
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600 mb-1">Progress</div>
                <div className="w-32">
                  <Progress value={progress} className="h-2" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Time Warning */}
        {timeLeft < 300 && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Time Warning:</strong> Less than 5 minutes remaining!
            </AlertDescription>
          </Alert>
        )}

        {/* Tab Switch Warning */}
        {tabSwitchCount > 0 && (
          <Alert className="mb-6 border-orange-200 bg-orange-50">
            <Eye className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>Behavior Alert:</strong> {tabSwitchCount} tab switch(es) detected. Please focus on the exam.
            </AlertDescription>
          </Alert>
        )}

        {/* Questions */}
        <div className="mb-6">
          {currentQuestions.map((question, index) => renderQuestion(question, index))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i}
                variant={i === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(i)}
                className="w-8 h-8 p-0"
              >
                {i + 1}
              </Button>
            ))}
          </div>

          {currentPage === totalPages - 1 ? (
            <Button
              onClick={() => setShowSubmitDialog(true)}
              className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              Submit Exam
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
              className="flex items-center gap-2"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Submit Dialog */}
        {showSubmitDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-96 bg-white">
              <CardHeader>
                <CardTitle className="text-center text-red-600">Submit Exam</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="mb-4">
                  You have answered {answeredCount} out of {questions.length} questions.
                </p>
                {tabSwitchCount > 0 && (
                  <p className="mb-4 text-orange-600 text-sm">
                    Security Note: {tabSwitchCount} tab switch(es) detected during exam.
                  </p>
                )}
                <p className="mb-6 text-sm text-gray-600">
                  Are you sure you want to submit your exam? This action cannot be undone.
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowSubmitDialog(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  >
                    Submit
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Exam;
