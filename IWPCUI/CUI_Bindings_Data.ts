import { Binding } from "horizon/ui";
import { PlayerData } from "PlayerData_Defs";
import { playerData_Func } from "PlayerData_Func";


export const cuiBindings_Data = {
  tokensBinding: new Binding<number>(0),
  playerDataBinding: new Binding<PlayerData>(playerData_Func.createEmptyPlayerData(undefined)),
}