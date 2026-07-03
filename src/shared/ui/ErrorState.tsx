import { View, Text, Button } from 'react-native';
import { AppError } from '../errors/appError';

const ICON: Record<string, string> = {
  network: '📵',
  server: '🔧',
  business: '⚠️',
  unknown: '❓',
};

export function ErrorState({
  error,
  onRetry,
}: {
  error: AppError;
  onRetry: () => void;
}) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
      }}
    >
      <Text style={{ fontSize: 40 }}>{ICON[error.kind]}</Text>
      <Text style={{ textAlign: 'center' }}>{error.message}</Text>
      {error.canRetry && <Button title="Повторить" onPress={onRetry} />}
    </View>
  );
}
