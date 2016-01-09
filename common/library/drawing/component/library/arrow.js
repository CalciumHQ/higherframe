var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Common;
(function (Common) {
    var Drawing;
    (function (Drawing) {
        var Component;
        (function (Component) {
            var Library;
            (function (Library) {
                var Arrow = (function (_super) {
                    __extends(Arrow, _super);
                    /**
                     * Create a new Arrow component
                     */
                    function Arrow(model) {
                        _super.call(this, model);
                        // Implement IDefinition members
                        this.id = Drawing.Component.Type.Arrow;
                        this.tags = [
                            'basic',
                            'line',
                            'flowchart'
                        ];
                        this.properties = [
                            {
                                label: 'Direction',
                                controls: [
                                    {
                                        model: 'direction',
                                        type: String,
                                        ui: 'select',
                                        options: [
                                            {
                                                label: 'None',
                                                value: ''
                                            },
                                            {
                                                label: 'Left',
                                                value: 'left'
                                            },
                                            {
                                                label: 'Right',
                                                value: 'right'
                                            },
                                            {
                                                label: 'Both',
                                                value: 'both'
                                            }
                                        ],
                                        description: 'Set which ends of the line should have an arrow head.'
                                    }
                                ]
                            },
                            {
                                label: 'Type',
                                controls: [
                                    {
                                        model: 'type',
                                        type: String,
                                        ui: 'select',
                                        options: [
                                            {
                                                label: 'Straight',
                                                value: 'straight'
                                            },
                                            {
                                                label: 'Curve',
                                                value: 'curve'
                                            },
                                            {
                                                label: 'Angle',
                                                value: 'angle'
                                            },
                                            {
                                                label: 'Double angle',
                                                value: 'dangle'
                                            }
                                        ]
                                    }
                                ]
                            }
                        ];
                        this.thumbnail = '/assets/images/components/iphone-thumbnail@2x.png';
                        this.snapPoints = [
                            { x: -116, y: -232 },
                            { x: 116, y: -232 }
                        ];
                        var properties = (model.properties);
                        properties.start = properties.start || new paper.Point(-100, 0);
                        properties.end = properties.end || new paper.Point(100, 0);
                        properties.direction = properties.direction || 'right';
                        properties.type = properties.type || 'straight';
                        // Perform the initial draw
                        this.update();
                    }
                    /**
                     * Perform any necessary transformation on the component when saving
                     */
                    Arrow.prototype.serialize = function () {
                        var model = angular.copy(this.model);
                        // Transform paper.Points into relevant data
                        var properties = model.properties;
                        properties.start = {
                            x: properties.start.x,
                            y: properties.start.y
                        };
                        properties.end = {
                            x: properties.end.x,
                            y: properties.end.y
                        };
                        return model;
                    };
                    /**
                     * Redraw the component
                     */
                    Arrow.prototype.update = function () {
                        // Determine palette
                        var theme = new Common.UI.DefaultTheme();
                        var foreColor = this.collaborator ? new paper.Color(this.collaborator.color) : theme.ComponentDefault;
                        if (this.active) {
                            foreColor = theme.ComponentActive;
                        }
                        else if (this.focussed) {
                            foreColor = theme.ComponentFocus;
                        }
                        else if (this.hovered) {
                            foreColor = theme.ComponentHover;
                        }
                        var properties = this.model.properties;
                        // Remove the old parts
                        this.removeChildren();
                        var position = new paper.Point(properties.x, properties.y);
                        var start = position.add(new paper.Point(properties.start.x, properties.start.y));
                        var end = position.add(new paper.Point(properties.end.x, properties.end.y));
                        var startSgm = new paper.Segment(start);
                        var endSgm = new paper.Segment(end);
                        // Draw the line
                        var line = new paper.Path();
                        line.addSegments([startSgm]);
                        switch (properties.type) {
                            case 'straight':
                                break;
                            case 'curve':
                                startSgm.handleOut = new paper.Point(-(start.x - end.x) / 8, (end.y - start.y) / 2);
                                endSgm.handleIn = new paper.Point((start.x - end.x) / 2, -(end.y - start.y) / 8);
                                break;
                            case 'angle':
                                var mid = new paper.Point(properties.start.x, properties.end.y);
                                var midSgm = new paper.Segment(mid);
                                line.addSegments([midSgm]);
                                break;
                            case 'dangle':
                                var midOne = new paper.Point(properties.start.x + 50, properties.start.y);
                                var midTwo = new paper.Point(properties.start.x + 50, properties.end.y);
                                var midOneSgm = new paper.Segment(midOne);
                                var midTwoSgm = new paper.Segment(midTwo);
                                line.addSegments([midOneSgm, midTwoSgm]);
                                break;
                        }
                        line.addSegments([endSgm]);
                        line.strokeColor = foreColor;
                        line.strokeWidth = 1.5;
                        this.addChild(line);
                        // Draw the heads
                        if (properties.direction == 'left' || properties.direction == 'both') {
                            var startHead = paper.Path.RegularPolygon(start.add(new paper.Point(0, 5)), 3, 6);
                            startHead.fillColor = foreColor;
                            startHead.rotate(-90 + line.getTangentAt(0).angle, start);
                            this.addChild(startHead);
                        }
                        if (properties.direction == 'right' || properties.direction == 'both') {
                            var endHead = paper.Path.RegularPolygon(end.add(new paper.Point(0, 5)), 3, 6);
                            endHead.fillColor = foreColor;
                            endHead.rotate(90 + line.getTangentAt(line.length).angle, end);
                            this.addChild(endHead);
                        }
                    };
                    /**
                     * Update model with the state of the view component
                     */
                    Arrow.prototype.updateModel = function () {
                    };
                    Arrow.prototype.onMove = function (event) {
                        this.model.properties.x += event.delta.x;
                        this.model.properties.y += event.delta.y;
                    };
                    /**
                     * Calculate the snap points for the component
                     */
                    Arrow.prototype.getSnapPoints = function () {
                        var properties = this.model.properties;
                        var position = new paper.Point(properties.x, properties.y);
                        return [
                            new Drawing.SnapPoint(position.add(new paper.Point(properties.start)), 'end', 'end'),
                            new Drawing.SnapPoint(position.add(new paper.Point(properties.end)), 'end', 'end')
                        ];
                    };
                    /**
                     * Calculate the drag handles for the component
                     */
                    Arrow.prototype.getDragHandles = function (color) {
                        var _this = this;
                        var properties = this.model.properties;
                        var position = new paper.Point(properties.x, properties.y);
                        var startPoint = position.add(new paper.Point(properties.start.x, properties.start.y));
                        var endPoint = position.add(new paper.Point(properties.end.x, properties.end.y));
                        var start = new Component.DragHandle(new paper.Point(startPoint), color);
                        start.cursor = Drawing.Cursors.ResizeNESW;
                        start.onMove = function (pos) {
                            properties.start = pos.subtract(position);
                            _this.update();
                            return pos;
                        };
                        var end = new Component.DragHandle(new paper.Point(endPoint), color);
                        end.cursor = Drawing.Cursors.ResizeNESW;
                        end.onMove = function (pos) {
                            properties.end = pos.subtract(position);
                            _this.update();
                            return pos;
                        };
                        return [start, end];
                    };
                    Arrow.title = 'Arrow';
                    Arrow.preview = '/assets/images/components/arrow.svg';
                    Arrow.category = 'Basic';
                    return Arrow;
                })(Drawing.Component.Base);
                Library.Arrow = Arrow;
            })(Library = Component.Library || (Component.Library = {}));
        })(Component = Drawing.Component || (Drawing.Component = {}));
    })(Drawing = Common.Drawing || (Common.Drawing = {}));
})(Common || (Common = {}));
//# sourceMappingURL=arrow.js.map