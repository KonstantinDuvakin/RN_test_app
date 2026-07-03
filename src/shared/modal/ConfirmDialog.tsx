import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ConfirmOptions } from './types';
import { useThemedStyles } from '../theme/useThemedStyles';
import { Theme } from '../theme/themes';

interface Props {
  options: ConfirmOptions | null;
  onResult: (result: boolean) => void;
}

export function ConfirmDialog({ options, onResult }: Props) {
  const styles = useThemedStyles(makeStyles);
  const visible = options !== null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => onResult(false)}
    >
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>{options?.title}</Text>
          {options?.message && (
            <Text style={styles.message}>{options.message}</Text>
          )}

          <View style={styles.buttons}>
            <TouchableOpacity
              style={styles.btn}
              onPress={() => onResult(false)}
            >
              <Text style={styles.cancelText}>
                {options?.cancelText ?? 'Отмена'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn} onPress={() => onResult(true)}>
              <Text
                style={[
                  styles.confirmText,
                  options?.danger && styles.dangerText,
                ]}
              >
                {options?.confirmText ?? 'OK'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const makeStyles = (t: Theme) =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      padding: t.spacing(6),
    },
    card: {
      backgroundColor: t.colors.surface,
      borderRadius: t.radius,
      padding: t.spacing(5),
      gap: t.spacing(3),
    },
    title: { fontSize: 18, fontWeight: '700', color: t.colors.text },
    message: { fontSize: 15, color: t.colors.textMuted, lineHeight: 21 },
    buttons: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: t.spacing(4),
      marginTop: t.spacing(2),
    },
    btn: { paddingVertical: t.spacing(2), paddingHorizontal: t.spacing(3) },
    cancelText: { fontSize: 16, color: t.colors.textMuted, fontWeight: '600' },
    confirmText: { fontSize: 16, color: t.colors.primary, fontWeight: '700' },
    dangerText: { color: t.colors.danger },
  });
