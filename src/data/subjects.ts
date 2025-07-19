// Subject definitions for different classes and departments

export const JS_SUBJECTS = [
  'Mathematics',
  'English Language',
  'English Studies', 
  'Literature in English',
  'Basic Science',
  'Social Studies',
  'Christian Religious Studies',
  'Islamic Religious Studies',
  'Basic Technology',
  'Computer Studies',
  'French Language',
  'Agricultural Science',
  'Civic Education',
  'Physical and Health Education',
  'Fine Arts',
  'Creative Arts',
  'Music',
  'Business Studies',
  'Book-Keeping & Accounts',
  'Home Economics',
  'History'
];

export const SCIENCE_TECHNICAL_SUBJECTS = [
  'English Language',
  'General Mathematics',
  'Further Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Agricultural Science',
  'Technical Drawing',
  'Computer Science',
  'Civic Education',
  'Economics',
  'ICT',
  'Marketing',
  'Data Processing'
];

export const ARTS_COMMERCIAL_SUBJECTS = [
  'English Language',
  'General Mathematics',
  'Economics',
  'Literature-in-English',
  'Government',
  'History',
  'Christian Religious Studies',
  'Islamic Religious Studies',
  'Commerce',
  'Financial Accounting'
];

export const CLASS_LEVELS = [
  'JS1', 'JS2', 'JS3', 'SS1', 'SS2', 'SS3'
];

export const DEPARTMENTS = [
  'Science & Technical',
  'Arts & Commercial'
];

export const getSubjectsForClass = (classLevel: string, department?: string): string[] => {
  if (classLevel.startsWith('JS')) {
    return JS_SUBJECTS;
  } else if (classLevel.startsWith('SS')) {
    if (department === 'Science & Technical') {
      return SCIENCE_TECHNICAL_SUBJECTS;
    } else if (department === 'Arts & Commercial') {
      return ARTS_COMMERCIAL_SUBJECTS;
    }
  }
  return [];
};

export const requiresDepartment = (classLevel: string): boolean => {
  return classLevel.startsWith('SS');
};