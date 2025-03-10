import { cuiBindings_Data } from "CUI_Bindings_Data";
import { CodeBlockEvents, Component, Player, PropTypes } from "horizon/core";
import { iwpManager_Data } from "IWP_Manager_Data";
import { iwpManager_Func } from "IWP_Manager_Func";
import { worldVariableNames } from "WorldVariableNames_Data";


class IWP_Manager_Entity extends Component<typeof IWP_Manager_Entity> {
  static propsDefinition = {};

  preStart() {
    this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnItemPurchaseComplete, (player, item, success) => { this.purchase(player, item, success); });
  }

  start() {

  }

  purchase(player: Player, item: string, success: boolean) {
    switch (item) {
      case '1_token_83742c02':
        this.playerPurchaseEffects(player, item, success, 1);
        break;
      case '7_tokens_9411fcdd':
        this.playerPurchaseEffects(player, item, success, 7);
        break;
      case '17_tokens_4e8c8fce':
        this.playerPurchaseEffects(player, item, success, 17);
        break;
      case '50_tokens_e02f20d3':
        this.playerPurchaseEffects(player, item, success, 50);
        break;
      case '40%_token_progress_5cce8274':
        if (success) {
          iwpManager_Func.increasePlayerTokenProgress(player, Math.ceil(iwpManager_Data.amountToEarnAPremiumToken * 0.4));
        }
        break;
      default:
        console.log('Case for item not found: ' + item);
        break;
    }
  }

  playerPurchaseEffects(player: Player, item: string, success: boolean, amount: number) {
    if (success) {
      const playerBalance = amount + this.world.persistentStorage.getPlayerVariable(player, worldVariableNames.numberPPVs.premiumTokens);
      this.world.persistentStorage.setPlayerVariable(player, worldVariableNames.numberPPVs.premiumTokens, playerBalance);

      cuiBindings_Data.tokensBinding.set(playerBalance, [player]);
    }
  }
}
Component.register(IWP_Manager_Entity);