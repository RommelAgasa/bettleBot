import { useRef, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { State, TapGestureHandler } from "react-native-gesture-handler";
import Svg, { Path } from "react-native-svg";

export default function ClawButton() {
  // Toggle state - true = closed, false = open
  const [isClawClosed, setIsClawClosed] = useState(false);

  // Create animated scale value
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityOpen = useRef(new Animated.Value(1)).current;
  const opacityClosed = useRef(new Animated.Value(0)).current;

  const handleGestureEvent = (event: any) => {
    const { state } = event.nativeEvent;

    // Only handle on tap end
    if (state === State.END) {
      // Scale animation for press feedback
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 0.9,
          useNativeDriver: true,
          speed: 50,
          bounciness: 5,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          speed: 30,
          bounciness: 5,
        }),
      ]).start();

      // Toggle the claw state
      const newState = !isClawClosed;
      setIsClawClosed(newState);

      // Animate to new state
      if (newState) {
        // Close claw
        Animated.parallel([
          Animated.timing(opacityOpen, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(opacityClosed, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }),
        ]).start();
      } else {
        // Open claw
        Animated.parallel([
          Animated.timing(opacityOpen, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(opacityClosed, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
          }),
        ]).start();
      }
    }
  };

  return (
    <TapGestureHandler
      onHandlerStateChange={handleGestureEvent}
      shouldCancelWhenOutside={false}
    >
      <Animated.View style={styles.iconWrapper}>
        <Animated.View
          style={[styles.svgContainer, { transform: [{ scale: scaleAnim }] }]}
        >
          <View style={styles.circleBackground} />
          <Animated.View style={{ position: "absolute", opacity: opacityOpen }}>
            <Svg width={90} height={90} viewBox="24 23 77 78">
              <Path
                d="M34.653 67.413l8.444 11.227c4.233 5.63 12.268 6.676 17.803 2.319l-5.674-8.603h-3.338a10.975 10.975 0 01-10.072-6.614l-.041-.096a11.294 11.294 0 01-.4-7.906l1.242-3.914-2.521-9.926-5.328 6.883a13.707 13.707 0 00-.115 16.63zM90.147 67.413L81.703 78.64c-4.234 5.63-12.269 6.676-17.803 2.319l5.674-8.603h3.338a10.975 10.975 0 0010.071-6.614l.042-.096a11.294 11.294 0 00.4-7.906l-1.242-3.914 2.521-9.926 5.328 6.883a13.707 13.707 0 01.115 16.63z"
                fill="#FF9E42"
              />
            </Svg>
          </Animated.View>

          <Animated.View
            style={{ position: "absolute", opacity: opacityClosed }}
          >
            <Svg width={90} height={90} viewBox="24 23 77 78">
              <Path
                d="M45.251 56.764l1.517 13.966c.76 7.003 7.131 12.01 14.115 11.095l-.478-10.294-2.868-1.707a10.975 10.975 0 01-5.274-10.833l.013-.104a11.294 11.294 0 013.698-7l3.069-2.727 2.908-9.82-8.098 3.191a13.707 13.707 0 00-8.602 14.233zM80.418 56.858l-1.64 13.953c-.823 6.995-7.237 11.946-14.213 10.97l.569-10.29 2.883-1.681a10.975 10.975 0 005.37-10.787l-.012-.104a11.294 11.294 0 00-3.637-7.032l-3.044-2.754-2.821-9.846 8.07 3.263a13.708 13.708 0 018.475 14.308z"
                fill="#FF9E42"
              />
            </Svg>
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </TapGestureHandler>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    padding: 7,
  },
  svgContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
    elevation: 5,
  },
  circleBackground: {
    position: "absolute",
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "white",
  },
});

