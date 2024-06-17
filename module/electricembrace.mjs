// Import document classes.
import { ElectricEmbraceActor } from "./documents/actor.mjs";
import { ElectricEmbraceItem } from "./documents/item.mjs";
// Import sheet classes.
import { ElectricEmbraceActorSheet } from "./sheets/actor-sheet.mjs";
import { ElectricEmbraceItemSheet } from "./sheets/item-sheet.mjs";
// Import helper/utility classes and constants.
import { preloadHandlebarsTemplates } from "./helpers/templates.mjs";
import { ELECTRICEMBRACE, SYSTEM_ID } from "./helpers/config.mjs";
import { EffectDie } from "./custom-die/EffectDie.mjs";
import { Dialog2d20 } from "./roller/dialog2d20.mjs";
import { diceSoNiceReadyHook } from "../hooks/diceSoNiceReadyHook.mjs";
import { Roller2d20 } from "./roller/roller2d20.mjs";
import { DieEEDamage } from "./roller/DieEEDamage.mjs";
import { DieEELocation } from "./roller/DieEELocation.mjs";


import { MomentumTracker } from "../apps/MomentumTracker.mjs";
import registerSettings from "./helpers/settings.mjs";

/* -------------------------------------------- */
  /*  Init Hook                                   */
  /* -------------------------------------------- */

  Hooks.once('init', async function() {

    console.log('Electric Embrace | Initializing Electric Embrace 2d20 module');
    console.log('Electric Embrace | LETS GOOO!');

    CONFIG.Dice.types.push(EffectDie);
    CONFIG.Dice.terms.e = EffectDie;
    CONFIG.Dice.terms.c = DieEEDamage;
	  CONFIG.Dice.terms.h = DieEELocation;

    // Add custom constants for configuration.
    CONFIG.ELECTRICEMBRACE = ELECTRICEMBRACE;

    globalThis.SYSTEM_ID = SYSTEM_ID;

    // Add utility classes to the global game object so that they're more easily
    // accessible in global contexts.
      game.electricembrace = {
        ElectricEmbraceActor,
        ElectricEmbraceItem,
        MomentumTracker,
        rollItemMacro,
        Dialog2d20,
        Roller2d20
      };



    /**
      * Set an initiative formula for the system
      * @type {String}
      */
      CONFIG.Combat.initiative = {
        formula: "@initiative.value",
        decimals: 0
      };

    registerSettings();

    // Define custom Document classes
    CONFIG.Actor.documentClass = ElectricEmbraceActor;
    CONFIG.Item.documentClass = ElectricEmbraceItem;

    // Register sheet application classes
    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("electricembrace", ElectricEmbraceActorSheet, { makeDefault: true });
    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("electricembrace", ElectricEmbraceItemSheet, { makeDefault: true });
    loadTemplates(['systems/electricembrace/templates/chat-cards/2d20-chat-card.html']);
    // Preload Handlebars templates.
      return preloadHandlebarsTemplates();
  });

Hooks.on('chatMessage', (log, message, data) => {

  const is2d20 = message.startsWith('/2d20');

  if (!is2d20)
    return true;

  const [
    command,
    targetNumber,
    difficulty,
    extraDice,
    doubleRange,
    complicationRange,
  ] = message.split(' ');

  const rollOptions = {
    targetNumber: parseInt(targetNumber),
    extraDice: parseInt(extraDice) || 0,
    difficulty: parseInt(difficulty) || 1,
    doubleRange: parseInt(doubleRange) || 1,
    complicationRange: parseInt(complicationRange) || 1,
  };

  const myDialog = new Dialog({
    title: "My Dialog Title",
    content: `My dialog content`,
    buttons: {},
    close: () => {ui.notifications.info("My dialog was rendered!")}
  });
  myDialog.render(true);

  const result = game.electricembrace.Roller2d20.roll2d20(rollOptions);
  
  const chatData = {
    ...rollOptions,
    ...result,
  };

  renderTemplate('systems/electricembrace/templates/chat-cards/2d20-chat-card.html', chatData).then(
    (html) => {
      const messageData = {
        user: game.user_id,
        type: CONST.CHAT_MESSAGE_TYPES.ROLL,
        content: html,
      };

      console.log(html);

      const rollMode = game.settings.get('core', 'rollMode');
      ChatMessage.applyRollMode(messageData, rollMode);

      //CONFIG.ChatMessage.entityClass.create(messageData);
      ChatMessage.create(messageData).then(msg => {
        return msg;
      });
    }
  );

  console.log(result);
  return false;

});

Hooks.once("diceSoNiceReady", diceSoNiceReadyHook);

/* -------------------------------------------- */
  /*  Handlebars Helpers                          */
  /* -------------------------------------------- */

  // If you need to add Handlebars helpers, here are a few useful examples:
Handlebars.registerHelper("toLowerCase", function(str) {
  return str.toLowerCase();
});

Handlebars.registerHelper("toUpperCase", function(str) {
  return str.toUpperCase();
});

Handlebars.registerHelper("subString", function(str, s, e) {
  return str.substring(s, e);
});

Handlebars.registerHelper("ifCond", function(v1, operator, v2, options) {
  switch (operator) {
    case "==":
      // eslint-disable-next-line eqeqeq
      return v1 == v2 ? options.fn(this) : options.inverse(this);
    case "===":
      return v1 === v2 ? options.fn(this) : options.inverse(this);
    case "!=":
      // eslint-disable-next-line eqeqeq
      return v1 != v2 ? options.fn(this) : options.inverse(this);
    case "!==":
      return v1 !== v2 ? options.fn(this) : options.inverse(this);
    case "<":
      return v1 < v2 ? options.fn(this) : options.inverse(this);
    case "<=":
      return v1 <= v2 ? options.fn(this) : options.inverse(this);
    case ">":
      return v1 > v2 ? options.fn(this) : options.inverse(this);
    case ">=":
      return v1 >= v2 ? options.fn(this) : options.inverse(this);
    case "&&":
      return v1 && v2 ? options.fn(this) : options.inverse(this);
    case "||":
      return v1 || v2 ? options.fn(this) : options.inverse(this);
    default:
      return options.inverse(this);
  }
});

Handlebars.registerHelper("math", function(
  lvalue,
  operator,
  rvalue,
  options
) {
  lvalue = parseFloat(lvalue);
  rvalue = parseFloat(rvalue);
  return {
    "+": lvalue + rvalue,
    "-": lvalue - rvalue,
    "*": lvalue * rvalue,
    "/": lvalue / rvalue,
    "%": lvalue % rvalue,
  }[operator];
});

Handlebars.registerHelper("fromConfig", function(arg1, arg2) {
  return CONFIG.ELECTRICEMBRACE[arg1][arg2] ? CONFIG.ELECTRICEMBRACE[arg1][arg2] : arg2;
});

// * Use with #if
// {{#if (or
// (eq section1 "foo")
// (ne section2 "bar"))}}e
// .. content
// {{/if}}
Handlebars.registerHelper({
	eq: (v1, v2) => v1 === v2,
	ne: (v1, v2) => v1 !== v2,
	lt: (v1, v2) => v1 < v2,
	gt: (v1, v2) => v1 > v2,
	lte: (v1, v2) => v1 <= v2,
	gte: (v1, v2) => v1 >= v2,
	and() {
		return Array.prototype.every.call(arguments, Boolean);
	},
	or() {
		return Array.prototype.slice.call(arguments, 0, -1).some(Boolean);
	},
});

/* -------------------------------------------- */
  /*  Ready Hook                                  */
  /* -------------------------------------------- */

  Hooks.once("ready", async function() {
    console.log("Running ready hook");
    // Wait to register hotbar drop hook on ready so that modules could register earlier if they want to
    Hooks.on("hotbarDrop", (bar, data, slot) => createItemMacro(data, slot));

    //game.electricembrace.MomentumTracker.initialise();

  });

/* -------------------------------------------- */
  /*  Hotbar Macros                               */
  /* -------------------------------------------- */

  /**
  * Create a Macro from an Item drop.
  * Get an existing item macro if one exists, otherwise create a new one.
  * @param {Object} data     The dropped data
  * @param {number} slot     The hotbar slot to use
  * @returns {Promise}
  */
  async function createItemMacro(data, slot) {
    // First, determine if this is a valid owned item.
      if (data.type !== "Item") return;
    if (!data.uuid.includes('Actor.') && !data.uuid.includes('Token.')) {
      return ui.notifications.warn("You can only create macro buttons for owned Items");
    }
    // If it is, retrieve it based on the uuid.
      const item = await Item.fromDropData(data);

    // Create the macro command using the uuid.
      const command = `game.electricembrace.rollItemMacro("${data.uuid}");`;
    let macro = game.macros.find(m => (m.name === item.name) && (m.command === command));
    if (!macro) {
      macro = await Macro.create({
        name: item.name,
        type: "script",
        img: item.img,
        command: command,
        flags: { "electricembrace.itemMacro": true }
      });
    }
    game.user.assignHotbarMacro(macro, slot);
    return false;
  }

/**
  * Create a Macro from an Item drop.
  * Get an existing item macro if one exists, otherwise create a new one.
  * @param {string} itemUuid
  */
  function rollItemMacro(itemUuid) {
    // Reconstruct the drop data so that we can load the item.
      const dropData = {
        type: 'Item',
        uuid: itemUuid
      };
    // Load the item from the uuid.
      Item.fromDropData(dropData).then(item => {
        // Determine if the item loaded and if it's an owned item.
          if (!item || !item.parent) {
            const itemName = item?.name ?? itemUuid;
            return ui.notifications.warn(`Could not find item ${itemName}. You may need to delete and recreate this macro.`);
          }

        // Trigger the item roll
        item.roll();
      });
  }
