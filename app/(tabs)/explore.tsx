import { ScrollView, StyleSheet, View } from 'react-native';

import MantraTextView from '@/components/mantra-text-view';
import { Colors } from '@/constants/theme';
import { SHURANGAMA_MANTRA_PAGE_1 } from '@/data/shurangama-mantra';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabTwoScreen() {
  const colorScheme = useColorScheme();
  const backgroundColor = Colors[colorScheme ?? 'light'].background;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.mantraWrap}>
        <MantraTextView mantra={SHURANGAMA_MANTRA_PAGE_1} fontSize={16} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  mantraWrap: {
    minHeight: 200,
  },
});
