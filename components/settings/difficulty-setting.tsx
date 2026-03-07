import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { Difficulty } from '@/store/setting-store';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const OPTIONS: { value: Difficulty; label: string }[] = [
  { value: 'easy', label: '쉬움' },
  { value: 'medium', label: '보통' },
  { value: 'hard', label: '어려움' },
];

type DifficultySettingProps = {
  value: Difficulty;
  onChange: (value: Difficulty) => void;
};

export default function DifficultySetting({ value, onChange }: DifficultySettingProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={styles.wrap}>
      <Text style={[styles.label, { color: colors.text }]}>난이도</Text>
      <View style={[styles.row, { borderColor: colors.border }]}>
        {OPTIONS.map((opt) => {
          const isSelected = value === opt.value;
          return (
            <Pressable
              key={opt.value}
              onPress={() => onChange(opt.value)}
              style={[styles.option, isSelected && { backgroundColor: colors.tint }]}
              accessibilityLabel={opt.label}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
            >
              <Text
                style={[styles.optionText, { color: isSelected ? colors.background : colors.text }]}
              >
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 15 },
  label: { fontSize: 18, fontWeight: '600', marginBottom: 15 },
  row: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  option: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: { fontSize: 15, fontWeight: '400' },
});
