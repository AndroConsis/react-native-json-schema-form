import { Platform, PixelRatio, Dimensions } from "react-native";
const windowSize = Dimensions.get("window");

class DeviceInformation {
    height = Dimensions.get("window").height;

    isAndroid = () => {
        if (Platform.OS === "android") return true;
        return false;
    }

    isIos = () => {
        if (Platform.OS === "ios") return true;
        return false;
    }

    isTablet = () => {
        let pixelDensity = PixelRatio.get();
        let width = windowSize.width;
        let height = windowSize.height;
        let adjustedWidth = width * pixelDensity;
        let adjustedHeight = height * pixelDensity;
        let isDeviceTablet;

        if (pixelDensity < 2 && (adjustedWidth >= 1000 || adjustedHeight >= 1000)) {
            isDeviceTablet = true;
            return isDeviceTablet;
        } else if (
            pixelDensity === 2 &&
            (adjustedWidth >= 1920 || adjustedHeight >= 1920)
        ) {
            isDeviceTablet = true;
            return isDeviceTablet;
        } else {
            isDeviceTablet = false;
            return isDeviceTablet;
        }
    };

    isIphoneX = () => {
        return (
            this.isIos() &&
            !Platform.isPad &&
            !Platform.isTVOS &&
            (windowSize.height === 812 ||
                windowSize.width === 812 ||
                (windowSize.height === 896 || windowSize.width === 896))
        );
    }
}

const deviceInfo = new DeviceInformation();
export default deviceInfo;
