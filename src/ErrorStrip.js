import React from "react";
import { Text, TouchableOpacity } from "react-native";

const ErrorStrip = ({ message, onPress }) => (
  <TouchableOpacity style={styles.container} onPress={onPress}>
    <Text style={styles.message}>{message}</Text>
  </TouchableOpacity>
);

const styles = {
  container: {
    height: 54,
    justifyContent: "center",
    margin: 0,
    backgroundColor: "red"
  },
  message: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
    paddingHorizontal: 10
  }
};

export default ErrorStrip;
