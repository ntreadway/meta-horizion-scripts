import { Component } from "horizon/core";
import { componentUtil_Data } from "UtilComponent_Data";


class UtilComponent_Entity extends Component<typeof UtilComponent_Entity> {
  static propsDefinition = {};

  preStart() {
    componentUtil_Data.component = this;
  }

  start() {

  }
}
Component.register(UtilComponent_Entity);