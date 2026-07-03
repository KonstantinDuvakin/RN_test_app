import { mockServer } from '../../../shared/mock/mockServer';

export const authApi = {
  login: (email: string, password: string) =>
    mockServer.login({ email, password }),
};
