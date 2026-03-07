import {
  Dimensions,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import MantraTextView from '@/components/mantra-text-view';
import { Colors } from '@/constants/theme';
import { SHURANGAMA_MANTRA_PAGE_1 } from '@/data/shurangama-mantra';
import { useColorScheme } from '@/hooks/use-color-scheme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function TabTwoScreen() {
  const colorScheme = useColorScheme();
  const backgroundColor = Colors[colorScheme ?? 'light'].background;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.horizontalContent, { minWidth: SCREEN_WIDTH }]}
      >
        <View style={styles.mantraWrap}>
          <MantraTextView mantra={SHURANGAMA_MANTRA_PAGE_1} fontSize={16} />
        </View>
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingTop: 16,
    paddingBottom: 32,
  },
  horizontalContent: {
    paddingHorizontal: 16,
  },
  mantraWrap: {
    minHeight: 200,
  },
});
