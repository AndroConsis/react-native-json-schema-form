import React, { Component } from "react";
import { View, Text } from "react-native";
import styles from "./FormStyle";
import SchemaWidget from "./Widgets/SchemaWidget";

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
  renderTitle = (title, description) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {description ? (
        <Text style={styles.description}>{description}</Text>
      ) : null}
    </View>
  );
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

  render() {
    const {
      uiOrder = {},
      title = "",
      description = "",
      formData = {},
      keyName = "",
      sectionErrors = {},
      storeLayoutX = {}
    } = this.props;
    const properties = this.props.schema.properties;
    const sectionFormData = formData.hasOwnProperty(keyName) ? formData[keyName] : {};

    const _properties = Object.keys(uiOrder).length ? uiOrder : Object.keys(this.props.schema.properties)
    return (
      <View
        style={styles.cardContainer}
        onLayout={e => {
          "storeLayoutSection" in this.props && this.props.storeLayoutSection(keyName, e.nativeEvent.layout.height);
        }}
      >
        {this.renderTitle(title, description)}

        {_properties.map(idSchema => {
          const required = this.isRequired(idSchema);
          const errors = sectionErrors[idSchema]
            ? sectionErrors[idSchema]
            : undefined;
          return (
            <SchemaWidget
              key={idSchema}
              section={keyName}
              idSchema={idSchema}
              schema={properties[idSchema]}
              uiSchema={uiOrder[idSchema]}
              value={sectionFormData[idSchema]}
              handleChange={this.handleChange}
              required={required}
              errors={errors}
              storeLayoutX={storeLayoutX}
              onChange={this.onChange}
            />
          );
        })}
        <View style={styles.space} />
      </View>
    );
  }
}

export default Section;
