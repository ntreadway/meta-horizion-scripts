import { cuiAssets_Data } from "CUI_Assets_Data";
import { cuiBindings_Data } from "CUI_Bindings_Data";
import { cuiHatsStyles } from "CUI_Hats_Styles";
import { hatManager_Data } from "HatManager_Data";
import { HatAssetData } from "HatManager_Defs";
import { hatManager_Func } from "HatManager_Func";
import { AudioGizmo, Color, Component, Player, PropTypes, TextureAsset, Vec3 } from "horizon/core";
import { Binding, Image, ImageSource, Pressable, Text, UIChildren, UIComponent, UINode, View } from "horizon/ui";
import { iwpManager_Func } from "IWP_Manager_Func";
import { playerDataMap } from "PlayerData_Data";
import { PlayerData } from "PlayerData_Defs";
import { actionUtils } from "UtilAction_Func";
import { arrayUtils } from "UtilArray_Func";
import { operatorUtils } from "UtilOperator_Func";
import { worldVariableNames } from "WorldVariableNames_Data";


class HatUI extends UIComponent<typeof HatUI> {
  static propsDefinition = {
    clickSfx: { type: PropTypes.Entity },
    purchaseErrorSfx: { type: PropTypes.Entity },
    purchaseSuccessSfx: { type: PropTypes.Entity },
  };

  orgPos = Vec3.zero;

  itemIndexMap = new Map<Player, number>();
  itemIndexBinding = new Binding<number>(0);

  isItemSelectedMap = new Map<Player, boolean>();
  isItemSelectedBinding = new Binding<boolean>(false);

  isSelectedItemOwnedBinding = new Binding<boolean>(false);

  isSelectedItemEquippedBinding = new Binding<boolean>(false);

  numberOfItems = hatManager_Data.allHats.length;

  purchaseFailColorBinding = new Binding<Color>(Color.white);
  playersFlashing: Player[] = [];


  initializeUI(): UINode {
    return View({
      children: [
        Text({
          text: 'Hat Shop',
          style: cuiHatsStyles.titleTextStyle,
        }),
        UINode.if(this.isItemSelectedBinding, [
          Image({
            source: this.itemIndexBinding.derive((index) => {
              return ImageSource.fromTextureAsset(hatManager_Data.allHats[index]?.assetIcon ?? cuiAssets_Data.missingImage.as(TextureAsset))
            }),
            style: cuiHatsStyles.imageStyle,
          }),
          Text({
            text: this.itemIndexBinding.derive((index) => {
              return hatManager_Data.allHats[index].name;
            }),
            style: cuiHatsStyles.imageTitleTextStyle,
          }),
          UINode.if(this.isSelectedItemOwnedBinding.derive((isOwned) => { return !isOwned; }),
            Text({
              text: this.itemIndexBinding.derive((index) => {
                return ' ' + hatManager_Data.allHats[index].assetPrice + ' Tokens';
              }),
              style: {
                ...cuiHatsStyles.imageSubTitleTextStyle,
                color: this.purchaseFailColorBinding,
              },
            }),
            UINode.if(this.isSelectedItemEquippedBinding,
              Text({
                text: 'Equipped',
                style: cuiHatsStyles.imageSubTitleTextStyle,
              }),
              Text({
                text: 'Owned',
                style: cuiHatsStyles.imageSubTitleTextStyle,
              })
            ),
          ),
        ], [
          View({
            children: [
              this.createImageButton(0),
              this.createImageButton(1),
              this.createImageButton(2),
              this.createImageButton(3),
              this.createImageButton(4),
              this.createImageButton(5),
              this.createImageButton(6),
              this.createImageButton(7),
              this.createImageButton(8),
              this.createImageButton(9),
            ],
            style: cuiHatsStyles.rowImagesContainerStyle,
          })
        ]),
        View({
          children: [...this.buttons],
          style: cuiHatsStyles.buttonsStyle,
        }),
        Text({
          text: cuiBindings_Data.tokensBinding.derive((tokens) => { return 'Token Balance:\n' + operatorUtils.toLocaleString(',', tokens) }),
          style: cuiHatsStyles.tokenBalanceTextStyle,
        }),
      ],
      style: { ...cuiHatsStyles.containerStyle },
    });
  }

  preStart() {

  }

  start() {
    this.orgPos = this.entity.position.get();
  }

  tintColor = new Color(0.7, 0.7, 0.7);

  createImageButton(pageItemIndex: number): UIChildren {
    const iconTintBinding = new Binding<Color>(Color.white);

    return UINode.if(this.itemIndexBinding.derive((index) => {
      const myIndex = (Math.floor(index / 10) * 10) + pageItemIndex;

      return myIndex < this.numberOfItems;
    }),
      Pressable({
        children: [
          Image({
            source: this.itemIndexBinding.derive((index) => {
              const myIndex = (Math.floor(index / 10) * 10) + pageItemIndex;

              return ImageSource.fromTextureAsset(hatManager_Data.allHats[myIndex]?.assetIcon ?? cuiAssets_Data.missingImage.as(TextureAsset))
            }),
            style: {
              ...cuiHatsStyles.iconImageStyle,
              tintColor: iconTintBinding,
            },
          }),
        ],
        style: {},
        onPress: (player) => {
          actionUtils.playSFX(this.props.clickSfx?.as(AudioGizmo), this.orgPos);

          const playerData = playerDataMap.get(player);

          if (playerData) {
            const indexSelected = this.itemIndexMap.get(player) ?? 0;

            const myIndex = (Math.floor(indexSelected / 10) * 10) + pageItemIndex;

            this.changePageBindingUpdates(player, playerData, myIndex);

            this.isItemSelectedMap.set(player, true);
            this.isItemSelectedBinding.set(true, [player]);
          }

          iconTintBinding.set(Color.white, [player]);
        },
        onEnter: (player) => {
          iconTintBinding.set(this.tintColor, [player]);
        },
        onExit: (player) => {
          iconTintBinding.set(Color.white, [player]);
        },
      })
    );
  }


  createArrowButton(isLeft: boolean, source: ImageSource): UIChildren {
    return Pressable({
      children: [
        Image({
          source: source,
          style: {
            ...cuiHatsStyles.arrowImageStyle,
            left: isLeft ? 5 : 10,
          },
        }),
      ],
      style: cuiHatsStyles.buttonBackground,
      onPress: (player) => {
        actionUtils.playSFX(this.props.clickSfx?.as(AudioGizmo), this.orgPos);

        let curIndex = this.itemIndexMap.get(player) ?? 0;
        const isItemSelected = this.isItemSelectedMap.get(player);

        if (isLeft) {
          if (isItemSelected) {
            curIndex--;
          }
          else {
            curIndex -= 10;
          }

          if (curIndex < 0) {
            curIndex = hatManager_Data.allHats.length - 1;
          }
        }
        else {
          if (isItemSelected) {
            curIndex++;
          }
          else {
            curIndex += 10;
          }

          if (curIndex >= hatManager_Data.allHats.length) {
            curIndex = 0;
          }
        }

        const playerData = playerDataMap.get(player);

        if (playerData) {
          this.changePageBindingUpdates(player, playerData, curIndex);
        }
      },
    });
  }

  createButton(type: 'Exit' | 'Buy' | 'Equip'): UIChildren {
    return Pressable({
      children: [
        Text({
          text: type,
          style: {
            height: 20,
            width: 30 + type.length * 5,
            position: 'absolute',
            top: 3,
            textAlign: 'center',
            fontSize: 15,
          },
        }),
      ],
      style: {
        ...cuiHatsStyles.buttonBackground,
        alignItems: 'center',
        justifyContent: 'center',
        width: 30 + type.length * 5,

      },
      onPress: async (player) => {
        actionUtils.playSFX(this.props.clickSfx?.as(AudioGizmo), this.orgPos);

        const playerData = playerDataMap.get(player);
        const curIndex = this.itemIndexMap.get(player) ?? -1;
        const hatAssetData: HatAssetData | undefined = hatManager_Data.allHats[curIndex];

        switch (type) {
          case "Exit":
            this.isItemSelectedMap.set(player, false);
            this.isItemSelectedBinding.set(false, [player]);
            break;
          case "Buy":
            if (playerData && hatAssetData && !playerData.stats.purchasedItems.includes(hatAssetData.id)) {
              if (iwpManager_Func.chargeTokens(player, hatAssetData.assetPrice)) {
                actionUtils.playSFX(this.props.purchaseSuccessSfx, this.orgPos);

                playerData.stats.purchasedItems.push(hatAssetData.id);

                this.world.leaderboards.setScoreForPlayer(worldVariableNames.leaderboards.mostHatsOwned, player, playerData.stats.purchasedItems.length, false);

                this.isSelectedItemOwnedBinding.set(true, [player]);
              }
              else {
                actionUtils.playSFX(this.props.purchaseErrorSfx, this.orgPos);

                this.purchaseFailFlashRed(player, 3);
              }
            }
            break;
          case "Equip":
            if (playerData && hatAssetData && playerData.stats.lastWornItem !== hatAssetData.id) {
              this.isSelectedItemEquippedBinding.set(true, [player]);

              await hatManager_Func.spawnHat(player, playerData, hatAssetData);
            }
            break;
          default:
            console.log('Case Not Found For Type: ' + type + '. On CUI_Hats_Entity: CreateButton');
            break;
        }
      },
    });
  }

  changePageBindingUpdates(player: Player, playerData: PlayerData, curIndex: number) {
    const isEquipped = hatManager_Data.allHats[curIndex].id === playerData.stats.lastWornItem;

    this.isSelectedItemEquippedBinding.set(isEquipped, [player]);

    const isOwned = playerData.stats.purchasedItems.includes(hatManager_Data.allHats[curIndex].id);
    this.isSelectedItemOwnedBinding.set(isOwned, [player]);

    this.itemIndexMap.set(player, curIndex);
    this.itemIndexBinding.set(curIndex, [player]);
  }


  purchaseFailRed = new Color(0.9, 0, 0);

  async purchaseFailFlashRed(player: Player, flashes: number) {
    if (!this.playersFlashing.includes(player)) {
      this.playersFlashing.push(player);

      let count = 0;

      while (count < flashes) {
        count++;

        this.purchaseFailColorBinding.set(this.purchaseFailRed, [player]);

        await new Promise(resolve => this.async.setTimeout(resolve, 500));

        this.purchaseFailColorBinding.set(Color.white, [player]);

        await new Promise(resolve => this.async.setTimeout(resolve, 500));
      }

      arrayUtils.removeItemFromArray(this.playersFlashing, player);
    }
  }

  buttons: UIChildren[] = [
    UINode.if(this.isItemSelectedBinding.derive((isSelected) => { return (isSelected || this.numberOfItems > 10) }), this.createArrowButton(true, ImageSource.fromTextureAsset(cuiAssets_Data.arrows.left.as(TextureAsset)))),
    UINode.if(this.isItemSelectedBinding, [
      this.createButton('Exit'),
      UINode.if(this.isSelectedItemOwnedBinding,
        UINode.if(this.isSelectedItemEquippedBinding.derive((isEquipped) => { return !isEquipped; }), this.createButton('Equip')),
        this.createButton('Buy')
      ),
    ]),
    UINode.if(this.isItemSelectedBinding.derive((isSelected) => { return (isSelected || this.numberOfItems > 10) }), this.createArrowButton(false, ImageSource.fromTextureAsset(cuiAssets_Data.arrows.right.as(TextureAsset)))),
  ];
}
Component.register(HatUI);


