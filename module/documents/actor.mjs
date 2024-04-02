/**
 * Extend the base Actor document by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class ElectricEmbraceActor extends Actor {

  /** @override */
  prepareData() {
    // Prepare data for the actor. Calling the super version of this executes
    // the following, in order: data reset (to clear active effects),
    // prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
    // prepareDerivedData().
    super.prepareData();
  }

  /** @override */
  prepareBaseData() {
    // Data modifications in this step occur before processing embedded
    // documents or derived data.
  }

  /**
   * @override
   * Augment the basic actor data with additional dynamic data. Typically,
   * you'll want to handle most of your calculated/derived data in this step.
   * Data calculated in this step should generally not exist in template.json
   * (such as ability modifiers rather than ability scores) and should be
   * available both inside and outside of character sheets (such as if an actor
   * is queried and has a roll executed directly from it).
   */
  prepareDerivedData() {
    const actorData = this;
    const systemData = actorData.system;
    const flags = actorData.flags.electricembrace || {};

    // Make separate methods for each Actor type (character, npc, etc.) to keep
    // things organized.
    this._prepareCharacterData(actorData);
    this._prepareDroneData(actorData);
  }

  /**
   * Prepare Character type specific data
   */
  _prepareCharacterData(actorData) {
    if (actorData.type !== 'character' && actorData.type !== 'npc') return;

    // Make modifications to data here. For example:
    const systemData = actorData.system;
    
    this._caluclateDefense();
    this._calculateMaxHP();
    this._calculateInitiative();
    this._calculateMeleeDamage();
    this._calculateAttributeValues();

  }

  /**
   * Prepare NPC type specific data.
   */
  _prepareDroneData(actorData) {
    if (actorData.type !== 'drone') return;

    // Make modifications to data here. For example:
    const systemData = actorData.system;
  }

  /**
   * Override getRollData() that's supplied to rolls.
   */
  getRollData() {
    const data = super.getRollData();

    // Prepare character roll data.
    this._getCharacterRollData(data);
    this._getDroneRollData(data);

    return data;
  }

  /**
   * Prepare character roll data.
   */
  _getCharacterRollData(data) {
    if (this.type !== 'character' && this.type !== 'npc') return;

    // Copy the ability scores to the top level, so that rolls can use
    // formulas like `@str.mod + 4`.
    if (data.attributes) {
      for (let [k, v] of Object.entries(data.attributes)) {
        data[k] = foundry.utils.deepClone(v);
      }
    }

    // Add level for easier access, or fall back to 0.
    if (data.level) {
      data.lvl = data.level.value ?? 0;
    }
  }

  /**
   * Prepare NPC roll data.
   */
  _getDroneRollData(data) {
    if (this.type !== 'drone') return;

    // Process additional NPC data here.
  }

  _caluclateDefense() {
    const defense = this.system.attributes.agi.value < 8 ? 1 : 2;

    this.system.defense.value = defense + this.system.defense.bonus;
  }

  _calculateInitiative() {
    this.system.initiative.value = this.system.attributes.per.base + this.system.attributes.agi.base + this.system.initiative.bonus;
  }

  _calculateMaxHP() {
    const currentLevel = parseInt(this.system.level.value);
  
    this.system.health.max = this.system.attributes.bod.base + this.system.attributes.res.base + currentLevel - 1 + this.system.health.bonus;
    this.system.health.value = Math.min(
      this.system.health.value,
      this.system.health.max
    );
  }

  _calculateMeleeDamage() {
    const body = this.system.attributes.bod.value;

    let meleeDamage = 0;

    if (body <= 7 && body >= 6) {
      meleeDamage = 1;
    }
    else if (body <= 9 && body >= 8) {
      meleeDamage = 2;
    }
    else if (body >= 10) {
      meleeDamage = 3;
    }

    this.system.meleeDamage.value = meleeDamage + this.system.meleeDamage.bonus;
  };


  _calculateCapacity() {
    const currentCap = parseInt(this.system.capacity.value);
    this.system.capacity.max = this.system.capacity.bonus;
    this.system.capacity.value = Math.min(
      this.system.capacity.value,
      this.system.capacity.max
    );
  };

  _calculateAttributeValues(){

    delete this.system.attributes.level;
    for (const attribute in this.system.attributes)
      {
          console.log(this.system.level.value);
          this.system.attributes[attribute].value = this.system.attributes[attribute].base + this.system.attributes[attribute].bonus;
      }
    } 

}
