import { cuiBindings_Data } from "CUI_Bindings_Data";
import { Player } from "horizon/core";
import { playerDataMap } from "PlayerData_Data";
import { PlayerData } from "PlayerData_Defs";
import { componentUtil_Data } from "UtilComponent_Data";
import { worldVariableNames } from "WorldVariableNames_Data";


export const ppvLeaderboard_Func = {
  updatePPVAndLeaderboards,
  updatePPV,
}


function updatePPVAndLeaderboards(player: Player) {
  const playerData = playerDataMap.get(player);

  if (playerData && componentUtil_Data.component) {
    updatePPV(player, playerData);

    componentUtil_Data.component.world.leaderboards.setScoreForPlayer(worldVariableNames.leaderboards.longestStreak, player, playerData.stats.visits.longestStreak, false);
  
    const playerTokens = componentUtil_Data.component.world.persistentStorage.getPlayerVariable(player, worldVariableNames.numberPPVs.premiumTokens);
    componentUtil_Data.component.world.leaderboards.setScoreForPlayer(worldVariableNames.leaderboards.mostPremiumTokens, player, playerTokens, true);

    cuiBindings_Data.tokensBinding.set(playerTokens, [player]);
  }
}

function updatePPV(player: Player, playerData: PlayerData) {
  if (componentUtil_Data.component) {
    componentUtil_Data.component.world.persistentStorage.setPlayerVariable(player, worldVariableNames.jsonPPVs.playerStats, playerData.stats);
    cuiBindings_Data.playerDataBinding.set(playerData, [player]);
  }
}