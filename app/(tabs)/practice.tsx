import { useEffect, useMemo, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';

import MantraTextView from '@/components/mantra-text-view';
import PaginationControls from '@/components/pagination-controls';
import ToggleSwitch from '@/components/toggle-switch';
import TopSettingButton from '@/components/top-setting-button';
import { Colors } from '@/constants/theme';
import { SHURANGAMA_MANTRA_PAGES } from '@/data/shurangama-mantra';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { createBlankIndices, difficultyToRatio } from '@/lib/mantra-blank';
import { useSettingStore } from '@/store/setting-store';

type BlankByPage = Record<number, Set<number>>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function PracticeScreen() {
  const colorScheme = useColorScheme();
  const backgroundColor = Colors[colorScheme ?? 'light'].background;
  const [pageIndex, setPageIndex] = useState(0);
  const [showBlanks, setShowBlanks] = useState(false);
  const [blankByPage, setBlankByPage] = useState<BlankByPage>({});

  const { pageStart, pageEnd, difficulty } = useSettingStore((s) => s.practice);
  const ratio = difficultyToRatio[difficulty];

  const selectedPages = useMemo(
    () =>
      SHURANGAMA_MANTRA_PAGES.filter((p) => p.pageNumber >= pageStart && p.pageNumber <= pageEnd),
    [pageStart, pageEnd],
  );

  useEffect(() => {
    setPageIndex((i) => Math.min(i, Math.max(0, selectedPages.length - 1)));
  }, [selectedPages.length]);

  const totalInRange = selectedPages.length;
  const currentIndex = Math.min(pageIndex, Math.max(0, totalInRange - 1));
  const currentPage = selectedPages[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === totalInRange - 1;

  const currentBlankIndices = blankByPage[currentIndex] ?? new Set<number>();

  const handleToggleBlanks = (nextChecked: boolean) => {
    if (nextChecked && Object.keys(blankByPage).length === 0) {
      const nextBlankByPage: BlankByPage = {};
      selectedPages.forEach((page, index) => {
        nextBlankByPage[index] = createBlankIndices(page.mantra, ratio);
      });
      setBlankByPage(nextBlankByPage);
    }
    setShowBlanks(nextChecked);
  };

  const handleResetPractice = () => {
    setBlankByPage({});
    setShowBlanks(false);
    setPageIndex(0);
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View
        style={[
          styles.paginationWrap,
          { borderBottomColor: Colors[colorScheme ?? 'light'].border },
        ]}
      >
        <View style={styles.paginationLeft}>
          <ToggleSwitch label="빈칸" checked={showBlanks} onChange={handleToggleBlanks} />
        </View>
        <View style={styles.paginationCenter}>
          <PaginationControls
            isFirst={isFirst}
            isLast={isLast}
            label={currentPage ? `${currentPage.pageNumber} / 12` : '0 / 0'}
            onPrev={() => setPageIndex((i) => Math.max(0, i - 1))}
            onNext={() => setPageIndex((i) => Math.min(totalInRange - 1, i + 1))}
          />
        </View>
        <View style={styles.paginationRight}>
          <TopSettingButton mode="practice" onReset={handleResetPractice} />
        </View>
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
            {currentPage && (
              <MantraTextView
                mantra={currentPage.mantra}
                fontSize={16}
                blankIndices={showBlanks ? currentBlankIndices : new Set()}
                mode="practice"
              />
            )}
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
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  horizontalContent: {
    paddingHorizontal: 16,
  },
  mantraWrap: {
    minHeight: 200,
  },
});
