import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Toast } from './types';
import { useThemedStyles } from '../theme/useThemedStyles';
import { Theme } from '../theme/themes';

export function ToastStack({ toasts }: { toasts: Toast[] }) {
  const styles = useThemedStyles(makeStyles);
  if (toasts.length === 0) return null;

  return (
    <SafeAreaView style={styles.wrap} pointerEvents="none">
      {toasts.map(t => (
        <View key={t.id} style={[styles.toast, styles[t.type]]}>
          <Text style={styles.text}>{t.message}</Text>
        </View>
      ))}
    </SafeAreaView>
  );
}

const makeStyles = (t: Theme) =>
  StyleSheet.create({
    wrap: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      alignItems: 'center',
      gap: t.spacing(2),
      paddingTop: t.spacing(2),
    },
    toast: {
      paddingVertical: t.spacing(3),
      paddingHorizontal: t.spacing(4),
      borderRadius: t.radius,
      maxWidth: '90%',
    },
    text: { color: '#fff', fontSize: 14, fontWeight: '600' },
    success: { backgroundColor: '#2E9E5B' },
    error: { backgroundColor: t.colors.danger },
    info: { backgroundColor: t.colors.primary },
  });
