import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useTaskDetailViewModel } from '../hooks/useTaskDetailViewModel';
import { Theme } from '../../../shared/theme/themes.ts';
import { useThemedStyles } from '../../../shared/theme/useThemedStyles.ts';

export function TaskDetailScreen({ route }: any) {
  const { taskId } = route.params;
  const styles = useThemedStyles(makeStyles);
  const vm = useTaskDetailViewModel(taskId);

  if (vm.isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  if (vm.errorMessage) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{vm.errorMessage}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{vm.task!.title}</Text>
      <Text style={styles.status}>
        Статус: {vm.task!.done ? '✓ выполнено' : '○ не выполнено'}
      </Text>
      <Text style={styles.id}>ID: {vm.task!.id}</Text>
    </View>
  );
}

const makeStyles = (t: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: t.colors.surface,
      flex: 1,
      padding: t.spacing(6),
      gap: t.spacing(3),
    },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: {
      fontSize: t.spacing(6),
      fontWeight: '700',
      color: t.colors.primary,
    },
    status: { fontSize: t.spacing(4.5), color: t.colors.primary },
    id: { fontSize: t.spacing(3.5), color: t.colors.textMuted },
    error: { color: t.colors.danger, fontSize: t.spacing(4) },
  });
