import React, { Component } from "react";
import {
  ListItem,
  Left,
  Right,
  Radio,
  Text,
  CheckBox as NativeBaseCheckbox,
  Body
} from "native-base";
import _ from "lodash";
import Styles from "../Widgets/WidgetStyles/CheckBoxWidgetStyle";
import { Platform, Alert } from "react-native";

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
    if (this.props.deselectAlert && this.state.checked) {
      Alert.alert(
        "Alert!",
        "Are you sure to deselect".concat(" ", enumValue).concat("", "?"),
        [
          {
            text: "Cancel",
            onPress: () => this.setState(state => ({ checked: state.checked }))
          },
          {
            text: "Yes",
            onPress: () => {
              this.props.onItemPress(enumValue[0]);
            }
          }
        ],
        { cancelable: false }
      );
    } else {
      this.setState(state => ({ checked: !state.checked }));
      this.props.onItemPress(enumValue[0]);
    }
  };

  render() {
    const { title, enumValue, disabled } = this.props;
    const { checked } = this.state;
    return Platform.OS === "ios" ? (
      <ListItem
        style={Styles.wrapper}
        onPress={() => {
          this.onItemPress(enumValue);
        }}
        disabled={disabled}
      >
        <Left>
          <Text style={disabled ? Styles.disableText : null}>{title}</Text>
        </Left>
        <Right>
          <Radio
            selectedColor={disabled ? "#CAD5E5" : null}
            selected={checked}
            onPress={() => {
              this.onItemPress(enumValue);
            }}
            disabled={disabled}
          />
        </Right>
      </ListItem>
    ) : (
      <ListItem
        onPress={() => {
          this.onItemPress(enumValue);
        }}
        disabled={disabled}
      >
        <NativeBaseCheckbox
          color={disabled ? "#CAD5E5" : null}
          checked={checked}
          onPress={() => {
            this.onItemPress(enumValue);
          }}
          disabled={disabled}
        />
        <Body style={{}}>
          <Text style={disabled ? Styles.disableText : Styles.CheckBoxTitle}>
            {title}
          </Text>
        </Body>
      </ListItem>
    );
  }
}

export default AllCheckBox;
