import * as NavigationBar from "expo-navigation-bar";
import { Slot } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import { useEffect } from "react";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { ControlProvider } from "./components/control-context";
import layoutStyle from "./layout-style";

export default function WelcomeLayout() {
  useEffect(() => {
    const setupOrientation = async () => {
      try {
        // Lock orientation to landscape
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.LANDSCAPE
        );

        // Set safe area / background color (optional)
        await SystemUI.setBackgroundColorAsync("black");

        // Hide navigation bar, but allow swipe to reveal
        await NavigationBar.setVisibilityAsync("hidden");
        await NavigationBar.setBehaviorAsync("inset-swipe");
        // Options: "inset-swipe" (auto-hide), "overlay-swipe" (overlay style), or "inset" (always visible)
      } catch (error) {
        console.log("Error setting up orientation:", error);
      }
    };

    setupOrientation();

    return () => {
      // Cleanup when leaving this layout
      const cleanup = async () => {
        try {
          await ScreenOrientation.unlockAsync();
          await NavigationBar.setVisibilityAsync("visible");
        } catch (error) {
          console.log("Error cleaning up orientation:", error);
        }
      };
      cleanup();
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* Hide top status bar */}
      <StatusBar hidden />

      <View style={layoutStyle.container}>
        <ControlProvider>
          <Slot />
        </ControlProvider>
      </View>
    </GestureHandlerRootView>
  );
}

