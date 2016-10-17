function Node(id)
{
	this.id = id;
	this.transformation = null;
	this.transformationref = null;
	this.materials = [];
	this.texture = null;
	this.children = [];
	this.primitive = [];
};


Node.prototype.setTransformationref = function(id)
{
	this.transformationref = id;
};

Node.prototype.setIdentity=function()
{
	this.transformation = mat4.create();
};

Node.prototype.scale=function(x,y,z)
{
	var vec = vec3.fromValues(x,y,z);
	mat4.scale(this.transformation, this.transformation, vec);
};

Node.prototype.rotate=function(x,y,z,angle)
{
	var vec = vec3.fromValues(x,y,z);
	mat4.rotate(this.transformation,this.transformation,angle,vec);	
};

Node.prototype.translate=function(x,y,z)
{
	var vec = vec3.fromValues(parseFloat(x),parseFloat(y),parseFloat(z));
	mat4.translate(this.transformation,this.transformation, vec);	
};

Node.prototype.setMaterial=function(material)
{
	this.materials.push(material);
};


Node.prototype.setTexture=function(texture)
{
	this.texture = texture;
};

Node.prototype.setChildren=function(ch)
{
	this.children.push(ch);
};

Node.prototype.setPrimitive=function(pr)
{
	this.primitive.push(pr);
};