"use strict";

import Style from "./WidgetStyles/RadioStyle";
import { View } from "native-base";
import * as Colors from "../themes/colors";
import _ from "lodash";
import metrics from "../Metrics";
import { shouldRender } from "../Util";

var React = require("react");
var ReactNative = require("react-native");
var { Text, TouchableOpacity } = ReactNative;

/**
 * @classdesc Component gives the radio button widget to the json schema form
 */
export default class RadioForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getStateFromProps(props);
    this._renderButton = this._renderButton.bind(this);
  }
  //Define prwevios state of the component
  static defaultProps = {
    radio_props: [],
    initial: 0,
    buttonColor: Colors.dodger_blue_color,
    selectedButtonColor: Colors.dodger_blue_color,
    formHorizontal: false,
    labelHorizontal: true,
    animation: true,
    labelColor: Colors.black_color,
    selectedLabelColor: Colors.black_color,
    wrapStyle: {},
    disabled: false
  };

  shouldComponentUpdate(nextProps) {
    if (nextProps["value"] !== this.props["value"]) {
      return true;
    }
    return false;
  }
  componentWillReceiveProps(nextProps) {
    this.state = this.getStateFromProps(nextProps);
  }

  componentWillUnmount() {
    //this.props.onChange(this.props.idSchema, undefined);
  }

  //
  /**
   * Method getting Index of option for setting form data value
   * @param  {object} props
   * @param  {Array} options
   * @returns {number} index
   * @returns {boolean} item.value
   */
  getIndexFromProps = (props, options) => {
    if (props.value) {
      return _.findIndex(options, function(item) {
        return item.value == props.value;
      });
    }
  };
  /**
   * Method executes and get option from schema to make a radioButton
   * @param  {object} props
   * @returns {} options
   */
  generateOptionFromSchema = props => {
    const options = [];
    if ("enum" in props && Array.isArray(props.enum)) {
      props.enum.forEach(item => {
        const obj = {
          value: item,
          label: item
        };
        options.push(obj);
      });
    } else if ("anyOf" in props && Array.isArray(props.anyOf)) {
      props.anyOf.forEach(item => {
        const obj = {
          value: item["enum"][0],
          label: item["title"]
        };
        options.push(obj);
      });
    }

    return options;
  };
  /**
   * Method executes and get the state of the radio button
   * @param  {object} props
   * @returns {object} options
   */
  getStateFromProps = props => {
    const options = this.generateOptionFromSchema(props);
    return {
      is_active_index: this.getIndexFromProps(props, options),
      radio_props: options
    };
  };
  /**
   * Method renders the radio button
   * @param  {object} obj
   * @param  {number} i
   */
  _renderButton(obj, i) {
    //console.log(this.state.is_active_index)
    return (
      <RadioWidget
        accessible={this.props.accessible}
        accessibilityLabel={
          this.props.accessibilityLabel
            ? this.props.accessibilityLabel + "|" + i
            : "radioButton" + "|" + i
        }
        testID={
          this.props.testID
            ? this.props.testID + "|" + i
            : "radioButton" + "|" + i
        }
        isSelected={this.state.is_active_index === i}
        obj={obj}
        key={i}
        index={i}
        buttonColor={
          this.state.is_active_index === i
            ? this.props.selectedButtonColor
            : this.props.buttonColor
        }
        buttonSize={this.props.buttonSize}
        buttonOuterSize={this.props.buttonOuterSize}
        labelHorizontal={this.props.labelHorizontal}
        labelColor={
          this.state.is_active_index === i
            ? this.props.selectedLabelColor
            : this.props.labelColor
        }
        labelStyle={this.props.labelStyle}
        style={this.props.radioStyle}
        animation={this.props.animation}
        disabled={this.props.disabled}
        onPress={value => {
          this.props.onChange(this.props.idSchema, value);
        }}
      />
    );
  }

  render() {
    let render_content = false;
    if (this.state.radio_props.length) {
      render_content = this.state.radio_props.map(this._renderButton);
    } else {
      render_content = this.props.children;
    }
    return (
      <View
        style={[
          Style.radioFrom,
          this.props.style,
          this.props.formHorizontal && Style.formHorizontal
        ]}
      >
        {this.props.description && (
          <Text style={styles.description}>{this.props.description}</Text>
        )}
        {render_content}
      </View>
    );
  }
}

export class RadioWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  shouldComponentUpdate(nextProps) {
    return shouldRender(nextProps, this.props);
  }

  static defaultProps = {
    isSelected: false,
    buttonColor: Colors.dodger_blue_color,
    selectedButtonColor: Colors.dodger_blue_color,
    labelHorizontal: true,
    disabled: false,
    idSeparator: "|"
  };
  render() {
    var c = this.props.children;

    var idSeparator = this.props.idSeparator ? this.props.idSeparator : "|";
    var idSeparatorAccessibilityLabelIndex = this.props.accessibilityLabel
      ? this.props.accessibilityLabel.indexOf(idSeparator)
      : -1;
    var idSeparatorTestIdIndex = this.props.testID
      ? this.props.testID.indexOf(idSeparator)
      : -1;

    var accessibilityLabel = this.props.accessibilityLabel
      ? idSeparatorAccessibilityLabelIndex !== -1
        ? this.props.accessibilityLabel.substring(
            0,
            idSeparatorAccessibilityLabelIndex
          )
        : this.props.accessibilityLabel
      : "radioButton";
    var testID = this.props.testID
      ? idSeparatorTestIdIndex !== -1
        ? this.props.testID.substring(0, idSeparatorTestIdIndex)
        : this.props.testID
      : "radioButton";

    var accessibilityLabelIndex =
      this.props.accessibilityLabel && idSeparatorAccessibilityLabelIndex !== -1
        ? this.props.accessibilityLabel.substring(
            idSeparatorAccessibilityLabelIndex + 1
          )
        : "";
    var testIDIndex =
      this.props.testID && testIDIndex !== -1
        ? this.props.testID.split(testIDIndex + 1)
        : "";

    var renderContent = false;
    renderContent = c ? (
      <View
        style={[
          Style.radioWrap,
          this.props.style,
          !this.props.labelHorizontal && Style.labelVerticalWrap
        ]}
      >
        {c}
      </View>
    ) : (
      <View
        style={[
          Style.radioWrap,
          this.props.style,
          !this.props.labelHorizontal && Style.labelVerticalWrap
        ]}
      >
        <RadioButtonInput
          {...this.props}
          accessibilityLabel={
            accessibilityLabel + "Input" + accessibilityLabelIndex
          }
          testID={testID + "Input" + testIDIndex}
        />
        <RadioButtonLabel
          {...this.props}
          accessibilityLabel={
            accessibilityLabel + "Label" + accessibilityLabelIndex
          }
          testID={testID + "Label" + testIDIndex}
        />
      </View>
    );
    return <View style={this.props.wrapStyle}>{renderContent}</View>;
  }
}

export class RadioButtonInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSelected: false,
      buttonColor: props.buttonColor || Colors.dodger_blue_color
    };
  }
  render() {
    var innerSize = { width: 15, height: 15, borderRadius: 15 / 2 };
    var outerSize = {
      width: 15 + 10,
      height: 15 + 10,
      borderRadius: (15 + 10) / 2
    };
    if (this.props.buttonSize) {
      innerSize.width = this.props.buttonSize;
      innerSize.height = this.props.buttonSize;
      innerSize.borderRadius = this.props.buttonSize / 2;
      outerSize.width = this.props.buttonSize + 10;
      outerSize.height = this.props.buttonSize + 10;
      outerSize.borderRadius = (this.props.buttonSize + 10) / 2;
    }
    if (this.props.buttonOuterSize) {
      outerSize.width = this.props.buttonOuterSize;
      outerSize.height = this.props.buttonOuterSize;
      outerSize.borderRadius = this.props.buttonOuterSize / 2;
    }
    var outerColor = this.props.buttonOuterColor;
    var borderWidth = this.props.borderWidth || 3;
    var innerColor = this.props.buttonInnerColor;
    if (this.props.buttonColor) {
      outerColor = this.props.buttonColor;
      innerColor = this.props.buttonColor;
    }
    var c = (
      <View
        style={[
          Style.radioNormal,
          this.props.isSelected && Style.radioActive,
          this.props.isSelected && innerSize,
          this.props.isSelected && { backgroundColor: innerColor }
        ]}
      />
    );
    var radioStyle = [
      Style.radio,
      {
        borderColor: outerColor,
        borderWidth: borderWidth
      },
      this.props.buttonStyle,
      outerSize
    ];

    if (this.props.disabled) {
      return (
        <View style={this.props.buttonWrapStyle}>
          <View style={radioStyle}>{c}</View>
        </View>
      );
    }

    return (
      <View style={this.props.buttonWrapStyle}>
        <TouchableOpacity
          accessible={this.props.accessible}
          accessibilityLabel={this.props.accessibilityLabel}
          testID={this.props.testID}
          style={radioStyle}
          hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
          onPress={() => {
            this.props.onPress(this.props.obj.value, this.props.index);
          }}
        >
          {c}
        </TouchableOpacity>
      </View>
    );
  }
}

RadioButtonInput.defaultProps = {
  buttonInnerColor: Colors.dodger_blue_color,
  buttonOuterColor: Colors.dodger_blue_color,
  disabled: false
};

export class RadioButtonLabel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSelected: false,
      buttonColor: Colors.dodger_blue_color
    };
  }
  render() {
    return (
      <TouchableOpacity
        accessible={this.props.accessible}
        accessibilityLabel={this.props.accessibilityLabel}
        testID={this.props.testID}
        onPress={() => {
          if (!this.props.disabled) {
            this.props.onPress(this.props.obj.value, this.props.index);
          }
        }}
        style={styles.container}
      >
        <View style={[this.props.labelWrapStyle]}>
          <Text
            style={[
              Style.radioLabel,
              !this.props.labelHorizontal && Style.labelVertical,
              { color: this.props.labelColor },
              this.props.labelStyle
            ]}
          >
            {this.props.obj.label}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}
const styles = {
  container: {
    flex: 1,
    justifyContent: "center"
  },
  description: {
    marginHorizontal: metrics.radioWrapLeftPadding,
    fontSize: 16,
    fontWeight: "bold",
    color: "black"
  }
};
