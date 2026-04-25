export interface Lesson {
  id: string;
  title: string;
  duration: string;
  content: string;
  codeExample: string;
  status: 'completed' | 'pending' | 'locked';
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
  }[];
  challenge: {
    instruction: string;
    initialCode: string;
    expectedOutput: string;
  };
}

export interface Module {
  id: string;
  title: string;
  lessonsCount: number;
  duration: string;
  description: string;
  topics: string[];
  progress: number;
  isLocked: boolean;
  lessons: Lesson[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar: string;
}

export interface CourseStats {
  students: number;
  rating: number;
  courses: number;
  projects: number;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  loginId: string;
  password?: string;
  certificateId?: string;
  university?: string;
  progress: number;
  xp: number;
  streak: number;
  completedLessons: string[];
  enrolledCourses: string[];
  badges: {
    id: string;
    name: string;
    icon: string;
    unlocked: boolean;
  }[];
}

export interface CourseCertificate {
  code: string;
  studentName: string;
  courseName: string;
  date: string;
}

export interface CourseSetting {
  course_id: string;
  price: number;
  is_live: boolean;
}
