
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  Clock, 
  FileText, 
  Home,
  User,
  Calendar,
  BookOpen
} from 'lucide-react';

const Submit = () => {
  const [result, setResult] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const results = JSON.parse(localStorage.getItem('examResults') || '[]');
    if (results.length > 0) {
      setResult(results[results.length - 1]); // Get the latest result
    } else {
      navigate('/');
    }

    // Prevent back navigation
    window.history.pushState(null, '', window.location.href);
    window.onpopstate = () => {
      window.history.pushState(null, '', window.location.href);
    };
  }, [navigate]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} minutes ${secs} seconds`;
  };

  if (!result) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="container mx-auto px-4 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Exam Submitted Successfully!
          </h1>
          <p className="text-lg text-gray-600">
            Your answers have been recorded and submitted for review.
          </p>
        </div>

        {/* Submission Details */}
        <Card className="max-w-2xl mx-auto mb-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
            <CardTitle className="text-center text-xl">Submission Details</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {/* Student Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Student Name</p>
                  <p className="font-semibold text-lg">{result.student.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Class</p>
                  <p className="font-semibold text-lg">{result.student.class}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-indigo-600" />
                <div>
                  <p className="text-sm text-gray-600">Subject</p>
                  <p className="font-semibold text-lg">{result.student.subject}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Submission Date</p>
                  <p className="font-semibold text-lg">
                    {new Date(result.submittedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Exam Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Total Questions</p>
                <p className="text-xl font-bold text-blue-600">
                  {result.totalQuestions}
                </p>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Questions Answered</p>
                <p className="text-xl font-bold text-green-600">
                  {Object.keys(result.answers).length}
                </p>
              </div>

              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Time Taken</p>
                <p className="text-xl font-bold text-yellow-600">
                  {formatTime(result.timeTaken)}
                </p>
              </div>
            </div>

            {/* Submission Confirmation */}
            <div className="text-center p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Submission Reference
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                Submission ID: <span className="font-mono font-medium">#{result.submittedAt.slice(-8).toUpperCase()}</span>
              </p>
              <p className="text-sm text-gray-600">
                Time: {new Date(result.submittedAt).toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="max-w-2xl mx-auto mb-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              What Happens Next?
            </h3>
            <div className="space-y-2 text-gray-600 text-sm">
              <p>✓ Your exam has been securely submitted to your teacher</p>
              <p>✓ Your answers will be reviewed and graded</p>
              <p>✓ Results will be announced according to your school's schedule</p>
              <p>✓ Contact your teacher if you have any questions about the exam</p>
            </div>
          </CardContent>
        </Card>

        {/* Return Home Button */}
        <div className="text-center">
          <Button 
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            <Home className="h-4 w-4 mr-2" />
            Return to Home
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-600">
          <p className="text-sm">
            Your submission has been recorded. Please wait for your teacher to announce results.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Submit;
