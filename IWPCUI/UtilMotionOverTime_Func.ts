import { arrayUtils } from "UtilArray_Func";
import { Entity, Quaternion, Vec3 } from "horizon/core"

let id = 0;
const scalingEntities: EntityInMotion[] = [];
const movingEntities: EntityInMotion[] = [];
const rotatingEntities: EntityInMotion[] = [];


export const overTime = {
  scaleTo: {
    /**
     * Start a scaling motion on an entity (cancels any previous scaling applied to the entity)
     * @param entity Entity to affect
     * @param scaleTo End scale
     * @param durationMs Time in Ms to reach the scaleTo
     * @returns `number` ID that can be used to cancel this scaleTo
     */
    start: addScalingEntity,

    /**
     * Cancel an object that is currently scaling
     * @param identifier Either the number ID assigned when scaleTo was started, or the entity that is scaling
     */
    cancel: cancelScalingEntity,
    
    /**
     * @returns an array of all currently scaling `EntityInMotion` 
     */
    getAll: getScalingEntities,
  },

  moveTo: {
    /**
     * Start moving an entity (cancels any previous moveTo applied to the entity)
     * @param entity Entity to affect
     * @param moveTo End position
     * @param durationMs Time in Ms to reach the moveTo
     * @returns `number` ID that can be used to cancel this moveTo
     */
    start: addMovingEntity,

    /**
     * Cancel an object that is currently moving
     * @param identifier Either the number ID assigned when moveTo was started, or the entity that is moving
     */
    cancel: cancelMovingEntity,
    
    /**
     * @returns an array of all currently moving `EntityInMotion` 
     */
    getAll: getMovingEntities,
  },

  rotateTo: {
    /**
     * Start rotating an entity (cancels any previous rotation applied to the entity)
     * @param entity Entity to affect
     * @param rotateTo End rotation
     * @param durationMs Time in Ms to reach the rotateTo
     * @returns `number` ID that can be used to cancel this rotateTo
     */
    start: addRotatingEntity,

    /**
     * Cancel an object that is currently rotating
     * @param identifier Either the number ID assigned when rotateTo was started, or the entity that is rotating
     */
    cancel: cancelRotatingEntity,
    
    /**
     * @returns an array of all currently rotating `EntityInMotion` 
     */
    getAll: getRotatingEntities,
  },
}


/* Scale To Over Time */

function getScalingEntities(): EntityInMotion[] {
  return scalingEntities;
}

function addScalingEntity(entity: Entity, scaleTo: Vec3, durationMs: number): number {
  cancelScalingEntity(entity);
  
  id++;

  addEntityInMotionToArray(entity, entity.scale.get(), scaleTo, durationMs, id, scalingEntities);

  return id;
}

function cancelScalingEntity(identifier: number | Entity) {
  cancelFromArray(identifier, scalingEntities);
}


/* Move To Over Time */

function getMovingEntities(): EntityInMotion[] {
  return movingEntities;
}

function addMovingEntity(entity: Entity, moveTo: Vec3, durationMs: number): number {
  cancelMovingEntity(entity);
  
  id++;

  addEntityInMotionToArray(entity, entity.position.get(), moveTo, durationMs, id, movingEntities);

  return id;
}

function cancelMovingEntity(identifier: number | Entity) {
  cancelFromArray(identifier, movingEntities);
}


/* Rotate To Over Time */

function getRotatingEntities(): EntityInMotion[] {
  return rotatingEntities;
}

function addRotatingEntity(entity: Entity, rotateTo: Quaternion, durationMs: number): number {
  cancelRotatingEntity(entity);
  
  id++;

  addEntityInMotionToArray(entity, entity.rotation.get(), rotateTo, durationMs, id, rotatingEntities);

  return id;
}

function cancelRotatingEntity(identifier: number | Entity) {
  cancelFromArray(identifier, rotatingEntities);
}


/* Helper Functions */

function cancelFromArray(identifier: number | Entity, array: EntityInMotion[]) {
  let cancelIndex = -1;
  
  array.forEach((entityInMotion, index) => {
    if (entityInMotion.id === identifier || entityInMotion.entity === identifier) {
      cancelIndex = index;
    }
  });

  if (cancelIndex >= 0) {
    arrayUtils.removeItemAtIndexFromArray(array, cancelIndex);
  }
}


function addEntityInMotionToArray(entity: Entity, start: Vec3 | Quaternion, end: Vec3 | Quaternion, durationMs: number, id: number, array: EntityInMotion[]) {
  const curTimeSinceEpoch = Date.now();

  const entityInMotion: EntityInMotion = {
    entity: entity,
    startTime: curTimeSinceEpoch,
    endTime: curTimeSinceEpoch + durationMs,
    durationMs: durationMs,
    start: start.clone(),
    end: end.clone(),
    id: id,
  }

  array.push(entityInMotion);
}


/* Defs */

type EntityInMotion = {
  entity: Entity,
  startTime: number,
  endTime: number,
  durationMs: number,
  start: Vec3 | Quaternion,
  end: Vec3 | Quaternion,
  id: number,
}