import { cuiBindings_Data } from "CUI_Bindings_Data";
import { cuiIWPStyles } from "CUI_IWP_Styles";
import { Color, Component, Vec3 } from "horizon/core";
import { Text, UIChildren, UIComponent, UINode, View } from "horizon/ui";
import { iwpManager_Data } from "IWP_Manager_Data";
import { operatorUtils } from "UtilOperator_Func";

class IWP extends UIComponent<typeof IWP> {
  static propsDefinition = {};

  orgPos = Vec3.zero;

  start() {
    this.orgPos = this.entity.position.get();
  }

  initializeUI(): UINode {
    return View({
      children: [
        View({
          children: [...this.buttons],
          style: cuiIWPStyles.buttonsStyle,
        }),
        View({
          children: [
            View({
              style: {
                position: 'absolute',
                height: 30,
                width: 350,
                alignSelf: 'center',
                backgroundColor: new Color(0.8, 0.2, 0.6),
                borderColor: Color.white,
                borderWidth: 2,
                borderRadius: 15,
              },
            }),
            View({
              style: {
                position: 'absolute',
                height: 26,
                width: cuiBindings_Data.playerDataBinding.derive((playerData) => {
                  return Math.floor(346 * (playerData.stats.premiumTokenProgress / iwpManager_Data.amountToEarnAPremiumToken));
                }),
                alignSelf: 'center',
                backgroundColor: new Color(1, 0.35, 0.85),
                marginTop: 2,
                borderRadius: 15,
              },
            }),
            Text({
              text: cuiBindings_Data.playerDataBinding.derive((playerData) => {
                return 'Next Premium Token:  ' + operatorUtils.toLocaleString(',', playerData.stats.premiumTokenProgress) + ' / ' + operatorUtils.toLocaleString(',', iwpManager_Data.amountToEarnAPremiumToken);
              }),
              style: {
                position: 'absolute',
                textAlign: 'center',
                fontSize: 18,
                color: Color.white,
                alignSelf: 'center',
                marginTop: 3,
              },
            }),
          ],
          style: {
            position: 'relative',
            width: '80%',
            height: '20%',
            marginTop: '5%',
          },
        }),
        Text({
          text: cuiBindings_Data.tokensBinding.derive((tokens) => { return 'Token Balance:\n' + operatorUtils.toLocaleString(',', tokens) }),
          style: {
            fontSize: 24,
            fontFamily: 'Anton',
            fontWeight: 'bold',
            textAlign: 'center',
          },
        }),
      ],
      style: { ...cuiIWPStyles.containerStyle },
    });
  }

  createButton(buttonText: string, priceText: string): UIChildren {
    return View({
      children: [
        Text({
          text: buttonText,
          style: {
            ...cuiIWPStyles.buttonText,
            textAlign: 'left',
            fontSize: 19,
          },
        }),
        Text({
          text: priceText,
          style: {
            ...cuiIWPStyles.buttonText,
            fontSize: 12,
            fontWeight: '100',
            textAlign: 'left',
          },
        }),
      ],
      style: {
        ...cuiIWPStyles.buttonBackground,
        width: 185,
      },
    });
  }

  buttons: UIChildren[] = [
    this.createButton('1 Token', '330 Meta Credits'), //330
    this.createButton('7 Tokens', '1,640 Meta Credits'), //234.29
    this.createButton('17 Tokens', '3,280 Meta Credits'), //192.94
    this.createButton('50 Tokens', '8,205 Meta Credits'), //164.10
  ];
}
Component.register(IWP);


