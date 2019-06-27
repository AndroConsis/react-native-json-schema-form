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
            "type": "number",
            // "properties": {
            //   "number": { "type": "number" },
            //   "street_name": { "type": "string" },
            //   "street_type": {
            //     "type": "string",
            //     "enum": ["Street", "Avenue", "Boulevard"]
            //   }
            // }
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
