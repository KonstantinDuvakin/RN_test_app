import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useTasksViewModel } from '../hooks/useTasksViewModel';
import { TaskRow } from '../components/TaskRow';
import { authStorage } from '../../../shared/storage/authStorage';
import { useThemedStyles } from '../../../shared/theme/useThemedStyles.ts';
import { useTheme } from '../../../shared/theme/ThemeContext.tsx';
import { Theme } from '../../../shared/theme/themes.ts';
import { useModal } from '../../../shared/modal/ModalProvider.tsx';
import { ErrorState } from '../../../shared/ui/ErrorState.tsx';

export function TasksScreen({ navigation }: any) {
  const vm = useTasksViewModel();
  const styles = useThemedStyles(makeStyles);
  const { toggleTheme, themeName } = useTheme();

  const { confirm, toast } = useModal();

  const handleDelete = async (id: string, title: string) => {
    const ok = await confirm({
      title: 'Удалить задачу?',
      message: `«${title}» будет удалена безвозвратно`,
      confirmText: 'Удалить',
      danger: true,
    });
    if (ok) {
      vm.remove(id);
      toast('Задача удалена', 'success');
    }
  };

  if (vm.isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // 2) ошибка И нечего показать → полноэкранный retry
  if (vm.error && vm.tasks.length === 0) {
    return <ErrorState error={vm.error} onRetry={vm.refetch} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.progress}>
          Выполнено: {vm.doneCount} из {vm.total} ({vm.progress}%)
        </Text>
        <View style={styles.headerButtons}>
          {/* переключатель темы */}
          <TouchableOpacity onPress={toggleTheme} style={styles.themeBtn}>
            <Text style={styles.themeBtnText}>
              {themeName === 'light' ? '🌙' : '☀️'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Feed')}>
            <View>
              <Text>Feed</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              authStorage.clear();
              navigation.replace('Login');
            }}
          >
            <Text style={styles.logout}>Выйти</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={vm.tasks}
        keyExtractor={t => t.id}
        renderItem={({ item }) => (
          <TaskRow
            task={item}
            onToggle={() => vm.toggle(item.id)}
            onPress={() =>
              navigation.navigate('TaskDetail', { taskId: item.id })
            }
            onLongPress={() => handleDelete(item.id, item.title)}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={vm.isRefetching} onRefresh={vm.refetch} />
        }
      />
    </View>
  );
}

const makeStyles = (t: Theme) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: t.colors.background },
    center: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: t.colors.background,
    },
    _spinner: { color: t.colors.primary }, // приём: вытащить цвет для пропа color
    header: {
      padding: t.spacing(4),
      gap: t.spacing(2),
      borderBottomWidth: 1,
      borderBottomColor: t.colors.border,
      backgroundColor: t.colors.surface,
    },
    headerButtons: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    progress: { fontSize: 16, fontWeight: '600', color: t.colors.text },
    themeBtn: { padding: t.spacing(2) },
    themeBtnText: { fontSize: t.spacing(5) },
    logout: {
      color: t.colors.primary,
      fontSize: t.spacing(4),
      fontWeight: '600',
    },
  });
