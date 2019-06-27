import React from "react";
import { View, Picker } from "react-native";
import { styles } from "./WidgetStyles/DropDownWidgetStyle";
/**
 * Method gives the DropDown widget in the json schema form
 * @param  {object} props
 */
const DropDownWidget = props => {
  const { anyOf, value, onChange } = props;
  return (
    <View style={styles.container}>
      <Picker
        onValueChange={value => onChange(props.idSchema, value)}
        selectedValue={value}
      >
        {anyOf.map(item => {
          return (
            <Picker.Item
              label={item.title}
              value={item.title}
              key={item.title}
            />
          );
        })}
      </Picker>
    </View>
  );
};

export default DropDownWidget;
