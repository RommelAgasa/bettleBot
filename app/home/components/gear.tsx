import * as Haptics from "expo-haptics";
import React, { useRef, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";

interface GearSelectorProps {
  size?: number;
  onGearChange?: (gear: string) => void;
}

export default function GearSelector({
  size = 160,
  onGearChange,
}: GearSelectorProps) {
  // Gear positions (vertical: top, middle, bottom)
  const gearPositions = [
    { name: "2", y: -55 },
    { name: "1", y: 0 },
    { name: "R", y: 55 },
  ];

  const stickSize = size / 3.5;

  // Current selected gear
  const [selectedGear, setSelectedGear] = useState<number>(1); // Start at Gear 1

  // Animated values for the stick position
  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  // Track the starting position when drag begins
  const startPosition = useRef(0);

  /**
   * Find closest gear position and snap to it
   */
  const findClosestGear = (currentY: number): number => {
    let closestIndex = 1; // Default to Gear 1
    let minDistance = Math.abs(currentY - gearPositions[1].y);

    gearPositions.forEach((gear, index) => {
      const distance = Math.abs(currentY - gear.y);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    return closestIndex;
  };

  /**
   * Snap to gear with animation and haptic feedback
   */
  const snapToGear = (gearIndex: number) => {
    const targetY = gearPositions[gearIndex].y;

    setSelectedGear(gearIndex);

    // Smooth spring animation to snap position - less bouncy
    Animated.spring(pan, {
      toValue: { x: 0, y: targetY },
      useNativeDriver: false,
      tension: 60,
      friction: 12,
    }).start();

    // Haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Notify parent
    if (onGearChange) {
      onGearChange(gearPositions[gearIndex].name);
    }
  };

  const handleGestureStart = () => {
    // Capture the current position when drag starts
    pan.y.stopAnimation((value) => {
      startPosition.current = value;
    });
  };

  const handleGestureEvent = (event: PanGestureHandlerGestureEvent) => {
    const { translationY: dy } = event.nativeEvent;

    // Add translation to starting position (not reset to 0)
    let newY = startPosition.current + dy;

    // Limit movement to max range
    const maxY = gearPositions[gearPositions.length - 1].y;
    const minY = gearPositions[0].y;

    newY = Math.max(minY, Math.min(maxY, newY));

    // Update animated value with constrained position
    pan.setValue({ x: 0, y: newY });

    // Check for magnetic snap while dragging
    gearPositions.forEach((gear, index) => {
      const distance = Math.abs(newY - gear.y);
      if (distance < 25 && selectedGear !== index) {
        // Light haptic when entering snap zone
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    });
  };

  const handleGestureEnd = () => {
    // Get the current animated value
    let currentY = 0;
    pan.y.stopAnimation((value) => {
      currentY = value;
    });

    // Find closest gear based on current position
    const closestIndex = findClosestGear(currentY);

    // Snap to the closest gear (it will stay there)
    snapToGear(closestIndex);
  };

  return (
    <View style={[styles.container, { height: size }]}>
      {/* Gear Labels */}
      <View style={styles.labelsContainer}>
        {gearPositions.map((gear, index) => (
          <Text
            key={index}
            style={[styles.label, selectedGear === index && styles.labelActive]}
          >
            {gear.name}
          </Text>
        ))}
      </View>

      {/* Gear Stick Track */}
      <View style={styles.trackContainer}>
        <View style={[styles.track, { height: size }]}>
          {/* Gear position indicators */}
          {gearPositions.map((gear, index) => (
            <View
              key={index}
              style={[
                styles.positionIndicator,
                {
                  top: size / 2 + gear.y - 2,
                },
                selectedGear === index && styles.positionIndicatorActive,
              ]}
            />
          ))}

          {/* Movable Gear Stick with PanGestureHandler */}
          <PanGestureHandler
            onBegan={handleGestureStart}
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
                  top: size / 2 - stickSize / 2,
                  transform: [{ translateY: pan.y }],
                },
              ]}
            >
              <View style={styles.stickInner} />
            </Animated.View>
          </PanGestureHandler>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  labelsContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
    paddingVertical: 5,
  },
  label: {
    fontSize: 14,
    color: "#999",
    fontWeight: "500",
    textAlign: "right",
    paddingRight: 5,
  },
  labelActive: {
    color: "#FF9E42",
    fontWeight: "700",
    fontSize: 16,
  },
  trackContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  track: {
    width: 60,
    backgroundColor: "#F5F5F5",
    borderRadius: 30,
    borderWidth: 3,
    borderColor: "#DDDDDD",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  positionIndicator: {
    position: "absolute",
    width: 30,
    height: 4,
    backgroundColor: "#DDDDDD",
    borderRadius: 2,
  },
  positionIndicatorActive: {
    backgroundColor: "#FF9E42",
    width: 35,
    height: 5,
  },
  stick: {
    backgroundColor: "#FF9E42",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    // Shadow
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

