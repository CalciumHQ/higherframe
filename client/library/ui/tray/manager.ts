
module Higherframe.UI {

  export class TrayManager {

    regions: Object;
    trays: Object;
    private queue: Object;

    constructor() {

      this.regions = {};
      this.trays = {};
      this.queue = {};
    }

    registerRegion(position: string, region: TrayRegion) {

      this.regions[position] = region;

      region.trays = region.trays.concat(this.getQueue(position));
      this.purgeQueue(position);
    }

    deregisterRegion(position: string) {

      delete this.regions[position];
    }

    getRegion(position: string): TrayRegion {

      return this.regions[position];
    }

    registerTray(id: string, tray: ITray) {

      this.trays[id] = tray;
    }

    deregisterTray(id: string) {

      delete this.trays[id];
    }

    getTray(id: string): ITray {

      return this.trays[id];
    }

    moveTray(tray: ITray, position: string): void {

      var region = this.getRegion(position);

      if (!region) {

        return this.queueTray(tray, position);
      }

      region.trays.push(tray);
    }


    /**
     * Queues a tray for assignment to a region when the region is not ready.
     *
     * If a tray is assigned to a tray region before the region is registered,
     * we want to queue it until the region is ready.
     *
     * @param tray|ITray The tray to be queued
     * @param position|string The region position
     * @return void
     */

    private queueTray(tray: ITray, position: string):void {

      if (typeof this.queue[position] === 'undefined') {

        this.queue[position] = [];
      }

      this.queue[position].push(tray);
    }


    /**
     * Returns the queue for a given region
     *
     * @param position|string The position of the region
     * @return Array<ITray>
     */

    private getQueue(position: string):Array<ITray> {

      return this.queue[position] || [];
    }


    /**
     * Clears the queue for a given region
     *
     * @param position|string The position of the region
     * @return void
     */

    private purgeQueue(position: string):void {

      this.queue[position] = [];
    }
  }
}

angular.module('siteApp').service('TrayManager', Higherframe.UI.TrayManager);
