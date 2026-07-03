import { createMMKV } from 'react-native-mmkv';

export const authMMKV = createMMKV()

export const authStorage = {
  getAccess: () => authMMKV.getString('accessToken') ?? null,
  getRefresh: () => authMMKV.getString('refreshToken') ?? null,
  setTokens: (a: string, r: string) => {
    authMMKV.set('accessToken', a);
    authMMKV.set('refreshToken', r);
  },
  clear: () => {
    authMMKV.remove('accessToken');
    authMMKV.remove('refreshToken');
  },
};
