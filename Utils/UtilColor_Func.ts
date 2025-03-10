import { Color, MeshEntity, Vec3 } from "horizon/core";

export const colorUtils = {
  lerpColor,
  tintMesh,
  areColorsEqual,
  isColorInArray,
  indexOfColorInArray,
  clampColorDecimalPlaces,
}



/**
* Lerp from the start color to the end color by some percent
* @param percent Number from 0 to 1
*/
function lerpColor(startColor: Color, endColor: Color, percent: number): Color {
  const colorVec = Vec3.lerp(startColor.toVec3(), endColor.toVec3(), percent);
  
  return new Color(colorVec.x, colorVec.y, colorVec.z);
}


/**
* Change the color of a MeshEntity
* @param color The color to apply
* @param meshEntity The entity to change
* @param tintStrength How saturated the color should be (number from 0 to 1, default of 1)
* @param brightness How bright the color should be (number from 0 to 1, default of 1)
*/
function tintMesh(color: Color, meshEntity: MeshEntity | undefined | null, tintStrength: number = 1, brightness: number = 1) {
  if (meshEntity) {
    meshEntity.style.tintColor.set(clampColor(color));
    meshEntity.style.tintStrength.set(Math.max(Math.min(tintStrength, 1), 0));
    meshEntity.style.brightness.set(Math.max(Math.min(brightness, 1), 0));
  }
}

function clampColor(color: Color): Color {
  return new Color(
    Math.max(Math.min(color.r, 1), 0),
    Math.max(Math.min(color.g, 1), 0),
    Math.max(Math.min(color.b, 1), 0)
  );
}

function areColorsEqual(colorA: Color, colorB: Color): boolean {
  return (colorA.r === colorB.r && colorA.g === colorB.g && colorA.b === colorB.b); // || (colorA.toString() === colorB.toString())
}

function isColorInArray(color: Color, colors: Color[]): boolean {
  return indexOfColorInArray(color, colors) !== undefined;
}

function indexOfColorInArray(color: Color, colors: Color[]): number | undefined {
  const colorIndex = colors.findIndex((colorB) => colorUtils.areColorsEqual(color, colorB));

  if (colorIndex >= 0) {
    return colorIndex;
  }
  else {
    return undefined;
  }
}

function clampColorDecimalPlaces(color: Color): Color {
  const newColor = color.clone();

  newColor.r = parseFloat((newColor.r + 0.004).toFixed(2));
  newColor.g = parseFloat((newColor.g + 0.004).toFixed(2));
  newColor.b = parseFloat((newColor.b + 0.004).toFixed(2));

  return newColor;
}