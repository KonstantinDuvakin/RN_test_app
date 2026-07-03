import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    // запускаем таймер на каждое изменение value
    const timer = setTimeout(() => setDebounced(value), delay);
    // если value изменилось до срабатывания — старый таймер отменяется
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
