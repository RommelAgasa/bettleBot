import CustomText from "@/src/theme/customText";
import { View } from "react-native";
import AccelaratorButton from "./components/acceleration";
import Bluetooth from "./components/bluetooth";
import BreakButton from "./components/break";
import ClawButton from "./components/claw";
import { useControl } from "./components/control-context";
import GearSelector from "./components/gear";
import Joystick from "./components/joystick";
import Settings from "./components/settings";
import SteeringWheel from "./components/steering-wheel";
import style from "./screen-style";
export default function Home() {
  const { controlType } = useControl();

  // Handler for joystick movement
  const handleJoystickMove = (data: {
    x: number;
    y: number;
    angle: number;
    distance: number;
  }) => {
    // TODO: Send joystick data to Bluetooth device
    console.log("Joystick:", data);
  };

  // Handler for steering wheel rotation
  const handleSteeringRotate = (angle: number) => {
    // TODO: Send steering angle to Bluetooth device
    console.log("Steering:", angle);
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
            <View style={style.joystick_wrapper}>
              {controlType === "joystick" ? (
                <Joystick
                  size={150}
                  onMove={handleJoystickMove}
                  onStop={() => console.log("Joystick released")}
                />
              ) : (
                <SteeringWheel
                  size={220}
                  onRotate={handleSteeringRotate}
                  onRelease={() => console.log("Steering released")}
                />
              )}
            </View>
          </View>
          <View style={style.row2_right_container}>
            <View style={style.row2_right_container_left}>
              <GearSelector />
            </View>
            <View style={style.row2_right_container_right}>
              <View style={style.claw}>
                <ClawButton />
              </View>
              <View style={style.row2_right_accelaration_break_container}>
                <View style={style.break}>
                  <View
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "center",
                    }}
                  >
                    <BreakButton />
                  </View>
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

