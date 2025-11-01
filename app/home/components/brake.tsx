import React, { useRef } from "react";
import { Animated, StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

export default function BrakeButton() {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    console.log("Brake button pressed!");
  };

  // LongPress gesture for brake (same as acceleration for consistency)
  const brakeGesture = Gesture.LongPress()
    .minDuration(1) // respond immediately
    .onStart(() => {
      runOnJS(handlePressIn)();
      runOnJS(handlePress)();
    })
    .onEnd(() => runOnJS(handlePressOut)())
    .onFinalize(() => runOnJS(handlePressOut)());

  return (
    <GestureDetector gesture={brakeGesture}>
      <Animated.View
        style={[styles.wrapper, { transform: [{ scale: scaleAnim }] }]}
      >
        {/* Shadow wrapper for SVG */}
        <Svg width={110} height={90} viewBox="0 0 120 90">
          <Path
            d="M 15 0 
                 L 105 0 
                 Q 115 0 120 10
                 L 120 15
                 L 110 75 
                 Q 108 85 98 85
                 L 22 85 
                 Q 12 85 10 75
                 L 0 15
                 L 0 10
                 Q 5 0 15 0
                 Z"
            fill="#e4e0e0ff"
          />
        </Svg>
        {/* Pause bars */}
        <Animated.View style={styles.pauseWrapper}>
          <Animated.View style={styles.pauseBar} />
          <Animated.View style={styles.pauseBar} />
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  shadowWrapper: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    borderRadius: 15,
    backgroundColor: "#3D3D3D",
  },
  pauseWrapper: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  pauseBar: {
    width: 16,
    height: 45,
    backgroundColor: "#FF9E42",
    borderRadius: 8,
    marginHorizontal: 6,
  },
});

