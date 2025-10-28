import { FontAwesome } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

export default function Bluetooth() {
  return (
    <Link href="/" asChild>
      <Pressable style={styles.iconWrapper}>
        <View style={styles.circle}>
          <FontAwesome name="gear" size={40} color="#FF9E42" />
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    padding: 10,
    alignSelf: "flex-end",
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
