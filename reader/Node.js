function Node(id)
{
	this.id = id;
	this.transformation = null;
	this.materials = [];
	this.texture = null;
	this.children = [];
	this.primitive = [];
	this.defaultMaterial = null;
};


Node.prototype.setTransformation = function(trans)
{
	this.transformation = trans;
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

Node.prototype.setdefaultMaterial=function(material)
{
	this.defaultMaterial = material;
};