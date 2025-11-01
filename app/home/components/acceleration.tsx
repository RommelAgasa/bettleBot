import React, { useRef } from "react";
import { Animated, StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

export default function AccelaratorButton() {
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
    console.log("Accelerator button pressed!");
  };

  // LongPress gesture for holdable accelerator
  const accelerateGesture = Gesture.LongPress()
    .minDuration(1) // respond immediately
    .onStart(() => {
      runOnJS(handlePressIn)();
      runOnJS(handlePress)();
    })
    .onEnd(() => runOnJS(handlePressOut)())
    .onFinalize(() => runOnJS(handlePressOut)());

  return (
    <GestureDetector gesture={accelerateGesture}>
      <Animated.View
        style={[styles.wrapper, { transform: [{ scale: scaleAnim }] }]}
      >
        {/* Shadow wrapper for SVG */}
        <Svg width={100} height={140} viewBox="0 0 100 140">
          <Path
            d="M 30 0 
                    L 70 0
                    Q 75 0 75 5
                    L 75 95
                    L 90 115
                    Q 95 120 90 125
                    L 10 125
                    Q 5 120 10 115
                    L 25 95
                    L 25 5
                    Q 25 0 30 0
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
    backgroundColor: "#3D3D3D",
  },
  pauseWrapper: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    top: 30,
  },
  pauseBar: {
    width: 12,
    height: 60,
    backgroundColor: "#FF9E42",
    borderRadius: 6,
    marginHorizontal: 4,
  },
});
