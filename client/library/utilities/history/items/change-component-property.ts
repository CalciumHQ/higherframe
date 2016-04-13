
module Higherframe.Utilities.History.Items {

	export class ChangeComponentPropertyHistoryItem extends History.Item {

		public description = 'Change property';

		public components: Array<Common.Drawing.Component>;

		public property: string;
		public oldValues: Array<any>;
		public newValue: any;

		constructor(
			components: Array<Common.Drawing.Component>,
			property: string,
			oldValues: Array<any>,
			newValue: any
		) {

			super();

			this.components = components;
			this.property = property;
			this.oldValues = oldValues;
			this.newValue = newValue;
		}
	}
}
