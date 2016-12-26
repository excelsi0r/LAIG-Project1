function MyAlien(scene, color, div, mapLength)
{
    this.scene = scene;


	this.mapDiv = mapLength / div;
	this.mapInc = (mapLength / div) / 2;
	this.div = div;
	this.numpedals = 5;

	this.sphere = new MySphere(this.scene, 0.25, 10, 10);
	this.body = new MyCylinder(this.scene, 0.255,0.255,0.3,15,15);
	this.bar = new MyCylinder(this.scene, 0.03,0.03,0.3,10,10);
	this.antena = new MyCylinder(this.scene, 0.01,0.01,0.2,10,10);

	this.color = this.createColor(color);
	this.colorString = color;

	this.transMatrix = mat4.create();
}

MyAlien.prototype.constructor=MyAlien;

MyAlien.prototype.display = function(appearence)
{	
	this.scene.pushMatrix();

		this.scene.multMatrix(this.transMatrix);
	
		//body head
		this.scene.pushMatrix();
			//appearence
			this.color.apply();

			//transformations
			this.scene.translate(this.mapInc,0.4,this.mapInc);

			//display
			this.sphere.display();
		this.scene.popMatrix();
		

		//body
		this.scene.pushMatrix();
			//appearence
			this.color.apply();

			//transformations
			this.scene.translate(this.mapInc,0.4,this.mapInc);
			this.scene.rotate(Math.PI/2, 1,0,0);

			//display
			this.body.display();
		this.scene.popMatrix();

		//right arm 
		this.scene.pushMatrix();
			//appearence
			this.color.apply();

			//transformations
			this.scene.translate(this.mapInc + 0.3, 0.2, this.mapInc);
			this.scene.rotate(Math.PI/2, 0,-1,0);
			this.scene.rotate(Math.PI/3, -1,0,0);


			//display
			this.bar.display();
		this.scene.popMatrix();

		//left arm 
		this.scene.pushMatrix();
			//appearence
			this.color.apply();

			//transformations


			this.scene.translate(this.mapInc - 0.3, 0.2, this.mapInc);
			this.scene.rotate(Math.PI/2, 0,1,0);			
			this.scene.rotate(Math.PI/3, -1,0,0);

			//display
			this.bar.display();
		this.scene.popMatrix();

		//left leg 
		this.scene.pushMatrix();
			//appearence
			this.color.apply();

			//transformations
			this.scene.translate(this.mapInc - 0.1, 0.31, this.mapInc);
			this.scene.scale(1.3,1,1.3);
			this.scene.rotate(Math.PI/2, 1,0,0);

			//display
			this.bar.display();
		this.scene.popMatrix();

		//right leg 
		this.scene.pushMatrix();
			//appearence
			this.color.apply();

			//transformations
			this.scene.translate(this.mapInc + 0.1, 0.31, this.mapInc);
			this.scene.scale(1.3,1,1.3);
			this.scene.rotate(Math.PI/2, 1,0,0);

			//display
			this.bar.display();
		this.scene.popMatrix();

		//left antena 
		this.scene.pushMatrix();
			//appearence
			this.color.apply();

			//transformations
			this.scene.translate(this.mapInc + 0.1, 0.55, this.mapInc);
			this.scene.rotate(Math.PI/2, 0,1,0);			
			this.scene.rotate(Math.PI/3, -1,0,0);


			//display
			this.antena.display();
		this.scene.popMatrix();

		//right antena
		this.scene.pushMatrix();

			//appearence
			this.color.apply();

			//transformations
			this.scene.translate(this.mapInc - 0.1, 0.55, this.mapInc);
			this.scene.rotate(Math.PI/2, 0,-1,0);			
			this.scene.rotate(Math.PI/3, -1,0,0);


			//display
			this.antena.display();
		this.scene.popMatrix();

	this.scene.popMatrix();


	

};

MyAlien.prototype.createColor = function(color)
{	
	if(color == "black")
	{
		return this.createAppearence(this.scene, 20,20,20,1);		
	}
	else if(color == "white")
	{
		return this.createAppearence(this.scene, 150,150,150,1);
	}


};

MyAlien.prototype.createAppearence = function(scene, rr, gg, bb, a)
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

MyAlien.prototype.translate = function(x,y)
{
	var xx = x*this.mapDiv;
	var yy = y*this.mapDiv;
	var temp = vec3.fromValues(xx,0,yy);

	var matTemp = mat4.create();
	mat4.translate(matTemp, matTemp, temp);

	this.transMatrix = matTemp;
}


MyAlien.prototype.updateTextureCoords=function(s, t) {};