function MyChessboard(scene, du, dv, texture, su, sv, colors) 
{
    this.scene = scene;
    this.du = du;
    this.dv = dv;   
    this.su = su;
    this.sv = sv;
    this.colors = colors;

    this.texture = texture;
    this.board = new MyPlane(this.scene, 1, 1, this.du * 10, this.dv * 10);
    this.chess = new CGFshader(this.scene.gl, "../shaders/chess.vert", "../shaders/chess.frag");
    
    this.chess.setUniformsValues({du: this.du});
    this.chess.setUniformsValues({dv: this.dv});
    this.chess.setUniformsValues({su: this.su});
    this.chess.setUniformsValues({sv: this.sv}); 

    this.chess.setUniformsValues({c1R: this.colors['c1']['r']});
    this.chess.setUniformsValues({c1G: this.colors['c1']['g']});
    this.chess.setUniformsValues({c1B: this.colors['c1']['b']});
    this.chess.setUniformsValues({c1A: this.colors['c1']['a']});    

    this.chess.setUniformsValues({c2R: this.colors['c2']['r']});
    this.chess.setUniformsValues({c2G: this.colors['c2']['g']});
    this.chess.setUniformsValues({c2B: this.colors['c2']['b']});
    this.chess.setUniformsValues({c2A: this.colors['c2']['a']});    
 
    this.chess.setUniformsValues({c3R: this.colors['c3']['r']});
    this.chess.setUniformsValues({c3G: this.colors['c3']['g']});
    this.chess.setUniformsValues({c3B: this.colors['c3']['b']});
    this.chess.setUniformsValues({c3A: this.colors['c3']['a']});    

    console.log(this);
};

MyChessboard.prototype = Object.create(CGFobject.prototype);
MyChessboard.prototype.constructor=MyChessboard;

MyChessboard.prototype.display=function(material)
{

   
    material.setTexture(this.texture);
    this.scene.pushMatrix();
        
        material.apply();           
        this.scene.setActiveShader(this.chess);            
        this.board.display();
        this.scene.setActiveShader(this.scene.defaultShader);

    this.scene.popMatrix();
}

MyChessboard.prototype.updateTextureCoords=function(s,t){};