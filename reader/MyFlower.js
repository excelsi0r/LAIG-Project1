function MyFlower(scene)
{
    this.scene = scene;

	this.caule = new MyPatch(this.scene, 3,3,7,9,[
														[ 0.0,  0.0,  0.0],
												 		[ 0.0,  2.0,  0.3],
												 		[ 0.0,  4.0,  1.0],
												 		[ 0.0,  8.0,  2.0],

												 		[-0.5,  0.0,  0.5],
												 		[-0.5,  2.0,  0.8],
												 		[-0.5,  4.0,  1.5],
												 		[-0.5,  8.0,  2.5],

												 		[ 0.0,  0.0,  1.0],
												 		[ 0.0,  2.0,  1.3],
												 		[ 0.0,  4.0,  2.0],
												 		[ 0.0,  4.0,  3.0],

												 		[ 0.5,  0.0,  0.5],
												 		[ 0.5,  2.0,  0.8],
												 		[ 0.5,  4.0,  1.5],
												 		[ 0.5,  8.0,  2.5],
													 ]);

	this.sphere = new MySphere(this.scene, 1.3, 20, 10);
	this.bar = new MyCylinder(this.scene, 0.01,0.01,1,10,10);
}

MyFlower.prototype.constructor=MyFlower;


MyFlower.prototype.display = function(appearence)
{	
	this.scene.pushMatrix();
		this.caule.display();
	this.scene.popMatrix();

};


MyFlower.prototype.updateTextureCoords=function(s, t) {};