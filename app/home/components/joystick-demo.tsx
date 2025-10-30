import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Joystick from "../components/joystick";

/**
 * Demo component to test and visualize joystick values
 * Import this in your screen to test the joystick functionality
 */
export default function JoystickDemo() {
  const [joystickData, setJoystickData] = useState({
    x: 0,
    y: 0,
    angle: 0,
    distance: 0,
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Joystick Test</Text>

      <Joystick
        size={200}
        onMove={(data) => setJoystickData(data)}
        onStop={() => setJoystickData({ x: 0, y: 0, angle: 0, distance: 0 })}
      />

      <View style={styles.dataContainer}>
        <Text style={styles.dataLabel}>X: {joystickData.x.toFixed(2)}</Text>
        <Text style={styles.dataLabel}>Y: {joystickData.y.toFixed(2)}</Text>
        <Text style={styles.dataLabel}>
          Angle: {joystickData.angle.toFixed(0)}°
        </Text>
        <Text style={styles.dataLabel}>
          Distance: {(joystickData.distance * 100).toFixed(0)}%
        </Text>
      </View>

      <View style={styles.directionContainer}>
        <Text style={styles.directionText}>
          {getDirection(joystickData.x, joystickData.y, joystickData.distance)}
        </Text>
      </View>
    </View>
  );
}

function getDirection(x: number, y: number, distance: number): string {
  if (distance < 0.1) return "Center";

  const angle = Math.atan2(y, x) * (180 / Math.PI);

  if (angle >= -22.5 && angle < 22.5) return "Right ➡️";
  if (angle >= 22.5 && angle < 67.5) return "Down-Right ↘️";
  if (angle >= 67.5 && angle < 112.5) return "Down ⬇️";
  if (angle >= 112.5 && angle < 157.5) return "Down-Left ↙️";
  if (angle >= 157.5 || angle < -157.5) return "Left ⬅️";
  if (angle >= -157.5 && angle < -112.5) return "Up-Left ↖️";
  if (angle >= -112.5 && angle < -67.5) return "Up ⬆️";
  if (angle >= -67.5 && angle < -22.5) return "Up-Right ↗️";

  return "Moving";
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FF9E42",
    marginBottom: 30,
  },
  dataContainer: {
    marginTop: 30,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 15,
    width: "100%",
    maxWidth: 300,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dataLabel: {
    fontSize: 18,
    color: "#333",
    marginVertical: 5,
    fontFamily: "monospace",
  },
  directionContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#FF9E42",
    borderRadius: 10,
    minWidth: 200,
    alignItems: "center",
  },
  directionText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
