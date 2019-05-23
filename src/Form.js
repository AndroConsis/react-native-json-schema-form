import React, { Component } from "react";
import {
  ScrollView,
  LayoutAnimation,
  Text,
  View
} from "react-native";
import styles from "./FormStyle";
import Section from "./Section";
import { getErrors, getFirstKey, sortObjects } from "./Util";
import _ from "lodash";
import ErrorStrip from "./ErrorStrip";

class Form extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errorSchema: {}
    };
  }

  //Deine to store the value
  _viewsX = {};
  orderedSection = {};

  /**'Method execute when the all the form is display and calculate the position of the form element
   * @param  {string} section
   * @param  {string} key
   * @param  {number} x
   */
  storeLayoutX = (section, key, value) => {
    this._viewsX[key] = { section: section, value: value };
  };

  componentWillUnmount() {
    this.orderedSection = {};
  }

  /**
   * Method calculate the position of the section
   * @param  {string} key
   * @param  {number} x
   */
  storeLayoutSection = (key, x) => {
    this.orderedSection[key] = x;
  };
  /**
   * Method defines the reference to scoll to point
   * @param  {object} ref
   */
  setScrollViewRef = ref => {
    this.scrollViewRef = ref;
  };
  /**
   * Method executes when the error messge is arrise
   * and scroll to that error item
   * @param  {string} key
   */

  scrollToItem = errorSchema => {
    if (errorSchema && !_.isEmpty(errorSchema)) {
      let x = sortObjects(this._viewsX, "value");
      let _views = _.intersection(x, errorSchema);

      let key;
      if (_views.length > 0) key = _views[0];
      else return;

      if (!this._viewsX[key]) return;
      // check for key belongs from section of index 0
      let y = this._viewsX[key].value;
      if (this._viewsX[key].section != this.orderedSection[0]) {
        // check for next section
        let _containsSection = [];
        let orderArr = this.props.uiSchema["ui:order"];
        for (let index = orderArr.length - 1; index >= 0; index--) {
          const element = orderArr[index];
          _containsSection.push(element);
          if (this._viewsX[key].section == element) break;
        }
        let _orderedSection = { ...this.orderedSection };
        _orderedSection = _.omit(this.orderedSection, _containsSection);
        let _sum = 0;
        // get the section height and add it to the element height
        Object.keys(_orderedSection).map(_key => {
          _sum += _orderedSection[_key];
        });
        y = y + _sum;
      }
      // Timeout cause react-native sometimes doesn't start scrolling
      // if some UI update is going on
      setTimeout(() => {
        this.scrollViewRef.scrollTo({
          x: 0,
          y: y,
          animated: true
        });
      }, 100);
    }
  };

  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }
  /**
   * Method handles the all the elements in the form and their value
   * @param  {string} key
   * @param  {string} value
   */
  handleData = (key, value) => {
    let updatedFormData = { ...this.props.formData, [key]: value };
    this.props.onChange(updatedFormData);
    if (this.state.errorSchema && Object.keys(this.state.errorSchema).length) {
      this.updateErrors(false, updatedFormData);
    }
  };
  /**
   * Method render the all the schema nad render all the form elements
   * @param  {object} schema
   * @param  {object} uiSchema
   * @param  {object} formData
   * @param  {object} errorSchema
   */
  renderSchemaByUiOrder = (schema, uiSchema, formData, errorSchema) => {
    return uiSchema["ui:order"].map(item => {
      const uiProperties = schema.properties[item].properties;
      const requiredList = schema.properties[item]["required"];
      const errors = errorSchema[item];
      const uiOrder = uiSchema[item];
      return (
        <Section
          key={item}
          title={schema.properties[item].title}
          description={schema.properties[item].description || null}
          keyName={item}
          properties={uiProperties}
          requiredList={requiredList}
          uiOrder={uiOrder}
          handleData={this.handleData}
          formData={formData}
          sectionErrors={errors}
          storeLayoutX={this.storeLayoutX}
          storeLayoutSection={this.storeLayoutSection}
        />
      );
    });
  };

  updateErrors = (scrollToError, updatedFormData) => {
    const errorSchema = getErrors(
      this.props.schema,
      updatedFormData ? updatedFormData : this.props.formData
    );

    let _numberFields = this.props.numberFields;
    let _formData = this.props.formData;

    if (errorSchema && _numberFields) {
      _.mapKeys(errorSchema, function (fields, section) {
        _.mapKeys(fields, function (value, field) {
          let _checkForNumber;
          let _checkForValue;
          try {
            _checkForNumber = _numberFields[section][field];
          } catch (error) { }

          if (_checkForNumber) {
            try {
              _checkForValue = _formData[section][field];
              _checkForValue = !isNaN(_checkForValue);
            } catch (error) { }
          }

          if (_checkForValue) delete errorSchema[section][field];
        });

        if (_.isEmpty(errorSchema[section])) delete errorSchema[section];
      });
    }
    // let _temp = false;
    // if (!_.isEmpty(errorSchema)) _temp = true;

    this.setState({ errorSchema: errorSchema });
    if (scrollToError && errorSchema) {
      this.scrollToItem(getFirstKey(errorSchema));
    }
    return errorSchema;
  };
  /**
   * Method executes when press the submit button
   */
  onPressSubmit = IsSubmitted => {
    const errorSchema = this.updateErrors(true);
    this.props.onSubmit(errorSchema, this.props.formData, IsSubmitted);
  };

  render() {
    const { schema, uiSchema, formData, formName } = this.props;
    const { errorSchema } = this.state;
    return (
      <View style={styles.container}>
        {errorSchema && _.keys(errorSchema).length > 0 && (
          <ErrorStrip
            message={"Please complete all fields"}
            onPress={() => {
              this.updateErrors(true);
            }}
          />
        )}
        <ScrollView style={styles.container} ref={this.setScrollViewRef}>
          {this.renderSchemaByUiOrder(schema, uiSchema, formData, errorSchema)}
          <Button full onPress={this.onPressSubmit} style={styles.button}>
            <Text>Submit</Text>
          </Button>
        </ScrollView>
      </View>
    );
  }
}

export default Form;
