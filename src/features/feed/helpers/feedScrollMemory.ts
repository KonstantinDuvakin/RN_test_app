let savedKey: string | null = null; // для какого поиска сохранена позиция
let savedTopId: string | null = null; // id верхнего видимого элемента

export const feedScrollMemory = {
  save: (key: string, topItemId: string) => {
    savedKey = key;
    savedTopId = topItemId;
  },
  // вернёт id только если ключ совпадает с текущим поиском
  get: (key: string): string | null => (savedKey === key ? savedTopId : null),
  // сброс при смене поиска
  reset: () => {
    savedKey = null;
    savedTopId = null;
  },
};
