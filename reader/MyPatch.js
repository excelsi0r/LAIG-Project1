/**
 * Documentation refering to the second part of the project
 * 
 * MyPatch Constructor
 * 
 * @param scene
 * @param orderU
 * @param orderV
 * @param partsU
 * @param partsV
 * @param controlpoints
 * 
 * Based on Example from Theorical clsses
 * Sets orderU, orderV, partsU, partsV and controlpoints
 * from the controlpoints gets a new array with converted array to use upon creating surface
 * Create the patch
 */
function MyPatch(scene, orderU, orderV, partsU, partsV, controlpoints)
{
    this.scene = scene;
    this.orderU = orderU;
    this.orderV = orderV;
    this.partsU = partsU;
    this.partsV = partsV;
    this.controlpoints = controlpoints;

    this.newControlPoints = this.assertNewControlPointsArray();

   	this.patch = this.makeSurface(this.orderU, this.orderV, this.newControlPoints);
    
}

MyPatch.prototype = Object.create(CGFobject.prototype);
MyPatch.prototype.constructor=MyPatch;

/**
 * Vector to convert the controlpoints array to a valid array to use when making surface
 * @returns new controlpoints array
 */
MyPatch.prototype.assertNewControlPointsArray = function()
{
		var newControlPoints = [];

		for(var u = 0; u < this.orderU + 1; u++)
		{
			var uarray = [];

			for(var v = 0; v < this.orderV + 1; v++)
			{
				var point = this.controlpoints[(this.orderV + 1)*u + v];
				point.push(1);
				uarray.push(point);
			}

			newControlPoints.push(uarray);
		}
		return newControlPoints;

};
/**
 * Creates the CGFnurbsObject from a surface
 * @param degree1
 * @param degree2
 * @param controlvertexes
 * @returns {CGFnurbsObject}
 */
MyPatch.prototype.makeSurface = function (degree1, degree2, controlvertexes) {
		
	var knots1 = this.getKnotsVector(degree1); 
	var knots2 = this.getKnotsVector(degree2);
		
	var nurbsSurface = new CGFnurbsSurface(degree1, degree2, knots1, knots2, controlvertexes); 
	getSurfacePoint = function(u, v) {
		return nurbsSurface.getPoint(u, v);
	};

	var obj = new CGFnurbsObject(this.scene, getSurfacePoint, this.partsU, this.partsV);
	return obj;		
};
/**
 * Get Knots Vector function
 * @param degree
 * @returns {Array}
 */
MyPatch.prototype.getKnotsVector = function(degree) 
{ 
	
	var v = new Array();
	for (var i=0; i<=degree; i++) {
		v.push(0);
	}
	for (var i=0; i<=degree; i++) {
		v.push(1);
	}
	return v;
};
/**
 * Display patch function
 */
MyPatch.prototype.display = function()
{
	this.patch.display();
};
/**
 * update Texture Coords in case the funtion is called
 * @param s
 * @param t
 */
MyPatch.prototype.updateTextureCoords=function(s, t) {};