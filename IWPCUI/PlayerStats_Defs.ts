

export type PlayerStats = {
  version: number,
  visits: {
    uniqueDaysVisited: number,
    mostRecentDayVisited: number,
    visitStreak: number,
    longestStreak: number,
    minsInWorld: number,
  },
  premiumTokenProgress: number,
  purchasedItems: string[],
  purchasedColors: string[],
  lastWornItem: string,
  lastWornColor: string,
}