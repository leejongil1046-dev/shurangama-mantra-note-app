import { useMemo, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';

import MantraTextView from '@/components/mantra-text-view';
import MemorizeActions from '@/components/memorize-actions';
import PaginationControls from '@/components/pagination-controls';
import TopSettingButton from '@/components/top-setting-button';
import { Colors } from '@/constants/theme';
import { SHURANGAMA_MANTRA_PAGES } from '@/data/shurangama-mantra';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { usePagination } from '@/hooks/use-pagination';
import { useSettingStore } from '@/store/setting-store';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function MemorizeScreen() {
  const colorScheme = useColorScheme();
  const backgroundColor = Colors[colorScheme ?? 'light'].background;
  const [isActive, setIsActive] = useState(false);

  const { pageStart, pageEnd } = useSettingStore((s) => s.memorize);

  const selectedPages = useMemo(
    () =>
      SHURANGAMA_MANTRA_PAGES.filter((p) => p.pageNumber >= pageStart && p.pageNumber <= pageEnd),
    [pageStart, pageEnd],
  );

  const {
    currentItem: currentPage,
    isFirst,
    isLast,
    goPrev,
    goNext,
    setCurrentIndex,
  } = usePagination({ items: selectedPages });

  const handleStartMemorize = () => {
    setIsActive(true);
  };

  const handleResetMemorize = () => {
    setIsActive(false);
    setCurrentIndex(0);
  };

  if (!currentPage) return null;

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View
        style={[styles.topBarWrap, { borderBottomColor: Colors[colorScheme ?? 'light'].border }]}
      >
        <View style={styles.topBarLeft}>
          <MemorizeActions
            hasHydrated={true}
            isActive={isActive}
            isGraded={false}
            onStart={handleStartMemorize}
            onGrade={undefined}
          />
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
          <TopSettingButton mode="memorize" onReset={handleResetMemorize} />
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
                blankIndices={new Set()}
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
