import { CodeBlockEvents, Component, Player } from "horizon/core";
import { iwpManager_Func } from "IWP_Manager_Func";
import { playerDataMap } from "PlayerData_Data";
import { playerData_Func } from "PlayerData_Func";
import { ppvLeaderboard_Func } from "PPVLeaderboard_Func";
import { worldVariableNames } from "WorldVariableNames_Data";


class PlayerData_Entity extends Component<typeof PlayerData_Entity> {
  static propsDefinition = {};

  positionUpdateFrequencyMs = 100;

  preStart() {
    this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnPlayerEnterWorld, (player) => { this.playerEnterWorld(player); });
    this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnPlayerExitWorld, (player) => { this.playerExitWorld(player); });

    this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnPlayerEnterAFK, (player) => { this.playerEnterAFK(player); });
    this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnPlayerExitAFK, (player) => { this.playerExitAFK(player); });
  }

  start() {
    this.async.setInterval(() => { playerData_Func.updateTimeSpent(); }, 60_000);

    this.async.setInterval(() => {
      playerData_Func.updatePlayerPositions();
    }, this.positionUpdateFrequencyMs);
  }

  playerEnterWorld(player: Player) {
    const playerData = playerData_Func.createEmptyPlayerData(player);

    playerDataMap.set(player, playerData);

    ppvLeaderboard_Func.updatePPVAndLeaderboards(player);
  }

  playerExitWorld(player: Player) {
    const playerData = playerDataMap.get(player);

    if (playerData) {
      this.world.persistentStorage.setPlayerVariable(player, worldVariableNames.jsonPPVs.playerStats, playerData.stats);
    }

    playerDataMap.delete(player);
  }

  playerEnterAFK(player: Player) {
    const playerData = playerDataMap.get(player);

    if (playerData) {
      playerData.isAFK = true;
      playerData.enteredAFKAt = Date.now();
    }
  }

  playerExitAFK(player: Player) {
    const playerData = playerDataMap.get(player);

    if (playerData) {
      playerData.isAFK = false;
      playerData.enteredAFKAt = 0;
    }
  }
}
Component.register(PlayerData_Entity);
