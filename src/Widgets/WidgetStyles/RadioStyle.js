import metrics from "../../Metrics";
import * as Colors from "../../themes/colors";

var React = require("react");
var ReactNative = require("react-native");
var { StyleSheet } = ReactNative;

var Style = StyleSheet.create({
  radioForm: {
    flex: 1
  },

  radioWrap: {
    flexDirection: "row",
    flex: 1,
    paddingLeft: metrics.radioWrapLeftPadding,
    paddingRight: metrics.radioWrapRightPadding,
    paddingTop: metrics.radioWrapTopPadding,
    paddingBottom: metrics.radioWrapBottomPadding
  },
  radio: {
    justifyContent: "center",
    alignItems: "center",
    width: 20,
    height: 20,
    alignSelf: "center",
    borderColor: Colors.dodger_blue_color,
    borderRadius: 10
  },

  radioLabel: {
    fontSize: 15,
    //fontSize: metrics.textInputFontSize,
    paddingLeft: 12,
    lineHeight: 20
  },

  radioNormal: {
    borderRadius: 5
  },

  radioActive: {
    width: 20,
    height: 20,
    backgroundColor: Colors.dodger_blue_color
  },

  labelWrapStyle: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center"
  },

  labelVerticalWrap: {
    flexDirection: "column",
    paddingLeft: 10
  },

  labelVertical: {
    paddingLeft: 0
  },

  formHorizontal: {
    flexDirection: "row"
  },
  title: {
    marginLeft: metrics.labelMarginLeft,
    marginRight: metrics.labelMarginRight,
    marginTop: metrics.labelMarginTop
  }
});

module.exports = Style;
