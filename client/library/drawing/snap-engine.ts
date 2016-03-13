
module Higherframe.Drawing {

  export interface ISnapResult {
    x: Common.Drawing.SmartGuide,
    y: Common.Drawing.SmartGuide
  }

  export interface ISnapConfiguration {
    majorDeltaWeighting?: number,
    minorDeltaWeighting?: number,
    snapScoreThreshold?: number
  }

  export class SnapEngine {

    public static snap(canvas: Higherframe.Wireframe.Canvas, targets: Array<Common.Drawing.Item>, snapPoints: Array<Common.Drawing.SnapPoint>, relations: Array<Common.Drawing.Item>, configuration?: ISnapConfiguration): ISnapResult {

      // Calculate the guides
      var guides = this.calculate(targets, snapPoints, relations, configuration);

      // Draw the guides
      canvas.removeSmartGuides();

      if (guides.x) {

        this.draw(canvas, guides.x);
      }

      if (guides.y) {

        this.draw(canvas, guides.y);
      }

      return guides;
    }

    private static calculate(targets: Array<Common.Drawing.Item>, snapPoints: Array<Common.Drawing.SnapPoint>, relations: Array<Common.Drawing.Item>, config: ISnapConfiguration = {}): ISnapResult {

      var smartGuideX: Common.Drawing.SmartGuide,
				smartGuideY: Common.Drawing.SmartGuide;

			let defaultConfiguration = {
        majorDeltaWeighting: 1,
				minorDeltaWeighting: 0.1,
				snapScoreThreshold: 200
      }

      let configuration = angular.extend(defaultConfiguration, config);

      targets.forEach((target: Common.Drawing.Item) => {

        snapPoints = snapPoints || target.getSnapPoints();

  			// TODO: Whittle down to elements in the nearby area

  			// Work through each element
  			relations.forEach((relation: Common.Drawing.Item) => {

  				// Don't compare target element
  				if (targets.indexOf(relation) !== -1) {

  					return;
  				}

  				var relationSnapPoints = relation.getSnapPoints();

  				// Look for alignment in snap points
  				snapPoints.forEach((snapPoint: Common.Drawing.SnapPoint) => {

  					relationSnapPoints.forEach((relationSnapPoint) => {

  						var xDelta = relationSnapPoint.point.x - snapPoint.point.x;
  						var yDelta = relationSnapPoint.point.y - snapPoint.point.y;

  						// If within the snap threshold
  						if (Math.abs(xDelta) <= 10 || Math.abs(yDelta) <= 10) {

  							// Which axis is the snap in?
  							var axis: Common.Drawing.SmartGuideAxis =
  								(Math.abs(xDelta) <= Math.abs(yDelta)) ?
  								Common.Drawing.SmartGuideAxis.X :
  								Common.Drawing.SmartGuideAxis.Y;

  							// Establish a score for this snap point
  							var score = 0;

  							if (axis == Common.Drawing.SmartGuideAxis.X) {

  								score += configuration.minorDeltaWeighting * (1/snapPoint.weight) * (1/relationSnapPoint.weight) * Math.abs(xDelta);
  								score += configuration.majorDeltaWeighting * (1/snapPoint.weight) * (1/relationSnapPoint.weight) * Math.abs(yDelta);

  								// Exclude snaps with a score too high
  								if (score > configuration.snapScoreThreshold) { return; }

  								// If a snap already exists in this axis with a
  								// smaller score, don't continue
  								if (smartGuideX && smartGuideX.score < score) { return; }
  							}

  							else if (axis == Common.Drawing.SmartGuideAxis.Y) {

  								score += configuration.minorDeltaWeighting * (1/snapPoint.weight) * (1/relationSnapPoint.weight) * Math.abs(yDelta);
  								score += configuration.majorDeltaWeighting * (1/snapPoint.weight) * (1/relationSnapPoint.weight) * Math.abs(xDelta);

  								// Exclude snaps with a score too high
  								if (score > configuration.snapScoreThreshold) { return; }

  								// If a snap already exists in this axis with a
  								// smaller score, don't continue
  								if (smartGuideY && smartGuideY.score < score) { return; }
  							}

  							// Create the new smart guide
  							var smartGuide = new Common.Drawing.SmartGuide();
  							smartGuide.origin = snapPoint;
  							smartGuide.relation = relationSnapPoint;
  							smartGuide.axis = axis;
  							smartGuide.score = score;
  							smartGuide.delta = {
  								x: xDelta,
  								y: yDelta
  							};

  							if (smartGuide.axis == Common.Drawing.SmartGuideAxis.X) {

  								smartGuideX = smartGuide;
  							}

  							else {

  								smartGuideY = smartGuide;
  							}
  						}
  					});
  				});
  			});
      });

			// Return the required adjustment on the item
			return {
				x: smartGuideX,
				y: smartGuideY
			};
    }

    private static draw(canvas: Higherframe.Wireframe.Canvas, guide: Common.Drawing.SmartGuide) {

      canvas.drawSmartGuide(guide);
    }
  }
}
