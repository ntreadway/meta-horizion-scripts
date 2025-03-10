import { Events } from "Events_Data";
import { Color, Component, MeshEntity, PropTypes } from "horizon/core";
import { colorUtils } from "UtilColor_Func";


class Hat_Entity extends Component<typeof Hat_Entity> {
  static propsDefinition = {
    colorItem1: { type: PropTypes.Entity },
    colorItem2: { type: PropTypes.Entity },
  };

  preStart() {
    this.connectLocalEvent(this.entity, Events.localEvents.colorHat, (payload: { color: Color }) => { this.colorItems(payload.color); });
  }

  start() {

  }

  colorItems(color: Color) {
    colorUtils.tintMesh(color, this.props.colorItem1?.as(MeshEntity), 1, 0.5);
    colorUtils.tintMesh(color, this.props.colorItem2?.as(MeshEntity), 1, 0.5);
  }
}
Component.register(Hat_Entity);