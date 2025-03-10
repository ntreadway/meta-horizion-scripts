import { colorPicker_Data } from "CUI_ColorPicker_Data";
import { Events } from "Events_Data";
import { hatManager_Data } from "HatManager_Data";
import { HatAssetData } from "HatManager_Defs";
import { AttachableEntity, AttachablePlayerAnchor, Color, MeshEntity, Player, Quaternion, Vec3 } from "horizon/core";
import { PlayerData } from "PlayerData_Defs";
import { componentUtil_Data } from "UtilComponent_Data";


export const hatManager_Func = {
  spawnHat,
  setHatVisibility,
  setHatColor,
}


async function spawnHat(player: Player, playerData: PlayerData, hat: HatAssetData): Promise<void> {
  if (componentUtil_Data.component) {
    const currentHat = hatManager_Data.hatMap.get(player);

    if (currentHat) {
      componentUtil_Data.component.world.deleteAsset(currentHat);
      hatManager_Data.hatMap.delete(player);
    }

    playerData.stats.lastWornItem = hat.id;

    const hatSpawned = await componentUtil_Data.component.world.spawnAsset(hat.assetReference, new Vec3(0, -1, 0), Quaternion.one, Vec3.one);
  
    hatSpawned[0].as(AttachableEntity).attachToPlayer(player, AttachablePlayerAnchor.Head);
  
    hatManager_Data.hatMap.set(player, hatSpawned[0]);

    setHatColor(player, playerData, playerData.stats.lastWornColor);
  }
}


function setHatVisibility(player: Player, isVisible: boolean) {
  const currentHat = hatManager_Data.hatMap.get(player);

  if (currentHat) {
    currentHat.visible.set(isVisible);
  }
}


function setHatColor(player: Player, playerData: PlayerData, color: string) {
  const currentHat = hatManager_Data.hatMap.get(player);
  const currentColor = colorPicker_Data.allColorMap.get(color);

  if (currentHat && currentColor) {
    playerData.stats.lastWornColor = color;

    componentUtil_Data.component?.sendLocalEvent(currentHat, Events.localEvents.colorHat, { color: currentColor.color });
  }
}
