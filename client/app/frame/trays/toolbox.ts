
module Higherframe.Controllers.Frame {

  export class ToolboxTrayController {

  }

  export class ToolboxTray implements Higherframe.UI.ITray {

    label = 'Toolbox';
    templateUrl = '/app/frame/trays/toolbox.html';
    controller = ToolboxTrayController;
  }
}
