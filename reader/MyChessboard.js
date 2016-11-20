/**
 * Documentation refering to the second part of the project
 * 
 * @param scene
 * @param du
 * @param dv
 * @param texture
 * @param su
 * @param sv
 * @param colors
 * @returns
 * 
 * MyChessboard constructor
 * du number of u divisions
 * dv number of s divisions
 * su selected u index
 * sv selected v index
 * texture a CGFtexture
 * colors for c1, c2, c3
 * Creates a board whhic is a MyPlane with dimX and dimY 1.0 and 1.0 and the number of partitions
 * du * 10 and dv * 10
 * Creates a shader from chess.vert and chess.frag
 * Sets shader uniform values du, dv, su, sv and colors
 */
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
};

MyChessboard.prototype = Object.create(CGFobject.prototype);
MyChessboard.prototype.constructor=MyChessboard;

/**
 * Chessboard Display
 * 
 * @param material
 *  
 * Receives a CGFappearence to use if shader does not set new values
 * sets the texture to the material parameter passed as argument
 * Applies the material
 * sets the active shader to use for the board
 * displays the board
 * sets the default shader for the other displays not being influencied.
 */
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
/**
 * Update Texture function 
 * In case update texture is called
 * @param s
 * @param t
 */
MyChessboard.prototype.updateTextureCoords=function(s,t){};