import React from "react";
import DatePicker from "react-native-datepicker";
import metrics from "../Metrics";
import { getMaxDate } from "../Util";
/**
 * Method gives the Dtaepicker widget in the json schema form
 * @param  {object} props
 */
const DateWidget = props => {
  const { value, onChange, idSchema } = props;
  const maxDateValue = getMaxDate(idSchema);
  return (
    <DatePicker
      style={styles.container}
      date={value}
      mode="date"
      placeholder="Select date"
      format="MM-DD-YYYY"
      minDate="1900-05-01"
      maxDate={maxDateValue}
      confirmBtnText="Confirm"
      cancelBtnText="Cancel"
      customStyles={{
        dateIcon: {
          position: "absolute",
          height: 30,
          width: 30,
          right: 12,
          top: 12,
          marginLeft: 0
        },
        dateInput: {
          borderWidth: 1,
          borderRadius: metrics.textInputBorderRadius,
          marginLeft: metrics.labelMarginLeft,
          marginRight: metrics.labelMarginRight,
          marginTop: metrics.textInputMarginTop,
          fontSize: metrics.textInputFontSize,
          borderColor: "#B0B0B0"
        }
      }}
      onDateChange={value => {
        onChange(idSchema, value);
      }}
      accessibilityLabel={"DatePicker_DatePickerView"}
      testID={"DatePicker_DatePickerView"}
    />
  );
};

export default DateWidget;
const styles = {
  container: {
    flex: 1,
    width: "100%"
  },
  title: {
    marginLeft: metrics.labelMarginLeft,
    marginRight: metrics.labelMarginRight,
    marginTop: metrics.labelMarginTop
  }
};
