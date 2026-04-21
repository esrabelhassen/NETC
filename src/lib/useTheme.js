import { useEffect } from 'react';

export default function useTheme() {
  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
  }, []);

  return { theme: 'dark', isDark: true };
}
