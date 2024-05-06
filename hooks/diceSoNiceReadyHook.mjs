export function diceSoNiceReadyHook(dice3d) {
  console.log("Running diceSoNiceReadyHook");

  dice3d.addSystem({ id: "electricembrace", name: "Electric Embrace" }, true);

};
