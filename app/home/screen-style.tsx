import { StyleSheet } from "react-native";

export default StyleSheet.create({
  // ==============================
  // MAIN CONTAINER
  // ==============================
  container: {
    flex: 1,
    width: "100%",
    padding: 30,
  },

  // ==============================
  // ROW 1 — Title + Bluetooth/Settings
  // ==============================
  row1: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: "20%", // takes up 20% of the screen height
    width: "100%",
    borderWidth: 1,
  },

  title_container: {
    flexDirection: "row",
    padding: 20,
    gap: 2, // small space between Beetle and bot
    borderWidth: 1,
    width: "60%",
  },

  bluetooth_setting_container: {
    flexDirection: "row",
    width: "40%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: 0,
  },

  title_Beetle: {
    color: "#FF9E42",
    fontSize: 30,
    fontWeight: "500",
  },

  title_bot: {
    color: "#999999",
    fontSize: 30,
    fontWeight: "500",
  },

  bluetooth: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
    flex: 1,
  },

  setting: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },

  // ==============================
  //  ROW 2 — Control Section
  // (Left: Steering | Right: Gear + Claw + Accel/Break)
  // ==============================
  row2: {
    flex: 1, // fills remaining height
    flexDirection: "row",
    width: "100%",
  },

  // ----- Left side (Movement Control) - 60%
  row2_left_container: {
    flex: 0.6, // 60% width
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },

  // Joystick/Steering Wheel wrapper for positioning
  joystick_wrapper: {
    marginTop: 80,
    marginLeft: 0,
    marginRight: 180,
    marginBottom: 0,
  },

  // ----- Right side (Gear + Claw) - 40%
  row2_right_container: {
    flex: 0.4, // 40% width
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    borderWidth: 1,
  },

  // Gear Selector - Left side (20% of total)
  gear_container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  // Gear wrapper for repositioning
  gear_wrapper: {
    marginTop: 100, 
    marginLeft: 0, 
    marginRight: 20,
    marginBottom: 0,
  },

  // Claw Button - Right side (20% of total)
  claw_container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  // Claw wrapper for repositioning
  claw_wrapper: {
    marginTop: 100, 
    marginLeft: 0,
    marginRight: 20,
    marginBottom: 0,
  },
});

