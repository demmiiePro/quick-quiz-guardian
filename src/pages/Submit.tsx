
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  Clock, 
  FileText, 
  Award,
  Home
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

  const getGrade = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 90) return { grade: 'A', color: 'text-green-600' };
    if (percentage >= 80) return { grade: 'B', color: 'text-blue-600' };
    if (percentage >= 70) return { grade: 'C', color: 'text-yellow-600' };
    if (percentage >= 60) return { grade: 'D', color: 'text-orange-600' };
    return { grade: 'F', color: 'text-red-600' };
  };

  if (!result) return null;

  const { grade, color } = getGrade(result.score, result.totalQuestions);
  const percentage = ((result.score / result.totalQuestions) * 100).toFixed(1);

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
            Your answers have been recorded and submitted.
          </p>
        </div>

        {/* Result Card */}
        <Card className="max-w-2xl mx-auto mb-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
            <CardTitle className="text-center text-xl">Exam Summary</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {/* Student Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-600">Student Name</p>
                <p className="font-semibold text-lg">{result.student.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Class</p>
                <p className="font-semibold text-lg">{result.student.class}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Subject</p>
                <p className="font-semibold text-lg">{result.student.subject}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Submission Date</p>
                <p className="font-semibold text-lg">
                  {new Date(result.submittedAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Questions</p>
                <p className="text-xl font-bold text-blue-600">
                  {result.totalQuestions}
                </p>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Correct</p>
                <p className="text-xl font-bold text-green-600">
                  {result.score}
                </p>
              </div>

              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Award className={`h-8 w-8 mx-auto mb-2 ${color}`} />
                <p className="text-sm text-gray-600">Grade</p>
                <p className={`text-xl font-bold ${color}`}>
                  {grade}
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

            {/* Score Display */}
            <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Final Score</h3>
              <div className="flex items-center justify-center gap-4">
                <span className="text-4xl font-bold text-blue-600">
                  {result.score}/{result.totalQuestions}
                </span>
                <span className="text-3xl font-bold text-gray-400">|</span>
                <span className="text-4xl font-bold text-green-600">
                  {percentage}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Message */}
        <Card className="max-w-2xl mx-auto mb-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {percentage >= '80' ? 'Excellent Work!' : 
               percentage >= '70' ? 'Good Job!' : 
               percentage >= '60' ? 'Well Done!' : 'Keep Practicing!'}
            </h3>
            <p className="text-gray-600">
              {percentage >= '80' ? 'You have demonstrated excellent understanding of the subject matter.' :
               percentage >= '70' ? 'You have shown good grasp of the concepts covered.' :
               percentage >= '60' ? 'You have a fair understanding. Review areas where you had difficulty.' :
               'Consider reviewing the material and practicing more. You can do better!'}
            </p>
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
            Your results have been recorded. Contact your teacher if you have any questions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Submit;
