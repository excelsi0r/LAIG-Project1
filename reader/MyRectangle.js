/**
 * MyRectangle
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function MyRectangle(scene, x1, y1, x2, y2, lS, lT) 
{
	CGFobject.call(this,scene);
	this.x1 = x1;
	this.y1 = y1;
	this.x2 = x2;
	this.y2 = y2;
	this.lS = lS;
	this.lT = lT;
	this.initBuffers();
};

MyRectangle.prototype = Object.create(CGFobject.prototype);
MyRectangle.prototype.constructor=MyRectangle;

MyRectangle.prototype.initBuffers = function () {
    this.vertices = [
            this.x1, this.y1, 0, //0 
            this.x2, this.y1, 0, //1
            this.x2, this.y2, 0, //2
            this.x1, this.y2, 0, //3
			];

	this.indices = [
            0, 1, 2, 
			0, 2, 3
        ];

    this.normals = [
			0, 0, 1, 	   //0
			0, 0, 1,       //1
			0, 0, 1,       //2
			0, 0, 1,	   //3
		];

	var dx = this.x2 - this.x1;
	var dy = this.y2 - this.y1;

	var tx = dx/this.lS;
	var ty = dy/this.lT;

	this.texCoords = [
			0,  1,	   //0
			tx, 1,	   //1
			tx, 1 - ty,//2
			0,  1 - ty,//3	    
	];
		
	this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};