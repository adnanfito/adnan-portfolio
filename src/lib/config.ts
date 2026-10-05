export const site = {
	name: 'Adnan Fito Dharmawan',
	handle: 'adnan',
	title: 'Adnan Fito Dharmawan — Software Engineer',
	role: 'Software Engineer — Backend & Applied AI',
	location: 'Bekasi, Indonesia',
	description:
		"Hi, I'm Adnan — a software engineer from Indonesia specializing in backend development (NestJS, Go) and applied AI (Python). I build scalable services, AI-driven data pipelines and lead small engineering teams.",
	bio: 'Informatics graduate (GPA 3.73) from Universitas Jenderal Soedirman. I design and ship scalable backends with Go and NestJS, build AI workflows with RAG & LLMs, and lead small teams from SRS to delivery.',
	keywords: [
		'Adnan Fito Dharmawan',
		'Software Engineer',
		'Backend Engineer',
		'AI Engineer',
		'Indonesia',
		'Go',
		'NestJS',
		'PostgreSQL',
		'RAG',
		'LLM',
		'SvelteKit',
		'Portfolio'
	],
	cv: '/adnan_resume.pdf',
	available: true
} as const;

export const skills = [
	'go',
	'nestjs',
	'typescript',
	'python',
	'laravel',
	'postgresql',
	'prisma',
	'docker',
	'rabbitmq',
	'supabase',
	'sveltekit',
	'rag-llm'
] as const;

export type Experience = {
	role: string;
	company: string;
	period: string;
	current?: boolean;
	highlights: string[];
	tags: string[];
};

export const experiences: Experience[] = [
	{
		role: 'Technical Project Manager & AI Engineer',
		company: 'Daylight',
		period: 'Jun 2026 — now',
		current: true,
		highlights: [
			'Wrote the SRS and designed the architecture (SvelteKit + containerized Go) for a DNA testing platform',
			'Led a 5-person engineering team through Scrum sprints, from backlog to delivery',
			'Designed an async AI workflow with RabbitMQ and Google Gemini behind an adapter layer'
		],
		tags: ['go', 'sveltekit', 'postgresql', 'rabbitmq', 'gemini']
	},
	{
		role: 'IT & CLM Staff',
		company: 'POP TB Indonesia',
		period: 'Jun 2026 — now',
		current: true,
		highlights: [
			'Ran QA for laportbc.id — 5 critical bugs fixed, 99.9% uptime',
			'Built Looker Studio / Power BI dashboards from 500+ patient records for MoH & donors'
		],
		tags: ['qa', 'looker-studio', 'power-bi']
	},
	{
		role: 'Backend Engineer',
		company: 'Daylight',
		period: 'Feb — Jun 2026',
		highlights: [
			'Migrated Foldin from a NestJS monolith to Go (Echo) microservices',
			'Shipped event registration & waitlist modules — ~30% faster deploy cycles'
		],
		tags: ['go', 'echo', 'prisma', 'docker']
	},
	{
		role: 'Web Developer (Freelance)',
		company: 'projects.co.id',
		period: 'Feb 2025 — Feb 2026',
		highlights: [
			'Backend API + Xendit payment gateway for TokuDigital.com',
			'Mobile backend with NestJS & Supabase: 3-tier RBAC and FCM push notifications',
			'Health-data backend for a blood sugar monitoring app (NestJS + Drizzle)'
		],
		tags: ['nestjs', 'supabase', 'xendit', 'drizzle', 'php']
	},
	{
		role: 'IT Development Intern',
		company: 'POP TB Indonesia',
		period: 'Sep 2024 — Jan 2025',
		highlights: ['Weekly bug-tracking reports and QA for the LaporTBC web & mobile apps'],
		tags: ['qa', 'wordpress']
	},
	{
		role: 'Web Developer Intern',
		company: 'B-Universe',
		period: 'Jul — Aug 2024',
		highlights: ['Built an AI chatbot and automated data retrieval for an asset system'],
		tags: ['flowise', 'ai']
	}
];

export const education = {
	school: 'Universitas Jenderal Soedirman',
	degree: 'Bachelor of Informatics',
	period: '2022 — 2026',
	gpa: '3.73 / 4.00',
	notes: [
		'Thesis "Sapa": multi-agent RAG counseling chatbot on Telegram — BERTScore 85',
		'Chairman of Informatics Class of 2022 and of Soedirman Technophoria (55 volunteers)'
	]
} as const;

export const achievements = [
	{
		year: '2024',
		title: 'Best Graduate — Machine Learning Engineer',
		org: 'Dicoding × DBS Foundation'
	},
	{ year: '2023', title: 'National Finalist', org: 'PINGFEST' }
] as const;

export const socials = [
	{
		label: 'email',
		value: 'adnanfitocareer@gmail.com',
		href: 'mailto:adnanfitocareer@gmail.com'
	},
	{ label: 'github', value: 'github.com/adnanfito', href: 'https://github.com/adnanfito' },
	{
		label: 'linkedin',
		value: 'in/adnan-fito-dharmawan',
		href: 'https://linkedin.com/in/adnan-fito-dharmawan-2bb62a23a'
	},
	{ label: 'resume', value: 'adnan_resume.pdf', href: '/adnan_resume.pdf' }
] as const;

export const navLinks = [
	{ label: 'home', href: '#home' },
	{ label: 'projects', href: '#projects' },
	{ label: 'experience', href: '#experience' },
	{ label: 'contact', href: '#contact' }
] as const;
