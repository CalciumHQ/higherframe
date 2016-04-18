
module Higherframe.Utilities.History.Items {

	export class ResizeComponentHistoryItem extends History.Item {

		public description = 'Move component';

		public components: Array<Common.Drawing.Component>;
		public oldPositions: Array<paper.Point>;
		public newPositions: Array<paper.Point>;
    public oldSizes: Array<paper.Size>;
    public newSizes: Array<paper.Size>;

		constructor(
			components: Array<Common.Drawing.Component>,
			oldPositions: Array<paper.Point>,
			newPositions: Array<paper.Point>,
      oldSizes: Array<paper.Size>,
      newSizes: Array<paper.Size>
		) {

			super();

			this.components = components;
			this.oldPositions = oldPositions;
			this.newPositions = newPositions;
      this.oldSizes = oldSizes;
      this.newSizes = newSizes;
		}
	}
}
