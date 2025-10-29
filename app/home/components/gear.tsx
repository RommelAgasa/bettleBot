import * as Haptics from "expo-haptics";
import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    GestureResponderEvent,
    PanResponder,
    PanResponderGestureState,
    PanResponderInstance,
    StyleSheet,
    Text,
    View,
} from "react-native";

interface GearSelectorProps {
  onGearChange?: (gear: string) => void;
}

export default function GearSelector({ onGearChange }: GearSelectorProps) {
  // Gear options in visual order (top to bottom)
  const positions = ["Gear 2", "Gear 1", "Reverse"];
  const slotHeight = 67; // slightly smaller slot height for tighter spacing

  // Initial gear index (Gear 1)
  const [selectedIndex, setSelectedIndex] = useState<number>(1);

  // Animated value for vertical position of the handle
  const translateY = useRef(new Animated.Value(0)).current;

  // Tracks the current drag position (not animated)
  const panY = useRef(0);

  // Sync initial gear position visually on mount
  useEffect(() => {
    translateY.setValue(selectedIndex * slotHeight);
  }, []);

  // Change gear and animate handle to new position
  const changeGear = (index: number) => {
    if (index < 0 || index >= positions.length) return;

    setSelectedIndex(index);

    Animated.spring(translateY, {
      toValue: index * slotHeight,
      damping: 12,
      mass: 1,
      stiffness: 100,
      overshootClamping: false,
      useNativeDriver: true,
    }).start();

    // Trigger haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Notify parent component
    if (onGearChange) onGearChange(positions[index]);
  };

  // PanResponder handles drag gestures
  const panResponder: PanResponderInstance = useRef(
    PanResponder.create({
      // Only respond to vertical drags
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dy) > 10,

      // Update handle position during drag
      onPanResponderMove: (
        _: GestureResponderEvent,
        gesture: PanResponderGestureState
      ) => {
        const newY = gesture.dy + selectedIndex * slotHeight;

        // Clamp movement within bounds (adjusted to avoid clipping bottom)
        if (newY >= 0 && newY <= (positions.length - 1) * slotHeight) {
          panY.current = newY;
          translateY.setValue(newY);
        }
      },

      // Decide final gear on release
      onPanResponderRelease: (
        _: GestureResponderEvent,
        gesture: PanResponderGestureState
      ) => {
        const currentPosition = selectedIndex * slotHeight;
        const newY = gesture.dy + currentPosition;
        const velocity = gesture.vy;
        const dragDistance = gesture.dy;
        const dragThreshold = 35; // Increase this to require more drag
        const velocityThreshold = 1.2; // Require faster swipe to override

        // Ignore micro-drags (snap back to current gear)
        if (Math.abs(dragDistance) < dragThreshold) {
          Animated.spring(translateY, {
            toValue: currentPosition,
            damping: 12,
            stiffness: 100,
            useNativeDriver: true,
          }).start();
          return;
        }

        // Estimate target gear index based on drag and velocity
        let targetIndex = Math.round(newY / slotHeight);

        if (Math.abs(velocity) > velocityThreshold) {
          targetIndex =
            velocity > 0
              ? Math.ceil(newY / slotHeight)
              : Math.floor(newY / slotHeight);
        }

        // Clamp index to valid range
        targetIndex = Math.max(0, Math.min(targetIndex, positions.length - 1));

        // Apply gear change
        changeGear(targetIndex);
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      {/* Gear labels on the left */}
      <View style={styles.labelsContainer}>
        {positions.map((pos, i) => (
          <View key={i} style={styles.labelSlot}>
            <Text
              style={[
                styles.label,
                selectedIndex === i && styles.labelActive,
              ]}
            >
              {pos}
            </Text>
          </View>
        ))}
      </View>

      {/* Slider track and handle */}
      <View style={styles.sliderWrapper}>
        <View style={styles.sliderTrack}>
          <Animated.View
            {...panResponder.panHandlers}
            style={[styles.sliderHandle, { transform: [{ translateY }] }]}
          >
            {/* Orange oval inside the handle */}
            <View style={styles.handleOval} />
          </Animated.View>
        </View>
      </View>
    </View>
  );
}

// Styles for layout and visuals
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },

  labelsContainer: {
    flexDirection: "column",
    justifyContent: "space-around",
    height: 200, // ✅ reduced for tighter spacing (still safe for bottom oval)
  },

  labelSlot: {
    height: 67,
    justifyContent: "center",
  },

  label: {
    fontSize: 18,
    color: "#999",
    fontWeight: "500",
    letterSpacing: 0.5,
  },

  labelActive: {
    color: "#FF9E42",
    fontWeight: "700",
  },

  sliderWrapper: {
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },

  sliderTrack: {
    width: 70,
    height: 200, // ✅ compact height for smooth oval visibility
    backgroundColor: "#e8e8e8",
    borderRadius: 40,
    justifyContent: "flex-start",
    alignItems: "center",
    overflow: "hidden", // prevents oval from overflowing
  },

  sliderHandle: {
    width: 70,
    height: 70,
    borderRadius: 40,
    backgroundColor: "#e8e8e8",
    position: "absolute",
    top: 0,
    justifyContent: "center",
    alignItems: "center",
  },

  handleOval: {
    width: 45, // slightly narrower than height to create oval shape
    height: 55, // taller to get that “oval” shape
    borderRadius: 30, // rounded but not perfectly circular
    backgroundColor: "#FF9E42",
  },
});
