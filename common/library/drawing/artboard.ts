
module Higherframe.Drawing {

  export class Artboard extends paper.Group {

    model: Common.Data.IArtboard;

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

    public update(canvas: any) {

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

			if (this.focussed) {

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
