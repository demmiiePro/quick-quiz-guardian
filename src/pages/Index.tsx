
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GraduationCap } from 'lucide-react';

const Index = () => {
  const [studentInfo, setStudentInfo] = useState({
    name: '',
    class: '',
    subject: ''
  });
  const [teacherClicks, setTeacherClicks] = useState(0);
  const navigate = useNavigate();

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (studentInfo.name && studentInfo.class && studentInfo.subject) {
      // Store student info for the exam
      localStorage.setItem('studentInfo', JSON.stringify(studentInfo));
      navigate('/exam-info');
    }
  };

  const handleLogoClick = () => {
    const newClicks = teacherClicks + 1;
    setTeacherClicks(newClicks);
    
    if (newClicks === 5) {
      const teacherKey = prompt('Enter teacher access key:');
      if (teacherKey === 'teacher2024') {
        navigate('/dashboard');
      } else {
        alert('Invalid access key');
      }
      setTeacherClicks(0);
    }
  };

  const subjects = [
    'Mathematics', 'English Language', 'Physics', 'Chemistry', 'Biology',
    'Geography', 'History', 'Economics', 'Literature', 'Computer Science'
  ];

  const classes = [
    'JSS 1', 'JSS 2', 'JSS 3', 'SS 1', 'SS 2', 'SS 3'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div 
            className="inline-flex items-center gap-3 cursor-pointer select-none"
            onClick={handleLogoClick}
          >
            <GraduationCap className="h-12 w-12 text-blue-600" />
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Premier Academy</h1>
              <p className="text-lg text-gray-600">Computer-Based Test System</p>
            </div>
          </div>
        </div>

        {/* Student Information Form */}
        <Card className="max-w-md mx-auto bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="text-center">Student Information</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleStudentSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={studentInfo.name}
                  onChange={(e) => setStudentInfo({...studentInfo, name: e.target.value})}
                  placeholder="Enter your full name"
                  className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <Label htmlFor="class" className="text-sm font-medium text-gray-700">
                  Class
                </Label>
                <Select
                  value={studentInfo.class}
                  onValueChange={(value) => setStudentInfo({...studentInfo, class: value})}
                  required
                >
                  <SelectTrigger className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Select your class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls} value={cls}>
                        {cls}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="subject" className="text-sm font-medium text-gray-700">
                  Subject
                </Label>
                <Select
                  value={studentInfo.subject}
                  onValueChange={(value) => setStudentInfo({...studentInfo, subject: value})}
                  required
                >
                  <SelectTrigger className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                Continue to Exam
              </Button>
            </form>
          </CardContent>
        </Card>

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

export default Index;
