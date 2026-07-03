import { useQuery } from '@tanstack/react-query';
import { tasksApi } from '../api/tasksApi';

export function useTaskDetailViewModel(taskId: string) {
  const {
    data: task,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['task', taskId], // ← ключ с параметром: отдельная ячейка кэша на каждую задачу
    queryFn: () => tasksApi.getTask(taskId),
  });

  return {
    task,
    isLoading,
    errorMessage: error ? 'Не удалось загрузить задачу' : null,
  };
}
