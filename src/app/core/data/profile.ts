export interface Project {
  slug: string;
  title: string;
  tagline: string;
  role: string;
  year: string;
  hue: number;
  liveUrl: string;     // TODO: replace mock links with real deployments
  githubUrl: string;   // TODO: point to your real repos
  overview: string[];
  stack: string[];
  features: string[];
  images: string[];    // mock imagery — swap with real screenshots
  videos: string[];    // mock videos — swap with real screen recordings
  stats: { value: number; suffix: string; label: string }[];
}

export interface Profile {
  name: string;
  firstName: string;
  role: string;
  location: string;
  email: string;
  phone: string;
  links: { label: string; url: string }[];
  availability: string;
}

export const PROFILE: Profile = {
  name: 'Mohd Abuzar Khan',
  firstName: 'Abuzar',
  role: 'Java Full Stack Developer & AI Product Builder',
  location: 'Bhopal, India',
  email: 'abbuzar982@gmail.com',
  phone: '+91 95222 48314',
  availability: 'Open to opportunities — 2026',
  links: [
    { label: 'GitHub', url: 'https://github.com/abuzarkhan' },        // TODO: your real handle
    { label: 'LinkedIn', url: 'https://linkedin.com/in/abuzarkhan' }, // TODO: your real handle
    { label: 'Email', url: 'mailto:abbuzar982@gmail.com' },
  ],
};

const pics = (seed: string, n: number, w = 1200, h = 800) =>
  Array.from({ length: n }, (_, i) => `https://picsum.photos/seed/${seed}${i + 1}/${w}/${h}`);

export const PROJECTS: Project[] = [
  {
    slug: 'resumade',
    title: 'Resumade',
    tagline: 'AI-integrated resume builder on a Spring Boot microservices core.',
    role: 'Architect & Full-Stack Developer',
    year: '2025 — 2026',
    hue: 4,
    liveUrl: 'https://resumade-demo.vercel.app',      // MOCK — replace
    githubUrl: 'https://github.com/abuzarkhan/resumade', // MOCK — replace
    overview: [
      'Resumade started as a single-service experiment and grew into a nine-service platform: auth, resume, template, AI, export, notification, job-match, an API gateway, and Eureka for service discovery.',
      'The hardest problems were the invisible ones — JWT failures across services, LazyInitializationException leaking through API boundaries, and gateway routing loops. Each bug got a documented root-cause note, which became the team’s debugging playbook.',
      'Google Gemini powers content suggestions and job-market matching, while Redis and RabbitMQ handle async processing and rate limiting so the AI features stay fast under load.',
    ],
    stack: ['Java', 'Spring Boot', 'Microservices', 'Angular', 'MySQL', 'Redis', 'RabbitMQ', 'Google Gemini', 'AWS EC2', 'Jenkins'],
    features: [
      '9 Spring Boot microservices behind an API gateway with Eureka discovery',
      'Gemini-powered resume content suggestions & third-party job-market APIs',
      'Redis caching + RabbitMQ async queues for rate-limit handling',
      'JWT auth with cross-service security context propagation',
      'CI/CD pipeline on Jenkins deploying to AWS EC2',
    ],
    images: pics('resumade', 4),
    videos: ['https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'],
    stats: [
      { value: 9, suffix: '', label: 'Microservices' },
      { value: 500, suffix: '+', label: 'Resumes generated (mock)' },
      { value: 40, suffix: '%', label: 'Faster AI responses via cache' },
    ],
  },
  {
    slug: 'oasis',
    title: 'Oasis',
    tagline: 'Multi-agent essay writing & evaluation platform.',
    role: 'Full-Stack Developer',
    year: '2025',
    hue: 265,
    liveUrl: 'https://oasis-demo.vercel.app',           // MOCK — replace
    githubUrl: 'https://github.com/abuzarkhan/oasis',   // MOCK — replace
    overview: [
      'Oasis replaces single-pass AI grading with a staged pipeline: one Gemini agent assesses grammar and structure, another scores argument coherence, and a final aggregation step merges them into one score with section-specific feedback.',
      'Built full-stack with Next.js, Firebase Auth and Firestore — the whole evaluation pipeline runs server-side and streams results back to the editor in real time.',
      'The staged design materially improved consistency over one-shot prompting, and gives users feedback they can actually act on, paragraph by paragraph.',
    ],
    stack: ['Next.js', 'Firebase Auth', 'Firestore', 'Google Gemini API', 'TypeScript'],
    features: [
      'Multi-agent evaluation: grammar/structure + coherence + aggregation',
      'Section-specific, actionable feedback instead of one opaque score',
      'Real-time streaming results into the writing editor',
      'Auth & persistence via Firebase',
    ],
    images: pics('oasis', 4),
    videos: ['https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'],
    stats: [
      { value: 3, suffix: '', label: 'AI agents in the pipeline' },
      { value: 2, suffix: '×', label: 'Consistency vs single-pass grading' },
      { value: 60, suffix: '%', label: 'Faster feedback loop (mock)' },
    ],
  },
  {
    slug: 'room-rental',
    title: 'Room Rental App',
    tagline: 'Rental marketplace — Spring Boot APIs with an Angular client.',
    role: 'Full-Stack Developer @ Capgemini',
    year: '2026',
    hue: 150,
    liveUrl: 'https://roomrental-demo.vercel.app',          // MOCK — replace
    githubUrl: 'https://github.com/abuzarkhan/room-rental', // MOCK — replace
    overview: [
      'A Capgemini engagement: REST APIs in Spring Boot consumed by an Angular frontend, covering listings, search, bookings and landlord messaging.',
      'Focused on clean API contracts, eager-loading fixes for N+1 query problems, and a component architecture in Angular that the team could extend without friction.',
    ],
    stack: ['Java', 'Spring Boot', 'Angular', 'TypeScript', 'MySQL', 'REST'],
    features: [
      'Listing search with filters & map-ready geo fields',
      'Booking flow with state machine–style status handling',
      'Reusable Angular component library for the team',
    ],
    images: pics('room', 3),
    videos: [],
    stats: [
      { value: 12, suffix: '+', label: 'REST endpoints' },
      { value: 3, suffix: '', label: 'User roles' },
    ],
  },
  {
    slug: 'gesture-recognition',
    title: 'Gesture Recognition',
    tagline: 'OpenCV-based open-source contributions via GSoC & GDG.',
    role: 'Open-Source Contributor',
    year: '2024 — 2025',
    hue: 200,
    liveUrl: 'https://github.com/abuzarkhan',   // MOCK — replace
    githubUrl: 'https://github.com/abuzarkhan', // MOCK — replace
    overview: [
      'Merged pull requests through Google Summer of Code and GDG VIT Bhopal, including an OpenCV-based gesture-recognition project — real-time hand tracking mapped to system controls.',
      'The work that mattered most was learning to read other people’s code fast, write reviews that get accepted, and ship changes that don’t break downstream users.',
    ],
    stack: ['Python', 'OpenCV', 'NumPy', 'Git'],
    features: [
      'Real-time hand-landmark tracking with OpenCV',
      'Gesture → action mapping with configurable thresholds',
      'Merged contributions to open-source CV tooling',
    ],
    images: pics('gesture', 3),
    videos: ['https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'],
    stats: [
      { value: 500, suffix: '+', label: 'DSA problems solved' },
      { value: 4, suffix: '+', label: 'Merged OSS PRs' },
    ],
  },
  {
    slug: 'ai-resume-capgemini',
    title: 'AI Resume Builder',
    tagline: 'AI-integrated tooling shipped inside Capgemini.',
    role: 'Java Full Stack Developer @ Capgemini',
    year: '2026 — Present',
    hue: 330,
    liveUrl: 'https://github.com/abuzarkhan',   // MOCK — replace
    githubUrl: 'https://github.com/abuzarkhan', // MOCK — replace
    overview: [
      'One of my first shipped engagements at Capgemini: an AI-integrated resume builder, built with Spring Boot REST APIs on the back and Angular on the front.',
      'Ownership spans JWT-secured endpoints, Angular service layers, Gemini integration for content generation, and the debugging discipline of enterprise delivery.',
    ],
    stack: ['Java', 'Spring Boot', 'Angular', 'Spring Security', 'JWT', 'Google Gemini'],
    features: [
      'JWT-secured REST API layer',
      'Gemini content generation with prompt templates',
      'Angular modules with lazy-loaded feature routes',
    ],
    images: pics('capgemini', 3),
    videos: [],
    stats: [
      { value: 2, suffix: '', label: 'Products shipped' },
      { value: 100, suffix: '%', label: 'Code-reviewed merges' },
    ],
  },
];

export const STACK = [
  { name: 'Spring Boot', desc: 'Enterprise microservices, JPA & Security.', mark: 'Sb', fg: '#6db33f' },
  { name: 'Angular', desc: 'Where every frontend surface starts.', mark: 'Ng', fg: '#FF073B' },
  { name: 'TypeScript', desc: 'Strict typing for end-to-end safety.', mark: 'TS', fg: '#3178c6' },
  { name: 'Java 17/21', desc: 'Core language for high-throughput APIs.', mark: 'Jv', fg: '#f89820' },
  { name: 'OpenAI / LLMs', desc: 'Function calling, RAG & agent chains.', mark: 'AI', fg: '#10a37f' },
  { name: 'Redis', desc: 'Cache, rate limits, fast everything.', mark: 'Rd', fg: '#FF073B' },
  { name: 'AWS', desc: 'EC2, deployment, Jenkins pipelines.', mark: 'Aws', fg: '#f59e0b' },
];

export const EXPERIENCE = [
  { name: 'Capgemini', role: 'Software Engineer — Java Full Stack', period: '06/2026 — Present', desc: 'REST APIs with Spring Boot + Angular frontends. Shipped an AI-integrated Resume Builder and a Room Rental App.' },
  { name: 'Google Summer of Code', role: 'Open-Source Contributor', period: '2024 — 2025', desc: 'Merged PRs through GSoC & GDG VIT Bhopal, incl. an OpenCV gesture-recognition project.' },
  { name: 'Technocrats Institute of Technology & Science', role: 'B.Tech — Computer Science (AIML)', period: '2022 — 2026', desc: 'CGPA-focused CS foundation with an AIML specialization.' },
];

export const CERTS = ['Azure Fundamentals (AZ-900)', 'Japanese N5 (NAT certified)', 'Agentic AI Development (GH-600)'];

// Mock "photo of me" gallery — swap the pravatar URLs for real photos of you.
export const GALLERY = [
  { url: 'https://i.pravatar.cc/600?img=13', depth: 1.2, caption: 'at the desk' },
  { url: 'https://i.pravatar.cc/600?img=59', depth: 0.7, caption: 'shipping season' },
  { url: 'https://i.pravatar.cc/600?img=32', depth: 1.5, caption: 'campus → office' },
  { url: 'https://i.pravatar.cc/600?img=45', depth: 0.9, caption: 'debugging face' },
  { url: 'https://i.pravatar.cc/600?img=8',  depth: 1.3, caption: 'open source days' },
  { url: 'https://i.pravatar.cc/600?img=26', depth: 0.6, caption: 'bhopal, home base' },
];
