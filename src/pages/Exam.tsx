
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
  Send
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Exam = () => {
  const [studentInfo, setStudentInfo] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes in seconds
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const navigate = useNavigate();
  const timerRef = useRef<NodeJS.Timeout>();

  // Sample questions - in production, this would come from an API
  const questions = [
    {
      id: 1,
      type: "multiple_choice",
      question: "What is the capital city of Nigeria?",
      options: ["Lagos", "Abuja", "Kano", "Port Harcourt"],
      correct_answer: "B"
    },
    {
      id: 2,
      type: "true_false",
      question: "The Earth is approximately 4.5 billion years old.",
      correct_answer: "True"
    },
    {
      id: 3,
      type: "multiple_choice",
      question: "Which planet is closest to the Sun?",
      options: ["Venus", "Mercury", "Mars", "Earth"],
      correct_answer: "B"
    },
    {
      id: 4,
      type: "short_answer",
      question: "Define photosynthesis in one sentence.",
      correct_answer: "The process by which plants make food using sunlight"
    },
    {
      id: 5,
      type: "multiple_choice",
      question: "What is 15 × 8?",
      options: ["110", "120", "130", "140"],
      correct_answer: "B"
    },
    {
      id: 6,
      type: "true_false",
      question: "Water boils at 100°C at sea level.",
      correct_answer: "True"
    },
    {
      id: 7,
      type: "multiple_choice",
      question: "Who wrote the novel 'Things Fall Apart'?",
      options: ["Wole Soyinka", "Chinua Achebe", "Ben Okri", "Chimamanda Adichie"],
      correct_answer: "B"
    },
    {
      id: 8,
      type: "short_answer",
      question: "What is the formula for calculating the area of a circle?",
      correct_answer: "π × r²"
    },
    {
      id: 9,
      type: "multiple_choice",
      question: "Which gas makes up about 78% of Earth's atmosphere?",
      options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Argon"],
      correct_answer: "C"
    },
    {
      id: 10,
      type: "true_false",
      question: "The human heart has four chambers.",
      correct_answer: "True"
    },
    {
      id: 11,
      type: "multiple_choice",
      question: "What is the smallest prime number?",
      options: ["0", "1", "2", "3"],
      correct_answer: "C"
    },
    {
      id: 12,
      type: "short_answer",
      question: "Name the process of changing from liquid to gas.",
      correct_answer: "Evaporation"
    },
    {
      id: 13,
      type: "multiple_choice",
      question: "Which continent is the largest by area?",
      options: ["Africa", "Asia", "North America", "Europe"],
      correct_answer: "B"
    },
    {
      id: 14,
      type: "true_false",
      question: "Lightning is hotter than the surface of the Sun.",
      correct_answer: "True"
    },
    {
      id: 15,
      type: "multiple_choice",
      question: "What is the past tense of 'go'?",
      options: ["Goes", "Gone", "Went", "Going"],
      correct_answer: "C"
    },
    {
      id: 16,
      type: "short_answer",
      question: "What is the main function of red blood cells?",
      correct_answer: "To carry oxygen throughout the body"
    },
    {
      id: 17,
      type: "multiple_choice",
      question: "Which element has the chemical symbol 'O'?",
      options: ["Osmium", "Oxygen", "Gold", "Silver"],
      correct_answer: "B"
    },
    {
      id: 18,
      type: "true_false",
      question: "The Great Wall of China is visible from space.",
      correct_answer: "False"
    },
    {
      id: 19,
      type: "multiple_choice",
      question: "What is 144 ÷ 12?",
      options: ["11", "12", "13", "14"],
      correct_answer: "B"
    },
    {
      id: 20,
      type: "short_answer",
      question: "What is the largest organ in the human body?",
      correct_answer: "Skin"
    }
  ];

  const questionsPerPage = 5;
  const totalPages = Math.ceil(questions.length / questionsPerPage);
  const currentQuestions = questions.slice(
    currentPage * questionsPerPage,
    (currentPage + 1) * questionsPerPage
  );

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

    // Security measures
    document.addEventListener('contextmenu', (e) => e.preventDefault());
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';

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
      document.removeEventListener('contextmenu', (e) => e.preventDefault());
      document.body.style.userSelect = 'auto';
      document.body.style.webkitUserSelect = 'auto';
    };
  }, [navigate]);

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

    // Store results
    const result = {
      student: studentInfo,
      answers,
      score,
      totalQuestions: questions.length,
      timeTaken: Math.floor(timeTaken / 1000),
      submittedAt: new Date().toISOString()
    };

    const existingResults = JSON.parse(localStorage.getItem('examResults') || '[]');
    existingResults.push(result);
    localStorage.setItem('examResults', JSON.stringify(existingResults));

    // Clear exam data
    localStorage.removeItem('examAnswers');
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 relative">
      {/* Student Watermark */}
      <div className="fixed top-4 right-4 bg-black/5 text-gray-600 text-xs px-3 py-1 rounded-full pointer-events-none z-50">
        {studentInfo.name} | {studentInfo.class}
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
