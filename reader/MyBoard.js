function MyBoard(scene, div, texture, texture2, auxtexture, sr, sg, sb, sa, rps, timeoutPlay, replayTimeOut) 
{
    this.scene = scene;

	this.div = div;
    this.divX = div;
    this.divY = div;
 
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
    this.timeoutPlay = timeoutPlay;

    this.transitionView = null;

    //estes valores sao gerais e nao hardcoded,a shader esta pronta para quaisquer valores, faz o mesmo caso variem 
    this.parts = 10.0; //comprimento de cada divisao em texture
    this.RPS = rps;    //Refresh por segundo, setado no inicio do Xml, pode ser mudado e por isso muda aqui tb
    this.update = 0.0; //Estado currente da animaçao
    this.currTime;     //tempo atual da chamada updateshader
    this.timePcPlay;	//tempo para o PC vs PC
    this.firstPCcall = 0;	//primeira execuçao do PC vs PC
    this.firstUpdate = 0; //se o primeira chamada ao updateshader ja esta 
    this.animdur = 60.0; // duraçao da animaçao de piscar
    this.MapInc = 10; //comprimento do board
    this.inc = (this.MapInc / this.div) / 2; //map increment for middle

	//textures
    this.texture = texture;//textura da parte de cima   
    this.texture2 = texture2;//textura da parte de baixo do board
    this.auxtexture = auxtexture;//texture for cases

   	//adding marquer stuff
	this.P1 = "";
	this.P2 = "";
	this.Time = "0";
	this.Log = "Hello! Choose Game";
	
	this.P1Dom = this.scene.interface.console.add(this, 'P1');
	this.P2Dom = this.scene.interface.console.add(this, 'P2');
	this.TimeDom = this.scene.interface.console.add(this, 'Time');
	this.LogDom = this.scene.interface.console.add(this, 'Log');

    //Board and shader
    this.board = new MyPlane(this.scene, 1, 1, this.div * this.parts, this.div * this.parts);//board
    this.chess = new CGFshader(this.scene.gl, "../shaders/round2.vert", "../shaders/round2.frag");
    this.shaderInit();
    this.createBoardPicking();

    //timeout and end
    this.timeoutHappen = false;
    this.onesec = 0;
    this.secondsElapsed = 0;

    //plasys  history
    this.playsHistoric = [];

    //create case1  
    this.p1case = new MyCase(this.scene, 3,9, this.div, this.MapInc,this.parts,this.auxtexture, this.texture2, this.tileidp1, -3, 5, this.animdur, this.sr, this.sg, this.sb, this.sa);    

    //create case2    
    this.p2case = new MyCase(this.scene, 3,9, this.div, this.MapInc,this.parts,this.auxtexture, this.texture2, this.tileidp2, 13, 5, this.animdur, this.sr, this.sg, this.sb, this.sa);    
	
	//crate default camera
	this.defaultCamera = new CGFcamera(Math.PI*45/180, 0.1, 500, vec3.fromValues(5, 20, 5), vec3.fromValues(5, 0, 4.99));
	this.scene.interface.setActiveCamera(this.defaultCamera);


	//create button Undo
	this.scene.interface.gui.add(this, 'Undo');

	//create Button Replay
	this.ReplayTime = replayTimeOut;
	this.replayHappening = false;
	this.replayTime;
	this.replayIndex;
	this.scene.interface.gui.add(this, 'Replay');

	this.scene.interface.replay.add(this, 'ReplayTime', 2, 10);

	//add reseet button
	this.scene.interface.gamemode.add(this, 'New');


};

MyBoard.prototype = Object.create(CGFobject.prototype);
MyBoard.prototype.constructor=MyBoard;

MyBoard.prototype.shaderInit=function()
{
	this.chess.setUniformsValues({divX: this.div});
	this.chess.setUniformsValues({divY: this.div});
	
    this.chess.setUniformsValues({su: this.su});
    this.chess.setUniformsValues({sv: this.sv});

    this.chess.setUniformsValues({parts: this.parts});
    this.chess.setUniformsValues({animdur: this.animdur});
 
    this.chess.setUniformsValues({sr: this.sr});
    this.chess.setUniformsValues({sg: this.sg});
    this.chess.setUniformsValues({sb: this.sb});
    this.chess.setUniformsValues({sa: this.sa});

   	this.resetBlink();  

};

MyBoard.prototype.display=function(material)
{       

	//log picking
	this.logPicking();

	
	//DISPLAY BOARD

    	//display internal board
		this.displayInternalBoard(material);    

		//display player 4 case
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
	//time updating and shaders
    if(this.firstUpdate <= 0)
    {
        this.currTime = currTime;
        this.chess.setUniformsValues({update: this.update});
        this.p1case.updateCase(this.update);
        this.p2case.updateCase(this.update);
        this.update++; this.firstUpdate = 1;
        this.timeoutFirstPlay = currTime;
    }
    else
    {
        var diff = currTime - this.currTime;
        this.updateTimeoutPlay(diff, currTime);
        this.currTime = currTime;

        var n_part_asserts = (diff * this.RPS)  / 1000;
        var assertPoint = Math.round(n_part_asserts);
        
        
        this.update += assertPoint;

        if(this.update >= this.animdur)
        {
            this.update = 0.0;
        }

        this.chess.setUniformsValues({update: this.update});
        this.p1case.updateCase(this.update);
        this.p2case.updateCase(this.update);

    }

	//Pc plays in case of PC vs PC
    if(this.scene.GameMode == 4)
    {
    	if(this.firstPCcall <= 0)
    	{
    		this.firstPCcall = 1;
    		this.timePcPlay = currTime;
    	}
    	else if(currTime - this.timePcPlay >= this.ReplayTime * 1000)
    	{
			this.timePcPlay = currTime;

			if(this.state == "p1")
			{
				this.play_PCvPC_P1();
			}
			else if(this.state == "p2")
			{
				this.play_PCvPC_P2();
			}
    	}
    }

    //In case of new GameMode

    if(this.scene.GameMode != this.scene.previousGameMode)
	{
		this.New();
	}

	this.scene.previousGameMode = this.scene.GameMode;

	//update elems
	if(this.matrixBoard != null)
	{
		for(var i = 0; i < this.divY; i++)
		{
			for(var j = 0; j < this.divX; j++)
			{
				if(this.matrixBoard[i][j] != null)
				{
					this.matrixBoard[i][j].update(currTime);
				}
			}
		}
	}

	//update View
	this.updateView(currTime);

	//update replay
	if(this.replayHappening)
	{
		if(this.currTime - this.replayTime >= this.ReplayTime * 1000)
		{
			this.ReplayPlay(this.replayIndex);
			this.replayTime = this.currTime;
		}
	}

	//check end
	this.checkEndOfGame();
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

MyBoard.prototype.New=function()
{
	this.playsHistoric = [];

	this.resetBlink();
	this.p1case.selectFlowerShader(-1,-1);
	this.p2case.selectFlowerShader(-1,-1);
	this.selectedFlower = null;

	if(this.scene.GameMode == 0)
	{
		this.resetBoard();
		this.transitionView = new MyViewTransition(this.scene, "default",this.currTime, 4);
		this.newConsole("", "","", "Choose GameMode");
		this.resetTimes();
	}
	else
	{
		this.createNewHistoricSpace();

		this.makeRequest("new");
		this.makeRequest("p1");
		this.makeRequest("p2");
		this.makeRequest("state");
		this.makeRequest("listPlays");
		this.makeRequest("scoreP1");
		this.makeRequest("scoreP2");

		this.makeRequest("newhistoric");
		this.makeRequest("p1historic");
		this.makeRequest("p2historic");
		this.makeRequest("statehistoric");
		this.makeRequest("scorep1historic");
		this.makeRequest("scorep2historic");
		this.makeRequest("listofplayshistoric");

		if(this.scene.GameMode == 1)
		{
			this.transitionView = new MyViewTransition(this.scene, "p1",this.currTime, 4);
			this.resetTimes();
			this.newConsole(this.P1, this.P2, this.Time,  "Player 1 turn");
		}
		else if(this.scene.GameMode == 2)
		{
			this.transitionView = new MyViewTransition(this.scene, "default",this.currTime, 4);
			this.resetTimes();
			this.newConsole(this.P1, this.P2, this.Time, "Player 1 turn");
		}
		else if(this.scene.GameMode == 3)
		{
			this.transitionView = new MyViewTransition(this.scene, "default",this.currTime, 4);
			this.resetTimes();
			this.newConsole(this.P1, this.P2, this.Time, "Player 1 turn");
		}

		if(this.scene.GameMode == 4)
		{
			this.transitionView = new MyViewTransition(this.scene, "default",this.currTime, 4);
			this.play_PCvPC_P1();
			this.newConsole(this.P1, this.P2, this.Time,  "PC vs PC");
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

MyBoard.prototype.updateP1Alien=function(position)
{
	var r = /\d+/g;
	var list = [];
	var m;

	while ((m = r.exec(position)) != null) 
	{
		list.push(m[0]);
	}

	for(var i = 0; i < this.div; i++)
	{
	
		for(var j = 0; j < this.div; j++)
		{
			if(this.matrixBoard[i][j] instanceof MyAlien)
			{
				if(this.matrixBoard[i][j].colorString == "black")
				{
					//id, span, lastX, lastY, firstTime
					this.matrixBoard[i][j].animate(null, 2, list[0]-1, list[1]-1, this.currTime);
					break;
				}
			}
		}
	}	
};

MyBoard.prototype.updateP2Alien=function(position)
{
	var r = /\d+/g;
	var list = [];
	var m;

	while ((m = r.exec(position)) != null) 
	{
		list.push(m[0]);
	}

	for(var i = 0; i < this.div; i++)
	{
	
		for(var j = 0; j < this.div; j++)
		{
			if(this.matrixBoard[i][j] instanceof MyAlien)
			{
				if(this.matrixBoard[i][j].colorString == "white")
				{
					this.matrixBoard[i][j].animate(null, 2, list[0]-1, list[1]-1, this.currTime);
					break;
				}
			}
		}
	}
};

MyBoard.prototype.computerPlayP2=function(play)
{
	var r = /\d+/g;
	var list = [];
	var m;

	while ((m = r.exec(play)) != null) 
	{
		list.push(m[0]);
	}	

	var x = list[0];	
	var y = list[1];
	var flowerCode = list[2];
	var xS;
	var yS;
	
	if(x != 100 && y != 100 && flowerCode != 100)
	{
		var flower = this.p2case.findFlowerAndNull(flowerCode); xS = flower.i + 0; yS = flower.j + 0;
		flower.animate(null, 2 ,flower.x +1, flower.y+1, x-1, y-1, 10.4,-0.05 ,this.currTime);
		this.matrixBoard[y-1][x-1] = flower;
	

		var l = this.playsHistoric.length - 1;
		if(l > 0)
		{
			this.playsHistoric[l]['caseP2matrix'] = this.p2case.getMatrix();
			this.playsHistoric[l-1]['playp2'] = [x, y, flowerCode];
			this.playsHistoric[l-1]['pickedp2'] = [xS, yS];
		}	
	}

};

MyBoard.prototype.computerPlayP1=function(play)
{
	var r = /\d+/g;
	var list = [];
	var m;

	while ((m = r.exec(play)) != null) 
	{
		list.push(m[0]);
	}	

	var x = list[0];	
	var y = list[1];
	var flowerCode = list[2];
	
	if(x != 100 && y != 100 && flowerCode != 100)
	{
		var flower = this.p1case.findFlowerAndNull(flowerCode);
		flower.animate(null, 2 ,flower.x +1, flower.y+1, x-1, y-1, -5.4,-0.05 ,this.currTime);
		this.matrixBoard[y-1][x-1] = flower;
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
	
	var r = /\d+/g;
	var list = [];
	var m;

	while ((m = r.exec(board)) != null) 
	{
		list.push(m[0]);
	}
	
	this.matrixBoard = [];

	for(var j = 0; j < this.div; j++)
	{
		this.matrixBoard[j] = [];

		for(var i = 0; i < this.div; i++)
		{
			var index = j * this.div + i;
			var elem = list[index];
			var obj;

			if(elem == 0 || (elem >= 10 && elem <= 49)) //empty
			{
				 obj = null;			
			}
			else
			{
				if(elem == 7) //Tree
				{
					 obj = new MyTree(this.scene, this.div, this.MapInc);
				}
				else if(elem == 1) //White Flower
				{
					obj = new MyFlower(this.scene, "white",this.div, this.MapInc);
				}
				else if(elem == 2) //Yellow Flower
				{
					obj = new MyFlower(this.scene, "yellow",this.div, this.MapInc);
				}
				else if(elem == 3) //Green Flower
				{
					obj = new MyFlower(this.scene, "green",this.div, this.MapInc);
				}
				else if(elem == 4) //Blue Flower
				{
					obj = new MyFlower(this.scene, "blue",this.div, this.MapInc);
				}
				else if(elem == 5) //Purple Flower
				{
					obj = new MyFlower(this.scene, "purple",this.div, this.MapInc);
				}
				else if(elem == 6) //Red Flower
				{
					obj = new MyFlower(this.scene, "red",this.div, this.MapInc);
				}
				else if(elem >= 110 && elem <= 149) //Alien Black P1
				{
					obj = new MyAlien(this.scene, "black", this.div, this.MapInc);  
				}
				else if(elem >= 210 && elem <= 249) //Alien White P2
				{
					obj = new MyAlien(this.scene, "white", this.div, this.MapInc); 
				}
	

				obj.translate(i, j);
			}

			this.matrixBoard[j][i] = obj;
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
		this.p2case.selectFlowerShader(-1,-1);
		this.p1case.selectFlowerShader(-1,-1);
		this.resetBlink();
};

MyBoard.prototype.resetBlink=function()
{

    this.chess.setUniformsValues({s11: false});
    this.chess.setUniformsValues({s12: false});
    this.chess.setUniformsValues({s13: false});
    this.chess.setUniformsValues({s14: false});
    this.chess.setUniformsValues({s15: false});
    this.chess.setUniformsValues({s16: false});
    this.chess.setUniformsValues({s17: false});
    this.chess.setUniformsValues({s18: false});
    this.chess.setUniformsValues({s19: false});

    this.chess.setUniformsValues({s21: false});
    this.chess.setUniformsValues({s22: false});
    this.chess.setUniformsValues({s23: false});
    this.chess.setUniformsValues({s24: false});
    this.chess.setUniformsValues({s25: false});
    this.chess.setUniformsValues({s26: false});
    this.chess.setUniformsValues({s27: false});
    this.chess.setUniformsValues({s28: false});
    this.chess.setUniformsValues({s29: false});
  
    this.chess.setUniformsValues({s31: false});
    this.chess.setUniformsValues({s32: false});
    this.chess.setUniformsValues({s33: false});
    this.chess.setUniformsValues({s34: false});
    this.chess.setUniformsValues({s35: false});
    this.chess.setUniformsValues({s36: false});
    this.chess.setUniformsValues({s37: false});
    this.chess.setUniformsValues({s38: false});
    this.chess.setUniformsValues({s39: false});

    this.chess.setUniformsValues({s41: false});
    this.chess.setUniformsValues({s42: false});
    this.chess.setUniformsValues({s43: false});
    this.chess.setUniformsValues({s44: false});
    this.chess.setUniformsValues({s45: false});
    this.chess.setUniformsValues({s46: false});
    this.chess.setUniformsValues({s47: false});
    this.chess.setUniformsValues({s48: false});
    this.chess.setUniformsValues({s49: false});

    this.chess.setUniformsValues({s51: false});
    this.chess.setUniformsValues({s52: false});
    this.chess.setUniformsValues({s53: false});
    this.chess.setUniformsValues({s54: false});
    this.chess.setUniformsValues({s55: false});
    this.chess.setUniformsValues({s56: false});
    this.chess.setUniformsValues({s57: false});
    this.chess.setUniformsValues({s58: false});
    this.chess.setUniformsValues({s59: false});

    this.chess.setUniformsValues({s61: false});
    this.chess.setUniformsValues({s62: false});
    this.chess.setUniformsValues({s63: false});
    this.chess.setUniformsValues({s64: false});
    this.chess.setUniformsValues({s65: false});
    this.chess.setUniformsValues({s66: false});
    this.chess.setUniformsValues({s67: false});
    this.chess.setUniformsValues({s68: false});
    this.chess.setUniformsValues({s69: false});

    this.chess.setUniformsValues({s71: false});
    this.chess.setUniformsValues({s72: false});
    this.chess.setUniformsValues({s73: false});
    this.chess.setUniformsValues({s74: false});
    this.chess.setUniformsValues({s75: false});
    this.chess.setUniformsValues({s76: false});
    this.chess.setUniformsValues({s77: false});
    this.chess.setUniformsValues({s78: false});
    this.chess.setUniformsValues({s79: false});

    this.chess.setUniformsValues({s81: false});
    this.chess.setUniformsValues({s82: false});
    this.chess.setUniformsValues({s83: false});
    this.chess.setUniformsValues({s84: false});
    this.chess.setUniformsValues({s85: false});
    this.chess.setUniformsValues({s86: false});
    this.chess.setUniformsValues({s87: false});
    this.chess.setUniformsValues({s88: false});
    this.chess.setUniformsValues({s89: false});

    this.chess.setUniformsValues({s91: false});
    this.chess.setUniformsValues({s92: false});
    this.chess.setUniformsValues({s93: false});
    this.chess.setUniformsValues({s94: false});
    this.chess.setUniformsValues({s95: false});
    this.chess.setUniformsValues({s96: false});
    this.chess.setUniformsValues({s97: false});
    this.chess.setUniformsValues({s98: false});
    this.chess.setUniformsValues({s99: false});		
};

MyBoard.prototype.setBlink=function(listOfNextPlays)
{
	for(var i = 0; i < listOfNextPlays.length; i++)
	{
		var X = listOfNextPlays[i][0] - 1;
		var Y = 9 -listOfNextPlays[i][1]  + 2;
		
		if(Y == 1 && X == 1)	this.chess.setUniformsValues({s11: true});
		else if(Y == 1 && X == 2)	this.chess.setUniformsValues({s12: true});
		else if(Y == 1 && X == 3)	this.chess.setUniformsValues({s13: true});
		else if(Y == 1 && X == 4)	this.chess.setUniformsValues({s14: true});
		else if(Y == 1 && X == 5)	this.chess.setUniformsValues({s15: true});
		else if(Y == 1 && X == 6)	this.chess.setUniformsValues({s16: true});
		else if(Y == 1 && X == 7)	this.chess.setUniformsValues({s17: true});
		else if(Y == 1 && X == 8)	this.chess.setUniformsValues({s18: true});
		else if(Y == 1 && X == 9)	this.chess.setUniformsValues({s19: true});

		else if(Y == 2 && X == 1)	this.chess.setUniformsValues({s21: true});
		else if(Y == 2 && X == 2)	this.chess.setUniformsValues({s22: true});
		else if(Y == 2 && X == 3)	this.chess.setUniformsValues({s23: true});
		else if(Y == 2 && X == 4)	this.chess.setUniformsValues({s24: true});
		else if(Y == 2 && X == 5)	this.chess.setUniformsValues({s25: true});
		else if(Y == 2 && X == 6)	this.chess.setUniformsValues({s26: true});
		else if(Y == 2 && X == 7)	this.chess.setUniformsValues({s27: true});
		else if(Y == 2 && X == 8)	this.chess.setUniformsValues({s28: true});
		else if(Y == 2 && X == 9)	this.chess.setUniformsValues({s29: true});

		else if(Y == 3 && X == 1)	this.chess.setUniformsValues({s31: true});
		else if(Y == 3 && X == 2)	this.chess.setUniformsValues({s32: true});
		else if(Y == 3 && X == 3)	this.chess.setUniformsValues({s33: true});
		else if(Y == 3 && X == 4)	this.chess.setUniformsValues({s34: true});
		else if(Y == 3 && X == 5)	this.chess.setUniformsValues({s35: true});
		else if(Y == 3 && X == 6)	this.chess.setUniformsValues({s36: true});
		else if(Y == 3 && X == 7)	this.chess.setUniformsValues({s37: true});
		else if(Y == 3 && X == 8)	this.chess.setUniformsValues({s38: true});
		else if(Y == 3 && X == 9)	this.chess.setUniformsValues({s39: true});

		else if(Y == 4 && X == 1)	this.chess.setUniformsValues({s41: true});
		else if(Y == 4 && X == 2)	this.chess.setUniformsValues({s42: true});
		else if(Y == 4 && X == 3)	this.chess.setUniformsValues({s43: true});
		else if(Y == 4 && X == 4)	this.chess.setUniformsValues({s44: true});
		else if(Y == 4 && X == 5)	this.chess.setUniformsValues({s45: true});
		else if(Y == 4 && X == 6)	this.chess.setUniformsValues({s46: true});
		else if(Y == 4 && X == 7)	this.chess.setUniformsValues({s47: true});
		else if(Y == 4 && X == 8)	this.chess.setUniformsValues({s48: true});
		else if(Y == 4 && X == 9)	this.chess.setUniformsValues({s49: true});

		else if(Y == 5 && X == 1)	this.chess.setUniformsValues({s51: true});
		else if(Y == 5 && X == 2)	this.chess.setUniformsValues({s52: true});
		else if(Y == 5 && X == 3)	this.chess.setUniformsValues({s53: true});
		else if(Y == 5 && X == 4)	this.chess.setUniformsValues({s54: true});
		else if(Y == 5 && X == 5)	this.chess.setUniformsValues({s55: true});
		else if(Y == 5 && X == 6)	this.chess.setUniformsValues({s56: true});
		else if(Y == 5 && X == 7)	this.chess.setUniformsValues({s57: true});
		else if(Y == 5 && X == 8)	this.chess.setUniformsValues({s58: true});
		else if(Y == 5 && X == 9)	this.chess.setUniformsValues({s59: true});

		else if(Y == 6 && X == 1)	this.chess.setUniformsValues({s61: true});
		else if(Y == 6 && X == 2)	this.chess.setUniformsValues({s62: true});
		else if(Y == 6 && X == 3)	this.chess.setUniformsValues({s63: true});
		else if(Y == 6 && X == 4)	this.chess.setUniformsValues({s64: true});
		else if(Y == 6 && X == 5)	this.chess.setUniformsValues({s65: true});
		else if(Y == 6 && X == 6)	this.chess.setUniformsValues({s66: true});
		else if(Y == 6 && X == 7)	this.chess.setUniformsValues({s67: true});
		else if(Y == 6 && X == 8)	this.chess.setUniformsValues({s68: true});
		else if(Y == 6 && X == 9)	this.chess.setUniformsValues({s69: true});

		else if(Y == 7 && X == 1)	this.chess.setUniformsValues({s71: true});
		else if(Y == 7 && X == 2)	this.chess.setUniformsValues({s72: true});
		else if(Y == 7 && X == 3)	this.chess.setUniformsValues({s73: true});
		else if(Y == 7 && X == 4)	this.chess.setUniformsValues({s74: true});
		else if(Y == 7 && X == 5)	this.chess.setUniformsValues({s75: true});
		else if(Y == 7 && X == 6)	this.chess.setUniformsValues({s76: true});
		else if(Y == 7 && X == 7)	this.chess.setUniformsValues({s77: true});
		else if(Y == 7 && X == 8)	this.chess.setUniformsValues({s78: true});
		else if(Y == 7 && X == 9)	this.chess.setUniformsValues({s79: true});

		else if(Y == 8 && X == 1)	this.chess.setUniformsValues({s81: true});
		else if(Y == 8 && X == 2)	this.chess.setUniformsValues({s82: true});
		else if(Y == 8 && X == 3)	this.chess.setUniformsValues({s83: true});
		else if(Y == 8 && X == 4)	this.chess.setUniformsValues({s84: true});
		else if(Y == 8 && X == 5)	this.chess.setUniformsValues({s85: true});
		else if(Y == 8 && X == 6)	this.chess.setUniformsValues({s86: true});
		else if(Y == 8 && X == 7)	this.chess.setUniformsValues({s87: true});
		else if(Y == 8 && X == 8)	this.chess.setUniformsValues({s88: true});
		else if(Y == 8 && X == 9)	this.chess.setUniformsValues({s89: true});

		else if(Y == 9 && X == 1)	this.chess.setUniformsValues({s91: true});
		else if(Y == 9 && X == 2)	this.chess.setUniformsValues({s92: true});
		else if(Y == 9 && X == 3)	this.chess.setUniformsValues({s93: true});
		else if(Y == 9 && X == 4)	this.chess.setUniformsValues({s94: true});
		else if(Y == 9 && X == 5)	this.chess.setUniformsValues({s95: true});
		else if(Y == 9 && X == 6)	this.chess.setUniformsValues({s96: true});
		else if(Y == 9 && X == 7)	this.chess.setUniformsValues({s97: true});
		else if(Y == 9 && X == 8)	this.chess.setUniformsValues({s98: true});
		else if(Y == 9 && X == 9)	this.chess.setUniformsValues({s99: true});
	}
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
	if(id > 100 && id < 200 && this.state == "p1" && this.scene.GameMode != 4 && this.replayHappening == false)
	{	
		var x = (id - 100 - 1) % (this.p1case.divX);
		var y = Math.floor((id - 100 - 1) / (this.p1case.divX));

		var flower = this.p1case.matrixBoard[y][x];

		if(flower != null)
		{
			this.selectedFlower = [x,y];
			var yshader = this.p1case.divY - y -1;
			this.p1case.selectFlowerShader(x,yshader);
			this.p2case.selectFlowerShader(-1,-1);
			this.resetBlink();
			this.setBlink(this.listOfNextPlays);
		}

	}
	else if(id > 200 && this.state == "p2" && this.scene.GameMode != 4)
	{	
		var x = (id - 200 - 1) % (this.p2case.divX);
		var y = Math.floor((id - 200 - 1) / (this.p2case.divX));

		var flower = this.p2case.matrixBoard[y][x];

		if(flower != null)
		{
			this.selectedFlower = [x,y];		
			var yshader = this.p1case.divY - y -1;
			this.p1case.selectFlowerShader(-1,-1);
			this.p2case.selectFlowerShader(x,yshader);
			this.resetBlink();
			this.setBlink(this.listOfNextPlays);
		}
	}
	else if(id < 100 && this.selectedFlower != null && this.state != "end" && this.scene.GameMode != 4)
	{
		//check if xy is possible
		var x = (id - 1) % (this.div - 2) + 2;
		var y = Math.floor((id - 1) / (this.div - 2)) + 2;

		var exists = this.playExists(x,y);

		if(exists)
		{
			//selected flower xS and Ys
			var xS = this.selectedFlower[0];
			var yS = this.selectedFlower[1];

			//PLAY
			if(this.state == "p1")
			{
				//color and request
				var color = this.p1case.matrixBoard[yS][xS].colorCode;
				var request = "[" + x + "-" + y + "-" + color + "]";
				this.makeRequest(request);


				//move flower			
				//firtsX, firstY, lastX, lastY, Xinc, Yinc
				var flower = this.p1case.matrixBoard[yS][xS];				
				flower.animate(null, 2 ,flower.x +1, flower.y+1, x-1, y-1, -5.4,-0.05 ,this.currTime);
				this.matrixBoard[y-1][x-1] = flower;


				//kill flower from case
				this.p1case.matrixBoard[yS][xS] = null;

				//historic case push
				this.playp1historic(x,y,color, xS, yS);

				this.createNewHistoricSpace();	
				var l = this.playsHistoric.length - 1;
				if(l >= 0)
				{
					this.playsHistoric[l]['caseP1matrix'] = this.p1case.getMatrix();
				}
				
				//update alien, state and list of Play		
				this.prepareNextAndOrPlay();
			}
			else if(this.state == "p2")
			{
				//color and request
				var color = this.p2case.matrixBoard[yS][xS].colorCode;
				var request = "[" + x + "-" + y + "-" + color + "]";			
				this.makeRequest(request);	


				//move flower			
				//firtsX, firstY, lastX, lastY, Xinc, Yinc
				var flower = this.p2case.matrixBoard[yS][xS];
				flower.animate(null, 2 ,flower.x +1, flower.y+1, x-1, y-1, 10.4,-0.05 ,this.currTime);
				this.matrixBoard[y-1][x-1] = flower;
					
				//kill flower from case
				this.p2case.matrixBoard[yS][xS] = null;

				//historic case push
				this.playp2historic(x,y,color,xS,yS);	
				this.createNewHistoricSpace();	

				var l = this.playsHistoric.length - 1;
				if(l >= 0)
				{
					this.playsHistoric[l]['caseP2matrix'] = this.p2case.getMatrix();
				}	
					

				//update alien, state and list of Plays
				this.prepareNextAndOrPlay();
			}

			//Resests		
			this.resetBlink();
			this.p1case.selectFlowerShader(-1,-1);			
			this.p2case.selectFlowerShader(-1,-1);
			this.selectedFlower = null;			
		}		
	}
};

MyBoard.prototype.prepareNextAndOrPlay=function()
{
	if(this.state == "p1")
	{
		if(this.scene.GameMode == 1)
		{
			var l = this.playsHistoric.length - 1;
			if(l >= 0)
			{
				this.playsHistoric[l]['caseP2matrix'] = this.p2case.getMatrix();
			}		
			
			this.makeRequest("state");
			this.makeRequest("listPlays");
			this.makeRequest("p1alien");
			this.makeRequest("scoreP1");
			this.makeRequest("scoreP2");

			
			this.makeRequest("newhistoric");
			this.makeRequest("p1historic");
			this.makeRequest("p2historic");
			this.makeRequest("statehistoric");
			this.makeRequest("scorep1historic");
			this.makeRequest("scorep2historic");
			this.makeRequest("listofplayshistoric");

			this.resetTimes();
			this.newConsole(this.P1, this.P2, this.Time, "Player 2 turn");
			this.transitionView = new MyViewTransition(this.scene, "p2", this.currTime, 4);

		}
		else if(this.scene.GameMode == 2)
		{
			
			this.newConsole(this.P1, this.P2, this.Time, "Player 1 turn");
			this.makeRequest("p1alien");
		
			this.makeRequest("greedy");

			this.makeRequest("listPlays");
			this.makeRequest("state");
			this.makeRequest("p2alien");
			this.makeRequest("scoreP1");
			this.makeRequest("scoreP2");

			this.makeRequest("newhistoric");
			this.makeRequest("p1historic");
			this.makeRequest("p2historic");
			this.makeRequest("statehistoric");
			this.makeRequest("scorep1historic");
			this.makeRequest("scorep2historic");
			this.makeRequest("listofplayshistoric");

			this.resetTimes();
			this.transitionView = new MyViewTransition(this.scene, "default",this.currTime, 4);
	
		}
		else if(this.scene.GameMode == 3)
		{
			this.newConsole(this.P1, this.P2, this.Time, "Player 1 turn");
			this.makeRequest("p1alien");
					
			this.makeRequest("easy");

			this.makeRequest("listPlays");
			this.makeRequest("state");
			this.makeRequest("p2alien");
			this.makeRequest("scoreP1");
			this.makeRequest("scoreP2");

			this.makeRequest("newhistoric");
			this.makeRequest("p1historic");
			this.makeRequest("p2historic");
			this.makeRequest("statehistoric");
			this.makeRequest("scorep1historic");
			this.makeRequest("scorep2historic");
			this.makeRequest("listofplayshistoric");

			this.resetTimes();
			this.transitionView = new MyViewTransition(this.scene, "default",this.currTime, 4);

		}
	}
	else if(this.state == "p2")
	{
			var l = this.playsHistoric.length - 1;
			if(l >= 0)
			{
				this.playsHistoric[l]['caseP1matrix'] = this.p1case.getMatrix();
			}	

			this.makeRequest("listPlays");
			this.makeRequest("state");
			this.makeRequest("p2alien");
			this.makeRequest("scoreP1");
			this.makeRequest("scoreP2");

			this.makeRequest("newhistoric");
			this.makeRequest("p1historic");
			this.makeRequest("p2historic");
			this.makeRequest("statehistoric");
			this.makeRequest("scorep1historic");
			this.makeRequest("scorep2historic");
			this.makeRequest("listofplayshistoric");
			
			this.resetTimes();
			this.newConsole(this.P1, this.P2,this.Time, "Player 1 turn");
			this.transitionView = new MyViewTransition(this.scene, "p1", this.currTime, 4);
	}
};


MyBoard.prototype.play_PCvPC_P1=function()
{
	if(this.state != "end")
	{
		this.makeRequest("playP1greedy");

		this.makeRequest("p1alien");

		this.makeRequest("state");

		this.makeRequest("scoreP1");
		this.makeRequest("scoreP2");
		this.transitionView = new MyViewTransition(this.scene, "default",this.currTime, 4);
		
	}
};

MyBoard.prototype.play_PCvPC_P2=function()
{
	if(this.state != "end")
	{
		this.makeRequest("greedy");

		this.makeRequest("p2alien");

		this.makeRequest("state");
		this.makeRequest("scoreP1");
		this.makeRequest("scoreP2");

		
	}
};

MyBoard.prototype.updateView=function(currTime)
{

	if(this.transitionView !=  null)
	{
		
		if(this.transitionView.lastTime > currTime)
		{
			var camera = this.transitionView.getCameraUpdated(currTime);
			if(this.scene.Animated == true)
			{
				this.scene.camera = camera;
				this.scene.interface.setActiveCamera(camera);
			}
		}
	}
};

MyBoard.prototype.newConsole=function(P1, P2, Time, Log)
{
	this.P1 = P1;
	this.P2 = P2;
	this.Time = Time;
	this.Log = Log;	


	this.scene.interface.console.remove(this.LogDom);
	this.scene.interface.console.remove(this.P2Dom);
	this.scene.interface.console.remove(this.P1Dom);
	this.scene.interface.console.remove(this.TimeDom);
	

	this.P1Dom = this.scene.interface.console.add(this, 'P1');
	this.P2Dom = this.scene.interface.console.add(this, 'P2');
	this.TimeDom = this.scene.interface.console.add(this, 'Time');
	this.LogDom = this.scene.interface.console.add(this, 'Log');
};

MyBoard.prototype.resetTimes=function()
{
	this.timeoutHappen = false;
	this.secondsElapsed = 0;
	this.onesec = 0;
};

MyBoard.prototype.updateTimeoutPlay=function(diff, currTime)
{
	if(this.state != "end")
	{
		if(this.scene.GameMode == 0)
		{
			this.onesec = 0;
			this.secondsElapsed = 0;
		}
		else
		{
			this.onesec += diff;
			if(this.onesec >= 1000)
			{
				this.secondsElapsed++;
				this.onesec = 0;
				this.newConsole(this.P1, this.P2, this.secondsElapsed.toString(), this.Log);
			}

			if((this.scene.GameMode == 1 || this.scene.GameMode == 2 || this.scene.GameMode == 3) && this.secondsElapsed >= this.timeoutPlay)
			{
				
				if(this.state == "p1")
					this.newConsole(this.P1, this.P2, this.secondsElapsed.toString(), "P2 Wins! (P1 Timeout)");
				else if(this.state == "p2")
					this.newConsole(this.P1, this.P2, this.secondsElapsed.toString(), "P1 Wins! (P2 Timeout)");

				this.timeoutHappen = true;
				this.state = "end";
			}


		}
	}
};

MyBoard.prototype.checkEndOfGame=function()
{
	if(this.state == "end")
	{
		if(!this.timeoutHappen)
		{
			this.timeoutHappen = true;
			var P1 = parseInt(this.P1);
			var P2 = parseInt(this.P2);
			
			if(P1 > P2)
			{
				this.newConsole(this.P1, this.P2, this.secondsElapsed.toString(), "P1 Wins!");
			}
			else
			{
				this.newConsole(this.P1, this.P2, this.secondsElapsed.toString(), "P2 Wins!");
			}
		}
	}
};


MyBoard.prototype.Undo=function()
{	
	if(this.playsHistoric.length > 1 && (this.scene.GameMode == 1 || this.scene.GameMode == 2 || this.scene.GameMode == 3) && this.replayHappening == false)
	{
		var l = this.playsHistoric.length - 1;

		if(this.canUndo(l))
		{
			this.playsHistoric.pop();

			var l = this.playsHistoric.length - 1;

			//Score P1
			this.P1 = this.playsHistoric[l]['scoreP1'];
			this.newConsole(this.P1, this.P2, this.secondsElapsed.toString(), this.Log);
			var request = "[" + "scoreP1" + "-" + this.P1 + "]";
			this.makeRequest(request);

			//Score P2
			this.P2 = this.playsHistoric[l]['scoreP2'];
			this.newConsole(this.P1, this.P2, this.secondsElapsed.toString(), this.Log);
			var request = "[" + "scoreP2" + "-" + this.P2 + "]";
			this.makeRequest(request);

			//state 
			this.state = this.playsHistoric[l]['state'];
			var request = "[" + "state" + "-" + this.state + "]";
			this.makeRequest(request);

			//case p1case
			this.p1case.setNewMatrix(this.playsHistoric[l]['caseP1matrix']);
			var request = "[" + "casep1" + "-" + this.playsHistoric[l]['caseP1'] + "]";
			this.makeRequest(request);

			//case p2case
			this.p2case.setNewMatrix(this.playsHistoric[l]['caseP2matrix']);
			var request = "[" + "casep2" + "-" + this.playsHistoric[l]['caseP2'] + "]";
			this.makeRequest(request);

			//board
			this.createBoardElems(this.playsHistoric[l]['board']);
			var request = "[" + "board" + "-" + this.playsHistoric[l]['board'] + "]";
			this.makeRequest(request);


			//listPlays
			this.listOfNextPlays = this.playsHistoric[l]['listofplays'];

			this.resetTimes();
			this.selectedFlower = null;
			this.resetBlink();
			this.p1case.selectFlowerShader(-1, -1);
			this.p2case.selectFlowerShader(-1, -1);

			if(this.scene.GameMode == 1)
			{
				if(this.state == "p1")
				{
					this.transitionView = new MyViewTransition(this.scene, "p1", this.currTime, 4);
					this.newConsole(this.P1, this.P2, this.secondsElapsed.toString(), "Player 1 turn");
				}
				else if(this.state == "p2")
				{
					this.transitionView = new MyViewTransition(this.scene, "p2", this.currTime, 4);
					this.newConsole(this.P1, this.P2, this.secondsElapsed.toString(), "Player 2 turn");
				}
			}
			else
			{
				this.transitionView = new MyViewTransition(this.scene, "default", this.currTime, 4);
				this.newConsole(this.P1, this.P2, this.secondsElapsed.toString(), "Player 1 turn");
			}
		}
	}
};

MyBoard.prototype.createNewHistoricSpace=function()
{
	this.playsHistoric.push([]);
	var l = this.playsHistoric.length - 1;

	this.playsHistoric[l]['scoreP1'] = null;
	this.playsHistoric[l]['scoreP2'] = null;
	this.playsHistoric[l]['state'] = null;
	this.playsHistoric[l]['caseP1'] = null;
	this.playsHistoric[l]['caseP2'] = null;
	this.playsHistoric[l]['caseP1matrix'] = null;
	this.playsHistoric[l]['caseP2matrix'] = null;
	this.playsHistoric[l]['board'] = null;
	this.playsHistoric[l]['listofplays'] = null;
	this.playsHistoric[l]['pickedp1'] = null;
	this.playsHistoric[l]['pickedp2'] = null;
	this.playsHistoric[l]['playp1'] = null;
	this.playsHistoric[l]['playp2'] = null;

};

MyBoard.prototype.createBoardHistoric=function(board)
{
	var l =  this.playsHistoric.length - 1;
	if(l >= 0)
	{
		this.playsHistoric[l]['board'] = board;
	}
};


MyBoard.prototype.createHistoricP1=function(casep1)
{
	var l =  this.playsHistoric.length - 1;

	if(l >= 0)
	{
		this.playsHistoric[l]['caseP1'] = casep1;
	}
};

MyBoard.prototype.createHistoricP2=function(casep2)
{
	var l =  this.playsHistoric.length - 1;

	if(l >= 0)
	{
		this.playsHistoric[l]['caseP2'] = casep2;
	}	
};

MyBoard.prototype.changeStateHistoric=function(response)
{
	var l =  this.playsHistoric.length - 1;

	if(l >= 0)
	{
		this.playsHistoric[l]['state'] = response;
	}
};

MyBoard.prototype.scorep1historic=function(response)
{
	var l =  this.playsHistoric.length - 1;

	if(l >= 0)
	{
		this.playsHistoric[l]['scoreP1'] = response;
	}
};

MyBoard.prototype.scorep2historic=function(response)
{
	var l =  this.playsHistoric.length - 1;

	if(l >= 0)
	{
		this.playsHistoric[l]['scoreP2'] = response;
	}
};

MyBoard.prototype.listofplayshistoric=function(response)
{
	var r = /\d+/g;
	var list = [];
	var m;

	var templist = []

	while ((m = r.exec(response)) != null) 
	{
		list.push(m[0]);
	}

	for(var i = 0; i < list.length; i+=2)
	{
		templist.push([list[i], list[i+1]]);
	}

	var l =  this.playsHistoric.length - 1;

	if(l >= 0)
	{
		this.playsHistoric[l]['listofplays'] = templist;
	}
};

MyBoard.prototype.playp1historic=function(x, y, f, xS, yS)
{
	var l =  this.playsHistoric.length - 1;

	if(l >= 0)
	{
		this.playsHistoric[l]['playp1'] = [x,y,f];
		this.playsHistoric[l]['pickedp1'] = [xS, yS];
	}
};

MyBoard.prototype.playp2historic=function(x, y, f, xS, yS)
{
	var l =  this.playsHistoric.length - 1;

	if(l >= 0)
	{
		this.playsHistoric[l]['playp2'] = [x,y,f];
		this.playsHistoric[l]['pickedp2'] = [xS, yS];
	}
};

MyBoard.prototype.canUndo=function(l)
{
	if(this.playsHistoric[l]['scoreP1'] != null
		&& this.playsHistoric[l]['scoreP2'] != null 
		&& this.playsHistoric[l]['state'] != null
		&& this.playsHistoric[l]['caseP1'] != null
		&& this.playsHistoric[l]['caseP1'] != null
		&& this.playsHistoric[l]['board'] != null
		&& this.playsHistoric[l]['listofplays'] != null)

			return true;
		else 
			return false;
};

MyBoard.prototype.Replay=function()
{
	
	if(this.playsHistoric.length >= 1 &&(this.scene.GameMode == 1 || this.scene.GameMode == 2 || this.scene.GameMode == 3))
	{
		this.newConsole(this.P1, this.P2, this.secondsElapsed.toString(), "Replaying");
		this.replayTime = this.currTime;
		this.replayHappening = true;
		this.replayIndex = 0;
		this.ReplayPlay(this.replayIndex);
	}
	else if(this.scene.GameMode == 4)
	{
		this.newConsole(this.P1, this.P2, this.secondsElapsed.toString(), "Not available in PCvPC");
	}
	else
		this.newConsole(this.P1, this.P2, this.secondsElapsed.toString(), "No historic yet");
};


MyBoard.prototype.ReplayPlay=function(index)
{
	var playsl = this.playsHistoric.length;	
	this.resetTimes();
	this.transitionView = new MyViewTransition(this.scene, "default",this.currTime, 4); 

	if(index < playsl && this.replayHappening == true)
	{
		//Score P1
		this.P1 = this.playsHistoric[index]['scoreP1'];
		this.newConsole(this.P1, this.P2, this.secondsElapsed.toString(), this.Log);
		var request = "[" + "scoreP1" + "-" + this.P1 + "]";
		this.makeRequest(request);

		//Score P2
		this.P2 = this.playsHistoric[index]['scoreP2'];
		this.newConsole(this.P1, this.P2, this.secondsElapsed.toString(), this.Log);
		var request = "[" + "scoreP2" + "-" + this.P2 + "]";
		this.makeRequest(request);

		//state 
		this.state = this.playsHistoric[index]['state'];
		var request = "[" + "state" + "-" + this.state + "]";
		this.makeRequest(request);

		//case p1case
		if(this.playsHistoric[index]['caseP1matrix'] != null)
		{	
			this.p1case.setNewMatrix(this.playsHistoric[index]['caseP1matrix']);
			var request = "[" + "casep1" + "-" + this.playsHistoric[index]['caseP1'] + "]";
			this.makeRequest(request);
		}
		//case p2case
		if(this.playsHistoric[index]['caseP2matrix'] != null)
		{
			this.p2case.setNewMatrix(this.playsHistoric[index]['caseP2matrix']);
			var request = "[" + "casep2" + "-" + this.playsHistoric[index]['caseP2'] + "]";
			this.makeRequest(request);
		}

		//board
		this.createBoardElems(this.playsHistoric[index]['board']);
		var request = "[" + "board" + "-" + this.playsHistoric[index]['board'] + "]";
		this.makeRequest(request);


		//listPlays
		this.listOfNextPlays = this.playsHistoric[index]['listofplays'];

		//playp1
		if(this.playsHistoric[index]['playp1'] != null && this.playsHistoric[index]['pickedp1'] != null)
		{
			var x1 = this.playsHistoric[index]['playp1'][0];
			var y1 = this.playsHistoric[index]['playp1'][1];
			var f1 = this.playsHistoric[index]['playp1'][2];

			var xS = this.playsHistoric[index]['pickedp1'][0];
			var yS = this.playsHistoric[index]['pickedp1'][1];

			if(x1 != 100 && y1 != 100 && f1 != 100)
			{
				var flower = this.p1case.matrixBoard[yS][xS];
				flower.animate(null, 2 ,flower.x + 1,flower.y + 1, x1-1, y1-1, -5.4,-0.05 ,this.currTime);
				this.matrixBoard[y1-1][x1-1] = flower;
				this.p1case.matrixBoard[yS][xS] = null;

				var request = "[" + x1 + "-" + y1 + "-" + f1 + "]";
				this.makeRequest(request);
				this.makeRequest("p1alien");		
			}
		}

		//playp2
		if(this.playsHistoric[index]['playp2'] != null && this.playsHistoric[index]['pickedp2'] != null)
		{
			var x2 = this.playsHistoric[index]['playp2'][0];
			var y2 = this.playsHistoric[index]['playp2'][1];
			var f2 = this.playsHistoric[index]['playp2'][2];

			var xS = this.playsHistoric[index]['pickedp2'][0];
			var yS = this.playsHistoric[index]['pickedp2'][1];

			if(x2 != 100 && y2 != 100 && f2 != 100)
			{
				var flower = this.p2case.matrixBoard[yS][xS];
				flower.animate(null, 2 ,flower.x +1, flower.y+1, x2-1, y2-1, 10.4,-0.05 ,this.currTime);
				this.matrixBoard[y2-1][x2-1] = flower;
				this.p2case.matrixBoard[yS][xS] = null;
				
				var request = "[" + x2 + "-" + y2 + "-" + f2 + "]";		
				this.makeRequest(request);
				this.makeRequest("p2alien");

	
			}
		}
		this.replayIndex++;
	}
	else
	{
		this.replayHappening = false;
		this.replayIndex=0;

		if(this.state = "p1")
			this.newConsole(this.P1, this.P2, this.secondsElapsed.toString(), "Player 1 turn");
		else if(this.state = "p2")
			this.newConsole(this.P1, this.P2, this.secondsElapsed.toString(), "Player 2 turn");
	}
};

MyBoard.prototype.getColorString=function(color)
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

MyBoard.prototype.Show=function()
{
	console.log(this.playsHistoric, this.replayHappening, this.replayIndex);
};

