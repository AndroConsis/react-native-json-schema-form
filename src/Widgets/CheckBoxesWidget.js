import React, { Component } from "react";
import { updateArray } from "../Util";
import AllCheckBox from "../Fields/Checkbox";
/**
 * @classdesc Component handles the Checkbox Widget for the json schema form for ios
 */
class CheckBoxesWidget extends Component {
  constructor(props) {
    super(props);
  }
  /**
   * Method executes when pressed any checkbox in the form in Ios
   * @param  {string} pressedItem
   */
  onItemPress = pressedItem => {
    this.props.onChange(
      this.props.idSchema,
      updateArray(this.props.value, pressedItem)
    );
  };
  componentWillUnmount() {
    //this.props.onChange(this.props.idSchema, undefined);
  }
  shouldComponentUpdate(nextProps) {
    if (nextProps["value"] !== this.props["value"]) {
      return true;
    }
    return false;
  }
  /**
   * Method executes and display the checkbox item in the form in Ios
   * @param  {string} items
   * @returns appliction
   */
  renderItems = items => {
    return items.anyOf.map(item => {
      return (
        <AllCheckBox
          key={item.title}
          title={item.title}
          enumValue={item.enum}
          value={this.props.value}
          onItemPress={this.onItemPress}
          disabled={this.props.disabled}
          onChange={this.props.onChange}
          idSchema={this.props.idSchema}
          deselectAlert={this.props.deselectAlert}
        />
      );
    });
  };
  render() {
    const { items } = this.props;
    return this.renderItems(items);
  }
}

export default CheckBoxesWidget;
