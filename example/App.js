/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Form from '@androconsis/react-native-jsonschema-form';
import data from './src/jsonSchema/data';

export default class App extends Component {
  state = {
    output: ""
  }

  onChange = (formData) => {
    console.log(formData);
  }

  onSubmit = (errors, formData) => {
    this.setState({ output: JSON.stringify(formData) });
  }
  render() {
    return (
      <View style={styles.container}>
        <Form
          schema={data.schema}
          uiSchema={data.uiSchema}
          formData={data.formData}
          onChange={this.onChange}
          onSubmit={this.onSubmit}
        />
        <Text>{output}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
});
