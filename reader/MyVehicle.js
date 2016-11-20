/**
 * Documentation refering to the second part of the project
 * MyVehicle Class consisting on a zepplin
 * 
 * @param scene
 * 
 * My Vehicle constructor. Creates a new CGFappearence called ribbon
 * with a defined texture and texture Wrap
 * Creates a MyPatch with well defined parameters
 * Creates a MyCube from CGRA project
 * Creates a MySphere
 * Creates a MyCylinder
 * 
 */
function MyVehicle(scene)
{
    this.scene = scene;

    this.ribbon = new CGFappearance(this.scene);
 	this.ribbon.setTextureWrap('CLAMP_TO_EDGE', 'CLAMP_TO_EDGE');
 	this.ribbon.loadTexture("../textures/ribbon.png");
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

	this.cube = new MyCube(this.scene);
	this.sphere = new MySphere(this.scene, 1.3, 20, 10);
	this.bar = new MyCylinder(this.scene, 0.01,0.01,1,10,10);
}

MyVehicle.prototype.constructor=MyVehicle;

/**
 * Function to display the vehicle
 * 
 * @param appearence
 * 
 * Receives an appearence because the patch will use an internal loaded texture
 * Puts the ribbon (MyPatch) in place (doublesided for texture) and sets the ribbon appearence
 * Restores the appearence received for the other elements 
 * Only the ribbon (MyPatch) will use a more internal appearence despite what is parsed in the
 * display.
 * The other componetns are put in place.
 */
MyVehicle.prototype.display = function(appearence)
{	
	//PUT RIBBON IN PLACE
	this.scene.pushMatrix();
			
		this.scene.translate(0,-0.3,-5.5);
		this.scene.scale(0.3,0.3,0.3);
		this.scene.rotate(Math.PI/2,0,0,1);
		this.scene.rotate(Math.PI/2,1,0,0);

		this.scene.pushMatrix();
			this.ribbon.apply(); //puts the appearence of this vehicle
			this.publicity.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
			this.ribbon.apply(); //puts the appearence of this vehicle
			this.scene.translate(0,8,0);
			this.scene.rotate(Math.PI, 1,0,0); 
			this.publicity.display();
		this.scene.popMatrix();
	
	this.scene.popMatrix();
	
	//restore the appearence desired
	appearence.apply();

	
	//cockpit
	this.scene.pushMatrix();
		this.scene.scale(0.6, 0.5, 1.4);
		this.scene.translate(0,-1.3,0);
		this.cube.display();
	this.scene.popMatrix();

	//zepplim
	this.scene.pushMatrix();
		this.scene.rotate(Math.PI/2, 0,1,0);
		this.scene.scale(2.0, 0.6, 0.6);
		this.scene.translate(0,0,0);
		this.sphere.display();
	this.scene.popMatrix();

	//wing V
	this.scene.pushMatrix();
		this.scene.scale(0.05,1.5,0.7);
		this.scene.translate(0,0,-2.8);
		this.cube.display();
	this.scene.popMatrix();

	//wing H
	this.scene.pushMatrix();
		this.scene.scale(1.5,0.05,0.7);
		this.scene.translate(0,0,-2.8);
		this.cube.display();
	this.scene.popMatrix();

	//upper bar
	this.scene.pushMatrix();
		this.scene.translate(0,0.2,-3.1);
		this.scene.rotate(Math.PI/12, 1,0,0);	
		this.bar.display();
	this.scene.popMatrix();

	//lower bar
	this.scene.pushMatrix();
		this.scene.translate(0,-0.2,-3.1);
		this.scene.rotate(-Math.PI/12, 1,0,0);	
		this.bar.display();
	this.scene.popMatrix();

};

/**
 * update Texture Coords in case is called
 * @param s
 * @param t
 */
MyVehicle.prototype.updateTextureCoords=function(s, t) {};