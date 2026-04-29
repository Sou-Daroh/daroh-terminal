"use client";

import React, { useState, useEffect, useRef } from 'react';

// Date formatters using native Intl.DateTimeFormat
const mobileFormatter = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: '2-digit',
  year: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

const desktopFormatter = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: true,
});

const StatusBar = () => {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    setCurrentTime(new Date());

    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Debounced resize handler using requestAnimationFrame
    const resizeHandler = () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      rafIdRef.current = requestAnimationFrame(() => {
        checkMobile();
        rafIdRef.current = null;
      });
    };
    window.addEventListener('resize', resizeHandler);

    return () => {
      clearInterval(timer);
      window.removeEventListener('resize', resizeHandler);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  const formatTime = (date: Date) => {
    return isMobile ? mobileFormatter.format(date) : desktopFormatter.format(date);
  };

  return (
    <div className="w-full bg-black text-indigo-500 p-1 text-xs md:text-xs flex justify-between items-center fixed bottom-0 left-0 border-t-2 border-green-500 z-10">
      <div className="truncate flex-shrink-0">daroh@terminal:~$</div>
      <div className="text-right text-xs md:text-xs ml-2 flex-shrink-0">
        {currentTime ? formatTime(currentTime) : ''}
      </div>
    </div>
  );
};

export default StatusBar; 