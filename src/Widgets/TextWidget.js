import React, { Component } from "react";
import { TextInput } from "react-native";
import { styles } from "./WidgetStyles/InputWidgetStyle";
import { getKeyboardType } from "../Util";
import PropTypes from "prop-types";
/**
 * Method gives the Text widget in the json schema form
 * @param  {object} props
 */
class TextWidget extends Component {
  constructor(props) {
    super(props);
  }

  isNumber = props => {
    if (props.type == "number" || props.type == "integer") {
      return true;
    }

    return false;
  };

  shouldComponentUpdate(nextProps) {
    if (nextProps["value"] != this.props["value"]) {
      return true;
    }
    return false;
  }

  componentWillUnmount() {
    //this.props.onChange(this.props.idSchema, undefined);
  }

  _valueToString = val => {
    if (val != undefined && val != null) {
      if (typeof val != "string") {
        return val + "";
      }
      return val;
    }
    return null;
  };

  render() {
    const {
      disabled,
      idSchema,
      onChange,
      maxLength = null,
      type,
      value
    } = this.props;
    const keyboardType = getKeyboardType(type);
    return (
      <TextInput
        returnKeyType={"done"}
        editable={!disabled}
        style={styles.textInput}
        maxLength={maxLength}
        onChangeText={val => {
          onChange(idSchema, val);
        }}
        numeric
        autoCapitalize="none"
        value={value}
        keyboardType={keyboardType}
      />
    );
  }
}

TextWidget.propTypes = {
  placeholder: PropTypes.string,
  pattern: PropTypes.string,
  maxLength: PropTypes.number,
  value: PropTypes.string
};

export default TextWidget;
