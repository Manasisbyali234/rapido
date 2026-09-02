import React, { useRef } from 'react';
import { View, Text, Animated, PanResponder, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../theme/theme';

const TRACK_WIDTH = Dimensions.get('window').width - 48;
const THUMB_SIZE = 56;
const SWIPE_RANGE = TRACK_WIDTH - THUMB_SIZE - 8;

export default function SwipeButton({ label = 'Swipe to accept', onSwipeSuccess, color = colors.success }) {
  const pan = useRef(new Animated.Value(0)).current;
  const completed = useRef(false);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        const x = Math.max(0, Math.min(gesture.dx, SWIPE_RANGE));
        pan.setValue(x);
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx >= SWIPE_RANGE * 0.85 && !completed.current) {
          completed.current = true;
          Animated.timing(pan, {
            toValue: SWIPE_RANGE,
            duration: 120,
            useNativeDriver: false,
          }).start(() => {
            onSwipeSuccess && onSwipeSuccess();
          });
        } else {
          Animated.spring(pan, {
            toValue: 0,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  const bgOpacity = pan.interpolate({
    inputRange: [0, SWIPE_RANGE],
    outputRange: [1, 0.25],
  });

  return (
    <View style={[styles.track, { backgroundColor: color + '22', borderColor: color }]}>
      <Animated.Text style={[styles.trackLabel, { color, opacity: bgOpacity }]}>{label}</Animated.Text>
      <Animated.View
        {...panResponder.panHandlers}
        style={[styles.thumb, { backgroundColor: color, transform: [{ translateX: pan }] }]}
      >
        <Ionicons name="chevron-forward" size={24} color="#fff" />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: TRACK_WIDTH,
    height: THUMB_SIZE + 8,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  trackLabel: {
    fontSize: 15,
    fontWeight: '700',
    position: 'absolute',
    alignSelf: 'center',
  },
  thumb: {
    position: 'absolute',
    left: 4,
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
