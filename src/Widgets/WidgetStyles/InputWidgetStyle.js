import metrics from "../../Metrics";
import { StyleSheet } from "react-native";

export const styles = {
  container: {
    flex: 1
  },
  textinputWrapper: {
    padding: 0
  },
  textInput: {
    marginLeft: metrics.labelMarginLeft,
    marginRight: metrics.labelMarginRight,
    marginTop: metrics.textInputMarginTop,
    borderWidth: 1,
    borderRadius: metrics.textInputBorderRadius,
    padding: metrics.textInputPadding,
    borderColor: "#B0B0B0",
    fontSize: metrics.textInputFontSize
  },
  title: {
    marginLeft: metrics.labelMarginLeft,
    marginRight: metrics.labelMarginRight,
    marginTop: 16,
    marginBottom: 6,
    fontSize: 16,
    fontWeight: "bold",
    color: "black"
  },
  title1: {
    marginLeft: metrics.labelMarginLeft,
    marginRight: metrics.labelMarginRight,
    marginTop: 16,
    marginBottom: 6,
    fontSize: 16,
    fontWeight: "bold",
    color: "grey"
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: metrics.labelMarginLeft + 10,
    paddingRight: metrics.labelMarginRight + 10
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "red",
    alignSelf: "center",
    marginRight: metrics.smallMargin
  },
  errorText: {
    color: "red"
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3E4957"
  },
  sectionHeader: {
    marginTop: metrics.labelMarginTop * 2,
    paddingVertical: metrics.sectionHeaderPadding / 2,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginLeft: metrics.sectionHeaderPadding,
    borderBottomColor: "#3E4957"
  },
  textHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#a83464"
  }
};
