import React, { useCallback, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import Svg, { Circle, Path } from "react-native-svg";

/**
 * Steering wheel data output interface
 * Following Interface Segregation Principle - only expose what's needed
 */
interface SteeringData {
  angle: number; // Current rotation angle in degrees
  normalizedValue: number; // Normalized value between -1 and 1
  direction: "left" | "right" | "center";
}

/**
 * Props interface following Dependency Inversion Principle
 * Depend on abstractions (callbacks) not concrete implementations
 */
interface SteeringWheelProps {
  size?: number;
  maxRotation?: number; // Maximum rotation in degrees
  sensitivity?: number; // Control responsiveness (0.1 = slow, 2.0 = fast)
  onSteeringChange?: (data: SteeringData) => void;
  onSteeringStart?: () => void;
  onSteeringEnd?: () => void;
}

/**
 * Configuration object following Single Responsibility Principle
 * Separate configuration concerns from component logic
 */
interface SteeringConfig {
  maxRotation: number;
  sensitivity: number; // How responsive the wheel is
  returnSpeed: number; // How fast it returns to center
  deadZone: number; // Minimum angle before registering as left/right
}

/**
 * SteeringWheel Component
 *
 * Design Patterns Applied:
 * - Single Responsibility: Handles only steering wheel interaction
 * - Open/Closed: Extensible through props, closed for modification
 * - Liskov Substitution: Can be replaced with any control component
 * - Interface Segregation: Clean, focused interfaces
 * - Dependency Inversion: Depends on callback abstractions
 *
 * Additional Patterns:
 * - Strategy Pattern: Configurable behavior through config object
 * - Observer Pattern: Callbacks notify parent of state changes
 */
export default function SteeringWheel({
  size = 170,
  maxRotation = 135,
  sensitivity = 0.8, // Default: 0.8 for smooth, controlled steering
  onSteeringChange,
  onSteeringStart,
  onSteeringEnd,
}: SteeringWheelProps) {
  // Configuration object (Strategy Pattern)
  // useMemo to prevent recreation on every render
  const config = React.useMemo<SteeringConfig>(
    () => ({
      maxRotation,
      sensitivity, // Use prop value
      returnSpeed: 40,
      deadZone: 5,
    }),
    [maxRotation, sensitivity]
  );

  // Animation state
  const rotation = useRef(new Animated.Value(0)).current;
  const previousAngle = useRef(0);

  /**
   * Calculate steering direction based on angle
   * Single Responsibility: Pure function for direction calculation
   */
  const calculateDirection = useCallback(
    (angle: number): "left" | "right" | "center" => {
      if (Math.abs(angle) < config.deadZone) return "center";
      return angle < 0 ? "left" : "right";
    },
    [config.deadZone]
  );

  /**
   * Create steering data object
   * Single Responsibility: Data transformation
   */
  const createSteeringData = useCallback(
    (angle: number): SteeringData => ({
      angle,
      normalizedValue: angle / config.maxRotation,
      direction: calculateDirection(angle),
    }),
    [config.maxRotation, calculateDirection]
  );

  /**
   * Handle gesture start
   * Observer Pattern: Notify parent
   */
  const handleGestureStart = useCallback(() => {
    rotation.stopAnimation((value) => {
      previousAngle.current = value;
    });
    onSteeringStart?.();
  }, [rotation, onSteeringStart]);

  /**
   * Handle pan gesture movement
   * Strategy Pattern: Uses config to determine behavior
   */
  const handleGestureEvent = useCallback(
    (event: PanGestureHandlerGestureEvent) => {
      const { translationX } = event.nativeEvent;

      // Apply sensitivity and calculate new angle
      let newAngle = previousAngle.current + translationX * config.sensitivity;

      // Constrain to max rotation
      newAngle = Math.max(
        -config.maxRotation,
        Math.min(config.maxRotation, newAngle)
      );

      // Update animation value
      rotation.setValue(newAngle);

      // Notify parent with structured data
      if (onSteeringChange) {
        const steeringData = createSteeringData(newAngle);
        onSteeringChange(steeringData);
      }
    },
    [rotation, config, onSteeringChange, createSteeringData]
  );

  /**
   * Handle gesture end - return to center
   * Strategy Pattern: Uses config for return animation
   */
  const handleGestureEnd = useCallback(() => {
    // Animate back to center
    Animated.spring(rotation, {
      toValue: 0,
      tension: config.returnSpeed,
      friction: 12,
      useNativeDriver: true,
    }).start();

    // Reset previous angle
    previousAngle.current = 0;

    // Notify parent
    if (onSteeringChange) {
      const centerData = createSteeringData(0);
      onSteeringChange(centerData);
    }
    onSteeringEnd?.();
  }, [rotation, config, onSteeringChange, onSteeringEnd, createSteeringData]);

  /**
   * Interpolate rotation value to rotation string
   * Presentation logic separated from business logic
   */
  const spin = rotation.interpolate({
    inputRange: [-config.maxRotation, config.maxRotation],
    outputRange: [`-${config.maxRotation}deg`, `${config.maxRotation}deg`],
  });

  return (
    <View style={styles.wrapper}>
      <PanGestureHandler
        onBegan={handleGestureStart}
        onGestureEvent={handleGestureEvent}
        onEnded={handleGestureEnd}
        onCancelled={handleGestureEnd}
      >
        <Animated.View
          style={[
            styles.wheel,
            {
              width: size,
              height: size,
              transform: [{ rotate: spin }],
            },
          ]}
        >
          {/* Steering Wheel SVG - Responsive to size prop */}
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

            {/* Center cap - White (centered at 80, 80) */}
            <Circle cx="80" cy="80" r="8" fill="#fff" />

            {/* Grip details on rim */}
            <Path
              d="M115.809 65.84v17.5l15.893-3.412v-12.5l-15.893-1.588zM148.191 65.428v17.5l-16.489-3v-12.5l16.489-2zM44.68 66v17l-15.948-3.066V67.436L44.68 66zM10.36 65.007v19l18.37-4.072v-12.5l-18.37-2.428zM81 114h6.25l-2 17H76l-2-17h7zM81 148h7.25l-3-17H76l-3 17h8z"
              fill="#FF880F"
            />
          </Svg>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
}

/**
 * Styles following separation of concerns
 * Keep styling logic separate from component logic
 */
const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  wheel: {
    borderRadius: 1000,
    alignItems: "center",
    justifyContent: "center",
    // Transparent background - SVG handles its own colors
    backgroundColor: "transparent",
    // Shadow for depth
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
});

