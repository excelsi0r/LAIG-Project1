/**
 * Node Class 
 * Easier to manage Nodes
 * @param id
 * @returns
 */

/**
 * Constructor
 * Needs ID mandatory
 * transformation is always a matrix
 * materials is a list with id or inherit
 * texture is a reference, inherit or none
 * children is a list with all the children 
 * primitive is a list with all the primitives
 * defaultMaterial stores the current material of the Node
 * defaultMaterialInsdex stores the actual Index of the current material
 */

/**
 * Documentation refering to the second part of the project
 * 
 * Added animations empty array
 */
function Node(id)
{
	this.id = id;
	this.transformation = null;
	this.materials = [];
	this.texture = null;
	this.children = [];
	this.primitive = [];
	this.animations = [];
	this.defaultMaterial = null;
	this.defaultMaterialIndex = null;
};

/**
 * Sets new Transformation matrix
 */
Node.prototype.setTransformation = function(trans)
{
	this.transformation = trans;
};

/**
 * Sets new material in the list
 */
Node.prototype.setMaterial=function(material)
{
	this.materials.push(material);
};

/**
 * Sets new Texture
 */
Node.prototype.setTexture=function(texture)
{
	this.texture = texture;
};

/**
 * Sets new list of Children
 */
Node.prototype.setChildren=function(ch)
{
	this.children.push(ch);
};

/**
 * Sets new primitives list
 */
Node.prototype.setPrimitive=function(pr)
{
	this.primitive.push(pr);
};

/**
 * Documentation refering to the second part of the project
 * 
 * Sets new animations list
 */
Node.prototype.setAnimation=function(pr)
{
	this.animations.push(pr);
};

/**
 * Sets a current material and a current index material
 */
Node.prototype.setdefaultMaterial=function(material, nr)
{
	this.defaultMaterial = material;
	this.defaultMaterialIndex = nr;
};