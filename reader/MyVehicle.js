function MyVehicle(scene)
{
    this.scene = scene;

    this.ribbon = new CGFappearance(this.scene);
 	this.ribbon.setTextureWrap('CLAMP_TO_EDGE', 'CLAMP_TO_EDGE');
 	this.ribbon.loadTexture("../textures/ribbon.png");

	this.publicity = new MyPatch(this.scene, 1,3,7,9,[
														[ 0.0,  0.0,  0.0],
												 		[ 0.0,  2.0, -2.0],
												 		[ 0.0,  4.0,  2.0],
												 		[ 0.0,  8.0,  0.0],

												 		[ 2.0,  0.0,  0.0],
												 		[ 2.0,  2.0, -2.0],
												 		[ 2.0,  4.0,  2.0],
												 		[ 2.0,  8.0,  0.0],
													 ]);
}


MyVehicle.prototype = Object.create(CGFobject.prototype);
MyVehicle.prototype.constructor=MyVehicle;

MyVehicle.prototype.display = function()
{
	this.scene.pushMatrix();

		this.scene.translate(-2,-1.5,-5.5);
		this.scene.scale(0.3,0.3,0.3);
		this.scene.rotate(Math.PI/2,0,0,1);
		this.scene.rotate(Math.PI/2,1,0,0);

		this.scene.pushMatrix();
			this.ribbon.apply();
			this.publicity.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
			this.ribbon.apply();
			this.scene.translate(0,8,0);
			this.scene.rotate(Math.PI, 1,0,0); 
			this.publicity.display();
		this.scene.popMatrix();
	this.scene.popMatrix();
};

MyVehicle.prototype.updateTextureCoords=function(s, t) {};