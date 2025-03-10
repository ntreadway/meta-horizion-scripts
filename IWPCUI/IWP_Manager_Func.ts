import { cuiBindings_Data } from "CUI_Bindings_Data";
import { Player } from "horizon/core";
import { iwpManager_Data } from "IWP_Manager_Data";
import { playerDataMap } from "PlayerData_Data";
import { ppvLeaderboard_Func } from "PPVLeaderboard_Func";
import { componentUtil_Data } from "UtilComponent_Data";
import { worldVariableNames } from "WorldVariableNames_Data";


export const iwpManager_Func = {
  increasePlayerTokenProgress,
  chargeTokens,
}


/**
 * Increases player token progress, if more than 100%, rolls over, can be used to increase multiple full tokens
 * @param player to increase
 * @param increaseAmount out of `iwpManager_Data.amountToEarnAPremiumToken` (default of 1000)
 */
function increasePlayerTokenProgress(player: Player, increaseAmount: number) {
  const playerData = playerDataMap.get(player);

  if (playerData && componentUtil_Data.component) {
    playerData.stats.premiumTokenProgress += increaseAmount;

    if (playerData.stats.premiumTokenProgress >= iwpManager_Data.amountToEarnAPremiumToken) {
      const tokensToIncreaseBy = Math.floor(playerData.stats.premiumTokenProgress / iwpManager_Data.amountToEarnAPremiumToken);

      const playerBalance = tokensToIncreaseBy + componentUtil_Data.component.world.persistentStorage.getPlayerVariable(player, worldVariableNames.numberPPVs.premiumTokens);
      componentUtil_Data.component.world.persistentStorage.setPlayerVariable(player, worldVariableNames.numberPPVs.premiumTokens, playerBalance);

      playerData.stats.premiumTokenProgress = playerData.stats.premiumTokenProgress % iwpManager_Data.amountToEarnAPremiumToken;

      ppvLeaderboard_Func.updatePPVAndLeaderboards(player);
    }
    else {
      ppvLeaderboard_Func.updatePPV(player, playerData);
    }
  }
}


/**
 * Charge premium tokens to a player. Returns true if successful, false if too low of a balance.
 * @param player To Charge
 * @param cost To Charge
 * @returns `boolean` representing the success of the charge.
 */
function chargeTokens(player: Player, cost: number): boolean {
  if (componentUtil_Data.component) {
    const newPlayerBalance = componentUtil_Data.component.world.persistentStorage.getPlayerVariable(player, worldVariableNames.numberPPVs.premiumTokens) - cost;
    
    if (newPlayerBalance >= 0) {
      componentUtil_Data.component.world.persistentStorage.setPlayerVariable(player, worldVariableNames.numberPPVs.premiumTokens, newPlayerBalance);
      
      componentUtil_Data.component.world.leaderboards.setScoreForPlayer(worldVariableNames.leaderboards.mostPremiumTokens, player, newPlayerBalance, true);

      cuiBindings_Data.tokensBinding.set(newPlayerBalance, [player]);
      return true;
    }
    else {
      return false;
    }
  }
  else {
    return false;
  }
}