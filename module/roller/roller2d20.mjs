export default class ElectricEmbraceRollDialog {

  static async create() {
    //const html = await renderTemplate(
      //	"systems/electricembrace/templates/apps/roller-2d20.html"
      //);

    // Create a new promise for the HTML above.
      return new Promise(resolve => {
        let formData = null;

        const dialog = new Dialog({

          title: "My Dialog Title",
          content: `My dialog content`,
          buttons: {
            buttonA: {
              label: "A Button",
              callback: () => {}
            },
            no: {
              label: "No",
              callback: () => {}
            }
          },
          close: () => {ui.notifications.info("My dialog was rendered!")}
        });

        dialog.render(true);
      });
  }
}
