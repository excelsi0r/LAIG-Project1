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

    //estes valores sao gerais e nao hardcoded,a shader esta pronta para quaisquer valores, faz o mesmo caso variem 
    this.parts = 10.0; //comprimento de cada divisao em texture
    this.RPS = rps;    //Refresh por segundo, setado no inicio do Xml, pode ser mudado e por isso muda aqui tb
    this.update = 0.0; //Estado currente da animaçao
    this.currTime;     //tempo atual da chamada updateshader
    this.firstUpdate = 0; //se o primeira chamada ao updateshader ja esta 
    this.animdur = 60.0; // duraçao da animaçao de piscar
    this.MapInc = 10; //comprimento do board
    this.inc = (this.MapInc / this.div) / 2;

    this.texture = texture;//textura da parte de cima   
    this.texture2 = texture2;//textura da parte de baixo do board
    this.auxtexture = auxtexture;
    this.board = new MyPlane(this.scene, 1, 1, this.div * this.parts, this.div * this.parts);//board
    this.chess = new CGFshader(this.scene.gl, "../shaders/round.vert", "../shaders/round.frag");


    //temp objects
    this.flower = new MyFlower(this.scene, "red",this.div, this.MapInc);
    this.tree = new MyTree(this.scene,this.div, this.MapInc);
    this.alien = new MyAlien(this.scene, "white", this.div, this.MapInc);

    this.tileid = 1;
    this.matrixPic = [];
    this.createBoardPicking();

    //create case1
    this.tileidp1 = 101;
    this.p1case = new MyCase(this.scene, 3,9, this.div, this.MapInc,this.parts,this.auxtexture, this.texture2, this.tileidp1, -3, 5);    


    //create case2
    this.tileidp2 = 201;
    this.p2case = new MyCase(this.scene, 3,9, this.div, this.MapInc,this.parts,this.auxtexture, this.texture2, this.tileidp2, 13, 5);
    
    
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

MyBoard.prototype = Object.create(CGFobject.prototype);
MyBoard.prototype.constructor=MyBoard;

MyBoard.prototype.display=function(material)
{       
    //display internal board
    this.displayInternalBoard(material);    

    //display player 1 case
    this.p1case.display(material);

    //display player 2 case
    this.p2case.display(material);
    
    //flower
    this.flower.translate(1,1);
    this.flower.display();

    //tree
    this.tree.translate(2,2);
    this.tree.display();

    //alien
    this.alien.translate(10,0);
    this.alien.display(); 

    //board tiles display
    this.displayBoardTiles();

    //display p1 case tiles
    this.p1case.displayBoardTiles();

    //display p2 case tiles
    this.p2case.displayBoardTiles();
}
MyBoard.prototype.updateTextureCoords=function(s,t){};

MyBoard.prototype.updateShader=function(currTime)
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

MyBoard.prototype.displayInternalBoard=function(material)
{ 
    //Board display
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

 