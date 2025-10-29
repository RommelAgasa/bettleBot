import { useRef } from "react";
import { Animated, Pressable, StyleSheet, View } from "react-native";
import Svg, { Path } from "react-native-svg";

export default function ClawButton() {

  // Create animated scale value
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9, // shrink a bit
      useNativeDriver: true,
      speed: 50,
      bounciness: 5,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1, // return to normal
      useNativeDriver: true,
      speed: 30,
      bounciness: 5,
    }).start();
  };

  return (
    <Pressable 
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.iconWrapper}
    >
      <Animated.View
        style={[styles.circle, { transform: [{ scale: scaleAnim }] }]}
      >
        <View style={styles.circle}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
            {/* Left SVG rotated inward */}
            <View style={{ transform: [{ rotate: "30deg" }] }}>
                <Svg width={50} height={50} viewBox="0 0 50 50">
                <Path
                    d="M 15 8
                    Q 12 8 10 10
                    L 8 12
                    Q 6 14 6 17
                    Q 6 22 10 28
                    Q 14 34 20 38
                    Q 26 42 32 44
                    Q 35 45 38 43
                    L 40 41
                    Q 42 39 42 36
                    Q 42 34 40 33
                    L 35 30
                    Q 33 29 31 30
                    L 28 32
                    Q 26 33 24 32
                    Q 20 30 16 26
                    Q 12 22 10 18
                    Q 9 16 10 14
                    L 12 11
                    Q 13 9 15 8
                    Z"
                    fill="#FF9E42"
                />
                </Svg>
            </View>

            {/* Right SVG mirrored and rotated inward */}
            <View style={{ transform: [{ scaleX: -1 }, { rotate: "30deg" }], marginLeft: -15 }}>
                <Svg width={50} height={50} viewBox="0 0 50 50">
                <Path
                    d="M 15 8
                    Q 12 8 10 10
                    L 8 12
                    Q 6 14 6 17
                    Q 6 22 10 28
                    Q 14 34 20 38
                    Q 26 42 32 44
                    Q 35 45 38 43
                    L 40 41
                    Q 42 39 42 36
                    Q 42 34 40 33
                    L 35 30
                    Q 33 29 31 30
                    L 28 32
                    Q 26 33 24 32
                    Q 20 30 16 26
                    Q 12 22 10 18
                    Q 9 16 10 14
                    L 12 11
                    Q 13 9 15 8
                    Z"
                    fill="#FF9E42"
                />
                </Svg>
            </View>
            </View>
        </View>
      </Animated.View>
      
    </Pressable>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    padding: 7,
  },
  circle: {
    backgroundColor: "white",
    borderRadius: 50,
    width: 90,
    height: 90,
    justifyContent: "center",
    alignItems: "center",
    // Subtle shadow for iOS
    shadowColor: "#5c4a4aff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    // Elevation for Android shadow
    elevation: 6,
  },
});
