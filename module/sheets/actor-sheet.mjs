import {onManageActiveEffect, prepareActiveEffectCategories} from "../helpers/effects.mjs";

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class ElectricEmbraceActorSheet extends ActorSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["electricembrace", "sheet", "actor"],
      template: "systems/electricembrace/templates/actor/actor-sheet.html",
      width: 720,
      height: 700,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "features" }]
    });
  }

  /** @override */
  get template() {
    return `systems/electricembrace/templates/actor/actor-${this.actor.type}-sheet.html`;
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    // Retrieve the data structure from the base sheet. You can inspect or log
    // the context variable to see the structure, but some key properties for
    // sheets are the actor object, the data object, whether or not it's
    // editable, the items array, and the effects array.
    const context = super.getData();

    // Use a safe clone of the actor data for further operations.
    const actorData = this.actor.toObject(false);

    // Add the actor's data to context.data for easier access, as well as flags.
    context.system = actorData.system;
    context.flags = actorData.flags;

    // Prepare character data and items.
    if (actorData.type == 'character') {
      this._prepareItems(context);
      this._prepareCharacterData(context);
    }

    // Prepare NPC data and items.
    if (actorData.type == 'npc') {
      this._prepareItems(context);
    }

    // Add roll data for TinyMCE editors.
    context.rollData = context.actor.getRollData();

    // Prepare active effects
    context.effects = prepareActiveEffectCategories(this.actor.effects);

    return context;
  }

  /**
   * Organize and classify Items for Character sheets.
   *
   * @param {Object} actorData The actor to prepare.
   *
   * @return {undefined}
   */
  _prepareCharacterData(context) {
    // Handle ability scores.
    for (let [k, v] of Object.entries(context.system.attributes)) {
      v.label = game.i18n.localize(CONFIG.ELECTRICEMBRACE.attributes[k]) ?? k;
    }
  }

  /**
   * Organize and classify Items for Character sheets.
   *
   * @param {Object} actorData The actor to prepare.
   *
   * @return {undefined}
   */
  _prepareItems(context) {
    // Initialize containers.
    const apparel = [];
    const battlehacks = [];
    const cybernetics = {
      "skin": [],
      "os": [],
      "bodykit": [],
      "skeleton": [],
      "arms": [],
      "nervous": [],
      "head": [],
      "drill": [],
      "heart": [],
      "legs": [],
      "other": []
    };
    const consumables = [];
    const skills = [];
    const talents = [];
    const weapons = [];
    // Iterate through items, allocating to containers
    for (let i of context.items) {
      i.img = i.img || DEFAULT_TOKEN;
      // Append to apparel.
      if (i.type === 'apparel') {
        apparel.push(i);
      }
      // Append to battlehacks.
      else if (i.type === 'battlehack') {
        battlehacks.push(i);
      }
      // Append to cybernetics.
      else if (i.type === 'cybernetic') {
        if (i.system.location != "") {
          cybernetics[i.system.location].push(i);
        }
        else {
          cybernetics["other"].push(i);
        }
      }
      // consumables
      else if (i.type === 'consumable') {
        consumables.push(i);
      }
      // skills
      else if (i.type === 'skill') {
        skills.push(i);
      }
      // talents
      else if (i.type === 'talent') {
        talents.push(i);
      }
      // weapons
      else if (i.type === 'weapon') {
        weapons.push(i);
      }
    }
    // Assign and return
    context.apparel = apparel;
    context.battlehacks = battlehacks;
    context.cybernetics = cybernetics;
    context.consumables = consumables;
    context.skills = skills;
    context.talents = talents;
    context.weapons = weapons;
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Render the item sheet for viewing/editing prior to the editable check.
    html.find('.item-edit').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      item.sheet.render(true);
    });

    // -------------------------------------------------------------
    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;
    

    // Click Skill Item
		html.find(".skill .item-name").click(ev => {
			const li = $(ev.currentTarget).parents(".item");
			const item = this.actor.items.get(li.data("itemId"));
      console.log("rolling skill");
			this._onRollSkill(
				item.name,
				item.system.value,
				this.actor.system.attributes[item.system.defaultAttribute].value,
				item.system.tag
			);
		});

    //EE Change tag of skill if selected
    html.find(".skill .item-skill-tag").click(async ev => {
			const li = $(ev.currentTarget).parents(".item");
			const item = this.actor.items.get(li.data("itemId"));
			let updatedItem = { _id: item.id, system: { tag: !item.system.tag } };
			await this.actor.updateEmbeddedDocuments("Item", [updatedItem]);
      console.log(item.system.tag);
		});

    // Add Inventory Item
    html.find('.item-create').click(this._onItemCreate.bind(this));

    // Delete Inventory Item
    html.find('.item-delete').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      item.delete();
      li.slideUp(200, () => this.render(false));
    });

    // Active Effect management
    html.find(".effect-control").click(ev => onManageActiveEffect(ev, this.actor));

    // Rollable abilities.
    html.find('.rollable').click(this._onRoll.bind(this));

    // Drag events for macros.
    if (this.actor.isOwner) {
      let handler = ev => this._onDragStart(ev);
      html.find('li.item').each((i, li) => {
        if (li.classList.contains("inventory-header")) return;
        li.setAttribute("draggable", true);
        li.addEventListener("dragstart", handler, false);
      });
    }
  }

  /**
   * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
   * @param {Event} event   The originating click event
   * @private
   */
  async _onItemCreate(event) {
    event.preventDefault();
    const header = event.currentTarget;
    // Get the type of item to create.
    const type = header.dataset.type;
    // Grab any data associated with this control.
    const data = duplicate(header.dataset);
    // Initialize a default name.
    const name = `New ${type.capitalize()}`;
    // Prepare the item object.
    const itemData = {
      name: name,
      type: type,
      system: data
    };
    // Remove the type from the dataset since it's in the itemData.type prop.
    delete itemData.system["type"];

    // Finally, create the item!
    return await Item.create(itemData, {parent: this.actor});
  }

  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  _onRoll(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;

    // Handle item rolls.
    if (dataset.rollType) {
      if (dataset.rollType == 'item') {
        const itemId = element.closest('.item').dataset.itemId;
        const item = this.actor.items.get(itemId);
        if (item) return item.roll();
      }
    }

    // Handle rolls that supply the formula directly.
    if (dataset.roll) {
      let label = dataset.label ? `[ability] ${dataset.label}` : '';
      let roll = new Roll(dataset.roll, this.actor.getRollData());
      roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        flavor: label,
        rollMode: game.settings.get('core', 'rollMode'),
      });
      return roll;
    }
  }

  _onRollSkill(skillName, rank, attribute, tag) {
		game.electricembrace.Dialog2d20.createDialog({
      rollName: skillName,
			diceNum: 2,
			attribute: attribute,
			skill: rank,
			tag: tag
    });
	}

}
