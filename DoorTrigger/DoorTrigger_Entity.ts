import { CodeBlockEvents, Component, Player, PropTypes, Vec3 } from "horizon/core";
import { arrayUtils } from "UtilArray_Func";
import { overTime } from "UtilMotionOverTime_Func";


class DoorTrigger_Entity extends Component<typeof DoorTrigger_Entity> {
  static propsDefinition = {
    entityToMove: { type: PropTypes.Entity },
    destPos: { type: PropTypes.Entity },
    moveDurationMs: { type: PropTypes.Number, default: 5000 },
  };

  orgPos = Vec3.zero;
  destPos = Vec3.zero;

  playersInMe: Player[] = [];

  preStart() {
    this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnPlayerEnterTrigger, this.playerEnterTrigger.bind(this));
    this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnPlayerExitTrigger, this.playerExitTrigger.bind(this));

    this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnPlayerExitWorld, this.playerExitWorld.bind(this));
  }

  start() {
   this.orgPos = this.props.entityToMove?.position.get() ?? Vec3.zero;
   this.destPos = this.props.destPos?.position.get() ?? Vec3.zero;
  }

  playerEnterTrigger(player: Player) {
    if (!this.playersInMe.includes(player)) {
      this.playersInMe.push(player);
    }

    if (this.props.entityToMove && this.playersInMe.length === 1) {
      overTime.moveTo.start(this.props.entityToMove, this.destPos, this.props.moveDurationMs);
    }
  }

  playerExitTrigger(player: Player) {
    if (this.playersInMe.includes(player)) {
      arrayUtils.removeItemFromArray(this.playersInMe, player);
    }

    if (this.props.entityToMove && this.playersInMe.length === 0) {
      overTime.moveTo.start(this.props.entityToMove, this.orgPos, this.props.moveDurationMs);
    }
  }

  playerExitWorld(player: Player) {
    if (this.playersInMe.includes(player)) {
      this.playerExitTrigger(player);
    }
  }
}
Component.register(DoorTrigger_Entity);