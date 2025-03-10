import { Vec3 } from "horizon/core"
import { PlayerStats } from "PlayerStats_Defs"


export type PlayerData = {
  name: string,
  isXS: boolean,
  isAFK: boolean,
  enteredAFKAt: number,
  position: Vec3,
  stats: PlayerStats,
}