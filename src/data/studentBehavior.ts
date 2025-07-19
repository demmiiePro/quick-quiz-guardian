// Student behavior tracking and rating system

export interface StudentAction {
  id: string;
  timestamp: number;
  type: ActionType;
  details: string;
  severity: SeverityLevel;
  points: number;
}

export enum ActionType {
  // Positive Actions
  FOCUSED_ANSWERING = 'focused_answering',
  QUICK_RESPONSE = 'quick_response',
  CONSISTENT_PACE = 'consistent_pace',
  NO_VIOLATIONS = 'no_violations',
  
  // Neutral Actions
  QUESTION_NAVIGATION = 'question_navigation',
  ANSWER_CHANGE = 'answer_change',
  TIME_WARNING_ACKNOWLEDGED = 'time_warning_acknowledged',
  
  // Suspicious Actions
  TAB_SWITCH = 'tab_switch',
  WINDOW_BLUR = 'window_blur',
  RIGHT_CLICK_ATTEMPT = 'right_click_attempt',
  COPY_ATTEMPT = 'copy_attempt',
  PASTE_ATTEMPT = 'paste_attempt',
  KEY_COMBINATION = 'key_combination',
  FULLSCREEN_EXIT = 'fullscreen_exit',
  
  // Severe Violations
  MULTIPLE_TAB_SWITCHES = 'multiple_tab_switches',
  EXTENDED_ABSENCE = 'extended_absence',
  DEVELOPER_TOOLS = 'developer_tools',
  SUSPICIOUS_PATTERN = 'suspicious_pattern'
}

export enum SeverityLevel {
  POSITIVE = 'positive',
  NEUTRAL = 'neutral',
  MINOR = 'minor',
  MODERATE = 'moderate',
  SEVERE = 'severe'
}

export enum BehaviorRating {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor',
  SUSPICIOUS = 'suspicious'
}

export interface BehaviorAnalysis {
  rating: BehaviorRating;
  totalPoints: number;
  violationCount: number;
  positiveActions: number;
  riskLevel: 'low' | 'medium' | 'high';
  summary: string;
  recommendations: string[];
}

// Action scoring system
export const ACTION_SCORES = {
  [ActionType.FOCUSED_ANSWERING]: 2,
  [ActionType.QUICK_RESPONSE]: 1,
  [ActionType.CONSISTENT_PACE]: 1,
  [ActionType.NO_VIOLATIONS]: 3,
  
  [ActionType.QUESTION_NAVIGATION]: 0,
  [ActionType.ANSWER_CHANGE]: 0,
  [ActionType.TIME_WARNING_ACKNOWLEDGED]: 0,
  
  [ActionType.TAB_SWITCH]: -2,
  [ActionType.WINDOW_BLUR]: -1,
  [ActionType.RIGHT_CLICK_ATTEMPT]: -1,
  [ActionType.COPY_ATTEMPT]: -3,
  [ActionType.PASTE_ATTEMPT]: -3,
  [ActionType.KEY_COMBINATION]: -2,
  [ActionType.FULLSCREEN_EXIT]: -2,
  
  [ActionType.MULTIPLE_TAB_SWITCHES]: -5,
  [ActionType.EXTENDED_ABSENCE]: -4,
  [ActionType.DEVELOPER_TOOLS]: -10,
  [ActionType.SUSPICIOUS_PATTERN]: -8
};

export const analyzeBehavior = (actions: StudentAction[]): BehaviorAnalysis => {
  const totalPoints = actions.reduce((sum, action) => sum + action.points, 0);
  const violationCount = actions.filter(a => a.severity === SeverityLevel.MODERATE || a.severity === SeverityLevel.SEVERE).length;
  const positiveActions = actions.filter(a => a.severity === SeverityLevel.POSITIVE).length;
  
  let rating: BehaviorRating;
  let riskLevel: 'low' | 'medium' | 'high';
  
  if (totalPoints >= 10 && violationCount === 0) {
    rating = BehaviorRating.EXCELLENT;
    riskLevel = 'low';
  } else if (totalPoints >= 5 && violationCount <= 1) {
    rating = BehaviorRating.GOOD;
    riskLevel = 'low';
  } else if (totalPoints >= 0 && violationCount <= 3) {
    rating = BehaviorRating.FAIR;
    riskLevel = 'medium';
  } else if (totalPoints >= -5 && violationCount <= 5) {
    rating = BehaviorRating.POOR;
    riskLevel = 'medium';
  } else {
    rating = BehaviorRating.SUSPICIOUS;
    riskLevel = 'high';
  }
  
  const summary = generateSummary(rating, totalPoints, violationCount);
  const recommendations = generateRecommendations(rating, actions);
  
  return {
    rating,
    totalPoints,
    violationCount,
    positiveActions,
    riskLevel,
    summary,
    recommendations
  };
};

const generateSummary = (rating: BehaviorRating, points: number, violations: number): string => {
  switch (rating) {
    case BehaviorRating.EXCELLENT:
      return `Outstanding exam behavior with ${points} positive points and no violations detected.`;
    case BehaviorRating.GOOD:
      return `Good exam conduct with ${points} points and minimal violations (${violations}).`;
    case BehaviorRating.FAIR:
      return `Average behavior with ${points} points and ${violations} minor violations.`;
    case BehaviorRating.POOR:
      return `Below average conduct with ${points} points and ${violations} violations requiring attention.`;
    case BehaviorRating.SUSPICIOUS:
      return `Highly suspicious behavior detected with ${points} points and ${violations} serious violations.`;
    default:
      return 'Behavior analysis unavailable.';
  }
};

const generateRecommendations = (rating: BehaviorRating, actions: StudentAction[]): string[] => {
  const recommendations: string[] = [];
  
  if (rating === BehaviorRating.EXCELLENT) {
    recommendations.push('Maintain current focus and exam discipline');
    recommendations.push('Consider this student as a model for exam conduct');
  } else if (rating === BehaviorRating.GOOD) {
    recommendations.push('Good overall performance with room for minor improvements');
    recommendations.push('Continue monitoring for consistency');
  } else if (rating === BehaviorRating.FAIR) {
    recommendations.push('Provide additional guidance on exam protocols');
    recommendations.push('Monitor more closely in future exams');
  } else if (rating === BehaviorRating.POOR) {
    recommendations.push('Require exam conduct counseling before next exam');
    recommendations.push('Implement stricter monitoring protocols');
    recommendations.push('Consider seating arrangement changes');
  } else if (rating === BehaviorRating.SUSPICIOUS) {
    recommendations.push('Immediate review of exam session required');
    recommendations.push('Consider exam invalidation if violations are severe');
    recommendations.push('Mandatory academic integrity meeting');
    recommendations.push('Enhanced supervision for future exams');
  }
  
  // Specific recommendations based on actions
  const tabSwitches = actions.filter(a => a.type === ActionType.TAB_SWITCH).length;
  if (tabSwitches > 3) {
    recommendations.push(`Excessive tab switching detected (${tabSwitches} times) - investigate potential cheating`);
  }
  
  const copyAttempts = actions.filter(a => a.type === ActionType.COPY_ATTEMPT || a.type === ActionType.PASTE_ATTEMPT).length;
  if (copyAttempts > 0) {
    recommendations.push('Copy/paste attempts detected - review exam content for potential academic dishonesty');
  }
  
  return recommendations;
};