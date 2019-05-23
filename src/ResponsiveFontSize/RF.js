import { StatusBar } from "react-native";
import deviceInfo from "./DeviceInformation";

const height = deviceInfo.height;

export default function RF(percent) {
  let deviceHeight = height;
  if (deviceInfo.isIos()) {
    if (deviceInfo.isIphoneX()) {
      deviceHeight = height - 78;
    } else if (deviceInfo.isTablet()) {
      deviceHeight = height - 200;
    }
  } else if (deviceInfo.isAndroid()) {
    if (deviceInfo.isTablet()) {
      deviceHeight = height - StatusBar.currentHeight - 200;
    } else {
      deviceHeight = height - StatusBar.currentHeight + 100;
    }
  }
  let heightPercent = (percent * deviceHeight) / 100;
  return Math.round(heightPercent);
}
