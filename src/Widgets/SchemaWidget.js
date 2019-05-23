import React, { Component } from "react";
import { View, Text } from "react-native";
import PropTypes from "prop-types";
import { Label } from "native-base";
import { styles } from "./WidgetStyles/InputWidgetStyle";
import {
  getDefaultRegistry,
  getWidgetType,
  getWidget,
  hasErrors
} from "../Util";

/**
 * @classdesc Component handles the schema widget and display the json schema form
 */
class SchemaWidget extends Component {
  static proptypes = {
    required: PropTypes.bool
  };
  /**
   * Methos display the title of the form
   * @returns application
   */
  renderLabel = errors => {
    // if type is boolean don't show title
    if (this.props.schema.type == "boolean") {
      return null;
    }
    const color = hasErrors(errors) ? { color: "red" } : {};
    const { title } = this.props.schema;
    return (
      <Label
        style={
          this.props.idSchema == "cannula_size" ? styles.title1 : styles.title
        }
      >
        {title}
        {this.props.required && <Text style={color}> *</Text>}
      </Label>
    );
  };

  renderHeader = text => {
    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.textHeader}>{text}</Text>
      </View>
    );
  };

  render() {
    const { idSchema, schema, uiSchema, value, errors, section } = this.props;
    const widgets = getDefaultRegistry();
    const widgetType = getWidgetType(uiSchema);
    const Widget = getWidget(schema, widgetType, widgets);
    const disabled = Boolean(uiSchema["ui:disabled"]);
    const readonly = Boolean(uiSchema["ui:readonly"]);
    const autofocus = Boolean(uiSchema["ui:autofocus"]);
    const header = schema["header"];
    const _value = value;
    const options = {};
    const deselectAlert = this.props.schema.deselectAlert;
    return (
      <View
        style={styles.container}
        onLayout={e => {
          this.props.storeLayoutX(section, idSchema, e.nativeEvent.layout.y);
        }}
      >
        {header && this.renderHeader(header)}
        {this.renderLabel(errors)}
        <ErrorTexts errors={errors} />
        <Widget
          idSchema={idSchema}
          key={idSchema}
          onChange={this.props.handleChange}
          value={_value}
          disabled={disabled}
          readonly={readonly}
          autofocus={autofocus}
          options={options}
          {...schema}
          deselectAlert={deselectAlert}
        />
      </View>
    );
  }
}

class ErrorTexts extends Component {
  /**
   * Method display the error message
   */
  render() {
    return (
      <View style={styles.container}>
        {hasErrors(this.props.errors) &&
          this.props.errors.__errors.map((errorText, index) => {
            if (errorText === "is a required property") {
              return null;
            }
            return (
              <View style={styles.row} key={index}>
                <View style={styles.dot} />
                <Text style={styles.errorText}>{errorText}</Text>
              </View>
            );
          })}
      </View>
    );
  }
}

export default SchemaWidget;
