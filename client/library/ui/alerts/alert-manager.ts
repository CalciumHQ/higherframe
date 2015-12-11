
module Higherframe.UI {

  export class AlertAction {

    label: string;
    action: Function;
  }

  export class Alert {
    text: string;
    actions: Array<AlertAction> = [];
  }

  export class AlertManager {

    alerts: Array<Alert>;

    constructor() {

      this.alerts = [];
    }

    push(alert: Alert) {

      this.alerts.push(alert);
    }
  }
}

angular
  .module('siteApp')
  .service('AlertManager', Higherframe.UI.AlertManager);
