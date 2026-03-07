import Feather from '@expo/vector-icons/Feather';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import ConfirmModal, { type ConfirmMode } from '@/components/settings/confirm-modal';
import SettingModal, { type SettingMode } from '@/components/settings/setting-modal';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type TopSettingButtonProps = {
  mode: SettingMode;
  /** 초기화 확인 후 실행. 없으면 초기화 버튼 비활성화 */
  onReset?: () => void;
};

const ICON_SIZE = 22;
const BUTTON_SIZE = 35;

export default function TopSettingButton({ mode, onReset }: TopSettingButtonProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const iconColor = colors.text;
  const [isSettingOpen, setIsSettingOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const confirmMode: ConfirmMode = mode === 'practice' ? 'reset-practice' : 'reset-memorize';

  const handleClickReset = () => {
    if (!onReset) return;
    setIsResetConfirmOpen(true);
  };

  const handleConfirmReset = () => {
    onReset?.();
  };

  return (
    <View style={styles.wrap}>
      <Pressable
        onPress={handleClickReset}
        disabled={!onReset}
        style={({ pressed }) => [styles.button, { opacity: !onReset ? 0.4 : pressed ? 0.7 : 1 }]}
        accessibilityLabel="초기화"
        accessibilityRole="button"
      >
        <Feather name="refresh-cw" size={ICON_SIZE} color={iconColor} />
      </Pressable>
      <Pressable
        onPress={() => setIsSettingOpen(true)}
        style={({ pressed }) => [styles.button, { opacity: pressed ? 0.7 : 1 }]}
        accessibilityLabel="설정"
        accessibilityRole="button"
      >
        <Feather name="settings" size={ICON_SIZE} color={iconColor} />
      </Pressable>

      <ConfirmModal
        open={isResetConfirmOpen}
        mode={confirmMode}
        onConfirm={handleConfirmReset}
        onClose={() => setIsResetConfirmOpen(false)}
      />
      <SettingModal open={isSettingOpen} mode={mode} onClose={() => setIsSettingOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
});
