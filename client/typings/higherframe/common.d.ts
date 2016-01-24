// Type definitions for Paper.js v0.9.22
// Project: http://paperjs.org/

declare module paper {

    /**
     * The version of Paper.js, as a string.
     */
    export var version: string;

    /**
    * Gives access to paper's configurable settings.
    */
    export var settings: {

        applyMatrix: boolean;
        handleSize: number;
        hitTolerance: number;

    };

    /**
     * The currently active project.
     */
    export var project: Project;

    /**
     * The list of all open projects within the current Paper.js context.
     */
    export var projects: Project[];

    /**
     * The reference to the active project's view.
     * Read Only.
     */
    export var view: View;

    /**
     * The reference to the active tool.
     */
    export var tool: Tool;

    /**
     * The list of available tools.
     */
    export var tools: Tool[];

    /**
     * Injects the paper scope into any other given scope. Can be used for examle to inject the currently active PaperScope into the window's global scope, to emulate PaperScript-style globally accessible Paper classes and objects
     * Please note: Using this method may override native constructors (e.g. Path, RGBColor). This may cause problems when using Paper.js in conjunction with other libraries that rely on these constructors. Keep the library scoped if you encounter issues caused by this.
     * @param scope -
     */
    export function install(scope: any): void;

    /**
     * Sets up an empty project for us. If a canvas is provided, it also creates a View for it, both linked to this scope.
     * @param element - the HTML canvas element this scope should be associated with, or an ID string by which to find the element.
     */
    export function setup(canvas: HTMLCanvasElement | string): void;

    /**
     * Activates this PaperScope, so all newly created items will be placed in its active project.
     */
    export function activate(): void;

    /**
     * An affine transform performs a linear mapping from 2D coordinates to other 2D coordinates that preserves the "straightness" and "parallelness" of lines.
     * Such a coordinate transformation can be represented by a 3 row by 3 column matrix with an implied last row of [ 0 0 1 ]. This matrix transforms source coordinates (x,y) into destination coordinates (x',y') by considering them to be a column vector and multiplying the coordinate vector by the matrix according to the following process:
     * This class is optimized for speed and minimizes calculations based on its knowledge of the underlying matrix (as opposed to say simply performing matrix multiplication).
     */
    export class Matrix {

        /**
         * Creates a 2D affine transform.
         * @param a - the a property of the transform
         * @param c - the c property of the transform
         * @param b - the b property of the transform
         * @param d - the d property of the transform
         * @param tx - the tx property of the transform
         * @param ty - the ty property of the transform
         */
        constructor(a: number, c: number, b: number, d: number, tx: number, ty: number);

        /**
         * The value that affects the transformation along the x axis when scaling or rotating, positioned at (0, 0) in the transformation matrix.
         */
        a: number;

        /**
         * The value that affects the transformation along the y axis when rotating or skewing, positioned at (1, 0) in the transformation matrix.
         */
        c: number;

        /**
         * The value that affects the transformation along the x axis when rotating or skewing, positioned at (0, 1) in the transformation matrix.
         */
        b: number;

        /**
         * The value that affects the transformation along the y axis when scaling or rotating, positioned at (1, 1) in the transformation matrix.
         */
        d: number;

        /**
         * The distance by which to translate along the x axis, positioned at (2, 0) in the transformation matrix.
         */
        tx: number;

        /**
         * The distance by which to translate along the y axis, positioned at (2, 1) in the transformation matrix.
         */
        ty: number;

        /**
         * The transform values as an array, in the same sequence as they are passed to initialize(a, c,b,d,tx,ty).
         * Read only.
         */
        values: number;

        /**
         * The translation of the matrix as a vector.
         * Read only.
         */
        translation: Point;

        /**
         * The scaling values of the matrix, if it can be decomposed.
         * Read only.
         */
        scaling: Point;

        /**
         * The rotation angle of the matrix, if it can be decomposed.
         * Read only.
         */
        rotation: number;

        /**
         * Sets this transform to the matrix specified by the 6 values.
         * @param a - the a property of the transform
         * @param c - the c property of the transform
         * @param b - the b property of the transform
         * @param d - the d property of the transform
         * @param tx - the tx property of the transform
         * @param ty - the ty property of the transform
         */
        set(a: number, c: number, b: number, d: number, tx: number, ty: number): Matrix;

        /**
         * Returns a copy of this transform
         */
        clone(): Matrix;

        /**
         * Checks whether the two matrices describe the same transformation.
         * @param matrix - the matrix to compare this matrix to
         */
        equals(matrix: Matrix): boolean;

        /**
         * returns a string representation of this transform
         */
        toString(): string;

        /**
         * Resets the matrix by setting its values to the ones of the identity matrix that results in no transformation.
         */
        reset(): void;

        /**
         * Attempts to apply the matrix to the content of item that it belongs to, meaning its transformation is baked into the item's content or children.
         * @param recursively - controls whether to apply transformations recursively on children
         */
        apply(): boolean;

        /**
         * Concatenates this transform with a translate transformation.
         * @param point - the vector to translate by
         */
        translate(point: Point): Matrix;

        /**
         * Concatenates this transform with a translate transformation.
         * @param dx - the distance to translate in the x direction
         * @param dy - the distance to translate in the y direction
         */
        translate(dx: number, dy: number): Matrix;

        /**
         * Concatenates this transform with a scaling transformation.
         * @param scale - the scaling factor
         * @param center [optional] - the center for the scaling transformation
         */
        scale(scale: number, center?: Point): Matrix;

        /**
         * Concatenates this transform with a scaling transformation.
         * @param hor - the horizontal scaling factor
         * @param ver - the vertical scaling factor
         * @param center [optional] - the center for the scaling transformation
         */
        scale(hor: number, ver: number, center?: Point): Matrix;

        /**
         * Concatenates this transform with a rotation transformation around an anchor point.
         * @param angle - the angle of rotation measured in degrees
         * @param center - the anchor point to rotate around
         */
        rotate(angle: number, center: Point): Matrix;

        /**
         * Concatenates this transform with a rotation transformation around an anchor point.
         * @param angle - the angle of rotation measured in degrees
         * @param x - the x coordinate of the anchor point
         * @param y - the y coordinate of the anchor point
         */
        rotate(angle: number, x: number, y: number): Matrix;

        /**
         * Concatenates this transform with a shear transformation.
         * @param shear - the shear factor in x and y direction
         * @param center [optional] - the center for the shear transformation
         */
        shear(shear: Point, center?: Point): Matrix;

        /**
         * Concatenates this transform with a shear transformation.
         * @param hor - the horizontal shear factor
         * @param ver - the vertical shear factor
         * @param center [optional] - the center for the shear transformation
         */
        shear(hor: number, ver: number, center?: Point): Matrix;

        /**
         * Concatenates this transform with a skew transformation.
         * @param skew - the skew angles in x and y direction in degrees
         * @param center [optional] - the center for the skew transformation
         */
        skew(skew: Point, center?: Point): Matrix;

        /**
         * Concatenates this transform with a skew transformation.
         * @param hor - the horizontal skew angle in degrees
         * @param ver - the vertical skew angle in degrees
         * @param center [optional] - the center for the skew transformation
         */
        skew(hor: number, ver: number, center?: Point): Matrix;

        /**
         * Concatenates the given affine transform to this transform.
         * @param mx - the transform to concatenate
         */
        concatenate(mx: Matrix): Matrix;

        /**
         * Pre-concatenates the given affine transform to this transform.
         * @param mx - the transform to preconcatenate
         */
        preConcatenate(mx: Matrix): Matrix;

        /**
         * Returns a new instance of the result of the concatenation of the given affine transform with this transform.
         * @param mx - the transform to concatenate
         */
        chain(mx: Matrix): Matrix;

        /**
         * Returns whether this transform is the identity transform
         */
        isIdentity(): boolean;

        /**
         * Returns whether the transform is invertible. A transform is not invertible if the determinant is 0 or any value is non-finite or NaN.
         */
        isInvertible(): boolean;

        /**
         * Checks whether the matrix is singular or not. Singular matrices cannot be inverted.
         */
        isSingular(): boolean;

        /**
         * Transforms a point and returns the result.
         * @param point - the point to be transformed
         */
        transform(point: Point): Matrix;

        /**
         * Transforms an array of coordinates by this matrix and stores the results into the destination array, which is also returned.
         * @param src - the array containing the source points as x, y value pairs
         * @param dst - the array into which to store the transformed point pairs
         * @param count - the number of points to transform
         */
        transform(src: number[], dst: number[], count: number): number[];

        /**
         * Inverse transforms a point and returns the result.
         * @param point - the point to be transformed
         */
        inverseTransform(point: Point): Matrix;

        /**
         * Attempts to decompose the affine transformation described by this matrix into scaling, rotation and shearing, and returns an object with these properties if it succeeded, null otherwise.
         */
        decompose(): any;

        /**
         * Creates the inversion of the transformation of the matrix and returns it as a new insteance. If the matrix is not invertible (in which case isSingular() returns true), null is returned.
         */
        inverted(): Matrix;

        /**
         * Applies this matrix to the specified Canvas Context.
         * @param ctx -
         */
        applyToContext(ctx: CanvasRenderingContext2D): void;

    }
    /**
     * The Point object represents a point in the two dimensional space of the Paper.js project. It is also used to represent two dimensional vector objects.
     */
    export class Point {

        /**
         * Returns a new point object with the smallest x and y of the supplied points.
         * @param point1 -
         * @param point2 -
         */
        static min(point1: Point, point2: Point): Point;

        /**
         * Returns a new point object with the largest x and y of the supplied points.
         * @param point1 -
         * @param point2 -
         */
        static max(point1: Point, point2: Point): Point;

        /**
         * Returns a point object with random x and y values between 0 and 1.
         */
        static random(): Point;

        /**
         * Creates a Point object with the given x and y coordinates.
         * @param x - the x coordinate
         * @param y - the y coordinate
         */
        constructor(x: number, y: number);

        /**
         * Creates a Point object using the numbers in the given array as coordinates.
         * @param array - an array of numbers to use as coordinates
         */
        constructor(values: number[]);

        /**
         * Creates a Point object using the properties in the given object.
         * @param object - the object describing the point's properties
         */
        constructor(object: any);

        /**
         * Creates a Point object using the width and height values of the given Size object.
         * @param size - the size width and height to use
         */
        constructor(size: Size);

        /**
         * Creates a Point object using the coordinates of the given Point object.
         * @param point - the point to copy
         */
        constructor(point: Point);

        /**
         * The x coordinate of the point
         */
        x: number;

        /**
         * The y coordinate of the point
         */
        y: number;

        /**
         * The length of the vector that is represented by this point's coordinates.
         * Each point can be interpreted as a vector that points from the origin (x = 0, y = 0) to the point's location.
         * Setting the length changes the location but keeps the vector's angle.
         */
        length: number;

        /**
         * The vector's angle in degrees, measured from the x-axis to the vector.
         */
        angle: number;

        /**
         * The vector's angle in radians, measured from the x-axis to the vector.
         */
        angleInRadians: number;

        /**
         * The quadrant of the angle of the point.
         * Angles between 0 and 90 degrees are in quadrant 1. Angles between 90 and 180 degrees are in quadrant 2, angles between 180 and 270 degrees are in quadrant 3 and angles between 270 and 360 degrees are in quadrant 4.
         * Read only.
         */
        quadrant: number;

        /**
         * This property is only present if the point is an anchor or control point of a Segment or a Curve. In this case, it returns true it is selected, false otherwise
         */
        selected: boolean;

        /**
         * Checks whether the coordinates of the point are equal to that of the supplied point.
         * @param point - the point to check against
         */
        equals(point: Point): boolean;

        /**
         * Returns a copy of the point.
         */
        clone(): Point;

        /**
         * a string representation of the point
         */
        toString(): string;

        /**
         * Returns the smaller angle between two vectors. The angle is unsigned, no information about rotational direction is given.
         * @param point -
         */
        getAngle(Point: Point): number;

        /**
         * Returns the smaller angle between two vectors in radians. The angle is unsigned, no information about rotational direction is given.
         * @param point: Point
         */
        getAngleInRadians(point: Point): number;

        /**
         * Returns the angle between two vectors. The angle is directional and signed, giving information about the rotational direction.
         * Read more about angle units and orientation in the description of the angle property.
         * @param point -
         */
        getDirectedAngle(point: Point): number;

        /**
         * Returns the distance between the point and another point.
         * @param point -
         * @param squared [optional] - Controls whether the distance should remain squared, or its square root should be calculated. default: false
         */
        getDistance(point: Point, squared?: boolean): number;

        /**
         * Normalize modifies the length of the vector to 1 without changing its angle and returns it as a new point. The optional length parameter defines the length to normalize to.
         * The object itself is not modified!
         * @param length [optional] - The length of the normalized vector, default: 1
         */
        normalize(length?: number): Point;

        /**
         * Rotates the point by the given angle around an optional center point.
         * The object itself is not modified.
         * Read more about angle units and orientation in the description of the angle property.
         * @param angle - the rotation angle
         * @param center - the center point of the rotation
         */
        rotate(angle: number, center: Point): Point;

        /**
         * Transforms the point by the matrix as a new point. The object itself is not modified!
         * @param matrix -
         */
        transform(matrix: Matrix): Point;

        /**
         * Checks whether the point is inside the boundaries of the rectangle.
         * @param rect - the rectangle to check against
         */
        isInside(rect: Rectangle): boolean;

        /**
         * Checks if the point is within a given distance of another point.
         * @param point - the point to check against
         * @param tolerance - the maximum distance allowed
         */
        isClose(point: Point, tolerance: number): boolean;

        /**
         * Checks if the vector represented by this point is colinear (parallel) to another vector.
         * @param point - the vector to check against
         */
        isColinear(point: Point): boolean;

        /**
         * Checks if the vector represented by this point is orthogonal (perpendicular) to another vector.
         * @param point - the vector to check against
         */
        isOrthogonal(point: Point): boolean;

        /**
         * Checks if this point has both the x and y coordinate set to 0.
         */
        isZero(): boolean;

        /**
         * Checks if this point has an undefined value for at least one of its coordinates.
         */
        isNan(): boolean;

        /**
         * Vector addition
         * @param point -
         */
        add(point: Point): Point;

        /**
         * Vector subtraction
         * @param point -
         */
        subtract(point: Point): Point;

        /**
         * Returns the dot product of the point and another point.
         * @param point -
         */
        dot(point: Point): number;

        /**
         * Returns the cross product of the point and another point.
         * @param point -
         */
        cross(point: Point): number;

        /**
         * Returns the projection of the point on another point.
         * Both points are interpreted as vectors.
         * @param point -
         */
        project(point: Point): Point;

        /**
         * Returns a new point with rounded x and y values. The object itself is not modified!
         */
        round(): Point;

        /**
         * Returns a new point with the nearest greater non-fractional values to the specified x and y values. The object itself is not modified!
         */
        ceil(): Point;

        /**
         * Returns a new point with the nearest smaller non-fractional values to the specified x and y values. The object itself is not modified!
         */
        floor(): Point;

        /**
         * Returns a new point with the absolute values of the specified x and y values. The object itself is not modified!
         */
        abs(): Point;

    }
    /**
     * A Rectangle specifies an area that is enclosed by it's top-left point (x, y), its width, and its height. It should not be confused with a rectangular path, it is not an item.
     */
    export class Rectangle {

        /**
         * Creates a Rectangle object.
         * @param point - the top-left point of the rectangle
         * @param size - the size of the rectangle
         */
        constructor(point: Point, size: Size);

        /**
         * Creates a rectangle object.
         * @param x - the left coordinate
         * @param y - the top coordinate
         * @param width - the width
         * @param height - the height
         */
        constructor(x: number, y: number, width: number, height: number);

        /**
         * Creates a Rectangle object.
         * @param object - an object containing properties to be set on the rectangle.
         */
        constructor(object: any);

        /**
         * Creates a rectangle object from the passed points. These do not necessarily need to be the top left and bottom right corners, the constructor figures out how to fit a rectangle between them.
         * @param from - The first point defining the rectangle
         * @param to - The second point defining the rectangle
         */
        constructor(from: Point, to: Point);

        /**
         * Creates a new rectangle object from the passed rectangle object.
         * @param rt - the rectangle to copy from
         */
        constructor(rt: Rectangle);

        /**
         * The x position of the rectangle.
         */
        x: number;

        /**
         * The y position of the rectangle.
         */
        y: number;

        /**
         * The width of the rectangle.
         */
        width: number;

        /**
         * The height of the rectangle.
         */
        height: number;

        /**
         * The top-left point of the rectangle
         */
        point: Point;

        /**
         * The size of the rectangle
         */
        size: Size;

        /**
         * The position of the left hand side of the rectangle. Note that this doesn't move the whole rectangle; the right hand side stays where it was.
         */
        left: number;

        /**
         * The top coordinate of the rectangle. Note that this doesn't move the whole rectangle: the bottom won't move.
         */
        top: number;

        /**
         * The position of the right hand side of the rectangle. Note that this doesn't move the whole rectangle; the left hand side stays where it was.
         */
        right: number;

        /**
         * The bottom coordinate of the rectangle. Note that this doesn't move the whole rectangle: the top won't move.
         */
        bottom: number;

        /**
         * The center point of the rectangle.
         */
        center: Point;

        /**
         * The top-left point of the rectangle.
         */
        topLeft: Point;

        /**
         * The top-right point of the rectangle.
         */
        topRight: Point;

        /**
         * The bottom-left point of the rectangle.
         */
        bottomLeft: Point;

        /**
         * The bottom-right point of the rectangle.
         */
        bottomRight: Point;

        /**
         * The left-center point of the rectangle.
         */
        leftCenter: Point;

        /**
         * The top-center point of the rectangle.
         */
        topCenter: Point;

        /**
         * The right-center point of the rectangle.
         */
        rightCenter: Point;

        /**
         * The bottom-center point of the rectangle.
         */
        bottomCenter: Point;

        /**
         * The area of the rectangle in square points.
         * Read only.
         */
        area: number;

        /**
         * Specifies whether an item's bounds are selected and will also mark the item as selected.
         * Paper.js draws the visual bounds of selected items on top of your project. This can be useful for debugging.
         */
        selected: boolean;

        /**
         * Returns a copy of the rectangle.
         */
        clone(): Rectangle;

        /**
         * Checks whether the coordinates and size of the rectangle are equal to that of the supplied rectangle.
         * @param rect - the rectangle to check against
         */
        equals(rect: Rectangle): boolean;

        /**
         * a string representation of this rectangle
         */
        toString(): string;

        /**
         * Returns true if the rectangle is empty, false otherwise
         */
        isEmpty(): boolean;

        /**
         * Tests if the specified point is inside the boundary of the rectangle.
         * @param point - the specified point
         */
        contains(point: Point): boolean;

        /**
         * Tests if the interior of the rectangle entirely contains the specified rectangle.
         * @param rect - The specified rectangle
         */
        contains(rect: Rectangle): boolean;

        /**
         * Tests if the interior of this rectangle intersects the interior of another rectangle. Rectangles just touching each other are considered as non-intersecting.
         * @param rect - the specified rectangle
         */
        intersects(rect: Rectangle): boolean;

        /**
         * Returns a new rectangle representing the intersection of this rectangle with the specified rectangle.
         * @param rect - The rectangle to be intersected with this rectangle
         */
        intersect(rect: Rectangle): Rectangle;

        /**
         * Returns a new rectangle representing the union of this rectangle with the specified rectangle.
         * @param rect - the rectangle to be combined with this rectangle
         */
        unite(rect: Rectangle): Rectangle;

        /**
         * Adds a point to this rectangle. The resulting rectangle is the smallest rectangle that contains both the original rectangle and the specified point.
         * After adding a point, a call to contains(point) with the added point as an argument does not necessarily return true.
         * The rectangle.contains(point) method does not return true for points on the right or bottom edges of a rectangle. Therefore, if the added point falls on the left or bottom edge of the enlarged rectangle, rectangle.contains(point) returns false for that point.
         * @param point - the point to add to the rectangle
         */
        include(point: Point): Point;

        /**
         * Expands the rectangle by the specified amount in horizontal and vertical directions.
         * @param amount - the amount to expand the rectangle in both directions
         */
        expand(amount: number | Size | Point): void;

        /**
         * Expands the rectangle by the specified amounts in horizontal and vertical directions.
         * @param hor - the amount to expand the rectangle in horizontal direction
         * @param ver - the amount to expand the rectangle in vertical direction
         */
        expand(hor: number, ver: number): void;

        /**
         * Scales the rectangle by the specified amount from its center.
         * @param amount - the amount to scale by
         */
        scale(amount: number): void;

        /**
         * Scales the rectangle in horizontal direction by the specified hor amount and in vertical direction by the specified ver amount from its center.
         * @param hor - the amount to scale the rectangle in horizontal direction
         * @param ver - the amount to scale the rectangle in vertical direction
         */
        scale(hor: number, ver: number): void;

    }
    /**
     * The Size object is used to describe the size or dimensions of something, through its width and height properties.
     */
    export class Size {

        /**
         * Returns a new size object with the smallest width and height of the supplied sizes.
         * @param size1 - the first size
         * @param size2 - the second size
         */
        static min(size1: Size, size2: Size): Size;

        /**
         * Returns a new size object with the largest width and height of the supplied sizes.
         * @param size1 - the first size
         * @param size2 - the second size
         */
        static max(size1: Size, size2: Size): Size;

        /**
         * Returns a size object with random width and height values between 0 and 1.
         */
        static random(): Size;

        /**
         * Creates a Size object with the given width and height values.
         * @param width - the width
         * @param height - the height
         */
        constructor(width: number, height: number);

        /**
         * Creates a Size object using the numbers in the given array as dimensions.
         * @param array - an array of numbers
         */
        constructor(array: number[]);

        /**
         * Creates a Size object using the properties in the given object.
         * @param object - the object literal containing properies (width:10, height:10 etc)
         */
        constructor(object: any);

        /**
         * Creates a Size object using the coordinates of the given Size object.
         * @param size - the size to duplicate from
         */
        constructor(size: Size);

        /**
         * Creates a Size object using the point.x and point.y values of the given Point object.
         * @param point - the point from which to create a size
         */
        constructor(point: Point);

        /**
         * The width of the size
         */
        width: number;

        /**
         * The height of the size
         */
        height: number;

        /**
         * WARNING - This seems undocumented/incorrect
         */
        equals(): boolean;

        /**
         * Returns a copy of the size.
         */
        clone(): Size;

        /**
         * a string representation of the size
         */
        toString(): string;

        /**
         * Checks if this size has both the width and height set to 0.
         */
        isZero(): boolean;

        /**
         * Checks if the width or the height of the size are NaN.
         */
        isNan(): boolean;

        /**
         * Returns a new size with rounded width and height values. The object itself is not modified!
         */
        round(): Size;

        /**
         * Returns a new size with the nearest greater non-fractional values to the specified width and height values. The object itself is not modified!
         */
        ceil(): Size;

        /**
         * Returns a new size with the nearest smaller non-fractional values to the specified width and height values. The object itself is not modified!
         */
        floor(): Size;

        /**
         * Returns a new size with the absolute values of the specified width and height values. The object itself is not modified!
         */
        abs(): Size;

    }
    export interface IFrameEvent {

        /**
         * the number of times the frame event was fired.
         */
        count: number;

        /**
         * the total amount of time passed since the first
         */
        time: number;

        /**
         *
         */
        delta: number;

    }
    /**
     * The PaperScope class represents the scope associated with a Paper context. When working with PaperScript, these scopes are automatically created for us, and through clever scoping the properties and methods of the active scope seem to become part of the global scope.
     * When working with normal JavaScript code, PaperScope objects need to be manually created and handled.
     * Paper classes can only be accessed through PaperScope objects. Thus in PaperScript they are global, while in JavaScript, they are available on the global paper object. For JavaScript you can use paperScope.install(scope) to install the Paper classes and objects on the global scope. Note that when working with more than one scope, this still works for classes, but not for objects like paperScope.project, since they are not updated in the injected scope if scopes are switched.
     * The global paper object is simply a reference to the currently active PaperScope.
     */
    export class PaperScope {

        /**
         * The version of Paper.js, as a string.
         */
        version: string;

        /**
        * Gives access to paper's configurable settings.
        */
        settings: {

            applyMatrix: boolean;
            handleSize: number;
            hitTolerance: number;

        };

        /**
         * The currently active project.
         */
        project: Project;

        /**
         * The list of all open projects within the current Paper.js context.
         */
        projects: Project[];

        /**
         * The reference to the active project's view.
         * Read Only.
         */
        view: View;

        /**
         * The reference to the active tool.
         */
        tool: Tool;

        /**
         * The list of available tools.
         */
        tools: Tool[];

        /**
         * Injects the paper scope into any other given scope. Can be used for examle to inject the currently active PaperScope into the window's global scope, to emulate PaperScript-style globally accessible Paper classes and objects
         * Please note: Using this method may override native constructors (e.g. Path, RGBColor). This may cause problems when using Paper.js in conjunction with other libraries that rely on these constructors. Keep the library scoped if you encounter issues caused by this.
         * @param scope -
         */
        install(scope: any): void;

        /**
         * Sets up an empty project for us. If a canvas is provided, it also creates a View for it, both linked to this scope.
         * @param element - the HTML canvas element this scope should be associated with, or an ID string by which to find the element.
         */
        setup(canvas: HTMLCanvasElement | string): void;

        /**
         * Activates this PaperScope, so all newly created items will be placed in its active project.
         */
        activate(): void;

        /**
         * Retrieves a PaperScope object with the given scope id.
         * @param id -
         */
        static get(id: string): PaperScope;

    }
    /**
     * The Item type allows you to access and modify the items in Paper.js projects. Its functionality is inherited by different project item types such as Path, CompoundPath, Group, Layer and Raster. They each add a layer of functionality that is unique to their type, but share the underlying properties and functions that they inherit from Item.
     */
    export class Item {

        /**
         * The tangential vector to the #curve at the given location.
         */
        tangent: Point;

        /**
         * The normal vector to the #curve at the given location.
         */
        normal: Point;

        /**
         * The curvature of the #curve at the given location.
         */
        curvature: number;

        /**
         * The unique id of the item.
         * Read Only.
         */
        id: number;

        /**
         * The class name of the item as a string.
         * String('Group', 'Layer', 'Path', 'CompoundPath', 'Shape', 'Raster', 'PlacedSymbol', 'PointText')
         */
        className: string;

        /**
         * The name of the item. If the item has a name, it can be accessed by name through its parent's children list.
         */
        name: string;

        /**
         * The path style of the item.
         */
        style: Style;

        /**
         * Specifies whether the item is visible. When set to false, the item won't be drawn.
         */
        visible: boolean;

        /**
         * The blend mode with which the item is composited onto the canvas. Both the standard canvas compositing modes, as well as the new CSS blend modes are supported. If blend-modes cannot be rendered natively, they are emulated. Be aware that emulation can have an impact on performance.
         * String('normal', 'multiply', 'screen', 'overlay', 'soft-light', 'hard-light', 'color-dodge', 'color-burn', 'darken', 'lighten', 'difference', 'exclusion', 'hue', 'saturation', 'luminosity', 'color', 'add', 'subtract', 'average', 'pin-light', 'negation', 'source-over', 'source-in', 'source-out', 'source-atop', 'destination-over', 'destination-in', 'destination-out', 'destination-atop', 'lighter', 'darker', 'copy', 'xor')
         */
        blendMode: string;

        /**
         * The opacity of the item as a value between 0 and 1.
         */
        opacity: number;

        /**
         * Specifies whether the item is selected. This will also return true for Group items if they are partially selected, e.g. groups containing selected or partially selected paths.
         * Paper.js draws the visual outlines of selected items on top of your project. This can be useful for debugging, as it allows you to see the construction of paths, position of path curves, individual segment points and bounding boxes of symbol and raster items.
         */
        selected: boolean;

        /**
         * Specifies whether the item defines a clip mask. This can only be set on paths, compound paths, and text frame objects, and only if the item is already contained within a clipping group.
         */
        clipMask: boolean;

        /**
         * A plain javascript object which can be used to store arbitrary data on the item.
         */
        data: any;

        /**
         * The item's position within the parent item's coordinate system. By default, this is the rectangle.center of the item's bounds rectangle.
         */
        position: Point;

        /**
         * The item's pivot point specified in the item coordinate system, defining the point around which all transformations are hinging. This is also the reference point for position. By default, it is set to null, meaning the rectangle.center of the item's bounds rectangle is used as pivot.
         */
        pivot: Point;

        /**
         * The bounding rectangle of the item excluding stroke width.
         */
        bounds: Rectangle;

        /**
         * The bounding rectangle of the item including stroke width.
         */
        strokeBounds: Rectangle;

        /**
         * The bounding rectangle of the item including handles.
         */
        handleBounds: Rectangle;

        /**
         * The current rotation angle of the item, as described by its matrix.
         */
        rotation: number;

        /**
         * The current scale factor of the item, as described by its matrix.
         */
        scaling: Point;

        /**
         * The item's transformation matrix, defining position and dimensions in relation to its parent item in which it is contained.
         */
        matrix: Matrix;

        /**
         * The item's global transformation matrix in relation to the global project coordinate space. Note that the view's transformations resulting from zooming and panning are not factored in.
         * Read Only.
         */
        globalMatrix: Matrix;

        /**
         * Controls whether the transformations applied to the item (e.g. through transform(matrix), rotate(angle), scale(scale), etc.) are stored in its matrix property, or whether they are directly applied to its contents or children (passed on to the segments in Path items, the children of Group items, etc.).
         */
        applyMatrix: boolean;

        /**
         * The project that this item belongs to.
         * Read only.
         */
        project: Project;

        /**
         * The view that this item belongs to.
         * Read Only.
         */
        view: View;

        /**
         * The layer that this item is contained within.
         * Read Only.
         */
        layer: Layer;

        /**
         * The item that this item is contained within.
         */
        parent: Item;

        /**
         * The children items contained within this item. Items that define a name can also be accessed by name.
         * Please note: The children array should not be modified directly using array functions. To remove single items from the children list, use item.remove(), to remove all items from the children list, use item.removeChildren(). To add items to the children list, use item.addChild(item) or item.insertChild(index, item).
         */
        children: Item[];

        /**
         * The first item contained within this item. This is a shortcut for accessing item.children[0].
         */
        firstChild: Item;

        /**
         * The last item contained within this item.This is a shortcut for accessing item.children[item.children.length - 1].
         */
        lastChild: Item;

        /**
         * The next item on the same level as this item.
         * Read Only.
         */
        nextSibling: Item;

        /**
         * The previous item on the same level as this item.
         * Read Only.
         */
        previousSibling: Item;

        /**
         * The index of this item within the list of its parent's children.
         * Read only.
         */
        index: number;

        /**
         * The color of the stroke.
         */
        strokeColor: Color | string;

        /**
         * The width of the stroke.
         */
        strokeWidth: number;

        /**
         * The shape to be used at the beginning and end of open Path items, when they have a stroke.
         * String('round', 'square', 'butt')
         */
        strokeCap: string;

        /**
         * The shape to be used at the segments and corners of Path items when they have a stroke.
         * String('miter', 'round', 'bevel')
         */
        strokeJoin: string;

        /**
         * The dash offset of the stroke.
         */
        dashOffset: number;

        /**
         * Specifies whether the stroke is to be drawn taking the current affine transformation into account (the default behavior), or whether it should appear as a non-scaling stroke.
         */
        strokeScaling: boolean;

        /**
         * Specifies an array containing the dash and gap lengths of the stroke.
         */
        dashArray: number[];

        /**
         * When two line segments meet at a sharp angle and miter joins have been specified for item.strokeJoin, it is possible for the miter to extend far beyond the item.strokeWidth of the path. The miterLimit imposes a limit on the ratio of the miter length to the item.strokeWidth.
         */
        miterLimit: number;

        /**
         * The winding-rule with which the shape gets filled. Please note that only modern browsers support winding-rules other than 'nonzero'.
         * String('nonzero', 'evenodd')
         */
        windingRule: string;

        /**
         * The fill color of the item.
         */
        fillColor: Color | string;

        /**
         * The color the item is highlighted with when selected. If the item does not specify its own color, the color defined by its layer is used instead.
         */
        selectedColor: Color | string;

        /**
         * Item level handler function to be called on each frame of an animation.
         * The function receives an event object which contains information about the frame event:
         */
        onFrame: (event: IFrameEvent) => void;

        /**
         * The function to be called when the mouse button is pushed down on the item. The function receives a MouseEvent object which contains information about the mouse event.
         */
        onMouseDown: (event: MouseEvent) => void;

        /**
         * The function to be called when the mouse button is released over the item.
         * The function receives a MouseEvent object which contains information about the mouse event.
         */
        onMouseUp: (event: MouseEvent) => void;

        /**
         * The function to be called when the mouse clicks on the item. The function receives a MouseEvent object which contains information about the mouse event.
         */
        onClick: (event: MouseEvent) => void;

        /**
         * The function to be called when the mouse double clicks on the item. The function receives a MouseEvent object which contains information about the mouse event.
         */
        onDoubleClick: (event: MouseEvent) => void;

        /**
         * The function to be called repeatedly when the mouse moves on top of the item. The function receives a MouseEvent object which contains information about the mouse event.
         */
        onMouseMove: (event: MouseEvent) => void;

        /**
         * The function to be called when the mouse moves over the item. This function will only be called again, once the mouse moved outside of the item first. The function receives a MouseEvent object which contains information about the mouse event.
         */
        onMouseEnter: (event: MouseEvent) => void;

        /**
         * The function to be called when the mouse moves out of the item.
         * The function receives a MouseEvent object which contains information about the mouse event.
         */
        onMouseLeave: (event: MouseEvent) => void;

        /**
         * Sets those properties of the passed object literal on this item to the values defined in the object literal, if the item has property of the given name (or a setter defined for it).
         */
        set(props: any): Item;

        /**
         * Clones the item within the same project and places the copy above the item.
         * @param insert [optional] - specifies whether the copy should be inserted into the DOM. When set to true, it is inserted above the original. default: true
         */
        clone(insert?: boolean): Item;

        /**
         * When passed a project, copies the item to the project, or duplicates it within the same project. When passed an item, copies the item into the specified item.
         * @param item - the item or project to copy the item to
         */
        copyTo(item: Item): Item;

        /**
         * Rasterizes the item into a newly created Raster object. The item itself is not removed after rasterization.
         * @param resolution [optional] - the resolution of the raster in pixels per inch (DPI). If not specified, the value of view.resolution is used. default: view.resolution
         */
        rasterize(resolution: number): Raster;

        /**
         * Checks whether the item's geometry contains the given point.
         * @param point - The point to check for.
         */
        contains(point: Point): boolean;

        /**
         *
         * @param rect - the rectangle to check against
         */
        isInside(rect: Rectangle): boolean;

        /**
         *
         * @param item - the item to check against
         */
        intersects(item: Item): boolean;

        /**
         * Perform a hit-test on the items contained within the project at the location of the specified point.
         * The options object allows you to control the specifics of the hit-test and may contain a combination of the following values:
         * @param point - the point where the hit-test should be performed
         * @param options.tolerance -the tolerance of the hit-test in points. Can also be controlled through paperScope.settings.hitTolerance
         * @param options.class - only hit-test again a certain item class and its sub-classes: Group, Layer, Path, CompoundPath, Shape, Raster, PlacedSymbol, PointText, etc.
         * @param options.fill - hit-test the fill of items.
         * @param options.stroke - hit-test the stroke of path items, taking into account the setting of stroke color and width.
         * @param options.segments - hit-test for segment.point of Path items.
         * @param options.curves - hit-test the curves of path items, without taking the stroke color or width into account.
         * @param options.handles - hit-test for the handles.  (segment.handleIn / segment.handleOut) of path segments.
         * @param options.ends - only hit-test for the first or last segment points of open path items.
         * @param options.bounds - hit-test the corners and side-centers of the bounding rectangle of items (item.bounds).
         * @param options.center - hit-test the rectangle.center of the bounding rectangle of items (item.bounds).
         * @param options.guides - hit-test items that have Item#guide set to true.
         * @param options.selected - only hit selected items.
         */
        hitTest(point: Point, options?: { tolerance?: number; class?: string; fill?: boolean; stroke?: boolean; segments?: boolean; curves?: boolean; handles?: boolean; ends?: boolean; bounds?: boolean; center?: boolean; guides?: boolean; selected?: boolean; }): HitResult;

        /**
         * Checks whether the item matches the criteria described by the given object, by iterating over all of its properties and matching against their values through matches(name, compare).
         * See project.getItems(match) for a selection of illustrated examples.
         * @param match - the criteria to match against.
         */
        matches(match: any): boolean;

        /**
         * Checks whether the item matches the given criteria. Extended matching is possible by providing a compare function or a regular expression.
         * Matching points, colors only work as a comparison of the full object, not partial matching (e.g. only providing the x-coordinate to match all points with that x-value). Partial matching does work for item.data.
         * @param name - the name of the state to match against.
         * @param compare - the value, function or regular expression to compare against.
         */
        matches(name: string, compare: any): boolean;

        /**
         * Fetch the descendants (children or children of children) of this item that match the properties in the specified object.
         * Extended matching is possible by providing a compare function or regular expression. Matching points, colors only work as a comparison of the full object, not partial matching (e.g. only providing the x- coordinate to match all points with that x-value). Partial matching does work for item.data.
         * Matching items against a rectangular area is also possible, by setting either match.inside or match.overlapping to a rectangle describing the area in which the items either have to be fully or partly contained.
         * @param match.inside - the rectangle in which the items need to be fully contained.
         * @param match.overlapping - the rectangle with which the items need to at least partly overlap.
         */
        getItems(match: any): Item[];

        /**
         * Fetch the first descendant (child or child of child) of this item that matches the properties in the specified object.
         * Extended matching is possible by providing a compare function or regular expression. Matching points, colors only work as a comparison of the full object, not partial matching (e.g. only providing the x- coordinate to match all points with that x-value). Partial matching does work for item.data.
         * @param match - the criteria to match against
         */
        getItem(match: any): Item;

        /**
         * Exports (serializes) the project with all its layers and child items to a JSON data string.
         * @param options [optional] - default {asString: true, precision: 5}
         * @param options.asString - whether the JSON is returned as a Object or a String.
         * @param options.precision - the amount of fractional digits in numbers used in JSON data.
         */
        exportJSON(options?: { asString?: boolean; precision?: number }): string;

        /**
         * Imports (deserializes) the stored JSON data into the project.
         * Note that the project is not cleared first. You can call project.clear() to do so.
         */
        importJSON(json: string): void;

        /**
         * Exports the project with all its layers and child items as an SVG DOM, all contained in one top level SVG group node.
         * @param options [optional] the export options, default: { asString: false, precision: 5, matchShapes: false }
         * @param options.asString - whether a SVG node or a String is to be returned.
         * @param options.precision - the amount of fractional digits in numbers used in SVG data.
         * @param options.matchShapes - whether path items should tried to be converted to shape items, if their geometries can be made to match
         */
        exportSVG(options?: { asString?: boolean; precision?: number; matchShapes?: boolean }): SVGElement;

        /**
         * Converts the provided SVG content into Paper.js items and adds them to the active layer of this project.
         * Note that the project is not cleared first. You can call project.clear() to do so.
         * @param svg - the SVG content to import
         * @param options [optional] - the import options, default: { expandShapes: false }
         * @param options.expandShapes - whether imported shape items should be expanded to path items.
         */
        importSVG(svg: SVGElement | string, options?: any): Item;

        /**
         * Adds the specified item as a child of this item at the end of the its children list. You can use this function for groups, compound paths and layers.
         * @param item - the item to add as a child
         */
        addChild(item: Item): Item;

        /**
         * Inserts the specified item as a child of this item at the specified index in its children list. You can use this function for groups, compound paths and layers.
         * @param index - the index
         * @param item - the item to be inserted as a child
         */
        insertChild(index: number, item: Item): Item;

        /**
         * Adds the specified items as children of this item at the end of the its children list. You can use this function for groups, compound paths and layers.
         * @param items - The items to be added as children
         */
        addChildren(items: Item[]): Item[];

        /**
         * Inserts the specified items as children of this item at the specified index in its children list. You can use this function for groups, compound paths and layers.
         * @param index -
         * @param items - The items to be appended as children
         */
        insertChildren(index: number, items: Item[]): Item[];

        /**
         * Inserts this item above the specified item.
         * @param item - the item above which it should be inserted
         */
        insertAbove(item: Item): Item;

        /**
         * Inserts this item below the specified item.
         * @param item - the item below which it should be inserted
         */
        insertBelow(item: Item): Item;

        /**
         * Sends this item to the back of all other items within the same parent.
         */
        sendToBack(): void;

        /**
         * Brings this item to the front of all other items within the same parent.
         */
        bringToFront(): void;

        /**
         * If this is a group, layer or compound-path with only one child-item, the child-item is moved outside and the parent is erased. Otherwise, the item itself is returned unmodified.
         */
        reduce(): Item;

        /**
         * Removes the item and all its children from the project. The item is not destroyed and can be inserted again after removal.
         */
        remove(): boolean;

        /**
         * Replaces this item with the provided new item which will takes its place in the project hierarchy instead.
         * @param item - the item to replace this one with
         */
        replaceWith(item: Item): boolean;

        /**
         * Removes all of the item's children (if any).
         */
        removeChildren(): Item[];

        /**
         * Removes the children from the specified from index to the to index from the parent's children array.
         * @param from - the beginning index, inclusive
         * @param to [optional] - the ending index, exclusive, default: children.length
         */
        removeChildren(from: number, to?: number): Item[];

        /**
         * Reverses the order of the item's children
         */
        reverseChildren(): void;

        /**
         * Specifies whether the item has any content or not. The meaning of what content is differs from type to type. For example, a Group with no children, a TextItem with no text content and a Path with no segments all are considered empty.
         */
        isEmpty(): boolean;

        /**
         * Checks whether the item has a fill.
         */
        hasFill(): boolean;

        /**
         * Checks whether the item has a stroke.
         */
        hasStroke(): boolean;

        /**
         * Checks whether the item has a shadow.
         */
        hasShadow(): boolean;

        /**
         * Checks if the item contains any children items.
         */
        hasChildren(): boolean;

        /**
         * Checks whether the item and all its parents are inserted into the DOM or not.
         */
        isInserted(): boolean;

        /**
         * Checks if this item is above the specified item in the stacking order of the project.
         * @param item - The item to check against
         */
        isAbove(item: Item): boolean;

        /**
         * Checks if the item is below the specified item in the stacking order of the project.
         * @param item - The item to check against
         */
        isBelow(item: Item): boolean;

        /**
         * Checks whether the specified item is the parent of the item.
         * @param item - The item to check against
         */
        isParent(item: Item): boolean;

        /**
         * Checks whether the specified item is a child of the item.
         * @param item - The item to check against
         */
        isChild(item: Item): boolean;

        /**
         * Checks if the item is contained within the specified item.
         * @param item - The item to check against
         */
        isDescendant(item: Item): boolean;

        /**
         * Checks if the item is an ancestor of the specified item.
         * @param item - the item to check against
         */
        isAncestor(item: Item): boolean;

        /**
         * Checks whether the item is grouped with the specified item.
         * @param item -
         */
        isGroupedWith(item: Item): boolean;

        /**
         * Translates (moves) the item by the given offset point.
         * @param delta - the offset to translate the item by
         */
        translate(delta: number): Point;

        /**
         * Rotates the item by a given angle around the given point.
         * Angles are oriented clockwise and measured in degrees.
         * @param angle - the rotation angle
         * @param center [optional] - default: item.position
         */
        rotate(angle: number, center?: Point): void;

        /**
         * Scales the item by the given value from its center point, or optionally from a supplied point.
         * @param scale - the scale factor
         * @param center [optional] - default: item.position
         */
        scale(scale: number, center?: Point): void;

        /**
         * Scales the item by the given values from its center point, or optionally from a supplied point.
         * @param hor - the horizontal scale factor
         * @param ver - the vertical scale factor
         * @param center [optional] - default: item.position
         */
        scale(hor: number, ver: number, center?: Point): void;

        /**
         * Shears the item by the given value from its center point, or optionally by a supplied point.
         * @param shear - the horziontal and vertical shear factors as a point
         * @param center [optional] - default: item.position
         */
        shear(shear: number, center?: Point): void;

        /**
         * Shears the item by the given values from its center point, or optionally by a supplied point.
         * @param hor - the horizontal shear factor
         * @param ver - the vertical shear factor
         * @param center [optional] - default: item.position
         */
        shear(hor: number, ver: number, center?: Point): void;

        /**
         * Skews the item by the given angles from its center point, or optionally by a supplied point.
         * @param skew - the horziontal and vertical skew angles in degrees
         * @param center [optional] - default: item.position
         */
        skew(skew: Point, center?: Point): void;

        /**
         * Skews the item by the given angles from its center point, or optionally by a supplied point.
         * @param hor - the horizontal skew angle in degrees
         * @param ver - the vertical sskew angle in degrees
         * @param center [optional] - default: item.position
         */
        skew(hor: number, ver: number, center?: Point): void;

        /**
         * Transform the item.
         * @param matrix - the matrix by which the item shall be transformed.
         */
        transform(matrix: Matrix): void;

        /**
         * Converts the specified point from global project coordinate space to the item's own local coordinate space.
         * @param point - the point to be transformed
         */
        globalToLocal(point: Point): Point;

        /**
         * Converts the specified point from the item's own local coordinate space to the global project coordinate space.
         * @param point - the point to be transformed
         */
        localToGlobal(point: Point): Point;

        /**
         * Converts the specified point from the parent's coordinate space to item's own local coordinate space.
         * @param point - the point to be transformed
         */
        parentToLocal(point: Point): Point;

        /**
        * Converts the specified point from the item's own local coordinate space to the parent's coordinate space.
        * @param point - the point to be transformed
        */
        localToParent(point: Point): Point;

        /**
         * Transform the item so that its bounds fit within the specified rectangle, without changing its aspect ratio.
         * @param rectangle -
         * @param fill [optiona;] - default = false
         */
        fitBounds(rectangle: Rectangle, fill?: boolean): void;

        //I cannot use function: Function as it is a reserved keyword

        /**
         * Attach an event handler to the tool.
         * @param type - String('mousedown'|'mouseup'|'mousedrag'|'mousemove'|'keydown'|'keyup') the event type
         * @param function - The function to be called when the event occurs
         */
        on(type: string, callback: (event: ToolEvent) => void): Tool;

        /**
         * Attach one or more event handlers to the tool.
         * @param param - an object literal containing one or more of the following properties: mousedown, mouseup, mousedrag, mousemove, keydown, keyup
         */
        on(param: any): Tool;

        /**
         * Detach an event handler from the tool.
         * @param type - String('mousedown'|'mouseup'|'mousedrag'|'mousemove'|'keydown'|'keyup') the event type
         * @param function - The function to be detached
         */
        off(type: string, callback: (event: ToolEvent) => void): Tool;

        /**
         * Detach one or more event handlers from the tool.
         * @param param -  an object literal containing one or more of the following properties: mousedown, mouseup, mousedrag, mousemove, keydown, keyup
         */
        off(param: any): Tool;

        /**
         * Emit an event on the tool.
         * @param type - String('mousedown'|'mouseup'|'mousedrag'|'mousemove'|'keydown'|'keyup') the event type
         * @param event - an object literal containing properties describing the event.
         */
        emit(type: string, event: any): boolean;

        /**
         * Check if the tool has one or more event handlers of the specified type.
         * @param type - String('mousedown'|'mouseup'|'mousedrag'|'mousemove'|'keydown'|'keyup') the event type
         */
        responds(type: string): boolean;//I cannot use function: Function as it is a reserved keyword

        /**
         * Attaches an event handler to the item.
         * @param type - String('mousedown'|'mouseup'|'mousedrag'|'mousemove'|'keydown'|'keyup') the event type
         * @param function - The function to be called when the event occurs
         */
        on(type: string, callback: () => void): Item;

        /**
         * Attaches one or more event handlers to the item.
         * @param param - an object literal containing one or more of the following properties: mousedown, mouseup, mousedrag, mousemove, keydown, keyup
         */
        on(param: any): Item;

        /**
         * Detach an event handler from the item.
         * @param type - String('mousedown'|'mouseup'|'mousedrag'|'mousemove'|'keydown'|'keyup') the event type
         * @param function - The function to be detached
         */
        off(type: string, callback: (event: ToolEvent) => void): Item;

        /**
         * Detach one or more event handlers to the item.
         * @param param -  an object literal containing one or more of the following properties: mousedown, mouseup, mousedrag, mousemove, keydown, keyup
         */
        off(param: any): Item;

        /**
         * Emit an event on the item.
         * @param type - String('mousedown'|'mouseup'|'mousedrag'|'mousemove'|'keydown'|'keyup') the event type
         * @param event - an object literal containing properties describing the event.
         */
        emit(type: string, event: any): boolean;

        /**
         * Check if the item has one or more event handlers of the specified type..
         * @param type - String('mousedown'|'mouseup'|'mousedrag'|'mousemove'|'keydown'|'keyup') the event type
         */
        responds(type: string): boolean;

        /**
         * Removes the item when the events specified in the passed object literal occur.
         * @param object - The object literal can contain the following values
         * @param object.move - Remove the item when the next tool.onMouseMove event is fired
         * @param object.drag - Remove the item when the next tool.onMouseDrag event is fired
         * @param object.down - Remove the item when the next tool.onMouseDown event is fired
         * @param object.up - Remove the item when the next tool.onMouseUp event is fired
         */
        removeOn(object: { move?: boolean; drag?: boolean; down?: boolean; up?: boolean; }): void;

        /**
         * Removes the item when the next tool.onMouseMove event is fired.
         */
        removeOnMove(): void;

        /**
         * Removes the item when the next tool.onMouseDown event is fired.
         */
        removeOnDown(): void;

        /**
         * Removes the item when the next tool.onMouseDrag event is fired.
         */
        removeOnDrag(): void;

        /**
         * Removes the item when the next tool.onMouseUp event is fired.
         */
        removeOnUp(): void;

    }
    /**
     * A Group is a collection of items. When you transform a Group, its children are treated as a single unit without changing their relative positions.
     */
    export class Group extends Item {

        /**
         * Creates a new Group item and places it at the top of the active layer.
         * @param children [optional] - An array of Item Objects children that will be added to the newly created group.
         */
        constructor(children?: Item[]);

        /**
         * Creates a new Group item and places it at the top of the active layer.
         * @param object [optional] - an object literal containing the properties to be set on the group.
         */
        constructor(object?: any);

        /**
         * Specifies whether the group item is to be clipped.
         * When setting to true, the first child in the group is automatically defined as the clipping mask.
         */
        clipped: boolean;

    }
    /**
     * The Layer item represents a layer in a Paper.js project.
     * The layer which is currently active can be accessed through project.activeLayer.
     * An array of all layers in a project can be accessed through project.layers.
     */
    export class Layer extends Group {

        /**
         * Creates a new Layer item and places it at the end of the project.layers array. The newly created layer will be activated, so all newly created items will be placed within it.
         * @param children [optional] - An array of Items that will be added to the newly created layer.
         */
        constructor(children?: Item[]);
        /**
         * Creates a new Layer item and places it at the end of the project.layers array. The newly created layer will be activated, so all newly created items will be placed within it.
         * @param object [optional] - an object literal containing the properties to be set on the layer.
         */
        constructor(object?: any);

        /**
         * Activates the layer.
         */
        activate(): void;

    }
    export class Shape extends Item {

        /**
         * Creates a circular shape item.
         * @param center - the center point of the circle
         * @param radius - the radius of the circle
         */
        static Circle(center: Point, radius: number): Shape;

        /**
         * Creates a circular shape item from the properties described by an object literal.
         * @param object - an object literal containing properties descriving the shapes attributes
         */
        static Circle(object: any): Shape;

        /**
         * Creates a rectangular shape item, with optionally rounded corners.
         * @param rectangle - the rectangle object describing the geometry of the rectangular shape to be created.
         * @param radius [optional] - the size of the rounded corners, default: null
         */
        static Rectangle(rectangle: Rectangle, radius?: number): Shape;

        /**
         * Creates a rectangular shape item from a point and a size object.
         * @param point - the rectangle's top-left corner
         * @param size - the rectangle's size.
         */
        static Rectangle(point: Point, size: Size): Shape;

        /**
         * Creates a rectangular shape item from the passed points. These do not necessarily need to be the top left and bottom right corners, the constructor figures out how to fit a rectangle between them.
         * @param from - the first point defining the rectangle
         * @param to - the second point defining the rectangle
         */
        static Rectangle(from: Point, to: Point): Shape;

        /**
         * Creates a rectangular shape item from the properties described by an object literal.
         * @param object - an object literal containing properties describing the shape's attributes
         */
        static Rectangle(object: any): Shape;

        /**
         * Creates an elliptical shape item.
         * @param rectangle - the rectangle circumscribing the ellipse
         */
        static Ellipse(rectangle: Rectangle): Shape;

        /**
         * Creates an elliptical shape item from the properties described by an object literal.
         * @param object - an object literal containing properties describing the shape's attributes
         */
        static Ellipse(object: any): Shape;

        /**
         * The type of shape of the item as a string.
         */
        type: string;

        /**
         * The size of the shape.
         */
        size: Size;

        /**
         * The radius of the shape, as a number if it is a circle, or a size object for ellipses and rounded rectangles.
         */
        radius: number | Size;

    }
    /**
     * The Raster item represents an image in a Paper.js project.
     */
    export class Raster extends Item {

        /**
         * Creates a new raster item from the passed argument, and places it in the active layer. object can either be a DOM Image, a Canvas, or a string describing the URL to load the image from, or the ID of a DOM element to get the image from (either a DOM Image or a Canvas).
         * @param source [optional] - the source of the raster
         * @param position [optional] - the center position at which the raster item is placed
         */
        constructor(source?: HTMLImageElement | HTMLCanvasElement | string, position?: Point);

        /**
         * The size of the raster in pixels.
         */
        size: Size;

        /**
         * The width of the raster in pixels.
         */
        width: number;

        /**
         * The height of the raster in pixels.
         */
        height: number;

        /**
         * The resolution of the raster at its current size, in PPI (pixels per inch).
         * Read Only.
         */
        resolution: Size;

        /**
         * The HTMLImageElement of the raster, if one is associated.
         */
        image: HTMLImageElement | HTMLCanvasElement;

        /**
         * The Canvas object of the raster. If the raster was created from an image, accessing its canvas causes the raster to try and create one and draw the image into it. Depending on security policies, this might fail, in which case null is returned instead.
         */
        canvas: HTMLCanvasElement;

        /**
         * The Canvas 2D drawing context of the raster.
         */
        context: CanvasRenderingContext2D;

        /**
         * The source of the raster, which can be set using a DOM Image, a Canvas, a data url, a string describing the URL to load the image from, or the ID of a DOM element to get the image from (either a DOM Image or a Canvas). Reading this property will return the url of the source image or a data-url.
         */
        source: HTMLImageElement | HTMLCanvasElement | string;

        /**
         * Extracts a part of the Raster's content as a sub image, and returns it as a Canvas object.
         * @param rect - the boundaries of the sub image in pixel coordinates
         */
        getSubCanvas(rect: Rectangle): HTMLCanvasElement;

        /**
         * Extracts a part of the raster item's content as a new raster item, placed in exactly the same place as the original content.
         * @param rect - the boundaries of the sub raster in pixel coordinates
         */
        getSubRaster(rect: Rectangle): Raster;

        /**
         * Returns a Base 64 encoded data: URL representation of the raster.
         */
        toDataURL(): string;

        /**
         * Draws an image on the raster.
         * @param image - the image to draw
         * @param point - the offset of the image as a point in pixel coordinates
         */
        drawImage(image: HTMLImageElement | HTMLCanvasElement, point: Point): void;

        /**
         * Calculates the average color of the image within the given path, rectangle or point. This can be used for creating raster image effects.
         * @param object - the path, rectangle or point to get the average image color from
         */
        getAverageColor(object: Path | Rectangle | Point): Color;

        /**
         * Gets the color of a pixel in the raster.
         * @param x - the x offset of the pixel in pixel coordinates
         * @param y - the y offset of the pixel in pixel coordinates
         */
        getPixel(x: number, y: number): Color;

        /**
         * Gets the color of a pixel in the raster.
         * @param point - the offset of the pixel as a point in pixel coordinates
         */
        getPixel(point: Point): Color;

        /**
         * Sets the color of the specified pixel to the specified color
         * @param x - the x offset of the pixel in pixel coordinates
         * @param y - the y offset of the pixel in pixel coordinates
         * @param color - the color that the pixel will be set to
         */
        setPixel(x: number, y: number, color: Color): void;

        /**
         * Sets the color of the specified pixel to the specified color.
         * @param point - the offset of the pixel as a point in pixel coordinates
         * @param color - the color that the pixel will be set to
         */
        setPixel(point: Point, color: Color): void;

        /**
         *
         * @param size
         */
        createImageData(size: Size): ImageData;

        /**
         *
         * @param rect
         */
        getImageData(rect: Rectangle): ImageData;

        /**
         *
         *
         * @param data
         * @param point
         */
        getImageData(data: ImageData, point: Point): void;

    }
    /**
     * A PlacedSymbol represents an instance of a symbol which has been placed in a Paper.js project.
     */
    export class PlacedSymbol extends Item {

        /**
         * Creates a new PlacedSymbol Item.
         * @param symbol - the symbol to place
         * @param point [optional] - the center point of the placed symbol
         */
        constructor(symbol: Symbol, point?: Point);

        /**
         * The symbol that the placed symbol refers to.
         */
        symbol: Symbol;

    }
    /**
     * A HitResult object contains information about the results of a hit test. It is returned by item.hitTest(point) and project.hitTest(point).
     */
    export class HitResult {

        /**
         * Describes the type of the hit result. For example, if you hit a segment point, the type would be 'segment'.
         * type String('segment', 'handle-in', 'handle-out', 'curve', 'stroke', 'fill', 'bounds', 'center', 'pixel')
         */
        type: string;

        /**
         * If the HitResult has a hitResult.type of 'bounds', this property describes which corner of the bounding rectangle was hit.
         * type String('top-left', 'top-right', 'bottom-left', 'bottom-right', 'left-center', 'top-center', 'right-center', 'bottom-center')
         */
        name: string;

        /**
         * The item that was hit.
         */
        item: Item;

        /**
         * If the HitResult has a type of 'curve' or 'stroke', this property gives more information about the exact position that was hit on the path.
         */
        location: CurveLocation;

        /**
         * If the HitResult has a type of 'pixel', this property refers to the color of the pixel on the Raster that was hit.
         */
        color: Color;

        /**
         * If the HitResult has a type of 'stroke', 'segment', 'handle-in' or 'handle-out', this property refers to the segment that was hit or that is closest to the hitResult.location on the curve.
         */
        segment: Segment;

        /**
         * Describes the actual coordinates of the segment, handle or bounding box corner that was hit
         */
        point: Point;

    }
    /**
     * The PathItem class is the base for any items that describe paths and offer standardised methods for drawing and path manipulation, such as Path and CompoundPath.
     */
    export class PathItem extends Item {

        /**
         * The path's geometry, formatted as SVG style path data.
         */
        pathData: string;

        /**
         * Returns all intersections between two PathItem items as an array of CurveLocation objects. CompoundPath items are also supported.
         * @param path - the other item to find the intersections with
         * @param sorted [optional] - specifies whether the returned CurveLocation objects should be sorted by path and offset, default: false
         */
        getIntersections(path: PathItem, sorted?: boolean): CurveLocation[];

        /**
         * Smooth bezier curves without changing the amount of segments or their points, by only smoothing and adjusting their handle points, for both open ended and closed paths.
         */
        smooth(): void;

        /**
         * On a normal empty Path, the point is simply added as the path's first segment. If called on a CompoundPath, a new Path is created as a child and the point is added as its first segment.
         * @param point - the path's first segment
         */
        moveTo(point: Point): void;

        /**
         * Draw a line from the current point to the given point
         * @param point - the end point of the line
         */
        lineTo(point: Point): void;

        /**
         * Adds a cubic bezier curve to the path, defined by two handles and a to point.
         * @param handle1 - The first control point handle for the curve
         * @param handle2 - The second control point handle for the curve
         * @param to - The end control point of the curve
         */
        cublicCurveTo(handle1: Point, handle2: Point, to: Point): void;

        /**
         * Adds a quadratic bezier curve to the path, defined by a handle and a to point.
         * @param handle - The control point for the curve
         * @param to - The end control point of the curve
         */
        quadraticCurveTo(handle: Point, to: Point): void;

        /**
         * Draws a curve from the position of the last segment point in the path that goes through the specified through point, to the specified to point by adding one segment to the path.
         * @param through - the point through which the curve should go
         * @param to - the point where the curve should end
         * @param parameter [optional] - default: 0.5
         */
        curveTo(through: Point, to: Point, parameter?: number): void;

        /**
         * Draws an arc from the position of the last segment point in the path that goes through the specified through point, to the specified to point by adding one or more segments to the path.
         * @param through - the point where the arc should pass through
         * @param to - the point where the arc should end
         */
        arcTo(through: Point, to: Point): void;

        /**
         * Draws an arc from the position of the last segment point in the path to the specified point by adding one or more segments to the path.
         * @param to - the point where the arc should end
         * @param closewise [optional] - specifies whether the arc should be drawn in clockwise direction. optional, default: true
         */
        arcTo(to: Point, clockwise?: boolean): void;

        /**
         * Closes the path. When closed, Paper.js connects the first and last segment of the path with an additional curve.
         * @param join - controls whether the method should attempt to merge the first segment with the last if they lie in the same location.
         */
        closePath(join: boolean): void;

        /**
         * If called on a CompoundPath, a new Path is created as a child and a point is added as its first segment relative to the position of the last segment of the current path.
         * @param to -
         */
        moveBy(to: Point): void;

        /**
         * Adds a segment relative to the last segment point of the path.
         * @param to - the vector which is added to the position of the last segment of the path, to get to the position of the new segment.
         */
        lineBy(to: Point): void;

        /**
         *
         * @param through -
         * @param to -
         * @param parameter [optional] - default 0.5
         */
        curveBy(through: Point, to: Point, parameter?: number): void;

        /**
         *
         * @param handle1 -
         * @param handle2 -
         * @param to -
         */
        cublicCurveBy(handle1: Point, handle2: Point, to: Point): void;

        /**
         *
         * @param handle -
         * @param to -
         */
        quadraticCurveBy(handle: Point, to: Point): void;

        /**
         *
         * @param through -
         * @param to -
         */
        arcBy(through: Point, to: Point): void;

        /**
         *
         * @param to -
         * @param clockwise [optional] - default: true
         */
        arcBy(to: Point, clockwise?: boolean): void;

        /**
         * Merges the geometry of the specified path from this path's geometry and returns the result as a new path item.
         * @param path - the path to unite with
         */
        unite(path: PathItem): PathItem;

        /**
         * Intersects the geometry of the specified path with this path's geometry and returns the result as a new path item.
         * @param path - the path to intersect with
         */
        intersect(path: PathItem): PathItem;

        /**
         * Subtracts the geometry of the specified path from this path's geometry and returns the result as a new path item.
         * @param - the path to subtract
         */
        subtract(path: PathItem): PathItem;

        /**
         * Excludes the intersection of the geometry of the specified path with this path's geometry and returns the result as a new group item.
         * @param - the path to exclude the intersection of
         */
        exclude(path: PathItem): PathItem;

        /**
         * Splits the geometry of this path along the geometry of the specified path returns the result as a new group item.
         * @param - the path to divide by
         */
        divide(path: PathItem): PathItem;

    }
    /**
     * The path item represents a path in a Paper.js project.
     */
    export class Path extends PathItem {

        /**
         * Creates a linear path item from two points describing a line.
         * @param from - the line's starting point
         * @param to - the line's ending point
         */
        static Line(from: Point, to: Point): Path;

        /**
         * Creates a linear path item from the properties described by an object literal.
         * @param object - an object literal containing properties describing the path's attributes
         */
        static Line(object: any): Path;

        /**
         * Creates a circular path item.
         * @param center - the center point of the circle
         * @param radius - the radius of the circle
         */
        static Circle(center: Point, radius: number): Path;

        /**
         * Creates a circular path item from the properties described by an object literal.
         * @param object - an object literal containing properties describing the path's attributes
         */
        static Circle(object: any): Path;

        /**
         * Creates a rectangular path item, with optionally rounded corners.
         * @param rectangle - the rectangle object describing the geometry of the rectangular path to be created.
         * @param radius [optional] - the size of the rounded corners default: null
         */
        static Rectangle(rectangle: Rectangle, radius?: number): Path;

        /**
         * Creates a rectangular path item from a point and a size object.
         * @param point - the rectangle's top-left corner.
         * @param size - the rectangle's size.
         */
        static Rectangle(point: Point, size: Size): Path;

        /**
         * Creates a rectangular path item from the passed points. These do not necessarily need to be the top left and bottom right corners, the constructor figures out how to fit a rectangle between them.
         * @param from - the first point defining the rectangle
         * @param to - the second point defining the rectangle
         */
        static Rectangle(from: Point, to: Point): Path;

        /**
         * Creates a rectangular path item from the properties described by an object literal.
         * @param object - an object literal containing properties describing the path's attributes
         */
        static Rectangle(object: any): Path;

        /**
         * Creates an elliptical path item.
         * @param rectangle - the rectangle circumscribing the ellipse
         */
        static Ellipse(rectangle: Rectangle): Path;

        /**
         * Creates an elliptical path item from the properties described by an object literal.
         * @param object - an object literal containing properties describing the path's attributes
         */
        static Ellipse(object: any): Path;
        /**
         * Creates a circular arc path item
         * @param from - the starting point of the circular arc
         * @param through - the point the arc passes through
         * @param to - the end point of the arc
         */
        static Arc(from: Point, through: Point, to: Point): Path;

        /**
         * Creates an circular arc path item from the properties described by an object literal.
         * @param object - an object literal containing properties describing the path's attributes
         */
        static Arc(object: any): Path;

        /**
         * Creates a regular polygon shaped path item.
         * @param center - the center point of the polygon
         * @param sides - the number of sides of the polygon
         * @param radius - the radius of the polygon
         */
        static RegularPolygon(center: Point, sides: number, radius: number): Path;

        /**
         * Creates a regular polygon shaped path item from the properties described by an object literal.
         * @param object - an object literal containing properties describing the path's attributes
         */
        static RegularPolygon(object: any): Path;

        /**
         * Creates a star shaped path item. The largest of radius1 and radius2 will be the outer radius of the star. The smallest of radius1 and radius2 will be the inner radius.
         * @param center - the center point of the star
         * @param points - the number of points of the star
         * @param radius1
         * @param radius2
         */
        static Star(center: Point, points: number, radius1: number, radius2: number): Path;

        /**
         * Creates a star shaped path item from the properties described by an object literal.
         * @param object - an object literal containing properties describing the path's attributes
         */
        static Star(object: any): Path;

        /**
         * Creates a new path item and places it at the top of the active layer.
         * @param segments [optional] - An array of segments (or points to be converted to segments) that will be added to the path
         */
        constructor(segments?: Segment[]| Point[]);

        /**
         * Creates a new path item from an object description and places it at the top of the active layer.
         * @param object - an object literal containing properties describing the path's attributes
         */
        constructor(object?: any);

        /**
         * Creates a new path item from SVG path-data and places it at the top of the active layer.
         * @param pathData - the SVG path-data that describes the geometry of this path.
         */
        constructor(pathData?: string);

        /**
         * The segments contained within the path.
         * Array of Segment objects
         */
        segments: Segment[];

        /**
         * The first Segment contained within the path.
         * Read only.
         */
        firstSegment: Segment;

        /**
         * The last Segment contained within the path
         * Read only.
         */
        lastSegment: Segment;

        /**
         * The curves contained within the path.
         * Array of Curve objects
         */
        curves: Curve[];

        /**
         * The first Curve contained within the path.
         * Read only.
         */
        firstCurve: Curve;

        /**
         * The last Curve contained within the path.
         * Read only.
         */
        lastCurve: Curve;

        /**
         * Specifies whether the path is closed. If it is closed, Paper.js connects the first and last segments.
         */
        closed: boolean;

        /**
         * The approximate length of the path in points.
         * Read only.
         */
        length: number;

        /**
         * The area of the path in square points. Self-intersecting paths can contain sub-areas that cancel each other out.
         * Read only.
         */
        area: number;

        /**
         * Specifies whether the path and all its segments are selected. Cannot be true on an empty path.
         */
        fullySelected: boolean;

        /**
         * Specifies whether the path is oriented clock-wise.
         */
        clockwise: boolean;

        /**
         * Returns a point that is guaranteed to be inside the path.
         * Read only.
         */
        interiorPoint: Point;

        /**
         * Adds one or more segments to the end of the segments array of this path.
         * @param segment - the segment or point to be added.
         * Returns the added segment. This is not necessarily the same object, e.g. if the segment to be added already belongs to another path.
         */
        add(segment: Segment | Point): Segment;

        /**
         * Inserts one or more segments at a given index in the list of this path's segments.
         * @param index - the index at which to insert the segment.
         * @param segment - the segment or point to be inserted.
         * Returns the added segment. This is not necessarily the same object, e.g. if the segment to be added already belongs to another path.
         */
        insert(index: number, segment: Segment | Point): Segment;

        /**
         * Adds an array of segments (or types that can be converted to segments) to the end of the segments array.
         * @param segments - Array of Segment objects
         * Returns an array of the added segments. These segments are not necessarily the same objects, e.g. if the segment to be added already belongs to another path.
         */
        addSegments(segments: Segment[]): Segment[];

        /**
         * Inserts an array of segments at a given index in the path's segments array.
         * @param index - the index at which to insert the segments.
         * @param segments - the segments to be inserted.
         * Returns an array of the added segments. These segments are not necessarily the same objects, e.g. if the segment to be added already belongs to another path.
         */
        insertSegments(index: number, segments: Segment[]): Segment[];

        /**
         * Removes the segment at the specified index of the path's segments array.
         * @param index - the index of the segment to be removed
         * Returns the removed segment
         */
        removeSegment(index: number): Segment;

        /**
         * Removes all segments from the path's segments array.
         * Returns an array containing the removed segments
         */
        removeSegments(): Segment[];

        /**
         * Removes the segments from the specified from index to the to index from the path's segments array.
         * @param from - the beginning index, inclusive
         * @param to [optional = segments.length] - the ending index
         * Returns an array containing the removed segments
         */
        removeSegments(from: number, to?: number): Segment[];

        /**
         * Converts the curves in a path to straight lines with an even distribution of points. The distance between the produced segments is as close as possible to the value specified by the maxDistance parameter.
         * @param maxDistance - the maximum distance between the points
         */
        flatten(maxDistance: number): void;

        /**
         * Smooths a path by simplifying it. The path.segments array is analyzed and replaced by a more optimal set of segments, reducing memory usage and speeding up drawing.
         * @param tolerance [optional = 2.5] -
         */
        simplify(tolerance?: number): void;

        /**
         * Splits the path at the given offset. After splitting, the path will be open. If the path was open already, splitting will result in two paths.
         * @param offset - the offset at which to split the path as a number between 0 and path.length
         * Returns the newly created path after splitting, if any
         */
        split(offset: number): Path;

        /**
         * Splits the path at the given curve location. After splitting, the path will be open. If the path was open already, splitting will result in two paths.
         * @param location - the curve location at which to split the path
         * Returns the newly created path after splitting, if any
         */
        split(location: CurveLocation): Path;

        /**
         * Splits the path at the given curve index and parameter. After splitting, the path will be open. If the path was open already, splitting will result in two paths.
         * @param index - the index of the curve in the path.curves array at which to split
         * @param parameter - the parameter at which the curve will be split
         * Returns the newly created path after splitting, if any
         */
        split(index: number, parameter: number): Path;

        /**
         * Reverses the orientation of the path, by reversing all its segments.
         */
        reverse(): void;

        /**
         * Joins the path with the specified path, which will be removed in the process.
         * @param path - the path to join this path with
         * Returns the joined path
         */
        join(path: Path): Path;

        /**
         * Returns the curve location of the specified point if it lies on the path, null otherwise.
         * @param point - the point on the path.
         */
        getLocationOf(point: Point): CurveLocation;

        /**
         * Returns the length of the path from its beginning up to up to the specified point if it lies on the path, null otherwise.
         * @param point - the point on the path.
         */
        getOffsetOf(point: Point): number;

        /**
         * Returns the curve location of the specified offset on the path.
         * @param offset - the offset on the path, where 0 is at the beginning of the path and path.length at the end.
         * @param isParameter [optional=false] -
         */
        getLocationAt(offset: number, isParameter?: boolean): CurveLocation;

        /**
         * Calculates the point on the path at the given offset. Returns the point at the given offset
         * @param offset - the offset on the path, where 0 is at the beginning of the path and path.length at the end.
         * @param isParameter [optional=false] -
         */
        getPointAt(offset: number, isPatameter?: boolean): Point;

        /**
         * Calculates the tangent vector of the path at the given offset. Returns the tangent vector at the given offset
         * @param offset - the offset on the path, where 0 is at the beginning of the path and path.length at the end.
         * @param isParameter [optional=false] -
         */
        getTangentAt(offset: number, isPatameter?: boolean): Point;

        /**
         * Calculates the normal vector of the path at the given offset. Returns the normal vector at the given offset
         * @param offset - the offset on the path, where 0 is at the beginning of the path and path.length at the end.
         * @param isParameter [optional=false] -
         */
        getNormalAt(offset: number, isParameter?: boolean): Point;

        /**
         * Calculates the curvature of the path at the given offset. Curvatures indicate how sharply a path changes direction. A straight line has zero curvature, where as a circle has a constant curvature. The path's radius at the given offset is the reciprocal value of its curvature.
         * @param offset - the offset on the path, where 0 is at the beginning of the path and path.length at the end.
         * @param isParameter [optional=false] -
         * @param point - the point for which we search the nearest location
         */
        getCurvatureAt(offset: number, isParameter?: boolean, point?: paper.Point): number;

        /**
         * Returns the nearest point on the path to the specified point.
         * @param point - the point for which we search the nearest point
         */
        getNearestPoint(point: Point): Point;


    }
    /**
     * A compound path contains two or more paths, holes are drawn where the paths overlap. All the paths in a compound path take on the style of the backmost path and can be accessed through its item.children list.
     */
    export class CompoundPath extends PathItem {

        /**
         * Creates a new compound path item from an object description and places it at the top of the active layer.
         * @param object - an object literal containing properties to be set on the path
         */
        constructor(object: any);

        /**
         * Creates a new compound path item from SVG path-data and places it at the top of the active layer.
         * @param pathData - the SVG path-data that describes the geometry of this path.
         */
        constructor(pathData: string);

        /**
         * Specifies whether the compound path is oriented clock-wise.
         */
        clockwise: boolean;

        /**
         * The first Segment contained within the path.
         * Read Only
         */
        firstSegment: Segment;

        /**
         * The last Segment contained within the path.
         * Read Only
         */
        lastSegment: Segment;

        /**
         * All the curves contained within the compound-path, from all its child Path items.
         * Read Only
         */
        curves: Curve[];

        /**
         * The first Curve contained within the path.
         * Read Only
         */
        firstCurve: Curve;

        /**
         * The last Curve contained within the path.
         * Read only.
         */
        lastCurve: Curve;

        /**
         * The area of the path in square points. Self-intersecting paths can contain sub-areas that cancel each other out.
         * Read Only.
         */
        area: number;

        /**
         * Reverses the orientation of all nested paths.
         */
        reverse(): void;

    }
    /**
     * The Segment object represents the points of a path through which its Curve objects pass. The segments of a path can be accessed through its path.segments array.
     * Each segment consists of an anchor point (segment.point) and optionaly an incoming and an outgoing handle (segment.handleIn and segment.handleOut), describing the tangents of the two Curve objects that are connected by this segment.
     */
    export class Segment {

        /**
         * Creates a new Segment object.
         * @param point [optional] - the anchor point of the segment default: {x: 0, y: 0}
         * @param handleIn [optional] - the handle point relative to the anchor point of the segment that describes the in tangent of the segment default: {x: 0, y: 0}
         * @param handleOut [optional] - the handle point relative to the anchor point of the segment that describes the out tangent of the segment default: {x: 0, y: 0}
         */
        constructor(point?: Point, handleIn?: Point, handleOut?: Point);

        /**
         * Creates a new Segment object.
         * @param object - an object literal containing properties to be set on the segment.
         */
        constructor(object?: any);

        /**
         * The anchor point of the segment.
         */
        point: Point;

        /**
         * The handle point relative to the anchor point of the segment that describes the in tangent of the segment.
         */
        handleIn: Point;

        /**
         * The handle point relative to the anchor point of the segment that describes the out tangent of the segment.
         */
        handleOut: Point;

        /**
         * Specifies whether the segment has no handles defined, meaning it connects two straight lines.
         */
        linear: boolean;

        /**
         * Specifies whether the point of the segment is selected.
         */
        selected: boolean;

        /**
         * The index of the segment in the path.segments array that the segment belongs to.
         * Read Only
         */
        index: number;

        /**
         * The path that the segment belongs to.
         * Read Only
         */
        path: Path;

        /**
         * The curve that the segment belongs to. For the last segment of an open path, the previous segment is returned.
         * Read only.
         */
        curve: Curve;

        /**
         * The curve location that describes this segment's position ont the path.
         * Read Only.
         */
        location: CurveLocation;

        /**
         * The next segment in the path.segments array that the segment belongs to. If the segments belongs to a closed path, the first segment is returned for the last segment of the path.
         * Read Only.
         */
        next: Segment;

        /**
         * The previous segment in the path.segments array that the segment belongs to. If the segments belongs to a closed path, the last segment is returned for the first segment of the path.
         * Read Only.
         */
        previous: Segment;

        /**
         * Returns true if the the two segments are the beginning of two lines and if these two lines are running parallel.
         * @param segment
         */
        isColinear(segment: Segment): boolean;

        /**
         * Returns true if the segment at the given index is the beginning of an orthogonal arc segment. The code looks at the length of the handles and their relation to the distance to the imaginary corner point. If the relation is kappa, then it's an arc.
         */
        isArc(): boolean;

        /**
         * Returns the reversed the segment, without modifying the segment itself.
         */
        reverse(): Segment;

        /**
         * Removes the segment from the path that it belongs to.
         */
        remove(): boolean;

        /**
         * A string representation of the segment
         */
        toString(): string;

        /**
         * Transform the segment by the specified matrix.
         * @param matrix - the matrix to transform the segment by
         */
        transform(matrix: Matrix): void;

    }
    /**
     * The Curve object represents the parts of a path that are connected by two following Segment objects. The curves of a path can be accessed through its path.curves array.
     * While a segment describe the anchor point and its incoming and outgoing handles, a Curve object describes the curve passing between two such segments. Curves and segments represent two different ways of looking at the same thing, but focusing on different aspects. Curves for example offer many convenient ways to work with parts of the path, finding lengths, positions or tangents at given offsets.
     */
    export class Curve {

        /**
         * Creates a new curve object.
         * @param segment1 -
         * @param segment2 -
         */
        constructor(segment1: Segment, segment2: Segment);

        /**
         * Creates a new curve object.
         * @param point1: Point
         * @param handle1: Point
         * @param handle2: Point
         * @param point2: Point
         */
        constructor(point1: Point, handle1: Point, handle2: Point, point2: Point);

        /**
         * The first anchor point of the curve.
         */
        point1: Point;

        /**
         * The second anchor point of the curve.
         */
        point2: Point;

        /**
         * The handle point that describes the tangent in the first anchor point.
         */
        handle1: Point;

        /**
         * The handle point that describes the tangent in the second anchor point.
         */
        handle2: Point;

        /**
         * The first segment of the curve.
         * Read Only.
         */
        segment1: Segment;

        /**
         * The second segment of the curve.
         * Read only.
         */
        segment2: Segment;

        /**
         * The path that the curve belongs to.
         * Read only.
         */
        path: Path;

        /**
         * The index of the curve in the path.curves array.
         * Read Only.
         */
        index: number;

        /**
         * The next curve in the path.curves array that the curve belongs to.
         * Read Only
         */
        next: Curve;

        /**
         * The previous curve in the path.curves array that the curve belongs to.
         * Read Only.
         */
        previous: Curve;

        /**
         * Specifies whether the points and handles of the curve are selected.
         */
        selected: boolean;

        /**
         * The approximated length of the curve in points.
         * Read Only.
         */
        length: number;

        /**
         * The bounding rectangle of the curve excluding stroke width.
         */
        bounds: Rectangle;

        /**
         * The bounding rectangle of the curve including stroke width.
         */
        strokeBounds: Rectangle;

        /**
         * The bounding rectangle of the curve including handles.
         */
        handleBounds: Rectangle;

        /**
         * Checks if this curve is linear, meaning it does not define any curve handle.
         */
        isLinear(): boolean;

        /**
         * TODO?
         */
        //isHorizontal(): boolean;

        /**
         * Divides the curve into two curves at the given offset. The curve itself is modified and becomes the first part, the second part is returned as a new curve. If the modified curve belongs to a path item, the second part is also added to the path.
         * @param offset [optional] - the offset on the curve at which to split, or the curve time parameter if isParameter is true  default: 0.5
         * @param isParameter [optional] - pass true if offset is a curve time parameter. default: false
         */
        divide(offset?: number, isParameter?: boolean): Curve;

        /**
         * Splits the path this curve belongs to at the given offset. After splitting, the path will be open. If the path was open already, splitting will result in two paths.
         * @param offset [optional] - the offset on the curve at which to split, or the curve time parameter if isParameter is true default: 0.5
         * @param isParameter [optional] - pass true if offset is a curve time parameter. default: false
         */
        split(offset?: number, isParameter?: boolean): Path;

        /**
         * Returns a reversed version of the curve, without modifying the curve itself.
         */
        reverse(): Curve;

        /**
         * Removes the curve from the path that it belongs to, by merging its two path segments.
         * returns true if the curve was removed, false otherwise
         */
        remove(): boolean;

        /**
         * Returns a copy of the curve.
         */
        clone(): Curve;

        /**
         * returns a string representation of the curve
         */
        toString(): string;

        /**
         * Calculates the curve time parameter of the specified offset on the path, relative to the provided start parameter. If offset is a negative value, the parameter is searched to the left of the start parameter. If no start parameter is provided, a default of 0 for positive values of offset and 1 for negative values of offset.
         * @param offset -
         * @param start [optional] -
         */
        getParameterAt(offset: Point, start?: number): number;

        /**
         * Returns the curve time parameter of the specified point if it lies on the curve, null otherwise.
         * @param point - the point on the curve.
         */
        getParameterOf(point: Point): number;

        /**
         * Calculates the curve location at the specified offset or curve time parameter.
         * @param offset - the offset on the curve, or the curve time parameter if isParameter is true
         * @param isParameter [optional] - pass true if offset is a curve time parameter.  default: false
         */
        getLocationAt(offset: Point, isParameter?: boolean): CurveLocation;

        /**
         * Returns the curve location of the specified point if it lies on the curve, null otherwise.
         * @param point - the point on the curve
         */
        getLocationOf(point: Point): CurveLocation;

        /**
         * Returns the length of the path from its beginning up to up to the specified point if it lies on the path, null otherwise.
         * @param point - the point on the path.
         */
        getOffsetOf(point: Point): number;

        /**
         * Calculates the point on the curve at the given offset.
         * @param offset - the offset on the curve, or the curve time parameter if isParameter is true
         * @param isParameter [optional] - pass true if offset is a curve time parameter. default: false
         */
        getPointAt(offset: number, isParameter?: boolean): Point;

        /**
         * Calculates the tangent vector of the curve at the given offset.
         * @param offset - the offset on the curve, or the curve time parameter if isParameter is true
         * @param isParameter [optional] - pass true if offset is a curve time parameter. default: false
         */
        getTangentAt(offset: number, isParameter?: boolean): Point;

        /**
         * Calculates the normal vector of the curve at the given offset.
         * @param offset - the offset on the curve, or the curve time parameter if isParameter is true
         * @param isParameter [optional] - pass true if offset is a curve time parameter. default: false
         */
        getNormalAt(offset: number, isParameter?: boolean): Point;

        /**
         * Calculates the curvature of the curve at the given offset. Curvatures indicate how sharply a curve changes direction. A straight line has zero curvature, where as a circle has a constant curvature. The curve's radius at the given offset is the reciprocal value of its curvature.
         * @param offset - the offset on the curve, or the curve time parameter if isParameter is true
         * @param isParameter - pass true if offset is a curve time parameter. default: false
         */
        getCurvatureAt(offset: number, isParameter?: boolean): Point;

    }
    /**
     * CurveLocation objects describe a location on Curve objects, as defined by the curve parameter, a value between 0 (beginning of the curve) and 1 (end of the curve). If the curve is part of a Path item, its index inside the path.curves array is also provided.
     * The class is in use in many places, such as path.getLocationAt(offset, isParameter), path.getLocationOf(point), Path#getNearestLocation(point),{@linkPathItem#getIntersections(path), etc.
     */
    export class CurveLocation {

        /**
         * Creates a new CurveLocation object.
         * @param curve -
         * @param parameter -
         * @param point -
         */
        constructor(curve: Curve, parameter: number, point: Point);

        /**
         * The segment of the curve which is closer to the described location.
         * Read Only
         */
        segment: Segment;

        /**
         * The curve that this location belongs to.
         * Read Only
         */
        curve: Curve;

        /**
         * The curve location on the intersecting curve, if this location is the result of a call to pathItem.getIntersections(path) / Curve#getIntersections(curve).
         * Read Only
         */
        intersection: CurveLocation;

        /**
         * The path this curve belongs to, if any.
         * Read Only
         */
        path: Path;

        /**
         * The index of the curve within the path.curves list, if the curve is part of a Path item.
         * Read Only.
         */
        index: number;

        /**
         * The length of the path from its beginning up to the location described by this object. If the curve is not part of a path, then the length within the curve is returned instead.
         * Read only.
         */
        offset: number;

        /**
         * The length of the curve from its beginning up to the location described by this object.
         * Read Only.
         */
        curveOffset: number;

        /**
         * The curve parameter, as used by various bezier curve calculations. It is value between 0 (beginning of the curve) and 1 (end of the curve).
         * Read only.
         */
        parameter: number;

        /**
         * The point which is defined by the curve and parameter.
         * Read only.
         */
        point: Point;

        /**
         * The distance from the queried point to the returned location.
         * Read Only.
         */
        distance: number;

        /**
         * Checks whether tow CurveLocation objects are describing the same location on a path, by applying the same tolerances as elsewhere when dealing with curve time parameters.
         * @param location CurveLocation
         */
        equals(location: CurveLocation): boolean;

        /**
         * Returns a string representation of the curve location
         */
        toString(): string;

    }
    /**
     * A Project object in Paper.js is what usually is referred to as the document: The top level object that holds all the items contained in the scene graph. As the term document is already taken in the browser context, it is called Project.
     * Projects allow the manipulation of the styles that are applied to all newly created items, give access to the selected items, and will in future versions offer ways to query for items in the scene graph defining specific requirements, and means to persist and load from different formats, such as SVG and PDF.
     * The currently active project can be accessed through the paperScope.project variable.
     * An array of all open projects is accessible through the paperScope.projects variable.
     */
    export class Project {

        /**
         * Creates a Paper.js project containing one empty Layer, referenced by project.activeLayer.
         * @param element - the HTML canvas element that should be used as the element for the view, or an ID string by which to find the element.
         */
        constructor(element: HTMLCanvasElement | string);

        /**
         * The reference to the project's view.
         * Read only.
         */
        view: View;

        /**
         * The currently active path style. All selected items and newly created items will be styled with this style.
         */
        currentStyle: Style;

        /**
         * The index of the project in the paperScope.projects list.
         * Read Only
         */
        index: number;

        /**
         * The layers contained within the project.
         */
        layers: Layer[];

        /**
         * The layer which is currently active. New items will be created on this layer by default.
         * Read Only.
         */
        activeLayer: Layer;

        /**
         * The symbols contained within the project.
         */
        symbols: Symbol[];

        /**
         * Activates this project, so all newly created items will be placed in it.
         */
        activate(): void;

        /**
         * Clears the project by removing all project.layers and project.symbols.
         */
        clear(): void;

        /**
         * Checks whether the project has any content or not.
         */
        isEmpty(): boolean;

        /**
         * Removes this project from the paperScope.projects list, and also removes its view, if one was defined.
         */
        remove(): void;

        /**
         * Selects all items in the project.
         */
        selectAll(): void;

        /**
         * Deselects all selected items in the project.
         */
        deselectAll(): void;

        /**
         * Perform a hit-test on the items contained within the project at the location of the specified point.
         * The options object allows you to control the specifics of the hit-test and may contain a combination of the following values:
         * @param point - the point where the hit-test should be performed
         * @param options.tolerance -the tolerance of the hit-test in points. Can also be controlled through paperScope.settings.hitTolerance
         * @param options.class - only hit-test again a certain item class and its sub-classes: Group, Layer, Path, CompoundPath, Shape, Raster, PlacedSymbol, PointText, etc.
         * @param options.fill - hit-test the fill of items.
         * @param options.stroke - hit-test the stroke of path items, taking into account the setting of stroke color and width.
         * @param options.segments - hit-test for segment.point of Path items.
         * @param options.curves - hit-test the curves of path items, without taking the stroke color or width into account.
         * @param options.handles - hit-test for the handles.  (segment.handleIn / segment.handleOut) of path segments.
         * @param options.ends - only hit-test for the first or last segment points of open path items.
         * @param options.bounds - hit-test the corners and side-centers of the bounding rectangle of items (item.bounds).
         * @param options.center - hit-test the rectangle.center of the bounding rectangle of items (item.bounds).
         * @param options.guides - hit-test items that have Item#guide set to true.
         * @param options.selected - only hit selected items.
         */
        hitTest(point: Point, options?: { tolerance?: number; class?: string; fill?: boolean; stroke?: boolean; segments?: boolean; curves?: boolean; handles?: boolean; ends?: boolean; bounds?: boolean; center?: boolean; guides?: boolean; selected?: boolean; }): HitResult;

        /**
         * Fetch items contained within the project whose properties match the criteria in the specified object.
         * Extended matching is possible by providing a compare function or regular expression. Matching points, colors only work as a comparison of the full object, not partial matching (e.g. only providing the x- coordinate to match all points with that x-value). Partial matching does work for item.data.
         * Matching items against a rectangular area is also possible, by setting either match.inside or match.overlapping to a rectangle describing the area in which the items either have to be fully or partly contained.
         */
        getItems(match: any): Item[];

        /**
         * Fetch the first item contained within the project whose properties match the criteria in the specified object.
         * Extended matching is possible by providing a compare function or regular expression. Matching points, colors only work as a comparison of the full object, not partial matching (e.g. only providing the x- coordinate to match all points with that x-value). Partial matching does work for item.data.
         */
        getItem(match: any): Item;

        /**
         * Exports (serializes) the project with all its layers and child items to a JSON data string.
         * @param options [optional] - default {asString: true, precision: 5}
         * @param options.asString - whether the JSON is returned as a Object or a String.
         * @param options.precision - the amount of fractional digits in numbers used in JSON data.
         */
        exportJSON(options?: { asString?: boolean; precision?: number }): string;

        /**
         * Imports (deserializes) the stored JSON data into the project.
         * Note that the project is not cleared first. You can call project.clear() to do so.
         */
        importJSON(json: string): void;

        /**
         * Exports the project with all its layers and child items as an SVG DOM, all contained in one top level SVG group node.
         * @param options [optional] the export options, default: { asString: false, precision: 5, matchShapes: false }
         * @param options.asString - whether a SVG node or a String is to be returned.
         * @param options.precision - the amount of fractional digits in numbers used in SVG data.
         * @param options.matchShapes - whether path items should tried to be converted to shape items, if their geometries can be made to match
         */
        exportSVG(options?: { asString?: boolean; precision?: number; matchShapes?: boolean }): SVGElement;

        /**
         * Converts the provided SVG content into Paper.js items and adds them to the active layer of this project.
         * Note that the project is not cleared first. You can call project.clear() to do so.
         * @param svg - the SVG content to import
         * @param options [optional] - the import options, default: { expandShapes: false }
         * @param options.expandShapes - whether imported shape items should be expanded to path items.
         */
        importSVG(svg: SVGElement | string, options?: any): Item;

    }
    /**
     * Symbols allow you to place multiple instances of an item in your project. This can save memory, since all instances of a symbol simply refer to the original item and it can speed up moving around complex objects, since internal properties such as segment lists and gradient positions don't need to be updated with every transformation.
     */
    export class Symbol {

        /**
         * Creates a Symbol item.
         * @param item - the source item which is copied as the definition of the symbol
         * @param dontCenter [optional] - default: false
         */
        constructor(item: Item, dontCenter?: boolean);

        /**
         * The project that this symbol belongs to.
         * Read Only.
         */
        project: Project;

        /**
         * The symbol definition.
         */
        definition: Item;

        /**
         * Places in instance of the symbol in the project.
         * @param position [optional] - The position of the placed symbol.
         */
        place(position?: Point): PlacedSymbol;

        /**
         * Returns a copy of the symbol.
         */
        clone(): Symbol;

    }
    /**
     * Style is used for changing the visual styles of items contained within a Paper.js project and is returned by item.style and project.currentStyle.
     * All properties of Style are also reflected directly in Item, i.e.: item.fillColor.
     * To set multiple style properties in one go, you can pass an object to item.style. This is a convenient way to define a style once and apply it to a series of items:
     */
    export class Style {

        /**
         * The view that this style belongs to.
         * Read only.
         */
        view: View;

        /**
         * The color of the stroke.
         */
        strokeColor: Color | string;

        /**
         * The width of the stroke.
         */
        strokeWidth: number;

        /**
         * The shape to be used at the beginning and end of open Path items, when they have a stroke.
         * String('round', 'square', 'butt'
         */
        strokeCap: string;

        /**
         * The shape to be used at the segments and corners of Path items when they have a stroke.
         * String('miter', 'round', 'bevel')
         */
        strokeJoin: string;

        /**
         * Specifies whether the stroke is to be drawn taking the current affine transformation into account (the default behavior), or whether it should appear as a non-scaling stroke.
         */
        strokeScaling: boolean;

        /**
         * The dash offset of the stroke.
         */
        dashOffset: number;

        /**
         * Specifies an array containing the dash and gap lengths of the stroke.
         */
        dashArray: number[];

        /**
         * The miter limit of the stroke. When two line segments meet at a sharp angle and miter joins have been specified for strokeJoin, it is possible for the miter to extend far beyond the strokeWidth of the path. The miterLimit imposes a limit on the ratio of the miter length to the strokeWidth.
         */
        miterLimit: number;

        /**
         * The fill color.
         */
        fillColor: Color | string;

        /**
         * The shadow color.
         */
        shadowColor: Color | string;

        /**
         * The shadow's blur radius.
         */
        shadowBlur: number;

        /**
         * The shadow's offset.
         */
        shadowOffset: Point;

        /**
         * The color the item is highlighted with when selected. If the item does not specify its own color, the color defined by its layer is used instead.
         */
        selectedColor: Color | string;

        /**
         * The font-family to be used in text content. default 'sans-serif'
         */
        fontFamily: string;

        /**
         * The font-weight to be used in text content.
         */
        fontWeight: string | number;

        /**
         * The font size of text content, as {@Number} in pixels, or as {@String} with optional units 'px', 'pt' and 'em'.
         */
        fontSize: string | number;

        /**
         * The text leading of text content.
         */
        leading: number | string;

        /**
         * The justification of text paragraphs. default "left"
         */
        justification: string;

    }
    export interface IHSBColor {

        /**
         * the hue of the color as a value in degrees between 0 and 360
         */
        hue?: number;
        /**
         * the saturation of the color as a value between 0 and 1
         */
        saturation?: number;
        /**
         * the brightness of the color as a value between 0 and 1
         */
        brightness?: number;
        /**
         * the alpha of the color as a value between 0 and 1
         */
        alpha?: number;

    }
    export interface IHSLColor {

        /**
         * the hue of the color as a value in degrees between 0 and 360
         */
        hue?: number;
        /**
         * the saturation of the color as a value between 0 and 1
         */
        saturation?: number;
        /**
         * the brightness of the color as a value between 0 and 1
         */
        lightness?: number;
        /**
         * the alpha of the color as a value between 0 and 1
         */
        alpha?: number;

    }
    export interface IGradientColor {
        /**
         * the gradient object that describes the color stops and type of gradient to be used.
         */
        gradient?: Gradient;
        /**
         * the origin point of the gradient
         */
        origin?: Point;
        /**
         * the destination point of the gradient stops: Array of GradientStop - the gradient stops describing the gradient, as an alternative to providing a gradient object
         */
        destination?: Point;
        /**
         * controls whether the gradient is radial, as an alternative to providing a gradient object
         */
        radial?: boolean;
    }
    /**
     * All properties and functions that expect color values in the form of instances of Color objects, also accept named colors and hex values as strings which are then converted to instances of Color internally.
     */
    export class Color {

        /**
         * Creates a RGB Color object.
         * @param red - the amount of red in the color as a value between 0 and 1
         * @param green - the amount of green in the color as a value between 0 and 1
         * @param blue - the amount of blue in the color as a value between 0 and 1
         * @param alpha [optional] - the alpha of the color as a value between 0 and 1
         */
        constructor(red: number, green: number, blue: number, alpha?: number);

        /**
         * Creates a gray Color object.
         * @param gray - the amount of gray in the color as a value between 0 and 1
         * @param alpha [optional] - the alpha of the color as a value between 0 and 1
         */
        constructor(gray: number, alpha?: number);

        /**
         * Creates a HSB, HSL or gradient Color object from the properties of the provided object:
         * @param object - an object describing the components and properties of the color.
         */
        constructor(object: IHSBColor | IHSLColor | IGradientColor);

        /**
         * Creates a gradient Color object.
         * @param gradient -
         * @param origin -
         * @param destination -
         * @param highlight [optional] -
         */
        constructor(color: Gradient, origin: Point, destination: Point, highlight?: Point);

        /**
         * The type of the color as a string.
         * String('rgb', 'gray', 'hsb', 'hsl')
         */
        type: string;

        /**
         * The color components that define the color, including the alpha value if defined.
         * Read Only.
         */
        components: number;

        /**
         * The color's alpha value as a number between 0 and 1.
         * All colors of the different subclasses support alpha values.
         */
        alpha: number;

        /**
         * The amount of red in the color as a value between 0 and 1.
         */
        red: number;

        /**
         * The amount of green in the color as a value between 0 and 1.
         */
        green: number;

        /**
         * The amount of blue in the color as a value between 0 and 1.
         */
        blue: number;

        /**
         * The amount of gray in the color as a value between 0 and 1.
         */
        gray: number;

        /**
         * The hue of the color as a value in degrees between 0 and 360.
         */
        hue: number;

        /**
         * The saturation of the color as a value between 0 and 1.
         */
        saturation: number;

        /**
         * The brightness of the color as a value between 0 and 1.
         */
        brightness: number;

        /**
         * The lightness of the color as a value between 0 and 1.
         * Note that all other components are shared with HSB.
         */
        lightness: number;

        /**
         * The gradient object describing the type of gradient and the stops.
         */
        gradient: Gradient;

        /**
         * The highlight point of the gradient.
         */
        highlight: Point;

        /**
         * Converts the color another type.
         * @param type - String('rgb'|'gray'|'hsb'|'hsl') the color type to convert to.
         */
        convert(type: string): Color;

        /**
         * Checks if the color has an alpha value.
         */
        hasAlpha(): boolean;

        /**
         * Checks if the component color values of the color are the same as those of the supplied one.
         * @param color - the color to compare with
         */
        equals(color: Color): boolean;

        /**
         * a copy of the color object
         */
        clone(): Color;

        /**
         * a string representation of the color
         */
        toString(): string;

        /**
         * Returns the color as a CSS string.
         * @param hex - whether to return the color in hexadecial representation or as a CSS RGB / RGBA string.
         */
        toCss(hex: boolean): string;

        /**
         * Transform the gradient color by the specified matrix.
         * @param matrix - the matrix to transform the gradient color by
         */
        transform(matrix: Matrix): void;

    }
    /**
     * The Gradient object.
     */
    export class Gradient {

        /**
         * The gradient stops on the gradient ramp.
         */
        stops: GradientStop[];

        /**
         * Specifies whether the gradient is radial or linear.
         */
        radial: boolean;

        /**
         * a copy of the gradient
         */
        clone(): Gradient;

        /**
         * Checks whether the gradient is equal to the supplied gradient.
         * @param gradient - the gradient to check against
         */
        equals(gradient: Gradient): boolean;

    }
    /**
     * The GradientStop object.
     */
    export class GradientStop {

        /**
         * Creates a GradientStop object.
         * @param color [optional] - the color of the stop, default: new Color(0, 0, 0)
         * @param rampPoint [optional] - the position of the stop on the gradient ramp as a value between 0 and 1, default: 0
         */
        constructor(color?: Color, rampPoint?: number);

        /**
         * The ramp-point of the gradient stop as a value between 0 and 1.
         */
        rampPoint: number;

        /**
         * The color of the gradient stop.
         */
        color: Color;

        /**
         * Returns a copy of the gradient-stop
         */
        clone(): GradientStop;

    }
    /**
     * The View object wraps an HTML element and handles drawing and user interaction through mouse and keyboard for it. It offer means to scroll the view, find the currently visible bounds in project coordinates, or the center, both useful for constructing artwork that should appear centered on screen.
     */
    export class View {

        /**
         * The underlying native element.
         * Read Only.
         */
        element: HTMLCanvasElement;

        /**
         * The ratio between physical pixels and device-independent pixels (DIPs) of the underlying canvas / device.
         * It is 1 for normal displays, and 2 or more for high-resolution displays.
         * Read only.
         */
        pixelRatio: number;

        /**
         * The resoltuion of the underlying canvas / device in pixel per inch (DPI).
         * It is 72 for normal displays, and 144 for high-resolution displays with a pixel-ratio of 2.
         * Read only.
         */
        resolution: number;

        /**
         * The size of the view. Changing the view's size will resize it's underlying element.
         */
        viewSize: Size;

        /**
         * The bounds of the currently visible area in project coordinates.
         * Read only.
         */
        bounds: Rectangle;

        /**
         * The size of the visible area in project coordinates.
         * Read only.
         */
        size: Size;

        /**
         * The center of the visible area in project coordinates.
         */
        center: Point;

        /**
         * The zoom factor by which the project coordinates are magnified.
         */
        zoom: number;

        /**
         * Handler function to be called on each frame of an animation.
         * The function receives an event object which contains information about the frame event:
         */
        onFrame: (event: IFrameEvent) => void;

        /**
         * Handler function that is called whenever a view is resized.
         */
        onResize: (event: Event) => void;

        /**
         * Removes this view from the project and frees the associated element.
         */
        remove(): void;

        /**
         * Checks whether the view is currently visible within the current browser viewport.
         */
        isVisible(): boolean;

        /**
         * Scrolls the view by the given vector.
         * @param point - the vector to scroll by
         */
        scrollBy(point: Point): void;

        /**
         * Makes all animation play by adding the view to the request animation loop.
         */
        play(): void;

        /**
         * Makes all animation pause by removing the view to the request animation loop.
         */
        pause(): void;

        /**
         * Updates the view if there are changes. Note that when using built-in event hanlders for interaction, animation and load events, this method is invoked for you automatically at the end.
         */
        update(): void;

        /**
         *
         * @param point -
         */
        projectToView(point: Point): Point;

        /**
         *
         * @param point -
         */
        viewToProject(point: Point): Point;

        //I cannot use function: Function as it is a reserved keyword

        /**
         * Attach an event handler to the view.
         * @param type - String('frame'|'resize') the event type
         * @param function - The function to be called when the event occurs
         */
        on(type: string, callback: (event: Event) => void): Item;

        /**
         * Attach one or more event handlers to the view.
         */
        on(param: any): Item;

        /**
         * Detach an event handler from the view.
         * @param type - String('frame'|'resize') the event type
         * @param function - The function to be detached
         */
        off(type: string, callback: (event: Event) => void): Item;

        /**
         * Detach one or more event handlers from the view.
         * @param param -  an object literal containing one or more of the following properties: frame, resize
         */
        off(param: any): Item;

        /**
         * Emit an event on the view.
         * @param type - String('frame'|'resize') the event type
         * @param event - an object literal containing properties describing the event.
         */
        emit(type: string, event: any): boolean;

        /**
         * Check if the view has one or more event handlers of the specified type.
         * @param type - String('frame'|'resize') the event type
         */
        responds(type: string): boolean;

    }
    /**
     * The Tool object refers to a script that the user can interact with by using the mouse and keyboard and can be accessed through the global tool variable. All its properties are also available in the paper scope.
     * The global tool variable only exists in scripts that contain mouse handler functions (onMouseMove, onMouseDown, onMouseDrag, onMouseUp) or a keyboard handler function (onKeyDown, onKeyUp).
     */
    export class Tool {

        /**
         * The minimum distance the mouse has to drag before firing the onMouseDrag event, since the last onMouseDrag event.
         */
        minDistance: number;

        /**
         * The maximum distance the mouse has to drag before firing the onMouseDrag event, since the last onMouseDrag event.
         */
        maxDistance: number;

        /**
         *
         */
        fixedDistance: number;

        /**
         * The function to be called when the mouse button is pushed down. The function receives a ToolEvent object which contains information about the mouse event.
         */
        onMouseDown: (event: ToolEvent) => void;

        /**
         * The function to be called when the mouse position changes while the mouse is being dragged. The function receives a ToolEvent object which contains information about the mouse event.
         */
        onMouseDrag: (event: ToolEvent) => void;

        /**
         * The function to be called the mouse moves within the project view. The function receives a ToolEvent object which contains information about the mouse event.
         */
        onMouseMove: (event: ToolEvent) => void;

        /**
         * The function to be called when the mouse button is released. The function receives a ToolEvent object which contains information about the mouse event.
         */
        onMouseUp: (event: ToolEvent) => void;

        /**
         * The function to be called when the user presses a key on the keyboard.
         * The function receives a KeyEvent object which contains information about the keyboard event.
         * If the function returns false, the keyboard event will be prevented from bubbling up. This can be used for example to stop the window from scrolling, when you need the user to interact with arrow keys.
         */
        onKeyDown: (event: KeyEvent) => void;

        /**
         * The function to be called when the user releases a key on the keyboard.
         * The function receives a KeyEvent object which contains information about the keyboard event.
         * If the function returns false, the keyboard event will be prevented from bubbling up. This can be used for example to stop the window from scrolling, when you need the user to interact with arrow keys.
         */
        onKeyUp: (event: KeyEvent) => void;

        /**
         * Activates this tool, meaning paperScope.tool will point to it and it will be the one that recieves mouse events.
         */
        activate(): void;

        /**
         * Removes this tool from the paperScope.tools list.
         */
        remove(): void;

        //I cannot use function: Function as it is a reserved keyword

        /**
         * Attach an event handler to the tool.
         * @param type - String('mousedown'|'mouseup'|'mousedrag'|'mousemove'|'keydown'|'keyup') the event type
         * @param function - The function to be called when the event occurs
         */
        on(type: string, callback: (event: ToolEvent) => void): Tool;

        /**
         * Attach one or more event handlers to the tool.
         * @param param - an object literal containing one or more of the following properties: mousedown, mouseup, mousedrag, mousemove, keydown, keyup
         */
        on(param: any): Tool;

        /**
         * Detach an event handler from the tool.
         * @param type - String('mousedown'|'mouseup'|'mousedrag'|'mousemove'|'keydown'|'keyup') the event type
         * @param function - The function to be detached
         */
        off(type: string, callback: (event: ToolEvent) => void): Tool;

        /**
         * Detach one or more event handlers from the tool.
         * @param param -  an object literal containing one or more of the following properties: mousedown, mouseup, mousedrag, mousemove, keydown, keyup
         */
        off(param: any): Tool;

        /**
         * Emit an event on the tool.
         * @param type - String('mousedown'|'mouseup'|'mousedrag'|'mousemove'|'keydown'|'keyup') the event type
         * @param event - an object literal containing properties describing the event.
         */
        emit(type: string, event: any): boolean;

        /**
         * Check if the tool has one or more event handlers of the specified type.
         * @param type - String('mousedown'|'mouseup'|'mousedrag'|'mousemove'|'keydown'|'keyup') the event type
         */
        responds(type: string): boolean;

    }
    export class Event {

        /**
         * Read Only
         */
        modifiers: any;

    }
    /**
     * ToolEvent The ToolEvent object is received by the Tool's mouse event handlers tool.onMouseDown, tool.onMouseDrag, tool.onMouseMove and tool.onMouseUp. The ToolEvent object is the only parameter passed to these functions and contains information about the mouse event.
     */
    export class ToolEvent extends Event {

        /**
         * The type of tool event.
         * String('mousedown', 'mouseup', 'mousemove', 'mousedrag')
         */
        type: string;

        /**
         * The position of the mouse in project coordinates when the event was fired.
         */
        point: Point;

        /**
         * The position of the mouse in project coordinates when the previous event was fired.
         */
        lastPoint: Point;

        /**
         * The position of the mouse in project coordinates when the mouse button was last clicked.
         */
        downPoint: Point;

        /**
         * The point in the middle between lastPoint and point. This is a useful position to use when creating artwork based on the moving direction of the mouse, as returned by delta.
         */
        middlePoint: Point;

        /**
         * The difference between the current position and the last position of the mouse when the event was fired. In case of the mouseup event, the difference to the mousedown position is returned.
         */
        delta: Point;

        /**
         * The number of times the mouse event was fired.
         */
        count: number;

        /**
         * The item at the position of the mouse (if any). If the item is contained within one or more Group or CompoundPath items, the most top level group or compound path that it is contained within is returned.
         */
        item: Item;

        /**
         * a string representation of the tool event
         */
        toString(): string;

    }
    export class Key {

        /**
         * Checks whether the specified key is pressed.
         * @param key - One of: 'backspace', 'enter', 'shift', 'control', 'option', 'pause', 'caps-lock', 'escape', 'space', 'end', 'home', 'left', 'up', 'right', 'down', 'delete', 'command'
         */
        static isDown(key: string): boolean;

    }
    /**
     * The KeyEvent object is received by the Tool's keyboard handlers tool.onKeyDown, tool.onKeyUp. The KeyEvent object is the only parameter passed to these functions and contains information about the keyboard event.
     */
    export class KeyEvent extends Event {

        /**
         * The type of key event.
         * String('keydown', 'keyup')
         */
        type: string;

        /**
         * The string character of the key that caused this key event.
         */
        character: string;

        /**
         * The key that caused this key event.
         */
        key: string;

        /**
         * The original javascript event.
         */

        event;

        /**
         * a string representation of the key event
         */
        toString(): string;

    }
    /**
     * The TextItem type allows you to create typography. Its functionality is inherited by different text item types such as PointText, and AreaText (coming soon). They each add a layer of functionality that is unique to their type, but share the underlying properties and functions that they inherit from TextItem.
     */
    export class TextItem extends Item {

        /**
         * The text contents of the text item.
         */
        content: string;

        /**
         * The font-family to be used in text content.
         */
        fontFamily: string;

        /**
         * The font-weight to be used in text content.
         */
        fontWeight: string | number;

        /**
         * The font size of text content, as {@Number} in pixels, or as {@String} with optional units 'px', 'pt' and 'em'.
         */
        fontSize: string | number;

        /**
         * The text leading of text content.
         */
        leading: string | number;

        /**
         * The justification of text paragraphs.
         * String('left', 'right', 'center')
         */
        justification: string;

    }
    /**
     * A PointText item represents a piece of typography in your Paper.js project which starts from a certain point and extends by the amount of characters contained in it.
     */
    export class PointText extends TextItem {

        /**
         * Creates a point text item
         * @param point - the position where the text will start
         */
        constructor(point: Point);

        /**
         * Creates a point text item from the properties described by an object literal.
         * @param object - an object literal containing properties describing the path's attributes
         */
        constructor(object: any);

        /**
         * The PointText's anchor point
         */
        point: Point;

    }

}
// Type definitions for jQuery 1.10.x / 2.0.x
// Project: http://jquery.com/
// Definitions by: Boris Yankov <https://github.com/borisyankov/>, Christian Hoffmeister <https://github.com/choffmeister>, Steve Fenton <https://github.com/Steve-Fenton>, Diullei Gomes <https://github.com/Diullei>, Tass Iliopoulos <https://github.com/tasoili>, Jason Swearingen <https://github.com/jasons-novaleaf>, Sean Hill <https://github.com/seanski>, Guus Goossens <https://github.com/Guuz>, Kelly Summerlin <https://github.com/ksummerlin>, Basarat Ali Syed <https://github.com/basarat>, Nicholas Wolverson <https://github.com/nwolverson>, Derek Cicerone <https://github.com/derekcicerone>, Andrew Gaspar <https://github.com/AndrewGaspar>, James Harrison Fisher <https://github.com/jameshfisher>, Seikichi Kondo <https://github.com/seikichi>, Benjamin Jackman <https://github.com/benjaminjackman>, Poul Sorensen <https://github.com/s093294>, Josh Strobl <https://github.com/JoshStrobl>, John Reilly <https://github.com/johnnyreilly/>, Dick van den Brink <https://github.com/DickvdBrink>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

/* *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */


/**
 * Interface for the AJAX setting that will configure the AJAX request
 */
interface JQueryAjaxSettings {
    /**
     * The content type sent in the request header that tells the server what kind of response it will accept in return. If the accepts setting needs modification, it is recommended to do so once in the $.ajaxSetup() method.
     */
    accepts?: any;
    /**
     * By default, all requests are sent asynchronously (i.e. this is set to true by default). If you need synchronous requests, set this option to false. Cross-domain requests and dataType: "jsonp" requests do not support synchronous operation. Note that synchronous requests may temporarily lock the browser, disabling any actions while the request is active. As of jQuery 1.8, the use of async: false with jqXHR ($.Deferred) is deprecated; you must use the success/error/complete callback options instead of the corresponding methods of the jqXHR object such as jqXHR.done() or the deprecated jqXHR.success().
     */
    async?: boolean;
    /**
     * A pre-request callback function that can be used to modify the jqXHR (in jQuery 1.4.x, XMLHTTPRequest) object before it is sent. Use this to set custom headers, etc. The jqXHR and settings objects are passed as arguments. This is an Ajax Event. Returning false in the beforeSend function will cancel the request. As of jQuery 1.5, the beforeSend option will be called regardless of the type of request.
     */
    beforeSend? (jqXHR: JQueryXHR, settings: JQueryAjaxSettings): any;
    /**
     * If set to false, it will force requested pages not to be cached by the browser. Note: Setting cache to false will only work correctly with HEAD and GET requests. It works by appending "_={timestamp}" to the GET parameters. The parameter is not needed for other types of requests, except in IE8 when a POST is made to a URL that has already been requested by a GET.
     */
    cache?: boolean;
    /**
     * A function to be called when the request finishes (after success and error callbacks are executed). The function gets passed two arguments: The jqXHR (in jQuery 1.4.x, XMLHTTPRequest) object and a string categorizing the status of the request ("success", "notmodified", "error", "timeout", "abort", or "parsererror"). As of jQuery 1.5, the complete setting can accept an array of functions. Each function will be called in turn. This is an Ajax Event.
     */
    complete? (jqXHR: JQueryXHR, textStatus: string): any;
    /**
     * An object of string/regular-expression pairs that determine how jQuery will parse the response, given its content type. (version added: 1.5)
     */
    contents?: { [key: string]: any; };
    //According to jQuery.ajax source code, ajax's option actually allows contentType to set to "false"
    // https://github.com/borisyankov/DefinitelyTyped/issues/742
    /**
     * When sending data to the server, use this content type. Default is "application/x-www-form-urlencoded; charset=UTF-8", which is fine for most cases. If you explicitly pass in a content-type to $.ajax(), then it is always sent to the server (even if no data is sent). The W3C XMLHttpRequest specification dictates that the charset is always UTF-8; specifying another charset will not force the browser to change the encoding.
     */
    contentType?: any;
    /**
     * This object will be made the context of all Ajax-related callbacks. By default, the context is an object that represents the ajax settings used in the call ($.ajaxSettings merged with the settings passed to $.ajax).
     */
    context?: any;
    /**
     * An object containing dataType-to-dataType converters. Each converter's value is a function that returns the transformed value of the response. (version added: 1.5)
     */
    converters?: { [key: string]: any; };
    /**
     * If you wish to force a crossDomain request (such as JSONP) on the same domain, set the value of crossDomain to true. This allows, for example, server-side redirection to another domain. (version added: 1.5)
     */
    crossDomain?: boolean;
    /**
     * Data to be sent to the server. It is converted to a query string, if not already a string. It's appended to the url for GET-requests. See processData option to prevent this automatic processing. Object must be Key/Value pairs. If value is an Array, jQuery serializes multiple values with same key based on the value of the traditional setting (described below).
     */
    data?: any;
    /**
     * A function to be used to handle the raw response data of XMLHttpRequest.This is a pre-filtering function to sanitize the response. You should return the sanitized data. The function accepts two arguments: The raw data returned from the server and the 'dataType' parameter.
     */
    dataFilter? (data: any, ty: any): any;
    /**
     * The type of data that you're expecting back from the server. If none is specified, jQuery will try to infer it based on the MIME type of the response (an XML MIME type will yield XML, in 1.4 JSON will yield a JavaScript object, in 1.4 script will execute the script, and anything else will be returned as a string). 
     */
    dataType?: string;
    /**
     * A function to be called if the request fails. The function receives three arguments: The jqXHR (in jQuery 1.4.x, XMLHttpRequest) object, a string describing the type of error that occurred and an optional exception object, if one occurred. Possible values for the second argument (besides null) are "timeout", "error", "abort", and "parsererror". When an HTTP error occurs, errorThrown receives the textual portion of the HTTP status, such as "Not Found" or "Internal Server Error." As of jQuery 1.5, the error setting can accept an array of functions. Each function will be called in turn. Note: This handler is not called for cross-domain script and cross-domain JSONP requests. This is an Ajax Event.
     */
    error? (jqXHR: JQueryXHR, textStatus: string, errorThrown: string): any;
    /**
     * Whether to trigger global Ajax event handlers for this request. The default is true. Set to false to prevent the global handlers like ajaxStart or ajaxStop from being triggered. This can be used to control various Ajax Events.
     */
    global?: boolean;
    /**
     * An object of additional header key/value pairs to send along with requests using the XMLHttpRequest transport. The header X-Requested-With: XMLHttpRequest is always added, but its default XMLHttpRequest value can be changed here. Values in the headers setting can also be overwritten from within the beforeSend function. (version added: 1.5)
     */
    headers?: { [key: string]: any; };
    /**
     * Allow the request to be successful only if the response has changed since the last request. This is done by checking the Last-Modified header. Default value is false, ignoring the header. In jQuery 1.4 this technique also checks the 'etag' specified by the server to catch unmodified data.
     */
    ifModified?: boolean;
    /**
     * Allow the current environment to be recognized as "local," (e.g. the filesystem), even if jQuery does not recognize it as such by default. The following protocols are currently recognized as local: file, *-extension, and widget. If the isLocal setting needs modification, it is recommended to do so once in the $.ajaxSetup() method. (version added: 1.5.1)
     */
    isLocal?: boolean;
    /**
     * Override the callback function name in a jsonp request. This value will be used instead of 'callback' in the 'callback=?' part of the query string in the url. So {jsonp:'onJSONPLoad'} would result in 'onJSONPLoad=?' passed to the server. As of jQuery 1.5, setting the jsonp option to false prevents jQuery from adding the "?callback" string to the URL or attempting to use "=?" for transformation. In this case, you should also explicitly set the jsonpCallback setting. For example, { jsonp: false, jsonpCallback: "callbackName" }
     */
    jsonp?: any;
    /**
     * Specify the callback function name for a JSONP request. This value will be used instead of the random name automatically generated by jQuery. It is preferable to let jQuery generate a unique name as it'll make it easier to manage the requests and provide callbacks and error handling. You may want to specify the callback when you want to enable better browser caching of GET requests. As of jQuery 1.5, you can also use a function for this setting, in which case the value of jsonpCallback is set to the return value of that function.
     */
    jsonpCallback?: any;
    /**
     * The HTTP method to use for the request (e.g. "POST", "GET", "PUT"). (version added: 1.9.0)
     */
    method?: string;
    /**
     * A mime type to override the XHR mime type. (version added: 1.5.1)
     */
    mimeType?: string;
    /**
     * A password to be used with XMLHttpRequest in response to an HTTP access authentication request.
     */
    password?: string;
    /**
     * By default, data passed in to the data option as an object (technically, anything other than a string) will be processed and transformed into a query string, fitting to the default content-type "application/x-www-form-urlencoded". If you want to send a DOMDocument, or other non-processed data, set this option to false.
     */
    processData?: boolean;
    /**
     * Only applies when the "script" transport is used (e.g., cross-domain requests with "jsonp" or "script" dataType and "GET" type). Sets the charset attribute on the script tag used in the request. Used when the character set on the local page is not the same as the one on the remote script.
     */
    scriptCharset?: string;
    /**
     * An object of numeric HTTP codes and functions to be called when the response has the corresponding code. f the request is successful, the status code functions take the same parameters as the success callback; if it results in an error (including 3xx redirect), they take the same parameters as the error callback. (version added: 1.5)
     */
    statusCode?: { [key: string]: any; };
    /**
     * A function to be called if the request succeeds. The function gets passed three arguments: The data returned from the server, formatted according to the dataType parameter; a string describing the status; and the jqXHR (in jQuery 1.4.x, XMLHttpRequest) object. As of jQuery 1.5, the success setting can accept an array of functions. Each function will be called in turn. This is an Ajax Event.
     */
    success? (data: any, textStatus: string, jqXHR: JQueryXHR): any;
    /**
     * Set a timeout (in milliseconds) for the request. This will override any global timeout set with $.ajaxSetup(). The timeout period starts at the point the $.ajax call is made; if several other requests are in progress and the browser has no connections available, it is possible for a request to time out before it can be sent. In jQuery 1.4.x and below, the XMLHttpRequest object will be in an invalid state if the request times out; accessing any object members may throw an exception. In Firefox 3.0+ only, script and JSONP requests cannot be cancelled by a timeout; the script will run even if it arrives after the timeout period.
     */
    timeout?: number;
    /**
     * Set this to true if you wish to use the traditional style of param serialization.
     */
    traditional?: boolean;
    /**
     * The type of request to make ("POST" or "GET"), default is "GET". Note: Other HTTP request methods, such as PUT and DELETE, can also be used here, but they are not supported by all browsers.
     */
    type?: string;
    /**
     * A string containing the URL to which the request is sent.
     */
    url?: string;
    /**
     * A username to be used with XMLHttpRequest in response to an HTTP access authentication request.
     */
    username?: string;
    /**
     * Callback for creating the XMLHttpRequest object. Defaults to the ActiveXObject when available (IE), the XMLHttpRequest otherwise. Override to provide your own implementation for XMLHttpRequest or enhancements to the factory.
     */
    xhr?: any;
    /**
     * An object of fieldName-fieldValue pairs to set on the native XHR object. For example, you can use it to set withCredentials to true for cross-domain requests if needed. In jQuery 1.5, the withCredentials property was not propagated to the native XHR and thus CORS requests requiring it would ignore this flag. For this reason, we recommend using jQuery 1.5.1+ should you require the use of it. (version added: 1.5.1)
     */
    xhrFields?: { [key: string]: any; };
}

/**
 * Interface for the jqXHR object
 */
interface JQueryXHR extends XMLHttpRequest, JQueryPromise<any> {
    /**
     * The .overrideMimeType() method may be used in the beforeSend() callback function, for example, to modify the response content-type header. As of jQuery 1.5.1, the jqXHR object also contains the overrideMimeType() method (it was available in jQuery 1.4.x, as well, but was temporarily removed in jQuery 1.5). 
     */
    overrideMimeType(mimeType: string): any;
    /**
     * Cancel the request. 
     *
     * @param statusText A string passed as the textStatus parameter for the done callback. Default value: "canceled"
     */
    abort(statusText?: string): void;
    /**
     * Incorporates the functionality of the .done() and .fail() methods, allowing (as of jQuery 1.8) the underlying Promise to be manipulated. Refer to deferred.then() for implementation details.
     */
    then(doneCallback: (data: any, textStatus: string, jqXHR: JQueryXHR) => void, failCallback?: (jqXHR: JQueryXHR, textStatus: string, errorThrown: any) => void): JQueryPromise<any>;
    /**
     * Property containing the parsed response if the response Content-Type is json
     */
    responseJSON?: any;
}

/**
 * Interface for the JQuery callback
 */
interface JQueryCallback {
    /**
     * Add a callback or a collection of callbacks to a callback list.
     * 
     * @param callbacks A function, or array of functions, that are to be added to the callback list.
     */
    add(callbacks: Function): JQueryCallback;
    /**
     * Add a callback or a collection of callbacks to a callback list.
     * 
     * @param callbacks A function, or array of functions, that are to be added to the callback list.
     */
    add(callbacks: Function[]): JQueryCallback;

    /**
     * Disable a callback list from doing anything more.
     */
    disable(): JQueryCallback;

    /**
     * Determine if the callbacks list has been disabled.
     */
    disabled(): boolean;

    /**
     * Remove all of the callbacks from a list.
     */
    empty(): JQueryCallback;

    /**
     * Call all of the callbacks with the given arguments
     * 
     * @param arguments The argument or list of arguments to pass back to the callback list.
     */
    fire(...arguments: any[]): JQueryCallback;

    /**
     * Determine if the callbacks have already been called at least once.
     */
    fired(): boolean;

    /**
     * Call all callbacks in a list with the given context and arguments.
     * 
     * @param context A reference to the context in which the callbacks in the list should be fired.
     * @param arguments An argument, or array of arguments, to pass to the callbacks in the list.
     */
    fireWith(context?: any, ...args: any[]): JQueryCallback;

    /**
     * Determine whether a supplied callback is in a list
     * 
     * @param callback The callback to search for.
     */
    has(callback: Function): boolean;

    /**
     * Lock a callback list in its current state.
     */
    lock(): JQueryCallback;

    /**
     * Determine if the callbacks list has been locked.
     */
    locked(): boolean;

    /**
     * Remove a callback or a collection of callbacks from a callback list.
     * 
     * @param callbacks A function, or array of functions, that are to be removed from the callback list.
     */
    remove(callbacks: Function): JQueryCallback;
    /**
     * Remove a callback or a collection of callbacks from a callback list.
     * 
     * @param callbacks A function, or array of functions, that are to be removed from the callback list.
     */
    remove(callbacks: Function[]): JQueryCallback;
}

/**
 * Allows jQuery Promises to interop with non-jQuery promises
 */
interface JQueryGenericPromise<T> {
    /**
     * Add handlers to be called when the Deferred object is resolved, rejected, or still in progress.
     * 
     * @param doneFilter A function that is called when the Deferred is resolved.
     * @param failFilter An optional function that is called when the Deferred is rejected.
     */
    then<U>(doneFilter: (value?: T, ...values: any[]) => U|JQueryPromise<U>, failFilter?: (...reasons: any[]) => any, progressFilter?: (...progression: any[]) => any): JQueryPromise<U>;

    /**
     * Add handlers to be called when the Deferred object is resolved, rejected, or still in progress.
     * 
     * @param doneFilter A function that is called when the Deferred is resolved.
     * @param failFilter An optional function that is called when the Deferred is rejected.
     */
    then(doneFilter: (value?: T, ...values: any[]) => void, failFilter?: (...reasons: any[]) => any, progressFilter?: (...progression: any[]) => any): JQueryPromise<void>;
}

/**
 * Interface for the JQuery promise/deferred callbacks
 */
interface JQueryPromiseCallback<T> {
    (value?: T, ...args: any[]): void;
}

interface JQueryPromiseOperator<T, U> {
    (callback1: JQueryPromiseCallback<T>|JQueryPromiseCallback<T>[], ...callbacksN: Array<JQueryPromiseCallback<any>|JQueryPromiseCallback<any>[]>): JQueryPromise<U>;
}

/**
 * Interface for the JQuery promise, part of callbacks
 */
interface JQueryPromise<T> extends JQueryGenericPromise<T> {
    /**
     * Determine the current state of a Deferred object.
     */
    state(): string;
    /**
     * Add handlers to be called when the Deferred object is either resolved or rejected.
     * 
     * @param alwaysCallbacks1 A function, or array of functions, that is called when the Deferred is resolved or rejected.
     * @param alwaysCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is resolved or rejected.
     */
    always(alwaysCallback1?: JQueryPromiseCallback<any>|JQueryPromiseCallback<any>[], ...alwaysCallbacksN: Array<JQueryPromiseCallback<any>|JQueryPromiseCallback<any>[]>): JQueryPromise<T>;
    /**
     * Add handlers to be called when the Deferred object is resolved.
     * 
     * @param doneCallbacks1 A function, or array of functions, that are called when the Deferred is resolved.
     * @param doneCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is resolved.
     */
    done(doneCallback1?: JQueryPromiseCallback<T>|JQueryPromiseCallback<T>[], ...doneCallbackN: Array<JQueryPromiseCallback<T>|JQueryPromiseCallback<T>[]>): JQueryPromise<T>;
    /**
     * Add handlers to be called when the Deferred object is rejected.
     * 
     * @param failCallbacks1 A function, or array of functions, that are called when the Deferred is rejected.
     * @param failCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is rejected.
     */
    fail(failCallback1?: JQueryPromiseCallback<any>|JQueryPromiseCallback<any>[], ...failCallbacksN: Array<JQueryPromiseCallback<any>|JQueryPromiseCallback<any>[]>): JQueryPromise<T>;
    /**
     * Add handlers to be called when the Deferred object generates progress notifications.
     * 
     * @param progressCallbacks A function, or array of functions, to be called when the Deferred generates progress notifications.
     */
    progress(progressCallback1?: JQueryPromiseCallback<any>|JQueryPromiseCallback<any>[], ...progressCallbackN: Array<JQueryPromiseCallback<any>|JQueryPromiseCallback<any>[]>): JQueryPromise<T>;

    // Deprecated - given no typings
    pipe(doneFilter?: (x: any) => any, failFilter?: (x: any) => any, progressFilter?: (x: any) => any): JQueryPromise<any>;
}

/**
 * Interface for the JQuery deferred, part of callbacks
 */
interface JQueryDeferred<T> extends JQueryGenericPromise<T> {
    /**
     * Determine the current state of a Deferred object.
     */
    state(): string;
    /**
     * Add handlers to be called when the Deferred object is either resolved or rejected.
     * 
     * @param alwaysCallbacks1 A function, or array of functions, that is called when the Deferred is resolved or rejected.
     * @param alwaysCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is resolved or rejected.
     */
    always(alwaysCallback1?: JQueryPromiseCallback<any>|JQueryPromiseCallback<any>[], ...alwaysCallbacksN: Array<JQueryPromiseCallback<any>|JQueryPromiseCallback<any>[]>): JQueryDeferred<T>;
    /**
     * Add handlers to be called when the Deferred object is resolved.
     * 
     * @param doneCallbacks1 A function, or array of functions, that are called when the Deferred is resolved.
     * @param doneCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is resolved.
     */
    done(doneCallback1?: JQueryPromiseCallback<T>|JQueryPromiseCallback<T>[], ...doneCallbackN: Array<JQueryPromiseCallback<T>|JQueryPromiseCallback<T>[]>): JQueryDeferred<T>;
    /**
     * Add handlers to be called when the Deferred object is rejected.
     * 
     * @param failCallbacks1 A function, or array of functions, that are called when the Deferred is rejected.
     * @param failCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is rejected.
     */
    fail(failCallback1?: JQueryPromiseCallback<any>|JQueryPromiseCallback<any>[], ...failCallbacksN: Array<JQueryPromiseCallback<any>|JQueryPromiseCallback<any>[]>): JQueryDeferred<T>;
    /**
     * Add handlers to be called when the Deferred object generates progress notifications.
     * 
     * @param progressCallbacks A function, or array of functions, to be called when the Deferred generates progress notifications.
     */
    progress(progressCallback1?: JQueryPromiseCallback<any>|JQueryPromiseCallback<any>[], ...progressCallbackN: Array<JQueryPromiseCallback<any>|JQueryPromiseCallback<any>[]>): JQueryDeferred<T>;

    /**
     * Call the progressCallbacks on a Deferred object with the given args.
     * 
     * @param args Optional arguments that are passed to the progressCallbacks.
     */
    notify(value?: any, ...args: any[]): JQueryDeferred<T>;

    /**
     * Call the progressCallbacks on a Deferred object with the given context and args.
     * 
     * @param context Context passed to the progressCallbacks as the this object.
     * @param args Optional arguments that are passed to the progressCallbacks.
     */
    notifyWith(context: any, value?: any, ...args: any[]): JQueryDeferred<T>;

    /**
     * Reject a Deferred object and call any failCallbacks with the given args.
     * 
     * @param args Optional arguments that are passed to the failCallbacks.
     */
    reject(value?: any, ...args: any[]): JQueryDeferred<T>;
    /**
     * Reject a Deferred object and call any failCallbacks with the given context and args.
     * 
     * @param context Context passed to the failCallbacks as the this object.
     * @param args An optional array of arguments that are passed to the failCallbacks.
     */
    rejectWith(context: any, value?: any, ...args: any[]): JQueryDeferred<T>;

    /**
     * Resolve a Deferred object and call any doneCallbacks with the given args.
     * 
     * @param value First argument passed to doneCallbacks.
     * @param args Optional subsequent arguments that are passed to the doneCallbacks.
     */
    resolve(value?: T, ...args: any[]): JQueryDeferred<T>;

    /**
     * Resolve a Deferred object and call any doneCallbacks with the given context and args.
     * 
     * @param context Context passed to the doneCallbacks as the this object.
     * @param args An optional array of arguments that are passed to the doneCallbacks.
     */
    resolveWith(context: any, value?: T, ...args: any[]): JQueryDeferred<T>;

    /**
     * Return a Deferred's Promise object.
     * 
     * @param target Object onto which the promise methods have to be attached
     */
    promise(target?: any): JQueryPromise<T>;

    // Deprecated - given no typings
    pipe(doneFilter?: (x: any) => any, failFilter?: (x: any) => any, progressFilter?: (x: any) => any): JQueryPromise<any>;
}

/**
 * Interface of the JQuery extension of the W3C event object
 */
interface BaseJQueryEventObject extends Event {
    data: any;
    delegateTarget: Element;
    isDefaultPrevented(): boolean;
    isImmediatePropagationStopped(): boolean;
    isPropagationStopped(): boolean;
    namespace: string;
    originalEvent: Event;
    preventDefault(): any;
    relatedTarget: Element;
    result: any;
    stopImmediatePropagation(): void;
    stopPropagation(): void;
    target: Element;
    pageX: number;
    pageY: number;
    which: number;
    metaKey: boolean;
}

interface JQueryInputEventObject extends BaseJQueryEventObject {
    altKey: boolean;
    ctrlKey: boolean;
    metaKey: boolean;
    shiftKey: boolean;
}

interface JQueryMouseEventObject extends JQueryInputEventObject {
    button: number;
    clientX: number;
    clientY: number;
    offsetX: number;
    offsetY: number;
    pageX: number;
    pageY: number;
    screenX: number;
    screenY: number;
}

interface JQueryKeyEventObject extends JQueryInputEventObject {
    char: any;
    charCode: number;
    key: any;
    keyCode: number;
}

interface JQueryEventObject extends BaseJQueryEventObject, JQueryInputEventObject, JQueryMouseEventObject, JQueryKeyEventObject{
}

/*
    Collection of properties of the current browser
*/

interface JQuerySupport {
    ajax?: boolean;
    boxModel?: boolean;
    changeBubbles?: boolean;
    checkClone?: boolean;
    checkOn?: boolean;
    cors?: boolean;
    cssFloat?: boolean;
    hrefNormalized?: boolean;
    htmlSerialize?: boolean;
    leadingWhitespace?: boolean;
    noCloneChecked?: boolean;
    noCloneEvent?: boolean;
    opacity?: boolean;
    optDisabled?: boolean;
    optSelected?: boolean;
    scriptEval? (): boolean;
    style?: boolean;
    submitBubbles?: boolean;
    tbody?: boolean;
}

interface JQueryParam {
    /**
     * Create a serialized representation of an array or object, suitable for use in a URL query string or Ajax request.
     * 
     * @param obj An array or object to serialize.
     */
    (obj: any): string;

    /**
     * Create a serialized representation of an array or object, suitable for use in a URL query string or Ajax request.
     * 
     * @param obj An array or object to serialize.
     * @param traditional A Boolean indicating whether to perform a traditional "shallow" serialization.
     */
    (obj: any, traditional: boolean): string;
}

/**
 * The interface used to construct jQuery events (with $.Event). It is
 * defined separately instead of inline in JQueryStatic to allow
 * overriding the construction function with specific strings
 * returning specific event objects.
 */
interface JQueryEventConstructor {
    (name: string, eventProperties?: any): JQueryEventObject;
    new (name: string, eventProperties?: any): JQueryEventObject;
}

/**
 * The interface used to specify coordinates.
 */
interface JQueryCoordinates {
    left: number;
    top: number;
}

/**
 * Elements in the array returned by serializeArray()
 */
interface JQuerySerializeArrayElement {
    name: string;
    value: string;
}

interface JQueryAnimationOptions { 
    /**
     * A string or number determining how long the animation will run.
     */
    duration?: any; 
    /**
     * A string indicating which easing function to use for the transition.
     */
    easing?: string; 
    /**
     * A function to call once the animation is complete.
     */
    complete?: Function; 
    /**
     * A function to be called for each animated property of each animated element. This function provides an opportunity to modify the Tween object to change the value of the property before it is set.
     */
    step?: (now: number, tween: any) => any; 
    /**
     * A function to be called after each step of the animation, only once per animated element regardless of the number of animated properties. (version added: 1.8)
     */
    progress?: (animation: JQueryPromise<any>, progress: number, remainingMs: number) => any; 
    /**
     * A function to call when the animation begins. (version added: 1.8)
     */
    start?: (animation: JQueryPromise<any>) => any; 
    /**
     * A function to be called when the animation completes (its Promise object is resolved). (version added: 1.8)
     */
    done?: (animation: JQueryPromise<any>, jumpedToEnd: boolean) => any; 
    /**
     * A function to be called when the animation fails to complete (its Promise object is rejected). (version added: 1.8)
     */
    fail?: (animation: JQueryPromise<any>, jumpedToEnd: boolean) => any; 
    /**
     * A function to be called when the animation completes or stops without completing (its Promise object is either resolved or rejected). (version added: 1.8)
     */
    always?: (animation: JQueryPromise<any>, jumpedToEnd: boolean) => any; 
    /**
     * A Boolean indicating whether to place the animation in the effects queue. If false, the animation will begin immediately. As of jQuery 1.7, the queue option can also accept a string, in which case the animation is added to the queue represented by that string. When a custom queue name is used the animation does not automatically start; you must call .dequeue("queuename") to start it.
     */
    queue?: any; 
    /**
     * A map of one or more of the CSS properties defined by the properties argument and their corresponding easing functions. (version added: 1.4)
     */
    specialEasing?: Object;
}

/**
 * Static members of jQuery (those on $ and jQuery themselves)
 */
interface JQueryStatic {

    /**
     * Perform an asynchronous HTTP (Ajax) request.
     *
     * @param settings A set of key/value pairs that configure the Ajax request. All settings are optional. A default can be set for any option with $.ajaxSetup().
     */
    ajax(settings: JQueryAjaxSettings): JQueryXHR;
    /**
     * Perform an asynchronous HTTP (Ajax) request.
     *
     * @param url A string containing the URL to which the request is sent.
     * @param settings A set of key/value pairs that configure the Ajax request. All settings are optional. A default can be set for any option with $.ajaxSetup().
     */
    ajax(url: string, settings?: JQueryAjaxSettings): JQueryXHR;

    /**
     * Handle custom Ajax options or modify existing options before each request is sent and before they are processed by $.ajax().
     *
     * @param dataTypes An optional string containing one or more space-separated dataTypes
     * @param handler A handler to set default values for future Ajax requests.
     */
    ajaxPrefilter(dataTypes: string, handler: (opts: any, originalOpts: JQueryAjaxSettings, jqXHR: JQueryXHR) => any): void;
    /**
     * Handle custom Ajax options or modify existing options before each request is sent and before they are processed by $.ajax().
     *
     * @param handler A handler to set default values for future Ajax requests.
     */
    ajaxPrefilter(handler: (opts: any, originalOpts: JQueryAjaxSettings, jqXHR: JQueryXHR) => any): void;

    ajaxSettings: JQueryAjaxSettings;

     /**
      * Set default values for future Ajax requests. Its use is not recommended.
      *
      * @param options A set of key/value pairs that configure the default Ajax request. All options are optional.
      */
    ajaxSetup(options: JQueryAjaxSettings): void;

    /**
     * Load data from the server using a HTTP GET request.
     *
     * @param url A string containing the URL to which the request is sent.
     * @param success A callback function that is executed if the request succeeds.
     * @param dataType The type of data expected from the server. Default: Intelligent Guess (xml, json, script, or html).
     */
    get(url: string, success?: (data: any, textStatus: string, jqXHR: JQueryXHR) => any, dataType?: string): JQueryXHR;
    /**
     * Load data from the server using a HTTP GET request.
     *
     * @param url A string containing the URL to which the request is sent.
     * @param data A plain object or string that is sent to the server with the request.
     * @param success A callback function that is executed if the request succeeds.
     * @param dataType The type of data expected from the server. Default: Intelligent Guess (xml, json, script, or html).
     */
    get(url: string, data?: Object|string, success?: (data: any, textStatus: string, jqXHR: JQueryXHR) => any, dataType?: string): JQueryXHR;
    /**
     * Load JSON-encoded data from the server using a GET HTTP request.
     *
     * @param url A string containing the URL to which the request is sent.
     * @param success A callback function that is executed if the request succeeds.
     */
    getJSON(url: string, success?: (data: any, textStatus: string, jqXHR: JQueryXHR) => any): JQueryXHR;
    /**
     * Load JSON-encoded data from the server using a GET HTTP request.
     *
     * @param url A string containing the URL to which the request is sent.
     * @param data A plain object or string that is sent to the server with the request.
     * @param success A callback function that is executed if the request succeeds.
     */
    getJSON(url: string, data?: Object|string, success?: (data: any, textStatus: string, jqXHR: JQueryXHR) => any): JQueryXHR;
    /**
     * Load a JavaScript file from the server using a GET HTTP request, then execute it.
     *
     * @param url A string containing the URL to which the request is sent.
     * @param success A callback function that is executed if the request succeeds.
     */
    getScript(url: string, success?: (script: string, textStatus: string, jqXHR: JQueryXHR) => any): JQueryXHR;

    /**
     * Create a serialized representation of an array or object, suitable for use in a URL query string or Ajax request.
     */
    param: JQueryParam;

    /**
     * Load data from the server using a HTTP POST request.
     *
     * @param url A string containing the URL to which the request is sent.
     * @param success A callback function that is executed if the request succeeds. Required if dataType is provided, but can be null in that case.
     * @param dataType The type of data expected from the server. Default: Intelligent Guess (xml, json, script, text, html).
     */
    post(url: string, success?: (data: any, textStatus: string, jqXHR: JQueryXHR) => any, dataType?: string): JQueryXHR;
    /**
     * Load data from the server using a HTTP POST request.
     *
     * @param url A string containing the URL to which the request is sent.
     * @param data A plain object or string that is sent to the server with the request.
     * @param success A callback function that is executed if the request succeeds. Required if dataType is provided, but can be null in that case.
     * @param dataType The type of data expected from the server. Default: Intelligent Guess (xml, json, script, text, html).
     */
    post(url: string, data?: Object|string, success?: (data: any, textStatus: string, jqXHR: JQueryXHR) => any, dataType?: string): JQueryXHR;

    /**
     * A multi-purpose callbacks list object that provides a powerful way to manage callback lists.
     *
     * @param flags An optional list of space-separated flags that change how the callback list behaves.
     */
    Callbacks(flags?: string): JQueryCallback;

    /**
     * Holds or releases the execution of jQuery's ready event.
     *
     * @param hold Indicates whether the ready hold is being requested or released
     */
    holdReady(hold: boolean): void;

    /**
     * Accepts a string containing a CSS selector which is then used to match a set of elements.
     *
     * @param selector A string containing a selector expression
     * @param context A DOM Element, Document, or jQuery to use as context
     */
    (selector: string, context?: Element|JQuery): JQuery;

    /**
     * Accepts a string containing a CSS selector which is then used to match a set of elements.
     *
     * @param element A DOM element to wrap in a jQuery object.
     */
    (element: Element): JQuery;

    /**
     * Accepts a string containing a CSS selector which is then used to match a set of elements.
     *
     * @param elementArray An array containing a set of DOM elements to wrap in a jQuery object.
     */
    (elementArray: Element[]): JQuery;

    /**
     * Binds a function to be executed when the DOM has finished loading.
     *
     * @param callback A function to execute after the DOM is ready.
     */
    (callback: (jQueryAlias?: JQueryStatic) => any): JQuery;

    /**
     * Accepts a string containing a CSS selector which is then used to match a set of elements.
     *
     * @param object A plain object to wrap in a jQuery object.
     */
    (object: {}): JQuery;

    /**
     * Accepts a string containing a CSS selector which is then used to match a set of elements.
     *
     * @param object An existing jQuery object to clone.
     */
    (object: JQuery): JQuery;

    /**
     * Specify a function to execute when the DOM is fully loaded.
     */
    (): JQuery;

    /**
     * Creates DOM elements on the fly from the provided string of raw HTML.
     *
     * @param html A string of HTML to create on the fly. Note that this parses HTML, not XML.
     * @param ownerDocument A document in which the new elements will be created.
     */
    (html: string, ownerDocument?: Document): JQuery;

    /**
     * Creates DOM elements on the fly from the provided string of raw HTML.
     *
     * @param html A string defining a single, standalone, HTML element (e.g. <div/> or <div></div>).
     * @param attributes An object of attributes, events, and methods to call on the newly-created element.
     */
    (html: string, attributes: Object): JQuery;

    /**
     * Relinquish jQuery's control of the $ variable.
     *
     * @param removeAll A Boolean indicating whether to remove all jQuery variables from the global scope (including jQuery itself).
     */
    noConflict(removeAll?: boolean): Object;

    /**
     * Provides a way to execute callback functions based on one or more objects, usually Deferred objects that represent asynchronous events.
     *
     * @param deferreds One or more Deferred objects, or plain JavaScript objects.
     */
    when<T>(...deferreds: Array<T|JQueryPromise<T>/* as JQueryDeferred<T> */>): JQueryPromise<T>;

    /**
     * Hook directly into jQuery to override how particular CSS properties are retrieved or set, normalize CSS property naming, or create custom properties.
     */
    cssHooks: { [key: string]: any; };
    cssNumber: any;

    /**
     * Store arbitrary data associated with the specified element. Returns the value that was set.
     *
     * @param element The DOM element to associate with the data.
     * @param key A string naming the piece of data to set.
     * @param value The new data value.
     */
    data<T>(element: Element, key: string, value: T): T;
    /**
     * Returns value at named data store for the element, as set by jQuery.data(element, name, value), or the full data store for the element.
     *
     * @param element The DOM element to associate with the data.
     * @param key A string naming the piece of data to set.
     */
    data(element: Element, key: string): any;
    /**
     * Returns value at named data store for the element, as set by jQuery.data(element, name, value), or the full data store for the element.
     *
     * @param element The DOM element to associate with the data.
     */
    data(element: Element): any;

    /**
     * Execute the next function on the queue for the matched element.
     *
     * @param element A DOM element from which to remove and execute a queued function.
     * @param queueName A string containing the name of the queue. Defaults to fx, the standard effects queue.
     */
    dequeue(element: Element, queueName?: string): void;

    /**
     * Determine whether an element has any jQuery data associated with it.
     *
     * @param element A DOM element to be checked for data.
     */
    hasData(element: Element): boolean;

    /**
     * Show the queue of functions to be executed on the matched element.
     *
     * @param element A DOM element to inspect for an attached queue.
     * @param queueName A string containing the name of the queue. Defaults to fx, the standard effects queue.
     */
    queue(element: Element, queueName?: string): any[];
    /**
     * Manipulate the queue of functions to be executed on the matched element.
     *
     * @param element A DOM element where the array of queued functions is attached.
     * @param queueName A string containing the name of the queue. Defaults to fx, the standard effects queue.
     * @param newQueue An array of functions to replace the current queue contents.
     */
    queue(element: Element, queueName: string, newQueue: Function[]): JQuery;
    /**
     * Manipulate the queue of functions to be executed on the matched element.
     *
     * @param element A DOM element on which to add a queued function.
     * @param queueName A string containing the name of the queue. Defaults to fx, the standard effects queue.
     * @param callback The new function to add to the queue.
     */
    queue(element: Element, queueName: string, callback: Function): JQuery;

    /**
     * Remove a previously-stored piece of data.
     *
     * @param element A DOM element from which to remove data.
     * @param name A string naming the piece of data to remove.
     */
    removeData(element: Element, name?: string): JQuery;

    /**
     * A constructor function that returns a chainable utility object with methods to register multiple callbacks into callback queues, invoke callback queues, and relay the success or failure state of any synchronous or asynchronous function.
     *
     * @param beforeStart A function that is called just before the constructor returns.
     */
    Deferred<T>(beforeStart?: (deferred: JQueryDeferred<T>) => any): JQueryDeferred<T>;

    /**
     * Effects
     */
    fx: {
        tick: () => void;
        /**
         * The rate (in milliseconds) at which animations fire.
         */
        interval: number;
        stop: () => void;
        speeds: { slow: number; fast: number; };
        /**
         * Globally disable all animations.
         */
        off: boolean;
        step: any;
    };

    /**
     * Takes a function and returns a new one that will always have a particular context.
     *
     * @param fnction The function whose context will be changed.
     * @param context The object to which the context (this) of the function should be set.
     * @param additionalArguments Any number of arguments to be passed to the function referenced in the function argument.
     */
    proxy(fnction: (...args: any[]) => any, context: Object, ...additionalArguments: any[]): any;
    /**
     * Takes a function and returns a new one that will always have a particular context.
     *
     * @param context The object to which the context (this) of the function should be set.
     * @param name The name of the function whose context will be changed (should be a property of the context object).
     * @param additionalArguments Any number of arguments to be passed to the function named in the name argument.
     */
    proxy(context: Object, name: string, ...additionalArguments: any[]): any;

    Event: JQueryEventConstructor;

    /**
     * Takes a string and throws an exception containing it.
     *
     * @param message The message to send out.
     */
    error(message: any): JQuery;

    expr: any;
    fn: any;  //TODO: Decide how we want to type this

    isReady: boolean;

    // Properties
    support: JQuerySupport;

    /**
     * Check to see if a DOM element is a descendant of another DOM element.
     * 
     * @param container The DOM element that may contain the other element.
     * @param contained The DOM element that may be contained by (a descendant of) the other element.
     */
    contains(container: Element, contained: Element): boolean;

    /**
     * A generic iterator function, which can be used to seamlessly iterate over both objects and arrays. Arrays and array-like objects with a length property (such as a function's arguments object) are iterated by numeric index, from 0 to length-1. Other objects are iterated via their named properties.
     * 
     * @param collection The object or array to iterate over.
     * @param callback The function that will be executed on every object.
     */
    each<T>(
        collection: T[],
        callback: (indexInArray: number, valueOfElement: T) => any
        ): any;

    /**
     * A generic iterator function, which can be used to seamlessly iterate over both objects and arrays. Arrays and array-like objects with a length property (such as a function's arguments object) are iterated by numeric index, from 0 to length-1. Other objects are iterated via their named properties.
     * 
     * @param collection The object or array to iterate over.
     * @param callback The function that will be executed on every object.
     */
    each(
        collection: any,
        callback: (indexInArray: any, valueOfElement: any) => any
        ): any;

    /**
     * Merge the contents of two or more objects together into the first object.
     *
     * @param target An object that will receive the new properties if additional objects are passed in or that will extend the jQuery namespace if it is the sole argument.
     * @param object1 An object containing additional properties to merge in.
     * @param objectN Additional objects containing properties to merge in.
     */
    extend(target: any, object1?: any, ...objectN: any[]): any;
    /**
     * Merge the contents of two or more objects together into the first object.
     *
     * @param deep If true, the merge becomes recursive (aka. deep copy).
     * @param target The object to extend. It will receive the new properties.
     * @param object1 An object containing additional properties to merge in.
     * @param objectN Additional objects containing properties to merge in.
     */
    extend(deep: boolean, target: any, object1?: any, ...objectN: any[]): any;

    /**
     * Execute some JavaScript code globally.
     *
     * @param code The JavaScript code to execute.
     */
    globalEval(code: string): any;

    /**
     * Finds the elements of an array which satisfy a filter function. The original array is not affected.
     *
     * @param array The array to search through.
     * @param func The function to process each item against. The first argument to the function is the item, and the second argument is the index. The function should return a Boolean value.  this will be the global window object.
     * @param invert If "invert" is false, or not provided, then the function returns an array consisting of all elements for which "callback" returns true. If "invert" is true, then the function returns an array consisting of all elements for which "callback" returns false.
     */
    grep<T>(array: T[], func: (elementOfArray: T, indexInArray: number) => boolean, invert?: boolean): T[];

    /**
     * Search for a specified value within an array and return its index (or -1 if not found).
     *
     * @param value The value to search for.
     * @param array An array through which to search.
     * @param fromIndex he index of the array at which to begin the search. The default is 0, which will search the whole array.
     */
    inArray<T>(value: T, array: T[], fromIndex?: number): number;

    /**
     * Determine whether the argument is an array.
     *
     * @param obj Object to test whether or not it is an array.
     */
    isArray(obj: any): boolean;
    /**
     * Check to see if an object is empty (contains no enumerable properties).
     *
     * @param obj The object that will be checked to see if it's empty.
     */
    isEmptyObject(obj: any): boolean;
    /**
     * Determine if the argument passed is a Javascript function object.
     *
     * @param obj Object to test whether or not it is a function.
     */
    isFunction(obj: any): boolean;
    /**
     * Determines whether its argument is a number.
     *
     * @param obj The value to be tested.
     */
    isNumeric(value: any): boolean;
    /**
     * Check to see if an object is a plain object (created using "{}" or "new Object").
     *
     * @param obj The object that will be checked to see if it's a plain object.
     */
    isPlainObject(obj: any): boolean;
    /**
     * Determine whether the argument is a window.
     *
     * @param obj Object to test whether or not it is a window.
     */
    isWindow(obj: any): boolean;
    /**
     * Check to see if a DOM node is within an XML document (or is an XML document).
     *
     * @param node he DOM node that will be checked to see if it's in an XML document.
     */
    isXMLDoc(node: Node): boolean;

    /**
     * Convert an array-like object into a true JavaScript array.
     * 
     * @param obj Any object to turn into a native Array.
     */
    makeArray(obj: any): any[];

    /**
     * Translate all items in an array or object to new array of items.
     * 
     * @param array The Array to translate.
     * @param callback The function to process each item against. The first argument to the function is the array item, the second argument is the index in array The function can return any value. Within the function, this refers to the global (window) object.
     */
    map<T, U>(array: T[], callback: (elementOfArray: T, indexInArray: number) => U): U[];
    /**
     * Translate all items in an array or object to new array of items.
     * 
     * @param arrayOrObject The Array or Object to translate.
     * @param callback The function to process each item against. The first argument to the function is the value; the second argument is the index or key of the array or object property. The function can return any value to add to the array. A returned array will be flattened into the resulting array. Within the function, this refers to the global (window) object.
     */
    map(arrayOrObject: any, callback: (value: any, indexOrKey: any) => any): any;

    /**
     * Merge the contents of two arrays together into the first array.
     * 
     * @param first The first array to merge, the elements of second added.
     * @param second The second array to merge into the first, unaltered.
     */
    merge<T>(first: T[], second: T[]): T[];

    /**
     * An empty function.
     */
    noop(): any;

    /**
     * Return a number representing the current time.
     */
    now(): number;

    /**
     * Takes a well-formed JSON string and returns the resulting JavaScript object.
     * 
     * @param json The JSON string to parse.
     */
    parseJSON(json: string): any;

    /**
     * Parses a string into an XML document.
     *
     * @param data a well-formed XML string to be parsed
     */
    parseXML(data: string): XMLDocument;

    /**
     * Remove the whitespace from the beginning and end of a string.
     * 
     * @param str Remove the whitespace from the beginning and end of a string.
     */
    trim(str: string): string;

    /**
     * Determine the internal JavaScript [[Class]] of an object.
     * 
     * @param obj Object to get the internal JavaScript [[Class]] of.
     */
    type(obj: any): string;

    /**
     * Sorts an array of DOM elements, in place, with the duplicates removed. Note that this only works on arrays of DOM elements, not strings or numbers.
     * 
     * @param array The Array of DOM elements.
     */
    unique(array: Element[]): Element[];

    /**
     * Parses a string into an array of DOM nodes.
     *
     * @param data HTML string to be parsed
     * @param context DOM element to serve as the context in which the HTML fragment will be created
     * @param keepScripts A Boolean indicating whether to include scripts passed in the HTML string
     */
    parseHTML(data: string, context?: HTMLElement, keepScripts?: boolean): any[];

    /**
     * Parses a string into an array of DOM nodes.
     *
     * @param data HTML string to be parsed
     * @param context DOM element to serve as the context in which the HTML fragment will be created
     * @param keepScripts A Boolean indicating whether to include scripts passed in the HTML string
     */
    parseHTML(data: string, context?: Document, keepScripts?: boolean): any[];
}

/**
 * The jQuery instance members
 */
interface JQuery {
    /**
     * Register a handler to be called when Ajax requests complete. This is an AjaxEvent.
     *
     * @param handler The function to be invoked.
     */
    ajaxComplete(handler: (event: JQueryEventObject, XMLHttpRequest: XMLHttpRequest, ajaxOptions: any) => any): JQuery;
    /**
     * Register a handler to be called when Ajax requests complete with an error. This is an Ajax Event.
     *
     * @param handler The function to be invoked.
     */
    ajaxError(handler: (event: JQueryEventObject, jqXHR: JQueryXHR, ajaxSettings: JQueryAjaxSettings, thrownError: any) => any): JQuery;
    /**
     * Attach a function to be executed before an Ajax request is sent. This is an Ajax Event.
     *
     * @param handler The function to be invoked.
     */
    ajaxSend(handler: (event: JQueryEventObject, jqXHR: JQueryXHR, ajaxOptions: JQueryAjaxSettings) => any): JQuery;
    /**
     * Register a handler to be called when the first Ajax request begins. This is an Ajax Event.
     *
     * @param handler The function to be invoked.
     */
    ajaxStart(handler: () => any): JQuery;
    /**
     * Register a handler to be called when all Ajax requests have completed. This is an Ajax Event.
     *
     * @param handler The function to be invoked.
     */
    ajaxStop(handler: () => any): JQuery;
    /**
     * Attach a function to be executed whenever an Ajax request completes successfully. This is an Ajax Event.
     *
     * @param handler The function to be invoked.
     */
    ajaxSuccess(handler: (event: JQueryEventObject, XMLHttpRequest: XMLHttpRequest, ajaxOptions: JQueryAjaxSettings) => any): JQuery;

    /**
     * Load data from the server and place the returned HTML into the matched element.
     *
     * @param url A string containing the URL to which the request is sent.
     * @param data A plain object or string that is sent to the server with the request.
     * @param complete A callback function that is executed when the request completes.
     */
    load(url: string, data?: string|Object, complete?: (responseText: string, textStatus: string, XMLHttpRequest: XMLHttpRequest) => any): JQuery;

    /**
     * Encode a set of form elements as a string for submission.
     */
    serialize(): string;
    /**
     * Encode a set of form elements as an array of names and values.
     */
    serializeArray(): JQuerySerializeArrayElement[];

    /**
     * Adds the specified class(es) to each of the set of matched elements.
     *
     * @param className One or more space-separated classes to be added to the class attribute of each matched element.
     */
    addClass(className: string): JQuery;
    /**
     * Adds the specified class(es) to each of the set of matched elements.
     *
     * @param function A function returning one or more space-separated class names to be added to the existing class name(s). Receives the index position of the element in the set and the existing class name(s) as arguments. Within the function, this refers to the current element in the set.
     */
    addClass(func: (index: number, className: string) => string): JQuery;

    /**
     * Add the previous set of elements on the stack to the current set, optionally filtered by a selector.
     */
    addBack(selector?: string): JQuery;

    /**
     * Get the value of an attribute for the first element in the set of matched elements.
     *
     * @param attributeName The name of the attribute to get.
     */
    attr(attributeName: string): string;
    /**
     * Set one or more attributes for the set of matched elements.
     *
     * @param attributeName The name of the attribute to set.
     * @param value A value to set for the attribute.
     */
    attr(attributeName: string, value: string|number): JQuery;
    /**
     * Set one or more attributes for the set of matched elements.
     *
     * @param attributeName The name of the attribute to set.
     * @param func A function returning the value to set. this is the current element. Receives the index position of the element in the set and the old attribute value as arguments.
     */
    attr(attributeName: string, func: (index: number, attr: string) => string|number): JQuery;
    /**
     * Set one or more attributes for the set of matched elements.
     *
     * @param attributes An object of attribute-value pairs to set.
     */
    attr(attributes: Object): JQuery;
    
    /**
     * Determine whether any of the matched elements are assigned the given class.
     *
     * @param className The class name to search for.
     */
    hasClass(className: string): boolean;

    /**
     * Get the HTML contents of the first element in the set of matched elements.
     */
    html(): string;
    /**
     * Set the HTML contents of each element in the set of matched elements.
     *
     * @param htmlString A string of HTML to set as the content of each matched element.
     */
    html(htmlString: string): JQuery;
    /**
     * Set the HTML contents of each element in the set of matched elements.
     *
     * @param func A function returning the HTML content to set. Receives the index position of the element in the set and the old HTML value as arguments. jQuery empties the element before calling the function; use the oldhtml argument to reference the previous content. Within the function, this refers to the current element in the set.
     */
    html(func: (index: number, oldhtml: string) => string): JQuery;
    /**
     * Set the HTML contents of each element in the set of matched elements.
     *
     * @param func A function returning the HTML content to set. Receives the index position of the element in the set and the old HTML value as arguments. jQuery empties the element before calling the function; use the oldhtml argument to reference the previous content. Within the function, this refers to the current element in the set.
     */

    /**
     * Get the value of a property for the first element in the set of matched elements.
     *
     * @param propertyName The name of the property to get.
     */
    prop(propertyName: string): any;
    /**
     * Set one or more properties for the set of matched elements.
     *
     * @param propertyName The name of the property to set.
     * @param value A value to set for the property.
     */
    prop(propertyName: string, value: string|number|boolean): JQuery;
    /**
     * Set one or more properties for the set of matched elements.
     *
     * @param properties An object of property-value pairs to set.
     */
    prop(properties: Object): JQuery;
    /**
     * Set one or more properties for the set of matched elements.
     *
     * @param propertyName The name of the property to set.
     * @param func A function returning the value to set. Receives the index position of the element in the set and the old property value as arguments. Within the function, the keyword this refers to the current element.
     */
    prop(propertyName: string, func: (index: number, oldPropertyValue: any) => any): JQuery;

    /**
     * Remove an attribute from each element in the set of matched elements.
     *
     * @param attributeName An attribute to remove; as of version 1.7, it can be a space-separated list of attributes.
     */
    removeAttr(attributeName: string): JQuery;

    /**
     * Remove a single class, multiple classes, or all classes from each element in the set of matched elements.
     *
     * @param className One or more space-separated classes to be removed from the class attribute of each matched element.
     */
    removeClass(className?: string): JQuery;
    /**
     * Remove a single class, multiple classes, or all classes from each element in the set of matched elements.
     *
     * @param function A function returning one or more space-separated class names to be removed. Receives the index position of the element in the set and the old class value as arguments.
     */
    removeClass(func: (index: number, className: string) => string): JQuery;

    /**
     * Remove a property for the set of matched elements.
     *
     * @param propertyName The name of the property to remove.
     */
    removeProp(propertyName: string): JQuery;

    /**
     * Add or remove one or more classes from each element in the set of matched elements, depending on either the class's presence or the value of the switch argument.
     *
     * @param className One or more class names (separated by spaces) to be toggled for each element in the matched set.
     * @param swtch A Boolean (not just truthy/falsy) value to determine whether the class should be added or removed.
     */
    toggleClass(className: string, swtch?: boolean): JQuery;
    /**
     * Add or remove one or more classes from each element in the set of matched elements, depending on either the class's presence or the value of the switch argument.
     *
     * @param swtch A boolean value to determine whether the class should be added or removed.
     */
    toggleClass(swtch?: boolean): JQuery;
    /**
     * Add or remove one or more classes from each element in the set of matched elements, depending on either the class's presence or the value of the switch argument.
     *
     * @param func A function that returns class names to be toggled in the class attribute of each element in the matched set. Receives the index position of the element in the set, the old class value, and the switch as arguments.
     * @param swtch A boolean value to determine whether the class should be added or removed.
     */
    toggleClass(func: (index: number, className: string, swtch: boolean) => string, swtch?: boolean): JQuery;

    /**
     * Get the current value of the first element in the set of matched elements.
     */
    val(): any;
    /**
     * Set the value of each element in the set of matched elements.
     *
     * @param value A string of text or an array of strings corresponding to the value of each matched element to set as selected/checked.
     */
    val(value: string|string[]): JQuery;
    /**
     * Set the value of each element in the set of matched elements.
     *
     * @param func A function returning the value to set. this is the current element. Receives the index position of the element in the set and the old value as arguments.
     */
    val(func: (index: number, value: string) => string): JQuery;


    /**
     * Get the value of style properties for the first element in the set of matched elements.
     *
     * @param propertyName A CSS property.
     */
    css(propertyName: string): string;
    /**
     * Set one or more CSS properties for the set of matched elements.
     *
     * @param propertyName A CSS property name.
     * @param value A value to set for the property.
     */
    css(propertyName: string, value: string|number): JQuery;
    /**
     * Set one or more CSS properties for the set of matched elements.
     *
     * @param propertyName A CSS property name.
     * @param value A function returning the value to set. this is the current element. Receives the index position of the element in the set and the old value as arguments.
     */
    css(propertyName: string, value: (index: number, value: string) => string|number): JQuery;
    /**
     * Set one or more CSS properties for the set of matched elements.
     *
     * @param properties An object of property-value pairs to set.
     */
    css(properties: Object): JQuery;

    /**
     * Get the current computed height for the first element in the set of matched elements.
     */
    height(): number;
    /**
     * Set the CSS height of every matched element.
     *
     * @param value An integer representing the number of pixels, or an integer with an optional unit of measure appended (as a string).
     */
    height(value: number|string): JQuery;
    /**
     * Set the CSS height of every matched element.
     *
     * @param func A function returning the height to set. Receives the index position of the element in the set and the old height as arguments. Within the function, this refers to the current element in the set.
     */
    height(func: (index: number, height: number) => number|string): JQuery;

    /**
     * Get the current computed height for the first element in the set of matched elements, including padding but not border.
     */
    innerHeight(): number;

    /**
     * Sets the inner height on elements in the set of matched elements, including padding but not border.
     *
     * @param value An integer representing the number of pixels, or an integer along with an optional unit of measure appended (as a string).
     */
    innerHeight(height: number|string): JQuery;
    
    /**
     * Get the current computed width for the first element in the set of matched elements, including padding but not border.
     */
    innerWidth(): number;

    /**
     * Sets the inner width on elements in the set of matched elements, including padding but not border.
     *
     * @param value An integer representing the number of pixels, or an integer along with an optional unit of measure appended (as a string).
     */
    innerWidth(width: number|string): JQuery;
    
    /**
     * Get the current coordinates of the first element in the set of matched elements, relative to the document.
     */
    offset(): JQueryCoordinates;
    /**
     * An object containing the properties top and left, which are integers indicating the new top and left coordinates for the elements.
     *
     * @param coordinates An object containing the properties top and left, which are integers indicating the new top and left coordinates for the elements.
     */
    offset(coordinates: JQueryCoordinates): JQuery;
    /**
     * An object containing the properties top and left, which are integers indicating the new top and left coordinates for the elements.
     *
     * @param func A function to return the coordinates to set. Receives the index of the element in the collection as the first argument and the current coordinates as the second argument. The function should return an object with the new top and left properties.
     */
    offset(func: (index: number, coords: JQueryCoordinates) => JQueryCoordinates): JQuery;

    /**
     * Get the current computed height for the first element in the set of matched elements, including padding, border, and optionally margin. Returns an integer (without "px") representation of the value or null if called on an empty set of elements.
     *
     * @param includeMargin A Boolean indicating whether to include the element's margin in the calculation.
     */
    outerHeight(includeMargin?: boolean): number;

    /**
     * Sets the outer height on elements in the set of matched elements, including padding and border.
     *
     * @param value An integer representing the number of pixels, or an integer along with an optional unit of measure appended (as a string).
     */
    outerHeight(height: number|string): JQuery;

    /**
     * Get the current computed width for the first element in the set of matched elements, including padding and border.
     *
     * @param includeMargin A Boolean indicating whether to include the element's margin in the calculation.
     */
    outerWidth(includeMargin?: boolean): number;

    /**
     * Sets the outer width on elements in the set of matched elements, including padding and border.
     *
     * @param value An integer representing the number of pixels, or an integer along with an optional unit of measure appended (as a string).
     */
    outerWidth(width: number|string): JQuery;

    /**
     * Get the current coordinates of the first element in the set of matched elements, relative to the offset parent.
     */
    position(): JQueryCoordinates;

    /**
     * Get the current horizontal position of the scroll bar for the first element in the set of matched elements or set the horizontal position of the scroll bar for every matched element.
     */
    scrollLeft(): number;
    /**
     * Set the current horizontal position of the scroll bar for each of the set of matched elements.
     *
     * @param value An integer indicating the new position to set the scroll bar to.
     */
    scrollLeft(value: number): JQuery;

    /**
     * Get the current vertical position of the scroll bar for the first element in the set of matched elements or set the vertical position of the scroll bar for every matched element.
     */
    scrollTop(): number;
    /**
     * Set the current vertical position of the scroll bar for each of the set of matched elements.
     *
     * @param value An integer indicating the new position to set the scroll bar to.
     */
    scrollTop(value: number): JQuery;

    /**
     * Get the current computed width for the first element in the set of matched elements.
     */
    width(): number;
    /**
     * Set the CSS width of each element in the set of matched elements.
     *
     * @param value An integer representing the number of pixels, or an integer along with an optional unit of measure appended (as a string).
     */
    width(value: number|string): JQuery;
    /**
     * Set the CSS width of each element in the set of matched elements.
     *
     * @param func A function returning the width to set. Receives the index position of the element in the set and the old width as arguments. Within the function, this refers to the current element in the set.
     */
    width(func: (index: number, width: number) => number|string): JQuery;

    /**
     * Remove from the queue all items that have not yet been run.
     *
     * @param queueName A string containing the name of the queue. Defaults to fx, the standard effects queue.
     */
    clearQueue(queueName?: string): JQuery;

    /**
     * Store arbitrary data associated with the matched elements.
     *
     * @param key A string naming the piece of data to set.
     * @param value The new data value; it can be any Javascript type including Array or Object.
     */
    data(key: string, value: any): JQuery;
    /**
     * Store arbitrary data associated with the matched elements.
     *
     * @param obj An object of key-value pairs of data to update.
     */
    data(obj: { [key: string]: any; }): JQuery;
    /**
     * Return the value at the named data store for the first element in the jQuery collection, as set by data(name, value) or by an HTML5 data-* attribute.
     *
     * @param key Name of the data stored.
     */
    data(key: string): any;
    /**
     * Return the value at the named data store for the first element in the jQuery collection, as set by data(name, value) or by an HTML5 data-* attribute.
     */
    data(): any;

    /**
     * Execute the next function on the queue for the matched elements.
     *
     * @param queueName A string containing the name of the queue. Defaults to fx, the standard effects queue.
     */
    dequeue(queueName?: string): JQuery;

    /**
     * Remove a previously-stored piece of data.
     *
     * @param name A string naming the piece of data to delete or space-separated string naming the pieces of data to delete.
     */
    removeData(name: string): JQuery;
    /**
     * Remove a previously-stored piece of data.
     *
     * @param list An array of strings naming the pieces of data to delete.
     */
    removeData(list: string[]): JQuery;

    /**
     * Return a Promise object to observe when all actions of a certain type bound to the collection, queued or not, have finished.
     *
     * @param type The type of queue that needs to be observed. (default: fx)
     * @param target Object onto which the promise methods have to be attached
     */
    promise(type?: string, target?: Object): JQueryPromise<any>;

    /**
     * Perform a custom animation of a set of CSS properties.
     *
     * @param properties An object of CSS properties and values that the animation will move toward.
     * @param duration A string or number determining how long the animation will run.
     * @param complete A function to call once the animation is complete.
     */
    animate(properties: Object, duration?: string|number, complete?: Function): JQuery;
    /**
     * Perform a custom animation of a set of CSS properties.
     *
     * @param properties An object of CSS properties and values that the animation will move toward.
     * @param duration A string or number determining how long the animation will run.
     * @param easing A string indicating which easing function to use for the transition. (default: swing)
     * @param complete A function to call once the animation is complete.
     */
    animate(properties: Object, duration?: string|number, easing?: string, complete?: Function): JQuery;
    /**
     * Perform a custom animation of a set of CSS properties.
     *
     * @param properties An object of CSS properties and values that the animation will move toward.
     * @param options A map of additional options to pass to the method.
     */
    animate(properties: Object, options: JQueryAnimationOptions): JQuery;

    /**
     * Set a timer to delay execution of subsequent items in the queue.
     *
     * @param duration An integer indicating the number of milliseconds to delay execution of the next item in the queue.
     * @param queueName A string containing the name of the queue. Defaults to fx, the standard effects queue.
     */
    delay(duration: number, queueName?: string): JQuery;

    /**
     * Display the matched elements by fading them to opaque.
     *
     * @param duration A string or number determining how long the animation will run.
     * @param complete A function to call once the animation is complete.
     */
    fadeIn(duration?: number|string, complete?: Function): JQuery;
    /**
     * Display the matched elements by fading them to opaque.
     *
     * @param duration A string or number determining how long the animation will run.
     * @param easing A string indicating which easing function to use for the transition.
     * @param complete A function to call once the animation is complete.
     */
    fadeIn(duration?: number|string, easing?: string, complete?: Function): JQuery;
    /**
     * Display the matched elements by fading them to opaque.
     *
     * @param options A map of additional options to pass to the method.
     */
    fadeIn(options: JQueryAnimationOptions): JQuery;

    /**
     * Hide the matched elements by fading them to transparent.
     *
     * @param duration A string or number determining how long the animation will run.
     * @param complete A function to call once the animation is complete.
     */
    fadeOut(duration?: number|string, complete?: Function): JQuery;
    /**
     * Hide the matched elements by fading them to transparent.
     *
     * @param duration A string or number determining how long the animation will run.
     * @param easing A string indicating which easing function to use for the transition.
     * @param complete A function to call once the animation is complete.
     */
    fadeOut(duration?: number|string, easing?: string, complete?: Function): JQuery;
    /**
     * Hide the matched elements by fading them to transparent.
     *
     * @param options A map of additional options to pass to the method.
     */
    fadeOut(options: JQueryAnimationOptions): JQuery;

    /**
     * Adjust the opacity of the matched elements.
     *
     * @param duration A string or number determining how long the animation will run.
     * @param opacity A number between 0 and 1 denoting the target opacity.
     * @param complete A function to call once the animation is complete.
     */
    fadeTo(duration: string|number, opacity: number, complete?: Function): JQuery;
    /**
     * Adjust the opacity of the matched elements.
     *
     * @param duration A string or number determining how long the animation will run.
     * @param opacity A number between 0 and 1 denoting the target opacity.
     * @param easing A string indicating which easing function to use for the transition.
     * @param complete A function to call once the animation is complete.
     */
    fadeTo(duration: string|number, opacity: number, easing?: string, complete?: Function): JQuery;

    /**
     * Display or hide the matched elements by animating their opacity.
     *
     * @param duration A string or number determining how long the animation will run.
     * @param complete A function to call once the animation is complete.
     */
    fadeToggle(duration?: number|string, complete?: Function): JQuery;
    /**
     * Display or hide the matched elements by animating their opacity.
     *
     * @param duration A string or number determining how long the animation will run.
     * @param easing A string indicating which easing function to use for the transition.
     * @param complete A function to call once the animation is complete.
     */
    fadeToggle(duration?: number|string, easing?: string, complete?: Function): JQuery;
    /**
     * Display or hide the matched elements by animating their opacity.
     *
     * @param options A map of additional options to pass to the method.
     */
    fadeToggle(options: JQueryAnimationOptions): JQuery;

    /**
     * Stop the currently-running animation, remove all queued animations, and complete all animations for the matched elements.
     *
     * @param queue The name of the queue in which to stop animations.
     */
    finish(queue?: string): JQuery;

    /**
     * Hide the matched elements.
     *
     * @param duration A string or number determining how long the animation will run.
     * @param complete A function to call once the animation is complete.
     */
    hide(duration?: number|string, complete?: Function): JQuery;
    /**
     * Hide the matched elements.
     *
     * @param duration A string or number determining how long the animation will run.
     * @param easing A string indicating which easing function to use for the transition.
     * @param complete A function to call once the animation is complete.
     */
    hide(duration?: number|string, easing?: string, complete?: Function): JQuery;
    /**
     * Hide the matched elements.
     *
     * @param options A map of additional options to pass to the method.
     */
    hide(options: JQueryAnimationOptions): JQuery;

    /**
     * Display the matched elements.
     *
     * @param duration A string or number determining how long the animation will run.
     * @param complete A function to call once the animation is complete.
     */
    show(duration?: number|string, complete?: Function): JQuery;
    /**
     * Display the matched elements.
     *
     * @param duration A string or number determining how long the animation will run.
     * @param easing A string indicating which easing function to use for the transition.
     * @param complete A function to call once the animation is complete.
     */
    show(duration?: number|string, easing?: string, complete?: Function): JQuery;
    /**
     * Display the matched elements.
     *
     * @param options A map of additional options to pass to the method.
     */
    show(options: JQueryAnimationOptions): JQuery;

    /**
     * Display the matched elements with a sliding motion.
     *
     * @param duration A string or number determining how long the animation will run.
     * @param complete A function to call once the animation is complete.
     */
    slideDown(duration?: number|string, complete?: Function): JQuery;
    /**
     * Display the matched elements with a sliding motion.
     *
     * @param duration A string or number determining how long the animation will run.
     * @param easing A string indicating which easing function to use for the transition.
     * @param complete A function to call once the animation is complete.
     */
    slideDown(duration?: number|string, easing?: string, complete?: Function): JQuery;
    /**
     * Display the matched elements with a sliding motion.
     *
     * @param options A map of additional options to pass to the method.
     */
    slideDown(options: JQueryAnimationOptions): JQuery;

    /**
     * Display or hide the matched elements with a sliding motion.
     *
     * @param duration A string or number determining how long the animation will run.
     * @param complete A function to call once the animation is complete.
     */
    slideToggle(duration?: number|string, complete?: Function): JQuery;
    /**
     * Display or hide the matched elements with a sliding motion.
     *
     * @param duration A string or number determining how long the animation will run.
     * @param easing A string indicating which easing function to use for the transition.
     * @param complete A function to call once the animation is complete.
     */
    slideToggle(duration?: number|string, easing?: string, complete?: Function): JQuery;
    /**
     * Display or hide the matched elements with a sliding motion.
     *
     * @param options A map of additional options to pass to the method.
     */
    slideToggle(options: JQueryAnimationOptions): JQuery;

    /**
     * Hide the matched elements with a sliding motion.
     *
     * @param duration A string or number determining how long the animation will run.
     * @param complete A function to call once the animation is complete.
     */
    slideUp(duration?: number|string, complete?: Function): JQuery;
    /**
     * Hide the matched elements with a sliding motion.
     *
     * @param duration A string or number determining how long the animation will run.
     * @param easing A string indicating which easing function to use for the transition.
     * @param complete A function to call once the animation is complete.
     */
    slideUp(duration?: number|string, easing?: string, complete?: Function): JQuery;
    /**
     * Hide the matched elements with a sliding motion.
     *
     * @param options A map of additional options to pass to the method.
     */
    slideUp(options: JQueryAnimationOptions): JQuery;

    /**
     * Stop the currently-running animation on the matched elements.
     *
     * @param clearQueue A Boolean indicating whether to remove queued animation as well. Defaults to false.
     * @param jumpToEnd A Boolean indicating whether to complete the current animation immediately. Defaults to false.
     */
    stop(clearQueue?: boolean, jumpToEnd?: boolean): JQuery;
    /**
     * Stop the currently-running animation on the matched elements.
     *
     * @param queue The name of the queue in which to stop animations.
     * @param clearQueue A Boolean indicating whether to remove queued animation as well. Defaults to false.
     * @param jumpToEnd A Boolean indicating whether to complete the current animation immediately. Defaults to false.
     */
    stop(queue?: string, clearQueue?: boolean, jumpToEnd?: boolean): JQuery;

    /**
     * Display or hide the matched elements.
     *
     * @param duration A string or number determining how long the animation will run.
     * @param complete A function to call once the animation is complete.
     */
    toggle(duration?: number|string, complete?: Function): JQuery;
    /**
     * Display or hide the matched elements.
     *
     * @param duration A string or number determining how long the animation will run.
     * @param easing A string indicating which easing function to use for the transition.
     * @param complete A function to call once the animation is complete.
     */
    toggle(duration?: number|string, easing?: string, complete?: Function): JQuery;
    /**
     * Display or hide the matched elements.
     *
     * @param options A map of additional options to pass to the method.
     */
    toggle(options: JQueryAnimationOptions): JQuery;
    /**
     * Display or hide the matched elements.
     *
     * @param showOrHide A Boolean indicating whether to show or hide the elements.
     */
    toggle(showOrHide: boolean): JQuery;

    /**
     * Attach a handler to an event for the elements.
     * 
     * @param eventType A string containing one or more DOM event types, such as "click" or "submit," or custom event names.
     * @param eventData An object containing data that will be passed to the event handler.
     * @param handler A function to execute each time the event is triggered.
     */
    bind(eventType: string, eventData: any, handler: (eventObject: JQueryEventObject) => any): JQuery;
    /**
     * Attach a handler to an event for the elements.
     * 
     * @param eventType A string containing one or more DOM event types, such as "click" or "submit," or custom event names.
     * @param handler A function to execute each time the event is triggered.
     */
    bind(eventType: string, handler: (eventObject: JQueryEventObject) => any): JQuery;
    /**
     * Attach a handler to an event for the elements.
     * 
     * @param eventType A string containing one or more DOM event types, such as "click" or "submit," or custom event names.
     * @param eventData An object containing data that will be passed to the event handler.
     * @param preventBubble Setting the third argument to false will attach a function that prevents the default action from occurring and stops the event from bubbling. The default is true.
     */
    bind(eventType: string, eventData: any, preventBubble: boolean): JQuery;
    /**
     * Attach a handler to an event for the elements.
     * 
     * @param eventType A string containing one or more DOM event types, such as "click" or "submit," or custom event names.
     * @param preventBubble Setting the third argument to false will attach a function that prevents the default action from occurring and stops the event from bubbling. The default is true.
     */
    bind(eventType: string, preventBubble: boolean): JQuery;
    /**
     * Attach a handler to an event for the elements.
     * 
     * @param events An object containing one or more DOM event types and functions to execute for them.
     */
    bind(events: any): JQuery;

    /**
     * Trigger the "blur" event on an element
     */
    blur(): JQuery;
    /**
     * Bind an event handler to the "blur" JavaScript event
     *
     * @param handler A function to execute each time the event is triggered.
     */
    blur(handler: (eventObject: JQueryEventObject) => any): JQuery;
    /**
     * Bind an event handler to the "blur" JavaScript event
     *
     * @param eventData An object containing data that will be passed to the event handler.
     * @param handler A function to execute each time the event is triggered.
     */
    blur(eventData?: any, handler?: (eventObject: JQueryEventObject) => any): JQuery;

    /**
     * Trigger the "change" event on an element.
     */
    change(): JQuery;
    /**
     * Bind an event handler to the "change" JavaScript event
     *
     * @param handler A function to execute each time the event is triggered.
     */
    change(handler: (eventObject: JQueryEventObject) => any): JQuery;
    /**
     * Bind an event handler to the "change" JavaScript event
     *
     * @param eventData An object containing data that will be passed to the event handler.
     * @param handler A function to execute each time the event is triggered.
     */
    change(eventData?: any, handler?: (eventObject: JQueryEventObject) => any): JQuery;

    /**
     * Trigger the "click" event on an element.
     */
    click(): JQuery;
    /**
     * Bind an event handler to the "click" JavaScript event
     *
     * @param eventData An object containing data that will be passed to the event handler.
     */
    click(handler: (eventObject: JQueryEventObject) => any): JQuery;
    /**
     * Bind an event handler to the "click" JavaScript event
     *
     * @param eventData An object containing data that will be passed to the event handler.
     * @param handler A function to execute each time the event is triggered.
     */
    click(eventData?: any, handler?: (eventObject: JQueryEventObject) => any): JQuery;

    /**
     * Trigger the "dblclick" event on an element.
     */
    dblclick(): JQuery;
    /**
     * Bind an event handler to the "dblclick" JavaScript event
     *
     * @param handler A function to execute each time the event is triggered.
     */
    dblclick(handler: (eventObject: JQueryEventObject) => any): JQuery;
    /**
     * Bind an event handler to the "dblclick" JavaScript event
     *
     * @param eventData An object containing data that will be passed to the event handler.
     * @param handler A function to execute each time the event is triggered.
     */
    dblclick(eventData?: any, handler?: (eventObject: JQueryEventObject) => any): JQuery;

    delegate(selector: any, eventType: string, handler: (eventObject: JQueryEventObject) => any): JQuery;
    delegate(selector: any, eventType: string, eventData: any, handler: (eventObject: JQueryEventObject) => any): JQuery;

    /**
     * Trigger the "focus" event on an element.
     */
    focus(): JQuery;
    /**
     * Bind an event handler to the "focus" JavaScript event
     *
     * @param handler A function to execute each time the event is triggered.
     */
    focus(handler: (eventObject: JQueryEventObject) => any): JQuery;
    /**
     * Bind an event handler to the "focus" JavaScript event
     *
     * @param eventData An object containing data that will be passed to the event handler.
     * @param handler A function to execute each time the event is triggered.
     */
    focus(eventData?: any, handler?: (eventObject: JQueryEventObject) => any): JQuery;

    /**
     * Bind an event handler to the "focusin" JavaScript event
     *
     * @param handler A function to execute each time the event is triggered.
     */
    focusin(handler: (eventObject: JQueryEventObject) => any): JQuery;
    /**
     * Bind an event handler to the "focusin" JavaScript event
     *
     * @param eventData An object containing data that will be passed to the event handler.
     * @param handler A function to execute each time the event is triggered.
     */
    focusin(eventData: Object, handler: (eventObject: JQueryEventObject) => any): JQuery;

    /**
     * Bind an event handler to the "focusout" JavaScript event
     *
     * @param handler A function to execute each time the event is triggered.
     */
    focusout(handler: (eventObject: JQueryEventObject) => any): JQuery;
    /**
     * Bind an event handler to the "focusout" JavaScript event
     *
     * @param eventData An object containing data that will be passed to the event handler.
     * @param handler A function to execute each time the event is triggered.
     */
    focusout(eventData: Object, handler: (eventObject: JQueryEventObject) => any): JQuery;

    /**
     * Bind two handlers to the matched elements, to be executed when the mouse pointer enters and leaves the elements.
     *
     * @param handlerIn A function to execute when the mouse pointer enters the element.
     * @param handlerOut A function to execute when the mouse pointer leaves the element.
     */
    hover(handlerIn: (eventObject: JQueryEventObject) => any, handlerOut: (eventObject: JQueryEventObject) => any): JQuery;
    /**
     * Bind a single handler to the matched elements, to be executed when the mouse pointer enters or leaves the elements.
     *
     * @param handlerInOut A function to execute when the mouse pointer enters or leaves the element.
     */
    hover(handlerInOut: (eventObject: JQueryEventObject) => any): JQuery;

    /**
     * Trigger the "keydown" event on an element.
     */
    keydown(): JQuery;
    /**
     * Bind an event handler to the "keydown" JavaScript event
     *
     * @param handler A function to execute each time the event is triggered.
     */
    keydown(handler: (eventObject: JQueryKeyEventObject) => any): JQuery;
    /**
     * Bind an event handler to the "keydown" JavaScript event
     *
     * @param eventData An object containing data that will be passed to the event handler.
     * @param handler A function to execute each time the event is triggered.
     */
    keydown(eventData?: any, handler?: (eventObject: JQueryKeyEventObject) => any): JQuery;

    /**
     * Trigger the "keypress" event on an element.
     */
    keypress(): JQuery;
    /**
     * Bind an event handler to the "keypress" JavaScript event
     *
     * @param handler A function to execute each time the event is triggered.
     */
    keypress(handler: (eventObject: JQueryKeyEventObject) => any): JQuery;
    /**
     * Bind an event handler to the "keypress" JavaScript event
     *
     * @param eventData An object containing data that will be passed to the event handler.
     * @param handler A function to execute each time the event is triggered.
     */
    keypress(eventData?: any, handler?: (eventObject: JQueryKeyEventObject) => any): JQuery;

    /**
     * Trigger the "keyup" event on an element.
     */
    keyup(): JQuery;
    /**
     * Bind an event handler to the "keyup" JavaScript event
     *
     * @param handler A function to execute each time the event is triggered.
     */
    keyup(handler: (eventObject: JQueryKeyEventObject) => any): JQuery;
    /**
     * Bind an event handler to the "keyup" JavaScript event
     *
     * @param eventData An object containing data that will be passed to the event handler.
     * @param handler A function to execute each time the event is triggered.
     */
    keyup(eventData?: any, handler?: (eventObject: JQueryKeyEventObject) => any): JQuery;

    /**
     * Bind an event handler to the "load" JavaScript event.
     *
     * @param handler A function to execute when the event is triggered.
     */
    load(handler: (eventObject: JQueryEventObject) => any): JQuery;
    /**
     * Bind an event handler to the "load" JavaScript event.
     *
     * @param eventData An object containing data that will be passed to the event handler.
     * @param handler A function to execute when the event is triggered.
     */
    load(eventData?: any, handler?: (eventObject: JQueryEventObject) => any): JQuery;

    /**
     * Trigger the "mousedown" event on an element.
     */
    mousedown(): JQuery;
    /**
     * Bind an event handler to the "mousedown" JavaScript event.
     *
     * @param handler A function to execute when the event is triggered.
     */
    mousedown(handler: (eventObject: JQueryMouseEventObject) => any): JQuery;
    /**
     * Bind an event handler to the "mousedown" JavaScript event.
     *
     * @param eventData An object containing data that will be passed to the event handler.
     * @param handler A function to execute when the event is triggered.
     */
    mousedown(eventData: Object, handler: (eventObject: JQueryMouseEventObject) => any): JQuery;

    /**
     * Trigger the "mouseenter" event on an element.
     */
    mouseenter(): JQuery;
    /**
     * Bind an event handler to be fired when the mouse enters an element.
     *
     * @param handler A function to execute when the event is triggered.
     */
    mouseenter(handler: (eventObject: JQueryMouseEventObject) => any): JQuery;
    /**
     * Bind an event handler to be fired when the mouse enters an element.
     *
     * @param eventData An object containing data that will be passed to the event handler.
     * @param handler A function to execute when the event is triggered.
     */
    mouseenter(eventData: Object, handler: (eventObject: JQueryMouseEventObject) => any): JQuery;

    /**
     * Trigger the "mouseleave" event on an element.
     */
    mouseleave(): JQuery;
    /**
     * Bind an event handler to be fired when the mouse leaves an element.
     *
     * @param handler A function to execute when the event is triggered.
     */
    mouseleave(handler: (eventObject: JQueryMouseEventObject) => any): JQuery;
    /**
     * Bind an event handler to be fired when the mouse leaves an element.
     *
     * @param eventData An object containing data that will be passed to the event handler.
     * @param handler A function to execute when the event is triggered.
     */
    mouseleave(eventData: Object, handler: (eventObject: JQueryMouseEventObject) => any): JQuery;

    /**
     * Trigger the "mousemove" event on an element.
     */
    mousemove(): JQuery;
    /**
     * Bind an event handler to the "mousemove" JavaScript event.
     *
     * @param handler A function to execute when the event is triggered.
     */
    mousemove(handler: (eventObject: JQueryMouseEventObject) => any): JQuery;
    /**
     * Bind an event handler to the "mousemove" JavaScript event.
     *
     * @param eventData An object containing data that will be passed to the event handler.
     * @param handler A function to execute when the event is triggered.
     */
    mousemove(eventData: Object, handler: (eventObject: JQueryMouseEventObject) => any): JQuery;

    /**
     * Trigger the "mouseout" event on an element.
     */
    mouseout(): JQuery;
    /**
     * Bind an event handler to the "mouseout" JavaScript event.
     *
     * @param handler A function to execute when the event is triggered.
     */
    mouseout(handler: (eventObject: JQueryMouseEventObject) => any): JQuery;
    /**
     * Bind an event handler to the "mouseout" JavaScript event.
     *
     * @param eventData An object containing data that will be passed to the event handler.
     * @param handler A function to execute when the event is triggered.
     */
    mouseout(eventData: Object, handler: (eventObject: JQueryMouseEventObject) => any): JQuery;

    /**
     * Trigger the "mouseover" event on an element.
     */
    mouseover(): JQuery;
    /**
     * Bind an event handler to the "mouseover" JavaScript event.
     *
     * @param handler A function to execute when the event is triggered.
     */
    mouseover(handler: (eventObject: JQueryMouseEventObject) => any): JQuery;
    /**
     * Bind an event handler to the "mouseover" JavaScript event.
     *
     * @param eventData An object containing data that will be passed to the event handler.
     * @param handler A function to execute when the event is triggered.
     */
    mouseover(eventData: Object, handler: (eventObject: JQueryMouseEventObject) => any): JQuery;

    /**
     * Trigger the "mouseup" event on an element.
     */
    mouseup(): JQuery;
    /**
     * Bind an event handler to the "mouseup" JavaScript event.
     *
     * @param handler A function to execute when the event is triggered.
     */
    mouseup(handler: (eventObject: JQueryMouseEventObject) => any): JQuery;
    /**
     * Bind an event handler to the "mouseup" JavaScript event.
     *
     * @param eventData An object containing data that will be passed to the event handler.
     * @param handler A function to execute when the event is triggered.
     */
    mouseup(eventData: Object, handler: (eventObject: JQueryMouseEventObject) => any): JQuery;

    /**
     * Remove an event handler.
     */
    off(): JQuery;
    /**
     * Remove an event handler.
     *
     * @param events One or more space-separated event types and optional namespaces, or just namespaces, such as "click", "keydown.myPlugin", or ".myPlugin".
     * @param selector A selector which should match the one originally passed to .on() when attaching event handlers.
     * @param handler A handler function previously attached for the event(s), or the special value false.
     */
    off(events: string, selector?: string, handler?: (eventObject: JQueryEventObject) => any): JQuery;
    /**
     * Remove an event handler.
     *
     * @param events One or more space-separated event types and optional namespaces, or just namespaces, such as "click", "keydown.myPlugin", or ".myPlugin".
     * @param handler A handler function previously attached for the event(s), or the special value false.
     */
    off(events: string, handler: (eventObject: JQueryEventObject) => any): JQuery;
    /**
     * Remove an event handler.
     *
     * @param events An object where the string keys represent one or more space-separated event types and optional namespaces, and the values represent handler functions previously attached for the event(s).
     * @param selector A selector which should match the one originally passed to .on() when attaching event handlers.
     */
    off(events: { [key: string]: any; }, selector?: string): JQuery;

    /**
     * Attach an event handler function for one or more events to the selected elements.
     *
     * @param events One or more space-separated event types and optional namespaces, such as "click" or "keydown.myPlugin".
     * @param handler A function to execute when the event is triggered. The value false is also allowed as a shorthand for a function that simply does return false. Rest parameter args is for optional parameters passed to jQuery.trigger(). Note that the actual parameters on the event handler function must be marked as optional (? syntax).
     */
    on(events: string, handler: (eventObject: JQueryEventObject, ...args: any[]) => any): JQuery;
    /**
     * Attach an event handler function for one or more events to the selected elements.
     *
     * @param events One or more space-separated event types and optional namespaces, such as "click" or "keydown.myPlugin".
     * @param data Data to be passed to the handler in event.data when an event is triggered.
     * @param handler A function to execute when the event is triggered. The value false is also allowed as a shorthand for a function that simply does return false.
    */
    on(events: string, data : any, handler: (eventObject: JQueryEventObject, ...args: any[]) => any): JQuery;
    /**
     * Attach an event handler function for one or more events to the selected elements.
     *
     * @param events One or more space-separated event types and optional namespaces, such as "click" or "keydown.myPlugin".
     * @param selector A selector string to filter the descendants of the selected elements that trigger the event. If the selector is null or omitted, the event is always triggered when it reaches the selected element.
     * @param handler A function to execute when the event is triggered. The value false is also allowed as a shorthand for a function that simply does return false.
     */
    on(events: string, selector: string, handler: (eventObject: JQueryEventObject, ...eventData: any[]) => any): JQuery;
    /**
     * Attach an event handler function for one or more events to the selected elements.
     *
     * @param events One or more space-separated event types and optional namespaces, such as "click" or "keydown.myPlugin".
     * @param selector A selector string to filter the descendants of the selected elements that trigger the event. If the selector is null or omitted, the event is always triggered when it reaches the selected element.
     * @param data Data to be passed to the handler in event.data when an event is triggered.
     * @param handler A function to execute when the event is triggered. The value false is also allowed as a shorthand for a function that simply does return false.
     */
    on(events: string, selector: string, data: any, handler: (eventObject: JQueryEventObject, ...eventData: any[]) => any): JQuery;
    /**
     * Attach an event handler function for one or more events to the selected elements.
     *
     * @param events An object in which the string keys represent one or more space-separated event types and optional namespaces, and the values represent a handler function to be called for the event(s).
     * @param selector A selector string to filter the descendants of the selected elements that will call the handler. If the selector is null or omitted, the handler is always called when it reaches the selected element.
     * @param data Data to be passed to the handler in event.data when an event occurs.
     */
    on(events: { [key: string]: any; }, selector?: string, data?: any): JQuery;
    /**
     * Attach an event handler function for one or more events to the selected elements.
     *
     * @param events An object in which the string keys represent one or more space-separated event types and optional namespaces, and the values represent a handler function to be called for the event(s).
     * @param data Data to be passed to the handler in event.data when an event occurs.
     */
    on(events: { [key: string]: any; }, data?: any): JQuery;

    /**
     * Attach a handler to an event for the elements. The handler is executed at most once per element per event type.
     *
     * @param events A string containing one or more JavaScript event types, such as "click" or "submit," or custom event names.
     * @param handler A function to execute at the time the event is triggered.
     */
    one(events: string, handler: (eventObject: JQueryEventObject) => any): JQuery;
    /**
     * Attach a handler to an event for the elements. The handler is executed at most once per element per event type.
     *
     * @param events A string containing one or more JavaScript event types, such as "click" or "submit," or custom event names.
     * @param data An object containing data that will be passed to the event handler.
     * @param handler A function to execute at the time the event is triggered.
     */
    one(events: string, data: Object, handler: (eventObject: JQueryEventObject) => any): JQuery;

    /**
     * Attach a handler to an event for the elements. The handler is executed at most once per element per event type.
     *
     * @param events One or more space-separated event types and optional namespaces, such as "click" or "keydown.myPlugin".
     * @param selector A selector string to filter the descendants of the selected elements that trigger the event. If the selector is null or omitted, the event is always triggered when it reaches the selected element.
     * @param handler A function to execute when the event is triggered. The value false is also allowed as a shorthand for a function that simply does return false.
     */
    one(events: string, selector: string, handler: (eventObject: JQueryEventObject) => any): JQuery;
    /**
     * Attach a handler to an event for the elements. The handler is executed at most once per element per event type.
     *
     * @param events One or more space-separated event types and optional namespaces, such as "click" or "keydown.myPlugin".
     * @param selector A selector string to filter the descendants of the selected elements that trigger the event. If the selector is null or omitted, the event is always triggered when it reaches the selected element.
     * @param data Data to be passed to the handler in event.data when an event is triggered.
     * @param handler A function to execute when the event is triggered. The value false is also allowed as a shorthand for a function that simply does return false.
     */
    one(events: string, selector: string, data: any, handler: (eventObject: JQueryEventObject) => any): JQuery;

    /**
     * Attach a handler to an event for the elements. The handler is executed at most once per element per event type.
     *
     * @param events An object in which the string keys represent one or more space-separated event types and optional namespaces, and the values represent a handler function to be called for the event(s).
     * @param selector A selector string to filter the descendants of the selected elements that will call the handler. If the selector is null or omitted, the handler is always called when it reaches the selected element.
     * @param data Data to be passed to the handler in event.data when an event occurs.
     */
    one(events: { [key: string]: any; }, selector?: string, data?: any): JQuery;

    /**
     * Attach a handler to an event for the elements. The handler is executed at most once per element per event type.
     *
     * @param events An object in which the string keys represent one or more space-separated event types and optional namespaces, and the values represent a handler function to be called for the event(s).
     * @param data Data to be passed to the handler in event.data when an event occurs.
     */
    one(events: { [key: string]: any; }, data?: any): JQuery;


    /**
     * Specify a function to execute when the DOM is fully loaded.
     *
     * @param handler A function to execute after the DOM is ready.
     */
    ready(handler: (jQueryAlias?: JQueryStatic) => any): JQuery;

    /**
     * Trigger the "resize" event on an element.
     */
    resize(): JQuery;
    /**
     * Bind an event handler to the "resize" JavaScript event.
     *
     * @param handler A function to execute each time the event is triggered.
     */
    resize(handler: (eventObject: JQueryEventObject) => any): JQuery;
    /**
     * Bind an event handler to the "resize" JavaScript event.
     *
     * @param eventData An object containing data that will be passed to the event handler.
     * @param handler A function to execute each time the event is triggered.
     */
    resize(eventData: Object, handler: (eventObject: JQueryEventObject) => any): JQuery;

    /**
     * Trigger the "scroll" event on an element.
     */
    scroll(): JQuery;
    /**
     * Bind an event handler to the "scroll" JavaScript event.
     *
     * @param handler A function to execute each time the event is triggered.
     */
    scroll(handler: (eventObject: JQueryEventObject) => any): JQuery;
    /**
     * Bind an event handler to the "scroll" JavaScript event.
     *
     * @param eventData An object containing data that will be passed to the event handler.
     * @param handler A function to execute each time the event is triggered.
     */
    scroll(eventData: Object, handler: (eventObject: JQueryEventObject) => any): JQuery;

    /**
     * Trigger the "select" event on an element.
     */
    select(): JQuery;
    /**
     * Bind an event handler to the "select" JavaScript event.
     *
     * @param handler A function to execute each time the event is triggered.
     */
    select(handler: (eventObject: JQueryEventObject) => any): JQuery;
    /**
     * Bind an event handler to the "select" JavaScript event.
     *
     * @param eventData An object containing data that will be passed to the event handler.
     * @param handler A function to execute each time the event is triggered.
     */
    select(eventData: Object, handler: (eventObject: JQueryEventObject) => any): JQuery;

    /**
     * Trigger the "submit" event on an element.
     */
    submit(): JQuery;
    /**
     * Bind an event handler to the "submit" JavaScript event
     *
     * @param handler A function to execute each time the event is triggered.
     */
    submit(handler: (eventObject: JQueryEventObject) => any): JQuery;
    /**
     * Bind an event handler to the "submit" JavaScript event
     *
     * @param eventData An object containing data that will be passed to the event handler.
     * @param handler A function to execute each time the event is triggered.
     */
    submit(eventData?: any, handler?: (eventObject: JQueryEventObject) => any): JQuery;

    /**
     * Execute all handlers and behaviors attached to the matched elements for the given event type.
     * 
     * @param eventType A string containing a JavaScript event type, such as click or submit.
     * @param extraParameters Additional parameters to pass along to the event handler.
     */
    trigger(eventType: string, extraParameters?: any[]|Object): JQuery;
    /**
     * Execute all handlers and behaviors attached to the matched elements for the given event type.
     * 
     * @param event A jQuery.Event object.
     * @param extraParameters Additional parameters to pass along to the event handler.
     */
    trigger(event: JQueryEventObject, extraParameters?: any[]|Object): JQuery;

    /**
     * Execute all handlers attached to an element for an event.
     * 
     * @param eventType A string containing a JavaScript event type, such as click or submit.
     * @param extraParameters An array of additional parameters to pass along to the event handler.
     */
    triggerHandler(eventType: string, ...extraParameters: any[]): Object;

    /**
     * Execute all handlers attached to an element for an event.
     * 
     * @param event A jQuery.Event object.
     * @param extraParameters An array of additional parameters to pass along to the event handler.
     */
    triggerHandler(event: JQueryEventObject, ...extraParameters: any[]): Object;

    /**
     * Remove a previously-attached event handler from the elements.
     * 
     * @param eventType A string containing a JavaScript event type, such as click or submit.
     * @param handler The function that is to be no longer executed.
     */
    unbind(eventType?: string, handler?: (eventObject: JQueryEventObject) => any): JQuery;
    /**
     * Remove a previously-attached event handler from the elements.
     * 
     * @param eventType A string containing a JavaScript event type, such as click or submit.
     * @param fls Unbinds the corresponding 'return false' function that was bound using .bind( eventType, false ).
     */
    unbind(eventType: string, fls: boolean): JQuery;
    /**
     * Remove a previously-attached event handler from the elements.
     * 
     * @param evt A JavaScript event object as passed to an event handler.
     */
    unbind(evt: any): JQuery;

    /**
     * Remove a handler from the event for all elements which match the current selector, based upon a specific set of root elements.
     */
    undelegate(): JQuery;
    /**
     * Remove a handler from the event for all elements which match the current selector, based upon a specific set of root elements.
     * 
     * @param selector A selector which will be used to filter the event results.
     * @param eventType A string containing a JavaScript event type, such as "click" or "keydown"
     * @param handler A function to execute at the time the event is triggered.
     */
    undelegate(selector: string, eventType: string, handler?: (eventObject: JQueryEventObject) => any): JQuery;
    /**
     * Remove a handler from the event for all elements which match the current selector, based upon a specific set of root elements.
     * 
     * @param selector A selector which will be used to filter the event results.
     * @param events An object of one or more event types and previously bound functions to unbind from them.
     */
    undelegate(selector: string, events: Object): JQuery;
    /**
     * Remove a handler from the event for all elements which match the current selector, based upon a specific set of root elements.
     * 
     * @param namespace A string containing a namespace to unbind all events from.
     */
    undelegate(namespace: string): JQuery;

    /**
     * Bind an event handler to the "unload" JavaScript event. (DEPRECATED from v1.8)
     * 
     * @param handler A function to execute when the event is triggered.
     */
    unload(handler: (eventObject: JQueryEventObject) => any): JQuery;
    /**
     * Bind an event handler to the "unload" JavaScript event. (DEPRECATED from v1.8)
     * 
     * @param eventData A plain object of data that will be passed to the event handler.
     * @param handler A function to execute when the event is triggered.
     */
    unload(eventData?: any, handler?: (eventObject: JQueryEventObject) => any): JQuery;

    /**
     * The DOM node context originally passed to jQuery(); if none was passed then context will likely be the document. (DEPRECATED from v1.10)
     */
    context: Element;

    jquery: string;

    /**
     * Bind an event handler to the "error" JavaScript event. (DEPRECATED from v1.8)
     * 
     * @param handler A function to execute when the event is triggered.
     */
    error(handler: (eventObject: JQueryEventObject) => any): JQuery;
    /**
     * Bind an event handler to the "error" JavaScript event. (DEPRECATED from v1.8)
     * 
     * @param eventData A plain object of data that will be passed to the event handler.
     * @param handler A function to execute when the event is triggered.
     */
    error(eventData: any, handler: (eventObject: JQueryEventObject) => any): JQuery;

    /**
     * Add a collection of DOM elements onto the jQuery stack.
     * 
     * @param elements An array of elements to push onto the stack and make into a new jQuery object.
     */
    pushStack(elements: any[]): JQuery;
    /**
     * Add a collection of DOM elements onto the jQuery stack.
     * 
     * @param elements An array of elements to push onto the stack and make into a new jQuery object.
     * @param name The name of a jQuery method that generated the array of elements.
     * @param arguments The arguments that were passed in to the jQuery method (for serialization).
     */
    pushStack(elements: any[], name: string, arguments: any[]): JQuery;

    /**
     * Insert content, specified by the parameter, after each element in the set of matched elements.
     * 
     * param content1 HTML string, DOM element, array of elements, or jQuery object to insert after each element in the set of matched elements.
     * param content2 One or more additional DOM elements, arrays of elements, HTML strings, or jQuery objects to insert after each element in the set of matched elements.
     */
    after(content1: JQuery|any[]|Element|Text|string, ...content2: any[]): JQuery;
    /**
     * Insert content, specified by the parameter, after each element in the set of matched elements.
     * 
     * param func A function that returns an HTML string, DOM element(s), or jQuery object to insert after each element in the set of matched elements. Receives the index position of the element in the set as an argument. Within the function, this refers to the current element in the set.
     */
    after(func: (index: number, html: string) => string|Element|JQuery): JQuery;

    /**
     * Insert content, specified by the parameter, to the end of each element in the set of matched elements.
     * 
     * param content1 DOM element, array of elements, HTML string, or jQuery object to insert at the end of each element in the set of matched elements.
     * param content2 One or more additional DOM elements, arrays of elements, HTML strings, or jQuery objects to insert at the end of each element in the set of matched elements.
     */
    append(content1: JQuery|any[]|Element|Text|string, ...content2: any[]): JQuery;
    /**
     * Insert content, specified by the parameter, to the end of each element in the set of matched elements.
     * 
     * param func A function that returns an HTML string, DOM element(s), or jQuery object to insert at the end of each element in the set of matched elements. Receives the index position of the element in the set and the old HTML value of the element as arguments. Within the function, this refers to the current element in the set.
     */
    append(func: (index: number, html: string) => string|Element|JQuery): JQuery;

    /**
     * Insert every element in the set of matched elements to the end of the target.
     * 
     * @param target A selector, element, HTML string, array of elements, or jQuery object; the matched set of elements will be inserted at the end of the element(s) specified by this parameter.
     */
    appendTo(target: JQuery|any[]|Element|string): JQuery;

    /**
     * Insert content, specified by the parameter, before each element in the set of matched elements.
     * 
     * param content1 HTML string, DOM element, array of elements, or jQuery object to insert before each element in the set of matched elements.
     * param content2 One or more additional DOM elements, arrays of elements, HTML strings, or jQuery objects to insert before each element in the set of matched elements.
     */
    before(content1: JQuery|any[]|Element|Text|string, ...content2: any[]): JQuery;
    /**
     * Insert content, specified by the parameter, before each element in the set of matched elements.
     * 
     * param func A function that returns an HTML string, DOM element(s), or jQuery object to insert before each element in the set of matched elements. Receives the index position of the element in the set as an argument. Within the function, this refers to the current element in the set.
     */
    before(func: (index: number, html: string) => string|Element|JQuery): JQuery;

    /**
     * Create a deep copy of the set of matched elements.
     * 
     * param withDataAndEvents A Boolean indicating whether event handlers and data should be copied along with the elements. The default value is false.
     * param deepWithDataAndEvents A Boolean indicating whether event handlers and data for all children of the cloned element should be copied. By default its value matches the first argument's value (which defaults to false).
     */
    clone(withDataAndEvents?: boolean, deepWithDataAndEvents?: boolean): JQuery;

    /**
     * Remove the set of matched elements from the DOM.
     * 
     * param selector A selector expression that filters the set of matched elements to be removed.
     */
    detach(selector?: string): JQuery;

    /**
     * Remove all child nodes of the set of matched elements from the DOM.
     */
    empty(): JQuery;

    /**
     * Insert every element in the set of matched elements after the target.
     * 
     * param target A selector, element, array of elements, HTML string, or jQuery object; the matched set of elements will be inserted after the element(s) specified by this parameter.
     */
    insertAfter(target: JQuery|any[]|Element|Text|string): JQuery;

    /**
     * Insert every element in the set of matched elements before the target.
     * 
     * param target A selector, element, array of elements, HTML string, or jQuery object; the matched set of elements will be inserted before the element(s) specified by this parameter.
     */
    insertBefore(target: JQuery|any[]|Element|Text|string): JQuery;

    /**
     * Insert content, specified by the parameter, to the beginning of each element in the set of matched elements.
     * 
     * param content1 DOM element, array of elements, HTML string, or jQuery object to insert at the beginning of each element in the set of matched elements.
     * param content2 One or more additional DOM elements, arrays of elements, HTML strings, or jQuery objects to insert at the beginning of each element in the set of matched elements.
     */
    prepend(content1: JQuery|any[]|Element|Text|string, ...content2: any[]): JQuery;
    /**
     * Insert content, specified by the parameter, to the beginning of each element in the set of matched elements.
     * 
     * param func A function that returns an HTML string, DOM element(s), or jQuery object to insert at the beginning of each element in the set of matched elements. Receives the index position of the element in the set and the old HTML value of the element as arguments. Within the function, this refers to the current element in the set.
     */
    prepend(func: (index: number, html: string) => string|Element|JQuery): JQuery;

    /**
     * Insert every element in the set of matched elements to the beginning of the target.
     * 
     * @param target A selector, element, HTML string, array of elements, or jQuery object; the matched set of elements will be inserted at the beginning of the element(s) specified by this parameter.
     */
    prependTo(target: JQuery|any[]|Element|string): JQuery;

    /**
     * Remove the set of matched elements from the DOM.
     * 
     * @param selector A selector expression that filters the set of matched elements to be removed.
     */
    remove(selector?: string): JQuery;

    /**
     * Replace each target element with the set of matched elements.
     * 
     * @param target A selector string, jQuery object, DOM element, or array of elements indicating which element(s) to replace.
     */
    replaceAll(target: JQuery|any[]|Element|string): JQuery;

    /**
     * Replace each element in the set of matched elements with the provided new content and return the set of elements that was removed.
     * 
     * param newContent The content to insert. May be an HTML string, DOM element, array of DOM elements, or jQuery object.
     */
    replaceWith(newContent: JQuery|any[]|Element|Text|string): JQuery;
    /**
     * Replace each element in the set of matched elements with the provided new content and return the set of elements that was removed.
     * 
     * param func A function that returns content with which to replace the set of matched elements.
     */
    replaceWith(func: () => Element|JQuery): JQuery;

    /**
     * Get the combined text contents of each element in the set of matched elements, including their descendants.
     */
    text(): string;
    /**
     * Set the content of each element in the set of matched elements to the specified text.
     * 
     * @param text The text to set as the content of each matched element. When Number or Boolean is supplied, it will be converted to a String representation.
     */
    text(text: string|number|boolean): JQuery;
    /**
     * Set the content of each element in the set of matched elements to the specified text.
     * 
     * @param func A function returning the text content to set. Receives the index position of the element in the set and the old text value as arguments.
     */
    text(func: (index: number, text: string) => string): JQuery;

    /**
     * Retrieve all the elements contained in the jQuery set, as an array.
     */
    toArray(): any[];

    /**
     * Remove the parents of the set of matched elements from the DOM, leaving the matched elements in their place.
     */
    unwrap(): JQuery;

    /**
     * Wrap an HTML structure around each element in the set of matched elements.
     * 
     * @param wrappingElement A selector, element, HTML string, or jQuery object specifying the structure to wrap around the matched elements.
     */
    wrap(wrappingElement: JQuery|Element|string): JQuery;
    /**
     * Wrap an HTML structure around each element in the set of matched elements.
     * 
     * @param func A callback function returning the HTML content or jQuery object to wrap around the matched elements. Receives the index position of the element in the set as an argument. Within the function, this refers to the current element in the set.
     */
    wrap(func: (index: number) => string|JQuery): JQuery;

    /**
     * Wrap an HTML structure around all elements in the set of matched elements.
     * 
     * @param wrappingElement A selector, element, HTML string, or jQuery object specifying the structure to wrap around the matched elements.
     */
    wrapAll(wrappingElement: JQuery|Element|string): JQuery;
    wrapAll(func: (index: number) => string): JQuery;

    /**
     * Wrap an HTML structure around the content of each element in the set of matched elements.
     * 
     * @param wrappingElement An HTML snippet, selector expression, jQuery object, or DOM element specifying the structure to wrap around the content of the matched elements.
     */
    wrapInner(wrappingElement: JQuery|Element|string): JQuery;
    /**
     * Wrap an HTML structure around the content of each element in the set of matched elements.
     * 
     * @param func A callback function which generates a structure to wrap around the content of the matched elements. Receives the index position of the element in the set as an argument. Within the function, this refers to the current element in the set.
     */
    wrapInner(func: (index: number) => string): JQuery;

    /**
     * Iterate over a jQuery object, executing a function for each matched element.
     * 
     * @param func A function to execute for each matched element.
     */
    each(func: (index: number, elem: Element) => any): JQuery;

    /**
     * Retrieve one of the elements matched by the jQuery object.
     * 
     * @param index A zero-based integer indicating which element to retrieve.
     */
    get(index: number): HTMLElement;
    /**
     * Retrieve the elements matched by the jQuery object.
     */
    get(): any[];

    /**
     * Search for a given element from among the matched elements.
     */
    index(): number;
    /**
     * Search for a given element from among the matched elements.
     * 
     * @param selector A selector representing a jQuery collection in which to look for an element.
     */
    index(selector: string|JQuery|Element): number;

    /**
     * The number of elements in the jQuery object.
     */
    length: number;
    /**
     * A selector representing selector passed to jQuery(), if any, when creating the original set.
     * version deprecated: 1.7, removed: 1.9
     */
    selector: string;
    [index: string]: any;
    [index: number]: HTMLElement;

    /**
     * Add elements to the set of matched elements.
     * 
     * @param selector A string representing a selector expression to find additional elements to add to the set of matched elements.
     * @param context The point in the document at which the selector should begin matching; similar to the context argument of the $(selector, context) method.
     */
    add(selector: string, context?: Element): JQuery;
    /**
     * Add elements to the set of matched elements.
     * 
     * @param elements One or more elements to add to the set of matched elements.
     */
    add(...elements: Element[]): JQuery;
    /**
     * Add elements to the set of matched elements.
     * 
     * @param html An HTML fragment to add to the set of matched elements.
     */
    add(html: string): JQuery;
    /**
     * Add elements to the set of matched elements.
     * 
     * @param obj An existing jQuery object to add to the set of matched elements.
     */
    add(obj: JQuery): JQuery;

    /**
     * Get the children of each element in the set of matched elements, optionally filtered by a selector.
     * 
     * @param selector A string containing a selector expression to match elements against.
     */
    children(selector?: string): JQuery;

    /**
     * For each element in the set, get the first element that matches the selector by testing the element itself and traversing up through its ancestors in the DOM tree.
     * 
     * @param selector A string containing a selector expression to match elements against.
     */
    closest(selector: string): JQuery;
    /**
     * For each element in the set, get the first element that matches the selector by testing the element itself and traversing up through its ancestors in the DOM tree.
     * 
     * @param selector A string containing a selector expression to match elements against.
     * @param context A DOM element within which a matching element may be found. If no context is passed in then the context of the jQuery set will be used instead.
     */
    closest(selector: string, context?: Element): JQuery;
    /**
     * For each element in the set, get the first element that matches the selector by testing the element itself and traversing up through its ancestors in the DOM tree.
     * 
     * @param obj A jQuery object to match elements against.
     */
    closest(obj: JQuery): JQuery;
    /**
     * For each element in the set, get the first element that matches the selector by testing the element itself and traversing up through its ancestors in the DOM tree.
     * 
     * @param element An element to match elements against.
     */
    closest(element: Element): JQuery;

    /**
     * Get an array of all the elements and selectors matched against the current element up through the DOM tree.
     * 
     * @param selectors An array or string containing a selector expression to match elements against (can also be a jQuery object).
     * @param context A DOM element within which a matching element may be found. If no context is passed in then the context of the jQuery set will be used instead.
     */
    closest(selectors: any, context?: Element): any[];

    /**
     * Get the children of each element in the set of matched elements, including text and comment nodes.
     */
    contents(): JQuery;

    /**
     * End the most recent filtering operation in the current chain and return the set of matched elements to its previous state.
     */
    end(): JQuery;

    /**
     * Reduce the set of matched elements to the one at the specified index.
     * 
     * @param index An integer indicating the 0-based position of the element. OR An integer indicating the position of the element, counting backwards from the last element in the set.
     *  
     */
    eq(index: number): JQuery;

    /**
     * Reduce the set of matched elements to those that match the selector or pass the function's test.
     * 
     * @param selector A string containing a selector expression to match the current set of elements against.
     */
    filter(selector: string): JQuery;
    /**
     * Reduce the set of matched elements to those that match the selector or pass the function's test.
     * 
     * @param func A function used as a test for each element in the set. this is the current DOM element.
     */
    filter(func: (index: number, element: Element) => any): JQuery;
    /**
     * Reduce the set of matched elements to those that match the selector or pass the function's test.
     * 
     * @param element An element to match the current set of elements against.
     */
    filter(element: Element): JQuery;
    /**
     * Reduce the set of matched elements to those that match the selector or pass the function's test.
     * 
     * @param obj An existing jQuery object to match the current set of elements against.
     */
    filter(obj: JQuery): JQuery;

    /**
     * Get the descendants of each element in the current set of matched elements, filtered by a selector, jQuery object, or element.
     * 
     * @param selector A string containing a selector expression to match elements against.
     */
    find(selector: string): JQuery;
    /**
     * Get the descendants of each element in the current set of matched elements, filtered by a selector, jQuery object, or element.
     * 
     * @param element An element to match elements against.
     */
    find(element: Element): JQuery;
    /**
     * Get the descendants of each element in the current set of matched elements, filtered by a selector, jQuery object, or element.
     * 
     * @param obj A jQuery object to match elements against.
     */
    find(obj: JQuery): JQuery;

    /**
     * Reduce the set of matched elements to the first in the set.
     */
    first(): JQuery;

    /**
     * Reduce the set of matched elements to those that have a descendant that matches the selector or DOM element.
     * 
     * @param selector A string containing a selector expression to match elements against.
     */
    has(selector: string): JQuery;
    /**
     * Reduce the set of matched elements to those that have a descendant that matches the selector or DOM element.
     * 
     * @param contained A DOM element to match elements against.
     */
    has(contained: Element): JQuery;

    /**
     * Check the current matched set of elements against a selector, element, or jQuery object and return true if at least one of these elements matches the given arguments.
     * 
     * @param selector A string containing a selector expression to match elements against.
     */
    is(selector: string): boolean;
    /**
     * Check the current matched set of elements against a selector, element, or jQuery object and return true if at least one of these elements matches the given arguments.
     * 
     * @param func A function used as a test for the set of elements. It accepts one argument, index, which is the element's index in the jQuery collection.Within the function, this refers to the current DOM element.
     */
    is(func: (index: number, element: Element) => boolean): boolean;
    /**
     * Check the current matched set of elements against a selector, element, or jQuery object and return true if at least one of these elements matches the given arguments.
     * 
     * @param obj An existing jQuery object to match the current set of elements against.
     */
    is(obj: JQuery): boolean;
    /**
     * Check the current matched set of elements against a selector, element, or jQuery object and return true if at least one of these elements matches the given arguments.
     * 
     * @param elements One or more elements to match the current set of elements against.
     */
    is(elements: any): boolean;

    /**
     * Reduce the set of matched elements to the final one in the set.
     */
    last(): JQuery;

    /**
     * Pass each element in the current matched set through a function, producing a new jQuery object containing the return values.
     * 
     * @param callback A function object that will be invoked for each element in the current set.
     */
    map(callback: (index: number, domElement: Element) => any): JQuery;

    /**
     * Get the immediately following sibling of each element in the set of matched elements. If a selector is provided, it retrieves the next sibling only if it matches that selector.
     * 
     * @param selector A string containing a selector expression to match elements against.
     */
    next(selector?: string): JQuery;

    /**
     * Get all following siblings of each element in the set of matched elements, optionally filtered by a selector.
     * 
     * @param selector A string containing a selector expression to match elements against.
     */
    nextAll(selector?: string): JQuery;

    /**
     * Get all following siblings of each element up to but not including the element matched by the selector, DOM node, or jQuery object passed.
     * 
     * @param selector A string containing a selector expression to indicate where to stop matching following sibling elements.
     * @param filter A string containing a selector expression to match elements against.
     */
    nextUntil(selector?: string, filter?: string): JQuery;
    /**
     * Get all following siblings of each element up to but not including the element matched by the selector, DOM node, or jQuery object passed.
     * 
     * @param element A DOM node or jQuery object indicating where to stop matching following sibling elements.
     * @param filter A string containing a selector expression to match elements against.
     */
    nextUntil(element?: Element, filter?: string): JQuery;
    /**
     * Get all following siblings of each element up to but not including the element matched by the selector, DOM node, or jQuery object passed.
     * 
     * @param obj A DOM node or jQuery object indicating where to stop matching following sibling elements.
     * @param filter A string containing a selector expression to match elements against.
     */
    nextUntil(obj?: JQuery, filter?: string): JQuery;

    /**
     * Remove elements from the set of matched elements.
     * 
     * @param selector A string containing a selector expression to match elements against.
     */
    not(selector: string): JQuery;
    /**
     * Remove elements from the set of matched elements.
     * 
     * @param func A function used as a test for each element in the set. this is the current DOM element.
     */
    not(func: (index: number, element: Element) => boolean): JQuery;
    /**
     * Remove elements from the set of matched elements.
     * 
     * @param elements One or more DOM elements to remove from the matched set.
     */
    not(...elements: Element[]): JQuery;
    /**
     * Remove elements from the set of matched elements.
     * 
     * @param obj An existing jQuery object to match the current set of elements against.
     */
    not(obj: JQuery): JQuery;

    /**
     * Get the closest ancestor element that is positioned.
     */
    offsetParent(): JQuery;

    /**
     * Get the parent of each element in the current set of matched elements, optionally filtered by a selector.
     * 
     * @param selector A string containing a selector expression to match elements against.
     */
    parent(selector?: string): JQuery;

    /**
     * Get the ancestors of each element in the current set of matched elements, optionally filtered by a selector.
     * 
     * @param selector A string containing a selector expression to match elements against.
     */
    parents(selector?: string): JQuery;

    /**
     * Get the ancestors of each element in the current set of matched elements, up to but not including the element matched by the selector, DOM node, or jQuery object.
     * 
     * @param selector A string containing a selector expression to indicate where to stop matching ancestor elements.
     * @param filter A string containing a selector expression to match elements against.
     */
    parentsUntil(selector?: string, filter?: string): JQuery;
    /**
     * Get the ancestors of each element in the current set of matched elements, up to but not including the element matched by the selector, DOM node, or jQuery object.
     * 
     * @param element A DOM node or jQuery object indicating where to stop matching ancestor elements.
     * @param filter A string containing a selector expression to match elements against.
     */
    parentsUntil(element?: Element, filter?: string): JQuery;
    /**
     * Get the ancestors of each element in the current set of matched elements, up to but not including the element matched by the selector, DOM node, or jQuery object.
     * 
     * @param obj A DOM node or jQuery object indicating where to stop matching ancestor elements.
     * @param filter A string containing a selector expression to match elements against.
     */
    parentsUntil(obj?: JQuery, filter?: string): JQuery;

    /**
     * Get the immediately preceding sibling of each element in the set of matched elements, optionally filtered by a selector.
     * 
     * @param selector A string containing a selector expression to match elements against.
     */
    prev(selector?: string): JQuery;

    /**
     * Get all preceding siblings of each element in the set of matched elements, optionally filtered by a selector.
     * 
     * @param selector A string containing a selector expression to match elements against.
     */
    prevAll(selector?: string): JQuery;

    /**
     * Get all preceding siblings of each element up to but not including the element matched by the selector, DOM node, or jQuery object.
     * 
     * @param selector A string containing a selector expression to indicate where to stop matching preceding sibling elements.
     * @param filter A string containing a selector expression to match elements against.
     */
    prevUntil(selector?: string, filter?: string): JQuery;
    /**
     * Get all preceding siblings of each element up to but not including the element matched by the selector, DOM node, or jQuery object.
     * 
     * @param element A DOM node or jQuery object indicating where to stop matching preceding sibling elements.
     * @param filter A string containing a selector expression to match elements against.
     */
    prevUntil(element?: Element, filter?: string): JQuery;
    /**
     * Get all preceding siblings of each element up to but not including the element matched by the selector, DOM node, or jQuery object.
     * 
     * @param obj A DOM node or jQuery object indicating where to stop matching preceding sibling elements.
     * @param filter A string containing a selector expression to match elements against.
     */
    prevUntil(obj?: JQuery, filter?: string): JQuery;

    /**
     * Get the siblings of each element in the set of matched elements, optionally filtered by a selector.
     * 
     * @param selector A string containing a selector expression to match elements against.
     */
    siblings(selector?: string): JQuery;

    /**
     * Reduce the set of matched elements to a subset specified by a range of indices.
     * 
     * @param start An integer indicating the 0-based position at which the elements begin to be selected. If negative, it indicates an offset from the end of the set.
     * @param end An integer indicating the 0-based position at which the elements stop being selected. If negative, it indicates an offset from the end of the set. If omitted, the range continues until the end of the set.
     */
    slice(start: number, end?: number): JQuery;

    /**
     * Show the queue of functions to be executed on the matched elements.
     * 
     * @param queueName A string containing the name of the queue. Defaults to fx, the standard effects queue.
     */
    queue(queueName?: string): any[];
    /**
     * Manipulate the queue of functions to be executed, once for each matched element.
     * 
     * @param newQueue An array of functions to replace the current queue contents.
     */
    queue(newQueue: Function[]): JQuery;
    /**
     * Manipulate the queue of functions to be executed, once for each matched element.
     * 
     * @param callback The new function to add to the queue, with a function to call that will dequeue the next item.
     */
    queue(callback: Function): JQuery;
    /**
     * Manipulate the queue of functions to be executed, once for each matched element.
     * 
     * @param queueName A string containing the name of the queue. Defaults to fx, the standard effects queue.
     * @param newQueue An array of functions to replace the current queue contents.
     */
    queue(queueName: string, newQueue: Function[]): JQuery;
    /**
     * Manipulate the queue of functions to be executed, once for each matched element.
     * 
     * @param queueName A string containing the name of the queue. Defaults to fx, the standard effects queue.
     * @param callback The new function to add to the queue, with a function to call that will dequeue the next item.
     */
    queue(queueName: string, callback: Function): JQuery;
}
declare module "jquery" {
    export = $;
}
declare var jQuery: JQueryStatic;
declare var $: JQueryStatic;
// Type definitions for Angular JS 1.4+
// Project: http://angularjs.org
// Definitions by: Diego Vilar <http://github.com/diegovilar>
// Definitions: https://github.com/borisyankov/DefinitelyTyped


/// <reference path="../jquery/jquery.d.ts" />

declare var angular: angular.IAngularStatic;

// Support for painless dependency injection
interface Function {
    $inject?: string[];
}

// Collapse angular into ng
import ng = angular;
// Support AMD require
declare module 'angular' {
    export = angular;
}

///////////////////////////////////////////////////////////////////////////////
// ng module (angular.js)
///////////////////////////////////////////////////////////////////////////////
declare module angular {

    // not directly implemented, but ensures that constructed class implements $get
    interface IServiceProviderClass {
        new (...args: any[]): IServiceProvider;
    }

    interface IServiceProviderFactory {
        (...args: any[]): IServiceProvider;
    }

    // All service providers extend this interface
    interface IServiceProvider {
        $get: any;
    }

    interface IAngularBootstrapConfig {
        strictDi?: boolean;
    }

    ///////////////////////////////////////////////////////////////////////////
    // AngularStatic
    // see http://docs.angularjs.org/api
    ///////////////////////////////////////////////////////////////////////////
    interface IAngularStatic {
        bind(context: any, fn: Function, ...args: any[]): Function;

        /**
         * Use this function to manually start up angular application.
         *
         * @param element DOM element which is the root of angular application.
         * @param modules An array of modules to load into the application.
         *     Each item in the array should be the name of a predefined module or a (DI annotated)
         *     function that will be invoked by the injector as a run block.
         * @param config an object for defining configuration options for the application. The following keys are supported:
         *     - `strictDi`: disable automatic function annotation for the application. This is meant to assist in finding bugs which break minified code.
         */
        bootstrap(element: string, modules?: string, config?: IAngularBootstrapConfig): auto.IInjectorService;
        /**
         * Use this function to manually start up angular application.
         *
         * @param element DOM element which is the root of angular application.
         * @param modules An array of modules to load into the application.
         *     Each item in the array should be the name of a predefined module or a (DI annotated)
         *     function that will be invoked by the injector as a run block.
         * @param config an object for defining configuration options for the application. The following keys are supported:
         *     - `strictDi`: disable automatic function annotation for the application. This is meant to assist in finding bugs which break minified code.
         */
        bootstrap(element: string, modules?: Function, config?: IAngularBootstrapConfig): auto.IInjectorService;
        /**
         * Use this function to manually start up angular application.
         *
         * @param element DOM element which is the root of angular application.
         * @param modules An array of modules to load into the application.
         *     Each item in the array should be the name of a predefined module or a (DI annotated)
         *     function that will be invoked by the injector as a run block.
         * @param config an object for defining configuration options for the application. The following keys are supported:
         *     - `strictDi`: disable automatic function annotation for the application. This is meant to assist in finding bugs which break minified code.
         */
        bootstrap(element: string, modules?: string[], config?: IAngularBootstrapConfig): auto.IInjectorService;
        /**
         * Use this function to manually start up angular application.
         *
         * @param element DOM element which is the root of angular application.
         * @param modules An array of modules to load into the application.
         *     Each item in the array should be the name of a predefined module or a (DI annotated)
         *     function that will be invoked by the injector as a run block.
         * @param config an object for defining configuration options for the application. The following keys are supported:
         *     - `strictDi`: disable automatic function annotation for the application. This is meant to assist in finding bugs which break minified code.
         */
        bootstrap(element: JQuery, modules?: string, config?: IAngularBootstrapConfig): auto.IInjectorService;
        /**
         * Use this function to manually start up angular application.
         *
         * @param element DOM element which is the root of angular application.
         * @param modules An array of modules to load into the application.
         *     Each item in the array should be the name of a predefined module or a (DI annotated)
         *     function that will be invoked by the injector as a run block.
         * @param config an object for defining configuration options for the application. The following keys are supported:
         *     - `strictDi`: disable automatic function annotation for the application. This is meant to assist in finding bugs which break minified code.
         */
        bootstrap(element: JQuery, modules?: Function, config?: IAngularBootstrapConfig): auto.IInjectorService;
        /**
         * Use this function to manually start up angular application.
         *
         * @param element DOM element which is the root of angular application.
         * @param modules An array of modules to load into the application.
         *     Each item in the array should be the name of a predefined module or a (DI annotated)
         *     function that will be invoked by the injector as a run block.
         * @param config an object for defining configuration options for the application. The following keys are supported:
         *     - `strictDi`: disable automatic function annotation for the application. This is meant to assist in finding bugs which break minified code.
         */
        bootstrap(element: JQuery, modules?: string[], config?: IAngularBootstrapConfig): auto.IInjectorService;
        /**
         * Use this function to manually start up angular application.
         *
         * @param element DOM element which is the root of angular application.
         * @param modules An array of modules to load into the application.
         *     Each item in the array should be the name of a predefined module or a (DI annotated)
         *     function that will be invoked by the injector as a run block.
         * @param config an object for defining configuration options for the application. The following keys are supported:
         *     - `strictDi`: disable automatic function annotation for the application. This is meant to assist in finding bugs which break minified code.
         */
        bootstrap(element: Element, modules?: string, config?: IAngularBootstrapConfig): auto.IInjectorService;
        /**
         * Use this function to manually start up angular application.
         *
         * @param element DOM element which is the root of angular application.
         * @param modules An array of modules to load into the application.
         *     Each item in the array should be the name of a predefined module or a (DI annotated)
         *     function that will be invoked by the injector as a run block.
         * @param config an object for defining configuration options for the application. The following keys are supported:
         *     - `strictDi`: disable automatic function annotation for the application. This is meant to assist in finding bugs which break minified code.
         */
        bootstrap(element: Element, modules?: Function, config?: IAngularBootstrapConfig): auto.IInjectorService;
        /**
         * Use this function to manually start up angular application.
         *
         * @param element DOM element which is the root of angular application.
         * @param modules An array of modules to load into the application.
         *     Each item in the array should be the name of a predefined module or a (DI annotated)
         *     function that will be invoked by the injector as a run block.
         * @param config an object for defining configuration options for the application. The following keys are supported:
         *     - `strictDi`: disable automatic function annotation for the application. This is meant to assist in finding bugs which break minified code.
         */
        bootstrap(element: Element, modules?: string[], config?: IAngularBootstrapConfig): auto.IInjectorService;
        /**
         * Use this function to manually start up angular application.
         *
         * @param element DOM element which is the root of angular application.
         * @param modules An array of modules to load into the application.
         *     Each item in the array should be the name of a predefined module or a (DI annotated)
         *     function that will be invoked by the injector as a run block.
         * @param config an object for defining configuration options for the application. The following keys are supported:
         *     - `strictDi`: disable automatic function annotation for the application. This is meant to assist in finding bugs which break minified code.
         */
        bootstrap(element: Document, modules?: string, config?: IAngularBootstrapConfig): auto.IInjectorService;
        /**
         * Use this function to manually start up angular application.
         *
         * @param element DOM element which is the root of angular application.
         * @param modules An array of modules to load into the application.
         *     Each item in the array should be the name of a predefined module or a (DI annotated)
         *     function that will be invoked by the injector as a run block.
         * @param config an object for defining configuration options for the application. The following keys are supported:
         *     - `strictDi`: disable automatic function annotation for the application. This is meant to assist in finding bugs which break minified code.
         */
        bootstrap(element: Document, modules?: Function, config?: IAngularBootstrapConfig): auto.IInjectorService;
        /**
         * Use this function to manually start up angular application.
         *
         * @param element DOM element which is the root of angular application.
         * @param modules An array of modules to load into the application.
         *     Each item in the array should be the name of a predefined module or a (DI annotated)
         *     function that will be invoked by the injector as a run block.
         * @param config an object for defining configuration options for the application. The following keys are supported:
         *     - `strictDi`: disable automatic function annotation for the application. This is meant to assist in finding bugs which break minified code.
         */
        bootstrap(element: Document, modules?: string[], config?: IAngularBootstrapConfig): auto.IInjectorService;

        /**
         * Creates a deep copy of source, which should be an object or an array.
         *
         * - If no destination is supplied, a copy of the object or array is created.
         * - If a destination is provided, all of its elements (for array) or properties (for objects) are deleted and then all elements/properties from the source are copied to it.
         * - If source is not an object or array (inc. null and undefined), source is returned.
         * - If source is identical to 'destination' an exception will be thrown.
         *
         * @param source The source that will be used to make a copy. Can be any type, including primitives, null, and undefined.
         * @param destination Destination into which the source is copied. If provided, must be of the same type as source.
         */
        copy<T>(source: T, destination?: T): T;

        /**
         * Wraps a raw DOM element or HTML string as a jQuery element.
         *
         * If jQuery is available, angular.element is an alias for the jQuery function. If jQuery is not available, angular.element delegates to Angular's built-in subset of jQuery, called "jQuery lite" or "jqLite."
         */
        element: IAugmentedJQueryStatic;
        equals(value1: any, value2: any): boolean;
        extend(destination: any, ...sources: any[]): any;

        /**
         * Invokes the iterator function once for each item in obj collection, which can be either an object or an array. The iterator function is invoked with iterator(value, key), where value is the value of an object property or an array element and key is the object property key or array element index. Specifying a context for the function is optional.
         *
         * It is worth noting that .forEach does not iterate over inherited properties because it filters using the hasOwnProperty method.
         *
         * @param obj Object to iterate over.
         * @param iterator Iterator function.
         * @param context Object to become context (this) for the iterator function.
         */
        forEach<T>(obj: T[], iterator: (value: T, key: number) => any, context?: any): any;
        /**
         * Invokes the iterator function once for each item in obj collection, which can be either an object or an array. The iterator function is invoked with iterator(value, key), where value is the value of an object property or an array element and key is the object property key or array element index. Specifying a context for the function is optional.
         *
         * It is worth noting that .forEach does not iterate over inherited properties because it filters using the hasOwnProperty method.
         *
         * @param obj Object to iterate over.
         * @param iterator Iterator function.
         * @param context Object to become context (this) for the iterator function.
         */
        forEach<T>(obj: { [index: string]: T; }, iterator: (value: T, key: string) => any, context?: any): any;
        /**
         * Invokes the iterator function once for each item in obj collection, which can be either an object or an array. The iterator function is invoked with iterator(value, key), where value is the value of an object property or an array element and key is the object property key or array element index. Specifying a context for the function is optional.
         *
         * It is worth noting that .forEach does not iterate over inherited properties because it filters using the hasOwnProperty method.
         *
         * @param obj Object to iterate over.
         * @param iterator Iterator function.
         * @param context Object to become context (this) for the iterator function.
         */
        forEach(obj: any, iterator: (value: any, key: any) => any, context?: any): any;

        fromJson(json: string): any;
        identity<T>(arg?: T): T;
        injector(modules?: any[], strictDi?: boolean): auto.IInjectorService;
        isArray(value: any): boolean;
        isDate(value: any): boolean;
        isDefined(value: any): boolean;
        isElement(value: any): boolean;
        isFunction(value: any): boolean;
        isNumber(value: any): boolean;
        isObject(value: any): boolean;
        isString(value: any): boolean;
        isUndefined(value: any): boolean;
        lowercase(str: string): string;

        /**
         * Deeply extends the destination object dst by copying own enumerable properties from the src object(s) to dst. You can specify multiple src objects. If you want to preserve original objects, you can do so by passing an empty object as the target: var object = angular.merge({}, object1, object2).
         *
         * Unlike extend(), merge() recursively descends into object properties of source objects, performing a deep copy.
         *
         * @param dst Destination object.
         * @param src Source object(s).
         */
        merge(dst: any, ...src: any[]): any;

        /**
         * The angular.module is a global place for creating, registering and retrieving Angular modules. All modules (angular core or 3rd party) that should be available to an application must be registered using this mechanism.
         *
         * When passed two or more arguments, a new module is created. If passed only one argument, an existing module (the name passed as the first argument to module) is retrieved.
         *
         * @param name The name of the module to create or retrieve.
         * @param requires The names of modules this module depends on. If specified then new module is being created. If unspecified then the module is being retrieved for further configuration.
         * @param configFn Optional configuration function for the module.
         */
        module(
            name: string,
            requires?: string[],
            configFn?: Function): IModule;

        noop(...args: any[]): void;
        reloadWithDebugInfo(): void;
        toJson(obj: any, pretty?: boolean): string;
        uppercase(str: string): string;
        version: {
            full: string;
            major: number;
            minor: number;
            dot: number;
            codeName: string;
        };
    }

    ///////////////////////////////////////////////////////////////////////////
    // Module
    // see http://docs.angularjs.org/api/angular.Module
    ///////////////////////////////////////////////////////////////////////////
    interface IModule {
        animation(name: string, animationFactory: Function): IModule;
        animation(name: string, inlineAnnotatedFunction: any[]): IModule;
        animation(object: Object): IModule;
        /**
         * Use this method to register work which needs to be performed on module loading.
         *
         * @param configFn Execute this function on module load. Useful for service configuration.
         */
        config(configFn: Function): IModule;
        /**
         * Use this method to register work which needs to be performed on module loading.
         *
         * @param inlineAnnotatedFunction Execute this function on module load. Useful for service configuration.
         */
        config(inlineAnnotatedFunction: any[]): IModule;
        /**
         * Register a constant service, such as a string, a number, an array, an object or a function, with the $injector. Unlike value it can be injected into a module configuration function (see config) and it cannot be overridden by an Angular decorator.
         *
         * @param name The name of the constant.
         * @param value The constant value.
         */
        constant(name: string, value: any): IModule;
        constant(object: Object): IModule;
        /**
         * The $controller service is used by Angular to create new controllers.
         *
         * This provider allows controller registration via the register method.
         *
         * @param name Controller name, or an object map of controllers where the keys are the names and the values are the constructors.
         * @param controllerConstructor Controller constructor fn (optionally decorated with DI annotations in the array notation).
         */
        controller(name: string, controllerConstructor: Function): IModule;
        /**
         * The $controller service is used by Angular to create new controllers.
         *
         * This provider allows controller registration via the register method.
         *
         * @param name Controller name, or an object map of controllers where the keys are the names and the values are the constructors.
         * @param controllerConstructor Controller constructor fn (optionally decorated with DI annotations in the array notation).
         */
        controller(name: string, inlineAnnotatedConstructor: any[]): IModule;
        controller(object: Object): IModule;
        /**
         * Register a new directive with the compiler.
         *
         * @param name Name of the directive in camel-case (i.e. ngBind which will match as ng-bind)
         * @param directiveFactory An injectable directive factory function.
         */
        directive(name: string, directiveFactory: IDirectiveFactory): IModule;
        /**
         * Register a new directive with the compiler.
         *
         * @param name Name of the directive in camel-case (i.e. ngBind which will match as ng-bind)
         * @param directiveFactory An injectable directive factory function.
         */
        directive(name: string, inlineAnnotatedFunction: any[]): IModule;
        directive(object: Object): IModule;
        /**
         * Register a service factory, which will be called to return the service instance. This is short for registering a service where its provider consists of only a $get property, which is the given service factory function. You should use $provide.factory(getFn) if you do not need to configure your service in a provider.
         *
         * @param name The name of the instance.
         * @param $getFn The $getFn for the instance creation. Internally this is a short hand for $provide.provider(name, {$get: $getFn}).
         */
        factory(name: string, $getFn: Function): IModule;
        /**
         * Register a service factory, which will be called to return the service instance. This is short for registering a service where its provider consists of only a $get property, which is the given service factory function. You should use $provide.factory(getFn) if you do not need to configure your service in a provider.
         *
         * @param name The name of the instance.
         * @param inlineAnnotatedFunction The $getFn for the instance creation. Internally this is a short hand for $provide.provider(name, {$get: $getFn}).
         */
        factory(name: string, inlineAnnotatedFunction: any[]): IModule;
        factory(object: Object): IModule;
        filter(name: string, filterFactoryFunction: Function): IModule;
        filter(name: string, inlineAnnotatedFunction: any[]): IModule;
        filter(object: Object): IModule;
        provider(name: string, serviceProviderFactory: IServiceProviderFactory): IModule;
        provider(name: string, serviceProviderConstructor: IServiceProviderClass): IModule;
        provider(name: string, inlineAnnotatedConstructor: any[]): IModule;
        provider(name: string, providerObject: IServiceProvider): IModule;
        provider(object: Object): IModule;
        /**
         * Run blocks are the closest thing in Angular to the main method. A run block is the code which needs to run to kickstart the application. It is executed after all of the service have been configured and the injector has been created. Run blocks typically contain code which is hard to unit-test, and for this reason should be declared in isolated modules, so that they can be ignored in the unit-tests.
         */
        run(initializationFunction: Function): IModule;
        /**
         * Run blocks are the closest thing in Angular to the main method. A run block is the code which needs to run to kickstart the application. It is executed after all of the service have been configured and the injector has been created. Run blocks typically contain code which is hard to unit-test, and for this reason should be declared in isolated modules, so that they can be ignored in the unit-tests.
         */
        run(inlineAnnotatedFunction: any[]): IModule;
        service(name: string, serviceConstructor: Function): IModule;
        service(name: string, inlineAnnotatedConstructor: any[]): IModule;
        service(object: Object): IModule;
        /**
         * Register a value service with the $injector, such as a string, a number, an array, an object or a function. This is short for registering a service where its provider's $get property is a factory function that takes no arguments and returns the value service.

           Value services are similar to constant services, except that they cannot be injected into a module configuration function (see config) but they can be overridden by an Angular decorator.
         *
         * @param name The name of the instance.
         * @param value The value.
         */
        value(name: string, value: any): IModule;
        value(object: Object): IModule;

        /**
         * Register a service decorator with the $injector. A service decorator intercepts the creation of a service, allowing it to override or modify the behaviour of the service. The object returned by the decorator may be the original service, or a new service object which replaces or wraps and delegates to the original service.
         * @param name The name of the service to decorate
         * @param decorator This function will be invoked when the service needs to be instantiated and should return the decorated service instance. The function is called using the injector.invoke method and is therefore fully injectable. Local injection arguments: $delegate - The original service instance, which can be monkey patched, configured, decorated or delegated to.
         */
        decorator(name:string, decoratorConstructor: Function): IModule;
        decorator(name:string, inlineAnnotatedConstructor: any[]): IModule;

        // Properties
        name: string;
        requires: string[];
    }

    ///////////////////////////////////////////////////////////////////////////
    // Attributes
    // see http://docs.angularjs.org/api/ng.$compile.directive.Attributes
    ///////////////////////////////////////////////////////////////////////////
    interface IAttributes {
        /**
         * this is necessary to be able to access the scoped attributes. it's not very elegant
         * because you have to use attrs['foo'] instead of attrs.foo but I don't know of a better way
         * this should really be limited to return string but it creates this problem: http://stackoverflow.com/q/17201854/165656
         */
        [name: string]: any;

        /**
         * Converts an attribute name (e.g. dash/colon/underscore-delimited string, optionally prefixed with x- or data-) to its normalized, camelCase form.
         *
         * Also there is special case for Moz prefix starting with upper case letter.
         *
         * For further information check out the guide on @see https://docs.angularjs.org/guide/directive#matching-directives
         */
        $normalize(name: string): void;

        /**
         * Adds the CSS class value specified by the classVal parameter to the
         * element. If animations are enabled then an animation will be triggered
         * for the class addition.
         */
        $addClass(classVal: string): void;

        /**
         * Removes the CSS class value specified by the classVal parameter from the
         * element. If animations are enabled then an animation will be triggered for
         * the class removal.
         */
        $removeClass(classVal: string): void;

        /**
         * Set DOM element attribute value.
         */
        $set(key: string, value: any): void;

        /**
         * Observes an interpolated attribute.
         * The observer function will be invoked once during the next $digest
         * following compilation. The observer is then invoked whenever the
         * interpolated value changes.
         */
        $observe<T>(name: string, fn: (value?: T) => any): Function;

        /**
         * A map of DOM element attribute names to the normalized name. This is needed
         * to do reverse lookup from normalized name back to actual name.
         */
        $attr: Object;
    }

    /**
     * form.FormController - type in module ng
     * see https://docs.angularjs.org/api/ng/type/form.FormController
     */
    interface IFormController {

        /**
         * Indexer which should return ng.INgModelController for most properties but cannot because of "All named properties must be assignable to string indexer type" constraint - see https://github.com/Microsoft/TypeScript/issues/272
         */
        [name: string]: any;

        $pristine: boolean;
        $dirty: boolean;
        $valid: boolean;
        $invalid: boolean;
        $submitted: boolean;
        $error: any;
        $addControl(control: INgModelController): void;
        $removeControl(control: INgModelController): void;
        $setValidity(validationErrorKey: string, isValid: boolean, control: INgModelController): void;
        $setDirty(): void;
        $setPristine(): void;
        $commitViewValue(): void;
        $rollbackViewValue(): void;
        $setSubmitted(): void;
        $setUntouched(): void;
    }

    ///////////////////////////////////////////////////////////////////////////
    // NgModelController
    // see http://docs.angularjs.org/api/ng.directive:ngModel.NgModelController
    ///////////////////////////////////////////////////////////////////////////
    interface INgModelController {
        $render(): void;
        $setValidity(validationErrorKey: string, isValid: boolean): void;
        // Documentation states viewValue and modelValue to be a string but other
        // types do work and it's common to use them.
        $setViewValue(value: any, trigger?: string): void;
        $setPristine(): void;
        $setDirty(): void;
        $validate(): void;
        $setTouched(): void;
        $setUntouched(): void;
        $rollbackViewValue(): void;
        $commitViewValue(): void;
        $isEmpty(value: any): boolean;

        $viewValue: any;

        $modelValue: any;

        $parsers: IModelParser[];
        $formatters: IModelFormatter[];
        $viewChangeListeners: IModelViewChangeListener[];
        $error: any;
        $name: string;

        $touched: boolean;
        $untouched: boolean;

        $validators: IModelValidators;
        $asyncValidators: IAsyncModelValidators;

        $pending: any;
        $pristine: boolean;
        $dirty: boolean;
        $valid: boolean;
        $invalid: boolean;
    }

    interface IModelValidators {
        /**
         * viewValue is any because it can be an object that is called in the view like $viewValue.name:$viewValue.subName
         */
        [index: string]: (modelValue: any, viewValue: any) => boolean;
    }

    interface IAsyncModelValidators {
        [index: string]: (modelValue: any, viewValue: any) => IPromise<any>;
    }

    interface IModelParser {
        (value: any): any;
    }

    interface IModelFormatter {
        (value: any): any;
    }

    interface IModelViewChangeListener {
        (): void;
    }

    /**
     * $rootScope - $rootScopeProvider - service in module ng
     * see https://docs.angularjs.org/api/ng/type/$rootScope.Scope and https://docs.angularjs.org/api/ng/service/$rootScope
     */
    interface IRootScopeService {
        [index: string]: any;

        $apply(): any;
        $apply(exp: string): any;
        $apply(exp: (scope: IScope) => any): any;

        $applyAsync(): any;
        $applyAsync(exp: string): any;
        $applyAsync(exp: (scope: IScope) => any): any;

        /**
         * Dispatches an event name downwards to all child scopes (and their children) notifying the registered $rootScope.Scope listeners.
         *
         * The event life cycle starts at the scope on which $broadcast was called. All listeners listening for name event on this scope get notified. Afterwards, the event propagates to all direct and indirect scopes of the current scope and calls all registered listeners along the way. The event cannot be canceled.
         *
         * Any exception emitted from the listeners will be passed onto the $exceptionHandler service.
         *
         * @param name Event name to broadcast.
         * @param args Optional one or more arguments which will be passed onto the event listeners.
         */
        $broadcast(name: string, ...args: any[]): IAngularEvent;
        $destroy(): void;
        $digest(): void;
        /**
         * Dispatches an event name upwards through the scope hierarchy notifying the registered $rootScope.Scope listeners.
         *
         * The event life cycle starts at the scope on which $emit was called. All listeners listening for name event on this scope get notified. Afterwards, the event traverses upwards toward the root scope and calls all registered listeners along the way. The event will stop propagating if one of the listeners cancels it.
         *
         * Any exception emitted from the listeners will be passed onto the $exceptionHandler service.
         *
         * @param name Event name to emit.
         * @param args Optional one or more arguments which will be passed onto the event listeners.
         */
        $emit(name: string, ...args: any[]): IAngularEvent;

        $eval(): any;
        $eval(expression: string, locals?: Object): any;
        $eval(expression: (scope: IScope) => any, locals?: Object): any;

        $evalAsync(): void;
        $evalAsync(expression: string): void;
        $evalAsync(expression: (scope: IScope) => any): void;

        // Defaults to false by the implementation checking strategy
        $new(isolate?: boolean, parent?: IScope): IScope;

        /**
         * Listens on events of a given type. See $emit for discussion of event life cycle.
         *
         * The event listener function format is: function(event, args...).
         *
         * @param name Event name to listen on.
         * @param listener Function to call when the event is emitted.
         */
        $on(name: string, listener: (event: IAngularEvent, ...args: any[]) => any): Function;

        $watch(watchExpression: string, listener?: string, objectEquality?: boolean): Function;
        $watch<T>(watchExpression: string, listener?: (newValue: T, oldValue: T, scope: IScope) => any, objectEquality?: boolean): Function;
        $watch(watchExpression: (scope: IScope) => any, listener?: string, objectEquality?: boolean): Function;
        $watch<T>(watchExpression: (scope: IScope) => T, listener?: (newValue: T, oldValue: T, scope: IScope) => any, objectEquality?: boolean): Function;

        $watchCollection<T>(watchExpression: string, listener: (newValue: T, oldValue: T, scope: IScope) => any): Function;
        $watchCollection<T>(watchExpression: (scope: IScope) => T, listener: (newValue: T, oldValue: T, scope: IScope) => any): Function;

        $watchGroup(watchExpressions: any[], listener: (newValue: any, oldValue: any, scope: IScope) => any): Function;
        $watchGroup(watchExpressions: { (scope: IScope): any }[], listener: (newValue: any, oldValue: any, scope: IScope) => any): Function;

        $parent: IScope;
        $root: IRootScopeService;
        $id: number;

        // Hidden members
        $$isolateBindings: any;
        $$phase: any;
    }

    interface IScope extends IRootScopeService { }

    /**
     * $scope for ngRepeat directive.
     * see https://docs.angularjs.org/api/ng/directive/ngRepeat
     */
    interface IRepeatScope extends IScope {

        /**
         * iterator offset of the repeated element (0..length-1).
         */
        $index: number;

        /**
         * true if the repeated element is first in the iterator.
         */
        $first: boolean;

        /**
         * true if the repeated element is between the first and last in the iterator.
         */
        $middle: boolean;

        /**
         * true if the repeated element is last in the iterator.
         */
        $last: boolean;

        /**
         * true if the iterator position $index is even (otherwise false).
         */
        $even: boolean;

        /**
         * true if the iterator position $index is odd (otherwise false).
         */
        $odd: boolean;

	}

    interface IAngularEvent {
        /**
         * the scope on which the event was $emit-ed or $broadcast-ed.
         */
        targetScope: IScope;
        /**
         * the scope that is currently handling the event. Once the event propagates through the scope hierarchy, this property is set to null.
         */
        currentScope: IScope;
        /**
         * name of the event.
         */
        name: string;
        /**
         * calling stopPropagation function will cancel further event propagation (available only for events that were $emit-ed).
         */
        stopPropagation?: Function;
        /**
         * calling preventDefault sets defaultPrevented flag to true.
         */
        preventDefault: Function;
        /**
         * true if preventDefault was called.
         */
        defaultPrevented: boolean;
    }

    ///////////////////////////////////////////////////////////////////////////
    // WindowService
    // see http://docs.angularjs.org/api/ng.$window
    ///////////////////////////////////////////////////////////////////////////
    interface IWindowService extends Window {
        [key: string]: any;
    }

    ///////////////////////////////////////////////////////////////////////////
    // BrowserService
    // TODO undocumented, so we need to get it from the source code
    ///////////////////////////////////////////////////////////////////////////
    interface IBrowserService {
        defer: angular.ITimeoutService;
        [key: string]: any;
    }

    ///////////////////////////////////////////////////////////////////////////
    // TimeoutService
    // see http://docs.angularjs.org/api/ng.$timeout
    ///////////////////////////////////////////////////////////////////////////
    interface ITimeoutService {
        <T>(func: (...args: any[]) => T, delay?: number, invokeApply?: boolean): IPromise<T>;
        cancel(promise: IPromise<any>): boolean;
    }

    ///////////////////////////////////////////////////////////////////////////
    // IntervalService
    // see http://docs.angularjs.org/api/ng.$interval
    ///////////////////////////////////////////////////////////////////////////
    interface IIntervalService {
        (func: Function, delay: number, count?: number, invokeApply?: boolean): IPromise<any>;
        cancel(promise: IPromise<any>): boolean;
    }

    ///////////////////////////////////////////////////////////////////////////
    // AngularProvider
    // see http://docs.angularjs.org/api/ng/provider/$animateProvider
    ///////////////////////////////////////////////////////////////////////////
    interface IAnimateProvider {
        /**
         * Registers a new injectable animation factory function.
         *
         * @param name The name of the animation.
         * @param factory The factory function that will be executed to return the animation object.
         */
        register(name: string, factory: () => IAnimateCallbackObject): void;

        /**
         * Gets and/or sets the CSS class expression that is checked when performing an animation.
         *
         * @param expression The className expression which will be checked against all animations.
         * @returns The current CSS className expression value. If null then there is no expression value.
         */
        classNameFilter(expression?: RegExp): RegExp;
    }

    /**
     * The animation object which contains callback functions for each event that is expected to be animated.
     */
    interface IAnimateCallbackObject {
        eventFn(element: Node, doneFn: () => void): Function;
    }

    /**
     * $filter - $filterProvider - service in module ng
     *
     * Filters are used for formatting data displayed to the user.
     *
     * see https://docs.angularjs.org/api/ng/service/$filter
     */
    interface IFilterService {
        /**
         * Usage:
         * $filter(name);
         *
         * @param name Name of the filter function to retrieve
         */
        (name: string): Function;
    }

    /**
     * $filterProvider - $filter - provider in module ng
     *
     * Filters are just functions which transform input to an output. However filters need to be Dependency Injected. To achieve this a filter definition consists of a factory function which is annotated with dependencies and is responsible for creating a filter function.
     *
     * see https://docs.angularjs.org/api/ng/provider/$filterProvider
     */
    interface IFilterProvider extends IServiceProvider {
        /**
         * register(name);
         *
         * @param name Name of the filter function, or an object map of filters where the keys are the filter names and the values are the filter factories. Note: Filter names must be valid angular Expressions identifiers, such as uppercase or orderBy. Names with special characters, such as hyphens and dots, are not allowed. If you wish to namespace your filters, then you can use capitalization (myappSubsectionFilterx) or underscores (myapp_subsection_filterx).
         */
        register(name: string | {}): IServiceProvider;
    }

    ///////////////////////////////////////////////////////////////////////////
    // LocaleService
    // see http://docs.angularjs.org/api/ng.$locale
    ///////////////////////////////////////////////////////////////////////////
    interface ILocaleService {
        id: string;

        // These are not documented
        // Check angular's i18n files for exemples
        NUMBER_FORMATS: ILocaleNumberFormatDescriptor;
        DATETIME_FORMATS: ILocaleDateTimeFormatDescriptor;
        pluralCat: (num: any) => string;
    }

    interface ILocaleNumberFormatDescriptor {
        DECIMAL_SEP: string;
        GROUP_SEP: string;
        PATTERNS: ILocaleNumberPatternDescriptor[];
        CURRENCY_SYM: string;
    }

    interface ILocaleNumberPatternDescriptor {
        minInt: number;
        minFrac: number;
        maxFrac: number;
        posPre: string;
        posSuf: string;
        negPre: string;
        negSuf: string;
        gSize: number;
        lgSize: number;
    }

    interface ILocaleDateTimeFormatDescriptor {
        MONTH: string[];
        SHORTMONTH: string[];
        DAY: string[];
        SHORTDAY: string[];
        AMPMS: string[];
        medium: string;
        short: string;
        fullDate: string;
        longDate: string;
        mediumDate: string;
        shortDate: string;
        mediumTime: string;
        shortTime: string;
    }

    ///////////////////////////////////////////////////////////////////////////
    // LogService
    // see http://docs.angularjs.org/api/ng.$log
    // see http://docs.angularjs.org/api/ng.$logProvider
    ///////////////////////////////////////////////////////////////////////////
    interface ILogService {
        debug: ILogCall;
        error: ILogCall;
        info: ILogCall;
        log: ILogCall;
        warn: ILogCall;
    }

    interface ILogProvider extends IServiceProvider {
        debugEnabled(): boolean;
        debugEnabled(enabled: boolean): ILogProvider;
    }

    // We define this as separate interface so we can reopen it later for
    // the ngMock module.
    interface ILogCall {
        (...args: any[]): void;
    }

    ///////////////////////////////////////////////////////////////////////////
    // ParseService
    // see http://docs.angularjs.org/api/ng.$parse
    // see http://docs.angularjs.org/api/ng.$parseProvider
    ///////////////////////////////////////////////////////////////////////////
    interface IParseService {
        (expression: string): ICompiledExpression;
    }

    interface IParseProvider {
        logPromiseWarnings(): boolean;
        logPromiseWarnings(value: boolean): IParseProvider;

        unwrapPromises(): boolean;
        unwrapPromises(value: boolean): IParseProvider;
    }

    interface ICompiledExpression {
        (context: any, locals?: any): any;

        // If value is not provided, undefined is gonna be used since the implementation
        // does not check the parameter. Let's force a value for consistency. If consumer
        // whants to undefine it, pass the undefined value explicitly.
        assign(context: any, value: any): any;
    }

    /**
     * $location - $locationProvider - service in module ng
     * see https://docs.angularjs.org/api/ng/service/$location
     */
    interface ILocationService {
        absUrl(): string;
        hash(): string;
        hash(newHash: string): ILocationService;
        host(): string;

        /**
         * Return path of current url
         */
        path(): string;

        /**
         * Change path when called with parameter and return $location.
         * Note: Path should always begin with forward slash (/), this method will add the forward slash if it is missing.
         *
         * @param path New path
         */
        path(path: string): ILocationService;

        port(): number;
        protocol(): string;
        replace(): ILocationService;

        /**
         * Return search part (as object) of current url
         */
        search(): any;

        /**
         * Change search part when called with parameter and return $location.
         *
         * @param search When called with a single argument the method acts as a setter, setting the search component of $location to the specified value.
         *
         * If the argument is a hash object containing an array of values, these values will be encoded as duplicate search parameters in the url.
         */
        search(search: any): ILocationService;

        /**
         * Change search part when called with parameter and return $location.
         *
         * @param search New search params
         * @param paramValue If search is a string or a Number, then paramValue will override only a single search property. If paramValue is null, the property specified via the first argument will be deleted. If paramValue is an array, it will override the property of the search component of $location specified via the first argument. If paramValue is true, the property specified via the first argument will be added with no value nor trailing equal sign.
         */
        search(search: string, paramValue: string|number|string[]|boolean): ILocationService;

        state(): any;
        state(state: any): ILocationService;
        url(): string;
        url(url: string): ILocationService;
    }

    interface ILocationProvider extends IServiceProvider {
        hashPrefix(): string;
        hashPrefix(prefix: string): ILocationProvider;
        html5Mode(): boolean;

        // Documentation states that parameter is string, but
        // implementation tests it as boolean, which makes more sense
        // since this is a toggler
        html5Mode(active: boolean): ILocationProvider;
        html5Mode(mode: { enabled?: boolean; requireBase?: boolean; rewriteLinks?: boolean; }): ILocationProvider;
    }

    ///////////////////////////////////////////////////////////////////////////
    // DocumentService
    // see http://docs.angularjs.org/api/ng.$document
    ///////////////////////////////////////////////////////////////////////////
    interface IDocumentService extends IAugmentedJQuery {}

    ///////////////////////////////////////////////////////////////////////////
    // ExceptionHandlerService
    // see http://docs.angularjs.org/api/ng.$exceptionHandler
    ///////////////////////////////////////////////////////////////////////////
    interface IExceptionHandlerService {
        (exception: Error, cause?: string): void;
    }

    ///////////////////////////////////////////////////////////////////////////
    // RootElementService
    // see http://docs.angularjs.org/api/ng.$rootElement
    ///////////////////////////////////////////////////////////////////////////
    interface IRootElementService extends JQuery {}

    interface IQResolveReject<T> {
        (): void;
        (value: T): void;
    }
    /**
     * $q - service in module ng
     * A promise/deferred implementation inspired by Kris Kowal's Q.
     * See http://docs.angularjs.org/api/ng/service/$q
     */
    interface IQService {
        new <T>(resolver: (resolve: IQResolveReject<T>) => any): IPromise<T>;
        new <T>(resolver: (resolve: IQResolveReject<T>, reject: IQResolveReject<any>) => any): IPromise<T>;

        /**
         * Combines multiple promises into a single promise that is resolved when all of the input promises are resolved.
         *
         * Returns a single promise that will be resolved with an array of values, each value corresponding to the promise at the same index in the promises array. If any of the promises is resolved with a rejection, this resulting promise will be rejected with the same rejection value.
         *
         * @param promises An array of promises.
         */
        all<T>(promises: IPromise<any>[]): IPromise<T[]>;
        /**
         * Combines multiple promises into a single promise that is resolved when all of the input promises are resolved.
         *
         * Returns a single promise that will be resolved with a hash of values, each value corresponding to the promise at the same key in the promises hash. If any of the promises is resolved with a rejection, this resulting promise will be rejected with the same rejection value.
         *
         * @param promises A hash of promises.
         */
        all(promises: { [id: string]: IPromise<any>; }): IPromise<{ [id: string]: any; }>;
        all<T extends {}>(promises: { [id: string]: IPromise<any>; }): IPromise<T>;
        /**
         * Creates a Deferred object which represents a task which will finish in the future.
         */
        defer<T>(): IDeferred<T>;
        /**
         * Creates a promise that is resolved as rejected with the specified reason. This api should be used to forward rejection in a chain of promises. If you are dealing with the last promise in a promise chain, you don't need to worry about it.
         *
         * When comparing deferreds/promises to the familiar behavior of try/catch/throw, think of reject as the throw keyword in JavaScript. This also means that if you "catch" an error via a promise error callback and you want to forward the error to the promise derived from the current promise, you have to "rethrow" the error by returning a rejection constructed via reject.
         *
         * @param reason Constant, message, exception or an object representing the rejection reason.
         */
        reject(reason?: any): IPromise<any>;
        /**
         * Wraps an object that might be a value or a (3rd party) then-able promise into a $q promise. This is useful when you are dealing with an object that might or might not be a promise, or if the promise comes from a source that can't be trusted.
         *
         * @param value Value or a promise
         */
        when<T>(value: IPromise<T>|T): IPromise<T>;
        /**
         * Wraps an object that might be a value or a (3rd party) then-able promise into a $q promise. This is useful when you are dealing with an object that might or might not be a promise, or if the promise comes from a source that can't be trusted.
         *
         * @param value Value or a promise
         */
        when(): IPromise<void>;
    }

    interface IPromise<T> {
        /**
         * Regardless of when the promise was or will be resolved or rejected, then calls one of the success or error callbacks asynchronously as soon as the result is available. The callbacks are called with a single argument: the result or rejection reason. Additionally, the notify callback may be called zero or more times to provide a progress indication, before the promise is resolved or rejected.
         * The successCallBack may return IPromise<void> for when a $q.reject() needs to be returned
         * This method returns a new promise which is resolved or rejected via the return value of the successCallback, errorCallback. It also notifies via the return value of the notifyCallback method. The promise can not be resolved or rejected from the notifyCallback method.
         */
        then<TResult>(successCallback: (promiseValue: T) => IHttpPromise<TResult>|IPromise<TResult>|TResult|IPromise<void>, errorCallback?: (reason: any) => any, notifyCallback?: (state: any) => any): IPromise<TResult>;

        /**
         * Shorthand for promise.then(null, errorCallback)
         */
        catch<TResult>(onRejected: (reason: any) => IHttpPromise<TResult>|IPromise<TResult>|TResult): IPromise<TResult>;

        /**
         * Allows you to observe either the fulfillment or rejection of a promise, but to do so without modifying the final value. This is useful to release resources or do some clean-up that needs to be done whether the promise was rejected or resolved. See the full specification for more information.
         *
         * Because finally is a reserved word in JavaScript and reserved keywords are not supported as property names by ES3, you'll need to invoke the method like promise['finally'](callback) to make your code IE8 and Android 2.x compatible.
         */
        finally<TResult>(finallyCallback: () => any): IPromise<TResult>;
    }

    interface IDeferred<T> {
        resolve(value?: T): void;
        reject(reason?: any): void;
        notify(state?: any): void;
        promise: IPromise<T>;
    }

    ///////////////////////////////////////////////////////////////////////////
    // AnchorScrollService
    // see http://docs.angularjs.org/api/ng.$anchorScroll
    ///////////////////////////////////////////////////////////////////////////
    interface IAnchorScrollService {
        (): void;
        (hash: string): void;
        yOffset: any;
    }

    interface IAnchorScrollProvider extends IServiceProvider {
        disableAutoScrolling(): void;
    }

    /**
     * $cacheFactory - service in module ng
     *
     * Factory that constructs Cache objects and gives access to them.
     *
     * see https://docs.angularjs.org/api/ng/service/$cacheFactory
     */
    interface ICacheFactoryService {
        /**
         * Factory that constructs Cache objects and gives access to them.
         *
         * @param cacheId Name or id of the newly created cache.
         * @param optionsMap Options object that specifies the cache behavior. Properties:
         *
         * capacity — turns the cache into LRU cache.
         */
        (cacheId: string, optionsMap?: { capacity?: number; }): ICacheObject;

        /**
         * Get information about all the caches that have been created.
         * @returns key-value map of cacheId to the result of calling cache#info
         */
        info(): any;

        /**
         * Get access to a cache object by the cacheId used when it was created.
         *
         * @param cacheId Name or id of a cache to access.
         */
        get(cacheId: string): ICacheObject;
    }

    /**
     * $cacheFactory.Cache - type in module ng
     *
     * A cache object used to store and retrieve data, primarily used by $http and the script directive to cache templates and other data.
     *
     * see https://docs.angularjs.org/api/ng/type/$cacheFactory.Cache
     */
    interface ICacheObject {
        /**
         * Retrieve information regarding a particular Cache.
         */
        info(): {
            /**
             * the id of the cache instance
             */
            id: string;

            /**
             * the number of entries kept in the cache instance
             */
            size: number;

            //...: any additional properties from the options object when creating the cache.
        };

        /**
         * Inserts a named entry into the Cache object to be retrieved later, and incrementing the size of the cache if the key was not already present in the cache. If behaving like an LRU cache, it will also remove stale entries from the set.
         *
         * It will not insert undefined values into the cache.
         *
         * @param key the key under which the cached data is stored.
         * @param value the value to store alongside the key. If it is undefined, the key will not be stored.
         */
        put<T>(key: string, value?: T): T;

        /**
         * Retrieves named data stored in the Cache object.
         *
         * @param key the key of the data to be retrieved
         */
        get<T>(key: string): T;

        /**
         * Removes an entry from the Cache object.
         *
         * @param key the key of the entry to be removed
         */
        remove(key: string): void;

        /**
         * Clears the cache object of any entries.
         */
        removeAll(): void;

        /**
         * Destroys the Cache object entirely, removing it from the $cacheFactory set.
         */
        destroy(): void;
    }

    ///////////////////////////////////////////////////////////////////////////
    // CompileService
    // see http://docs.angularjs.org/api/ng.$compile
    // see http://docs.angularjs.org/api/ng.$compileProvider
    ///////////////////////////////////////////////////////////////////////////
    interface ICompileService {
        (element: string, transclude?: ITranscludeFunction, maxPriority?: number): ITemplateLinkingFunction;
        (element: Element, transclude?: ITranscludeFunction, maxPriority?: number): ITemplateLinkingFunction;
        (element: JQuery, transclude?: ITranscludeFunction, maxPriority?: number): ITemplateLinkingFunction;
    }

    interface ICompileProvider extends IServiceProvider {
        directive(name: string, directiveFactory: Function): ICompileProvider;

        // Undocumented, but it is there...
        directive(directivesMap: any): ICompileProvider;

        aHrefSanitizationWhitelist(): RegExp;
        aHrefSanitizationWhitelist(regexp: RegExp): ICompileProvider;

        imgSrcSanitizationWhitelist(): RegExp;
        imgSrcSanitizationWhitelist(regexp: RegExp): ICompileProvider;

        debugInfoEnabled(enabled?: boolean): any;
    }

    interface ICloneAttachFunction {
        // Let's hint but not force cloneAttachFn's signature
        (clonedElement?: JQuery, scope?: IScope): any;
    }

    // This corresponds to the "publicLinkFn" returned by $compile.
    interface ITemplateLinkingFunction {
        (scope: IScope, cloneAttachFn?: ICloneAttachFunction): IAugmentedJQuery;
    }

    // This corresponds to $transclude (and also the transclude function passed to link).
    interface ITranscludeFunction {
        // If the scope is provided, then the cloneAttachFn must be as well.
        (scope: IScope, cloneAttachFn: ICloneAttachFunction): IAugmentedJQuery;
        // If one argument is provided, then it's assumed to be the cloneAttachFn.
        (cloneAttachFn?: ICloneAttachFunction): IAugmentedJQuery;
    }

    ///////////////////////////////////////////////////////////////////////////
    // ControllerService
    // see http://docs.angularjs.org/api/ng.$controller
    // see http://docs.angularjs.org/api/ng.$controllerProvider
    ///////////////////////////////////////////////////////////////////////////
    interface IControllerService {
        // Although the documentation doesn't state this, locals are optional
        (controllerConstructor: Function, locals?: any, bindToController?: any): any;
        (controllerName: string, locals?: any, bindToController?: any): any;
    }

    interface IControllerProvider extends IServiceProvider {
        register(name: string, controllerConstructor: Function): void;
        register(name: string, dependencyAnnotatedConstructor: any[]): void;
        allowGlobals(): void;
    }

    /**
     * HttpService
     * see http://docs.angularjs.org/api/ng/service/$http
     */
    interface IHttpService {
        /**
         * Object describing the request to be made and how it should be processed.
         */
        <T>(config: IRequestConfig): IHttpPromise<T>;

        /**
         * Shortcut method to perform GET request.
         *
         * @param url Relative or absolute URL specifying the destination of the request
         * @param config Optional configuration object
         */
        get<T>(url: string, config?: IRequestShortcutConfig): IHttpPromise<T>;

        /**
         * Shortcut method to perform DELETE request.
         *
         * @param url Relative or absolute URL specifying the destination of the request
         * @param config Optional configuration object
         */
        delete<T>(url: string, config?: IRequestShortcutConfig): IHttpPromise<T>;

        /**
         * Shortcut method to perform HEAD request.
         *
         * @param url Relative or absolute URL specifying the destination of the request
         * @param config Optional configuration object
         */
        head<T>(url: string, config?: IRequestShortcutConfig): IHttpPromise<T>;

        /**
         * Shortcut method to perform JSONP request.
         *
         * @param url Relative or absolute URL specifying the destination of the request
         * @param config Optional configuration object
         */
        jsonp<T>(url: string, config?: IRequestShortcutConfig): IHttpPromise<T>;

        /**
         * Shortcut method to perform POST request.
         *
         * @param url Relative or absolute URL specifying the destination of the request
         * @param data Request content
         * @param config Optional configuration object
         */
        post<T>(url: string, data: any, config?: IRequestShortcutConfig): IHttpPromise<T>;

        /**
         * Shortcut method to perform PUT request.
         *
         * @param url Relative or absolute URL specifying the destination of the request
         * @param data Request content
         * @param config Optional configuration object
         */
        put<T>(url: string, data: any, config?: IRequestShortcutConfig): IHttpPromise<T>;

        /**
         * Shortcut method to perform PATCH request.
         *
         * @param url Relative or absolute URL specifying the destination of the request
         * @param data Request content
         * @param config Optional configuration object
         */
        patch<T>(url: string, data: any, config?: IRequestShortcutConfig): IHttpPromise<T>;

        /**
         * Runtime equivalent of the $httpProvider.defaults property. Allows configuration of default headers, withCredentials as well as request and response transformations.
         */
        defaults: IRequestConfig;

        /**
         * Array of config objects for currently pending requests. This is primarily meant to be used for debugging purposes.
         */
        pendingRequests: any[];
    }

    /**
     * Object describing the request to be made and how it should be processed.
     * see http://docs.angularjs.org/api/ng/service/$http#usage
     */
    interface IRequestShortcutConfig {
        /**
         * {Object.<string|Object>}
         * Map of strings or objects which will be turned to ?key1=value1&key2=value2 after the url. If the value is not a string, it will be JSONified.
         */
        params?: any;

        /**
         * Map of strings or functions which return strings representing HTTP headers to send to the server. If the return value of a function is null, the header will not be sent.
         */
        headers?: any;

        /**
         * Name of HTTP header to populate with the XSRF token.
         */
        xsrfHeaderName?: string;

        /**
         * Name of cookie containing the XSRF token.
         */
        xsrfCookieName?: string;

        /**
         * {boolean|Cache}
         * If true, a default $http cache will be used to cache the GET request, otherwise if a cache instance built with $cacheFactory, this cache will be used for caching.
         */
        cache?: any;

        /**
         * whether to to set the withCredentials flag on the XHR object. See [requests with credentials]https://developer.mozilla.org/en/http_access_control#section_5 for more information.
         */
        withCredentials?: boolean;

        /**
         * {string|Object}
         * Data to be sent as the request message data.
         */
        data?: any;

        /**
         * {function(data, headersGetter)|Array.<function(data, headersGetter)>}
         * Transform function or an array of such functions. The transform function takes the http request body and headers and returns its transformed (typically serialized) version.
         */
        transformRequest?: any;

        /**
         * {function(data, headersGetter)|Array.<function(data, headersGetter)>}
         * Transform function or an array of such functions. The transform function takes the http response body and headers and returns its transformed (typically deserialized) version.
         */
        transformResponse?: any;

        /**
         * {number|Promise}
         * Timeout in milliseconds, or promise that should abort the request when resolved.
         */
        timeout?: any;

        /**
         * See requestType.
         */
        responseType?: string;
    }

    /**
     * Object describing the request to be made and how it should be processed.
     * see http://docs.angularjs.org/api/ng/service/$http#usage
     */
    interface IRequestConfig extends IRequestShortcutConfig {
        /**
         * HTTP method (e.g. 'GET', 'POST', etc)
         */
        method: string;
        /**
         * Absolute or relative URL of the resource that is being requested.
         */
        url: string;
    }

    interface IHttpHeadersGetter {
        (): { [name: string]: string; };
        (headerName: string): string;
    }

    interface IHttpPromiseCallback<T> {
        (data: T, status: number, headers: IHttpHeadersGetter, config: IRequestConfig): void;
    }

    interface IHttpPromiseCallbackArg<T> {
        data?: T;
        status?: number;
        headers?: IHttpHeadersGetter;
        config?: IRequestConfig;
        statusText?: string;
    }

    interface IHttpPromise<T> extends IPromise<IHttpPromiseCallbackArg<T>> {
        success(callback: IHttpPromiseCallback<T>): IHttpPromise<T>;
        error(callback: IHttpPromiseCallback<any>): IHttpPromise<T>;
        then<TResult>(successCallback: (response: IHttpPromiseCallbackArg<T>) => IPromise<TResult>|TResult, errorCallback?: (response: IHttpPromiseCallbackArg<any>) => any): IPromise<TResult>;
    }

    /**
    * Object that controls the defaults for $http provider
    * https://docs.angularjs.org/api/ng/service/$http#defaults
    */
    interface IHttpProviderDefaults {
        cache?: boolean;
        /**
         * Transform function or an array of such functions. The transform function takes the http request body and
         * headers and returns its transformed (typically serialized) version.
         */
        transformRequest?: ((data: any, headersGetter?: any) => any)|((data: any, headersGetter?: any) => any)[];
        xsrfCookieName?: string;
        xsrfHeaderName?: string;
        withCredentials?: boolean;
        headers?: {
            common?: any;
            post?: any;
            put?: any;
            patch?: any;
        }
    }

    interface IHttpProvider extends IServiceProvider {
        defaults: IHttpProviderDefaults;
        interceptors: any[];
        useApplyAsync(): boolean;
        useApplyAsync(value: boolean): IHttpProvider;
    }

    ///////////////////////////////////////////////////////////////////////////
    // HttpBackendService
    // see http://docs.angularjs.org/api/ng.$httpBackend
    // You should never need to use this service directly.
    ///////////////////////////////////////////////////////////////////////////
    interface IHttpBackendService {
        // XXX Perhaps define callback signature in the future
        (method: string, url: string, post?: any, callback?: Function, headers?: any, timeout?: number, withCredentials?: boolean): void;
    }

    ///////////////////////////////////////////////////////////////////////////
    // InterpolateService
    // see http://docs.angularjs.org/api/ng.$interpolate
    // see http://docs.angularjs.org/api/ng.$interpolateProvider
    ///////////////////////////////////////////////////////////////////////////
    interface IInterpolateService {
        (text: string, mustHaveExpression?: boolean, trustedContext?: string, allOrNothing?: boolean): IInterpolationFunction;
        endSymbol(): string;
        startSymbol(): string;
    }

    interface IInterpolationFunction {
        (context: any): string;
    }

    interface IInterpolateProvider extends IServiceProvider {
        startSymbol(): string;
        startSymbol(value: string): IInterpolateProvider;
        endSymbol(): string;
        endSymbol(value: string): IInterpolateProvider;
    }

    ///////////////////////////////////////////////////////////////////////////
    // TemplateCacheService
    // see http://docs.angularjs.org/api/ng.$templateCache
    ///////////////////////////////////////////////////////////////////////////
    interface ITemplateCacheService extends ICacheObject {}

    ///////////////////////////////////////////////////////////////////////////
    // SCEService
    // see http://docs.angularjs.org/api/ng.$sce
    ///////////////////////////////////////////////////////////////////////////
    interface ISCEService {
        getTrusted(type: string, mayBeTrusted: any): any;
        getTrustedCss(value: any): any;
        getTrustedHtml(value: any): any;
        getTrustedJs(value: any): any;
        getTrustedResourceUrl(value: any): any;
        getTrustedUrl(value: any): any;
        parse(type: string, expression: string): (context: any, locals: any) => any;
        parseAsCss(expression: string): (context: any, locals: any) => any;
        parseAsHtml(expression: string): (context: any, locals: any) => any;
        parseAsJs(expression: string): (context: any, locals: any) => any;
        parseAsResourceUrl(expression: string): (context: any, locals: any) => any;
        parseAsUrl(expression: string): (context: any, locals: any) => any;
        trustAs(type: string, value: any): any;
        trustAsHtml(value: any): any;
        trustAsJs(value: any): any;
        trustAsResourceUrl(value: any): any;
        trustAsUrl(value: any): any;
        isEnabled(): boolean;
    }

    ///////////////////////////////////////////////////////////////////////////
    // SCEProvider
    // see http://docs.angularjs.org/api/ng.$sceProvider
    ///////////////////////////////////////////////////////////////////////////
    interface ISCEProvider extends IServiceProvider {
        enabled(value: boolean): void;
    }

    ///////////////////////////////////////////////////////////////////////////
    // SCEDelegateService
    // see http://docs.angularjs.org/api/ng.$sceDelegate
    ///////////////////////////////////////////////////////////////////////////
    interface ISCEDelegateService {
        getTrusted(type: string, mayBeTrusted: any): any;
        trustAs(type: string, value: any): any;
        valueOf(value: any): any;
    }


    ///////////////////////////////////////////////////////////////////////////
    // SCEDelegateProvider
    // see http://docs.angularjs.org/api/ng.$sceDelegateProvider
    ///////////////////////////////////////////////////////////////////////////
    interface ISCEDelegateProvider extends IServiceProvider {
        resourceUrlBlacklist(blacklist: any[]): void;
        resourceUrlWhitelist(whitelist: any[]): void;
        resourceUrlBlacklist(): any[];
        resourceUrlWhitelist(): any[];
    }

    /**
     * $templateRequest service
     * see http://docs.angularjs.org/api/ng/service/$templateRequest
     */
    interface ITemplateRequestService {
        /**
         * Downloads a template using $http and, upon success, stores the
         * contents inside of $templateCache.
         *
         * If the HTTP request fails or the response data of the HTTP request is
         * empty then a $compile error will be thrown (unless
         * {ignoreRequestError} is set to true).
         *
         * @param tpl                  The template URL.
         * @param ignoreRequestError   Whether or not to ignore the exception
         *                             when the request fails or the template is
         *                             empty.
         *
         * @return   A promise whose value is the template content.
         */
        (tpl: string, ignoreRequestError?: boolean): IPromise<string>;
        /**
         * total amount of pending template requests being downloaded.
         * @type {number}
         */
        totalPendingRequests: number;
    }

    ///////////////////////////////////////////////////////////////////////////
    // Directive
    // see http://docs.angularjs.org/api/ng.$compileProvider#directive
    // and http://docs.angularjs.org/guide/directive
    ///////////////////////////////////////////////////////////////////////////

    interface IDirectiveFactory {
        (...args: any[]): IDirective;
    }

    interface IDirectiveLinkFn {
        (
            scope: IScope,
            instanceElement: IAugmentedJQuery,
            instanceAttributes: IAttributes,
            controller: {},
            transclude: ITranscludeFunction
        ): void;
    }

    interface IDirectivePrePost {
        pre?: IDirectiveLinkFn;
        post?: IDirectiveLinkFn;
    }

    interface IDirectiveCompileFn {
        (
            templateElement: IAugmentedJQuery,
            templateAttributes: IAttributes,
            transclude: ITranscludeFunction
        ): IDirectivePrePost;
    }

    interface IDirective {
        compile?: IDirectiveCompileFn;
        controller?: any;
        controllerAs?: string;
        bindToController?: boolean|Object;
        link?: IDirectiveLinkFn | IDirectivePrePost;
        name?: string;
        priority?: number;
        replace?: boolean;
        require?: any;
        restrict?: string;
        scope?: any;
        template?: any;
        templateUrl?: any;
        terminal?: boolean;
        transclude?: any;
    }

    /**
     * angular.element
     * when calling angular.element, angular returns a jQuery object,
     * augmented with additional methods like e.g. scope.
     * see: http://docs.angularjs.org/api/angular.element
     */
    interface IAugmentedJQueryStatic extends JQueryStatic {
        (selector: string, context?: any): IAugmentedJQuery;
        (element: Element): IAugmentedJQuery;
        (object: {}): IAugmentedJQuery;
        (elementArray: Element[]): IAugmentedJQuery;
        (object: JQuery): IAugmentedJQuery;
        (func: Function): IAugmentedJQuery;
        (array: any[]): IAugmentedJQuery;
        (): IAugmentedJQuery;
    }

    interface IAugmentedJQuery extends JQuery {
        // TODO: events, how to define?
        //$destroy

        find(selector: string): IAugmentedJQuery;
        find(element: any): IAugmentedJQuery;
        find(obj: JQuery): IAugmentedJQuery;
        controller(): any;
        controller(name: string): any;
        injector(): any;
        scope(): IScope;
        isolateScope(): IScope;

        inheritedData(key: string, value: any): JQuery;
        inheritedData(obj: { [key: string]: any; }): JQuery;
        inheritedData(key?: string): any;
    }

    ///////////////////////////////////////////////////////////////////////
    // AnimateService
    // see http://docs.angularjs.org/api/ng.$animate
    ///////////////////////////////////////////////////////////////////////
    interface IAnimateService {
        addClass(element: JQuery, className: string, done?: Function): IPromise<any>;
        enter(element: JQuery, parent: JQuery, after: JQuery, done?: Function): void;
        leave(element: JQuery, done?: Function): void;
        move(element: JQuery, parent: JQuery, after: JQuery, done?: Function): void;
        removeClass(element: JQuery, className: string, done?: Function): void;
    }

    ///////////////////////////////////////////////////////////////////////////
    // AUTO module (angular.js)
    ///////////////////////////////////////////////////////////////////////////
    export module auto {

        ///////////////////////////////////////////////////////////////////////
        // InjectorService
        // see http://docs.angularjs.org/api/AUTO.$injector
        ///////////////////////////////////////////////////////////////////////
        interface IInjectorService {
            annotate(fn: Function): string[];
            annotate(inlineAnnotatedFunction: any[]): string[];
            get<T>(name: string): T;
            has(name: string): boolean;
            instantiate<T>(typeConstructor: Function, locals?: any): T;
            invoke(inlineAnnotatedFunction: any[]): any;
            invoke(func: Function, context?: any, locals?: any): any;
        }

        ///////////////////////////////////////////////////////////////////////
        // ProvideService
        // see http://docs.angularjs.org/api/AUTO.$provide
        ///////////////////////////////////////////////////////////////////////
        interface IProvideService {
            // Documentation says it returns the registered instance, but actual
            // implementation does not return anything.
            // constant(name: string, value: any): any;
            /**
             * Register a constant service, such as a string, a number, an array, an object or a function, with the $injector. Unlike value it can be injected into a module configuration function (see config) and it cannot be overridden by an Angular decorator.
             *
             * @param name The name of the constant.
             * @param value The constant value.
             */
            constant(name: string, value: any): void;

            /**
             * Register a service decorator with the $injector. A service decorator intercepts the creation of a service, allowing it to override or modify the behaviour of the service. The object returned by the decorator may be the original service, or a new service object which replaces or wraps and delegates to the original service.
             *
             * @param name The name of the service to decorate.
             * @param decorator This function will be invoked when the service needs to be instantiated and should return the decorated service instance. The function is called using the injector.invoke method and is therefore fully injectable. Local injection arguments:
             *
             * $delegate - The original service instance, which can be monkey patched, configured, decorated or delegated to.
             */
            decorator(name: string, decorator: Function): void;
            /**
             * Register a service decorator with the $injector. A service decorator intercepts the creation of a service, allowing it to override or modify the behaviour of the service. The object returned by the decorator may be the original service, or a new service object which replaces or wraps and delegates to the original service.
             *
             * @param name The name of the service to decorate.
             * @param inlineAnnotatedFunction This function will be invoked when the service needs to be instantiated and should return the decorated service instance. The function is called using the injector.invoke method and is therefore fully injectable. Local injection arguments:
             *
             * $delegate - The original service instance, which can be monkey patched, configured, decorated or delegated to.
             */
            decorator(name: string, inlineAnnotatedFunction: any[]): void;
            factory(name: string, serviceFactoryFunction: Function): IServiceProvider;
            factory(name: string, inlineAnnotatedFunction: any[]): IServiceProvider;
            provider(name: string, provider: IServiceProvider): IServiceProvider;
            provider(name: string, serviceProviderConstructor: Function): IServiceProvider;
            service(name: string, constructor: Function): IServiceProvider;
            value(name: string, value: any): IServiceProvider;
        }

    }
}
// Type definitions for Angular JS 1.3 (ngResource module)
// Project: http://angularjs.org
// Definitions by: Diego Vilar <http://github.com/diegovilar>, Michael Jess <http://github.com/miffels>
// Definitions: https://github.com/daptiv/DefinitelyTyped

/// <reference path="angular.d.ts" />


///////////////////////////////////////////////////////////////////////////////
// ngResource module (angular-resource.js)
///////////////////////////////////////////////////////////////////////////////
declare module angular.resource {

    /**
     * Currently supported options for the $resource factory options argument.
     */
    interface IResourceOptions {
        /**
         * If true then the trailing slashes from any calculated URL will be stripped (defaults to true)
         */
        stripTrailingSlashes?: boolean;
    }


    ///////////////////////////////////////////////////////////////////////////
    // ResourceService
    // see http://docs.angularjs.org/api/ngResource.$resource
    // Most part of the following definitions were achieved by analyzing the
    // actual implementation, since the documentation doesn't seem to cover
    // that deeply.
    ///////////////////////////////////////////////////////////////////////////
    interface IResourceService {
        (url: string, paramDefaults?: any,
            /** example:  {update: { method: 'PUT' }, delete: deleteDescriptor }
             where deleteDescriptor : IActionDescriptor */
            actions?: any, options?: IResourceOptions): IResourceClass<IResource<any>>;
        <T, U>(url: string, paramDefaults?: any,
            /** example:  {update: { method: 'PUT' }, delete: deleteDescriptor }
             where deleteDescriptor : IActionDescriptor */
            actions?: any, options?: IResourceOptions): U;
        <T>(url: string, paramDefaults?: any,
            /** example:  {update: { method: 'PUT' }, delete: deleteDescriptor }
             where deleteDescriptor : IActionDescriptor */
            actions?: any, options?: IResourceOptions): IResourceClass<T>;
    }

    // Just a reference to facilitate describing new actions
    interface IActionDescriptor {
        url?: string;
        method: string;
        isArray?: boolean;
        params?: any;
        headers?: any;
    }

    // Baseclass for everyresource with default actions.
    // If you define your new actions for the resource, you will need
    // to extend this interface and typecast the ResourceClass to it.
    //
    // In case of passing the first argument as anything but a function,
    // it's gonna be considered data if the action method is POST, PUT or
    // PATCH (in other words, methods with body). Otherwise, it's going
    // to be considered as parameters to the request.
    // https://github.com/angular/angular.js/blob/v1.2.0/src/ngResource/resource.js#L461-L465
    //
    // Only those methods with an HTTP body do have 'data' as first parameter:
    // https://github.com/angular/angular.js/blob/v1.2.0/src/ngResource/resource.js#L463
    // More specifically, those methods are POST, PUT and PATCH:
    // https://github.com/angular/angular.js/blob/v1.2.0/src/ngResource/resource.js#L432
    //
    // Also, static calls always return the IResource (or IResourceArray) retrieved
    // https://github.com/angular/angular.js/blob/v1.2.0/src/ngResource/resource.js#L538-L549
    interface IResourceClass<T> {
        new(dataOrParams? : any) : T;
        get(): T;
        get(params: Object): T;
        get(success: Function, error?: Function): T;
        get(params: Object, success: Function, error?: Function): T;
        get(params: Object, data: Object, success?: Function, error?: Function): T;

        query(): IResourceArray<T>;
        query(params: Object): IResourceArray<T>;
        query(success: Function, error?: Function): IResourceArray<T>;
        query(params: Object, success: Function, error?: Function): IResourceArray<T>;
        query(params: Object, data: Object, success?: Function, error?: Function): IResourceArray<T>;

        save(): T;
        save(data: Object): T;
        save(success: Function, error?: Function): T;
        save(data: Object, success: Function, error?: Function): T;
        save(params: Object, data: Object, success?: Function, error?: Function): T;

        remove(): T;
        remove(params: Object): T;
        remove(success: Function, error?: Function): T;
        remove(params: Object, success: Function, error?: Function): T;
        remove(params: Object, data: Object, success?: Function, error?: Function): T;

        delete(): T;
        delete(params: Object): T;
        delete(success: Function, error?: Function): T;
        delete(params: Object, success: Function, error?: Function): T;
        delete(params: Object, data: Object, success?: Function, error?: Function): T;
    }

    // Instance calls always return the the promise of the request which retrieved the object
    // https://github.com/angular/angular.js/blob/v1.2.0/src/ngResource/resource.js#L538-L546
    interface IResource<T> {
        $get(): angular.IPromise<T>;
        $get(params?: Object, success?: Function, error?: Function): angular.IPromise<T>;
        $get(success: Function, error?: Function): angular.IPromise<T>;

        $query(): angular.IPromise<IResourceArray<T>>;
        $query(params?: Object, success?: Function, error?: Function): angular.IPromise<IResourceArray<T>>;
        $query(success: Function, error?: Function): angular.IPromise<IResourceArray<T>>;

        $save(): angular.IPromise<T>;
        $save(params?: Object, success?: Function, error?: Function): angular.IPromise<T>;
        $save(success: Function, error?: Function): angular.IPromise<T>;

        $remove(): angular.IPromise<T>;
        $remove(params?: Object, success?: Function, error?: Function): angular.IPromise<T>;
        $remove(success: Function, error?: Function): angular.IPromise<T>;

        $delete(): angular.IPromise<T>;
        $delete(params?: Object, success?: Function, error?: Function): angular.IPromise<T>;
        $delete(success: Function, error?: Function): angular.IPromise<T>;

        /** the promise of the original server interaction that created this instance. **/
        $promise : angular.IPromise<T>;
        $resolved : boolean;
    }

    /**
     * Really just a regular Array object with $promise and $resolve attached to it
     */
    interface IResourceArray<T> extends Array<T> {
        /** the promise of the original server interaction that created this collection. **/
        $promise : angular.IPromise<IResourceArray<T>>;
        $resolved : boolean;
    }

    /** when creating a resource factory via IModule.factory */
    interface IResourceServiceFactoryFunction<T> {
        ($resource: angular.resource.IResourceService): IResourceClass<T>;
        <U extends IResourceClass<T>>($resource: angular.resource.IResourceService): U;
    }

    // IResourceServiceProvider used to configure global settings
    interface IResourceServiceProvider extends angular.IServiceProvider {

        defaults: IResourceOptions;
    }

}

/** extensions to base ng based on using angular-resource */
declare module angular {

    interface IModule {
        /** creating a resource service factory */
        factory(name: string, resourceServiceFactoryFunction: angular.resource.IResourceServiceFactoryFunction<any>): IModule;
    }
}

interface Array<T>
{
    /** the promise of the original server interaction that created this collection. **/
    $promise : angular.IPromise<Array<T>>;
    $resolved : boolean;
}
declare module 'higherframe-common/library/common' {
	/// <reference path="../typings/paper/paper.d.ts" />
	/// <reference path="../typings/angularjs/angular.d.ts" />
	/// <reference path="../typings/angularjs/angular-resource.d.ts" />
	/**
	 * The Common module
	 */
	export module Common {
	    module Drawing {
	    }
	}

}
declare module Common.Data {
    interface IArtboard extends ng.resource.IResource<IArtboard> {
        _id: string;
        frame: string;
        lastModifiedBy: string;
        name: string;
        width: number;
        height: number;
        left: number;
        top: number;
    }
    interface IArtboardResource extends ng.resource.IResourceClass<IArtboard> {
        update(IArtboard: any): IArtboard;
    }
    function ArtboardResource($resource: ng.resource.IResourceService): IArtboardResource;
}
declare module Common.Data {
    interface IComponentProperties {
        x: number;
        y: number;
        index: number;
    }
    interface ILabelProperties extends IComponentProperties {
        text: string;
        fontSize: number;
        fontWeight: number;
    }
    interface IRectangleProperties extends IComponentProperties {
        width: number;
        height: number;
        cornerRadius: number;
    }
    interface IArrowProperties extends IComponentProperties {
        start: Drawing.IPoint;
        end: Drawing.IPoint;
        direction: string;
        type: string;
    }
    interface IIPhoneProperties extends IComponentProperties {
    }
    interface IIPhoneTitlebarProperties extends IComponentProperties {
        time: String;
    }
    interface IMobileTitlebarProperties extends IComponentProperties {
        width: number;
        height: number;
        title: string;
        leftIcon: string;
        rightIcon: string;
    }
    interface ITextInputProperties extends IComponentProperties {
        width: number;
        placeholder: String;
        value: String;
        fontSize: number;
        fontWeight: number;
    }
    interface ICheckboxProperties extends IComponentProperties {
        label: String;
        value: Boolean;
        fontSize: number;
        fontWeight: number;
    }
    interface IButtonProperties extends IComponentProperties {
        label: string;
        width: number;
        height: number;
        type: string;
        disabled: boolean;
        cornerRadius: number;
        fontSize: number;
        fontWeight: number;
    }
    interface IImageProperties extends IComponentProperties {
        media: Object;
        width: number;
        height: number;
        cornerRadius: number;
    }
    interface IIconProperties extends IComponentProperties {
        icon: string;
        width: number;
        height: number;
        fontSize: number;
    }
}
declare module Common.Data {
    class Component implements IDrawingModel {
        _id: String;
        type: String;
        lastModifiedBy: String;
        properties: IComponentProperties;
        constructor(type: String, properties: IComponentProperties);
        /**
         * Create an instance from a POJO representation
         */
        static deserialize(data: any): Component;
    }
}
declare module Common.Data {
    interface IDrawingModel {
        _id: String;
        properties: IComponentProperties;
    }
}
declare module Common.Data {
    interface IMedia extends ng.resource.IResource<IMedia> {
        _id: string;
        created_at: string;
        updated_at: string;
        user: any;
        original: string;
    }
    interface IMediaResource extends ng.resource.IResourceClass<IMedia> {
        create(file: File): ng.IPromise<IMedia>;
    }
    function MediaResource($resource: ng.resource.IResourceService, $q: ng.IQService, $http: ng.IHttpService, FileUploader: any): IMediaResource;
}
declare module Common.Data {
    interface IUser {
        _id: String;
        color?: String;
    }
}
declare module Higherframe.Drawing {
    class Artboard extends paper.Group {
        model: Common.Data.IArtboard;
        name: string;
        width: number;
        height: number;
        left: number;
        top: number;
        hovered: boolean;
        active: boolean;
        focussed: boolean;
        constructor(model: Common.Data.IArtboard);
        private initFromModel();
        commit(): void;
        sync(): void;
        update(canvas: any): void;
    }
}
declare module Common.Drawing.Component {
    interface IComponentMoveEvent {
        position: paper.Point;
        delta: paper.Point;
    }
    /**
     * Defines the interface for a component which can be drawn on a
     * paperjs canvas
     *
     * @extends Paper.Group
     */
    interface IComponent extends paper.Group {
        id: Component.Type;
        title: String;
        preview?: String;
        category?: String;
        tags: Array<String>;
        thumbnail: String;
        model: Common.Data.IDrawingModel;
        deserialize?: () => void;
        serialize: () => Common.Data.IDrawingModel;
        update: () => void;
        updateModel: () => void;
        getSnapPoints: () => Array<SnapPoint>;
        getTransformHandles: (color: paper.Color) => Array<IDragHandle>;
        getDragHandles: (color: paper.Color) => Array<IDragHandle>;
        setProperty: (string, any) => void;
        onMove?: (IComponentMoveEvent) => void;
        hovered: Boolean;
        active: Boolean;
        focussed: Boolean;
        parts: any;
        collaborator: any;
        properties: Array<Object>;
        dragHandles: paper.Group;
        position: paper.Point;
        remove(): boolean;
    }
    /**
     * Provides boilerplate for creating components
     */
    class Base extends paper.Group implements IComponent {
        id: Component.Type;
        title: String;
        tags: Array<String>;
        thumbnail: String;
        resizable: Boolean;
        showBounds: Boolean;
        model: Common.Data.IDrawingModel;
        _hovered: Boolean;
        hovered: Boolean;
        _active: Boolean;
        active: Boolean;
        _focussed: Boolean;
        focussed: Boolean;
        _parts: {};
        parts: {};
        _collaborator: Common.Data.IUser;
        collaborator: Common.Data.IUser;
        _properties: Array<Object>;
        properties: Array<Object>;
        _boundingBox: paper.Group;
        boundingBox: paper.Group;
        _dragHandles: paper.Group;
        dragHandles: paper.Group;
        constructor(model: Common.Data.IDrawingModel);
        serialize(): Common.Data.IDrawingModel;
        setProperty(name: string, value: any): void;
        update(): void;
        updateModel(): void;
        getSnapPoints(): any[];
        getDragHandles(color: paper.Color): any[];
        getTransformHandles(color: paper.Color): any[];
    }
}
declare module Common.Drawing.Component {
    interface IDragHandle extends paper.Group {
        position: paper.Point;
        cursor?: Cursor;
        getSnapPoints?: (position: paper.Point) => Array<SnapPoint>;
        onMove?: (position: paper.Point) => paper.Point;
    }
    class DragHandle extends paper.Group implements IDragHandle {
        constructor(position: paper.Point, color: paper.Color);
        /**
         * Derived class should implement
         */
        cursor: Cursor;
        getSnapPoints(position: paper.Point): Array<SnapPoint>;
        onMove(position: paper.Point): paper.Point;
    }
}
declare module Common.Drawing.Component {
    /**
     * Factory for drawing components
     */
    class Factory {
        /**
         * Create a drawing component from a component data model.
         */
        static fromModel(model?: Common.Data.Component): Drawing.Component.IComponent;
        /**
         * Creates a new component for a given component type
         */
        private static get(type, model);
    }
}
declare module Common.Drawing.Component.Library {
    class Arrow extends Drawing.Component.Base implements Drawing.Component.IComponent {
        id: Type;
        static title: string;
        static preview: string;
        static category: string;
        tags: string[];
        properties: ({
            label: string;
            controls: {
                model: string;
                type: StringConstructor;
                ui: string;
                options: {
                    label: string;
                    value: string;
                }[];
                description: string;
            }[];
        } | {
            label: string;
            controls: {
                model: string;
                type: StringConstructor;
                ui: string;
                options: {
                    label: string;
                    value: string;
                }[];
            }[];
        })[];
        thumbnail: string;
        snapPoints: {
            x: number;
            y: number;
        }[];
        model: Common.Data.Component;
        /**
         * Create a new Arrow component
         */
        constructor(model: Common.Data.IDrawingModel);
        /**
         * Perform any necessary transformation on the component when saving
         */
        serialize(): Common.Data.Component;
        /**
         * Redraw the component
         */
        update(): void;
        /**
         * Update model with the state of the view component
         */
        updateModel(): void;
        onMove(event: IComponentMoveEvent): void;
        /**
         * Calculate the snap points for the component
         */
        getSnapPoints(): Array<SnapPoint>;
        /**
         * Calculate the drag handles for the component
         */
        getDragHandles(color: paper.Color): Array<IDragHandle>;
    }
}
declare module Common.Drawing.Component.Library {
    class Button extends Drawing.Component.Base implements Drawing.Component.IComponent {
        id: Type;
        static title: string;
        static preview: string;
        static category: string;
        tags: string[];
        properties: ({
            label: string;
            controls: {
                model: string;
                type: StringConstructor;
                description: string;
            }[];
        } | {
            label: string;
            controls: {
                model: string;
                type: string;
                ui: string;
                options: {
                    label: string;
                    value: string;
                }[];
            }[];
        } | {
            label: string;
            controls: {
                model: string;
                type: NumberConstructor;
                ui: string;
                options: {
                    label: string;
                    value: number;
                }[];
                placeholder: string;
                description: string;
            }[];
        } | {
            label: string;
            controls: {
                model: string;
                type: NumberConstructor;
                unit: string;
                description: string;
            }[];
        })[];
        model: Common.Data.Component;
        /**
         * Create a new Button component
         */
        constructor(model: Common.Data.IDrawingModel);
        /**
         * Redraw the component
         */
        update(): void;
        /**
         * Update model with the state of the view component
         */
        updateModel(): void;
        /**
         * Calculate the snap points for the component
         */
        getSnapPoints(): Array<SnapPoint>;
        /**
         * Calculate the transform handles for the component
         */
        getTransformHandles(color: paper.Color): Array<IDragHandle>;
        /**
         * Cast the model properties into the correct type
         */
        getProperties(): Common.Data.IButtonProperties;
    }
}
declare module Common.Drawing.Component.Library {
    class Checkbox extends Drawing.Component.Base implements Drawing.Component.IComponent {
        id: Type;
        static title: string;
        static preview: string;
        static category: string;
        tags: string[];
        properties: ({
            label: string;
            controls: {
                model: string;
                type: StringConstructor;
                description: string;
            }[];
        } | {
            label: string;
            controls: {
                model: string;
                type: BooleanConstructor;
                ui: string;
                options: {
                    label: string;
                    value: boolean;
                }[];
                description: string;
            }[];
        } | {
            label: string;
            controls: ({
                model: string;
                type: NumberConstructor;
                description: string;
            } | {
                model: string;
                type: NumberConstructor;
                ui: string;
                options: {
                    label: string;
                    value: number;
                }[];
                placeholder: string;
                description: string;
            })[];
        })[];
        model: Common.Data.Component;
        /**
         * Create a new Select component
         */
        constructor(model: Common.Data.IDrawingModel);
        /**
         * Redraw the component
         */
        update(): void;
        /**
         * Update model with the state of the view component
         */
        updateModel(): void;
        /**
         * Calculate the snap points for the component
         */
        getSnapPoints(): Array<SnapPoint>;
        /**
         * Cast the model properties into the correct type
         */
        getProperties(): Common.Data.ICheckboxProperties;
    }
}
declare module Common.Drawing.Component.Library {
    class Icon extends Drawing.Component.Base implements Drawing.Component.IComponent {
        id: Type;
        static title: string;
        static preview: string;
        static category: string;
        tags: string[];
        properties: ({
            label: string;
            controls: {
                model: string;
                type: StringConstructor;
                ui: string;
                description: string;
            }[];
        } | {
            label: string;
            controls: {
                model: string;
                type: NumberConstructor;
            }[];
        })[];
        model: Common.Data.Component;
        icon: paper.PointText;
        /**
         * Create a new Icon component
         */
        constructor(model: Common.Data.IDrawingModel);
        /**
         * Redraw the component
         */
        update(): void;
        /**
         * Update model with the state of the view component
         */
        updateModel(): void;
        /**
         * Calculate the snap points for the component
         */
        getSnapPoints(): Array<SnapPoint>;
        /**
         * Cast the model properties into the correct type
         */
        getProperties(): Common.Data.IIconProperties;
    }
}
declare module Common.Drawing.Component.Library {
    class Image extends Drawing.Component.Base implements Drawing.Component.IComponent {
        id: Type;
        static title: string;
        static preview: string;
        static category: string;
        tags: string[];
        properties: {
            label: string;
            controls: {
                model: string;
                type: StringConstructor;
                ui: string;
                description: string;
            }[];
        }[];
        model: Common.Data.Component;
        /**
         * Create a new Button component
         */
        constructor(model: Common.Data.IDrawingModel);
        /**
         * Redraw the component
         */
        update(): void;
        /**
         * Update model with the state of the view component
         */
        updateModel(): void;
        /**
         * Calculate the snap points for the component
         */
        getSnapPoints(): Array<SnapPoint>;
        /**
         * Calculate the transform handles for the component
         */
        getTransformHandles(color: paper.Color): Array<IDragHandle>;
        /**
         * Cast the model properties into the correct type
         */
        getProperties(): Common.Data.IImageProperties;
    }
}
declare module Common.Drawing.Component {
    enum Type {
        Rectangle = 0,
        Arrow = 1,
        IPhone = 2,
        IPhoneTitlebar = 3,
        MobileTitlebar = 4,
        TextInput = 5,
        SelectInput = 6,
        Checkbox = 7,
        Label = 8,
        Button = 9,
        Image = 10,
        Icon = 11,
    }
}
/// <reference path="../component.d.ts" />
/// <reference path="../type.d.ts" />
declare module Common.Drawing.Component.Library {
    class IPhoneTitlebar extends Drawing.Component.Base implements Drawing.Component.IComponent {
        id: Type;
        static title: string;
        static preview: string;
        static category: string;
        tags: string[];
        properties: {
            label: string;
            controls: {
                model: string;
                type: StringConstructor;
                placeholder: string;
                description: string;
            }[];
        }[];
        preview: string;
        model: Common.Data.Component;
        constructor(model: Common.Data.IDrawingModel);
        update(): void;
        /**
         * Update model with the state of the view component
         */
        updateModel(): void;
        /**
         * Calculate the snap points for the component
         */
        getSnapPoints(): Array<SnapPoint>;
        /**
         * Cast the model properties into the correct type
         */
        getProperties(): Common.Data.IIPhoneTitlebarProperties;
    }
}
declare module Common.Drawing.Component.Library {
    class IPhone extends Drawing.Component.Base implements Drawing.Component.IComponent {
        id: Type;
        static title: string;
        static preview: string;
        static category: string;
        tags: string[];
        properties: any[];
        model: Common.Data.Component;
        /**
         * Create a new iPhone component
         */
        constructor(model: Common.Data.IDrawingModel);
        /**
         * Redraw the component
         */
        update(): void;
        /**
         * Update model with the state of the view component
         */
        updateModel(): void;
        /**
         * Calculate the snap points for the component
         */
        getSnapPoints(): Array<SnapPoint>;
    }
}
declare module Common.Drawing.Component.Library {
    class Label extends Drawing.Component.Base implements Drawing.Component.IComponent {
        id: Type;
        static title: string;
        static preview: string;
        static category: string;
        tags: string[];
        properties: ({
            label: string;
            controls: {
                model: string;
                type: StringConstructor;
                description: string;
            }[];
        } | {
            label: string;
            controls: ({
                model: string;
                type: NumberConstructor;
                unit: string;
                description: string;
            } | {
                model: string;
                type: NumberConstructor;
                ui: string;
                options: {
                    label: string;
                    value: number;
                }[];
                placeholder: string;
                description: string;
            })[];
        })[];
        model: Common.Data.Component;
        textItem: paper.PointText;
        /**
         * Create a new Label component
         */
        constructor(model: Common.Data.IDrawingModel);
        /**
         * Redraw the component
         */
        update(): void;
        /**
         * Update model with the state of the view component
         */
        updateModel(): void;
        /**
         * Calculate the snap points for the component
         */
        getSnapPoints(): Array<SnapPoint>;
        /**
         * Cast the model properties into the correct type
         */
        getProperties(): Common.Data.ILabelProperties;
    }
}
declare module Common.Drawing.Component.Library {
    class MobileTitlebar extends Drawing.Component.Base implements Drawing.Component.IComponent {
        id: Type;
        static title: string;
        static preview: string;
        static category: string;
        tags: string[];
        properties: ({
            label: string;
            controls: {
                model: string;
                type: StringConstructor;
            }[];
        } | {
            label: string;
            controls: {
                model: string;
                type: StringConstructor;
                ui: string;
                description: string;
            }[];
        })[];
        resizable: boolean;
        showBounds: boolean;
        model: Common.Data.Component;
        icon: paper.PointText;
        /**
         * Create a new Mobile Titlebar component
         */
        constructor(model: Common.Data.IDrawingModel);
        /**
         * Redraw the component
         */
        update(): void;
        /**
         * Update model with the state of the view component
         */
        updateModel(): void;
        /**
         * Calculate the snap points for the component
         */
        getSnapPoints(): Array<SnapPoint>;
        /**
         * Cast the model properties into the correct type
         */
        getProperties(): Common.Data.IMobileTitlebarProperties;
    }
}
declare module Common.Drawing.Component.Library {
    class Rectangle extends Drawing.Component.Base implements Drawing.Component.IComponent {
        id: Type;
        static title: string;
        static preview: string;
        static category: string;
        tags: string[];
        properties: ({
            label: string;
            controls: {
                model: string;
                placeholder: string;
                type: NumberConstructor;
                description: string;
            }[];
        } | {
            label: string;
            controls: {
                model: string;
                type: NumberConstructor;
                description: string;
            }[];
        })[];
        model: Common.Data.Component;
        /**
         * Create a new Rectangle component
         */
        constructor(model: Common.Data.IDrawingModel);
        /**
         * Redraw the component
         */
        update(): void;
        /**
         * Update model with the state of the view component
         */
        updateModel(): void;
        /**
         * Calculate the snap points for the component
         */
        getSnapPoints(): Array<SnapPoint>;
        /**
         * Calculate the transform handles for the component
         */
        getTransformHandles(color: paper.Color): Array<IDragHandle>;
    }
}
declare module Common.Drawing.Component.Library {
    class SelectInput extends Drawing.Component.Base implements Drawing.Component.IComponent {
        id: Type;
        static title: string;
        static preview: string;
        static category: string;
        tags: string[];
        properties: ({
            label: string;
            controls: {
                model: string;
                type: StringConstructor;
                description: string;
            }[];
        } | {
            label: string;
            controls: {
                model: string;
                type: StringConstructor;
                placeholder: string;
                description: string;
            }[];
        } | {
            label: string;
            controls: ({
                model: string;
                type: NumberConstructor;
                unit: string;
                description: string;
            } | {
                model: string;
                type: NumberConstructor;
                ui: string;
                options: {
                    label: string;
                    value: number;
                }[];
                placeholder: string;
                description: string;
            })[];
        })[];
        model: Common.Data.Component;
        /**
         * Create a new Select component
         */
        constructor(model: Common.Data.IDrawingModel);
        /**
         * Redraw the component
         */
        update(): void;
        /**
         * Update model with the state of the view component
         */
        updateModel(): void;
        /**
         * Calculate the transform handles for the component
         */
        getTransformHandles(color: paper.Color): Array<IDragHandle>;
        /**
         * Calculate the snap points for the component
         */
        getSnapPoints(): Array<SnapPoint>;
        /**
         * Cast the model properties into the correct type
         */
        getProperties(): Common.Data.ITextInputProperties;
        /**
         * Calculate the height of the component
         */
        getHeight(): number;
    }
}
declare module Common.Drawing.Component.Library {
    class TextInput extends Drawing.Component.Base implements Drawing.Component.IComponent {
        id: Type;
        static title: string;
        static preview: string;
        static category: string;
        tags: string[];
        properties: ({
            label: string;
            controls: {
                model: string;
                type: StringConstructor;
                description: string;
            }[];
        } | {
            label: string;
            controls: {
                model: string;
                type: StringConstructor;
                placeholder: string;
                description: string;
            }[];
        } | {
            label: string;
            controls: ({
                model: string;
                type: NumberConstructor;
                placeholder: string;
                unit: string;
                description: string;
            } | {
                model: string;
                type: NumberConstructor;
                ui: string;
                options: {
                    label: string;
                    value: number;
                }[];
                placeholder: string;
                description: string;
            })[];
        })[];
        model: Common.Data.Component;
        /**
         * Create a new Text Input component
         */
        constructor(model: Common.Data.IDrawingModel);
        /**
         * Redraw the component
         */
        update(): void;
        /**
         * Update model with the state of the view component
         */
        updateModel(): void;
        /**
         * Calculate the transform handles for the component
         */
        getTransformHandles(color: paper.Color): Array<IDragHandle>;
        /**
         * Calculate the snap points for the component
         */
        getSnapPoints(): Array<SnapPoint>;
        /**
         * Cast the model properties into the correct type
         */
        getProperties(): Common.Data.ITextInputProperties;
        /**
         * Calculate the height of the component
         */
        getHeight(): number;
    }
}
declare module Common.Drawing {
    class Cursor {
    }
    class Cursors {
        static Default: Cursor;
        static Pointer: Cursor;
        static Move: Cursor;
        static Crosshair: Cursor;
        static ResizeHorizontal: Cursor;
        static ResizeVertical: Cursor;
        static ResizeNESW: Cursor;
        static ResizeNWSE: Cursor;
    }
}
declare module Common.Drawing {
    enum EditMode {
        Draw = 0,
        Artboards = 1,
        Annotate = 2,
    }
}
declare module Common.Drawing {
    interface IPoint {
        x: number;
        y: number;
    }
}
declare module Common.Drawing {
    enum SmartGuideAxis {
        X = 0,
        Y = 1,
    }
    class SmartGuide {
        origin: SnapPoint;
        relation: SnapPoint;
        axis: SmartGuideAxis;
        score: number;
        delta: {
            x: number;
            y: number;
        };
        /**
         * Return a vector representing how far the origin point was adjusted`
         */
        getAdjustment(): paper.Point;
        /**
         * Return the origin point with the adjustment applied
         */
        getAdjustedOriginPoint(): paper.Point;
    }
}
declare module Common.Drawing {
    class SnapPoint {
        point: paper.Point;
        xName: string;
        yName: string;
        _weight: number;
        weight: number;
        constructor(point: paper.Point, xName: string, yName: string, weight?: number);
    }
}
declare module Common.UI {
    interface ITheme {
        ComponentDefault: paper.Color;
        ComponentHover: paper.Color;
        ComponentActive: paper.Color;
        ComponentFocus: paper.Color;
        ComponentDefaultLight: paper.Color;
        ComponentHoverLight: paper.Color;
        ComponentActiveLight: paper.Color;
        ComponentFocusLight: paper.Color;
        ComponentDefaultDark: paper.Color;
        ComponentHoverDark: paper.Color;
        ComponentActiveDark: paper.Color;
        ComponentFocusDark: paper.Color;
        BorderDefault: paper.Color;
        BorderHover: paper.Color;
        BorderActive: paper.Color;
        BorderFocus: paper.Color;
        DragHandleDefault: paper.Color;
        BoundsDefault: paper.Color;
        GuideDefault: paper.Color;
        ShadingDefault: paper.Color;
    }
    class DefaultTheme implements ITheme {
        ComponentDefault: paper.Color;
        ComponentHover: paper.Color;
        ComponentActive: paper.Color;
        ComponentFocus: paper.Color;
        ComponentDefaultLight: paper.Color;
        ComponentHoverLight: paper.Color;
        ComponentActiveLight: paper.Color;
        ComponentFocusLight: paper.Color;
        ComponentDefaultDark: paper.Color;
        ComponentHoverDark: paper.Color;
        ComponentActiveDark: paper.Color;
        ComponentFocusDark: paper.Color;
        BorderDefault: paper.Color;
        BorderHover: paper.Color;
        BorderActive: paper.Color;
        BorderFocus: paper.Color;
        DragHandleDefault: paper.Color;
        BoundsDefault: paper.Color;
        GuideDefault: paper.Color;
        ShadingDefault: paper.Color;
    }
}
