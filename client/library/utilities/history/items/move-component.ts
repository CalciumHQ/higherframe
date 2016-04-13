
module Higherframe.Utilities.History.Items {

	export class MoveComponentHistoryItem extends History.Item {

		public description = 'Move component';

		public components: Array<Common.Drawing.Component>;
		public oldPositions: Array<paper.Point>;
		public newPositions: Array<paper.Point>;

		constructor(
			components: Array<Common.Drawing.Component>,
			oldPositions: Array<paper.Point>,
			newPositions: Array<paper.Point>
		) {

			super();

			this.components = components;
			this.oldPositions = oldPositions;
			this.newPositions = newPositions;
		}
	}
}
