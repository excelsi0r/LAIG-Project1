function MyChessboard(scene, du, dv, texture, su, sv, colors) 
{
    this.scene = scene;
    this.du = du;
    this.dv = dv;   
    this.su = su;
    this.sv = sv;
    this.colors = colors;

    this.texture = texture;
    this.board = new MyPlane(this.scene, 10, 10, this.du, this.dv);    

    console.log(this);
};

MyChessboard.prototype = Object.create(CGFobject.prototype);
MyChessboard.prototype.constructor=MyChessboard;

MyChessboard.prototype.display=function(material)
{
    material.setTexture(this.texture);

    this.scene.pushMatrix();
        material.apply();
        this.board.display();
    this.scene.popMatrix();
}

MyChessboard.prototype.updateTextureCoords=function(s,t){};