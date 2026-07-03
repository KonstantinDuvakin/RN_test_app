import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Task } from '../api/tasksApi';
import { useThemedStyles } from '../../../shared/theme/useThemedStyles.ts';
import { Theme } from '../../../shared/theme/themes.ts';

export function TaskRow({
  task,
  onToggle,
  onPress,
  onLongPress
}: {
  task: Task;
  onToggle: () => void;
  onPress: () => void;
  onLongPress: () => void;
}) {
  const styles = useThemedStyles(makeStyles);
  return (
    <View style={styles.row}>
      <TouchableOpacity onPress={onToggle}>
        <View style={[styles.checkbox, task.done && styles.checked]}>
          {task.done && <Text style={styles.tick}>✓</Text>}
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.titleArea} onPress={onPress} onLongPress={onLongPress}>
        <Text style={[styles.title, task.done && styles.titleDone]}>
          {task.title}
        </Text>
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>
    </View>
  );
}

const makeStyles = (t: Theme) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: t.spacing(4),
      gap: t.spacing(3),
      borderBottomWidth: 1,
      borderBottomColor: t.colors.border,
      backgroundColor: t.colors.surface,
    },
    checkbox: {
      width: 26,
      height: 26,
      borderRadius: 6,
      borderWidth: 2,
      borderColor: t.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    checked: { backgroundColor: t.colors.primary },
    tick: { color: t.colors.primaryText, fontWeight: '700' },
    titleArea: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    title: { fontSize: 16, color: t.colors.text },
    titleDone: {
      textDecorationLine: 'line-through',
      color: t.colors.textMuted,
    },
    chevron: { fontSize: 24, color: t.colors.textMuted },
  });
