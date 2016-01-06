
module Higherframe.Drawing {

  export class Artboard extends paper.Group {

    name: string;
    hovered: boolean = false;
    active: boolean = false;
    focussed: boolean = false;

    constructor(name: string) {

      super();

      this.name = name;
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
				new paper.Point(-800, -600),
				new paper.Point(800, 600)
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
