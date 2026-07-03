import { mockServer } from '../../../shared/mock/mockServer';

export type Task = { id: string; title: string; done: boolean };

export const tasksApi = {
  getTasks: (): Promise<Task[]> => mockServer.getTasks(),
  getTask: (id: string): Promise<Task> => mockServer.getTask(id),
  toggleTask: (id: string) => mockServer.toggleTask(id),
  deleteTask: (id: string) => mockServer.deleteTask(id),
};
