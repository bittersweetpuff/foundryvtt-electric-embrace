/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export class ElectricEmbraceItemSheet extends ItemSheet {

  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["electricembrace", "sheet", "item"],
      width: 520,
      height: 480,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
    });
  }

  /** @override */
  get template() {
    const path = "systems/electricembrace/templates/item";
    // Return a single sheet for all item types.
    // return `${path}/item-sheet.html`;

    // Alternatively, you could use the following return statement to do a
    // unique item sheet by type, like `weapon-sheet.html`.
    return `${path}/item-${this.item.type}-sheet.html`;
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    // Retrieve base data structure.
    const context = super.getData();

    // Use a safe clone of the item data for further operations.
    const item = context.item;

    // Retrieve the roll data for TinyMCE editors.
    context.rollData = {};
    let actor = this.object?.parent ?? null;
    if (actor) {
      context.rollData = actor.getRollData();
    }

    // Add the actor's data to context.data for easier access, as well as flags.
    context.system = item.system;
    context.flags = item.flags;
    context.ELECTRICEMBRACE = CONFIG.ELECTRICEMBRACE;


    if (item.type === "weapon")
      {

        // DAMAGE TYPE
        context.damageTypes = [];
        for (const key in CONFIG.ELECTRICEMBRACE.DAMAGE_TYPES) {
          context.damageTypes.push({
            active: item.system?.damage?.damageType[key] ?? false,
            key,
            label: CONFIG.ELECTRICEMBRACE.DAMAGE_TYPES[key],
          });
        }
        const weaponQualities = [];
        for (const key in CONFIG.ELECTRICEMBRACE.WEAPON_QUALITIES) {
          weaponQualities.push({
             active: item.system?.damage?.weaponQuality[key].value ?? false,
             hasRank: CONFIG.ELECTRICEMBRACE.WEAPON_QUALITY_HAS_RANK[key],
             rank: item.system?.damage?.weaponQuality[key].rank,
             key,
             label: CONFIG.ELECTRICEMBRACE.WEAPON_QUALITIES[key],
          });
        }

        context.weaponQualities = weaponQualities.sort(
          (a, b) => a.label.localeCompare(b.label)
        );

        const damageEffects = [];
        for (const key in CONFIG.ELECTRICEMBRACE.DAMAGE_EFFECTS) {
          damageEffects.push({
            active: item.system?.damage?.damageEffect[key].value ?? false,
            hasRank: CONFIG.ELECTRICEMBRACE.DAMAGE_EFFECT_HAS_RANK[key],
            rank: item.system?.damage?.damageEffect[key].rank,
            key,
            label: CONFIG.ELECTRICEMBRACE.DAMAGE_EFFECTS[key],
          });
        }

        context.damageEffects = damageEffects.sort(
          (a, b) => a.label.localeCompare(b.label)
        );

      }
    return context;
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Roll handlers, click handlers, etc. would go here.
  }
}
