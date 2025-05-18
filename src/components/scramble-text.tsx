'use client';

import { useEffect, useState, useRef } from 'react';

const TITLES = ['Web Developer', 'AI Enthusiast', 'ML Engineer'];
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';

export const ScrambleText = () => {
  const [displayedText, setDisplayedText] = useState('');
  const [titleIndex, setTitleIndex] = useState(0);

  const charIndexRef = useRef(0); // posisi huruf yang sedang diketik
  const scrambleFrameRef = useRef(0); // frame scramble per huruf
  const isTypingRef = useRef(true); // true: mengetik, false: hapus
  const displayedTextRef = useRef('');
  const delayTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isTypingRef.current) {
        // MODE MENGETIK
        const targetText = TITLES[titleIndex];

        if (charIndexRef.current >= targetText.length) {
          // selesai mengetik, delay diam dulu 1.5 detik sebelum hapus
          if (!delayTimeoutRef.current) {
            delayTimeoutRef.current = setTimeout(() => {
              isTypingRef.current = false;
              delayTimeoutRef.current = null;
            }, 1500);
          }
          return;
        }

        if (scrambleFrameRef.current >= 8) {
          // fix huruf sekarang
          displayedTextRef.current += targetText[charIndexRef.current];
          setDisplayedText(displayedTextRef.current);
          charIndexRef.current += 1;
          scrambleFrameRef.current = 0;
        } else {
          // scramble huruf di posisi sekarang
          const scrambleChar = CHARS[Math.floor(Math.random() * CHARS.length)];
          const tempText = displayedTextRef.current + scrambleChar;
          setDisplayedText(tempText);
          scrambleFrameRef.current += 1;
        }
      } else {
        // MODE MENGHAPUS
        if (displayedTextRef.current.length === 0) {
          // sudah kosong, lanjut ke kata berikutnya
          setTitleIndex((prev) => (prev + 1) % TITLES.length);
          charIndexRef.current = 0;
          scrambleFrameRef.current = 0;
          isTypingRef.current = true;
          displayedTextRef.current = '';
          setDisplayedText('');
          return;
        }
        // hapus satu huruf dari belakang
        displayedTextRef.current = displayedTextRef.current.slice(0, -1);
        setDisplayedText(displayedTextRef.current);
      }
    }, 25);

    return () => {
      clearInterval(interval);
      if (delayTimeoutRef.current) clearTimeout(delayTimeoutRef.current);
    };
  }, [titleIndex]);

  return (
    <span className="font-mono text-3xl sm:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-rose-700 to-pink-600">
      {displayedText}
    </span>
  );
};
