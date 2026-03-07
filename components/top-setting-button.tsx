import Feather from '@expo/vector-icons/Feather';
import { Pressable, StyleSheet, View } from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type TopSettingButtonProps = {
  /** 초기화 버튼 탭 시 실행 (확인 모달을 띄우는 등). 없으면 초기화 버튼 비활성화 */
  onRequestReset?: () => void;
  /** 설정 버튼 탭 시 실행 */
  onOpenSettings?: () => void;
};

const ICON_SIZE = 22;
const BUTTON_SIZE = 35;

export default function TopSettingButton({
  onRequestReset,
  onOpenSettings,
}: TopSettingButtonProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const iconColor = colors.text;

  return (
    <View style={styles.wrap}>
      <Pressable
        onPress={onRequestReset}
        disabled={!onRequestReset}
        style={({ pressed }) => [
          styles.button,
          { opacity: !onRequestReset ? 0.4 : pressed ? 0.7 : 1 },
        ]}
        accessibilityLabel="초기화"
        accessibilityRole="button"
      >
        <Feather name="refresh-cw" size={ICON_SIZE} color={iconColor} />
      </Pressable>
      <Pressable
        onPress={onOpenSettings}
        style={({ pressed }) => [styles.button, { opacity: pressed ? 0.7 : 1 }]}
        accessibilityLabel="설정"
        accessibilityRole="button"
      >
        <Feather name="settings" size={ICON_SIZE} color={iconColor} />
      </Pressable>
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
