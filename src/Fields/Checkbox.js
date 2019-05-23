import React, { Component } from "react";
import _ from "lodash";
import Styles from "../Widgets/WidgetStyles/CheckBoxWidgetStyle";
import { Platform, Alert, View, Text, TouchableOpacity } from "react-native";
import CheckBox from 'react-native-check-box'

class AllCheckBox extends Component {
  constructor(props) {
    super(props);
    this.state = this.getStateFromProps(props);
  }
  componentWillReceiveProps(nextProps) {
    this.state = this.getStateFromProps(nextProps);
  }
  /**
   * Method executes when the get any action from the user in Ios
   * @param  {object} props
   * @returns {Boolean} checked
   */
  getStateFromProps = props => {
    if (props.value) {
      return { checked: _.includes(props.value, props.enumValue[0]) };
    }

    if (props.defaultValue) {
      return { checked: _.includes(props.defaultValue, props.enumValue[0]) };
    }

    return { checked: false };
  };
  /**
   * Method executes when click on the checkbox in Ios
   * @param  {number} enumValue
   */
  onItemPress = enumValue => {
      this.setState(state => ({ checked: !state.checked }));
      this.props.onItemPress(enumValue[0]);
  };

  render() {
    const { title, enumValue, disabled } = this.props;
    const { checked } = this.state;
    return Platform.OS === "ios" ? (
      <TouchableOpacity style={Styles.container} onPress={()=>{this.onItemPress(enumValue)}}>
      <CheckBox
        style={Styles.checkBoxAlign}
        onClick={() => {
          this.onItemPress(enumValue);
        }}
        isChecked={checked}
        checkBoxColor ="#2196f3"
      />
      <Text style={disabled ? Styles.disableText : Styles.CheckBoxTitle} >{title} </Text>
    </TouchableOpacity>
    ) : (
        <TouchableOpacity style={Styles.container} onPress={()=>{this.onItemPress(enumValue)}}>
          <CheckBox
            style={Styles.checkBoxAlign}
            onClick={() => {
              this.onItemPress(enumValue);
            }}
            isChecked={checked}
            checkBoxColor ="#2196f3"
          />
          <Text style={disabled ? Styles.disableText : Styles.CheckBoxTitle} >{title} </Text>
        </TouchableOpacity>
      );
  }
}

export default AllCheckBox;
