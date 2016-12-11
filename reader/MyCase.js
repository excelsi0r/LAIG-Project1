function MyCase(scene, type,  div, mapLength)
{
    this.scene = scene;


	this.mapDiv = mapLength / div;
	this.mapInc = (mapLength / div) / 2;
	this.div = div;
	this.type = type;
}

MyCase.prototype.constructor=MyCase;

MyCase.prototype.display = function(appearence)
{	
	

};

MyCase.prototype.updateTextureCoords=function(s, t) {};