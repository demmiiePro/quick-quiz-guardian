import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  Download, 
  Eye, 
  BarChart3,
  PieChart,
  Activity,
  AlertTriangle,
  Target,
  Calendar,
  Filter,
  RefreshCw
} from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, PieChart as RechartsPieChart, Cell, ResponsiveContainer, ScatterChart, Scatter } from "recharts";
import { CLASS_LEVELS, DEPARTMENTS } from "@/data/subjects";
import { BehaviorRating } from "@/data/studentBehavior";

interface ExamResult {
  studentInfo: {
    name: string;
    class: string;
    department?: string;
    subject: string;
  };
  score: number;
  correctAnswers: number;
  wrongAnswers: number;
  totalQuestions: number;
  timeTaken: number;
  timestamp: string;
  tabSwitchCount: number;
  behaviorAnalysis?: {
    rating: BehaviorRating;
    totalPoints: number;
    violationCount: number;
    positiveActions: number;
    riskLevel: 'low' | 'medium' | 'high';
    summary: string;
    recommendations: string[];
  };
  studentActions?: any[];
}

const EnhancedDashboard = () => {
  const [results, setResults] = useState<ExamResult[]>([]);
  const [filteredResults, setFilteredResults] = useState<ExamResult[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [behaviorFilter, setBehaviorFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState<ExamResult | null>(null);

  useEffect(() => {
    // Load exam results from localStorage
    const storedResults = localStorage.getItem('examResults');
    if (storedResults) {
      const parsedResults = JSON.parse(storedResults);
      setResults(parsedResults);
      setFilteredResults(parsedResults);
    }
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = results.filter(result => {
      const matchesSearch = result.studentInfo.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesClass = classFilter === "all" || result.studentInfo.class === classFilter;
      const matchesDepartment = departmentFilter === "all" || result.studentInfo.department === departmentFilter;
      const matchesSubject = subjectFilter === "all" || result.studentInfo.subject === subjectFilter;
      const matchesBehavior = behaviorFilter === "all" || result.behaviorAnalysis?.rating === behaviorFilter;
      
      let matchesDate = true;
      if (dateFilter !== "all") {
        const resultDate = new Date(result.timestamp);
        const today = new Date();
        
        if (dateFilter === "today") {
          matchesDate = resultDate.toDateString() === today.toDateString();
        } else if (dateFilter === "week") {
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = resultDate >= weekAgo;
        } else if (dateFilter === "month") {
          const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesDate = resultDate >= monthAgo;
        }
      }

      return matchesSearch && matchesClass && matchesDepartment && matchesSubject && matchesBehavior && matchesDate;
    });

    setFilteredResults(filtered);
  }, [results, searchTerm, classFilter, departmentFilter, subjectFilter, behaviorFilter, dateFilter]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalStudents = filteredResults.length;
    const averageScore = totalStudents > 0 ? 
      filteredResults.reduce((sum, result) => sum + result.score, 0) / totalStudents : 0;
    const completionRate = 100; // All results are completed exams
    const activeExams = 0; // This would be dynamic in a real system

    // Behavior distribution
    const behaviorDistribution = {
      excellent: filteredResults.filter(r => r.behaviorAnalysis?.rating === 'excellent').length,
      good: filteredResults.filter(r => r.behaviorAnalysis?.rating === 'good').length,
      fair: filteredResults.filter(r => r.behaviorAnalysis?.rating === 'fair').length,
      poor: filteredResults.filter(r => r.behaviorAnalysis?.rating === 'poor').length,
      suspicious: filteredResults.filter(r => r.behaviorAnalysis?.rating === 'suspicious').length,
    };

    // Performance by class
    const classPerformance = CLASS_LEVELS.map(cls => {
      const classResults = filteredResults.filter(r => r.studentInfo.class === cls);
      return {
        class: cls,
        averageScore: classResults.length > 0 ? 
          classResults.reduce((sum, r) => sum + r.score, 0) / classResults.length : 0,
        studentCount: classResults.length
      };
    }).filter(cp => cp.studentCount > 0);

    // Subject difficulty analysis
    const subjects = [...new Set(filteredResults.map(r => r.studentInfo.subject))];
    const subjectAnalysis = subjects.map(subject => {
      const subjectResults = filteredResults.filter(r => r.studentInfo.subject === subject);
      return {
        subject,
        averageScore: subjectResults.reduce((sum, r) => sum + r.score, 0) / subjectResults.length,
        studentCount: subjectResults.length
      };
    });

    // Score distribution
    const scoreRanges = [
      { range: "0-40%", count: filteredResults.filter(r => r.score < 40).length },
      { range: "41-60%", count: filteredResults.filter(r => r.score >= 40 && r.score < 60).length },
      { range: "61-80%", count: filteredResults.filter(r => r.score >= 60 && r.score < 80).length },
      { range: "81-100%", count: filteredResults.filter(r => r.score >= 80).length },
    ];

    return {
      totalStudents,
      averageScore,
      completionRate,
      activeExams,
      behaviorDistribution,
      classPerformance,
      subjectAnalysis,
      scoreRanges
    };
  }, [filteredResults]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getBehaviorColor = (rating: BehaviorRating | undefined) => {
    switch (rating) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'fair': return 'bg-yellow-100 text-yellow-800';
      case 'poor': return 'bg-orange-100 text-orange-800';
      case 'suspicious': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      ["Name", "Class", "Department", "Subject", "Score", "Time", "Correct", "Wrong", "Behavior", "Violations", "Date"].join(","),
      ...filteredResults.map(result => [
        result.studentInfo.name,
        result.studentInfo.class,
        result.studentInfo.department || "N/A",
        result.studentInfo.subject,
        `${result.score}%`,
        formatTime(result.timeTaken),
        result.correctAnswers,
        result.wrongAnswers,
        result.behaviorAnalysis?.rating || "N/A",
        result.behaviorAnalysis?.violationCount || 0,
        new Date(result.timestamp).toLocaleString()
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `exam-results-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const chartConfig = {
    score: { label: "Score", color: "#3b82f6" },
    count: { label: "Students", color: "#10b981" },
    time: { label: "Time", color: "#f59e0b" }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Enhanced Teacher Dashboard</h1>
            <p className="text-gray-600">Comprehensive exam analytics and student behavior insights</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => window.location.reload()} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
            <Button onClick={exportToCSV} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStudents}</div>
              <p className="text-xs text-muted-foreground">Exam attempts recorded</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageScore.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">Class performance average</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completionRate}%</div>
              <p className="text-xs text-muted-foreground">Students completed exam</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Behavior Issues</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.behaviorDistribution.poor + stats.behaviorDistribution.suspicious}
              </div>
              <p className="text-xs text-muted-foreground">Students need attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Advanced Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
              <div>
                <label className="text-sm font-medium">Search Student</label>
                <Input
                  placeholder="Search by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Class</label>
                <Select value={classFilter} onValueChange={setClassFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    {CLASS_LEVELS.map(cls => (
                      <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Department</label>
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {DEPARTMENTS.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Subject</label>
                <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    {[...new Set(results.map(r => r.studentInfo.subject))].map(subject => (
                      <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Behavior</label>
                <Select value={behaviorFilter} onValueChange={setBehaviorFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ratings</SelectItem>
                    <SelectItem value="excellent">Excellent</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="poor">Poor</SelectItem>
                    <SelectItem value="suspicious">Suspicious</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Date Range</label>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button 
                  onClick={() => {
                    setSearchTerm("");
                    setClassFilter("all");
                    setDepartmentFilter("all");
                    setSubjectFilter("all");
                    setBehaviorFilter("all");
                    setDateFilter("all");
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analytics Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="behavior">Behavior</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Score Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Score Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig}>
                    <BarChart data={stats.scoreRanges}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="range" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="count" fill="#3b82f6" />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Class Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Class Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig}>
                    <LineChart data={stats.classPerformance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="class" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="averageScore" stroke="#10b981" strokeWidth={2} />
                    </LineChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="behavior" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Behavior Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Behavior Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(stats.behaviorDistribution).map(([rating, count]) => (
                      <div key={rating} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${getBehaviorColor(rating as BehaviorRating).replace('text-', 'bg-').split(' ')[0]}`}></div>
                          <span className="capitalize">{rating}</span>
                        </div>
                        <span className="font-medium">{count}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Subject Difficulty */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Subject Difficulty Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig}>
                    <BarChart data={stats.subjectAnalysis} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="subject" type="category" width={80} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="averageScore" fill="#f59e0b" />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="students" className="space-y-4">
            {/* Students Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Student Results ({filteredResults.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Name</th>
                        <th className="text-left p-2">Class</th>
                        <th className="text-left p-2">Dept</th>
                        <th className="text-left p-2">Subject</th>
                        <th className="text-left p-2">Score</th>
                        <th className="text-left p-2">Time</th>
                        <th className="text-left p-2">Behavior</th>
                        <th className="text-left p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredResults.map((result, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="p-2 font-medium">{result.studentInfo.name}</td>
                          <td className="p-2">{result.studentInfo.class}</td>
                          <td className="p-2">{result.studentInfo.department || "N/A"}</td>
                          <td className="p-2">{result.studentInfo.subject}</td>
                          <td className="p-2">
                            <Badge variant={result.score >= 70 ? "default" : result.score >= 50 ? "secondary" : "destructive"}>
                              {result.score}%
                            </Badge>
                          </td>
                          <td className="p-2">{formatTime(result.timeTaken)}</td>
                          <td className="p-2">
                            <Badge className={getBehaviorColor(result.behaviorAnalysis?.rating)}>
                              {result.behaviorAnalysis?.rating || "N/A"}
                            </Badge>
                          </td>
                          <td className="p-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => setSelectedStudent(result)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[80vh]">
                                <DialogHeader>
                                  <DialogTitle>
                                    Detailed Report: {result.studentInfo.name}
                                  </DialogTitle>
                                </DialogHeader>
                                <ScrollArea className="h-[60vh]">
                                  {selectedStudent && (
                                    <div className="space-y-4">
                                      {/* Student Info */}
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <h3 className="font-semibold">Student Information</h3>
                                          <p>Name: {selectedStudent.studentInfo.name}</p>
                                          <p>Class: {selectedStudent.studentInfo.class}</p>
                                          <p>Department: {selectedStudent.studentInfo.department || "N/A"}</p>
                                          <p>Subject: {selectedStudent.studentInfo.subject}</p>
                                        </div>
                                        <div>
                                          <h3 className="font-semibold">Exam Performance</h3>
                                          <p>Score: {selectedStudent.score}%</p>
                                          <p>Correct: {selectedStudent.correctAnswers}/{selectedStudent.totalQuestions}</p>
                                          <p>Time: {formatTime(selectedStudent.timeTaken)}</p>
                                          <p>Date: {new Date(selectedStudent.timestamp).toLocaleString()}</p>
                                        </div>
                                      </div>

                                      {/* Behavior Analysis */}
                                      {selectedStudent.behaviorAnalysis && (
                                        <div>
                                          <h3 className="font-semibold">Behavior Analysis</h3>
                                          <div className="bg-gray-50 p-4 rounded-lg">
                                            <div className="grid grid-cols-2 gap-4 mb-4">
                                              <div>
                                                <p>Rating: <Badge className={getBehaviorColor(selectedStudent.behaviorAnalysis.rating)}>{selectedStudent.behaviorAnalysis.rating}</Badge></p>
                                                <p>Total Points: {selectedStudent.behaviorAnalysis.totalPoints}</p>
                                              </div>
                                              <div>
                                                <p>Violations: {selectedStudent.behaviorAnalysis.violationCount}</p>
                                                <p>Risk Level: <Badge variant={selectedStudent.behaviorAnalysis.riskLevel === 'high' ? 'destructive' : selectedStudent.behaviorAnalysis.riskLevel === 'medium' ? 'secondary' : 'default'}>{selectedStudent.behaviorAnalysis.riskLevel}</Badge></p>
                                              </div>
                                            </div>
                                            <p className="text-sm mb-2">{selectedStudent.behaviorAnalysis.summary}</p>
                                            <div>
                                              <h4 className="font-medium mb-2">Recommendations:</h4>
                                              <ul className="list-disc list-inside text-sm space-y-1">
                                                {selectedStudent.behaviorAnalysis.recommendations.map((rec, i) => (
                                                  <li key={i}>{rec}</li>
                                                ))}
                                              </ul>
                                            </div>
                                          </div>
                                        </div>
                                      )}

                                      {/* Action Log */}
                                      {selectedStudent.studentActions && selectedStudent.studentActions.length > 0 && (
                                        <div>
                                          <h3 className="font-semibold">Activity Log</h3>
                                          <div className="bg-gray-50 p-4 rounded-lg max-h-60 overflow-y-auto">
                                            <div className="space-y-2">
                                              {selectedStudent.studentActions.slice(-20).map((action, i) => (
                                                <div key={i} className="text-sm flex justify-between items-center">
                                                  <span>{action.details}</span>
                                                  <div className="flex items-center gap-2">
                                                    <Badge variant={action.severity === 'positive' ? 'default' : action.severity === 'severe' ? 'destructive' : 'secondary'}>
                                                      {action.severity}
                                                    </Badge>
                                                    <span className="text-xs text-gray-500">
                                                      {new Date(action.timestamp).toLocaleTimeString()}
                                                    </span>
                                                  </div>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </ScrollArea>
                              </DialogContent>
                            </Dialog>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredResults.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No exam results found matching your filters.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EnhancedDashboard;