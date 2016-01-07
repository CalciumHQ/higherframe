
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

    constructor(model: Higherframe.Data.IArtboard) {

      super();

      this.name = model.name;
      this.width = model.width;
      this.height = model.height;
      this.left = model.left;
      this.top = model.top;
    }

    update(canvas: Higherframe.Wireframe.Canvas) {

      // Determine palette
      var theme: Higherframe.UI.ITheme = new Higherframe.UI.DefaultTheme();
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
				new paper.Point(this.width, this.height)
			);
			background.fillColor = 'white';

			if (canvas.editMode == Higherframe.Wireframe.EditMode.Artboards) {

        background.strokeColor = foreColor;
			}

			else {

				background.strokeColor = '#ccc';
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
