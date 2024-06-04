export const SYSTEM_ID = "electricembrace";
export const ELECTRICEMBRACE = {};

/**
 * The set of Ability Scores used within the sytem.
 * @type {Object}
 */
 ELECTRICEMBRACE.attributes = {
   "bod": "ELECTRICEMBRACE.AttributeBod",
   "agi": "ELECTRICEMBRACE.AttributeAgi",
   "per": "ELECTRICEMBRACE.AttributePer",
   "int": "ELECTRICEMBRACE.AttributeInt",
   "res": "ELECTRICEMBRACE.AttributeRes",
   "smr": "ELECTRICEMBRACE.AttributeSmr",
};

ELECTRICEMBRACE.WEAPON_TYPES = {
	meleeWeapons: "ELECTRICEMBRACE.WEAPONS.weaponType.meleeWeapons",
	shortWeapons: "ELECTRICEMBRACE.WEAPONS.weaponType.shortWeapons",
	longWeapons:  "ELECTRICEMBRACE.WEAPONS.weaponType.longWeapons",
	techWeapons:  "ELECTRICEMBRACE.WEAPONS.weaponType.techWeapons",
	throwing:     "ELECTRICEMBRACE.WEAPONS.weaponType.throwing",
	unarmed:      "ELECTRICEMBRACE.WEAPONS.weaponType.unarmed",
};

ELECTRICEMBRACE.DAMAGE_EFFECTS = {
	breaking:   "ELECTRICEMBRACE.WEAPONS.damageEffect.breaking",
	burst:      "ELECTRICEMBRACE.WEAPONS.damageEffect.burst",
	persistent: "ELECTRICEMBRACE.WEAPONS.damageEffect.persistent",
	piercing: 	"ELECTRICEMBRACE.WEAPONS.damageEffect.piercing_x",
	overload:   "ELECTRICEMBRACE.WEAPONS.damageEffect.overload",
	spread:     "ELECTRICEMBRACE.WEAPONS.damageEffect.spread",
	stun:       "ELECTRICEMBRACE.WEAPONS.damageEffect.stun",
	vicious:    "ELECTRICEMBRACE.WEAPONS.damageEffect.vicious",
};

ELECTRICEMBRACE.DAMAGE_EFFECT_HAS_RANK = {
	breaking:   false,
	burst:      false,
	persistent: false,
	piercing: 	true,
	overload:   true,
	spread:     false,
	stun:       false,
	vicious:    false,
};

ELECTRICEMBRACE.DAMAGE_TYPES = {
	physical:   "ELECTRICEMBRACE.WEAPONS.damageType.physical",
	energy:     "ELECTRICEMBRACE.WEAPONS.damageType.energy",
	overload:   "ELECTRICEMBRACE.WEAPONS.damageType.overload",
};

ELECTRICEMBRACE.WEAPON_QUALITIES = {
	accurate:       "ELECTRICEMBRACE.WEAPONS.weaponQuality.accurate",
	blast:          "ELECTRICEMBRACE.WEAPONS.weaponQuality.blast",
	closeQuarters:  "ELECTRICEMBRACE.WEAPONS.weaponQuality.closeQuarters",
	concealed:      "ELECTRICEMBRACE.WEAPONS.weaponQuality.concealed",
	debilitating:   "ELECTRICEMBRACE.WEAPONS.weaponQuality.debilitating",
	inaccurate:     "ELECTRICEMBRACE.WEAPONS.weaponQuality.inaccurate",
	mine:           "ELECTRICEMBRACE.WEAPONS.weaponQuality.mine",
	nightVision:    "ELECTRICEMBRACE.WEAPONS.weaponQuality.nightVision",
	parry:          "ELECTRICEMBRACE.WEAPONS.weaponQuality.parry",
	recon:          "ELECTRICEMBRACE.WEAPONS.weaponQuality.recon",
	reliable:       "ELECTRICEMBRACE.WEAPONS.weaponQuality.reliable",
	suppressed:     "ELECTRICEMBRACE.WEAPONS.weaponQuality.suppressed",
	thrown:         "ELECTRICEMBRACE.WEAPONS.weaponQuality.thrown",
	twoHanded:      "ELECTRICEMBRACE.WEAPONS.weaponQuality.twoHanded",
  	heavy:          "ELECTRICEMBRACE.WEAPONS.weaponQuality.heavy",
  	light:          "ELECTRICEMBRACE.WEAPONS.weaponQuality.light",
  	homing:         "ELECTRICEMBRACE.WEAPONS.weaponQuality.homing",
	unreliable:     "ELECTRICEMBRACE.WEAPONS.weaponQuality.unreliable",
};

ELECTRICEMBRACE.WEAPON_QUALITY_HAS_RANK = {
	accurate:       false,
	blast:          false,
	closeQuarters:  false,
	concealed:      false,
	debilitating:   false,
	inaccurate:     false,
	mine:           false,
	nightVision:    false,
	parry:          false,
	recon:          false,
	reliable:       false,
	suppressed:     false,
	thrown:         false,
	twoHanded:      false,
  	heavy:          false,
  	light:          false,
  	homing:         false,
	unreliable:     false,
};

ELECTRICEMBRACE.RANGES = {
	melee: "ELECTRICEMBRACE.RANGE.melee",
	close: "ELECTRICEMBRACE.RANGE.close",
	medium: "ELECTRICEMBRACE.RANGE.medium",
	long: "ELECTRICEMBRACE.RANGE.long",
};