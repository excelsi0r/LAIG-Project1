/**
 * MySphere
 * @constructor
 */
 function MySphere(scene, radius, slices, stacks) {
 	CGFobject.call(this,scene);
	
	this.slices=slices;
	this.stacks=stacks;
	this.raio = radius;

 	this.initBuffers();
 };

 MySphere.prototype = Object.create(CGFobject.prototype);
 MySphere.prototype.constructor = MySphere;

MySphere.prototype.updateTexCoords=function(amplifS, amplifT){
     
};

 MySphere.prototype.initBuffers = function() {

	this.vertices = [];
	this.indices = [];
	this.normals = [];
	this.texCoords = [];
	
	
    for(var lat=0; lat <= this.stacks; lat++)
    {
    	var theta = Math.PI+lat * Math.PI / this.stacks;
    	var sinTheta = Math.sin(theta);
    	var cosTheta = Math.cos(theta);

    	for(var long = 0; long <= this.slices; long++) {
    		var alfa = long * 2 * Math.PI / this.slices;
			var sinAlfa = Math.sin(alfa);
			var cosAlfa = Math.cos(alfa);

            
            this.texCoords.push(1-(long/this.slices), 1-(lat/this.stacks));
			this.vertices.push(this.raio * cosAlfa * sinTheta, this.raio * cosTheta, this.raio * sinAlfa * sinTheta);
			this.normals.push(cosAlfa * sinTheta, cosTheta, sinAlfa * sinTheta);
    	}
    }

    for(var lat = 0; lat < this.stacks; lat++)
    {
    	for(var long = 0; long < this.slices; long++)
    	{
    		var firstPoint = lat * (this.slices + 1) + long;
    		var secondPoint = firstPoint + this.slices + 1;
            
    		this.indices.push(firstPoint, secondPoint, firstPoint + 1);
    		this.indices.push(secondPoint, secondPoint + 1, firstPoint + 1);
    	}
    }


 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };