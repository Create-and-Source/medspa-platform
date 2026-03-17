import { createContext, useContext, useState, useEffect } from 'react';

const THEME_KEY = 'ms_theme';

export const PRESETS = [
  { id: 'default', name: 'Monochrome', accent: '#111111', accentLight: '#F5F5F5', accentText: '#FFFFFF' },
  { id: 'gold', name: 'Gold', accent: '#B8960C', accentLight: '#FBF7EC', accentText: '#FFFFFF' },
  { id: 'rose', name: 'Rose', accent: '#BE185D', accentLight: '#FDF2F8', accentText: '#FFFFFF' },
  { id: 'ocean', name: 'Ocean', accent: '#0369A1', accentLight: '#F0F9FF', accentText: '#FFFFFF' },
  { id: 'sage', name: 'Sage', accent: '#4D7C56', accentLight: '#F0FDF4', accentText: '#FFFFFF' },
  { id: 'plum', name: 'Plum', accent: '#7C3AED', accentLight: '#F5F3FF', accentText: '#FFFFFF' },
  { id: 'coral', name: 'Coral', accent: '#DC6843', accentLight: '#FFF7ED', accentText: '#FFFFFF' },
  { id: 'slate', name: 'Slate', accent: '#475569', accentLight: '#F8FAFC', accentText: '#FFFFFF' },
];

function loadTheme() {
  try {
    const saved = JSON.parse(localStorage.getItem(THEME_KEY));
    if (saved) return saved;
  } catch {}
  return PRESETS[0];
}

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(loadTheme);

  const setTheme = (t) => {
    setThemeState(t);
    localStorage.setItem(THEME_KEY, JSON.stringify(t));
  };

  const setCustomColor = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    setTheme({
      id: 'custom',
      name: 'Custom',
      accent: hex,
      accentLight: `rgba(${r},${g},${b},0.06)`,
      accentText: (r * 0.299 + g * 0.587 + b * 0.114) > 186 ? '#111111' : '#FFFFFF',
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, setCustomColor, PRESETS }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

// Shared style helpers that use current theme
export function useStyles() {
  const { theme } = useTheme();
  const A = theme.accent;
  const AL = theme.accentLight;
  const AT = theme.accentText;

  return {
    accent: A,
    accentLight: AL,
    accentText: AT,
    // Typography
    FONT: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    MONO: "'JetBrains Mono', 'SF Mono', monospace",
    // Colors
    bg: '#FAFAFA',
    card: '#FFFFFF',
    border: '#E5E5E5',
    borderLight: '#F0F0F0',
    text: '#111111',
    text2: '#666666',
    text3: '#999999',
    success: '#16A34A',
    warning: '#D97706',
    danger: '#DC2626',
    // Shadows
    shadow: '0 1px 3px rgba(0,0,0,0.06)',
    shadowMd: '0 4px 12px rgba(0,0,0,0.08)',
    shadowLg: '0 8px 24px rgba(0,0,0,0.12)',
    // Common styles
    pill: {
      padding: '8px 18px', borderRadius: 100, border: 'none', cursor: 'pointer',
      font: "500 13px 'Inter', sans-serif", transition: 'all 0.15s',
    },
    pillAccent: {
      padding: '8px 18px', borderRadius: 100, border: 'none', cursor: 'pointer',
      font: "500 13px 'Inter', sans-serif", transition: 'all 0.15s',
      background: A, color: AT,
    },
    pillOutline: {
      padding: '8px 18px', borderRadius: 100, cursor: 'pointer',
      font: "500 13px 'Inter', sans-serif", transition: 'all 0.15s',
      background: 'transparent', color: A, border: `1.5px solid ${A}`,
    },
    pillGhost: {
      padding: '8px 18px', borderRadius: 100, cursor: 'pointer',
      font: "500 13px 'Inter', sans-serif", transition: 'all 0.15s',
      background: 'transparent', color: '#666', border: '1.5px solid #E5E5E5',
    },
    input: {
      width: '100%', padding: '12px 14px', background: '#FFFFFF',
      border: '1px solid #E5E5E5', borderRadius: 10,
      font: "400 14px 'Inter', sans-serif", color: '#111', outline: 'none',
      transition: 'border-color 0.2s', boxSizing: 'border-box',
    },
    label: {
      display: 'block', fontFamily: "'JetBrains Mono', monospace",
      fontSize: 11, textTransform: 'uppercase', letterSpacing: 1,
      color: '#999', marginBottom: 8,
    },
    cardStyle: {
      background: '#FFFFFF', border: '1px solid #E5E5E5',
      borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    },
    tableWrap: {
      background: '#FFFFFF', border: '1px solid #E5E5E5',
      borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    },
  };
}
