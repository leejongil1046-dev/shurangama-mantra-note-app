import Feather from '@expo/vector-icons/Feather';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export type PaginationControlsProps = {
  isFirst: boolean;
  isLast: boolean;
  label: string;
  onPrev: () => void;
  onNext: () => void;
};

export default function PaginationControls({
  isFirst,
  isLast,
  label,
  onPrev,
  onNext,
}: PaginationControlsProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const disabledOpacity = 0.4;

  return (
    <View style={styles.container}>
      <Pressable
        onPress={onPrev}
        disabled={isFirst}
        style={({ pressed }) => [
          styles.button,
          {
            borderColor: colors.text,
            opacity: isFirst ? disabledOpacity : pressed ? 0.7 : 1,
          },
        ]}
        accessibilityLabel="이전 페이지"
      >
        <Feather name="chevron-left" size={16} color={colors.text} />
      </Pressable>

      <Text style={[styles.label, { color: colors.icon }]}>{label}</Text>

      <Pressable
        onPress={onNext}
        disabled={isLast}
        style={({ pressed }) => [
          styles.button,
          {
            borderColor: colors.text,
            opacity: isLast ? disabledOpacity : pressed ? 0.7 : 1,
          },
        ]}
        accessibilityLabel="다음 페이지"
      >
        <Feather name="chevron-right" size={16} color={colors.text} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 120,
  },
  button: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    borderWidth: 1,
  },
  label: {
    fontSize: 13,
  },
});
