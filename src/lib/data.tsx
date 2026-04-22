import { Icons } from '@/components/icons';

export const links = [
  {
    name: 'Home',
    hash: '#home',
  },
  {
    name: 'About',
    hash: '#about',
  },
  {
    name: 'Experience',
    hash: '#experience',
  },
  {
    name: 'Projects',
    hash: '#projects',
  },
  {
    name: 'Contact',
    hash: '#contact',
  },
] as const;

export const projectsData = [
  {
    image: '/images/foldin.webp',
    title: 'Foldin',
    description:
      'Community platform featuring robust event registration and waitlist management modules[cite: 10]. The backend architecture was successfully migrated from NestJS to Go for enhanced performance and scalability.',
    technologies: ['Go', 'NestJS', 'Prisma', 'Docker'],
    links: {
      preview: '',
      github: 'https://foldin.space/',
      githubApi: 'https://api.github.com/repos/Skolaczk/SocialHub',
    },
  },
  {
    image: '/images/glucoheart.webp',
    title: 'GlucoHeart',
    description:
      'GlucoHeart is a digital health app designed to help users monitor, manage, and better understand Diabetes Mellitus (DM) and Hypertension.',
    technologies: ['NextJS', 'Flutter', 'NestJS', 'TypeScript'],
    links: {
      preview: 'https://socialhub-ms.vercel.app/',
      github: 'https://github.com/oriontechno/glucoheart',
      githubApi: 'https://api.github.com/repos/Skolaczk/SocialHub',
    },
  },
  {
    image: '/images/tokudigital.webp',
    title: 'TokuDigital',
    description: 'Top-up Game Platform using NextJs and NestJs API.',
    technologies: ['NestJS', 'NextJS', 'TypeScript', 'Xendit', 'Prisma'],
    links: {
      preview: 'https://socialhub-ms.vercel.app/',
      github: 'https://tokudigital.com/',
      githubApi: 'https://api.github.com/repos/Skolaczk/SocialHub',
    },
  },
  {
    image: '/images/poptb.webp',
    title: 'POP TB Profile',
    description:
      'Company profile site made with WordPress and Elementor, easy to manage and fully responsive.',
    technologies: ['Next.js', 'TypeScript', ' Nest.js', 'Tailwind', 'Prisma'],
    links: {
      preview: 'https://socialhub-ms.vercel.app/',
      github: 'https://poptbindonesia.org',
      githubApi: 'https://api.github.com/repos/Skolaczk/SocialHub',
    },
  },
  {
    image: '/images/budigadai.webp',
    title: 'Budi Gadai Profile',
    description:
      'Company profile website built with Laravel, featuring responsive design and admin dashboard.',
    technologies: ['Laravel', 'PHP', 'Mysql'],
    links: {
      preview: 'https://next-starter-skolaczk.vercel.app',
      github: 'https://new.budigadai.com',
      githubApi: 'https://api.github.com/repos/Skolaczk/next-starter',
    },
  },
  {
    image: '/images/silat.webp',
    title: 'SILAT',
    description:
      'Faculty service system built with native PHP, jQuery, and SweetAlert to manage student administrative processes like internships and more.',
    technologies: ['PHP', 'Bootstrap', 'Jquery', 'SweetAlert2'],
    links: {
      preview: 'https://next-starter-skolaczk.vercel.app',
      github: 'https://github.com/adnanfito/silat',
      githubApi: 'https://api.github.com/repos/Skolaczk/next-starter',
    },
  },
  {
    image: '/images/plantify.webp',
    title: 'Plantify',
    description:
      'E-commerce website design for plant sales, built with Tailwind CSS and JavaScript for a clean UI.',
    technologies: ['Tailwind', 'JavaScript', 'PHP'],
    links: {
      preview: 'https://socialhub-ms.vercel.app/',
      github: 'https://github.com/adnanfito/plantify.io',
      githubApi: 'https://api.github.com/repos/Skolaczk/SocialHub',
    },
  },
] as const;

export const experiencesData = [
  {
    title: 'Backend Engineer (Freelance)',
    company: 'Daylight Remote',
    description:
      'Engineered a scalable backend architecture for the "Foldin" web, successfully executing a system migration from NestJS to Go to enhance backend performance and scalability. Deployed robust event registration and waitlist management modules utilizing Prisma and Docker. Optimized database schema migrations and containerized the application environment, accelerating deployment cycles by ~30% and ensuring high availability for over 10000+ anticipated waitlist users.',
    period: 'Feb 2026 - Present',
    technologies: ['Go', 'NestJS', 'Prisma', 'Docker'],
  },
  {
    title: 'Web Developer (Freelance)',
    company: 'Self-Employed (via projects.co.id) Remote',
    description:
      "Engineered a high-performance backend API for Tokudigital.com using NestJS and successfully integrated third-party payment gateways (Xendit). Architected a secure mobile backend using NestJS and Supabase, implementing a strict 3-tier Role-Based Access Control (RBAC) and integrating Firebase Cloud Messaging (FCM). Built scalable backends for a Blood Sugar Monitoring application and a Student Asset Lending System utilizing NestJS, Drizzle ORM, and Laravel 11. Streamlined academic workflows by building 'SILAT' (Internship Administration System) using PHP.",
    period: 'Feb 2025 - Present',
    technologies: [
      'NestJS',
      'Xendit',
      'Supabase',
      'Firebase',
      'Drizzle ORM',
      'Laravel 11',
      'PHP',
    ],
  },
  {
    title: 'Robotics Extracurricular Instructor',
    company: 'Al-Irsyad Al-Islamiyyah Purwokerto',
    description:
      'Mentored and facilitated a class of 30 students in robotics fundamentals, cultivating problem-solving skills and foundational programming knowledge through structured weekly sessions.',
    period: 'Mar 2025 - Dec 2025',
    technologies: ['Robotics', 'Programming'],
  },
  {
    title: 'IT Development Intern',
    company: 'POP TB Indonesia (Bakrie Center Foundation) - West Jakarta',
    description:
      "Revamped the corporate profile website utilizing WordPress to significantly enhance the organization's digital presence and user interface. Executed comprehensive Quality Assurance (QA) testing over a 4-month period for the laportbc.id web portal and LaporTBC mobile application. Delivered weekly QA and bug-tracking reports, providing actionable insights to ensure continuous application stability.",
    period: 'Sep 2024 - Jan 2025',
    technologies: ['WordPress', 'QA Testing'],
  },
  {
    title: 'Data Entry and Web Developer Intern',
    company: 'B-Universe Tangerang',
    description:
      'Managed and audited an inventory database of over 3,000 enterprise assets distributed across two warehouse facilities. Engineered an AI-powered chatbot within the Asset Management System utilizing Flowise AI, significantly streamlining data retrieval and search capabilities for operational efficiency.',
    period: 'Jul 2024 - Aug 2024',
    technologies: ['Flowise AI', 'Database Management'],
  },
  {
    title: 'Assistant Laboratory Coordinator & Teaching Assistant',
    company: 'Jendral Soedirman University Purbalingga',
    description:
      'Secured the teaching role from a highly competitive top 5% applicant pool, progressing to Laboratory Coordinator to direct operations and lead 5 teaching assistants. Instructed and mentored over 190+ students across multiple semesters in core IT subjects, including Computer Networks, Data Structures, and Algorithms. Authored 4 comprehensive practicum modules via Notion and formulated secure assessments via Safe Exam Browser.',
    period: 'Aug 2023 - Jun 2025',
    technologies: ['Cisco Packet Tracer', 'C++', 'Notion', 'Safe Exam Browser'],
  },
] as const;

export const skillsData = [
  { icon: <Icons.html className="size-12" /> },
  { icon: <Icons.css className="size-12" /> },
  // { icon: <Icons.sass className="size-12" /> },
  { icon: <Icons.tailwind className="size-12" /> },
  { icon: <Icons.javascript className="size-12" /> },
  { icon: <Icons.typescript className="size-12" /> },
  { icon: <Icons.react className="size-12" /> },
  // { icon: <Icons.redux className="size-12" /> },
  // { icon: <Icons.nextjs className="size-12" /> },
  { icon: <Icons.nestjs className="size-12" /> },
  { icon: <Icons.prisma className="size-12" /> },
  { icon: <Icons.docker className="size-12" /> },

  { icon: <Icons.laravel className="size-12" /> },
  { icon: <Icons.tensorflow className="size-12" /> },
  { icon: <Icons.keras className="size-12" /> },
  { icon: <Icons.python className="size-12" /> },
] as const;
