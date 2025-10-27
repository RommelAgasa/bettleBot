import { View, Text, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import style from "./screen-style"

export default function WelcomeScreen() {
  return (
    <View style={style.container}>
      <Text style={style.title}>Welcome to BettleBot!</Text>

      <Text style={style.subtitle}>
        A new era of intelligent automation begins.
      </Text>

      <Link href="/home" asChild>
        <TouchableOpacity style={style.button}>
          <Text style={style.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}
