// Sample questions for different subjects and classes
// In production, this would be loaded from a database

export interface Question {
  id: number;
  classLevel: string;
  department?: string;
  subject: string;
  questionText: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer';
  options?: string[];
  correctAnswer: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

// Mathematics questions for different classes
export const mathematicsQuestions: Question[] = [
  // JS1 Mathematics
  {
    id: 1,
    classLevel: 'JS1',
    subject: 'Mathematics',
    questionText: 'What is 15 + 27?',
    type: 'multiple_choice',
    options: ['40', '42', '44', '46'],
    correctAnswer: 'B',
    difficulty: 'easy'
  },
  {
    id: 2,
    classLevel: 'JS1',
    subject: 'Mathematics',
    questionText: 'If a triangle has angles of 60° and 70°, what is the third angle?',
    type: 'multiple_choice',
    options: ['40°', '50°', '60°', '70°'],
    correctAnswer: 'B',
    difficulty: 'medium'
  },

  // SS2 Mathematics (Science Department)
  {
    id: 3,
    classLevel: 'SS2',
    department: 'Science & Technical',
    subject: 'General Mathematics',
    questionText: 'Solve for x: 3x² - 12x + 9 = 0',
    type: 'multiple_choice',
    options: ['x = 1, 3', 'x = 2, 4', 'x = 1, 4', 'x = 3, 3'],
    correctAnswer: 'A',
    difficulty: 'hard'
  },
  {
    id: 4,
    classLevel: 'SS2',
    department: 'Science & Technical',
    subject: 'Further Mathematics',
    questionText: 'What is the derivative of f(x) = 3x³ + 2x² - 5x + 1?',
    type: 'multiple_choice',
    options: ['9x² + 4x - 5', '6x² + 4x - 5', '9x² + 2x - 5', '3x² + 4x - 5'],
    correctAnswer: 'A',
    difficulty: 'hard'
  }
];

// English Language questions
export const englishQuestions: Question[] = [
  {
    id: 5,
    classLevel: 'JS2',
    subject: 'English Language',
    questionText: 'Choose the correct form: "She _____ to school every day."',
    type: 'multiple_choice',
    options: ['go', 'goes', 'going', 'gone'],
    correctAnswer: 'B',
    difficulty: 'easy'
  },
  {
    id: 6,
    classLevel: 'SS1',
    department: 'Arts & Commercial',
    subject: 'English Language',
    questionText: 'What is the meaning of the idiom "break the ice"?',
    type: 'multiple_choice',
    options: ['To be very cold', 'To start a conversation', 'To break something', 'To win a game'],
    correctAnswer: 'B',
    difficulty: 'medium'
  }
];

// Science questions
export const scienceQuestions: Question[] = [
  {
    id: 7,
    classLevel: 'JS3',
    subject: 'Basic Science',
    questionText: 'What is the chemical symbol for water?',
    type: 'multiple_choice',
    options: ['H2O', 'CO2', 'NaCl', 'O2'],
    correctAnswer: 'A',
    difficulty: 'easy'
  },
  {
    id: 8,
    classLevel: 'SS3',
    department: 'Science & Technical',
    subject: 'Physics',
    questionText: 'What is the SI unit of force?',
    type: 'multiple_choice',
    options: ['Joule', 'Newton', 'Watt', 'Pascal'],
    correctAnswer: 'B',
    difficulty: 'easy'
  },
  {
    id: 9,
    classLevel: 'SS2',
    department: 'Science & Technical',
    subject: 'Chemistry',
    questionText: 'Which of the following is a noble gas?',
    type: 'multiple_choice',
    options: ['Oxygen', 'Nitrogen', 'Helium', 'Hydrogen'],
    correctAnswer: 'C',
    difficulty: 'medium'
  },
  {
    id: 10,
    classLevel: 'SS1',
    department: 'Science & Technical',
    subject: 'Biology',
    questionText: 'Photosynthesis occurs in which part of the plant cell?',
    type: 'multiple_choice',
    options: ['Nucleus', 'Mitochondria', 'Chloroplasts', 'Ribosomes'],
    correctAnswer: 'C',
    difficulty: 'medium'
  }
];

// Economics questions for Arts & Commercial
export const economicsQuestions: Question[] = [
  {
    id: 11,
    classLevel: 'SS1',
    department: 'Arts & Commercial',
    subject: 'Economics',
    questionText: 'What is the law of demand?',
    type: 'multiple_choice',
    options: [
      'Price and quantity demanded move in the same direction',
      'Price and quantity demanded move in opposite directions',
      'Price has no effect on quantity demanded',
      'Quantity demanded is always constant'
    ],
    correctAnswer: 'B',
    difficulty: 'medium'
  },
  {
    id: 12,
    classLevel: 'SS2',
    department: 'Arts & Commercial',
    subject: 'Economics',
    questionText: 'Which of the following is NOT a factor of production?',
    type: 'multiple_choice',
    options: ['Land', 'Labor', 'Capital', 'Money'],
    correctAnswer: 'D',
    difficulty: 'medium'
  }
];

// Combine all questions
export const allQuestions = [
  ...mathematicsQuestions,
  ...englishQuestions,
  ...scienceQuestions,
  ...economicsQuestions
];

// Function to get questions by criteria
export const getQuestionsByClass = (classLevel: string, department?: string, subject?: string): Question[] => {
  return allQuestions.filter(q => {
    if (q.classLevel !== classLevel) return false;
    if (department && q.department !== department) return false;
    if (subject && q.subject !== subject) return false;
    return true;
  });
};

// Function to get random questions for exam
export const getRandomQuestions = (classLevel: string, department: string | undefined, subject: string, count: number = 20): Question[] => {
  const filteredQuestions = getQuestionsByClass(classLevel, department, subject);
  
  if (filteredQuestions.length === 0) {
    // Fallback to a subset of our questions if no specific questions found
    return allQuestions.slice(0, count);
  }
  
  // Shuffle and return requested count
  const shuffled = [...filteredQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};