import { Player, PlayerDeviceType, Vec3 } from "horizon/core";
import { playerDataMap } from "PlayerData_Data";
import { PlayerData } from "PlayerData_Defs";
import { playerStats_Func } from "PlayerStats_Func";


export const playerData_Func = {
  createEmptyPlayerData,
  updateTimeSpent,
  updatePlayerPositions,
}


function createEmptyPlayerData(player: Player | undefined): PlayerData {
  return {
    name: player?.name.get() ?? 'Name',
    isXS: player?.deviceType.get() !== PlayerDeviceType.VR,
    isAFK: false,
    enteredAFKAt: 0,
    position: player?.position.get() ?? Vec3.zero,
    stats: playerStats_Func.getPlayerStatsFromPPV(player),
  }
}


function updateTimeSpent() {
  playerDataMap.forEach((playerData) => {
    playerData.stats.visits.minsInWorld++;
  });
}


function updatePlayerPositions() {
  playerDataMap.forEach((playerData, player) => {
    playerData.position = player.position.get();
  });
}

