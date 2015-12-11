
class AlertsCtrl {

  alerts: Array<Higherframe.UI.Alert>;

  constructor(private AlertManager: Higherframe.UI.AlertManager) {

    this.alerts = this.AlertManager.alerts;
  }
}

angular
  .module('siteApp')
  .controller('AlertsCtrl', AlertsCtrl);
