import * as hz from 'horizon/core';
import EventContainer from './EventContainer';
import { AgentLocomotionOptions, AgentSpawnResult, AvatarAIAgent } from 'horizon/avatar_ai_agent';

interface propsDefinition {
    npc1: { type: "Entity" };
    npc2: { type: "Entity" };
    npc3: { type: "Entity" };
    npc4: { type: "Entity" };
    npc5: { type: "Entity" };
    npc6: { type: "Entity" };
    npc7: { type: "Entity" };
    npc8: { type: "Entity" };
}

class spawnNPCs extends hz.Component<typeof spawnNPCs> {
  static propsDefinition = {
    npc1: {type:   hz.PropTypes.Entity },
    npc2: {type:   hz.PropTypes.Entity },
    npc3: {type:   hz.PropTypes.Entity },
    npc4: {type:   hz.PropTypes.Entity },
    npc5: {type:   hz.PropTypes.Entity },
    npc6: {type:   hz.PropTypes.Entity },
    npc7: {type:   hz.PropTypes.Entity },
    npc8: {type:   hz.PropTypes.Entity },
  };

  pList: hz.Player[] = [];

  start() {
    this.pList = this.getPlayers();

    const npcKeys = Object.keys(this.props).filter(key => key.startsWith('npc'));
    const npcs = npcKeys.length;
    const npcGizmos: AvatarAIAgent[] = [];

    for (let i = 1; i <= npcs; i++) {
        const npcKey = `npc${i}` as keyof propsDefinition;
        const npc = (this.props)[npcKey]?.as(AvatarAIAgent);
        if (npc) {
            npcGizmos.push(npc);
        }
    }

    this.connectLocalBroadcastEvent(EventContainer.npcBroadcastEvent, (data) => {
      const playersInGame = data.pList.length;
      const spawnAmount = npcs - playersInGame;
      for (let i = 0; i < spawnAmount; i++) {
        console.log("Spawning NPC" + i);
        if  (npcGizmos[i]) {
          npcGizmos[i].spawnAgentPlayer().then((spawnResult) => {
              switch (spawnResult) {
                case AgentSpawnResult.Success:
                  console.log("Behold the wizard!");
                  break;
                case AgentSpawnResult.AlreadySpawned:
                  console.log("The wizard has been here all along!");
                  break;
                case AgentSpawnResult.WorldAtCapacity:
                  console.log("There's no room for the wizard...");
                  break;
                case AgentSpawnResult.Error:
                  console.log("Can't spawn the wizard");
                  break;
            };
          });
        }
      }
    });
    
    this.async.setTimeout(() => {
      this.sendLocalBroadcastEvent(
        EventContainer.npcBroadcastEvent,
        {pList: this.pList}
      );
    }, 500);

    this.async.setTimeout(() => {
      this.sendLocalBroadcastEvent(
        EventContainer.npcInitBroadcastEvent,
        {aList: npcGizmos}
      );
    }, 4000);
  }

/* Mocking the players in world here.
  In a real world scenario, 
  this would be a call to get the list of players 
  that are in the world. 
  
  World.getPlayers();
  
*/

  getPlayers() {
    return [
      new hz.Player(1),
    ];
  }
}
hz.Component.register(spawnNPCs);