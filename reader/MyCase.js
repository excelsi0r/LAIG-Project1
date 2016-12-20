function MyCase(scene, divX, divY, NumdiV, MapLength, textdiv, texture, texture2, tileid, x, y)
{
    this.scene = scene;

	//elems
	this.x = x;
	this.y = y;
	this.divX = divX;
	this.divY = divY;
	this.NumdiV = parseInt(NumdiV);
	this.mapInc = parseFloat(MapLength);
	this.mapDiv = (MapLength / NumdiV);
	this.inc = this.mapDiv / 2;
	this.textureDiv = textdiv;
	this.texture = texture;
	this.texture2 = texture2;
	this.border = 0.05;

	//case and shader
	this.case = new MyPlane(this.scene, 1, 1, this.divX * this.textureDiv, this.divY * this.textureDiv);	
    this.chess = new CGFshader(this.scene.gl, "../shaders/normal.vert", "../shaders/normal.frag");

	//matrixes
	this.tileid = tileid;
	this.matrixPic = [];
	this.matrixBoard = null;
	this.createBoardPicking();

}

MyCase.prototype.constructor=MyCase;

MyCase.prototype.display = function(appearence)
{	
	this.displayCaseElems(appearence);
};

MyCase.prototype.createCaseElems = function(caseBoard)
{
	var r = /\d+/g;
	var list = [];
	var m;

	while ((m = r.exec(caseBoard)) != null) 
	{
		list.push(m[0]);
	}

	this.matrixBoard = [];

	for(var i = 0; i < this.divY; i++)
	{
		this.matrixBoard[i] = [];

		for(var j = 0; j < this.divX; j++)
		{
			var index = i * this.divX + j;
			var elem = list[index];
			var flower;

			if(elem == 1) //White Flower
			{
				flower = new MyFlower(this.scene, "white", this.NumdiV, this.mapInc);			
			}
			else if(elem == 2) //Yellow Flower
			{
				flower = new MyFlower(this.scene, "yellow", this.NumdiV, this.mapInc);	
			}
			else if(elem == 3) //Green Flower
			{
				flower = new MyFlower(this.scene, "green", this.NumdiV, this.mapInc);	
			}
			else if(elem == 4) //Blue Flower
			{
				flower = new MyFlower(this.scene, "blue", this.NumdiV, this.mapInc);	
			}
			else if(elem == 5) //Purple Flower
			{
				flower = new MyFlower(this.scene, "purple", this.NumdiV, this.mapInc);	
			}
			else if(elem == 6) //Red Flower
			{
				flower = new MyFlower(this.scene, "red", this.NumdiV, this.mapInc);	
			}
			
			flower.translate(j, i);
			this.matrixBoard[i][j] = flower;
		}
	}
	
};

MyCase.prototype.displayCaseElems=function(appearence)
{
	if(this.scene.pickMode == false)
 	{
		this.scene.setActiveShader(this.chess);   

		appearence.setTexture(this.texture);
		this.scene.pushMatrix();

			appearence.apply();

			this.scene.translate(this.x, 0, this.y);
			this.scene.scale(this.mapDiv * this.divX,1,this.mapDiv * this.divY);	
			this.scene.rotate(Math.PI/2, -1,0,0);
			this.case.display();

		this.scene.popMatrix();

		this.scene.setActiveShader(this.scene.defaultShader);

		appearence.setTexture(this.texture2);
		this.scene.pushMatrix();

			appearence.apply();
			this.scene.translate(this.x, 0, this.y);
			this.scene.scale(this.mapDiv * this.divX,1,this.mapDiv * this.divY);
			this.scene.rotate(Math.PI/2, 1,0,0);
			this.case.display();

		this.scene.popMatrix();


		appearence.setTexture(null);	
		this.scene.pushMatrix();

			appearence.apply();
			this.scene.translate(this.x, -0.01, this.y);
			this.scene.scale(this.mapDiv * this.divX + this.border, 1 ,this.mapDiv * this.divY + this.border);
			this.scene.rotate(Math.PI/2, -1,0,0);
			this.case.display();

		this.scene.popMatrix();
		this.scene.pushMatrix();

			appearence.apply();
			this.scene.translate(this.x, 0.01, this.y);
			this.scene.scale(this.mapDiv * this.divX + this.border,1,this.mapDiv * this.divY + this.border);
			this.scene.rotate(Math.PI/2, 1,0,0);
			this.case.display();

		this.scene.popMatrix();

		//elems 
		if(this.matrixBoard != null)
		{
			for(var i = 0; i < this.divY; i++)
			{
				for(var j = 0; j < this.divX; j++)
				{
					if(this.matrixBoard[i][j] != null)
					{
						this.scene.pushMatrix();
							this.scene.translate(this.x - 0.9 - this.inc, 0, this.y - 3.65 - this.inc);
							this.matrixBoard[i][j].display();
						this.scene.popMatrix();
					}
				}
			}
		}
 	}
};

MyCase.prototype.displayBoardTiles=function()
{  
    for(var i = 0; i < this.divY; i++)
    {
        for(var j = 0; j < this.divX; j++)
        {        
                 this.matrixPic[i][j].display();
        }
    }
};

MyCase.prototype.createBoardPicking=function()
{
    for(var i = 0; i < this.divY; i++)
    {
        
        this.matrixPic[i] = [];

        for(var j = 0; j < this.divX; j++)
        {
            this.matrixPic[i][j] = new MyTile(this.scene, this.tileid, this.NumdiV, this.mapInc, j, i, this.x - 1.82, this.y-4.54) ;
            this.tileid++;
        }
    }
};

MyCase.prototype.resetMatrix=function()
{
	this.matrixBoard = null;
}

MyCase.prototype.updateTextureCoords=function(s, t) {};