import { useEffect, useMemo, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';

import MantraTextView from '@/components/mantra-text-view';
import PaginationControls from '@/components/pagination-controls';
import SettingModal from '@/components/settings/setting-modal';
import TopSettingButton from '@/components/top-setting-button';
import ToggleSwitch from '@/components/toggle-switch';
import { Colors } from '@/constants/theme';
import { SHURANGAMA_MANTRA_PAGES } from '@/data/shurangama-mantra';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { createBlankIndices, difficultyToRatio } from '@/lib/mantra-blank';
import { useSettingStore } from '@/store/setting-store';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function PracticeScreen() {
  const colorScheme = useColorScheme();
  const backgroundColor = Colors[colorScheme ?? 'light'].background;
  const [pageIndex, setPageIndex] = useState(0);
  const [blankEnabled, setBlankEnabled] = useState(false);
  const [settingOpen, setSettingOpen] = useState(false);

  const { pageStart, pageEnd, difficulty } = useSettingStore((s) => s.practice);

  const filteredPages = useMemo(() => {
    return SHURANGAMA_MANTRA_PAGES.filter(
      (p) => p.pageNumber >= pageStart && p.pageNumber <= pageEnd,
    );
  }, [pageStart, pageEnd]);

  useEffect(() => {
    setPageIndex((i) => Math.min(i, Math.max(0, filteredPages.length - 1)));
  }, [filteredPages.length]);

  const totalInRange = filteredPages.length;
  const safeIndex = Math.min(pageIndex, Math.max(0, totalInRange - 1));
  const current = filteredPages[safeIndex];
  const isFirst = safeIndex === 0;
  const isLast = safeIndex === totalInRange - 1;

  const blankIndices = useMemo(() => {
    if (!blankEnabled || !current) return new Set<number>();
    return createBlankIndices(current.mantra, difficultyToRatio[difficulty]);
  }, [blankEnabled, current, difficulty]);

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
            label={current ? `${current.pageNumber} / ${totalInRange}` : '0 / 0'}
            onPrev={() => setPageIndex((i) => Math.max(0, i - 1))}
            onNext={() =>
              setPageIndex((i) => Math.min(totalInRange - 1, i + 1))
            }
          />
        </View>
        <View style={styles.paginationRight}>
          <TopSettingButton
            onReset={() => {
              setPageIndex(0);
              setBlankEnabled(false);
            }}
            onOpenSettings={() => setSettingOpen(true)}
            resetConfirmMessage="연습을 초기화하시겠습니까? (첫 페이지, 빈칸 해제)"
          />
        </View>
      </View>

      <SettingModal
        open={settingOpen}
        mode="practice"
        onClose={() => setSettingOpen(false)}
      />

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
            {current && (
              <MantraTextView
                mantra={current.mantra}
                fontSize={16}
                blankIndices={blankIndices}
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
