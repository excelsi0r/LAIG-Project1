function MyBoard(scene, div, texture, texture2, auxtexture, sr, sg, sb, sa, rps) 
{
    this.scene = scene;

    this.div = div;
     
    this.su = 2;
    this.sv = 6;  
 
    this.sr = sr;
    this.sg = sg;
    this.sb = sb; 
    this.sa = sa;

    this.tileid = 1;
    this.tileidp1 = 101;
    this.tileidp2 = 201;

	this.selectedFlower = null;
	this.listOfNextPlays = [];
    this.matrixPic = [];
    this.matrixBoard = null;
    this.state = "menu";

    //estes valores sao gerais e nao hardcoded,a shader esta pronta para quaisquer valores, faz o mesmo caso variem 
    this.parts = 10.0; //comprimento de cada divisao em texture
    this.RPS = rps;    //Refresh por segundo, setado no inicio do Xml, pode ser mudado e por isso muda aqui tb
    this.update = 0.0; //Estado currente da animaçao
    this.currTime;     //tempo atual da chamada updateshader
    this.firstUpdate = 0; //se o primeira chamada ao updateshader ja esta 
    this.animdur = 60.0; // duraçao da animaçao de piscar
    this.MapInc = 10; //comprimento do board
    this.inc = (this.MapInc / this.div) / 2; //map increment for middle

	//textures
    this.texture = texture;//textura da parte de cima   
    this.texture2 = texture2;//textura da parte de baixo do board
    this.auxtexture = auxtexture;//texture for cases

    //Board and shader
    this.board = new MyPlane(this.scene, 1, 1, this.div * this.parts, this.div * this.parts);//board
    this.chess = new CGFshader(this.scene.gl, "../shaders/round.vert", "../shaders/round.frag");
    this.shaderInit();
    this.createBoardPicking();

    //create case1  
    this.p1case = new MyCase(this.scene, 3,9, this.div, this.MapInc,this.parts,this.auxtexture, this.texture2, this.tileidp1, -3, 5);    

    //create case2    
    this.p2case = new MyCase(this.scene, 3,9, this.div, this.MapInc,this.parts,this.auxtexture, this.texture2, this.tileidp2, 13, 5);    
};

MyBoard.prototype = Object.create(CGFobject.prototype);
MyBoard.prototype.constructor=MyBoard;

MyBoard.prototype.shaderInit=function()
{
	this.chess.setUniformsValues({div: this.div});
    this.chess.setUniformsValues({su: this.su});
    this.chess.setUniformsValues({sv: this.sv});

    this.chess.setUniformsValues({parts: this.parts});
    this.chess.setUniformsValues({animdur: this.animdur});
 
    this.chess.setUniformsValues({sr: this.sr});
    this.chess.setUniformsValues({sg: this.sg});
    this.chess.setUniformsValues({sb: this.sb});
    this.chess.setUniformsValues({sa: this.sa});
};

MyBoard.prototype.display=function(material)
{       

	//log picking
	this.logPicking();

	
	//DISPLAY BOARD

    	//display internal board
		this.displayInternalBoard(material);    

		//display player 1 case
		this.p1case.display(material);

		//display player 2 case
		this.p2case.display(material);


	//PICKING

		//board tiles display
		this.displayBoardTiles();

		//display p1 case tiles
		this.p1case.displayBoardTiles();

		//display p2 case tiles
		this.p2case.displayBoardTiles();

}
MyBoard.prototype.updateTextureCoords=function(s,t){};

MyBoard.prototype.updateBoard=function(currTime)
{
    if(this.firstUpdate <= 0)
    {
        this.currTime = currTime;
        this.chess.setUniformsValues({update: this.update});
        this.update++; this.firstUpdate = 1;
    }
    else
    {
        var diff = currTime - this.currTime;
        this.currTime = currTime;

        var n_part_asserts = (diff * this.RPS)  / 1000;
        var assertPoint = Math.round(n_part_asserts);
        
        
        this.update += assertPoint;

        if(this.update >= this.animdur)
        {
            this.update = 0.0;
        }

        this.chess.setUniformsValues({update: this.update});

    }

    if(this.scene.GameMode != this.scene.previousGameMode)
	{
		if(this.scene.GameMode == 0)
		{
			this.resetBoard();
		}
		else
		{
			this.makeRequest("new");
			this.makeRequest("p1");
			this.makeRequest("p2");
			this.makeRequest("state");
			this.makeRequest("listPlays");
		}
	}

	this.scene.previousGameMode = this.scene.GameMode;
};

MyBoard.prototype.createBoardPicking=function()
{
    for(var i = 0; i < this.div - 2; i++)
    {
        
        this.matrixPic[i] = [];

        for(var j = 0; j < this.div - 2; j++)
        {
            this.matrixPic[i][j] = new MyTile(this.scene, this.tileid, this.div, this.MapInc, j, i, this.inc, this.inc);
            this.tileid++;
        }
    }
};

MyBoard.prototype.changeState=function(response)
{
	this.state = response;
};

MyBoard.prototype.updatePlaysList=function(listPlays)
{
	var r = /\d+/g;
	var list = [];
	var m;

	while ((m = r.exec(listPlays)) != null) 
	{
		list.push(m[0]);
	}

	this.listOfNextPlays = [];

	for(var i = 0; i < list.length; i+=2)
	{
		this.listOfNextPlays.push([list[i], list[i+1]]);
	}
};


MyBoard.prototype.createBoardElems=function(board)
{
	var r = /\d+/g;
	var list = [];
	var m;

	while ((m = r.exec(board)) != null) 
	{
		list.push(m[0]);
	}
	
	this.matrixBoard = [];

	for(var i = 0; i < this.div; i++)
	{
		this.matrixBoard[i] = [];

		for(var j = 0; j < this.div; j++)
		{
			var index = i * this.div + j;
			var elem = list[index];

			if(elem == 0 || (elem >= 10 && elem <= 49)) //empty
			{
				this.matrixBoard[i][j] = null;			
			}
			else if(elem == 7) //Tree
			{
				 var tree = new MyTree(this.scene, this.div, this.MapInc);
				 tree.translate(j, i);
				 this.matrixBoard[i][j] = tree;
			}
			else if(elem == 1) //White Flower
			{
				var flower = new MyFlower(this.scene, "white",this.div, this.MapInc);
				flower.translate(j, i);
				this.matrixBoard[i][j] = flower;
			}
			else if(elem == 2) //Yellow Flower
			{
				var flower = new MyFlower(this.scene, "yellow",this.div, this.MapInc);
				flower.translate(j, i);
				this.matrixBoard[i][j] = flower;
			}
			else if(elem == 3) //Green Flower
			{
				var flower = new MyFlower(this.scene, "green",this.div, this.MapInc);
				flower.translate(j, i);
				this.matrixBoard[i][j] = flower;
			}
			else if(elem == 4) //Blue Flower
			{
				var flower = new MyFlower(this.scene, "blue",this.div, this.MapInc);
				flower.translate(j, i);
				this.matrixBoard[i][j] = flower;
			}
			else if(elem == 5) //Purple Flower
			{
				var flower = new MyFlower(this.scene, "purple",this.div, this.MapInc);
				flower.translate(j, i);
				this.matrixBoard[i][j] = flower;
			}
			else if(elem == 6) //Red Flower
			{
				var flower = new MyFlower(this.scene, "red",this.div, this.MapInc);
				flower.translate(j, i);
				this.matrixBoard[i][j] = flower;
			}
			else if(elem >= 110 && elem <= 149) //Red Flower
			{
				var alien = new MyAlien(this.scene, "black", this.div, this.MapInc);  
				alien.translate(j, i);
				this.matrixBoard[i][j] = alien;
			}
			else if(elem >= 210 && elem <= 249) //Red Flower
			{
				var alien = new MyAlien(this.scene, "white", this.div, this.MapInc);  
				alien.translate(j, i);
				this.matrixBoard[i][j] = alien;
			}
		}
	}
};

MyBoard.prototype.displayInternalBoard=function(material)
{ 
    //Board display
	if(this.scene.pickMode == false)
 	{
		material.setTexture(this.texture);
		this.scene.pushMatrix();

			material.apply();
			this.scene.setActiveShader(this.chess);    

			this.scene.translate(this.MapInc/2,0,this.MapInc/2); 
			this.scene.rotate(Math.PI/2, -1,0,0);
			this.scene.scale(this.MapInc,this.MapInc,1); 

			this.board.display();        

			this.scene.setActiveShader(this.scene.defaultShader);

		this.scene.popMatrix();

		//Inverted Board
		material.setTexture(this.texture2);
		this.scene.pushMatrix();

			material.apply();

			this.scene.translate(this.MapInc/2,0,this.MapInc/2); 
			this.scene.rotate(Math.PI/2, 1,0,0);
			this.scene.scale(this.MapInc,this.MapInc,1);                  
			this.board.display();

		this.scene.popMatrix();  

		//elems
		if(this.matrixBoard != null)
		{
			for(var i = 0; i < this.div; i++)
			{
				for(var j = 0; j < this.div; j++)
				{
					if(this.matrixBoard[i][j] != null)
					{
						this.matrixBoard[i][j].display();
					}
				}
			}
		}
 	}
};

MyBoard.prototype.displayBoardTiles=function()
{  
    var tileid = 0;
    for(var i = 0; i < this.div - 2; i++)
    {
        for(var j = 0; j < this.div - 2; j++)
        {        
                 this.matrixPic[i][j].display();
        }
    }
};

MyBoard.prototype.logPicking = function()
{
	if (this.scene.pickMode == false) 
	{
		if (this.scene.pickResults != null && this.scene.pickResults.length > 0) 
		{
			for (var i=0; i< this.scene.pickResults.length; i++) 
			{
				var obj = this.scene.pickResults[i][0];


				if (obj)
				{
					var customId = this.scene.pickResults[i][1];				
					//console.log("Picked object: " + obj + ", with pick id " + customId);

					this.hadleObjectPicked(customId);
				}
				
			}
			this.scene.pickResults.splice(0,this.scene.pickResults.length);
		}		
	}
};

MyBoard.prototype.resetMatrix=function()
{
	this.matrixBoard = null;
};

MyBoard.prototype.resetBoard=function()
{
			this.resetMatrix();
			this.p1case.resetMatrix();		
			this.p2case.resetMatrix();
			this.state = "menu";
};

MyBoard.prototype.playExists=function(x, y)
{
	var exists = false;

	for(var i = 0; i < this.listOfNextPlays.length; i++)
	{
		var tempX = this.listOfNextPlays[i][0];
		var tempY = this.listOfNextPlays[i][1];

		if(x == tempX && y == tempY)
		{
			exists = true;
			break;
		}
	}	

	return exists;
};

MyBoard.prototype.hadleObjectPicked=function(id)
{
	if(id > 100 && this.state == "p1")
	{	
		var x = (id - 100 - 1) % (this.p1case.divX);
		var y = Math.floor((id - 100 - 1) / (this.p1case.divX));

		var flower = this.p1case.matrixBoard[y][x];

		if(flower != null)
		{
			this.selectedFlower = [x,y];
		}

	}
	else if(id > 200 && this.state == "p2")
	{	
		var x = (id - 200 - 1) % (this.p2case.divX);
		var y = Math.floor((id - 200 - 1) / (this.p2case.divX));

		var flower = this.p2case.matrixBoard[y][x];

		if(flower != null)
		{
			this.selectedFlower = [x,y];
		}
	}
	else if(id < 100 && this.selectedFlower != null)
	{
		var x = (id - 1) % (this.div - 2) + 2;
		var y = Math.floor((id - 1) / (this.div - 2)) + 2;

		var exists = this.playExists(x,y);

		if(exists)
		{
			//PLAY
			this.selectedFlower = null;
			console.log("play");
		}

		
	}

};