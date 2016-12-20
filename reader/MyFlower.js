function MyFlower(scene, color, div, mapLength)
{
    this.scene = scene;


	this.mapDiv = mapLength / div;
	this.mapInc = (mapLength / div) / 2;
	this.div = div;
	this.numpedals = 5;

	this.sphere = new MySphere(this.scene, 1, 10, 10);
	this.bar = new MyCylinder(this.scene, 0.05,0.05,0.199,10,10);
	this.pedal = new MySphere(this.scene, 0.2, 10, 10);

	this.color = this.createColor(color);

	this.transMatrix = mat4.create();
}

MyFlower.prototype.constructor=MyFlower;

MyFlower.prototype.display = function(appearence)
{	
	this.scene.pushMatrix();

		this.scene.multMatrix(this.transMatrix);

		//middle of flower
		this.scene.pushMatrix();

			//appearence
			this.color.apply();

			//transformations
			this.scene.translate(this.mapInc,0.2,this.mapInc);
			this.scene.scale(0.1,0.07,0.1);

			//display
			this.sphere.display();

		this.scene.popMatrix();

		//caule
		this.scene.pushMatrix();

			//appearence
			this.color.apply();

			//transformations
			this.scene.translate(this.mapInc,0.2,this.mapInc);
			this.scene.rotate(Math.PI/2, 1,0,0);

			//display
			this.bar.display();

		this.scene.popMatrix();

		var tempAngInc = (Math.PI * 2) / this.numpedals;

		//pedals
		for(var i = 0; i < this.numpedals; i++)
		{
			this.scene.pushMatrix();

				//appearence
				this.color.apply();

				//transformations
				this.scene.translate(this.mapInc,0.2,this.mapInc); //map translate

				this.scene.rotate((Math.PI * 2 / this.numpedals) / 2, 0,1,0);
				this.scene.rotate(tempAngInc*i, 0,1,0);

				this.scene.scale(0.5,0.15,1); //scale to fit
				this.scene.translate(0,0,0.2);//translate from middle

				//display
				this.pedal.display();

			this.scene.popMatrix();
		}
	this.scene.popMatrix();

};

MyFlower.prototype.createColor = function(color)
{	
	if(color == "yellow")
	{
		return this.createAppearence(this.scene, 102,102,0,1);		
	}
	else if(color == "red")
	{
		return this.createAppearence(this.scene, 80,10,10,1);
	}
	else if(color == "purple")
	{
		return this.createAppearence(this.scene, 51,0,102,1);
	}
	else if(color == "white")
	{
		return this.createAppearence(this.scene, 150,150,150,1);
	}
	else if(color == "blue")
	{
		return this.createAppearence(this.scene, 0,51,102,1);
	}
	else if(color == "green")
	{
		return this.createAppearence(this.scene, 0,50,0,1);
	}

};

MyFlower.prototype.createAppearence = function(scene, rr, gg, bb, a)
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

MyFlower.prototype.translate = function(x,y)
{
	var xx = x*this.mapDiv;
	var yy = y*this.mapDiv;
	var temp = vec3.fromValues(xx,0,yy);

	var matTemp = mat4.create();
	mat4.translate(matTemp, matTemp, temp);

	this.transMatrix = matTemp;
}


MyFlower.prototype.updateTextureCoords=function(s, t) {};