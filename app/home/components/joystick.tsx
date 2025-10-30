import React, { useRef, useState } from "react";
import { Animated, PanResponder, StyleSheet, View } from "react-native";

interface JoystickProps {
  size?: number;
  onMove?: (data: {
    x: number;
    y: number;
    angle: number;
    distance: number;
  }) => void;
  onStop?: () => void;
}

export default function Joystick({ size = 50, onMove, onStop }: JoystickProps) {
  const radius = size / 2;
  const stickSize = size / 3;
  const maxDistance = radius - stickSize / 2;

  // Animated values for the stick position
  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  // State to track current position
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: () => {
        // Set offset to current value when touch starts
        pan.setOffset({
          x: position.x,
          y: position.y,
        });
      },

      onPanResponderMove: (_, gesture) => {
        const { dx, dy } = gesture;

        // Calculate distance from center
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Limit the movement to the max distance
        let newX = dx;
        let newY = dy;

        if (distance > maxDistance) {
          const angle = Math.atan2(dy, dx);
          newX = Math.cos(angle) * maxDistance;
          newY = Math.sin(angle) * maxDistance;
        }

        // Update animated value
        pan.setValue({ x: newX, y: newY });
        setPosition({ x: newX, y: newY });

        // Calculate angle and normalized distance
        const angle = Math.atan2(newY, newX) * (180 / Math.PI);
        const normalizedDistance = Math.min(distance / maxDistance, 1);

        // Callback with joystick data
        if (onMove) {
          onMove({
            x: newX / maxDistance, // normalized -1 to 1
            y: -newY / maxDistance, // inverted Y (up is positive)
            angle: angle,
            distance: normalizedDistance,
          });
        }
      },

      onPanResponderRelease: () => {
        // Reset position with animation
        pan.flattenOffset();

        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
          speed: 100,
          bounciness: 20,
        }).start();

        setPosition({ x: 0, y: 0 });

        // Callback when joystick is released
        if (onStop) {
          onStop();
        }
      },
    })
  ).current;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Outer circle (base) */}
      <View
        style={[
          styles.base,
          {
            width: size,
            height: size,
            borderRadius: radius,
          },
        ]}
      >
        {/* Direction indicators */}
        <View style={styles.directionalLines}>
          <View style={[styles.line, styles.lineVertical]} />
          <View style={[styles.line, styles.lineHorizontal]} />
        </View>

        {/* Inner stick (movable) */}
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.stick,
            {
              width: stickSize,
              height: stickSize,
              borderRadius: stickSize / 2,
              transform: [{ translateX: pan.x }, { translateY: pan.y }],
            },
          ]}
        >
          <View style={styles.stickInner} />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  base: {
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#DDDDDD",
    // Shadow for depth
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  directionalLines: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  line: {
    position: "absolute",
    backgroundColor: "#DDDDDD",
  },
  lineVertical: {
    width: 2,
    height: "80%",
  },
  lineHorizontal: {
    width: "80%",
    height: 2,
  },
  stick: {
    backgroundColor: "#FF9E42",
    justifyContent: "center",
    alignItems: "center",
    // Shadow for the stick
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  stickInner: {
    width: "40%",
    height: "40%",
    borderRadius: 100,
    backgroundColor: "#FFFFFF",
  },
});
