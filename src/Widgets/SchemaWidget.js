import React, { Component } from "react";
import { View, Text } from "react-native";
import PropTypes from "prop-types";
import { styles } from "./WidgetStyles/InputWidgetStyle";
import {
  getDefaultRegistry,
  getWidgetType,
  getWidget,
  getSchemaType,
  hasErrors
} from "../Util";
import Section from '../Section';

const COMPONENT_TYPES = {
  array: "ArrayField",
  boolean: "BooleanField",
  integer: "NumberField",
  number: "NumberField",
  object: "ObjectField",
  string: "StringField",
  null: "NullField",
};

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
    const color = hasErrors(errors) ? styles.requiredColor : {};
    const { title } = this.props.schema;
    return (
      <View style={styles.label}>
        <Text
          style={styles.title}
        >
          {title}
          {this.props.required && <Text style={color}> *</Text>}
        </Text>
      </View>
    );
  };

  renderHeader = text => {
    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.textHeader}>{text}</Text>
      </View>
    );
  };

  renderObjectWidget(props) {
    return <Section {...props} />
  }

  onPropertyChange = (name) => {
    console.log(name);
  }

  schemaWidgetRender = props => {
    const {
      idSchema,
      schema,
      uiSchema = {},
      value,
      errors
    } = props;

    if (getSchemaType(schema) == "object") {
      return this.renderObjectWidget(props);
    }

    const widgets = getDefaultRegistry();
    const widgetType = getWidgetType(uiSchema);
    const Widget = getWidget(schema, widgetType, widgets);
    const disabled = Boolean(uiSchema["ui:disabled"]);
    const readonly = Boolean(uiSchema["ui:readonly"]);
    const autofocus = Boolean(uiSchema["ui:autofocus"]);
    const header = schema["header"];
    const _value = value;
    const options = {};
    const deselectAlert = props.schema.deselectAlert;
    if (widgetType == "hidden") {
      return null;
    }
    return (
      <View
        style={styles.container}
      // onLayout={e => {
      //   "storeLayoutX" in props && props.storeLayoutX(section, idSchema, e.nativeEvent.layout.y);
      // }}
      >
        {header && this.renderHeader(header)}
        {this.renderLabel(errors)}
        <ErrorTexts errors={errors} />
        <Widget
          idSchema={idSchema}
          key={idSchema}
          uiSchema={uiSchema}
          onChange={this.onPropertyChange}
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

  render() {
    return this.schemaWidgetRender(this.props);
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
