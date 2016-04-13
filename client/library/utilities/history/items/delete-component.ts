
module Higherframe.Utilities.History.Items {

	export class DeleteComponentHistoryItem extends History.Item {

		public description = 'Delete component';

		public components: Array<Common.Data.Component>;

		constructor(components: Array<Common.Data.Component>) {

			super();
			this.components = components;
		}
	}
}
