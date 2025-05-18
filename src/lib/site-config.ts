import { env } from '@/env.mjs';

export const siteConfig = {
  title: 'Adnan | Portfolio',
  description:
    "Hello, I'm Adnan. I am Web developer from Indonesia. I enjoy building sites, apps and AI agent. My focus is building scalable and maintainable software.",
  keywords: [
    'Adnan Fito Dharmawan',
    'Web developer',
    'Indonesia',
    'React',
    'Next.js',
    'Web development',
    'Back-end',
    'AI',
    'Machine Learning',
    'JavaScript',
    'HTML',
    'CSS',
    'Portfolio',
    'Projects',
    'Website',
    'Web applications',
    'Developer',
    'Code',
    'Programming',
    'Tech enthusiast',
  ],
  url: env.SITE_URL || 'https://example.com',
  googleSiteVerificationId: env.GOOGLE_SITE_VERIFICATION_ID || '',
};
