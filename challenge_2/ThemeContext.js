import React, { createContext, useContext } from 'react';

export const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const lightColors = {
  primary: '#007AFF',
  secondary: '#5856D6',
  accent: '#FF9500',
  background: '#F2F2F7',
  cardBackground: '#FFFFFF',
  text: '#1C1C1E',
  lightText: '#8E8E93',
  separator: '#C6C6C8',
  white: '#FFFFFF',
  black: '#000000',
  switchThumb: '#FFFFFF',
  switchTrackFalse: '#E9E9EA',
  switchTrackTrue: '#007AFF',
  statusBar: 'dark',
};

export const darkColors = {
  primary: '#0B84FF',
  secondary: '#6E6CE1',
  accent: '#FF9F0A',
  background: '#000000',
  cardBackground: '#1C1C1E',
  text: '#FFFFFF',
  lightText: '#AEAEB2',
  separator: '#3A3A3C',
  white: '#FFFFFF',
  black: '#000000',
  switchThumb: '#FFFFFF',
  switchTrackFalse: '#3A3A3C',
  switchTrackTrue: '#0B84FF',
  statusBar: 'light',
}; 