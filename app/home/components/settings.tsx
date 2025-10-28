import { FontAwesome } from "@expo/vector-icons";
import { useRef } from "react";
import { Animated, Pressable, StyleSheet, View } from "react-native";

export default function Settings() {

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
          <FontAwesome name="gear" size={40} color="#FF9E42" />
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
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    // Subtle shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    // Elevation for Android shadow
    elevation: 6,
  },
});
