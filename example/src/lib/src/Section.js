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

  render() {
    const {
      properties,
      uiOrder,
      title,
      description,
      formData,
      keyName,
      sectionErrors = {}
    } = this.props;
    const sectionFormData = formData.hasOwnProperty(keyName) ? formData[keyName] : {};
    return (
      <View
        style={styles.cardContainer}
        onLayout={e => {
          this.props.storeLayoutSection(keyName, e.nativeEvent.layout.height);
        }}
      >
        {this.renderTitle(title, description)}

        {uiOrder["ui:order"].map(idSchema => {
          if (uiOrder[idSchema] == undefined) {
            console.log(uiOrder[idSchema] + " Not Found ");
          } else {
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
                storeLayoutX={this.props.storeLayoutX}
              />
            );
          }
        })}
        <View style={styles.space} />
      </View>
    );
  }
}

export default Section;
