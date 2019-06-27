import metrics from "../../Metrics";

const styles = {
  container: {
    height: 50,
    flexDirection: 'row',
    paddingTop: 15,
  },
  checkBoxAlign:{
    paddingLeft: 20,
  },
  wrapper: {
    flex: 1,
    marginTop: 8,
    padding: metrics.doubleBaseMargin
  },
  title: {
    marginLeft: metrics.labelMarginLeft,
    marginRight: metrics.labelMarginRight,
    marginTop: metrics.labelMarginTop
  },
  description: {
    marginHorizontal: metrics.radioWrapLeftPadding,
    fontSize: metrics.textInputFontSize
  },
  disableText: {
    color: "#D3D3D3",
    paddingLeft: 10,
  },
  CheckBoxTitle: {
    fontSize: 15,
    paddingLeft: 10,
    color: "black"
  }
};

export default styles;
