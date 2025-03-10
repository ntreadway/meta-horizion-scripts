import { cuiBaseStyles } from "CUI_BaseStyles_Data";
import { Color } from "horizon/core";
import { ImageStyle, TextStyle, ViewStyle } from "horizon/ui"


const buttonText: TextStyle = {
  ...cuiBaseStyles.buttonText,
}

const buttonBackground: ViewStyle = {
  ...cuiBaseStyles.buttonBackground,
  width: 45,
  height: 25,
}

const buttonsStyle: ViewStyle = {
  ...cuiBaseStyles.buttonsStyle,
  flexDirection: 'row',
  position: 'absolute',
  top: 340,
}

const containerStyle: ViewStyle = {
  ...cuiBaseStyles.containerStyle,
}

const imageStyle: ImageStyle = {
  ...cuiBaseStyles.imageStyle,
  position: 'absolute',
  top: 110,
  width: 185,
  height: 185,
  resizeMode: 'stretch',
  borderColor: Color.white,
  borderWidth: 4,
  borderRadius: 200,
}

const imageTitleTextStyle: TextStyle = {
  position: 'absolute',
  top: 305,
}

const imageSubTitleTextStyle: TextStyle = {
  position: 'absolute',
  fontSize: 12,
  top: 325,
}

const iconImageStyle: ImageStyle = {
  ...cuiBaseStyles.imageStyle,
  position: 'relative',
  width: 65,
  height: 65,
  resizeMode: 'stretch',
  borderColor: Color.white,
  borderWidth: 2,
  borderRadius: 50,
  margin: 4,
  tintOperation: 'multiply',
}

const arrowImageStyle: ImageStyle = {
  width: 30,
  height: 20,
  position: 'absolute',
  top: 3,
}

const titleTextStyle: TextStyle = {
  fontWeight: 'bold',
  fontFamily: 'Anton',
  fontSize: 35,
  position: 'absolute',
  top: 50,
}

const tokenBalanceTextStyle: TextStyle = {
  fontSize: 24,
  fontFamily: 'Anton',
  fontWeight: 'bold',
  textAlign: 'center',
  marginTop: '2%',
  position: 'absolute',
  top: 400,
}

const rowImagesContainerStyle: ViewStyle = {
  flexDirection: 'row',
  flexWrap: 'wrap',
  width: '100%',
  height: '50%',
  justifyContent: 'space-around',
  paddingTop: '5%',
  paddingLeft: '10%',
  paddingRight: '10%',
}


export const cuiHatsStyles = {
  buttonText,
  buttonBackground,
  buttonsStyle,
  containerStyle,
  imageStyle,
  imageTitleTextStyle,
  imageSubTitleTextStyle,
  arrowImageStyle,
  titleTextStyle,
  tokenBalanceTextStyle,
  iconImageStyle,
  rowImagesContainerStyle,
}