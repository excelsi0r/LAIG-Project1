function MyCase(scene, divX, divY, NdiV, MapLength, textdiv, texture, texture2, tileid, x, y)
{
    this.scene = scene;

	this.x = x;
	this.y = y;
	this.divX = divX;
	this.divY = divY;
	this.NdiV = NdiV;
	this.mapInc = MapLength;
	this.mapDiv = (MapLength / NdiV);
	this.inc = this.mapDiv / 2;
	this.textureDiv = textdiv;
	this.texture = texture;
	this.texture2 = texture2;
	this.border = 0.05;

	this.case = new MyPlane(this.scene, 1, 1, this.divX * this.textureDiv, this.divY * this.textureDiv);	
    this.chess = new CGFshader(this.scene.gl, "../shaders/normal.vert", "../shaders/normal.frag");

	this.tileid = tileid;
	this.matrixPic = [];
	this.createBoardPicking();


}

MyCase.prototype.constructor=MyCase;

MyCase.prototype.display = function(appearence)
{	
	//display board elems
	this.displayCaseElems(appearence);
};

MyCase.prototype.displayCaseElems=function(appearence)
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
            this.matrixPic[i][j] = new MyTile(this.scene, this.tileid, this.NdiV, this.mapInc, j, i, this.x - 1.82, this.y-4.54) ;
            this.tileid++;
        }
    }

    console.log(this.matrixPic);
};

MyCase.prototype.updateTextureCoords=function(s, t) {};