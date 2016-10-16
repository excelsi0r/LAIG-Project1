/**
 * MyTriangle
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function MySphere(scene, radius, slices, stacks) {
	CGFobject.call(this,scene);
	this.radius = radius;
	this.slices = slices;
	this.stacks = stacks;
	this.initBuffers();
};

MySphere.prototype = Object.create(CGFobject.prototype);
MySphere.prototype.constructor=MySphere;

MySphere.prototype.initBuffers = function () {
    this.vertices = [];
 	this.indices = [];
 	this.normals = [];
 	this.texCoords = [];

 	var deg2Rad = Math.PI/180.0;

	//Build the cylinder's main surface
 	var deltaAlpha = 360.0/this.slices
 	var deltaPhi = 180.0/this.stacks;

	var phi = -90;
	for(var k = 0; k <= this.stacks; k++)
	{
		var phiRad = phi*deg2Rad;
		var alpha = 0;
		for(var i = 0; i <= this.slices; i++)
		{
			var alphaRad = alpha*deg2Rad;

			//Generate the vertices
			this.vertices.push(this.radius*Math.cos(phiRad)*Math.cos(alphaRad),this.radius*Math.cos(phiRad)*Math.sin(alphaRad),this.radius*Math.sin(phiRad));

			//Generate the indices
			if(i > 0 && k > 0)
			{
				this.indices.push((this.slices+1)*(k)+(i),(this.slices+1)*(k)+(i-1),(this.slices+1)*(k-1)+(i-1));
				this.indices.push((this.slices+1)*(k)+(i),(this.slices+1)*(k-1)+(i-1),(this.slices+1)*(k-1)+(i));
			}

			//Generate the normals
			this.normals.push(Math.cos(phiRad)*Math.cos(alphaRad),Math.cos(phiRad)*Math.sin(alphaRad),Math.sin(phiRad));

			//Generate the texture coords
			this.texCoords.push(i/(this.slices), 1 -k/this.stacks);

			alpha += deltaAlpha;
		}
		
		phi += deltaPhi;
	}

	//Build the cylinder's base lid
	var baseIdx = (this.slices+1)*(this.stacks+1);
	alpha = 0;
	
	this.vertices.push(0,0,-this.height/2);
	this.normals.push(0,0,-1);
	this.texCoords.push(0.5,0.5);

	for(var i = 0; i <= this.slices; i++)
	{
		var alphaRad = alpha*deg2Rad;

		//Generate the vertices
		this.vertices.push(this.base*Math.cos(alphaRad),this.base*Math.sin(alphaRad),-this.height/2);

		//Generate the indices
		if(i > 0)
		{
			this.indices.push(baseIdx, baseIdx+(i+1), baseIdx+i); 
		}

		//Generate the normals
		this.normals.push(0,0,-1);

		//Generate the texture coords
		this.texCoords.push(0.5 + 0.5*Math.cos(alphaRad), 0.5 - 0.5*Math.sin(alphaRad));

		alpha += deltaAlpha;
	}

	//Build the cylinder's top lid
	baseIdx += (this.slices + 2); 
	alpha = 0;
	
	this.vertices.push(0,0,this.height/2);
	this.normals.push(0,0,1);
	this.texCoords.push(0.5,0.5);

	for(var i = 0; i <= this.slices; i++)
	{
		var alphaRad = alpha*deg2Rad;

		//Generate the vertices
		this.vertices.push(this.top*Math.cos(alphaRad),this.top*Math.sin(alphaRad),this.height/2);

		//Generate the indices
		if(i > 0)
		{
			this.indices.push(baseIdx, baseIdx+i, baseIdx+(i+1)); 
		}

		//Generate the normals
		this.normals.push(0,0,1);

		//Generate the texture coords
		this.texCoords.push(0.5 + 0.5*Math.cos(alphaRad), 0.5 - 0.5*Math.sin(alphaRad));

		alpha += deltaAlpha;
	}
		
	this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};