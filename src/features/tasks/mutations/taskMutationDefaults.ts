import { queryClient } from '../../../shared/query/queryClient.ts';
import { Task, tasksApi } from '../api/tasksApi.ts';

export function registerTaskMutations() {
  queryClient.setMutationDefaults(['tasks', 'toggle'], {
    mutationFn: (id: string) => tasksApi.toggleTask(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previous = queryClient.getQueryData<Task[]>(['tasks']);
      queryClient.setQueryData<Task[]>(['tasks'], (old = []) =>
        old.map(t => (t.id === id ? { ...t, done: !t.done } : t)),
      );
      return { previous };
    },
    onError: (_e, _id, ctx: any) =>
      ctx?.previous && queryClient.setQueryData(['tasks'], ctx.previous),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });

  // ── delete (НОВЫЙ) ──
  queryClient.setMutationDefaults(['tasks', 'delete'], {
    mutationFn: (id: string) => tasksApi.deleteTask(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previous = queryClient.getQueryData<Task[]>(['tasks']);
      // оптимистично убираем задачу из списка
      queryClient.setQueryData<Task[]>(['tasks'], (old = []) =>
        old.filter(t => t.id !== id),
      );
      return { previous };
    },
    onError: (_e, _id, ctx: any) =>
      ctx?.previous && queryClient.setQueryData(['tasks'], ctx.previous),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });
}