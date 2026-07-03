import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/authApi';
import { authStorage } from '../../../shared/storage/authStorage';

export function useLoginViewModel(onSuccess: () => void) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const canSubmit = email.includes('@') && password.length >= 6;

  const { mutate, isPending, error } = useMutation({
    mutationFn: () => authApi.login(email, password),
    onSuccess: data => {
      authStorage.setToken(data.token);
      onSuccess();
    },
  });

  return {
    email,
    setEmail,
    password,
    setPassword,
    canSubmit,
    isPending,
    errorMessage: error ? (error as any).message : null,
    submit: () => {
      if (canSubmit) mutate();
    },
  };
}
