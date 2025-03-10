import { overTime } from "UtilMotionOverTime_Func";
import { Component, Entity, Quaternion, Vec3, World } from "horizon/core";

let oncePerWorld = true; //This boolean prevents multiple OverTime entities from connecting onUpdate

//Make sure to attach this script to just *ONE* object in the world
class OverTime extends Component<typeof OverTime> {
  static propsDefinition = {};

  preStart() {
    if (oncePerWorld) {
      oncePerWorld = false;
      this.connectLocalBroadcastEvent(World.onUpdate, (payload: { deltaTime: number }) => { onUpdate(payload.deltaTime) });
    }
  }

  start() {

  }
}
Component.register(OverTime);


function onUpdate(deltaTime: number) {
  const curTimeSinceEpoch = Date.now();

  updateScalingEntities(curTimeSinceEpoch);
  updateMovingEntities(curTimeSinceEpoch);
  updateRotatingEntities(curTimeSinceEpoch);
}


function updateScalingEntities(curTimeSinceEpoch: number) {
  const curScaling = overTime.scaleTo.getAll();
  const curScalingToRemove: Entity[] = [];

  curScaling.forEach((entityInMotion) => {
    if (entityInMotion.endTime > curTimeSinceEpoch) {
      const percentComplete = (curTimeSinceEpoch - entityInMotion.startTime) / entityInMotion.durationMs;

      if (entityInMotion.start instanceof Vec3 && entityInMotion.end instanceof Vec3) {
        entityInMotion.entity.scale.set(Vec3.lerp(entityInMotion.start, entityInMotion.end, percentComplete));
      }
    }
    else {
      if (entityInMotion.end instanceof Vec3) {
        entityInMotion.entity.scale.set(entityInMotion.end);
      }

      curScalingToRemove.push(entityInMotion.entity);
    }
  });

  curScalingToRemove.forEach((entity) => {
    overTime.scaleTo.cancel(entity);
  });
}

function updateMovingEntities(curTimeSinceEpoch: number) {
  const curMoving = overTime.moveTo.getAll();
  const curMovingToRemove: Entity[] = [];

  curMoving.forEach((entityInMotion) => {
    if (entityInMotion.endTime > curTimeSinceEpoch) {
      const percentComplete = (curTimeSinceEpoch - entityInMotion.startTime) / entityInMotion.durationMs;

      if (entityInMotion.start instanceof Vec3 && entityInMotion.end instanceof Vec3) {
        entityInMotion.entity.position.set(Vec3.lerp(entityInMotion.start, entityInMotion.end, percentComplete));
      }
    }
    else {
      if (entityInMotion.end instanceof Vec3) {
        entityInMotion.entity.position.set(entityInMotion.end);
      }

      curMovingToRemove.push(entityInMotion.entity);
    }
  });

  curMovingToRemove.forEach((entity) => {
    overTime.moveTo.cancel(entity);
  });
}

function updateRotatingEntities(curTimeSinceEpoch: number) {
  const curRotating = overTime.rotateTo.getAll();
  const curRotatingToRemove: Entity[] = [];

  curRotating.forEach((entityInMotion) => {
    if (entityInMotion.endTime > curTimeSinceEpoch) {
      const percentComplete = (curTimeSinceEpoch - entityInMotion.startTime) / entityInMotion.durationMs;

      if (entityInMotion.start instanceof Quaternion && entityInMotion.end instanceof Quaternion) {
        entityInMotion.entity.rotation.set(Quaternion.slerp(entityInMotion.start, entityInMotion.end, percentComplete));
      }
    }
    else {
      if (entityInMotion.end instanceof Quaternion) {
        entityInMotion.entity.rotation.set(entityInMotion.end);
      }

      curRotatingToRemove.push(entityInMotion.entity);
    }
  });

  curRotatingToRemove.forEach((entity) => {
    overTime.rotateTo.cancel(entity);
  });
}
