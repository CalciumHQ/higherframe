
module Higherframe.Utilities.History {

	export class HistoryCollection {
		id: number;
		undoHistory: Array<Item> = [];
		redoHistory: Array<Item> = [];

		constructor(id: number) {

			this.id = id;
		}
	}

	export class Manager {

		private frameHistoryCollections: Array<HistoryCollection> = [];

		private getOrCreateHistoryCollection(frameId): HistoryCollection {

			var frameHistoryCollection = _.find(this.frameHistoryCollections, (frameHistoryCollection) => {

				return frameHistoryCollection.id == frameId;
			});

			if (!frameHistoryCollection) {

				frameHistoryCollection = new HistoryCollection(frameId);
				this.frameHistoryCollections.push(frameHistoryCollection);
			}

			return frameHistoryCollection;
		}

		public getUndoHistory(frameId: number): Array<Item> {

			return this.getOrCreateHistoryCollection(frameId).undoHistory;
		}

		public getRedoHistory(frameId: number): Array<Item> {

			return this.getOrCreateHistoryCollection(frameId).redoHistory;
		}

		public undo(frameId: number) {

			let historyCollection = this.getOrCreateHistoryCollection(frameId);
			if (!historyCollection.undoHistory.length) {

				return;
			}

			let item = historyCollection.undoHistory.pop();
			if (item.delegate) {

				item.delegate.onUndo(item);
			}

			historyCollection.redoHistory.push(item);
		}

		public redo(frameId: number) {

			let historyCollection = this.getOrCreateHistoryCollection(frameId);
			if (!historyCollection.redoHistory.length) {

				return;
			}

			let item = historyCollection.redoHistory.pop();
			if (item.delegate) {

				item.delegate.onRedo(item);
			}

			historyCollection.undoHistory.push(item);
		}

		public add(frameId: number, item: Item) {

			let historyCollection = this.getOrCreateHistoryCollection(frameId);
			historyCollection.undoHistory.push(item);
			historyCollection.redoHistory.splice(0);
		}
	}
}

angular
	.module('siteApp')
	.service('HistoryManager', Higherframe.Utilities.History.Manager);
