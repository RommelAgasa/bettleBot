import { Slot } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import { useEffect } from "react";
import { View } from "react-native";
import layoutStyle from "./layout-style";

export default function WelcomeLayout() {

  useEffect(() => {
    // Lock the screen to landscape mode
    ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.LANDSCAPE
    );

    // Unlock when leaving this layout
    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);

  return (
    <View
      style={layoutStyle.container}
    >
      {/* This Slot renders child screens like welcome/index.tsx */}
      <Slot />
    </View>
  );
}
