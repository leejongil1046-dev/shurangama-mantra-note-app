import Feather from '@expo/vector-icons/Feather';
import { Alert, Pressable, StyleSheet, View } from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type TopSettingButtonProps = {
  /** 초기화 시 실행. 없으면 초기화 버튼 비활성화 */
  onReset?: () => void;
  /** 설정 버튼 탭 시 실행 */
  onOpenSettings?: () => void;
  /** 초기화 확인 문구 (기본: '초기화하시겠습니까?') */
  resetConfirmMessage?: string;
};

const ICON_SIZE = 22;
const BUTTON_SIZE = 35;

export default function TopSettingButton({
  onReset,
  onOpenSettings,
  resetConfirmMessage = '초기화하시겠습니까?',
}: TopSettingButtonProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const iconColor = colors.text;

  const handlePressReset = () => {
    if (!onReset) return;
    Alert.alert('확인', resetConfirmMessage, [
      { text: '취소', style: 'cancel' },
      { text: '초기화', onPress: onReset },
    ]);
  };

  return (
    <View style={styles.wrap}>
      <Pressable
        onPress={handlePressReset}
        disabled={!onReset}
        style={({ pressed }) => [styles.button, { opacity: !onReset ? 0.4 : pressed ? 0.7 : 1 }]}
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
