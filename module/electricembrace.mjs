// Import document classes.
  import { ElectricEmbraceActor } from "./documents/actor.mjs";
import { ElectricEmbraceItem } from "./documents/item.mjs";
// Import sheet classes.
  import { ElectricEmbraceActorSheet } from "./sheets/actor-sheet.mjs";
import { ElectricEmbraceItemSheet } from "./sheets/item-sheet.mjs";
// Import helper/utility classes and constants.
  import { preloadHandlebarsTemplates } from "./helpers/templates.mjs";
import { ELECTRICEMBRACE } from "./helpers/config.mjs";

/* -------------------------------------------- */
  /*  Init Hook                                   */
  /* -------------------------------------------- */

  Hooks.once('init', async function() {

    console.log('Electric Embrace | Initializing Electric Embrace 2d20 module');

    // Add utility classes to the global game object so that they're more easily
    // accessible in global contexts.
      game.electricembrace = {
        ElectricEmbraceActor,
        ElectricEmbraceItem,
        rollItemMacro
      };

    // Add custom constants for configuration.
      CONFIG.ELECTRICEMBRACE = ELECTRICEMBRACE;

    /**
      * Set an initiative formula for the system
      * @type {String}
      */
      CONFIG.Combat.initiative = {
        formula: "@initiative.value",
        decimals: 0
      };

    // Define custom Document classes
    CONFIG.Actor.documentClass = ElectricEmbraceActor;
    CONFIG.Item.documentClass = ElectricEmbraceItem;

    // Register sheet application classes
    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("electricembrace", ElectricEmbraceActorSheet, { makeDefault: true });
    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("electricembrace", ElectricEmbraceItemSheet, { makeDefault: true });

    // Preload Handlebars templates.
      return preloadHandlebarsTemplates();
  });

Hooks.on('chatMessage', (log, message, data) => {

  const is2d20 = message.startsWith('/2d20');

  if (!is2d20)
    return true;

  console.log("LIFE IS GOOD!");
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

  console.log(rollOptions);
  return false;

});

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

/* -------------------------------------------- */
  /*  Ready Hook                                  */
  /* -------------------------------------------- */

  Hooks.once("ready", async function() {
    // Wait to register hotbar drop hook on ready so that modules could register earlier if they want to
    Hooks.on("hotbarDrop", (bar, data, slot) => createItemMacro(data, slot));
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
