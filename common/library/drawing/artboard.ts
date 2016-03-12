
module Higherframe.Drawing {

  export class Artboard extends Common.Drawing.Item {

    model: Common.Data.IArtboard;

    name: string;
    width: number;
    height: number;
    left: number;
    top: number;

    constructor(model: Common.Data.IArtboard) {

      super();

      this.model = model;
      this.initFromModel();
    }

    private initFromModel() {

      this.name = this.model.name;
      this.width = this.model.width;
      this.height = this.model.height;
      this.left = this.model.left;
      this.top = this.model.top;
    }

    public commit() {

      this.model.name = this.name;
      this.model.width = this.width;
      this.model.height = this.height;
      this.model.left = this.left;
      this.model.top = this.top;
    }

    public sync() {

      this.initFromModel();
    }

    public update() {

      // Determine palette
      var theme: Common.UI.ITheme = new Common.UI.DefaultTheme();
      var foreColor = theme.ComponentDefault;

      if (this.active) {

        foreColor = theme.ComponentActive;
      }

      else if (this.focussed) {

        foreColor = theme.ComponentFocus;
      }

      else if (this.hovered) {

        foreColor = theme.ComponentHover;
      }

      // Remove old parts
      this.removeChildren();

      // The background
			var background = paper.Path.Rectangle(
				new paper.Point(this.left, this.top),
				new paper.Point(this.left + this.width, this.top + this.height)
			);
			background.fillColor = 'white';

      if (this.hovered || this.focussed) {

        background.strokeColor = foreColor;
			}

			else {

				background.strokeColor = 'rgba(0,0,0,0)';
			}

			background.strokeWidth = 1 / paper.view.zoom;
			this.addChild(background);

			// The artboard label
			var label = new paper.PointText({
				point: background.bounds.topLeft.subtract(new paper.Point(0, 10 / paper.view.zoom)),
				content: this.name,
				fillColor: foreColor,
				fontSize: 12 / paper.view.zoom,
				fontFamily: 'Myriad Pro'
			});
			this.addChild(label);
    }

    /**
     * Calculate the transform handles for the component
     */

     getTransformHandles(color: paper.Color): Array<Common.Drawing.IDragHandle> {

       let bounds = this.getArtboardRectangle();

       var topLeft = new Common.Drawing.DragHandle(bounds.topLeft, color);
       topLeft.cursor = 'nwse-resize';
       topLeft.getSnapPoints = (position: paper.Point): Array<Common.Drawing.SnapPoint> => {

         return [new Common.Drawing.SnapPoint(position, 'corner', 'corner')];
       };
       topLeft.onMove = (position: paper.Point): paper.Point => {

         var bounds = this.getBoundsRectangle();

         bounds.topLeft = position;
         this.top = bounds.top;
         this.left = bounds.left;
         this.width = bounds.width;
         this.height = bounds.height;
         this.update();

         return position;
       };

       var topCenter = new Common.Drawing.DragHandle(bounds.topCenter, color);
       topCenter.cursor = 'ns-resize';
       topCenter.getSnapPoints = (position: paper.Point): Array<Common.Drawing.SnapPoint> => {

         return [new Common.Drawing.SnapPoint(position, 'center', 'edge')];
       };
       topCenter.onMove = (position: paper.Point): paper.Point => {

         var bounds = this.getBoundsRectangle();

         bounds.top = position.y;
         this.top = bounds.top;
         this.height = bounds.height;
         this.update();

         return position;
       };

       var topRight = new Common.Drawing.DragHandle(bounds.topRight, color);
       topRight.cursor = 'nesw-resize';
       topRight.getSnapPoints = (position: paper.Point): Array<Common.Drawing.SnapPoint> => {

         return [new Common.Drawing.SnapPoint(position, 'corner', 'corner')];
       };
       topRight.onMove = (position: paper.Point): paper.Point => {

         var bounds = this.getBoundsRectangle();

         bounds.topRight = position;
         this.top = position.y;
         this.width = bounds.width;
         this.height = bounds.height;
         this.update();

         return position;
       };

       var rightCenter = new Common.Drawing.DragHandle(bounds.rightCenter, color);
       rightCenter.cursor = 'ew-resize';
       rightCenter.getSnapPoints = (position: paper.Point): Array<Common.Drawing.SnapPoint> => {

         return [new Common.Drawing.SnapPoint(position, 'edge', 'center')];
       };
       rightCenter.onMove = (position: paper.Point): paper.Point => {

         var bounds = this.getBoundsRectangle();

         bounds.right = position.x;
         this.width = bounds.width;
         this.update();

         return position;
       };

       var bottomRight = new Common.Drawing.DragHandle(bounds.bottomRight, color);
       bottomRight.cursor = 'nwse-resize';
       bottomRight.getSnapPoints = (position: paper.Point): Array<Common.Drawing.SnapPoint> => {

         return [new Common.Drawing.SnapPoint(position, 'corner', 'corner')];
       };
       bottomRight.onMove = (position: paper.Point): paper.Point => {

         var bounds = this.getBoundsRectangle();

         bounds.bottomRight = position;
         this.width = bounds.width;
         this.height = bounds.height;
         this.update();

         return position;
       };

       var bottomCenter = new Common.Drawing.DragHandle(bounds.bottomCenter, color);
       bottomCenter.cursor = 'ns-resize';
       bottomCenter.getSnapPoints = (position: paper.Point): Array<Common.Drawing.SnapPoint> => {

         return [new Common.Drawing.SnapPoint(position, 'center', 'edge')];
       };
       bottomCenter.onMove = (position: paper.Point): paper.Point => {

         var bounds = this.getBoundsRectangle();

         bounds.bottom = position.y;
         this.height = bounds.height;
         this.update();

         return position;
       };

       var bottomLeft = new Common.Drawing.DragHandle(bounds.bottomLeft, color);
       bottomLeft.cursor = 'nesw-resize';
       bottomLeft.getSnapPoints = (position: paper.Point): Array<Common.Drawing.SnapPoint> => {

         return [new Common.Drawing.SnapPoint(position, 'corner', 'corner')];
       };
       bottomLeft.onMove = (position: paper.Point): paper.Point => {

         var bounds = this.getBoundsRectangle();

         bounds.bottomLeft = position;
         this.left = bounds.left;
         this.width = bounds.width;
         this.height = bounds.height;
         this.update();

         return position;
       };

       var leftCenter = new Common.Drawing.DragHandle(bounds.leftCenter, color);
       leftCenter.cursor = 'ew-resize';
       leftCenter.getSnapPoints = (position: paper.Point): Array<Common.Drawing.SnapPoint> => {

         return [new Common.Drawing.SnapPoint(position, 'edge', 'center')];
       };
       leftCenter.onMove = (position: paper.Point): paper.Point => {

         var bounds = this.getBoundsRectangle();

         bounds.left = position.x;
         this.left = bounds.left;
         this.width = bounds.width;
         this.update();

         return position;
       };

       return [
         topLeft,
         topCenter,
         topRight,
         rightCenter,
         bottomRight,
         bottomCenter,
         bottomLeft,
         leftCenter
       ];
     };

     getBoundsRectangle() {

       return this.getArtboardRectangle();
     }

     private getArtboardRectangle() {

       return new paper.Rectangle(
         new paper.Point(this.left, this.top),
         new paper.Size(this.width, this.height)
       );
     }
  }
}
