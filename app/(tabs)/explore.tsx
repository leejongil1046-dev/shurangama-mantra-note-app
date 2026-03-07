import { useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import MantraTextView from '@/components/mantra-text-view';
import PaginationControls from '@/components/pagination-controls';
import { Colors } from '@/constants/theme';
import { SHURANGAMA_MANTRA_PAGES } from '@/data/shurangama-mantra';
import { useColorScheme } from '@/hooks/use-color-scheme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TOTAL_PAGES = SHURANGAMA_MANTRA_PAGES.length;

export default function TabTwoScreen() {
  const colorScheme = useColorScheme();
  const backgroundColor = Colors[colorScheme ?? 'light'].background;
  const [pageIndex, setPageIndex] = useState(0);

  const current = SHURANGAMA_MANTRA_PAGES[pageIndex];
  const isFirst = pageIndex === 0;
  const isLast = pageIndex === TOTAL_PAGES - 1;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.paginationWrap}>
        <PaginationControls
          isFirst={isFirst}
          isLast={isLast}
          label={`${current.pageNumber} / ${TOTAL_PAGES}`}
          onPrev={() => setPageIndex((i) => Math.max(0, i - 1))}
          onNext={() => setPageIndex((i) => Math.min(TOTAL_PAGES - 1, i + 1))}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.horizontalContent, { minWidth: SCREEN_WIDTH }]}
      >
        <View style={styles.mantraWrap}>
          <MantraTextView mantra={current.mantra} fontSize={16} />
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
  paginationWrap: {
    alignItems: 'center',
    marginBottom: 16,
  },
  horizontalContent: {
    paddingHorizontal: 16,
  },
  mantraWrap: {
    minHeight: 200,
  },
});
