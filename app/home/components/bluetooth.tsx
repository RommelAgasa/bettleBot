import CustomText from "@/src/theme/customText";
import { FontAwesome } from "@expo/vector-icons";
import { useRef } from "react";
import { Animated, Pressable, StyleSheet } from "react-native";

export default function Bluetooth() {
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
        style={[styles.round_rectangle, { transform: [{ scale: scaleAnim }] }]}
      >
        <FontAwesome name="bluetooth" size={30} color="#FF9E42" />
        <CustomText style={{ marginRight: 10 }}>Connect</CustomText>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    padding: 7,
  },
  round_rectangle: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: "white",
    borderRadius: 40,
    padding: 10,
    width: 150,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
});
