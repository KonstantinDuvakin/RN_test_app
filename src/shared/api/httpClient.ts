import axios from 'axios';
import { authStorage } from '../storage/authStorage';

export const http = axios.create({ baseURL: 'https://api.example.com' });

// ── REQUEST: подставляем access-токен в каждый запрос ──
http.interceptors.request.use(config => {
  const token = authStorage.getAccess();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── single-flight: один общий промис рефреша на все параллельные 401 ──
let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const refresh = authStorage.getRefresh();
  if (!refresh) throw new Error('no refresh token');
  // ГОЛЫЙ axios, НЕ http — иначе интерсептор словит свой же 401 → рекурсия
  const { data } = await axios.post('https://api.example.com/auth/refresh', {
    refresh,
  });
  authStorage.setTokens(data.accessToken, data.refreshToken); // ротация refresh тоже
  return data.accessToken;
}

// ── RESPONSE: ловим 401 → рефреш → повтор ──
http.interceptors.response.use(
  res => res,
  async error => {
    const original = error.config;

    // не 401, или уже повторяли этот запрос → просто пробрасываем ошибку
    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }
    original._retry = true; // ← метка от бесконечного цикла

    try {
      // если рефреш уже летит от другого запроса — ждём ТОТ ЖЕ промис
      refreshPromise = refreshPromise ?? refreshAccessToken();
      const newToken = await refreshPromise;
      refreshPromise = null;

      original.headers.Authorization = `Bearer ${newToken}`;
      return http(original); // повторяем упавший запрос с новым токеном
    } catch (e) {
      refreshPromise = null;
      authStorage.clear();
      return Promise.reject(e);
    }
  },
);
