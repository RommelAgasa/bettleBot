import React, { useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";

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

  const handleGestureEvent = (event: PanGestureHandlerGestureEvent) => {
    const { translationX: dx, translationY: dy } = event.nativeEvent;

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

    // Update animated value with constrained position
    pan.setValue({ x: newX, y: newY });

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
  };

  const handleGestureEnd = () => {
    // Reset position with animation - less bouncy
    Animated.spring(pan, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
      tension: 40,
      friction: 10,
    }).start();

    // Callback when joystick is released
    if (onStop) {
      onStop();
    }
  };

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

        {/* Inner stick (movable) with PanGestureHandler */}
        <PanGestureHandler
          onGestureEvent={handleGestureEvent}
          onEnded={handleGestureEnd}
          onCancelled={handleGestureEnd}
          simultaneousHandlers={undefined}
        >
          <Animated.View
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
        </PanGestureHandler>
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
