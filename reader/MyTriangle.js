/**
 * MyTriangle
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function MyTriangle(scene, x1, y1, z1, x2, y2, z2, x3, y3, z3, lS, lT) {
	CGFobject.call(this,scene);
	this.x1 = x1;
	this.y1 = y1;
	this.z1 = z1;
	this.x2 = x2;
	this.y2 = y2;
	this.z2 = z2;
	this.x3 = x3;
	this.y3 = y3;
	this.z3 = z3;
	this.lS = lS;
	this.lT = lT;
	this.initBuffers();
};

MyTriangle.prototype = Object.create(CGFobject.prototype);
MyTriangle.prototype.constructor=MyTriangle;

MyTriangle.prototype.initBuffers = function () {
    this.vertices = [
            this.x1, this.y1, this.z1, //1
            this.x2, this.y2, this.z2, //2
            this.x3, this.y3, this.z3, //3
			];

	this.indices = [
            0, 1, 2, 
        ];

    var v12 = [this.x2 - this.x1, this.y2 - this.y1, this.z2 - this.z1];
    var v13 = [this.x3 - this.x1, this.y3 - this.y1, this.z3 - this.z1];

    var vNorm = this.crossProduct(v12,v13);

    this.normals = [
			vNorm[0], vNorm[1], vNorm[2],  	   //1
			vNorm[0], vNorm[1], vNorm[2],      //2
			vNorm[0], vNorm[1], vNorm[2]       //3
		];

	var dS2 = this.norm(v12);
	var tS2 = dS2/this.lS;
	

	var dS3 = this.cosAng(v12,v13)*this.norm(v13);
	var dT3 = Math.sqrt(this.norm(v13)*this.norm(v13) - dS3*dS3);
	var tS3 = dS3/this.lS;
	var tT3 = dT3/this.lT;

	this.texCoords = [
			0,  1,	       //1
			tS2, 1,	       //2
			tS3, 1 - tT3,  //3
	];
		
	this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};

MyTriangle.prototype.norm = function(v12) {
	var dx = v12[0];
	var dy = v12[1];
	var dz = v12[2];
	return Math.sqrt(dx*dx + dy*dy + dz*dz);
};

MyTriangle.prototype.dotProduct = function(v1, v2) {
	return v1[0]*v2[0] + v1[1]*v2[1] + v1[2]*v2[2];
};

MyTriangle.prototype.crossProduct = function(v1, v2) {
	return [v1[1]*v2[2] - v1[2]*v2[1], v1[2]*v2[0] - v1[0]*v2[2], v1[0]*v2[1] - v1[1]*v2[0]];
};

MyTriangle.prototype.cosAng = function(v1, v2) {
	return this.dotProduct(v1,v2)/(this.norm(v1)*this.norm(v2));
};