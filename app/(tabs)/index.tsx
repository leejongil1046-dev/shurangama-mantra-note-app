import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Colors, FONT_MANTRA_400, FONT_MANTRA_600, FONT_MANTRA_700 } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const QUOTE = '"';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const muted = colorScheme === 'dark' ? '#9BA1A6' : '#687076';
  const mutedLight = colorScheme === 'dark' ? '#6E7378' : '#6b7280';

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* 가운데 캐치프레이즈 섹션 */}
      <View style={styles.hero}>
        <Text style={[styles.heroSub, { color: muted }]}>DAEBULJEONG-SU NUNGEOM SINJU</Text>
        <Text style={[styles.heroTitle, { color: colors.text }, { fontFamily: FONT_MANTRA_600 }]}>
          능엄주를 천천히, 끝까지
        </Text>
        <Text style={[styles.heroDesc, { color: muted }]}>
          능엄주는 동아시아 불교에서 오랫동안 독송되어 온 긴 다라니입니다. 한 번 입에 익으면 평생을
          함께하지만, 분량이 길고 흐름이 복잡해 처음부터 끝까지 혼자 외우기란 쉽지 않습니다.
        </Text>
        <View style={styles.heroMeta}>
          <Text style={[styles.heroMetaText, { color: mutedLight }]}>
            페이지별 읽기 · 빈칸 연습 · 단계적 암기
          </Text>
          <Text style={[styles.heroMetaText, { color: mutedLight }]}>
            조금씩, 그러나 꾸준히 익힐 수 있도록 돕는 학습형 앱입니다.
          </Text>
        </View>
      </View>

      {/* 하단 정보/소개 섹션 */}
      <View style={styles.section}>
        <Block
          title="능엄주는 어떤 다라니일까?"
          colors={colors}
          muted={muted}
          fontMantra={FONT_MANTRA_700}
        >
          능엄주는 동아시아 불교에서 널리 독송되는 긴 다라니로, 전통적으로 『능엄경』의 맥락과 함께
          전해져 왔습니다. 여러 사찰의 아침 예불과 일상 수행 속에서 보호와 정화의 의미로 독송되어 온
          텍스트이기도 합니다.
        </Block>

        <Block
          title="왜 따로 연습 도구가 필요할까?"
          colors={colors}
          muted={muted}
          fontMantra={FONT_MANTRA_700}
        >
          {`능엄주는 분량이 길고 반복 구조가 많아, 처음에는 어디까지 외웠는지 스스로 점검하기가 어렵습니다. 종이책이나 PDF만으로는 ${QUOTE}어느 구간을, 몇 번이나 틀렸는지${QUOTE} 감을 잡기 힘들고, 다시 처음부터 반복하게 되는 경우가 많습니다.`}
        </Block>

        <Block
          title="이 앱에서 할 수 있는 것"
          colors={colors}
          muted={muted}
          fontMantra={FONT_MANTRA_700}
        >
          <View style={styles.list}>
            <Bullet text="능엄주를 페이지별로 나누어 필요한 구간만 집중해서 읽기" colors={colors} />
            <Bullet text="앞뒤 페이지를 오가며 전체 흐름 속에서 반복 연습하기" colors={colors} />
            <Bullet text="연습하기" colors={colors} bold />
            <View style={styles.nestedList}>
              <Bullet
                text="난이도에 따라 빈칸을 만들고, 탭해서 정답을 보며 반복해서 익히기"
                colors={colors}
              />
            </View>
            <Bullet text="암기하기" colors={colors} bold />
            <View style={styles.nestedList}>
              <Bullet text="같은 난이도로 빈칸을 만들고 직접 입력한 뒤 채점하기" colors={colors} />
              <Bullet
                text="페이지별·전체 정답률 확인, 맞은 글자는 파란색·틀린 글자는 빨간색으로 다시 보기"
                colors={colors}
              />
            </View>
          </View>
        </Block>

        <Block title="이 앱의 목표" colors={colors} muted={muted} fontMantra={FONT_MANTRA_700}>
          이 앱은 능엄주를 처음 접하는 사람도 전체 흐름을 따라 읽고, 빈칸 연습과 암기를 통해
          단계적으로 익힐 수 있도록 돕는 학습형 도구입니다. 전통적으로 이어져 온 독송을 대신하려는
          것이 아니라, 각자의 자리에서 차분히 익혀 갈 수 있는 작은 보조 수단이 되는 것을 목표로
          합니다.
        </Block>
      </View>
    </ScrollView>
  );
}

function Block({
  title,
  children,
  colors,
  muted,
  fontMantra,
}: {
  title: string;
  children: React.ReactNode;
  colors: (typeof Colors)['light'];
  muted: string;
  fontMantra: string;
}) {
  return (
    <View style={styles.block}>
      <Text style={[styles.blockTitle, { color: colors.text }, { fontFamily: fontMantra }]}>
        {title}
      </Text>
      {typeof children === 'string' ? (
        <Text style={[styles.blockBody, { color: muted }, { fontFamily: FONT_MANTRA_400 }]}>
          {children}
        </Text>
      ) : (
        <View>
          {React.Children.toArray(children).map((child, i) =>
            typeof child === 'string' ? (
              <Text
                key={i}
                style={[styles.blockBody, { color: muted }, { fontFamily: FONT_MANTRA_400 }]}
              >
                {child}
              </Text>
            ) : (
              <React.Fragment key={i}>{child}</React.Fragment>
            ),
          )}
        </View>
      )}
    </View>
  );
}

function Bullet({
  text,
  colors,
  bold,
}: {
  text: string;
  colors: (typeof Colors)['light'];
  bold?: boolean;
}) {
  return (
    <View style={styles.bulletRow}>
      <Text style={[styles.bullet, { color: colors.text }]}>•</Text>
      <Text
        style={[
          styles.bulletText,
          { color: colors.text },
          { fontFamily: bold ? FONT_MANTRA_700 : FONT_MANTRA_400 },
        ]}
      >
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    maxWidth: 800,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 48,
  },
  hero: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 16,
  },
  heroSub: {
    fontSize: 10,
    letterSpacing: 3,
  },
  heroTitle: {
    fontSize: 24,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  heroDesc: {
    fontSize: 13,
    lineHeight: 22,
    textAlign: 'center',
    paddingHorizontal: 8,
    fontFamily: FONT_MANTRA_400,
  },
  heroMeta: {
    marginTop: 8,
    gap: 4,
    alignItems: 'center',
  },
  heroMetaText: {
    fontSize: 11,
    textAlign: 'center',
  },
  section: {
    marginTop: 32,
    gap: 28,
  },
  block: {
    gap: 10,
  },
  blockTitle: {
    fontSize: 16,
  },
  blockBody: {
    fontSize: 13,
    lineHeight: 22,
  },
  list: {
    gap: 6,
  },
  nestedList: {
    paddingLeft: 16,
    gap: 4,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  bullet: {
    fontSize: 13,
    lineHeight: 22,
  },
  bulletText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 22,
  },
});
