import { useMemo, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';

import MantraTextView from '@/components/mantra-text-view';
import PaginationControls from '@/components/pagination-controls';
import ToggleSwitch from '@/components/toggle-switch';
import TopSettingButton from '@/components/top-setting-button';
import { Colors } from '@/constants/theme';
import { SHURANGAMA_MANTRA_PAGES } from '@/data/shurangama-mantra';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { usePagination } from '@/hooks/use-pagination';
import { createBlankIndices, difficultyToRatio } from '@/lib/mantra-blank';
import { useSettingStore } from '@/store/setting-store';

type BlankByPage = Record<number, Set<number>>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function PracticeScreen() {
  const colorScheme = useColorScheme();
  const backgroundColor = Colors[colorScheme ?? 'light'].background;
  const [showBlanks, setShowBlanks] = useState(false);
  const [blankByPage, setBlankByPage] = useState<BlankByPage>({});

  const { pageStart, pageEnd, difficulty } = useSettingStore((s) => s.practice);
  const fontSize = useSettingStore((s) => s.fontSize);
  const ratio = difficultyToRatio[difficulty];

  const selectedPages = useMemo(
    () =>
      SHURANGAMA_MANTRA_PAGES.filter((p) => p.pageNumber >= pageStart && p.pageNumber <= pageEnd),
    [pageStart, pageEnd],
  );

  const {
    currentIndex,
    currentItem: currentPage,
    isFirst,
    isLast,
    goPrev,
    goNext,
    setCurrentIndex,
  } = usePagination({ items: selectedPages });

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
    setCurrentIndex(0);
  };

  if (!currentPage) return null;

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View
        style={[styles.topBarWrap, { borderBottomColor: Colors[colorScheme ?? 'light'].border }]}
      >
        <View style={styles.topBarLeft}>
          <ToggleSwitch label="빈칸" checked={showBlanks} onChange={handleToggleBlanks} />
        </View>
        <View style={styles.topBarCenter}>
          <PaginationControls
            isFirst={isFirst}
            isLast={isLast}
            label={currentPage ? `${currentPage.pageNumber} / 12` : '0 / 0'}
            onPrev={goPrev}
            onNext={goNext}
          />
        </View>
        <View style={styles.topBarRight}>
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
                fontSize={fontSize}
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
  topBarWrap: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    paddingHorizontal: 16,
  },
  topBarLeft: {
    flex: 1,
    alignItems: 'flex-start',
  },
  topBarCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarRight: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  scrollArea: {
    flex: 1,
  },
  content: {
    paddingVertical: 10,
  },
  horizontalContent: {
    paddingHorizontal: 16,
  },
  mantraWrap: {
    minHeight: 200,
  },
});
