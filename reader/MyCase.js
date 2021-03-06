/**
 * Documentation referencing only to the third part of the Project
 */
//case constructor, divions X, divisions y, number diviions, maplenth, texture divions,
//texture, texture2, tileid, x, y positions, animation duration and selected colors
function MyCase(scene, divX, divY, NumdiV, MapLength, textdiv, texture, texture2, tileid, x, y,animdur,sr,sg,sb,sa)
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
	this.animdur = animdur;
	this.sr = sr;
	this.sg = sg;
	this.sb = sb;
	this.sa = sa;
	this.su = -1;
	this.sv = -1;


	//case and shader
	this.case = new MyPlane(this.scene, 1, 1, this.divX * this.textureDiv, this.divY * this.textureDiv);	
    this.chess = new CGFshader(this.scene.gl, "../shaders/round.vert", "../shaders/round.frag");
    this.shaderInit();

	//matrixes
	this.tileid = tileid;
	this.matrixPic = [];
	this.matrixBoard = null;
	this.createBoardPicking();

}

//initialize shader
MyCase.prototype.shaderInit=function()
{
	this.chess.setUniformsValues({divX: this.divX});
	this.chess.setUniformsValues({divY: this.divY});

    this.chess.setUniformsValues({su: this.su});
    this.chess.setUniformsValues({sv: this.sv});

    this.chess.setUniformsValues({parts: this.textureDiv});
    this.chess.setUniformsValues({animdur: this.animdur});
 
    this.chess.setUniformsValues({sr: this.sr});
    this.chess.setUniformsValues({sg: this.sg});
    this.chess.setUniformsValues({sb: this.sb});
    this.chess.setUniformsValues({sa: this.sa});
};

MyCase.prototype.constructor=MyCase;

//return a new complete matrix copied from the current one
MyCase.prototype.getMatrix=function()
{
	var array = [];

	for(var j = 0; j < this.divY; j++)
	{
		array[j] = [];


		for(var i = 0; i < this.divX; i++)
		{
			if(this.matrixBoard[j][i] != null)
			{
				var color = this.getColorString(this.matrixBoard[j][i].colorCode);
				var flower = new MyFlower(this.scene, color, this.NumdiV, this.mapInc);
				flower.translate(i, j);
				array[j][i] = flower;

			}
			else
				array[j][i] = null;

		}

	}

	return array;
};

//display function
MyCase.prototype.display = function(appearence)
{	
	this.displayCaseElems(appearence);
};

//create acording elems objects in the matrixBoard from a string
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

//display elems
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

//display tiles
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

//create tiles for picking
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

//reset matrixBoard
MyCase.prototype.resetMatrix=function()
{
	this.matrixBoard = null;
};

//set the shader positiono of the flower that was selected (picked)
MyCase.prototype.selectFlowerShader=function(x,y)
{
	this.su = x;
	this.sv = y;
    this.chess.setUniformsValues({su: this.su});
    this.chess.setUniformsValues({sv: this.sv});
};

//update shader
MyCase.prototype.updateCase=function(update)
{
	this.chess.setUniformsValues({update: update});
};

//when PC plays needs to remove a flower from this case, finds the first with the color passed and returns
MyCase.prototype.findFlowerAndNull=function(color)
{
	for(var i = 0; i < this.divY; i++)
	{
		for(var j = 0; j < this.divX; j++)
		{
				if(this.matrixBoard[i][j] != null)
				{
					if(this.matrixBoard[i][j].colorCode == color)
					{
						var flower = this.matrixBoard[i][j];
						this.matrixBoard[i][j] = null;
						return flower; 
					}
				}
		}		
	}
};

MyCase.prototype.updateTextureCoords=function(s, t) {};

//convert color code to string
MyCase.prototype.getColorString=function(color)
{
	if(color == 1)
	{
		return "white";
	}
	else if(color == 2)
	{
		return "yellow";	
	}
 	else if(color == 3)
	{
		return "green";
	}
	else if(color == 4)
	{	
		return "blue";
	}
	else if(color == 5)
	{
		return "purple";
	}
	else if(color == 6)
	{
		return "red";
	}
};

//set a new matrix with acording objects froma a array
MyCase.prototype.setNewMatrix=function(array)
{
	this.matrixBoard = []; 

	for(var j = 0; j < this.divY; j++)
	{
		this.matrixBoard[j] = [];

		for(var i = 0; i < this.divX; i++)
		{
			if(array[j][i] != null)
			{
				var color = this.getColorString(array[j][i].colorCode);
				var flower = new MyFlower(this.scene, color, this.NumdiV, this.mapInc);
				flower.translate(i, j);
				this.matrixBoard[j][i] = flower;

			}
			else
				this.matrixBoard[j][i] = null;

		}

	}


}
