import { hatManager_Data } from "HatManager_Data";
import { hatManager_Func } from "HatManager_Func";
import { CodeBlockEvents, Component, Player } from "horizon/core";
import { playerDataMap } from "PlayerData_Data";


class HatManager_Entity extends Component<typeof HatManager_Entity> {
  static propsDefinition = {};

  preStart() {
    this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnPlayerEnterWorld, (player) => { this.playerEnterWorld(player); });
    this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnPlayerExitWorld, (player) => { this.playerExitWorld(player); });
  }

  start() {

  }

  async playerEnterWorld(player: Player) {
    if (!hatManager_Data.hatMap.has(player)) {
      let playerDataInProgress = playerDataMap.get(player);

      while (playerDataInProgress === undefined) {
        await new Promise(resolve => this.async.setTimeout(resolve, 100));

        playerDataInProgress = playerDataMap.get(player);
      }

      const playerData = playerDataInProgress;

      if (playerData) {
        let hatAssetDataToSpawn = hatManager_Data.defaultHat;
  
        if (playerData.stats.lastWornItem !== '') {
          hatManager_Data.allHats.forEach((hatAssetData) => {
            if (hatAssetData.id === playerData.stats.lastWornItem) {
              hatAssetDataToSpawn = hatAssetData;
            }
          });  
        }

        if (!playerData.stats.purchasedItems.includes(playerData.stats.lastWornItem)) {
          playerData.stats.purchasedItems.push(playerData.stats.lastWornItem);
        }
  
        hatManager_Func.spawnHat(player, playerData, hatAssetDataToSpawn);
      }
    }
  }

  playerExitWorld(player: Player) {
    const hat = hatManager_Data.hatMap.get(player);
    hatManager_Data.hatMap.delete(player);

    if (hat) {
      this.world.deleteAsset(hat);
    }
  }
}
Component.register(HatManager_Entity);