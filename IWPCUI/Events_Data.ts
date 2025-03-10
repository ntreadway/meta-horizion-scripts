import { Color, LocalEvent } from "horizon/core";


export const Events = {
  localEvents: {
    colorHat: new LocalEvent<{ color: Color }>('colorHat'),
  },
}