import React, { Component } from "react";
import AllCheckBox from "../Fields/Checkbox";
import { View, Text } from "react-native";
import styles from "./WidgetStyles/CheckBoxWidgetStyle";

class CheckboxWidget extends Component {
  constructor(props) {
    super(props);
  }
  shouldComponentUpdate(nextProps) {
    if (nextProps["value"] !== this.props["value"]) {
      return true;
    }
    return false;
  }
  onItemPress = () => {
    this.props.onChange(this.props.idSchema, this.props.value ? false : true);
  };

  componentWillUnmount() {
    //this.props.onChange(this.props.idSchema, undefined);
  }

  render() {
    const { description, title, value } = this.props;
    return (
      <View>
        {description && <Text style={styles.description}>{description}</Text>}
        <AllCheckBox
          title={title}
          enumValue={[true, false]}
          value={value}
          onItemPress={this.onItemPress}
          disabled={this.props.disabled}
          onChange={this.props.onChange}
          idSchema={this.props.idSchema}
        />
      </View>
    );
  }
}

export default CheckboxWidget;
