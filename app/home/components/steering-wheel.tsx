import React, { useRef, useState } from "react";
import { Animated, PanResponder, StyleSheet, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

interface SteeringWheelProps {
  size?: number;
  onRotate?: (angle: number) => void;
  onRelease?: () => void;
}

export default function SteeringWheel({
  size = 200,
  onRotate,
  onRelease,
}: SteeringWheelProps) {
  const rotation = useRef(new Animated.Value(0)).current;
  const [currentAngle, setCurrentAngle] = useState(0);
  const lastAngle = useRef(0);
  const radius = size / 2;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: () => {
        rotation.setOffset(currentAngle);
      },

      onPanResponderMove: (evt, gesture) => {
        // Calculate the angle based on touch position relative to center
        const { moveX, moveY } = gesture;
        const centerX = radius;
        const centerY = radius;

        const dx = moveX - centerX;
        const dy = moveY - centerY;

        let angle = Math.atan2(dy, dx) * (180 / Math.PI);

        // Calculate the difference from last angle
        let diff = angle - lastAngle.current;

        // Handle angle wrapping
        if (diff > 180) diff -= 360;
        if (diff < -180) diff += 360;

        const newAngle = currentAngle + diff;

        // Limit rotation to ±180 degrees
        const limitedAngle = Math.max(-180, Math.min(180, newAngle));

        rotation.setValue(limitedAngle);
        setCurrentAngle(limitedAngle);
        lastAngle.current = angle;

        if (onRotate) {
          onRotate(limitedAngle);
        }
      },

      onPanResponderRelease: () => {
        // Return to center with animation
        rotation.flattenOffset();

        Animated.spring(rotation, {
          toValue: 0,
          useNativeDriver: true,
          speed: 15,
          bounciness: 8,
        }).start();

        setCurrentAngle(0);
        lastAngle.current = 0;

        if (onRelease) {
          onRelease();
        }
      },
    })
  ).current;

  const rotateInterpolate = rotation.interpolate({
    inputRange: [-180, 180],
    outputRange: ["-180deg", "180deg"],
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.wheelContainer,
          {
            width: size,
            height: size,
            transform: [{ rotate: rotateInterpolate }],
          },
        ]}
      >
        <Svg width={size} height={size} viewBox="0 0 200 200">
          {/* Outer rim */}
          <Circle
            cx="100"
            cy="100"
            r="95"
            fill="#F5F5F5"
            stroke="#DDDDDD"
            strokeWidth="3"
          />

          {/* Inner circle */}
          <Circle
            cx="100"
            cy="100"
            r="30"
            fill="#FF9E42"
            stroke="#E88A2F"
            strokeWidth="2"
          />

          {/* Spokes */}
          <Path
            d="M 100 100 L 100 20"
            stroke="#CCCCCC"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <Path
            d="M 100 100 L 180 100"
            stroke="#CCCCCC"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <Path
            d="M 100 100 L 100 180"
            stroke="#CCCCCC"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <Path
            d="M 100 100 L 20 100"
            stroke="#CCCCCC"
            strokeWidth="8"
            strokeLinecap="round"
          />

          {/* Grip indicators */}
          <Circle cx="100" cy="15" r="8" fill="#FF9E42" />
          <Circle cx="185" cy="100" r="8" fill="#FF9E42" />
          <Circle cx="100" cy="185" r="8" fill="#FF9E42" />
          <Circle cx="15" cy="100" r="8" fill="#FF9E42" />
        </Svg>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  wheelContainer: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
});
