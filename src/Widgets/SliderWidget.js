import React from "react";
import { View, Slider, Text } from "react-native";
import { styles } from "./WidgetStyles/SliderWidgetStyle";
/**
 * Method gives the Slider widget in the json schema form
 * @param  {object} props
 */
const SliderWidget = props => {
  const { minimum, maximum, multipleOf, disabled, onChange } = props;
  return (
    <View style={styles.container}>
      <Slider
        value={minimum}
        disabled={disabled ? disabled : false}
        minimumValue={minimum}
        maximumValue={maximum}
        step={multipleOf ? multipleOf : 1}
        minimumTrackTintColor="green"
        thumbTintColor="green"
        onValueChange={value => onChange(props.idSchema, value)}
      />
      <Text style={styles.text}>{props.value}</Text>
    </View>
  );
};

export default SliderWidget;
