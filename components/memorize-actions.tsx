import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type MemorizeActionsProps = {
  /** 스토어 준비 여부. false면 빈 영역만 렌더 */
  hasHydrated: boolean;
  /** 암기 세션 진행 중 여부 */
  isActive: boolean;
  /** 채점 완료 여부. true면 버튼이 "결과확인"으로 표시됨 */
  isGraded?: boolean;
  onStart: () => void;
  onGrade?: () => void;
};

export default function MemorizeActions({
  hasHydrated,
  isActive,
  isGraded = false,
  onStart,
  onGrade,
}: MemorizeActionsProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  if (!hasHydrated) {
    return <View style={styles.wrap} />;
  }

  if (!isActive) {
    return (
      <View style={styles.wrap}>
        <Pressable
          onPress={onStart}
          style={({ pressed }) => [
            styles.button,
            { borderColor: colors.border },
            pressed && { opacity: 0.8 },
          ]}
        >
          <Text style={[styles.buttonText, { color: colors.text }]}>암기 시작</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      <Pressable
        onPress={onGrade}
        disabled={!onGrade}
        style={({ pressed }) => [
          styles.button,
          { borderColor: colors.border },
          !onGrade && styles.buttonDisabled,
          onGrade && pressed && { opacity: 0.8 },
        ]}
      >
        <Text style={[styles.buttonText, { color: colors.text }]}>
          {isGraded ? '결과확인' : '채점하기'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 12,
    width: 200,
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    borderWidth: 1,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 14,
  },
});
