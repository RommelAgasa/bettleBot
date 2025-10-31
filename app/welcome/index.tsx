import CustomText from "@/src/theme/customText";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, View } from "react-native";
import style from "./screen-style";

export default function WelcomeScreen() {
  const router = useRouter();

  // Animated values for each dot
  const dot1Opacity = useRef(new Animated.Value(0.3)).current;
  const dot2Opacity = useRef(new Animated.Value(0.3)).current;
  const dot3Opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/home");
    }, 2000);

    // Animated loading dots sequence
    const animateDots = () => {
      Animated.loop(
        Animated.sequence([
          // Dot 1 fades in
          Animated.timing(dot1Opacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          // Dot 2 fades in
          Animated.timing(dot2Opacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          // Dot 3 fades in
          Animated.timing(dot3Opacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          // Small pause when all visible
          Animated.delay(200),
          // All fade out together
          Animated.parallel([
            Animated.timing(dot1Opacity, {
              toValue: 0.3,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(dot2Opacity, {
              toValue: 0.3,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(dot3Opacity, {
              toValue: 0.3,
              duration: 300,
              useNativeDriver: true,
            }),
          ]),
          // Small pause before restarting
          Animated.delay(200),
        ])
      ).start();
    };

    animateDots();

    return () => clearTimeout(timer); // cleanup on unmount
  }, [router, dot1Opacity, dot2Opacity, dot3Opacity]);

  return (
    <View style={style.container}>
      <View style={style.title_container}>
        <CustomText style={style.title_Beetle}>Beetle</CustomText>
        <CustomText style={style.title_bot}>bot</CustomText>
      </View>

      {/* Animated loading dots */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 20,
          gap: 8,
        }}
      >
        <Animated.View
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: "#FF9E42",
            opacity: dot1Opacity,
          }}
        />
        <Animated.View
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: "#FF9E42",
            opacity: dot2Opacity,
          }}
        />
        <Animated.View
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: "#FF9E42",
            opacity: dot3Opacity,
          }}
        />
      </View>
    </View>
  );
}

