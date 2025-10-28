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
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 2,
    height: "30%", // takes up 30% of the screen height
    width: "100%",
  },

  title_container: {
    flexDirection: "row",
    padding: 20,
    gap: 2, // small space between Beetle and bot
    borderWidth: 1,
    width: "70%",
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

  bluetooth_setting_container: {
    flexDirection: "row",
    gap: 4,
    width: "30%",
    display: "flex",
    justifyContent:  "center",
    alignItems: "center",
  },

  center: {
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
    borderWidth: 1,
  },

  // ----- Left side (Steering Wheel)
  row2_left_container: {
    flex: 1, // 50% width
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },

  // ----- Right side (Gear + Controls)
  row2_right_container: {
    flex: 1, // 50% width
    flexDirection: "row",
    borderWidth: 1,
  },

  // Gear section
  row2_right_container_left: {
    flex: 0.4, // 40% of right container
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },

  // Claw + Accel/Break section
  row2_right_container_right: {
    flex: 0.6, // 60% of right container
    borderWidth: 1,
  },

  // ----- Claw panel
  claw: {
    flex: 1, // takes up equal height as accel/break section
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    padding: 20,
  },

  // ----- Acceleration + Break (side-by-side)
  row2_right_accelaration_break_container: {
    flex: 1,
    flexDirection: "row",
    borderWidth: 1,
  },

  acceleration: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    padding: 20,
  },

  break: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    padding: 20,
  },
});
