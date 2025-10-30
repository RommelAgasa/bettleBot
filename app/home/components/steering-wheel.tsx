import { View } from "react-native";

interface SteeringWheelProps {
  size?: number;
  onRotate?: (angle: number) => void;
  onRelease?: () => void;
}

export default function SteeringWheel({
  size = 150,
  onRotate,
  onRelease,
}: SteeringWheelProps) {
  // Placeholder for steering wheel implementation
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: "#F5F5F5",
        borderWidth: 3,
        borderColor: "#DDDDDD",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 8,
      }}
    >
      <View
        style={{
          width: size / 3,
          height: size / 3,
          borderRadius: size / 6,
          backgroundColor: "#FF9E42",
        }}
      />
    </View>
  );
}
