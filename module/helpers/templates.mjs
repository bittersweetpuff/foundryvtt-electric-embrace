/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
 export const preloadHandlebarsTemplates = async function() {
  return loadTemplates([

    // Actor partials.
    "systems/electricembrace/templates/actor/parts/actor-features.html",
    "systems/electricembrace/templates/actor/parts/actor-items.html",
    "systems/electricembrace/templates/actor/parts/actor-spells.html",
    "systems/electricembrace/templates/actor/parts/actor-effects.html", 
    "systems/electricembrace/templates/actor/parts/actor-skills.html",
    "systems/electricembrace/templates/actor/parts/actor-talents.html",
    "systems/electricembrace/templates/actor/parts/actor-cybernetics.html",
    "systems/electricembrace/templates/actor/parts/actor-status.html"
  ]);
};
