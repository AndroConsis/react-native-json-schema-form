/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text, SafeAreaView } from 'react-native';
import Form from './src/lib/src/Form';
import data from './src/jsonSchema/data';

export default class App extends Component {
  state = {
    output: ""
  }

  onChange = (formData) => {
    console.log(formData);
  }

  onSubmit = (errors, formData) => {
    console.log(errors, formData);
    this.setState({ output: JSON.stringify(formData) });
  }
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Form
          schema={{
            "title": "A registration form",
            "description": "A simple form example.",
            "type": "object",
            "required": [
              "firstName",
              "lastName"
            ],
            "properties": {
              "firstName": {
                "type": "string",
                "title": "First name",
                "default": "Chuck"
              },
              "lastName": {
                "type": "string",
                "title": "Last name",
                "default": "Lee"
              },
              "age": {
                "type": "integer",
                "title": "Age"
              },
              "bio": {
                "type": "string",
                "title": "Bio"
              },
              "password": {
                "type": "string",
                "title": "Password",
                "minLength": 3
              },
              "telephone": {
                "type": "string",
                "title": "Telephone",
                "minLength": 10
              }
            }
          }}
          onSubmit={this.onSubmit}
        />
        {/* <Form
          schema={data.schema}
          uiSchema={data.uiSchema}
          formData={data.formData}
          onChange={this.onChange}
          onSubmit={this.onSubmit}
        /> */}
        <Text>{this.state.output}</Text>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  }
});
