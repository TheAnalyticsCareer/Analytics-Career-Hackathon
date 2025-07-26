import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Default to light mode unless user explicitly set dark
  // Always use light mode
  const [isDark] = useState(false);

  // Removed empty useEffect (was unnecessary)

  useEffect(() => {
    // Always remove dark mode and set light font color
    document.documentElement.classList.remove('dark');
    localStorage.setItem('datasprint_theme', 'light');
    document.documentElement.style.setProperty('--font-color', '#1e293b');
  }, []);

  // Disable theme toggle
  const toggleTheme = () => {
    // Do nothing, always light mode
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;