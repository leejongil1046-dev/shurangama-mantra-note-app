import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { RangeSlider } from '@sharcoux/slider';
import { StyleSheet, Text, View } from 'react-native';

type PageRangeSettingProps = {
  totalPages: number;
  value: [number, number];
  onChange: (range: [number, number]) => void;
};

export default function PageRangeSetting({
  totalPages,
  value: [pageStart, pageEnd],
  onChange,
}: PageRangeSettingProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <Text style={[styles.label, { color: colors.text }]}>페이지 선택</Text>
        <Text style={[styles.rangeText, { color: colors.text }]}>
          {pageStart}페이지 ~ {pageEnd}페이지
        </Text>
      </View>

      <View style={styles.sliderWrap}>
        <RangeSlider
          range={[pageStart, pageEnd]}
          minimumValue={1}
          maximumValue={totalPages}
          step={1}
          crossingAllowed={false}
          minimumRange={0}
          trackHeight={6}
          thumbSize={10}
          inboundColor={colors.tint}
          outboundColor={colors.border}
          thumbTintColor={colors.tint}
          onValueChange={onChange}
          style={styles.slider}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 20 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: { fontSize: 18, fontWeight: '600', marginBottom: 4 },
  rangeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  rangeText: { fontSize: 14 },
  sliderWrap: { paddingHorizontal: 4 },
  slider: { height: 40 },
});
