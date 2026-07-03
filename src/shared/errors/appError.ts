export type ErrorKind = 'network' | 'server' | 'business' | 'unknown';

export interface AppError {
  kind: ErrorKind;
  message: string;
  canRetry: boolean;
  status?: number;
}

export function toAppError(e: any): AppError {
  // 1) сеть: запрос ушёл, но ответа нет (или axios-код сети)
  if (
    e?.code === 'ERR_NETWORK' ||
    e?.code === 'ECONNABORTED' ||
    (e?.request && !e?.response)
  ) {
    return {
      kind: 'network',
      message: 'Нет соединения. Проверьте интернет.',
      canRetry: true,
    };
  }

  // достаём статус и из axios (e.response.status), и из mockServer (e.status)
  const status: number | undefined = e?.response?.status ?? e?.status;
  const serverMsg: string | undefined =
    e?.response?.data?.message ?? e?.message;

  if (status && status >= 500) {
    return {
      kind: 'server',
      message: 'Сервер недоступен. Попробуйте позже.',
      canRetry: true,
      status,
    };
  }
  if (status && status >= 400) {
    return {
      kind: 'business',
      message: serverMsg ?? 'Некорректный запрос',
      canRetry: false,
      status,
    };
  }
  return {
    kind: 'unknown',
    message: serverMsg ?? 'Что-то пошло не так',
    canRetry: true,
  };
}
