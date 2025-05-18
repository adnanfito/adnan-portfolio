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
    image: '/images/budigadai.webp',
    title: 'Budi Gadai Profile',
    description:
      'Company profile website built with Laravel, featuring responsive design and admin dashboard.',
    technologies: ['Laravel', 'PHP', 'Mysql'],
    links: {
      preview: 'https://next-starter-skolaczk.vercel.app',
      github: 'https://github.com/oriontechno/budigadai',
      githubApi: 'https://api.github.com/repos/Skolaczk/next-starter',
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
    technologies: ['Tailwind', 'JavaScript', ' PHP'],
    links: {
      preview: 'https://socialhub-ms.vercel.app/',
      github: 'https://github.com/adnanfito/plantify',
      githubApi: 'https://api.github.com/repos/Skolaczk/SocialHub',
    },
  },
] as const;

export const experiencesData = [
  {
    title: 'Web Developer',
    company: 'Freelancing, remote',
    description:
      'As a freelancer, I worked on full-stack projects using Laravel and served as a back-end developer in NestJS-based applications. I was responsible for designing APIs, managing databases, and ensuring seamless integration with front-end systems, while maintaining code quality and meeting client requirements.',
    period: '2024 - present',
    technologies: ['Nest.js', 'TypeScript', 'Laravel', 'PHP'],
  },
  {
    title: 'Robotics Instructor',
    company: 'SD Al Irsyad Al Islamiyyah 1 Purwokerto',
    description:
      'I taught robotics to elementary school students (grades 3–6), introducing them to hardware components and guiding them through programming microcontrollers. The lessons were designed to build foundational knowledge in electronics and coding through hands-on learning.',
    period: '2025 - present',
    technologies: ['Arduino', 'C++', 'Microcontrollers'],
  },
  {
    title: 'Laboratory Assistant',
    company: 'Jenderal Soedirman University, Purbalingga',
    description:
      'During my time as a laboratory assistant for Programming Algorithms, Data Structures, and Computer Networks courses, I guided and mentored junior students through hands-on practical sessions. This role enhanced my technical expertise and strengthened my communication and leadership skills in an academic setting.',
    period: '2023 - present',
    technologies: ['C++', 'C'],
  },
  {
    title: 'Web Development Intern',
    company: 'Bakrie Center Foundation, West Jakarta',
    description:
      'During this internship, I focused on two key areas: creating Wordpress plugins and managing website content, plugins, and settings.',
    period: '2024',
    technologies: ['HTML', 'CSS', 'JavaScript', 'Wordpress'],
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
  { icon: <Icons.nextjs className="size-12" /> },
  { icon: <Icons.nestjs className="size-12" /> },
  { icon: <Icons.prisma className="size-12" /> },
  // { icon: <Icons.docker className="size-12" /> },
  // { icon: <Icons.laravel className="size-12" /> },
  { icon: <Icons.tensorflow className="size-12" /> },
  { icon: <Icons.keras className="size-12" /> },
  { icon: <Icons.python className="size-12" /> },
] as const;
