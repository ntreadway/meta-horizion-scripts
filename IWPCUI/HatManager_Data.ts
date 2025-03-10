import { HatAssetData } from "HatManager_Defs"
import { Asset, Entity, Player } from "horizon/core";


const allHats: HatAssetData[] = [
  {
    name: 'Pointy Hat',
    id: '0001PointyHat',
    assetReference: new Asset(BigInt(576590921758615)),
    assetIcon: new Asset(BigInt(580134664725514)),
    assetPrice: 5,
  },
  {
    name: 'Chef Hat',
    id: '0002ChefHat',
    assetReference: new Asset(BigInt(2254848671534421)),
    assetIcon: new Asset(BigInt(1276693623442951)),
    assetPrice: 5,
  },
  {
    name: 'Chef Hat Unlit',
    id: '0003ChefHatUnlit',
    assetReference: new Asset(BigInt(1349110486460787)),
    assetIcon: new Asset(BigInt(1276693623442951)),
    assetPrice: 1,
  },
];


const defaultHat = allHats[0];


const hatMap = new Map<Player, Entity>();


export const hatManager_Data = {
  defaultHat,
  allHats,
  hatMap,
}