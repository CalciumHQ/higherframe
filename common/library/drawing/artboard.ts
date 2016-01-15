
module Higherframe.Drawing {

  export class Artboard extends paper.Group {

    name: string;
    width: number;
    height: number;
    left: number;
    top: number;

    hovered: boolean = false;
    active: boolean = false;
    focussed: boolean = false;

    constructor(model: Common.Data.IArtboard) {

      super();

      this.name = model.name;
      this.width = model.width;
      this.height = model.height;
      this.left = model.left;
      this.top = model.top;
    }

    update(canvas: any) {

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

			if (canvas.editMode == Common.Drawing.EditMode.Artboards) {

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
  }
}
