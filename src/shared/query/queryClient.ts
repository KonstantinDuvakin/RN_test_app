import { QueryClient } from '@tanstack/react-query';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { queryPersisterStorage } from './queryStorage';
import { toAppError } from '../errors/appError.ts';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30, // 30с данные "свежие" → после гидрации сеть не дёргаем
      gcTime: 1000 * 60 * 60 * 24, // 24ч. ВАЖНО: gcTime ДОЛЖЕН быть >= maxAge ниже,
      // иначе кэш выкинут из памяти раньше, чем сохраним
      retry: (count, error) => toAppError(error).canRetry && count < 2,
    },
  },
});

// Синхронный персистер — потому что MMKV синхронный. В этом весь смысл:
// кэш восстанавливается БЕЗ промиса, до первого рендера → нет мелькания пустого экрана.
export const persister = createAsyncStoragePersister({
  storage: queryPersisterStorage,
  throttleTime: 1000, // не писать на диск чаще раза в секунду (батчим частые апдейты кэша)
});
