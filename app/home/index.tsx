import CustomText from "@/src/theme/customText";
import { View } from "react-native";
import AccelaratorButton from "./components/acceleration";
import Bluetooth from "./components/bluetooth";
import BrakeButton from "./components/brake";
import ClawButton from "./components/claw";
import GearSelector from "./components/gear";
import Settings from "./components/settings";
import SteeringWheel from "./components/steeringWheel";
import style from "./screen-style";

/**
 * Home Screen Component
 *
 * Follows Single Responsibility Principle:
 * - Orchestrates child components
 * - Handles high-level control logic
 * - Delegates specific behaviors to child components
 */
export default function Home() {
  /**
   * Handle steering wheel changes
   * Observer Pattern: Reacts to steering wheel state changes
   */
  const handleSteeringChange = (data: {
    angle: number;
    normalizedValue: number;
    direction: "left" | "right" | "center";
  }) => {
    // TODO: Send steering data to Bluetooth service
    console.log("Steering:", {
      angle: Math.round(data.angle),
      normalized: data.normalizedValue.toFixed(2),
      direction: data.direction,
    });
  };

  /**
   * Handle steering start
   */
  const handleSteeringStart = () => {
    console.log("Steering started");
    // TODO: Send start signal to robot
  };

  /**
   * Handle steering end (return to center)
   */
  const handleSteeringEnd = () => {
    console.log("Steering ended - returning to center");
    // TODO: Send stop/center signal to robot
  };

  /**
   * Handle gear changes
   */
  const handleGearChange = (gear: string) => {
    console.log("Gear changed to:", gear);
    // TODO: Send gear data to Bluetooth service
  };

  return (
    <>
      <View style={style.container}>
        <View style={style.row1}>
          <View style={style.title_container}>
            <CustomText style={style.title_Beetle}>Beetle</CustomText>
            <CustomText style={style.title_bot}>bot</CustomText>
          </View>

          <View style={style.bluetooth_setting_container}>
            <View style={style.bluetooth}>
              <Bluetooth />
            </View>
            <View style={style.setting}>
              <Settings />
            </View>
          </View>
        </View>

        <View style={style.row2}>
          <View style={style.row2_left_container}>
            <SteeringWheel
              size={220}
              maxRotation={135}
              sensitivity={0.6}
              onSteeringChange={handleSteeringChange}
              onSteeringStart={handleSteeringStart}
              onSteeringEnd={handleSteeringEnd}
            />
          </View>
          <View style={style.row2_right_container}>
            <View style={style.row2_right_container_left}>
              <GearSelector onGearChange={handleGearChange} />
            </View>
            <View style={style.row2_right_container_right}>
              <View style={style.claw}>
                <ClawButton />
              </View>
              <View style={style.row2_right_accelaration_break_container}>
                <View style={style.break}>
                  <BrakeButton />
                </View>
                <View style={style.acceleration}>
                  <AccelaratorButton />
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </>
  );
}

