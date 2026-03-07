import { useEffect, useMemo, useState } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { Difficulty } from '@/store/setting-store';
import { useSettingStore } from '@/store/setting-store';

import DifficultySetting from './difficulty-setting';
import ModalActionButton from './modal-action-button';
import PageRangeSetting from './page-range-setting';

export type SettingMode = 'practice' | 'memorize';

type SettingModalProps = {
  open: boolean;
  onClose?: () => void;
  mode: SettingMode;
};

const TOTAL_PAGES = 12;

export default function SettingModal({ open, onClose, mode }: SettingModalProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const practice = useSettingStore((s) => s.practice);
  const memorize = useSettingStore((s) => s.memorize);
  const slice = mode === 'practice' ? practice : memorize;
  const { pageStart, pageEnd, difficulty } = slice;

  const setPracticePageRange = useSettingStore((s) => s.setPracticePageRange);
  const setPracticeDifficulty = useSettingStore((s) => s.setPracticeDifficulty);
  const setMemorizePageRange = useSettingStore((s) => s.setMemorizePageRange);
  const setMemorizeDifficulty = useSettingStore((s) => s.setMemorizeDifficulty);

  const [tempRange, setTempRange] = useState<[number, number]>([pageStart, pageEnd]);
  const [tempDifficulty, setTempDifficulty] = useState<Difficulty>(difficulty);

  useEffect(() => {
    if (open) {
      setTempRange([pageStart, pageEnd]);
      setTempDifficulty(difficulty);
    }
  }, [open, pageStart, pageEnd, difficulty]);

  const isChanged = useMemo(() => {
    const [tempStart, tempEnd] = tempRange;
    return tempStart !== pageStart || tempEnd !== pageEnd || tempDifficulty !== difficulty;
  }, [tempRange, tempDifficulty, pageStart, pageEnd, difficulty]);

  const handleSave = () => {
    const [start, end] = tempRange;
    if (mode === 'practice') {
      setPracticePageRange(start, end);
      setPracticeDifficulty(tempDifficulty);
    } else {
      setMemorizePageRange(start, end);
      setMemorizeDifficulty(tempDifficulty);
    }
    onClose?.();
  };

  const title = mode === 'practice' ? '설정 (연습하기)' : '설정 (암기하기)';

  return (
    <Modal visible={open} transparent animationType="fade" onRequestClose={onClose}>
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

          <PageRangeSetting totalPages={TOTAL_PAGES} value={tempRange} onChange={setTempRange} />
          <DifficultySetting value={tempDifficulty} onChange={setTempDifficulty} />

          <View style={styles.actions}>
            {onClose && <ModalActionButton label="취소" onPress={onClose} variant="cancel" />}
            <ModalActionButton
              label="저장"
              onPress={handleSave}
              variant={isChanged ? 'primary' : 'primaryDisabled'}
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
    padding: 20,
  },
  panel: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 12,
    borderWidth: 1,
    padding: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 30,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 20,
  },
});
