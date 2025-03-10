import { Player } from "horizon/core";
import { PlayerStats } from "PlayerStats_Defs";
import { componentUtil_Data } from "UtilComponent_Data";
import { operatorUtils } from "UtilOperator_Func";
import { worldVariableNames } from "WorldVariableNames_Data";


export const playerStats_Func = {
  getPlayerStatsFromPPV,
}


const statsVersion = 1;


function getPlayerStatsFromPPV(player: Player | undefined): PlayerStats {
  const newPlayerStats = createEmptyPlayerStats();

  if (player) {
    const oldPlayerStats: PlayerStats | undefined | null = componentUtil_Data.component?.world.persistentStorage.getPlayerVariable(player, worldVariableNames.jsonPPVs.playerStats);
  
    if (oldPlayerStats) {
      if (oldPlayerStats.version >= 1) {
        newPlayerStats.premiumTokenProgress = oldPlayerStats.premiumTokenProgress;

        newPlayerStats.visits.minsInWorld = oldPlayerStats.visits.minsInWorld;
  
        newPlayerStats.visits.uniqueDaysVisited = oldPlayerStats.visits.uniqueDaysVisited;
        newPlayerStats.visits.visitStreak = oldPlayerStats.visits.visitStreak;
        newPlayerStats.visits.longestStreak = oldPlayerStats.visits.longestStreak;

        newPlayerStats.purchasedItems = oldPlayerStats.purchasedItems;
        newPlayerStats.purchasedColors = oldPlayerStats.purchasedColors;
        newPlayerStats.lastWornItem = oldPlayerStats.lastWornItem;
        newPlayerStats.lastWornColor = oldPlayerStats.lastWornColor;
  
        if (newPlayerStats.visits.mostRecentDayVisited !== oldPlayerStats.visits.mostRecentDayVisited) {
          newPlayerStats.visits.uniqueDaysVisited++;
  
          if (newPlayerStats.visits.mostRecentDayVisited <= oldPlayerStats.visits.mostRecentDayVisited + 2) {
            newPlayerStats.visits.visitStreak++;
            newPlayerStats.visits.longestStreak = Math.max(newPlayerStats.visits.visitStreak, newPlayerStats.visits.longestStreak);
          }
          else {
            newPlayerStats.visits.visitStreak = 1;
          }
        }
      }
    }
  }

  return newPlayerStats;
}


function createEmptyPlayerStats(): PlayerStats {
  return {
    version: statsVersion,
    visits: {
      uniqueDaysVisited: 1,
      mostRecentDayVisited: operatorUtils.getDaySinceEpoch(),
      visitStreak: 1,
      longestStreak: 1,
      minsInWorld: 0,
    },
    premiumTokenProgress: 0,
    purchasedItems: [],
    purchasedColors: [],
    lastWornItem: '',
    lastWornColor: '',
  }
}

