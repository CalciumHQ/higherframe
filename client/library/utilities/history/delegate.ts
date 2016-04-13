
module Higherframe.Utilities.History {

	export interface IHistoryItemDelegate {

		onUndo(item: Item);
		onRedo(item: Item);
	}
}
