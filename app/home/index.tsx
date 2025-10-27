import { Text, View } from "react-native";
import style from "./screen-style"

export default function Home(){
    return (
        <>  
            <View style={style.container}>
                <Text>Home Page</Text>
            </View>
        </>
    );
}