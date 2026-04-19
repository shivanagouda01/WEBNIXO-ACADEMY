import { Module, Testimonial, AppUser } from './types';

export const CURRICULUM: Module[] = [
  {
    id: 'm1',
    title: 'Python Fundamentals',
    lessonsCount: 12,
    duration: '4h 30m',
    description: 'Master the basics of Python syntax, variables, and data types.',
    topics: ['Installation & Setup', 'Variables & Data Types', 'Control Flow', 'Functions & Modules'],
    progress: 100,
    isLocked: false,
    lessons: [
      {
        id: 'l1',
        title: 'Introduction to Python',
        duration: '10m',
        status: 'completed',
        content: 'Python is a high-level, interpreted programming language known for its readability and versatility. It was created by Guido van Rossum and first released in 1991.',
        codeExample: 'print("Hello, Webnixo!")',
        quiz: [
          {
            question: 'Who created Python?',
            options: ['Guido van Rossum', 'Elon Musk', 'Bill Gates', 'Mark Zuckerberg'],
            correctIndex: 0
          }
        ],
        challenge: {
          instruction: 'Print your name using the print() function.',
          initialCode: '# Write your code here\n',
          expectedOutput: 'Shivanagouda'
        }
      },
      {
        id: 'l2',
        title: 'Variables and Data Types',
        duration: '15m',
        status: 'completed',
        content: 'Variables are used to store data. Python has several built-in data types including integers, floats, strings, and booleans.',
        codeExample: 'name = "Shivanagouda"\nage = 25\nis_instructor = True',
        quiz: [
          {
            question: 'Which of these is a string?',
            options: ['123', 'True', '"Hello"', '12.5'],
            correctIndex: 2
          }
        ],
        challenge: {
          instruction: 'Create a variable named "course" and assign it the value "Python".',
          initialCode: '',
          expectedOutput: ''
        }
      }
    ]
  },
  {
    id: 'm2',
    title: 'Advanced Data Structures',
    lessonsCount: 8,
    duration: '3h 15m',
    description: 'Deep dive into lists, dictionaries, sets, and tuples.',
    topics: ['List Comprehensions', 'Dictionary Methods', 'Set Operations', 'Memory Management'],
    progress: 45,
    isLocked: false,
    lessons: [
      {
        id: 'l3',
        title: 'Lists and Tuples',
        duration: '20m',
        status: 'pending',
        content: 'Lists are ordered, mutable collections. Tuples are ordered, immutable collections.',
        codeExample: 'my_list = [1, 2, 3]\nmy_tuple = (1, 2, 3)',
        quiz: [
          {
            question: 'Are tuples mutable?',
            options: ['Yes', 'No'],
            correctIndex: 1
          }
        ],
        challenge: {
          instruction: 'Create a list with three numbers.',
          initialCode: '',
          expectedOutput: ''
        }
      }
    ]
  },
  {
    id: 'm3',
    title: 'Object-Oriented Programming',
    lessonsCount: 10,
    duration: '5h 00m',
    description: 'Learn to build scalable applications using classes.',
    topics: ['Classes & Objects', 'Inheritance', 'Encapsulation', 'Design Patterns'],
    progress: 0,
    isLocked: true,
    lessons: []
  },
  {
    id: 'm4',
    title: 'Real-world Projects',
    lessonsCount: 15,
    duration: '8h 45m',
    description: 'Build a portfolio of projects.',
    topics: ['Web Scraping', 'Automation', 'API Development', 'Database Integration'],
    progress: 0,
    isLocked: true,
    lessons: []
  },
  {
    id: 'm5',
    title: 'AI & Machine Learning Basics',
    lessonsCount: 10,
    duration: '6h 20m',
    description: 'Introduction to data science libraries.',
    topics: ['NumPy & Pandas', 'Matplotlib', 'Scikit-Learn', 'Linear Regression'],
    progress: 0,
    isLocked: true,
    lessons: []
  }
];

export const COURSES = [
  {
    id: 'python',
    title: 'Python Mastery',
    description: 'Master Python from zero to advanced with real-world projects.',
    icon: '🐍',
    color: 'from-blue-500 to-cyan-500',
    students: '1.2k+',
    rating: 4.9,
    duration: '20+ Hours',
    lessons: '45+ Lessons',
    highlights: ['Live Projects', 'Certificate', 'Lifetime Access']
  },
  {
    id: 'c',
    title: 'C Programming',
    description: 'Build a strong foundation in programming with C.',
    icon: '💻',
    color: 'from-slate-500 to-slate-700',
    students: '800+',
    rating: 4.8,
    duration: '15+ Hours',
    lessons: '35+ Lessons',
    highlights: ['Base Logic', 'Memory Management', 'Certificate']
  },
  {
    id: 'cpp',
    title: 'C++ Advanced',
    description: 'Master OOP and data structures with C++.',
    icon: '🚀',
    color: 'from-blue-600 to-indigo-600',
    students: '950+',
    rating: 4.7,
    duration: '25+ Hours',
    lessons: '50+ Lessons',
    highlights: ['OOP mastery', 'Data Structures', 'Certificate']
  },
  {
    id: 'js',
    title: 'JavaScript Pro',
    description: 'Learn modern JS, ES6+, and asynchronous programming.',
    icon: '🟨',
    color: 'from-yellow-400 to-orange-500',
    students: '2.5k+',
    rating: 4.9,
    duration: '30+ Hours',
    lessons: '60+ Lessons',
    highlights: ['Modern ES6+', 'React Prep', 'Certificate']
  },
  {
    id: 'react',
    title: 'React Framework',
    description: 'Build modern, high-performance web applications.',
    icon: '⚛️',
    color: 'from-cyan-400 to-blue-500',
    students: '1.8k+',
    rating: 4.9,
    duration: '35+ Hours',
    lessons: '70+ Lessons',
    highlights: ['Hooks & Context', 'Redux Basics', 'Industry Projects']
  },
  {
    id: 'html-css',
    title: 'HTML & CSS',
    description: 'Design beautiful, responsive websites from scratch.',
    icon: '🎨',
    color: 'from-orange-500 to-red-500',
    students: '3k+',
    rating: 4.8,
    duration: '12+ Hours',
    lessons: '30+ Lessons',
    highlights: ['Flex & Grid', 'Responsive Design', 'Certificate']
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'Rahul Sharma',
    role: 'Software Engineer at Google',
    content: 'The courses at Webnixo are life-changing. Shivanagouda explains complex concepts with such ease.',
    avatar: 'https://picsum.photos/seed/rahul/100/100'
  },
  {
    id: 't2',
    name: 'Priya Patel',
    role: 'Data Scientist',
    content: 'I went from zero to building my own ML models in just 3 months. Highly recommended!',
    avatar: 'https://picsum.photos/seed/priya/100/100'
  },
  {
    id: 't3',
    name: 'Ankit Verma',
    role: 'Full Stack Developer',
    content: 'The certification from Webnixo helped me land my first job. The projects are very practical.',
    avatar: 'https://picsum.photos/seed/ankit/100/100'
  }
];

export const FOUNDER = {
  name: 'SHIVANAGOUDA PATIL',
  role: 'CEO & Lead Instructor',
  bio: 'Web Developer, AI & ML Enthusiast, and Passionate Educator. Shivanagouda has mentored thousands of students worldwide, helping them land dream jobs in tech.',
  skills: ['Python Expert', 'AI/ML Architect', 'Full Stack Developer', 'Tech Visionary'],
  image: 'https://picsum.photos/seed/founder/400/600'
};

export const INITIAL_USER: AppUser = {
  id: 'u1',
  name: 'Shivanagouda',
  email: 'spatil23012008@gmail.com',
  loginId: 'shiva2026',
  password: 'password123',
  progress: 65,
  xp: 1250,
  streak: 15,
  completedLessons: ['l1', 'l2'],
  enrolledCourses: ['python'],
  badges: [
    { id: 'b1', name: 'Beginner', icon: '🌱', unlocked: true },
    { id: 'b2', name: 'Fast Learner', icon: '⚡', unlocked: true },
    { id: 'b3', name: 'Pythonista', icon: '🐍', unlocked: true },
    { id: 'b4', name: 'Code Master', icon: '🏆', unlocked: false },
  ]
};
