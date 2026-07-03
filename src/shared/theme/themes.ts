export type ThemeName = 'light' | 'dark';

// набор семантических токенов — одинаковый для всех тем
export interface Theme {
  name: ThemeName;
  colors: {
    background: string; // фон экрана
    surface: string; // фон карточек/строк
    text: string; // основной текст
    textMuted: string; // второстепенный текст
    primary: string; // акцент (кнопки, чекбоксы)
    primaryText: string; // текст на акценте
    border: string; // разделители
    danger: string; // ошибки
  };
  spacing: (n: number) => number; // шкала отступов
  radius: number;
}

const spacing = (n: number) => n * 4; // 1 → 4px, 2 → 8px, 4 → 16px

export const lightTheme: Theme = {
  name: 'light',
  colors: {
    background: '#FFFFFF',
    surface: '#F7F8FA',
    text: '#1A1A1A',
    textMuted: '#999999',
    primary: '#2E5C8A',
    primaryText: '#FFFFFF',
    border: '#E5E7EB',
    danger: '#D33333',
  },
  spacing,
  radius: 10,
};

export const darkTheme: Theme = {
  name: 'dark',
  colors: {
    background: '#121417',
    surface: '#1E2227',
    text: '#ECEDEE',
    textMuted: '#8B8F94',
    primary: '#5B9BD5',
    primaryText: '#0B0D0F',
    border: '#2A2E33',
    danger: '#FF6B6B',
  },
  spacing,
  radius: 10,
};

// реестр тем — ВОТ СЮДА добавляется будущая тема
export const themes: Record<ThemeName, Theme> = {
  light: lightTheme,
  dark: darkTheme,
};
