/**
 * MyCube
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function MyCube(scene) 
{
	CGFobject.call(this,scene);
	this.quad=new MyQuad(this.scene);
	this.quad.initBuffers();
};

MyCube.prototype = Object.create(CGFobject.prototype);
MyCube.prototype.constructor=MyCube;

MyCube.prototype.display = function()
{
	//Save State
	//this.scene.translate(0,0,0);
	this.scene.pushMatrix();
	
	//CReated the +Z
	this.scene.translate(0,0,0.5);
	this.quad.display();

	//Created the -Z
	this.scene.translate(0,0,-1);
	this.scene.rotate(Math.PI,1,0,0);
	this.quad.display();


	//Restore State
	this.scene.popMatrix();
	this.scene.pushMatrix();


	//Create the +X
	this.scene.translate(0.5,0,0);
	this.scene.rotate(Math.PI/2,0,1,0);
	this.quad.display();

	//Create the -X
	this.scene.rotate(Math.PI/2,0,-1,0);
	this.scene.translate(-1,0,0);
	this.scene.rotate(Math.PI/2,0,-1,0);
	this.quad.display();


	//Restore State
	this.scene.popMatrix();
	this.scene.pushMatrix();


	//Create the +Y
	this.scene.translate(0,-0.5,0);
	this.scene.rotate(Math.PI/2,1,0,0);
	this.quad.display();

	//Create the -Y
	this.scene.rotate(Math.PI/2,-1,0,0);
	this.scene.translate(0,1,0);
	this.scene.rotate(Math.PI/2,-1,0,0);
	this.quad.display();

	//Restore state
	this.scene.popMatrix();
};