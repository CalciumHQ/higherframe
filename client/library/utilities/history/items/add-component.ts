
module Higherframe.Utilities.History.Items {

	export class AddComponentHistoryItem extends History.Item {

		public description = 'Add component';

		public components: Array<Common.Data.Component>;

		constructor(components: Array<Common.Data.Component>) {

			super();
			this.components = components;
		}
	}
}