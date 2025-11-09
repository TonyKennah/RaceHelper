import React, { createContext, ReactNode, useContext, useState } from 'react';

export const themes = {
  light: {
    background: '#f0f0f0',
    card: '#fff',
    text: '#000',
    subtleText: '#666',
    border: '#f5f5f5',
    headerFilter: '#e0e0e0',
    headerFilterActive: '#fff',
    headerFilterText: '#333',
    headerFilterTextActive: '#000',
  },
  dark: {
    background: '#121212',
    card: '#1e1e1e',
    text: '#e0e0e0',
    subtleText: '#999',
    border: '#2a2a2a',
    headerFilter: '#333',
    headerFilterActive: '#555',
    headerFilterText: '#ccc',
    headerFilterTextActive: '#fff',
  },
  green: {
    background: '#E8F5E9', // Light Green
    card: '#ffffffff',
    text: '#1B5E20', // Dark Green
    subtleText: '#4CAF50', // Medium Green
    border: '#C8E6C9',
    headerFilter: '#A5D6A7',
    headerFilterActive: '#4CAF50',
    headerFilterText: '#1B5E20',
    headerFilterTextActive: '#FFFFFF',
  },
  red: {
    background: '#FFEBEE', // Light Red
    card: '#FFFFFF',
    text: '#B71C1C', // Dark Red
    subtleText: '#F44336', // Medium Red
    border: '#FFCDD2',
    headerFilter: '#EF9A9A',
    headerFilterActive: '#E53935',
    headerFilterText: '#B71C1C',
    headerFilterTextActive: '#FFFFFF',
  },
  blue: {
    background: '#E3F2FD', // Light Blue
    card: '#FFFFFF',
    text: '#0D47A1', // Dark Blue
    subtleText: '#2196F3', // Medium Blue
    border: '#BBDEFB',
    headerFilter: '#90CAF9',
    headerFilterActive: '#1E88E5',
    headerFilterText: '#0D47A1',
    headerFilterTextActive: '#FFFFFF',
  },
};

export type ThemeName = keyof typeof themes;

const ThemeContext = createContext({
  theme: themes.light,
  themeName: 'light' as ThemeName,
  setTheme: (name: ThemeName) => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [themeName, setThemeName] = useState<ThemeName>('dark');

  const setTheme = (name: ThemeName) => {
    setThemeName(name);
  };

  const theme = themes[themeName];

  return (
    <ThemeContext.Provider value={{ theme, themeName, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};