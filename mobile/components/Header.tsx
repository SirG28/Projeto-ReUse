import React from "react";
import { View, StyleSheet } from "react-native";
import Logo from "./Logo";

export default function Header() {
  return (
    <View style={styles.container}>
      <Logo markSize={40} wordmarkSize={30} />
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
    marginTop: 20,
  },

});