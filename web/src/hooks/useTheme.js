
import { useState, useEffect } from 'react';

export const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('truth-theme');
    return saved || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('truth-theme', theme);
    document.documentElement.classList.toggle('light', theme === 'light');
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return { theme, toggleTheme };
};
