/**
 * My Plane class
 * Based on Demo Sample
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

MyPlane.prototype.display = function()
{
	this.plane.display();
};

MyPlane.prototype.updateTextureCoords=function(s, t) {};


