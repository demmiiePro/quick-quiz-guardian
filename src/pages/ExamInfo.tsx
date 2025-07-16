
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, BookOpen, AlertTriangle, GraduationCap } from 'lucide-react';

const ExamInfo = () => {
  const [studentInfo, setStudentInfo] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const info = localStorage.getItem('studentInfo');
    if (!info) {
      navigate('/');
      return;
    }
    setStudentInfo(JSON.parse(info));
  }, [navigate]);

  const handleStartExam = () => {
    navigate('/exam');
  };

  if (!studentInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3">
            <GraduationCap className="h-12 w-12 text-blue-600" />
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Premier Academy</h1>
              <p className="text-lg text-gray-600">Computer-Based Test System</p>
            </div>
          </div>
        </div>

        {/* Student Information */}
        <Card className="max-w-2xl mx-auto mb-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="text-center">Student Information</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-600">Name</p>
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

        {/* Exam Information */}
        <Card className="max-w-2xl mx-auto mb-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
            <CardTitle className="text-center">Exam Details</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="flex flex-col items-center gap-2">
                <Clock className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="font-semibold text-lg">60 minutes</p>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <BookOpen className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Questions</p>
                  <p className="font-semibold text-lg">20 questions</p>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <AlertTriangle className="h-8 w-8 text-yellow-600" />
                <div>
                  <p className="text-sm text-gray-600">Type</p>
                  <p className="font-semibold text-lg">Multiple Choice</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="max-w-2xl mx-auto mb-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-t-lg">
            <CardTitle className="text-center">Exam Instructions</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">1.</span>
                <span>Read each question carefully before selecting your answer.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">2.</span>
                <span>You can navigate between questions using the question panel.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">3.</span>
                <span>Your progress is automatically saved as you work.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">4.</span>
                <span>Click "Submit Exam" when you have completed all questions.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">5.</span>
                <span>The exam will automatically submit when the time expires.</span>
              </li>
            </ul>
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
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-600">
          <p className="text-sm">
            © 2024 Premier Academy. All rights reserved.
          </p>
          <p className="text-xs mt-1">
            Secure CBT System - Powered by Lovable
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExamInfo;
