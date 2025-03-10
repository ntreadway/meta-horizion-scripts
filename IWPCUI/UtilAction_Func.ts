import { AudioGizmo, Entity, HapticSharpness, HapticStrength, ParticleGizmo, Player, Vec3 } from "horizon/core";
import { componentUtil_Data } from "UtilComponent_Data";

export const actionUtils = {
  playSFX,
  playSFXForDuration,
  playVFX,
  playVFXForDuration,
  playHaptics,
}

function playSFX(fx: Entity | AudioGizmo | undefined | null, pos: Vec3 | undefined, players: Player[] | undefined = undefined) {
  if (fx) {
    if (pos) {
      fx?.position.set(pos);
    }

    if (players) {
      fx.as(AudioGizmo).play({ fade: 0, players: players });
    }
    else {
      fx.as(AudioGizmo).play();
    }
  }
}

async function playSFXForDuration(fx: Entity | AudioGizmo | undefined | null, pos: Vec3 | undefined, durationSeconds: number) {
  if (fx) {
    if (pos) {
      fx?.position.set(pos);
    }

    fx.as(AudioGizmo).play();
  }

  componentUtil_Data.component?.async.setTimeout(() => {
    fx?.as(AudioGizmo).stop();
  }, durationSeconds * 1000);
}

function playVFX(fx: Entity | ParticleGizmo | undefined | null, pos: Vec3 | undefined) {
  if (fx) {
    if (pos) {
      fx?.position.set(pos);
    }

    fx.as(ParticleGizmo).play();
  }
}

async function playVFXForDuration(fx: Entity | ParticleGizmo | undefined | null, pos: Vec3 | undefined, durationSeconds: number) {
  if (fx) {
    if (pos) {
      fx?.position.set(pos);
    }

    fx.as(ParticleGizmo).play();
  }

  componentUtil_Data.component?.async.setTimeout(() => {
    fx?.as(ParticleGizmo).stop();
  }, durationSeconds * 1000);
}

function playHaptics(player: Player, haptics: [number, HapticStrength, HapticSharpness], isRightHand: boolean | undefined = undefined) {
  if (isRightHand === undefined) {
    player.rightHand.playHaptics(...haptics);
    player.leftHand.playHaptics(...haptics);
  }
  else if (isRightHand) {
    player.rightHand.playHaptics(...haptics);
  }
  else {
    player.leftHand.playHaptics(...haptics);
  }
}