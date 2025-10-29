import CustomText from "@/src/theme/customText";
import { Text, View } from "react-native";
import AccelaratorButton from "./components/acceleration";
import Bluetooth from "./components/bluetooth";
import BreakButton from "./components/break";
import ClawButton from "./components/claw";
import Settings from "./components/settings";
import style from "./screen-style";
export default function Home(){
    return (
        <>  
            <View style={style.container}>
                <View style={style.row1}>

                    <View style={style.title_container}>
                        <CustomText style={style.title_Beetle}>Beetle</CustomText>
                        <CustomText style={style.title_bot}>bot</CustomText>
                    </View>

                    <View style={style.bluetooth_setting_container}>
                        <View style={style.center}>
                            <Bluetooth/>
                        </View>
                        <View style={style.center}>
                            <Settings/>
                        </View>
                    </View>

                </View>

                <View style={style.row2}>
                    <View style={style.row2_left_container}>
                        <Text>Steering Wheel</Text>
                    </View>
                    <View style={style.row2_right_container}>
                        <View style={style.row2_right_container_left}>
                            <Text>Gear</Text>
                        </View>
                        <View style={style.row2_right_container_right}>
                            <View style={style.claw}>
                                <ClawButton/>
                            </View>
                            <View style={style.row2_right_accelaration_break_container}>
                                <View style={style.break}>
                                    <View style={{ display: "flex", justifyContent: "flex-end", alignItems: "center"}}>
                                        <BreakButton/>
                                    </View>
                                </View>
                                <View style={style.acceleration}>
                                    <AccelaratorButton/>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </>
    );
}