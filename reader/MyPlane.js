/**
 * My Plane class
 */

function MyPlane(scene, dimX, dimY, partsX, partsY)
{
	this.scene = scene;
	this.dimX = dimX;
	this.dimY = dimY;
	this.partsX = partsX;
	this.partsY = partsY;

	
}


MyPlane.prototype = Object.create(CGFobject.prototype);
MyPlane.prototype.constructor=MyPlane;

