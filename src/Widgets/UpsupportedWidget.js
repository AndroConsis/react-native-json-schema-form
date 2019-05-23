import React from "react";
import { View, Text, StyleSheet } from "react-native";
/**
 * Method gives the Unsupported widget in the json schema form
 * @param  {object} props
 */
const UnsupportedWidget = props => {
  console.log(props);
  return (
    <View>
      <Text style={styles.textStyle}>UnsupportedWidget</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  textStyle: {
    fontSize: 30
  }
});

export default UnsupportedWidget;
