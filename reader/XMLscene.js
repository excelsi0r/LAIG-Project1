
function XMLscene() {
    CGFscene.call(this);
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

XMLscene.prototype.init = function (application) 
{
    CGFscene.prototype.init.call(this, application);

    this.initCameras();

    this.initLights();

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

	this.axis=new CGFaxis(this);
};


//DEFAULT PARTS
XMLscene.prototype.initLights = function () {
	
	this.lights[0].setPosition(2, 3, 3, 1);
    this.lights[0].setDiffuse(1.0,1.0,1.0,1.0);
    this.lights[0].update();
    
};

XMLscene.prototype.initCameras = function ()
{
    this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
};

XMLscene.prototype.setDefaultAppearance = function () {
	
   	this.setAmbient(0.2, 0.4, 0.8, 1.0);
    this.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.setSpecular(0.2, 0.4, 0.8, 1.0);
    this.setShininess(10.0);	
};

//GRAPH PARTS
XMLscene.prototype.setLightsGraph = function ()
 {
	var lightBox = this.graph.lightslist;
	var lightBoxLength = lightBox.length;

	console.log("Testing lights ");
	console.log(lightBox);

	for(var i = 0; i < lightBoxLength; i++)
	{
		this.lights[i].setAmbient(lightBox[i].ambient.r,
		lightBox[i].ambient.g, lightBox[i].ambient.b, lightBox[i].ambient.a);
		this.lights[i].setDiffuse(lightBox[i].diffuse.r,
		lightBox[i].diffuse.g, lightBox[i].diffuse.b, lightBox[i].diffuse.a);
		this.lights[i].setSpecular(lightBox[i].specular.r,lightBox[i].specular.g,
		lightBox[i].specular.b,lightBox[i].specular.a);

		if(lightBox[i].omni){
			this.lights[i].setPosition(lightBox[i].location.x,lightBox[i].location.y,
			lightBox[i].location.z,lightBox[i].location.w);
		}
		else if(lightBox[i].spot){
			this.lights[i].setPosition(lightBox[i].location.x,lightBox[i].location.y,
			lightBox[i].location.z,lightBox[i].location.w);
			this.lights[i].setSpotDirection(lightBox[i].target.x,lightBox[i].target.y,
			lightBox[i].target.z);
			this.lights[i].setSpotExponent(lightBox[i].exponent);
		}
		else
		{
			console.log("ERROR - Missing OMNI or SPOT lights.");
		}
		this.lights[i].setVisible(true);
		
		//console.log(lightBox[i].enabled);//debug print

		if(lightBox[i].enabled){
			this.lights[i].enable();
		}
	}
	
};




XMLscene.prototype.setIlluminationGraph = function () 
{
	this.gl.clearColor(this.graph.background['r'],this.graph.background['g'],this.graph.background['b'],this.graph.background['a']);
   	this.setGlobalAmbientLight(this.graph.ambientIllumination['r'], this.graph.ambientIllumination['g'], this.graph.ambientIllumination['b'], this.graph.ambientIllumination['a']);
};

XMLscene.prototype.setAxisGraph = function()
{
	this.axis = new CGFaxis(this, this.graph.axis_length);
};


XMLscene.prototype.setViewsGraph = function()
{
	this.cameras = [];

	var defaultID = this.graph.default;

	var n_views = this.graph.perspectiveContent.length;

	for(var i = 0; i < n_views; i++)
	{
		var id = this.graph.perspectiveContent[i]['id'];
		var near = this.graph.perspectiveContent[i]['near'];
		var far = this.graph.perspectiveContent[i]['far'];
		var angle = this.graph.perspectiveContent[i]['angle'];

		var angle = (angle*Math.PI)/180;

		var fromx = this.graph.perspectiveContent[i]['from']['x'];
		var fromy = this.graph.perspectiveContent[i]['from']['y'];
		var fromz = this.graph.perspectiveContent[i]['from']['z'];

		var tox = this.graph.perspectiveContent[i]['to']['x'];
		var toy = this.graph.perspectiveContent[i]['to']['y'];
		var toz = this.graph.perspectiveContent[i]['to']['z'];
		
		var cm = new CGFcamera(angle, parseFloat(near), parseFloat(far), vec3.fromValues(fromx, fromy, fromz), vec3.fromValues(tox, toy, toz));
		this.cameras[id] = cm;


		if(defaultID == id)
		{
			this.camera = this.cameras[id];
		}
	}
};

XMLscene.prototype.setMaterialsGraph = function()
{
	this.materials = [];

	var n_materials = this.graph.materialslist.length;

	for(var i = 0; i < n_materials; i++)
	{
		var id = this.graph.materialslist[i]['id'];

		var ER = this.graph.materialslist[i]['emission']['r'];
		var EG = this.graph.materialslist[i]['emission']['g'];
		var EB = this.graph.materialslist[i]['emission']['b'];
		var EA = this.graph.materialslist[i]['emission']['a'];

		var AR = this.graph.materialslist[i]['ambient']['r'];
		var AG = this.graph.materialslist[i]['ambient']['g'];
		var AB = this.graph.materialslist[i]['ambient']['b'];
		var AA = this.graph.materialslist[i]['ambient']['a'];

		var DR = this.graph.materialslist[i]['diffuse']['r'];
		var DG = this.graph.materialslist[i]['diffuse']['g'];
		var DB = this.graph.materialslist[i]['diffuse']['b'];
		var DA = this.graph.materialslist[i]['diffuse']['a'];

		var SR = this.graph.materialslist[i]['specular']['r'];
		var SG = this.graph.materialslist[i]['specular']['b'];
		var SB = this.graph.materialslist[i]['specular']['g'];
		var SA = this.graph.materialslist[i]['specular']['a'];

		var sh = this.graph.materialslist[i]['shininess'];

		var ape= new CGFappearance(this);

		ape.setEmission(parseFloat(ER), parseFloat(EG), parseFloat(EB), parseFloat(EA));
		ape.setAmbient(parseFloat(AR), parseFloat(AG), parseFloat(AB), parseFloat(AA));
		ape.setDiffuse(parseFloat(DR), parseFloat(DG), parseFloat(DB), parseFloat(DA));
		ape.setSpecular(parseFloat(SR), parseFloat(SG), parseFloat(SB), parseFloat(SA));
		ape.setShininess(parseFloat(sh));
		ape.setTextureWrap('REPEAT', 'REPEAT');

		this.materials[id] = ape;
	}


};

XMLscene.prototype.setTextureGraph = function()
{
	this.textures = [];

	var n_texture = this.graph.texturelist.length;

	for(var i = 0; i < n_texture; i++)
	{
		var texture = [];

		var id = this.graph.texturelist[i]['id'];

		var file = this.graph.texturelist[i]['file'];
		var length_s = this.graph.texturelist[i]['length_s'];
		var length_t = this.graph.texturelist[i]['length_t'];
		
		var text = new CGFappearance(this);
		text.loadTexture(file);
		text.setTextureWrap('REPEAT', 'REPEAT');
		

		texture['texture'] = text;
		texture['length_s'] = parseFloat(length_s);
		texture['length_t'] = parseFloat(length_t);

		this.textures[id] = texture;
	}
};

XMLscene.prototype.setTransformationsGraph = function()
{
	this.transformations = [];

	var n_transformations = this.graph.transformationlist.length;

	for(var i = 0; i < n_transformations; i++)
	{
		var id = this.graph.transformationlist[i]['id'];

		var matrix = mat4.create();
			
		//SCALING
		var sx = this.graph.transformationlist[i]['scale']['x'];
		var sy = this.graph.transformationlist[i]['scale']['y'];
		var sz = this.graph.transformationlist[i]['scale']['z'];

		var scalevector = vec3.fromValues(sx,sy,sz);

		mat4.scale(matrix, matrix, scalevector);

		//ROTATION
		var axis = this.graph.transformationlist[i]['rotate']['axis'];
		var axisvec;
		var angle = this.graph.transformationlist[i]['rotate']['angle'];

		if(axis == 'x')
		{
			axisvec = vec3.fromValues(1,0,0);
		}
		else if(axis == 'y')
		{
			axisvec = vec3.fromValues(0,1,0);
		}
		else if(axis == 'z')
		{
			axisvec = vec3.fromValues(0,0,1);
		}

		var angle = (Math.PI*angle)/180;

		mat4.rotate(matrix,matrix,angle,axisvec);

		

		//TRANSLATION
		var tx = this.graph.transformationlist[i]['translate']['x'];
		var ty = this.graph.transformationlist[i]['translate']['y'];
		var tz = this.graph.transformationlist[i]['translate']['z'];
		var transvec = vec3.fromValues(tx,ty,tz);
		
		mat4.translate(matrix, matrix, transvec);
		

		this.transformations[id] = matrix;


		
	}
};

// Handler called when the graph is finally loaded. 
// As loading is asynchronous, this may be called already after the application has started the run loop
XMLscene.prototype.onGraphLoaded = function () 
{
	//new axis
	this.setAxisGraph();

	//views
	this.setViewsGraph();
		
	//new Aperence
	this.setIlluminationGraph();

	//new lights
	this.setLightsGraph();

	//new materials
	this.setMaterialsGraph();

	//new textures
	this.setTextureGraph();

	//new transformations
	this.setTransformationsGraph();	


};

XMLscene.prototype.display = function () 
{
	// ---- BEGIN Background, camera and axis setup
	
	// Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

	// Initialize Model-View matrix as identity (no transformation
	this.updateProjectionMatrix();
    this.loadIdentity();

	// Apply transformations corresponding to the camera position relative to the origin
	this.applyViewMatrix();

	// Draw axis
	this.axis.display();

	//this.setDefaultAppearance();
	
	// ---- END Background, camera and axis setup

	// it is important that things depending on the proper loading of the graph
	// only get executed after the graph has loaded correctly.
	// This is one possible way to do it
	
	if (this.graph.loadedOk)
	{
		for(var i = 0; i < this.lights.length; i++){
			this.lights[i].update();
		}
	};
};

