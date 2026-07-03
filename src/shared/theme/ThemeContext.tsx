import { Theme, ThemeName, themes } from './themes.ts';
import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

interface ThemeContextValue {
  theme: Theme;
  themeName: ThemeName;
  setTheme: (name: ThemeName) => void;
  toggleTheme: () => void;
  availableThemes: ThemeName[];
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeName, setThemeName] = useState<ThemeName>('light');

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme: themes[themeName],
      themeName,
      setTheme: setThemeName,
      toggleTheme: () => setThemeName(p => (p === 'light' ? 'dark' : 'light')),
      availableThemes: Object.keys(themes) as ThemeName[], // динамически из реестра
    }),
    [themeName],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

// хук доступа к теме — компоненты используют только его
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx)
    throw new Error('useTheme должен использоваться внутри ThemeProvider');
  return ctx;
}
