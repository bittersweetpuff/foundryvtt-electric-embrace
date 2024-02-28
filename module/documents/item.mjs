/**
  * Extend the basic Item with some very simple modifications.
  * @extends {Item}
  */
  export class ElectricEmbraceItem extends Item {
    /**
      * Augment the basic Item data model with additional dynamic data.
      */
      prepareData() {
        // As with the actor class, items are documents that can have their data
        // preparation methods overridden (such as prepareBaseData()).
          super.prepareData();

        switch(this.type) {
          case "skill":
            this._prepareSkillData();
            break;
        }
      }

    /**
      * Prepare a data object which is passed to any Roll formulas which are created related to this Item
      * @private
      */

      _prepareSkillData() {
        // Get the localized name of a skill, if there is no
        // localization then it is likely a custom skill, in which
        // case we will just use it's original name
        //
        const nameKey = `ELECTRICEMBRACE.SKILL.${this.name}`;
        this.localizedName = game.i18n.localize(nameKey);

        if (this.localizedName === nameKey) this.localizedName = this.name;

        this.localizedDefaultAttribute = game.i18n.localize(
          `ELECTRICEMBRACE.AbilityAbbr.${this.system.defaultAttribute}`
        );
      }

    getRollData() {
      // If present, return the actor's roll data.
        if ( !this.actor ) return null;
      const rollData = this.actor.getRollData();
      // Grab the item's system data as well.
        rollData.item = foundry.utils.deepClone(this.system);

      return rollData;
    }

    /**
      * Handle clickable rolls.
      * @param {Event} event   The originating click event
      * @private
      */
      async roll() {
        const item = this;

        // Initialize chat data.
          const speaker = ChatMessage.getSpeaker({ actor: this.actor });
        const rollMode = game.settings.get('core', 'rollMode');
        const label = `[${item.type}] ${item.name}`;

        // If there's no roll data, send a chat message.
          if (!this.system.formula) {
            ChatMessage.create({
              speaker: speaker,
              rollMode: rollMode,
              flavor: label,
              content: item.system.description ?? ''
            });
          }
        // Otherwise, create a roll and send a chat message from it.
          else {
            // Retrieve roll data.
              const rollData = this.getRollData();

            // Invoke the roll and submit it to chat.
              const roll = new Roll(rollData.item.formula, rollData);
            // If you need to store the value first, uncomment the next line.
              // let result = await roll.roll({async: true});
            roll.toMessage({
              speaker: speaker,
              rollMode: rollMode,
              flavor: label,
            });
            return roll;
          }
      }
  }
