
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Clock, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Shield, 
  Eye,
  MousePointer
} from 'lucide-react';

const ExamInfo = () => {
  const [studentInfo, setStudentInfo] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('studentInfo');
    if (!stored) {
      navigate('/');
      return;
    }
    setStudentInfo(JSON.parse(stored));
  }, [navigate]);

  const handleStartExam = () => {
    // Request fullscreen
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
    navigate('/exam');
  };

  if (!studentInfo) return null;

  const examRules = [
    {
      icon: <Clock className="h-5 w-5 text-blue-600" />,
      title: "Time Limit",
      description: "You have 60 minutes to complete all questions. The exam will auto-submit when time expires."
    },
    {
      icon: <FileText className="h-5 w-5 text-green-600" />,
      title: "Question Format",
      description: "20 questions total: Multiple choice, True/False, and Short answer questions."
    },
    {
      icon: <Shield className="h-5 w-5 text-purple-600" />,
      title: "Security Mode",
      description: "The exam will run in fullscreen mode. Your answers are automatically saved."
    },
    {
      icon: <Eye className="h-5 w-5 text-orange-600" />,
      title: "Monitoring",
      description: "Your session is monitored. Do not attempt to leave the exam window."
    },
    {
      icon: <MousePointer className="h-5 w-5 text-red-600" />,
      title: "Navigation",
      description: "Use Previous/Next buttons to navigate. You can review answers before submitting."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Exam Instructions</h1>
          <p className="text-lg text-gray-600">Please read carefully before starting</p>
        </div>

        {/* Student Info Card */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="text-center">Exam Details</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-600">Student</p>
                <p className="font-semibold text-lg">{studentInfo.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Class</p>
                <p className="font-semibold text-lg">{studentInfo.class}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Subject</p>
                <p className="font-semibold text-lg">{studentInfo.subject}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Notice */}
        <Alert className="mb-8 border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Important:</strong> Once you start the exam, you cannot go back to this page. 
            Make sure you understand all instructions before proceeding.
          </AlertDescription>
        </Alert>

        {/* Exam Rules */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Exam Rules & Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {examRules.map((rule, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                  {rule.icon}
                  <div>
                    <h4 className="font-semibold text-gray-900">{rule.title}</h4>
                    <p className="text-sm text-gray-600">{rule.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Start Exam Button */}
        <div className="text-center">
          <Button 
            onClick={handleStartExam}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 text-lg"
          >
            Start Exam
          </Button>
          <p className="text-sm text-gray-600 mt-2">
            Click to begin your exam session
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExamInfo;
