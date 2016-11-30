function MyFlower(scene)
{
    this.scene = scene;

	

	this.sphere = new MySphere(this.scene, 1.3, 20, 10);
	this.bar = new MyCylinder(this.scene, 0.01,0.01,1,10,10);
}

MyFlower.prototype.constructor=MyFlower;


MyFlower.prototype.display = function(appearence)
{	
	this.scene.pushMatrix();
		//this.caule.display();
	this.scene.popMatrix();

};


MyFlower.prototype.updateTextureCoords=function(s, t) {};