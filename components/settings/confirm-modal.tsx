import { Modal, StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/theme';
import ModalActionButton from './modal-action-button';
import { useColorScheme } from '@/hooks/use-color-scheme';

export type ConfirmMode =
  | 'reset-practice'
  | 'reset-memorize'
  | 'grade-with-blanks';

type ConfirmModalProps = {
  open: boolean;
  mode: ConfirmMode;
  onConfirm: () => void;
  onClose: () => void;
  params?: Record<string, string | number>;
};

const PRESET = {
  'reset-practice': {
    title: '연습하기 상태를 초기화할까요?',
    description:
      '현재 페이지 범위와 난이도는 유지한 채, 생성된 빈칸을 모두 지우고 빈칸 모드를 해제한 뒤 첫 페이지로 이동합니다.',
    confirmLabel: '초기화',
    cancelLabel: '취소',
  },
  'reset-memorize': {
    title: '암기하기 상태를 초기화할까요?',
    description:
      '현재 페이지 범위와 난이도는 유지한 채, 암기하기의 빈칸과 입력한 답을 모두 지우고 첫 페이지로 이동합니다.',
    confirmLabel: '초기화',
    cancelLabel: '취소',
  },
  'grade-with-blanks': {
    title: '채점하시겠습니까?',
    description:
      '총 {totalBlanks}개의 빈칸 중 {filledCount}개를 입력하셨습니다. 정말 채점하시겠습니까?',
    confirmLabel: '채점하기',
    cancelLabel: '취소',
  },
} as const;

function applyParams(
  template: string,
  params?: Record<string, string | number>,
): string {
  if (!params) return template;
  return Object.entries(params).reduce(
    (acc, [key, value]) =>
      acc.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value)),
    template,
  );
}

export default function ConfirmModal({
  open,
  mode,
  onConfirm,
  onClose,
  params,
}: ConfirmModalProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  if (!open) return null;

  const preset = PRESET[mode];
  const description = applyParams(preset.description, params);
  const { title, confirmLabel, cancelLabel } = preset;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View
          style={[
            styles.panel,
            {
              backgroundColor: colors.background,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          <Text style={[styles.description, { color: colors.icon }]}>
            {description}
          </Text>
          <View style={styles.actions}>
            <ModalActionButton label={cancelLabel} onPress={onClose} variant="cancel" />
            <ModalActionButton
              label={confirmLabel}
              onPress={handleConfirm}
              variant="primary"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  panel: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 12,
    borderWidth: 1,
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 24,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
});
