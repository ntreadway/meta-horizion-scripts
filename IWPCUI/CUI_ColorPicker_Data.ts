import { PurchasableColor } from "CUI_ColorPicker_Defs";
import { Color } from "horizon/core"


const allColorsArray: PurchasableColor[] = [
  //Defaults
  { name: 'Navy Blue', color: new Color(0.067, 0.149, 0.647), price: 1 },
  { name: 'Midnight Black', color: new Color(0, 0, 0), price: 1 },
  { name: 'Deep Lavender', color: new Color(0.706, 0.537, 0.937), price: 1 },
  { name: 'Mushy Green', color: new Color(0.251, 0.753, 0.063), price: 1 },
  { name: 'Maroon', color: new Color(0.502, 0, 0), price: 1 },

  //Winter
  { name: 'Winter Grey', color: new Color(0.592, 0.712, 0.835), price: 2 },
  { name: 'Winter Blue', color: new Color(0.184, 0.467, 0.765), price: 2 },
  { name: 'Winter Sky', color: new Color(0.631, 0.882, 1), price: 2 },
  { name: 'Winter Mountains', color: new Color(0.012, 0.09, 0.188), price: 2 },
  { name: 'Winter Snow', color: new Color(1, 1, 1), price: 2 },

    //Spring
    { name: 'Spring Blossom', color: new Color(0.973, 0.702, 0.925), price: 2 },
    { name: 'Spring Barbie', color: new Color(0.976, 0.286, 0.580), price: 2 },
    { name: 'Spring Purple', color: new Color(0.794, 0.512, 0.951), price: 2 },
    { name: 'Spring Grass', color: new Color(0.278, 0.565, 0.012), price: 2 },
    { name: 'Spring Leaves', color: new Color(0.643, 0.82, 0.227), price: 2 },

    //Summer
    { name: 'Summer Sand', color: new Color(0.933, 0.886, 0.588), price: 2 },
    { name: 'Summer Waves', color: new Color(0.016, 0.749, 0.678), price: 2 },
    { name: 'Summer Blue', color: new Color(0.341, 0.647, 0.965), price: 2 },
    { name: 'Summer Lemon', color: new Color(1, 0.969, 0), price: 2 },
    { name: 'Summer Sunset', color: new Color(0.949, 0.42, 0.42), price: 2 },
    
    //Fall
    { name: 'Fall Red', color: new Color(0.694, 0.082, 0.035), price: 2 },
    { name: 'Fall Orange', color: new Color(0.988, 0.369, 0.114), price: 2 },
    { name: 'Fall Yellow', color: new Color(0.922, 0.6, 0.067), price: 2 },
    { name: 'Fall Beige', color: new Color(0.898, 0.753, 0.537), price: 2 },
    { name: 'Fall Brown', color: new Color(0.51, 0.325, 0.22), price: 2 },
    
    //Holiday
    { name: 'Holiday Tree', color: new Color(0.2, 0.365, 0.016), price: 2 },
    { name: 'Holiday Mint', color: new Color(0.596, 1, 0.596), price: 2 },
    { name: 'Holiday Night', color: new Color(0.061, 0.202, 0.479), price: 2 },
    { name: 'Holiday Lights', color: new Color(0.843, 0.133, 0.027), price: 2 },
    { name: 'Holiday Candle', color: new Color(1, 0.941, 0.545), price: 2 },
    
    //Love
    { name: 'Love Soft Pink', color: new Color(1, 0.773, 0.902), price: 2 },
    { name: 'Love Pink', color: new Color(1, 0.145, 0.494), price: 2 },
    { name: 'Love Red', color: new Color(0.839, 0, 0), price: 2 },
    { name: 'Love Purple', color: new Color(0.812, 0.271, 0.85), price: 2 },
    { name: 'Love Maroon', color: new Color(0.580, 0.145, 0.298), price: 2 },
        
    //Leprechaun
    { name: 'Leprechaun Luck', color: new Color(0.114, 0.859, 0), price: 2 },
    { name: 'Leprechaun Boots', color: new Color(0.824, 0.522, 0.149), price: 2 },
    { name: 'Leprechaun Yellow', color: new Color(0.992, 1, 0), price: 2 },
    { name: 'Leprechaun Gold', color: new Color(1, 0.843, 0), price: 2 },
    { name: 'Leprechaun Clover', color: new Color(0.051, 0.641, 0.054), price: 2 },
];

const availableColorArray: PurchasableColor[] = [];

const allColorMap = new Map<string, PurchasableColor>();
allColorsArray.forEach((purchasableColor) => { allColorMap.set(purchasableColor.name, purchasableColor); });


availableColorArray.push(allColorsArray[0]);
availableColorArray.push(allColorsArray[1]);
availableColorArray.push(allColorsArray[2]);
availableColorArray.push(allColorsArray[3]);
availableColorArray.push(allColorsArray[4]);


let key = 'Winter';

const currentMonth = new Date().getMonth();

if (currentMonth < 2 || currentMonth === 11) {
  key = 'Winter';
}
else if (currentMonth < 5) {
  key = 'Spring';
}
else if (currentMonth < 8) {
  key = 'Summer';
}
else if (currentMonth < 11) {
  key = 'Fall';
}


if (currentMonth === 11) {
  key = 'Holiday';
}
else if (currentMonth === 1) {
  key = 'Love';
}
else if (currentMonth === 2) {
  key = 'Leprechaun';
}


allColorsArray.forEach((purchasableColor) => {
  if (purchasableColor.name.indexOf(key) === 0) {
    availableColorArray.push(purchasableColor);
  }
});


export const colorPicker_Data = {
  allColorMap,
  availableColorArray,
}

