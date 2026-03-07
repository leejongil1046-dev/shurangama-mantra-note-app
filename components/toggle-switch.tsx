import { useEffect } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export type ToggleSwitchProps = {
  label: string;
  checked: boolean;
  onChange: (nextChecked: boolean) => void;
  disabled?: boolean;
};

const TRACK_WIDTH = 48;
const TRACK_HEIGHT = 28;
const THUMB_SIZE = 22;
const THUMB_OFF = 3;
const THUMB_ON = TRACK_WIDTH - THUMB_SIZE - 3;
const DURATION = 200;

export default function ToggleSwitch({
  label,
  checked,
  onChange,
  disabled = false,
}: ToggleSwitchProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const progress = useSharedValue(checked ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(checked ? 1 : 0, {
      duration: DURATION,
    });
  }, [checked, progress]);

  const trackAnimatedStyle = useAnimatedStyle(
    () => ({
      backgroundColor: interpolateColor(progress.value, [0, 1], [colors.border, colors.text]),
    }),
    [colors.border, colors.text],
  );

  const thumbAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(progress.value, [0, 1], [THUMB_OFF, THUMB_ON]),
      },
    ],
  }));

  return (
    <Pressable
      onPress={() => !disabled && onChange(!checked)}
      disabled={disabled}
      style={({ pressed }) => [
        styles.wrapper,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
      accessibilityRole="switch"
      accessibilityState={{ checked }}
    >
      <Text style={[styles.label, { color: colors.icon }]}>{label}</Text>
      <Animated.View style={[styles.track, trackAnimatedStyle]}>
        <Animated.View
          style={[styles.thumb, { backgroundColor: colors.background }, thumbAnimatedStyle]}
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.8,
  },
  label: {
    fontSize: 15,
  },
  track: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    justifyContent: 'center',
  },
  thumb: {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    left: 0,
    top: (TRACK_HEIGHT - THUMB_SIZE) / 2,
  },
});
