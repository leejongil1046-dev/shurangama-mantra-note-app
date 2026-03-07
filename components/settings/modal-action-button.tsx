import { Pressable, StyleSheet, Text } from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type ModalActionButtonProps = {
  label: string;
  onPress: () => void;
  variant: 'cancel' | 'primary' | 'primaryDisabled';
  fontSize?: number;
};

export default function ModalActionButton({
  label,
  onPress,
  variant,
  fontSize = 14,
}: ModalActionButtonProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const isCancel = variant === 'cancel';
  const isDisabled = variant === 'primaryDisabled';

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        {
          borderColor: colors.border,
          backgroundColor: isCancel ? 'transparent' : isDisabled ? '#9BA1A6' : '#11181C',
          opacity: isDisabled ? 1 : pressed ? 0.9 : 1,
        },
        isCancel && styles.cancelBorder,
      ]}
    >
      <Text style={[styles.label, { color: isCancel ? colors.text : '#fff' }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  cancelBorder: {
    borderWidth: 1,
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  },
});
