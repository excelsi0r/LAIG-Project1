/**
 * Documentation referencing only to the third part of the Project
 */
//Flower constructor, color string, divisions, maplenght
function MyFlower(scene, color, div, mapLength)
{
    this.scene = scene;

	this.mapDiv = mapLength / div; //length of each division
	this.mapInc = (mapLength / div) / 2;//incremental for middle in division
	this.div = div;
	this.numpedals = 5;

	this.sphere = new MySphere(this.scene, 1, 10, 10);
	this.bar = new MyCylinder(this.scene, 0.05,0.05,0.199,10,10);
	this.pedal = new MySphere(this.scene, 0.2, 10, 10);

	this.colorCode;
	this.color = this.createColor(color);
	
	this.currTime;
	this.animation = null;

	//board position
	this.x;
	this.y;

	//indexes on case
	this.i;
	this.j;

	this.transMatrix = mat4.create();
}

MyFlower.prototype.constructor=MyFlower;

//display function
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

//create Appeaence with color
MyFlower.prototype.createColor = function(color)
{	
	if(color == "yellow")
	{
		this.colorCode = 2;
		return this.createAppearence(this.scene, 102,102,0,1);		
	}
	else if(color == "red")
	{
		this.colorCode = 6;
		return this.createAppearence(this.scene, 80,10,10,1);
	}
	else if(color == "purple")
	{
		this.colorCode = 5;
		return this.createAppearence(this.scene, 51,0,102,1);
	}
	else if(color == "white")
	{
		this.colorCode = 1;
		return this.createAppearence(this.scene, 150,150,150,1);
	}
	else if(color == "blue")
	{	
		this.colorCode = 4;
		return this.createAppearence(this.scene, 0,51,102,1);
	}
	else if(color == "green")
	{
		this.colorCode = 3;
		return this.createAppearence(this.scene, 0,50,0,1);
	}
};

//create appearmce with rgba color, 255,255,255,255
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

//translate to the place in board / case
MyFlower.prototype.translate = function(x,y)
{

	var xx = x*this.mapDiv;
	var yy = y*this.mapDiv;

	this.x = xx;
	this.y = yy;

	this.i = x;
	this.j = y;

	var temp = vec3.fromValues(xx,0,yy);

	var matTemp = mat4.create();
	mat4.translate(matTemp, matTemp, temp);

	this.transMatrix = matTemp;
}

//update function
MyFlower.prototype.update=function(currTime) 
{
	this.currTime = currTime;
	if(this.animation != null)
	{
		this.transMatrix = this.animation.getTransformation(currTime);
	}
};

//animate flower to final position with key animation
MyFlower.prototype.animate=function(id, span, firstX, firstY, lastX, lastY, Xinc, Yinc, firstTime)
{
	this.translate(500 , 500);
	this.animation = new KeyAnimation(id, span);
	this.currTime = firstTime;
	var incTime = span * 1000 / 2;

	var x0 = firstX + Xinc;
	var y0 = firstY + Yinc;

	var x1 = lastX * this.mapDiv;
	var y1 = lastY * this.mapDiv;
	
	//[time, transX, transY, transZ, rotX, rotY, rotZ, scaleX, scaleY, ScaleZ]
	this.animation.addControlPoint(firstTime, x0 , 0, y0, 0,0,0, 1,1,1);
	this.animation.addControlPoint(firstTime + incTime, (x0 + x1) / 2, 5, (y0 + y1) / 2, 0,0,0, 1,1,1);	
	this.animation.addControlPoint(firstTime + 2*incTime, x1, 0, y1, 0,0,0, 1,1,1);
};

MyFlower.prototype.updateTextureCoords=function(s, t) {};