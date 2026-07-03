import { createMMKV } from 'react-native-mmkv';

// Отдельный инстанс под кэш React Query — НЕ мешаем его с токеном (authStorage).
// Так: очистка кэша не трогает сессию, а logout/clear токена не стирает кэш списков.
const cacheStorage = createMMKV({ id: 'react-query-cache' });

// React Query persister ждёт интерфейс { getItem, setItem, removeItem }.
// MMKV v4 отдаёт getString/set/remove — оборачиваем под нужные имена.
export const queryPersisterStorage = {
  getItem: (key: string) => cacheStorage.getString(key) ?? null,
  setItem: (key: string, value: string) => cacheStorage.set(key, value),
  removeItem: (key: string) => {
    cacheStorage.remove(key);
  },
};
