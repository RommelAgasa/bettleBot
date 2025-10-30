import { FontAwesome } from "@expo/vector-icons";
import { useRef, useState } from "react";
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useControl } from "./control-context";

export default function Settings() {
  const [modalVisible, setModalVisible] = useState(false);

  let controlType: "joystick" | "steering-wheel" = "joystick";
  let setControlType: ((type: "joystick" | "steering-wheel") => void) | null =
    null;

  try {
    const control = useControl();
    controlType = control.controlType;
    setControlType = control.setControlType;
  } catch (error) {
    console.error("Settings component not wrapped in ControlProvider:", error);
  }

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

  const handlePress = () => {
    try {
      setModalVisible(true);
    } catch (error) {
      console.error("Error opening settings:", error);
    }
  };

  const handleClose = () => {
    try {
      setModalVisible(false);
    } catch (error) {
      console.error("Error closing settings:", error);
    }
  };

  const handleControlTypeChange = (type: "joystick" | "steering-wheel") => {
    try {
      if (setControlType) {
        setControlType(type);
      }
    } catch (error) {
      console.error("Error changing control type:", error);
    }
  };

  return (
    <>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
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

      {/* Settings Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Control Settings</Text>

            <Text style={styles.sectionLabel}>Choose Control Type:</Text>

            <TouchableOpacity
              style={[
                styles.optionButton,
                controlType === "joystick" && styles.optionButtonSelected,
              ]}
              onPress={() => handleControlTypeChange("joystick")}
            >
              <FontAwesome
                name="circle-o"
                size={24}
                color={controlType === "joystick" ? "#FF9E42" : "#999"}
              />
              <Text
                style={[
                  styles.optionText,
                  controlType === "joystick" && styles.optionTextSelected,
                ]}
              >
                Joystick
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionButton,
                controlType === "steering-wheel" && styles.optionButtonSelected,
              ]}
              onPress={() => handleControlTypeChange("steering-wheel")}
            >
              <FontAwesome
                name="circle-o"
                size={24}
                color={controlType === "steering-wheel" ? "#FF9E42" : "#999"}
              />
              <Text
                style={[
                  styles.optionText,
                  controlType === "steering-wheel" && styles.optionTextSelected,
                ]}
              >
                Steering Wheel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 30,
    width: "80%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  sectionLabel: {
    fontSize: 18,
    color: "#666",
    marginBottom: 15,
    fontWeight: "600",
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#E0E0E0",
    marginBottom: 12,
    backgroundColor: "#F9F9F9",
  },
  optionButtonSelected: {
    borderColor: "#FF9E42",
    backgroundColor: "#FFF5E6",
  },
  optionText: {
    fontSize: 18,
    color: "#666",
    marginLeft: 15,
    fontWeight: "500",
  },
  optionTextSelected: {
    color: "#FF9E42",
    fontWeight: "700",
  },
  closeButton: {
    backgroundColor: "#FF9E42",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

