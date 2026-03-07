import { useEffect, useMemo } from 'react';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';

import GradeResultModal from '@/components/grade-result-modal';
import MantraTextView from '@/components/mantra-text-view';
import MemorizeActions from '@/components/memorize-actions';
import PaginationControls from '@/components/pagination-controls';
import ConfirmModal from '@/components/settings/confirm-modal';
import TopSettingButton from '@/components/top-setting-button';
import { Colors } from '@/constants/theme';
import { SHURANGAMA_MANTRA_PAGES } from '@/data/shurangama-mantra';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useMemorizeGrading } from '@/hooks/use-memorize-grading';
import { usePagination } from '@/hooks/use-pagination';
import { createBlankIndices, difficultyToRatio } from '@/lib/mantra-blank';
import { useMemorizeStore } from '@/store/memorize-store';
import { useSettingStore } from '@/store/setting-store';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function MemorizeScreen() {
  const colorScheme = useColorScheme();
  const backgroundColor = Colors[colorScheme ?? 'light'].background;

  const { pageStart, pageEnd, difficulty } = useSettingStore((s) => s.memorize);
  const fontSize = useSettingStore((s) => s.fontSize);
  const ratio = difficultyToRatio[difficulty];

  const selectedPages = useMemo(
    () =>
      SHURANGAMA_MANTRA_PAGES.filter((p) => p.pageNumber >= pageStart && p.pageNumber <= pageEnd),
    [pageStart, pageEnd],
  );

  const {
    isActive,
    blankByPage,
    answersByPage,
    lastPageIndex,
    gradeResult,
    startSession,
    setAnswer,
    setLastPageIndex,
    setGradeResult,
    resetSession,
  } = useMemorizeStore();

  const initialIndex = isActive
    ? Math.min(lastPageIndex, Math.max(0, selectedPages.length - 1))
    : 0;

  const {
    currentIndex: currentPageIndex,
    currentItem: currentPage,
    isFirst,
    isLast,
    goPrev,
    goNext,
    setCurrentIndex,
  } = usePagination({ items: selectedPages, initialIndex });

  const currentAnswers = answersByPage[currentPageIndex] ?? {};

  const handleChangeAnswer = (index: number, value: string) => {
    setAnswer(currentPageIndex, index, value);
  };

  const currentBlankIndicesArray = blankByPage[currentPageIndex] ?? [];
  const currentBlankIndices = new Set<number>(currentBlankIndicesArray);

  const handleStartMemorize = () => {
    const nextBlankByPage: Record<number, number[]> = {};
    selectedPages.forEach((page, index) => {
      const indices = createBlankIndices(page.mantra, ratio);
      nextBlankByPage[index] = Array.from(indices);
    });
    startSession({
      blankByPage: nextBlankByPage,
      initialPageIndex: currentPageIndex,
    });
  };

  const handleResetMemorize = () => {
    resetSession();
    setCurrentIndex(0);
  };

  const {
    totalBlanks,
    filledCount,
    gradeDisplay,
    isGradeConfirmOpen,
    setIsGradeConfirmOpen,
    isResultModalOpen,
    setIsResultModalOpen,
    handleGradeClick,
    handleGradeConfirm,
  } = useMemorizeGrading({
    blankByPage,
    answersByPage,
    selectedPages,
    gradeResult,
    setGradeResult,
    currentPageIndex,
    currentPage: currentPage ?? undefined,
  });

  useEffect(() => {
    if (isActive) {
      setLastPageIndex(currentPageIndex);
    }
  }, [currentPageIndex, isActive, setLastPageIndex]);

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
            isGraded={!!gradeResult}
            onStart={handleStartMemorize}
            onGrade={handleGradeClick}
          />
        </View>
        <View style={styles.topBarCenter}>
          <PaginationControls
            isFirst={isFirst}
            isLast={isLast}
            label={`${currentPage.pageNumber} / 12`}
            onPrev={goPrev}
            onNext={goNext}
          />
        </View>
        <View style={styles.topBarRight}>
          <TopSettingButton mode="memorize" onReset={handleResetMemorize} />
        </View>
      </View>

      <ConfirmModal
        open={isGradeConfirmOpen}
        mode="grade-with-blanks"
        params={{ totalBlanks, filledCount }}
        onConfirm={handleGradeConfirm}
        onClose={() => setIsGradeConfirmOpen(false)}
      />

      {gradeResult && (
        <GradeResultModal
          open={isResultModalOpen}
          onClose={() => setIsResultModalOpen(false)}
          gradeResult={gradeResult}
          pageNumbers={selectedPages.map((p) => p.pageNumber)}
          difficulty={difficulty}
        />
      )}

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
            {isActive ? (
              <MantraTextView
                mantra={currentPage.mantra}
                fontSize={fontSize}
                blankIndices={currentBlankIndices}
                mode="memorize"
                answers={currentAnswers}
                onChangeAnswer={gradeResult ? undefined : handleChangeAnswer}
                gradeDisplay={gradeDisplay}
              />
            ) : (
              <MantraTextView
                mantra={currentPage.mantra}
                fontSize={fontSize}
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
