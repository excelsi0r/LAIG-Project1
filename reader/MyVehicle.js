function MyVehicle(scene, plane, patch)
{
    this.scene = scene;
    this.plane = plane;
    this.patch = patch;
}

MyVehicle.prototype = Object.create(CGFobject.prototype);
MyVehicle.prototype.constructor=MyVehicle;

MyVehicle.prototype.display = function()
{

    this.scene.pushMatrix();        
	   this.plane.display();
	this.scene.popMatrix();



    this.scene.pushMatrix();  
	   this.patch.display();
	this.scene.popMatrix();
};

MyVehicle.prototype.updateTextureCoords=function(s, t) {};