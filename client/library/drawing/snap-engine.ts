
module Higherframe.Drawing {

	export interface ISnapResult {
		x?: Common.Drawing.SmartGuide,
		y?: Common.Drawing.SmartGuide
	}

	export interface ISnapConfiguration {
		majorDeltaWeighting?: number,
		minorDeltaWeighting?: number,
		snapScoreThreshold?: number
	}

	export class SnapEngine {

    public static snap(
      canvas: Higherframe.Wireframe.Canvas,
      targets: Array<Common.Drawing.Item> | Array<Common.Drawing.SnapPoint>,
      relations: Array<Common.Drawing.Item> | Array<Common.Drawing.SnapPoint>,
      snapPoints?: Array<Common.Drawing.SnapPoint>,
      config?: ISnapConfiguration
    ): ISnapResult {

      let result: ISnapResult = {},
        defaultConfiguration = {
  				majorDeltaWeighting: 1,
  				minorDeltaWeighting: 0.1,
  				snapScoreThreshold: 200
  			},
        configuration = angular.extend(defaultConfiguration, config);

      if (!targets.length || !relations.length) {

        return result;
      }

      // Compare a set of snap points against a set of items
      if (
        /* targets[0] instanceof Common.Drawing.Item */ (<any>targets[0]).getBoundsRectangle &&
        /* relations[0] instanceof Common.Drawing.Item */ (<any>relations[0]).getBoundsRectangle
      ) {

        result = this.calculateItemsAgainstItems(
          <Array<Common.Drawing.Item>>targets,
          <Array<Common.Drawing.Item>>relations,
          configuration,
          snapPoints
        );
      }

      // Compare a set of snap points against a set of items
      else if (
        targets[0] instanceof Common.Drawing.SnapPoint &&
        /* relations[0] instanceof Common.Drawing.Item */ (<any>relations[0]).getBoundsRectangle
      ) {

        result = this.calculatePointsAgainstItems(
          <Array<Common.Drawing.SnapPoint>>targets,
          <Array<Common.Drawing.Item>>relations,
          configuration
        );
      }

      // Compare a set of snap points against a set of snap points
      else if (
        targets[0] instanceof Common.Drawing.SnapPoint &&
        relations[0] instanceof Common.Drawing.SnapPoint
      ) {

        result = this.calculatePointsAgainstPoints(
          <Array<Common.Drawing.SnapPoint>>targets,
          <Array<Common.Drawing.SnapPoint>>relations,
          configuration
        );
      }

      // Draw the guides
			canvas.removeSmartGuides();

			if (result.x) {

				this.draw(canvas, result.x);
			}

			if (result.y) {

				this.draw(canvas, result.y);
			}

			return result;
    }

		private static calculateItemsAgainstItems(targets: Array<Common.Drawing.Item>, relations: Array<Common.Drawing.Item>, configuration: ISnapConfiguration, snapPoints?: Array<Common.Drawing.SnapPoint>): ISnapResult {

			let snapResult: ISnapResult = {};

			// Don't compare targets' snap points with themselves
			relations = _.difference(relations, targets);

			targets.forEach((target: Common.Drawing.Item) => {

				// Use all the target's snap points by default
				snapPoints = snapPoints || target.getSnapPoints();

				let result = this.calculatePointsAgainstItems(snapPoints, relations, configuration);

				// If this calculation has resulted in a stronger guide than previous
				// calculations, update the overall result
				if (result.x && (!snapResult.x || snapResult.x.score > result.x.score)) {

					snapResult.x = result.x;
				}

				if (result.y && (!snapResult.y || snapResult.y.score > result.y.score)) {

					snapResult.y = result.y;
				}
			});

			// Return the required adjustment on the item
			return snapResult;
		}

		private static calculatePointsAgainstItems(targetSnapPoints: Array<Common.Drawing.SnapPoint>, relations: Array<Common.Drawing.Item>, configuration: ISnapConfiguration): ISnapResult {

			let relationSnapPoints: Array<Common.Drawing.SnapPoint> = [];

			// TODO: Whittle down to elements in the nearby area

			// Get a list of all snap points belonging to the relations
			relations.forEach((relation: Common.Drawing.Item) => {

				relationSnapPoints = relationSnapPoints.concat(relation.getSnapPoints());
			});

			// Calculate the snap
			return this.calculatePointsAgainstPoints(targetSnapPoints, relationSnapPoints, configuration);
		}


		/**
		 * Find best x- and y- axis smart guides for a given set of target snap
		 * points and relation snap points
		 */

		private static calculatePointsAgainstPoints(targetSnapPoints: Array<Common.Drawing.SnapPoint>, relationSnapPoints: Array<Common.Drawing.SnapPoint>, configuration: ISnapConfiguration): ISnapResult {

      let snapResult: ISnapResult = {};

			// Look for alignment in snap points
			targetSnapPoints.forEach((snapPoint: Common.Drawing.SnapPoint) => {

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
							if (snapResult.x && snapResult.x.score < score) { return; }
						}

						else if (axis == Common.Drawing.SmartGuideAxis.Y) {

							score += configuration.minorDeltaWeighting * (1/snapPoint.weight) * (1/relationSnapPoint.weight) * Math.abs(yDelta);
							score += configuration.majorDeltaWeighting * (1/snapPoint.weight) * (1/relationSnapPoint.weight) * Math.abs(xDelta);

							// Exclude snaps with a score too high
							if (score > configuration.snapScoreThreshold) { return; }

							// If a snap already exists in this axis with a
							// smaller score, don't continue
							if (snapResult.y && snapResult.y.score < score) { return; }
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

							snapResult.x = smartGuide;
						}

						else {

							snapResult.y = smartGuide;
						}
					}
				});
			});

			// Return the required adjustment on the item
			return snapResult;
		}

		private static draw(canvas: Higherframe.Wireframe.Canvas, guide: Common.Drawing.SmartGuide) {

			canvas.drawSmartGuide(guide);
		}
	}
}
