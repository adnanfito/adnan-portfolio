'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const BackgroundShapes = () => {
  const ref = useRef(null);
  const { scrollY } = useScroll();

  // Scroll parallax efek
  const y1 = useTransform(scrollY, [0, 1000], [0, 80]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -60]);

  return (
    <div
      ref={ref}
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
    >
      {/* Circle */}
      <motion.div
        style={{ y: y1 }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.5, scale: 1 }}
        transition={{ duration: 2, ease: 'easeOut' }}
        className="
          absolute -top-40 left-[60%] 
          size-96
          rounded-full
          bg-gradient-to-tr
          from-pink-300 to-purple-300
          blur-2xl
          dark:from-pink-700 dark:to-purple-700
          dark:opacity-30
          opacity-70
        "
      />

      {/* Skewed rectangle */}
      <motion.div
        style={{ y: y2 }}
        initial={{ opacity: 0, rotate: 0 }}
        animate={{ opacity: 0.3, rotate: [0, 5, -5, 0] }}
        transition={{ duration: 5, ease: 'easeInOut' }}
        className="
          absolute -bottom-40 -left-40 
          h-120 w-60
          rotate-12 skew-y-12
          bg-gradient-to-b
          from-indigo-400 via-white/30 to-indigo-400
          blur-xl
          dark:from-indigo-700 dark:via-indigo-900/40 dark:to-indigo-700
          dark:opacity-20
          opacity-50
        "
      />

      {/* Gradient overlay */}
      <div
        className="
          absolute inset-0 -z-20
          bg-gradient-to-br
          from-[#fbe2e3]/40 via-transparent to-[#dbd7fb]/40
          dark:from-[#1a1a2e]/50 dark:via-[#0f3460]/40 dark:to-[#0f3460]/20
        "
      />
    </div>
  );
};
