// By @nicktea please do share without my approval, not for resale.
import * as hz from 'horizon/core';
import * as ui from 'horizon/ui';

class customUIImage extends ui.UIComponent<typeof customUIImage> {
  static propsDefinition = {
    backgroundImage: {type: hz.PropTypes.Asset},
  };

  initializeUI(): ui.UINode {
    return ui.View({
      children: [
        ui.Image({
          source: ui.ImageSource.fromTextureAsset(this.props.backgroundImage!),
          style: {
            width: '100%',
            height: '100%',
            position: 'absolute',
          },
        }),
      ],
      style: {
        width: '100%',
        height:'100%',
      },
    })
    
  }
  start() {

  }
}
hz.Component.register(customUIImage);