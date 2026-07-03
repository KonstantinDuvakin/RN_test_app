import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Task, tasksApi } from '../api/tasksApi';
import { toAppError } from '../../../shared/errors/appError.ts';

export function useTasksViewModel() {
  // загрузка списка
  const {
    data: tasks = [],
    isLoading,
    isRefetching,
    error,
    refetch,
  } = useQuery({
    queryKey: ['tasks'],
    queryFn: tasksApi.getTasks,
  });

  // переключение статуса
  const toggleMutation = useMutation<Task, unknown, string>({
    mutationKey: ['tasks', 'toggle'],
  });

  const deleteMutation = useMutation<{ id: string }, unknown, string>({
    mutationKey: ['tasks', 'delete'],
  });

  // презентационная логика — считаем прогресс
  const doneCount = tasks.filter(t => t.done).length;
  const progress = tasks.length
    ? Math.round((doneCount / tasks.length) * 100)
    : 0;

  return {
    tasks,
    isLoading,
    isRefetching,
    error: error ? toAppError(error) : null,
    progress,
    doneCount,
    total: tasks.length,
    refetch,
    toggle: toggleMutation.mutate,
    isToggling: toggleMutation.isPending,
    remove: deleteMutation.mutate,
  };
}
