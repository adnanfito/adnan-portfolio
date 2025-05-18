'use client';

import { motion } from 'framer-motion';

import { SectionHeading } from '@/components/section-heading';
import { Skills } from '@/components/skills';
import { useSectionInView } from '@/hooks/use-section-in-view';

export const About = () => {
  const { ref } = useSectionInView('About');

  return (
    <motion.section
      ref={ref}
      id="about"
      className="my-10 flex w-full scroll-mt-28 flex-col items-center md:mb-20"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.175 }}
    >
      <SectionHeading heading="About Me" />
      <div className="-mt-5 max-w-2xl text-center leading-7">
        <p className="mb-4">
          I&apos;m Adnan Fito Dharmawan, an undergraduate Informatics student at
          Universitas Jenderal Soedirman with a strong focus on Artificial
          Intelligence and Machine Learning, mainly using TensorFlow and Keras.
          I also work as a web developer, leaning more toward backend
          development. Throughout my journey, I&apos;ve worked with modern web
          technologies like Laravel, NestJS, Next.js, React, and Tailwind CSS. I
          enjoy solving complex problems, building reliable systems, and
          continuously learning to stay at the edge of technology.
        </p>
        <p>
          I&apos;m open to opportunities where I can grow, contribute, and
          collaborate with others. If you have a project or role that aligns
          with my skills and passion, feel free to get in touch.
        </p>
      </div>
      <Skills />
    </motion.section>
  );
};
