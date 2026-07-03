const FAKE_USER = { id: 'u1', email: 'test@test.com', name: 'Тест Тестов' };

let TASKS = [
  { id: 't1', title: 'Выучить MVVM', done: false },
  { id: 't2', title: 'Разобрать Clean', done: false },
  { id: 't3', title: 'Настроить OTA', done: true },
];

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

export const mockServer = {
  async login({ email, password }: { email: string; password: string }) {
    await delay(800);
    if (email !== 'test@test.com' || password !== '123456') {
      throw { status: 401, message: 'Неверный email или пароль' };
    }
    return { token: 'fake-jwt-abc', user: FAKE_USER };
  },

  async getTasks() {
    await delay(600);
    return TASKS;
  },

  async getTask(id: string) {
    await delay(400);
    const task = TASKS.find(t => t.id === id);
    if (!task) throw { status: 404, message: 'Задача не найдена' };
    return task;
  },

  async toggleTask(id: string) {
    await delay(500);
    // в ~40% случаев притворяемся, что сервер упал
    if (Math.random() < 0.4) {
      throw { status: 500, message: 'Сервер не смог обновить задачу' };
    }
    TASKS = TASKS.map(t => (t.id === id ? { ...t, done: !t.done } : t));
    return TASKS.find(t => t.id === id)!;
  },

  async deleteTask(id: string) {
    await delay(300);
    TASKS = TASKS.filter(t => t.id !== id);
    return { id };
  },

  async getFeed({
    page,
    pageSize = 10,
    search = '',
  }: {
    page: number;
    pageSize?: number;
    search?: string;
  }) {
    await delay(700);
    const TOTAL = 115;

    // весь "серверный" датасет
    const all = Array.from({ length: TOTAL }).map((_, i) => ({
      id: `item-${i + 1}`,
      title: `Элемент №${i + 1}`,
    }));

    // фильтрация по поисковому запросу (на сервере)
    const filtered = search
      ? all.filter(item =>
          item.title.toLowerCase().includes(search.toLowerCase()),
        )
      : all;

    // пагинация уже отфильтрованного
    const start = (page - 1) * pageSize;
    const items = filtered.slice(start, start + pageSize);

    return {
      items,
      page,
      hasMore: start + pageSize < filtered.length,
      total: filtered.length, // пригодится показать "найдено N"
    };
  },
};
