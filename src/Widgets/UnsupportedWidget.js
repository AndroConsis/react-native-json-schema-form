import React from "react";
import { View, Text, StyleSheet } from "react-native";
import metrics from "../Metrics";
/**
 * Method gives the Unsupported widget in the json schema form
 * @param  {object} props
 */
const UnsupportedWidget = props => {
  return (
    <View>
      <Text style={styles.textStyle}>UnsupportedWidget</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  textStyle: {
    fontSize: 16,
    margin: metrics.doubleBaseMargin,
    color: "tomato"
  }
});

export default UnsupportedWidget;
