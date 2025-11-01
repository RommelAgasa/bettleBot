import React from "react";
import { StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import Svg, { Circle, Path } from "react-native-svg";

// Steering wheel data output
interface SteeringData {
  angle: number;
  normalizedValue: number;
  direction: "left" | "right" | "center";
}

// Props for steering wheel control
interface SteeringWheelProps {
  size?: number;
  maxRotation?: number;
  sensitivity?: number;
  onSteeringChange?: (data: SteeringData) => void;
  onSteeringStart?: () => void;
  onSteeringEnd?: () => void;
}

// Steering wheel component
export default function SteeringWheel({
  size = 170,
  maxRotation = 135,
  sensitivity = 0.8,
  onSteeringChange,
  onSteeringStart,
  onSteeringEnd,
}: SteeringWheelProps) {
  // Shared values for native animations
  const steeringAngle = useSharedValue(0);
  const lastSentAngle = useSharedValue(0);
  const cumulativeAngle = useSharedValue(0);
  // const lastRotation = useSharedValue(0);

  // Configuration constants
  // const ROTATION_GAIN = 1.0;
  const PAN_GAIN = sensitivity;
  const CENTER_DIRECT_THRESHOLD = 12;
  const INTERP_SMOOTHING = 0.55;
  const SEND_THRESHOLD_DEG = 0.5;
  const MAX_ANGLE = maxRotation;

  // Rotation Gesture - Two-finger rotation (temporarily disabled)
  /*const rotationGesture = Gesture.Rotation()
    .onBegin(() => {
      onSteeringStart?.();
      lastRotation.value = 0;
    })
    .onUpdate((event) => {
      const deltaRad = event.rotation - lastRotation.value;
      lastRotation.value = event.rotation;
      const deltaDeg = (deltaRad * 180) / Math.PI;

      // Scale by rotation gain
      const scaledDeltaDeg = deltaDeg * ROTATION_GAIN;

      // Accumulate and clamp
      let proposed = cumulativeAngle.value + scaledDeltaDeg;
      if (proposed > MAX_ANGLE) cumulativeAngle.value = MAX_ANGLE;
      else if (proposed < -MAX_ANGLE) cumulativeAngle.value = -MAX_ANGLE;
      else cumulativeAngle.value = proposed;

      // Smart interpolation
      const target = cumulativeAngle.value;
      const current = steeringAngle.value;
      let newAngle: number;

      if (Math.abs(target) < CENTER_DIRECT_THRESHOLD) {
        newAngle = target; // Direct movement near center
      } else {
        newAngle = current + (target - current) * INTERP_SMOOTHING;
      }

      steeringAngle.value = newAngle;

      // Threshold-based sending
      if (Math.abs(newAngle - lastSentAngle.value) >= SEND_THRESHOLD_DEG) {
        lastSentAngle.value = newAngle;
        if (onSteeringChange) {
          runOnJS(onSteeringChange)({
            angle: newAngle,
            normalizedValue: newAngle / MAX_ANGLE,
            direction:
              Math.abs(newAngle) < 5
                ? "center"
                : newAngle < 0
                ? "left"
                : "right",
          });
        }
      }
    })
    .onEnd(() => {
      steeringAngle.value = withSpring(0, {
        damping: 14,
        stiffness: 100,
        mass: 1,
      });
      cumulativeAngle.value = 0;
      lastSentAngle.value = 0;
      // lastRotation.value = 0;
      if (onSteeringEnd) {
        runOnJS(onSteeringEnd)();
      }
    });*/

  // Pan Gesture - Single-finger horizontal drag
  const panGesture = Gesture.Pan()
    .onBegin(() => {
      "worklet";
      if (onSteeringStart) {
        runOnJS(onSteeringStart)();
      }
    })
    .onUpdate((event) => {
      "worklet";
      const rawDeltaX = event.translationX;

      // Apply pan gain and clamp
      const baseTargetAngle = rawDeltaX * PAN_GAIN;
      const targetAngle = Math.max(
        -MAX_ANGLE,
        Math.min(MAX_ANGLE, baseTargetAngle)
      );

      // Smart interpolation
      const current = steeringAngle.value;
      let newAngle: number;

      if (Math.abs(targetAngle) < CENTER_DIRECT_THRESHOLD) {
        newAngle = targetAngle;
      } else {
        newAngle = current + (targetAngle - current) * INTERP_SMOOTHING;
      }

      steeringAngle.value = newAngle;
      cumulativeAngle.value = newAngle;

      // Threshold-based sending
      if (Math.abs(newAngle - lastSentAngle.value) >= SEND_THRESHOLD_DEG) {
        lastSentAngle.value = newAngle;
        if (onSteeringChange) {
          runOnJS(onSteeringChange)({
            angle: newAngle,
            normalizedValue: newAngle / MAX_ANGLE,
            direction:
              Math.abs(newAngle) < 5
                ? "center"
                : newAngle < 0
                ? "left"
                : "right",
          });
        }
      }
    })
    .onEnd(() => {
      "worklet";
      steeringAngle.value = withSpring(0, {
        damping: 15,
        stiffness: 120,
        mass: 1,
      });
      cumulativeAngle.value = 0;
      lastSentAngle.value = 0;
      if (onSteeringEnd) {
        runOnJS(onSteeringEnd)();
      }
    });

  // Use only pan gesture for now (simpler, more stable)
  const combinedGesture = panGesture;

  // Animated rotation style
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${steeringAngle.value}deg` }],
  }));

  return (
    <View style={styles.wrapper}>
      <GestureDetector gesture={combinedGesture}>
        <Animated.View
          style={[
            styles.wheel,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
            },
            animatedStyle,
          ]}
        >
          {/* Steering Wheel SVG */}
          <Svg width={size} height={size} viewBox="0 0 160 160" fill="none">
            {/* Outer rim - Orange */}
            <Circle cx="80" cy="80" r="79" fill="#FF880F" />

            {/* Inner circle - White */}
            <Circle cx="80" cy="80" r="67.5" fill="#fff" />

            {/* Top spoke */}
            <Path d="M80 59.412l19.053 33H60.947l19.053-33z" fill="#FF880F" />

            {/* Bottom spoke */}
            <Path d="M81 113h6.25L99.5 92H61l13 21h7z" fill="#FF880F" />

            {/* Right spoke */}
            <Path
              d="M114.933 65.912v17.5l-15.88 9.12-19.053-33 34.933 6.38z"
              fill="#FF880F"
            />

            {/* Left spoke */}
            <Path
              d="M45.578 65.912v17.5l15.88 9.12 19.053-33-34.933 6.38z"
              fill="#FF880F"
            />

            {/* Center cap */}
            <Circle cx="80" cy="80" r="8" fill="#fff" />

            {/* Grip details */}
            <Path
              d="M115.809 65.84v17.5l15.893-3.412v-12.5l-15.893-1.588zM148.191 65.428v17.5l-16.489-3v-12.5l16.489-2zM44.68 66v17l-15.948-3.066V67.436L44.68 66zM10.36 65.007v19l18.37-4.072v-12.5l-18.37-2.428zM81 114h6.25l-2 17H76l-2-17h7zM81 148h7.25l-3-17H76l-3 17h8z"
              fill="#FF880F"
            />
          </Svg>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  wheel: {
    borderRadius: 1000,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.15)",
    elevation: 5,
  },
});

