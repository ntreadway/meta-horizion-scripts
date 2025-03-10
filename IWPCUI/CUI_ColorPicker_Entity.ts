import { cuiAssets_Data } from "CUI_Assets_Data";
import { cuiBindings_Data } from "CUI_Bindings_Data";
import { colorPicker_Data } from "CUI_ColorPicker_Data";
import { PurchasableColor } from "CUI_ColorPicker_Defs";
import { cuiHatsStyles } from "CUI_Hats_Styles";
import { hatManager_Func } from "HatManager_Func";
import { AudioGizmo, CodeBlockEvents, Color, Component, Player, PropTypes, TextureAsset, Vec3 } from "horizon/core";
import { Binding, Image, ImageSource, Pressable, Text, UIChildren, UIComponent, UINode, View } from "horizon/ui";
import { iwpManager_Func } from "IWP_Manager_Func";
import { playerDataMap } from "PlayerData_Data";
import { PlayerData } from "PlayerData_Defs";
import { actionUtils } from "UtilAction_Func";
import { arrayUtils } from "UtilArray_Func";
import { operatorUtils } from "UtilOperator_Func";
import { worldVariableNames } from "WorldVariableNames_Data";


class ColorPickerUI extends UIComponent<typeof ColorPickerUI> {
  static propsDefinition = {
    clickSfx: { type: PropTypes.Entity },
    purchaseErrorSfx: { type: PropTypes.Entity },
    purchaseSuccessSfx: { type: PropTypes.Entity },
  };

  orgPos = Vec3.zero;

  itemIndexMap = new Map<Player, number>();
  itemIndexBinding = new Binding<{ index: number, numberOfItems: number, availableColors: PurchasableColor[] }>({ index: 0, numberOfItems: colorPicker_Data.availableColorArray.length, availableColors: [...colorPicker_Data.availableColorArray] });

  isItemSelectedMap = new Map<Player, boolean>();
  isItemSelectedBinding = new Binding<boolean>(false);

  isSelectedItemOwnedBinding = new Binding<boolean>(false);
  isSelectedItemEquippedBinding = new Binding<boolean>(false);

  availableColorsMap = new Map<Player, PurchasableColor[]>();
  numberOfItemsMap = new Map<Player, number>();

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
          View({
            style: {
              ...cuiHatsStyles.imageStyle,
              backgroundColor: this.itemIndexBinding.derive((payload) => {
                return payload.availableColors[payload.index].color;
              }),
            },
          }),
          Text({
            text: this.itemIndexBinding.derive((payload) => {
              return payload.availableColors[payload.index].name;
            }),
            style: cuiHatsStyles.imageTitleTextStyle,
          }),
          UINode.if(this.isSelectedItemOwnedBinding.derive((isOwned) => { return !isOwned; }),
            Text({
              text: this.itemIndexBinding.derive((payload) => {
                return ' ' + payload.availableColors[payload.index].price + ' Tokens';
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
    this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnPlayerEnterWorld, (player) => { this.playerEnterWorld(player); });
  }

  start() {
    this.orgPos = this.entity.position.get();
  }


  createImageButton(pageItemIndex: number): UIChildren {
    const iconTintBinding = new Binding<number>(1);

    return UINode.if(this.itemIndexBinding.derive((payload) => {
      const myIndex = (Math.floor(payload.index / 10) * 10) + pageItemIndex;

      return myIndex < payload.numberOfItems;
    }),
      Pressable({
        children: [
          View({
            style: {
              ...cuiHatsStyles.iconImageStyle,
              backgroundColor: this.itemIndexBinding.derive((payload) => {
                const myIndex = (Math.floor(payload.index / 10) * 10) + pageItemIndex;

                if (myIndex < payload.numberOfItems) {
                  return payload.availableColors[myIndex].color;
                }
                else {
                  return Color.red;
                }
              }),
              opacity: iconTintBinding,
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

          iconTintBinding.set(1, [player]);
        },
        onEnter: (player) => {
          iconTintBinding.set(0.7, [player]);
        },
        onExit: (player) => {
          iconTintBinding.set(1, [player]);
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

        const numberOfItems = this.numberOfItemsMap.get(player) ?? colorPicker_Data.availableColorArray.length;

        if (isLeft) {
          if (isItemSelected) {
            curIndex--;
          }
          else {
            curIndex -= 10;
          }

          if (curIndex < 0) {
            curIndex = numberOfItems - 1;
          }
        }
        else {
          if (isItemSelected) {
            curIndex++;
          }
          else {
            curIndex += 10;
          }

          if (curIndex >= numberOfItems) {
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
        const purchasableColors = this.availableColorsMap.get(player);
        const purchasableColor: PurchasableColor | undefined = purchasableColors ? purchasableColors[curIndex] : undefined;

        switch (type) {
          case "Exit":
            this.isItemSelectedMap.set(player, false);
            this.isItemSelectedBinding.set(false, [player]);
            break;
          case "Buy":
            if (playerData && purchasableColor && !playerData.stats.purchasedColors.includes(purchasableColor.name)) {
              if (iwpManager_Func.chargeTokens(player, purchasableColor.price)) {
                actionUtils.playSFX(this.props.purchaseSuccessSfx, this.orgPos);

                playerData.stats.purchasedColors.push(purchasableColor.name);

                this.world.leaderboards.setScoreForPlayer(worldVariableNames.leaderboards.mostColorsOwned, player, playerData.stats.purchasedColors.length, false);

                this.isSelectedItemOwnedBinding.set(true, [player]);
              }
              else {
                actionUtils.playSFX(this.props.purchaseErrorSfx, this.orgPos);

                this.purchaseFailFlashRed(player, 3);
              }
            }
            break;
          case "Equip":
            if (playerData && purchasableColor && playerData.stats.lastWornColor !== purchasableColor.name) {
              this.isSelectedItemEquippedBinding.set(true, [player]);

              hatManager_Func.setHatColor(player, playerData, purchasableColor.name);
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
    const availableColors = this.availableColorsMap.get(player);
    const isEquipped = (availableColors ? availableColors[curIndex].name : '') === playerData.stats.lastWornColor;

    this.isSelectedItemEquippedBinding.set(isEquipped, [player]);

    const isOwned = playerData.stats.purchasedColors.includes(availableColors ? availableColors[curIndex].name : '');
    this.isSelectedItemOwnedBinding.set(isOwned, [player]);

    this.itemIndexMap.set(player, curIndex);
    this.itemIndexBinding.set({ index: curIndex, numberOfItems: this.numberOfItemsMap.get(player) ?? colorPicker_Data.availableColorArray.length, availableColors: this.availableColorsMap.get(player) ?? [...colorPicker_Data.availableColorArray] }, [player]);
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

  playerEnterWorld(player: Player) {
    this.async.setTimeout(() => { this.delayedPlayerInitialization(player); }, 500);
  }

  delayedPlayerInitialization(player: Player) {
    const playerData = playerDataMap.get(player);

    if (playerData) {
      const availableColors = [...colorPicker_Data.availableColorArray];

      playerData.stats.purchasedColors.forEach((colorName) => {
        const purchasableColor = colorPicker_Data.allColorMap.get(colorName);

        if (purchasableColor) {
          if (!availableColors.includes(purchasableColor)) {
            availableColors.push(purchasableColor);
          }
        }
      });

      this.availableColorsMap.set(player, availableColors);
      this.numberOfItemsMap.set(player, availableColors.length);

      this.changePageBindingUpdates(player, playerData, 0);
    }
  }

  buttons: UIChildren[] = [
    UINode.if(this.isItemSelectedBinding.derive((isSelected) => { return (isSelected) }),
      this.createArrowButton(true, ImageSource.fromTextureAsset(cuiAssets_Data.arrows.left.as(TextureAsset))),
      UINode.if(this.itemIndexBinding.derive((payload) => { return (payload.numberOfItems > 10) }),
        this.createArrowButton(true, ImageSource.fromTextureAsset(cuiAssets_Data.arrows.left.as(TextureAsset))))),
    UINode.if(this.isItemSelectedBinding, [
      this.createButton('Exit'),
      UINode.if(this.isSelectedItemOwnedBinding,
        UINode.if(this.isSelectedItemEquippedBinding.derive((isEquipped) => { return !isEquipped; }), this.createButton('Equip')),
        this.createButton('Buy')
      ),
    ]),
    UINode.if(this.isItemSelectedBinding.derive((isSelected) => { return (isSelected) }),
      this.createArrowButton(false, ImageSource.fromTextureAsset(cuiAssets_Data.arrows.right.as(TextureAsset))),
      UINode.if(this.itemIndexBinding.derive((payload) => { return (payload.numberOfItems > 10) }),
        this.createArrowButton(false, ImageSource.fromTextureAsset(cuiAssets_Data.arrows.right.as(TextureAsset))))),
  ];
}
Component.register(ColorPickerUI);


