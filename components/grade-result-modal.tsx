import { Modal, ScrollView, StyleSheet, Text, View } from 'react-native';

import ModalActionButton from '@/components/settings/modal-action-button';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { accuracy, type GradeResult } from '@/lib/grade-memorize';
import type { Difficulty } from '@/store/setting-store';

const difficultyLabel: Record<Difficulty, string> = {
  easy: '하',
  medium: '중',
  hard: '상',
};

const COLUMN_WIDTHS = { page: 72, num: 44, totalChars: 88 };

type GradeResultModalProps = {
  open: boolean;
  onClose: () => void;
  gradeResult: GradeResult;
  pageNumbers: number[];
  difficulty: Difficulty;
};

export default function GradeResultModal({
  open,
  onClose,
  gradeResult,
  pageNumbers,
  difficulty,
}: GradeResultModalProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  if (!open) return null;

  const { perPage, total } = gradeResult;
  const pageIndices = Object.keys(perPage)
    .map(Number)
    .sort((a, b) => a - b);

  const cellNum = (value: number | undefined) => (
    <Text style={[styles.cellRight, { color: colors.text }]}>{value ?? '-'}</Text>
  );
  const cellCorrect = (value: number) => (
    <Text style={[styles.cellRight, styles.correct]}>{value}</Text>
  );
  const cellWrong = (value: number) => (
    <Text style={[styles.cellRight, styles.wrong]}>{value}</Text>
  );

  return (
    <Modal visible={open} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View
          style={[
            styles.panel,
            {
              backgroundColor: colors.background,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.title, { color: colors.text }]}>채점 결과</Text>
          <Text style={[styles.sub, { color: colors.icon }]}>
            난이도: {difficultyLabel[difficulty]}
          </Text>

          <ScrollView
            style={styles.tableScroll}
            showsVerticalScrollIndicator={true}
            nestedScrollEnabled
          >
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={true}
              contentContainerStyle={styles.tableWrap}
            >
              <View style={styles.table}>
                <View style={[styles.row, styles.headerRow, { borderBottomColor: colors.border }]}>
                  <Text style={[styles.cellPage, { color: colors.icon }]}>페이지</Text>
                  <Text style={[styles.cellTotalChars, { color: colors.icon }]} numberOfLines={1}>
                    전체 글자수
                  </Text>
                  <Text style={[styles.cellNum, { color: colors.icon }]}>빈칸</Text>
                  <Text style={[styles.cellNum, { color: colors.icon }]}>맞춤</Text>
                  <Text style={[styles.cellNum, { color: colors.icon }]}>틀림</Text>
                  <Text style={[styles.cellNum, { color: colors.icon }]}>정답률</Text>
                </View>
                {pageIndices.map((pageIndex) => {
                  const stats = perPage[pageIndex];
                  const pageNumber = pageNumbers[pageIndex] ?? pageIndex + 1;
                  const pct = accuracy(stats.correct, stats.blanks);
                  return (
                    <View
                      key={pageIndex}
                      style={[styles.row, styles.dataRow, { borderBottomColor: colors.border }]}
                    >
                      <Text style={[styles.cellPage, { color: colors.text }]}>
                        {pageNumber}페이지
                      </Text>
                      <Text style={[styles.cellTotalChars, { color: colors.text }]}>
                        {stats.totalChars ?? '-'}
                      </Text>
                      {cellNum(stats.blanks)}
                      {cellCorrect(stats.correct)}
                      {cellWrong(stats.wrong)}
                      <Text style={[styles.cellRight, { color: colors.text }]}>{pct}%</Text>
                    </View>
                  );
                })}
                <View style={[styles.row, styles.totalRow, { borderTopColor: colors.border }]}>
                  <Text style={[styles.cellPage, styles.totalText, { color: colors.text }]}>
                    전체
                  </Text>
                  <Text style={[styles.cellTotalChars, styles.totalText, { color: colors.text }]}>
                    {total.totalChars ?? '-'}
                  </Text>
                  {cellNum(total.blanks)}
                  {cellCorrect(total.correct)}
                  {cellWrong(total.wrong)}
                  <Text style={[styles.cellRight, styles.totalText, { color: colors.text }]}>
                    {accuracy(total.correct, total.blanks)}%
                  </Text>
                </View>
              </View>
            </ScrollView>
          </ScrollView>

          <View style={styles.actions}>
            <ModalActionButton label="닫기" onPress={onClose} variant="primary" />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  panel: {
    width: '100%',
    maxWidth: 420,
    maxHeight: '80%',
    borderRadius: 12,
    borderWidth: 1,
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  sub: {
    fontSize: 14,
    marginBottom: 16,
  },
  tableScroll: {
    maxHeight: 280,
  },
  tableWrap: {
    paddingBottom: 8,
    paddingRight: 8,
  },
  table: {
    minWidth: 320,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  headerRow: {
    borderBottomWidth: 1,
  },
  dataRow: {
    borderBottomWidth: 1,
  },
  totalRow: {
    borderTopWidth: 2,
    fontWeight: '600',
  },
  totalText: {
    fontWeight: '600',
  },
  cellPage: {
    width: COLUMN_WIDTHS.page,
    fontSize: 13,
  },
  cellTotalChars: {
    width: COLUMN_WIDTHS.totalChars,
    fontSize: 13,
    textAlign: 'right',
  },
  cellNum: {
    width: COLUMN_WIDTHS.num + 20,
    fontSize: 13,
    textAlign: 'right',
  },
  cellRight: {
    width: COLUMN_WIDTHS.num + 20,
    fontSize: 13,
    textAlign: 'right',
  },
  correct: {
    color: '#2563eb',
  },
  wrong: {
    color: '#dc2626',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
});
