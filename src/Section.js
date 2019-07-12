import React, { Component } from "react";
import { View, Text } from "react-native";
import styles from "./FormStyle";
import SchemaWidget from "./Widgets/SchemaWidget";
import {
  orderProperties,
  retrieveSchema,
  getDefaultRegistry
} from './Util';

class Section extends Component {

  /**
   * Method handles the all the elements in the form and their value
   * @param  {string} key
   * @param  {string} value
   */
  handleChange = (key, value) => {
    let receivedData = {
      ...this.props.formData[this.props.keyName],
      [key]: value
    };
    if ((!value && value != 0) || value.length == 0) {
      delete receivedData[key];
    }
    this.props.handleData(this.props.keyName, receivedData);
  };

  /**
   * Method display the title in the form
   * @param  {string} title
   * @param  {string} description
   */
  renderTitle = (title, description) => {
    if (!title && !description) return;
    return <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {description ? (
        <Text style={styles.description}>{description}</Text>
      ) : null}
    </View>
  }
  /**
   * Method gets all the required element in the form
   * @param  {string} name
   * @returns {array}
   */
  isRequired = name => {
    const { requiredList } = this.props;
    return Array.isArray(requiredList) && requiredList.indexOf(name) !== -1;
  };

  onChange = (key, Name) => {
    console.log("onChange")
  }

  onPropertyChange = (name) => {
    return (value, errorSchema) => {
      const newFormData = { ...this.props.formData, [name]: value };
      this.props.onChange(
        newFormData,
        errorSchema &&
        this.props.errorSchema && {
          ...this.props.errorSchema,
          [name]: errorSchema,
        }
      );
    };
  }

  render() {
    const {
      uiSchema = {},
      formData,
      errorSchema,
      idSchema,
      name,
      idPrefix,
      registry = getDefaultRegistry(),
      sectionErrors = {},
      storeLayoutX = {}
    } = this.props;
    const schema = retrieveSchema(this.props.schema, {}, formData);
    const title = schema.title === undefined ? name : schema.title;
    const description = (uiSchema)["ui:description"] || schema.description;
    let _orderProperties;
    try {
      const properties = Object.keys(schema.properties || {});
      _orderProperties = orderProperties(properties, uiSchema["ui:order"]);
    } catch (err) {
      return console.error(err.message);
    }

    return (
      <View
        style={styles.cardContainer}
        onLayout={e => {
          "storeLayoutSection" in this.props && this.props.storeLayoutSection(keyName, e.nativeEvent.layout.height);
        }}
      >
        {this.renderTitle(title, description)}
        {_orderProperties.map(name => {
          return (
            <SchemaWidget
              key={name}
              section={name}
              required={this.isRequired(name)}
              schema={schema.properties[name]}
              uiSchema={uiSchema[name]}
              idSchema={idSchema[name]}
              idPrefix={idPrefix}
              formData={(formData || {})[name]}
              onChange={this.onPropertyChange(name)}
              registry={registry}

            // value={formData[idSchema]}
            // handleChange={this.handleChange}
            // storeLayoutX={storeLayoutX}
            // onChange={this.onChange}
            />
          );
        })}
        <View style={styles.space} />
      </View>
    );
  }
}

export default Section;
