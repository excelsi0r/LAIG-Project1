/**
 * Documentation referencing only to the third part of the Project
 */
//Tree constructor, divions in board, and mapLength
function MyTree(scene, div, mapLength)
{
    this.scene = scene;


	this.mapDiv = mapLength / div;
	this.mapInc = (mapLength / div) / 2;
	this.div = div;

	this.bar = new MyCylinder(this.scene, 0.1,0.1,0.399,10,10);
	this.top = new MyCylinder(this.scene, 0,0.4,0.2,15,10)


	this.color = this.createAppearence(this.scene, 0,50,0,1);

	this.transMatrix = mat4.create();
}

MyTree.prototype.constructor=MyTree;

//display function
MyTree.prototype.display = function(appearence)
{	
	this.scene.pushMatrix();

		this.scene.multMatrix(this.transMatrix);
	
		//caule
		this.scene.pushMatrix();

			//appearence
			this.color.apply();

			//transformations
			this.scene.translate(this.mapInc,0.4,this.mapInc);
			this.scene.rotate(Math.PI/2, 1,0,0);

			//display
			this.bar.display();

		this.scene.popMatrix();

		//top
		this.scene.pushMatrix();

			//appearence
			this.color.apply();

			//transformations
			this.scene.scale(1,4,1);
			this.scene.translate(this.mapInc,0.3,this.mapInc);

			this.scene.rotate(Math.PI/2, 1,0,0);

			//display
			this.top.display();

		this.scene.popMatrix();
		
	this.scene.popMatrix();

};

//createAppearence with rbga color 255,255,255,255
MyTree.prototype.createAppearence = function(scene, rr, gg, bb, a)
{
	var emission = 0.03;
	var shininess = 0.1;

	var r = rr / 255;
	var g = gg / 255;
	var b = bb / 255;
	
	
	var temp = new CGFappearance(this.scene);

	temp.setAmbient(r, g, b, a);
	temp.setDiffuse(r, g, b, a);
	temp.setSpecular(r, g, b, a);
	temp.setEmission(emission * r, emission * g, emission * b, a);
	temp.setShininess(shininess);

	return temp;

};

//translate to x,y position in board / case
MyTree.prototype.translate = function(x,y)
{
	var xx = x*this.mapDiv;
	var yy = y*this.mapDiv;

	var temp = vec3.fromValues(xx,0,yy);

	var matTemp = mat4.create();
	mat4.translate(matTemp, matTemp, temp);

	this.transMatrix = matTemp;
}

MyTree.prototype.update=function(currTime) {};

MyTree.prototype.updateTextureCoords=function(s, t) {};