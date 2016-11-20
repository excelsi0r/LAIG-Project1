/**
 * Documentation refering to the second part of the project
 * My Plane class
 * Based on Demo Sample from Theorical classes
 * 
 * @param scene
 * @param dimX
 * @param dimY
 * @param partsX
 * @param partsY
 * 
 * MyPlane Consctructor
 * Sets dimX, dimY, parstsX and partsY
 * Creates surface with order orderU and orderV as 1 and 1, and according to the dimx and dimY 
 * creates the controlpoints
 */
function MyPlane(scene, dimX, dimY, partsX, partsY)
{
	this.scene = scene;
	this.dimX = dimX;
	this.dimY = dimY;
	this.partsX = partsX;
	this.partsY = partsY;

	this.plane = this.makeSurface(1,1, 
										[
											[
												[-this.dimX / 2, -this.dimY / 2, 0.0, 1],
												[-this.dimX / 2,  this.dimY / 2, 0.0, 1]
											],
											[
												[ this.dimX / 2, -this.dimY / 2, 0.0, 1],
												[ this.dimX / 2,  this.dimY / 2, 0.0, 1]

											]
										]);

							
				
};

MyPlane.prototype = Object.create(CGFobject.prototype);
MyPlane.prototype.constructor=MyPlane;

/**
 * Funtion to create a surface
 * 
 * @param degree1
 * @param degree2
 * @param controlvertexes
 * @returns {CGFnurbsObject}
 */
MyPlane.prototype.makeSurface = function (degree1, degree2, controlvertexes) {
		
	var knots1 = this.getKnotsVector(degree1); 
	var knots2 = this.getKnotsVector(degree2);
		
	var nurbsSurface = new CGFnurbsSurface(degree1, degree2, knots1, knots2, controlvertexes); 
	getSurfacePoint = function(u, v) {
		return nurbsSurface.getPoint(u, v);
	};

	var obj = new CGFnurbsObject(this.scene, getSurfacePoint, this.partsX, this.partsY );
	return obj;		
};

/**
 * Get Knots vector
 * @param degree
 * @returns {Array}
 */
MyPlane.prototype.getKnotsVector = function(degree) 
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
 * Display plane function
 */
MyPlane.prototype.display = function()
{
	this.plane.display();
};

/**
 * Function to update texture coords in case is called
 * @param s
 * @param t
 */
MyPlane.prototype.updateTextureCoords=function(s, t) {};