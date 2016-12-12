function MyTile(scene, id, div, mapLength, x, y, incx, incy)
{
    this.scene = scene;

	this.x = x + 1;
	this.y = y + 1;
	this.incx = incx;
	this.incy = incy;
	this.id = id;
	this.mapDiv = mapLength / div;
	this.mapInc = (mapLength / div) / 2;
	this.div = div;

	this.tile = new CGFplane(this.scene);

	this.transMatrix = mat4.create();
	this.translate();

}

MyTile.prototype.constructor=MyTile;

MyTile.prototype.display = function(appearence)
{	
	if(this.scene.pickMode)
 	{
		this.scene.pushMatrix();
			this.scene.multMatrix(this.transMatrix);
			this.scene.scale(this.mapDiv,1,this.mapDiv);
			this.scene.registerForPick(this.id, this.tile);
			this.tile.display();
		this.scene.popMatrix();
	}

};


MyTile.prototype.translate = function()
{
	var xx = this.x*this.mapDiv + this.incx;
	var yy = this.y*this.mapDiv + this.incy;

	var temp = vec3.fromValues(xx,0.01,yy);

	var matTemp = mat4.create();
	mat4.translate(matTemp, matTemp, temp);

	this.transMatrix = matTemp;
}


MyTile.prototype.updateTextureCoords=function(s, t) {};