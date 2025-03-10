import { Asset, TextureAsset } from "horizon/core"


export type HatAssetData = {
  name: string,
  id: string,
  assetReference: Asset,
  assetIcon: TextureAsset,
  assetPrice: number,
}