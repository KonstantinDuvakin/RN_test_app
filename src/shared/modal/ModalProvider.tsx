import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  ReactNode,
} from 'react';
import { ConfirmOptions, Toast, ToastType } from './types';
import { ConfirmDialog } from './ConfirmDialog';
import { ToastStack } from './ToastStack';

interface ModalContextValue {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
  toast: (message: string, type?: ToastType) => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

export function ModalProvider({ children }: { children: ReactNode }) {
  // --- confirm ---
  const [confirmState, setConfirmState] = useState<ConfirmOptions | null>(null);
  // храним resolve текущего промиса, чтобы вызвать его при ответе пользователя
  const resolverRef = useRef<((value: boolean) => void) | null>(null);

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    setConfirmState(options);
    return new Promise<boolean>(resolve => {
      resolverRef.current = resolve; // запоминаем, чем "ответить"
    });
  }, []);

  const handleConfirmResult = useCallback((result: boolean) => {
    resolverRef.current?.(result); // резолвим промис → await вернёт true/false
    resolverRef.current = null;
    setConfirmState(null); // прячем диалог
  }, []);

  // --- toasts ---
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = 'info') => {
    const id = String(Date.now() + Math.random());
    setToasts(prev => [...prev, { id, type, message }]);
    // автоудаление через 2.5 сек
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 2500);
  }, []);

  return (
    <ModalContext.Provider value={{ confirm, toast }}>
      {children}
      {/* рендер оверлеев — поверх всего приложения */}
      <ConfirmDialog options={confirmState} onResult={handleConfirmResult} />
      <ToastStack toasts={toasts} />
    </ModalContext.Provider>
  );
}

export function useModal(): ModalContextValue {
  const ctx = useContext(ModalContext);
  if (!ctx)
    throw new Error('useModal должен использоваться внутри ModalProvider');
  return ctx;
}
