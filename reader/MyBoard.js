function MyBoard(scene, du, dv, texture, sr, sg, sb, sa, rps) 
{
    this.scene = scene;

    this.du = du;
    this.dv = dv; 
     
    this.su = 2;
    this.sv = 6;  
 
    this.sr = sr;
    this.sg = sg;
    this.sb = sb; 
    this.sa = sa;

    //estes valores sao gerais e nao hardcoded,a shader esta pronta para quaisquer valores, faz o mesmo caso variem 
    this.parts = 10.0; //comprimento de cada divisao
    this.RPS = rps;    //Refresh por segundo, setado no inicio do Xml, pode ser mudado e por isso muda aqui tb
    this.update = 0.0; //Estado currente da animaçao
    this.currTime;     //tempo atual da chamada updateshader
    this.firstUpdate = 0; //se o primeira chamada ao updateshader ja esta 
    this.animdur = 60.0; // duraçao da animaçao de piscar

    this.texture = texture;
    this.board = new MyPlane(this.scene, 1, 1, this.du * this.parts, this.dv * this.parts);
    this.chess = new CGFshader(this.scene.gl, "../shaders/round.vert", "../shaders/round.frag");
    
    this.chess.setUniformsValues({du: this.du});
    this.chess.setUniformsValues({dv: this.dv});
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
    material.setTexture(this.texture);
    this.scene.pushMatrix();
        
        material.apply();           
        this.scene.setActiveShader(this.chess);            
        this.board.display();
        this.scene.setActiveShader(this.scene.defaultShader);

    this.scene.popMatrix();
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