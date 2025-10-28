import CustomText from "@/src/theme/customText";
import { Text, View } from "react-native";
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
                            <Text>Bluetooth</Text>
                        </View>
                        <View style={style.center}>
                            <Text>Settings</Text>
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
                                <Text>Claw</Text>
                            </View>
                            <View style={style.row2_right_accelaration_break_container}>
                                <View style={style.acceleration}>
                                    <Text>Acceleration</Text>
                                </View>
                                <View style={style.break}>
                                    <Text>Break</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </>
    );
}