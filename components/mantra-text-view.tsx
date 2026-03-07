import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { Colors, FONT_MANTRA_400, FONT_MANTRA_600 } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getIndentPx, getLinesForRender } from '@/lib/mantra-format';
import type { Mantra, RenderLineInfo } from '@/types/mantra';

export type GradeDisplayEntry = {
  correctChar: string;
  isCorrect: boolean;
};

export type MantraTextViewProps = {
  mantra: Mantra;
  blankIndices?: Set<number>;
  mode?: 'practice' | 'memorize';
  answers?: Record<number, string>;
  onChangeAnswer?: (index: number, value: string) => void;
  gradeDisplay?: Record<number, GradeDisplayEntry>;
  fontSize?: number;
};

const DEFAULT_FONT_SIZE = 16;

const BOX_BORDER = '#999';
const BOX_BG = '#f8f8f8';
const CORRECT_COLOR = '#2563eb';
const WRONG_COLOR = '#dc2626';

export function getMantraLayoutByFontSize(fontSize: number = DEFAULT_FONT_SIZE) {
  return {
    fontSize,
    charBoxWidth: 21 * 1,
    charBoxHeight: 23 * 1,
    marginBottom: 8 * 1,
  };
}

export default function MantraTextView({
  mantra,
  blankIndices = new Set<number>(),
  mode = 'practice',
  answers,
  onChangeAnswer,
  gradeDisplay,
  fontSize = DEFAULT_FONT_SIZE,
}: MantraTextViewProps) {
  const colorScheme = useColorScheme();
  const textColor = Colors[colorScheme ?? 'light'].text;
  const { charBoxWidth, charBoxHeight, marginBottom } = getMantraLayoutByFontSize(fontSize);
  const lines = getLinesForRender(mantra);

  const renderLine = (lineInfo: RenderLineInfo, lineIndex: number) => {
    const { line, indent, startIndex } = lineInfo;
    const lineChars = line.split('');
    const paddingLeft = getIndentPx(indent, charBoxWidth);
    const isMemorize = mode === 'memorize';

    const elements = lineChars.map((char, i) => {
      const globalIndex = startIndex + i;

      if (blankIndices.has(globalIndex)) {
        if (gradeDisplay?.[globalIndex]) {
          const graded = gradeDisplay[globalIndex];
          return (
            <View
              key={globalIndex}
              style={[
                styles.charBox,
                {
                  width: charBoxWidth,
                  height: charBoxHeight,
                  backgroundColor: BOX_BG,
                },
              ]}
            >
              <Text
                style={[
                  styles.charText,
                  {
                    fontSize,
                    lineHeight: charBoxHeight,
                    fontFamily: FONT_MANTRA_600,
                    color: graded.isCorrect ? CORRECT_COLOR : WRONG_COLOR,
                    width: charBoxWidth,
                  },
                ]}
              >
                {graded.correctChar}
              </Text>
            </View>
          );
        }

        if (isMemorize && onChangeAnswer) {
          const value = answers?.[globalIndex] ?? '';
          return (
            <TextInput
              key={globalIndex}
              value={value}
              maxLength={1}
              onChangeText={(text) => onChangeAnswer(globalIndex, text)}
              style={[
                styles.charBox,
                styles.inputBox,
                {
                  width: charBoxWidth,
                  height: charBoxHeight,
                  backgroundColor: BOX_BG,
                  fontSize,
                  fontFamily: FONT_MANTRA_600,
                  color: textColor,
                },
              ]}
            />
          );
        }

        return (
          <View
            key={globalIndex}
            style={[
              styles.charBox,
              {
                width: charBoxWidth,
                height: charBoxHeight,
                backgroundColor: BOX_BG,
              },
            ]}
          />
        );
      }

      return (
        <View
          key={globalIndex}
          style={[styles.charBoxReadOnly, { width: charBoxWidth, height: charBoxHeight }]}
        >
          <Text
            style={[
              styles.charText,
              {
                fontSize,
                lineHeight: charBoxHeight,
                fontFamily: FONT_MANTRA_400,
                color: textColor,
                width: charBoxWidth,
              },
            ]}
          >
            {char}
          </Text>
        </View>
      );
    });

    return (
      <View key={lineIndex} style={[styles.lineRow, { paddingLeft, marginBottom }]}>
        {elements}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {lines.map((lineInfo, lineIndex) => renderLine(lineInfo, lineIndex))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  lineRow: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  charBox: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: BOX_BORDER,
    borderRadius: 5,
  },
  charBoxReadOnly: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  charText: {
    textAlign: 'center',
  },
  inputBox: {
    textAlign: 'center',
    padding: 0,
  },
});
