
module Higherframe.UI {

  export class AlertAction {

    label: string;
    action: Function;
  }

  export class Alert {
    text: string;
    type: string;
    lifespan: number = 4000;
    actions: Array<AlertAction> = [];
    seen: Boolean = false;;
  }

  export class AlertManager {

    alerts: Array<Alert>;

    constructor(private $timeout: ng.ITimeoutService, private $rootScope: ng.IRootScopeService) {

      this.alerts = [];

      this.$rootScope.$on('$stateChangeStart', () => {

        // Remove seen alerts
        this.alerts.forEach((alert, i) => {

          if (alert.seen) {

            this.alerts.splice(i, 1);
          }
        });

        // Mark unseen alerts as now seen
        this.alerts.forEach((alert) => {

          alert.seen = true;
        });
      })
    }

    add(alert: Alert) {

      this.alerts.push(alert);

      if (alert.lifespan > 0) {

        this.$timeout(() => this.remove(alert), alert.lifespan);
      }
    }

    remove(alert: Alert) {

      var index = this.alerts.indexOf(alert);

      if (index !== -1) {

        this.alerts.splice(index, 1);
      }
    }
  }
}

angular
  .module('siteApp')
  .service('AlertManager', Higherframe.UI.AlertManager);
