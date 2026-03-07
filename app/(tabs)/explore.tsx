import { useMemo, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';

import MantraTextView from '@/components/mantra-text-view';
import PaginationControls from '@/components/pagination-controls';
import ToggleSwitch from '@/components/toggle-switch';
import { Colors } from '@/constants/theme';
import { SHURANGAMA_MANTRA_PAGES } from '@/data/shurangama-mantra';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { createBlankIndices, difficultyToRatio } from '@/lib/mantra-blank';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TOTAL_PAGES = SHURANGAMA_MANTRA_PAGES.length;

export default function TabTwoScreen() {
  const colorScheme = useColorScheme();
  const backgroundColor = Colors[colorScheme ?? 'light'].background;
  const [pageIndex, setPageIndex] = useState(0);
  const [blankEnabled, setBlankEnabled] = useState(false);

  const current = SHURANGAMA_MANTRA_PAGES[pageIndex];
  const isFirst = pageIndex === 0;
  const isLast = pageIndex === TOTAL_PAGES - 1;

  const blankIndices = useMemo(() => {
    if (!blankEnabled) return new Set<number>();
    return createBlankIndices(SHURANGAMA_MANTRA_PAGES[pageIndex].mantra, difficultyToRatio.medium);
  }, [blankEnabled, pageIndex]);

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View
        style={[
          styles.paginationWrap,
          { borderBottomColor: Colors[colorScheme ?? 'light'].border },
        ]}
      >
        <View style={styles.paginationLeft}>
          <ToggleSwitch label="빈칸" checked={blankEnabled} onChange={setBlankEnabled} />
        </View>
        <View style={styles.paginationCenter}>
          <PaginationControls
            isFirst={isFirst}
            isLast={isLast}
            label={`${current.pageNumber} / ${TOTAL_PAGES}`}
            onPrev={() => setPageIndex((i) => Math.max(0, i - 1))}
            onNext={() => setPageIndex((i) => Math.min(TOTAL_PAGES - 1, i + 1))}
          />
        </View>
        <View style={styles.paginationRight} />
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.horizontalContent, { minWidth: SCREEN_WIDTH }]}
        >
          <View style={styles.mantraWrap}>
            <MantraTextView
              mantra={current.mantra}
              fontSize={16}
              blankIndices={blankIndices}
              mode="practice"
            />
          </View>
        </ScrollView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollArea: {
    flex: 1,
  },
  content: {
    paddingVertical: 16,
    paddingBottom: 32,
  },
  paginationWrap: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    paddingHorizontal: 16,
  },
  paginationLeft: {
    flex: 1,
    alignItems: 'flex-start',
  },
  paginationCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paginationRight: {
    flex: 1,
  },
  horizontalContent: {
    paddingHorizontal: 16,
  },
  mantraWrap: {
    minHeight: 200,
  },
});
