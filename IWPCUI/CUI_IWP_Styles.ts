import { cuiBaseStyles } from "CUI_BaseStyles_Data";
import { ImageStyle, TextStyle, ViewStyle } from "horizon/ui"


const buttonText: TextStyle = {
  ...cuiBaseStyles.buttonText,
};

const buttonBackground: ViewStyle = {
  ...cuiBaseStyles.buttonBackground,
};

const buttonsStyle: ViewStyle = {
  ...cuiBaseStyles.buttonsStyle,
};

const containerStyle: ViewStyle = {
  ...cuiBaseStyles.containerStyle,
};

const imageStyle: ImageStyle = {
  ...cuiBaseStyles.imageStyle,
};


export const cuiIWPStyles = {
  buttonText,
  buttonBackground,
  buttonsStyle,
  containerStyle,
  imageStyle,
}