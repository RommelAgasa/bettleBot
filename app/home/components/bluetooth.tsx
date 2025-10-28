import CustomText from "@/src/theme/customText";
import { FontAwesome } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

export default function Bluetooth() {
  return (
    <Link href="/" asChild>
      <Pressable style={styles.iconWrapper}>
        <View style={styles.round_rectangle}>
            <View>
                <FontAwesome name="bluetooth" size={30} color="#FF9E42" />
            </View>
            <View>
                <CustomText style={{ marginRight: 10}}>Connect</CustomText>
            </View>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    padding: 7,
    display: "flex",
  },
  round_rectangle: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    backgroundColor: "white",
    borderRadius: 40,
    padding: 10,
    width: 150,
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
