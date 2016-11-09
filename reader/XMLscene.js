function XMLscene() 
{
    CGFscene.call(this);
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

/**
 * XML Scene function called upon initiation of XMLScene
 * Creates a default Scene even if Graph never Loads
 */
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

	this.setUpdatePeriod(1 / 60 * 1000);

	this.seconds = 0;
};

/**
 * Display Function. Called constantly before and after Graph Loaded
 */
XMLscene.prototype.display = function () 
{
	// ---- BEGIN Background, camera and axis setup
	
	// Clear image and depth buffer everytime we update the scene

    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

	// Initialize Model-View matrix as identity (no transformation
	this.updateProjectionMatrix();
    this.loadIdentity();
    this.enableTextures(true);

	// Apply transformations corresponding to the camera position relative to the origin
	this.applyViewMatrix();

	// Draw axis
	this.axis.display();

	this.setDefaultAppearance();
	// ---- END Background, camera and axis setup
	
	// it is important that things depending on the proper loading of the graph
	// only get executed after the graph has loaded correctly.
	// This is one possible way to do it	
	if (this.graph.loadedOk)
	{
		this.displayGraphElems();
		this.updateLights();
	};
};

/**
 * Bidirectional Connection between Interface and Scene
 */
XMLscene.prototype.setInterface=function(interface)
{
	this.interface=interface;
	this.interface.scene = this;	
};

/**
 * DEFAULT SECTION. 
 * Creates a default Graph before loaded graph
 * Creates default Lights, Cameras and Ambient Appearence
 */
XMLscene.prototype.initLights = function () 
{
	this.lights[0].setPosition(2, 3, 3, 1);
    this.lights[0].setDiffuse(1.0,1.0,1.0,1.0);
    this.lights[0].enable();
    this.lights[0].setVisible(true);
    this.lights[0].update();
    
};
XMLscene.prototype.initCameras = function ()
{
    this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
};
XMLscene.prototype.setDefaultAppearance = function () 
{
   	this.setAmbient(0.2, 0.4, 0.8, 1.0);
    this.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.setSpecular(0.2, 0.4, 0.8, 1.0);
    this.setShininess(10.0);	
};

/**
 * DSX and GRAPH SECTION
 * Handler called when the graph is finally loaded. 
 * As loading is asynchronous, 
 * this may be called already after the application has started the run loop
 */
XMLscene.prototype.onGraphLoaded = function () 
{
	//scene root
	this.setRootGraph();

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

	//new primitives
	this.setPrimitivesGraph();

	//new animatiosn
	this.setAnimationsGraph();

	//creating graph
	this.createGraph();
};

/**
 * Setting the Scene Root Graph given from the DSX file.
 */
XMLscene.prototype.setRootGraph = function()
{
	console.info("Setting new Scene Root");
	this.root = this.graph.root;
};

/**
 * Setting new Axis on the Scene given from the DSX file.
 */
XMLscene.prototype.setAxisGraph = function()
{
	console.info("Setting new Axis Graph");
	this.axis = new CGFaxis(this, this.graph.axis_length);
};

/**
 * Creating Views Array given from the DSX file.
 * When the Default view ID is processed,
 * sets that camera as default and as current camera
 */
XMLscene.prototype.setViewsGraph = function()
{
	console.info("Setting new Cameras");
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
			this.cameraIndex = i;
		}
	}
};

/**
 * Setting new Backgroud color and Ambient Light given from the
 * loaded DSX File
 */
XMLscene.prototype.setIlluminationGraph = function () 
{
	console.info("Setting new ambient illumination and color values");
	this.gl.clearColor(this.graph.background['r'],this.graph.background['g'],this.graph.background['b'],this.graph.background['a']);
   	this.setGlobalAmbientLight(this.graph.ambientIllumination['r'], this.graph.ambientIllumination['g'], this.graph.ambientIllumination['b'], this.graph.ambientIllumination['a']);
};

/**
 * Creating new Omni and Spot Lights from DSX file.
 * All set as visible
 */
XMLscene.prototype.setLightsGraph = function()
 {
	console.info("Creating new Lights from DSX file");
	
	var lightBox = this.graph.lightslist;
	this.interface.addLights(lightBox);
	
	var lightBoxLength = lightBox.length;

	this.lights = [];

	for(var i = 0; i < lightBoxLength; i++)
	{
		this.lights[i] = new CGFlight(this, i);
		this.lights[i].setAmbient(lightBox[i].ambient.r,lightBox[i].ambient.g, lightBox[i].ambient.b, lightBox[i].ambient.a);
		this.lights[i].setDiffuse(lightBox[i].diffuse.r,lightBox[i].diffuse.g, lightBox[i].diffuse.b, lightBox[i].diffuse.a);
		this.lights[i].setSpecular(lightBox[i].specular.r,lightBox[i].specular.g,lightBox[i].specular.b,lightBox[i].specular.a);

		if(lightBox[i].omni)
		{
			this.lights[i].setPosition(lightBox[i].location.x,lightBox[i].location.y,lightBox[i].location.z,lightBox[i].location.w);
		}
		else if(lightBox[i].spot)
		{
			this.lights[i].setPosition(lightBox[i].location.x,lightBox[i].location.y,lightBox[i].location.z,lightBox[i].location.w);
			this.lights[i].setSpotDirection(
				lightBox[i].target.x - lightBox[i].location.x,
				lightBox[i].target.y - lightBox[i].location.y,
				lightBox[i].target.z - lightBox[i].location.z);
			this.lights[i].setSpotExponent(lightBox[i].exponent);
			this.lights[i].setSpotCutOff(lightBox[i].angle * Math.PI/180);
			this.lights[i].setConstantAttenuation(0);
			this.lights[i].setLinearAttenuation(1);
			this.lights[i].setQuadraticAttenuation(0);
		}
		else
		{
			console.log("ERROR - Missing OMNI or SPOT lights.");
		}
		this.lights[i].setVisible(true);
		if(lightBox[i].enabled)
		{
			this.lights[i].enable();
		}
	}
};

/**
 * Creating new Materials from DSX file
 */
XMLscene.prototype.setMaterialsGraph = function()
{
	console.info("Creating new Materials from DSX file");
	
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
		ape.setShininess(sh);

		this.materials[id] = ape;
	}
};
/**
 * Creating new Textures from DSX file
 */
XMLscene.prototype.setTextureGraph = function()
{
	console.info("Creating new Textures from DSX file");
	
	this.textures = [];

	var n_texture = this.graph.texturelist.length;

	for(var i = 0; i < n_texture; i++)
	{
		var texture = [];

		var id = this.graph.texturelist[i]['id'];

		var file = this.graph.texturelist[i]['file'];
		var length_s = this.graph.texturelist[i]['length_s'];
		var length_t = this.graph.texturelist[i]['length_t'];
		

		texture['texture'] = new CGFtexture(this, file);
		texture['length_s'] = parseFloat(length_s);
		texture['length_t'] = parseFloat(length_t);

		this.textures[id] = texture;
	}
};

/**
 * Creating new Transformations reference from DSX file
 */
XMLscene.prototype.setTransformationsGraph = function()
{
	console.info("Creating new Transformations from DSX file");
	
	this.transformations = [];

	var n_transformations = this.graph.transformationlist.length;

	for(var i = 0; i < n_transformations; i++)
	{
		var id = this.graph.transformationlist[i]['id'];

		var matrix = mat4.create();
		var n_translist = this.graph.transformationlist[i]['list'].length;

		for(var j = 0; j < n_translist; j++)
		{
			if(this.graph.transformationlist[i]['list'][j]['type'] == 'translate')
			{
				var tx = this.graph.transformationlist[i]['list'][j]['x'];
				var ty = this.graph.transformationlist[i]['list'][j]['y'];
				var tz = this.graph.transformationlist[i]['list'][j]['z'];
				var transvec = vec3.fromValues(tx,ty,tz);
				mat4.translate(matrix, matrix, transvec);
			}
			else if(this.graph.transformationlist[i]['list'][j]['type'] == 'scale')
			{
				var sx = this.graph.transformationlist[i]['list'][j]['x'];
				var sy = this.graph.transformationlist[i]['list'][j]['y'];
				var sz = this.graph.transformationlist[i]['list'][j]['z'];
				var scalevector = vec3.fromValues(sx,sy,sz);
				mat4.scale(matrix, matrix, scalevector);
			}
			else if(this.graph.transformationlist[i]['list'][j]['type'] == 'rotate')
			{
				var axis = this.graph.transformationlist[i]['list'][j]['axis'];
				var angle = this.graph.transformationlist[i]['list'][j]['angle'];
				var axisvec;
				
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
			}
		}
		this.transformations[id] = matrix;	
	}
};

/**
 * Creating new Primiteves from DSX file
 */
XMLscene.prototype.setPrimitivesGraph = function()
{
	console.info("Creating new Primitives from DSX file");
	this.primitives = [];

	var n_prim = this.graph.primitiveslist.length;

	for(var i = 0; i < n_prim; i++)
	{
		var type = this.graph.primitiveslist[i]['type'];

		var id = this.graph.primitiveslist[i]['id'];

		var object;

		if(type == 'rectangle')
		{
			var x1 = this.graph.primitiveslist[i]['x1']; var x1 = parseFloat(x1);
			var y1 = this.graph.primitiveslist[i]['y1']; var y1 = parseFloat(y1);
			var x2 = this.graph.primitiveslist[i]['x2']; var x2 = parseFloat(x2);
			var y2 = this.graph.primitiveslist[i]['y2']; var y2 = parseFloat(y2);

			object = new MyRectangle(this, x1,y1,x2,y2, 1,1);
		} 
		else if(type == 'cylinder')
		{
			var base = this.graph.primitiveslist[i]['base']; 		var base = parseFloat(base);
			var top = this.graph.primitiveslist[i]['top'];       	var top = parseFloat(top);	
			var height = this.graph.primitiveslist[i]['height'];	var height = parseFloat(height);
			var slices = this.graph.primitiveslist[i]['slices'];	var slices = parseFloat(slices);
			var stacks = this.graph.primitiveslist[i]['stacks'];	var stacks = parseFloat(stacks);

			object = new MyCylinder(this, base, top, height, slices, stacks);

		}
		else if(type == 'sphere')
		{
			var radius = this.graph.primitiveslist[i]['radius']; 	var radius = parseFloat(radius);
			var slices = this.graph.primitiveslist[i]['slices'];	var slices = parseFloat(slices);
			var stacks = this.graph.primitiveslist[i]['stacks'];  	var stacks = parseFloat(stacks);

			object = new MySphere(this, radius, slices, stacks);
		}
		else if(type == 'triangle')
		{
			var x1 = this.graph.primitiveslist[i]['x1']; 	var x1 = parseFloat(x1);
			var y1 = this.graph.primitiveslist[i]['y1'];	var y1 = parseFloat(y1);
			var z1 = this.graph.primitiveslist[i]['z1'];	var z1 = parseFloat(z1);

			var x2 = this.graph.primitiveslist[i]['x2'];	var x2 = parseFloat(x2);
			var y2 = this.graph.primitiveslist[i]['y2'];	var y2 = parseFloat(y2);
			var z2 = this.graph.primitiveslist[i]['z2'];	var z2 = parseFloat(z2);

			var x3 = this.graph.primitiveslist[i]['x3'];	var x3 = parseFloat(x3);
			var y3 = this.graph.primitiveslist[i]['y3'];	var y3 = parseFloat(y3);
			var z3 = this.graph.primitiveslist[i]['z3'];	var z3 = parseFloat(z3);

			object = new MyTriangle(this, x1,y1,z1,x2,y2,z2,x3,y3,z3,1,1);
		}
		else if(type == 'torus')
		{
			var inner = this.graph.primitiveslist[i]['inner'];		var inner = parseFloat(inner);
			var outer = this.graph.primitiveslist[i]['outer'];		var outer = parseFloat(outer);
			var slices = this.graph.primitiveslist[i]['slices']; 	var slices = parseFloat(slices);
			var loops = this.graph.primitiveslist[i]['loops'];		var loops = parseFloat(loops);

			object = new MyTorus(this, inner, outer, slices, loops);
		}

		this.primitives[id] = object;
	}

		
};

/**
 * Create new Animations from DSX file
 */

XMLscene.prototype.setAnimationsGraph=function()
{
	console.info("Creating Animations");

	this.animations = [];
	var n_anim = this.graph.animationslist.length;

	for(var i = 0; i < n_anim; i++)
	{
		var id = this.graph.animationslist[i]['id'];
		var type = this.graph.animationslist[i]['type'];
		var span = this.graph.animationslist[i]['span'];

		if(type == "linear")
		{
			var controlpoints = this.graph.animationslist[i]['controlpoints'];
			var anim = new LinearAnimation(id, span, type, controlpoints);
			this.animations.push(anim);
		}
		else if(type == "circular")
		{
			var center = this.graph.animationslist[i]['center'];
			var radius = this.graph.animationslist[i]['radius'];
			var startang = this.graph.animationslist[i]['startang'];
			var rotang = this.graph.animationslist[i]['rotang'];
			var anim = new CircularAnimation(id, span, type, center, radius, startang, rotang);
			this.animations.push(anim);
		}
	}
}



/**
 * Create new Graph from Components on DSX file
 */
XMLscene.prototype.createGraph = function()
{
	console.info("Creating new Graph");
	
	this.nodes = [];

	var n_node = this.graph.componentslist.length;

	for(var i = 0; i < n_node; i++)
	{
		var id = this.graph.componentslist[i]['id'];
		var node = new Node(this.graph.componentslist[i]['id']);
		var transformation = [];
	
		
		//Setting Transformation for component from DSX file
		if(this.graph.componentslist[i]['transformations'][0]['type']  == 'transformationref')
		{
			transformation['type'] = 'transformationref';
			transformation['transformation'] = this.graph.componentslist[i]['transformations'][0]['id'];
		}
		else
		{
			transformation['type'] = 'transformation';
			var n_trans = this.graph.componentslist[i]['transformations'].length;
			var matrix = mat4.create();

			for(var j = 0; j < n_trans; j++)
			{
				if(this.graph.componentslist[i]['transformations'][j]['type'] == 'translate')
				{
					var tx = this.graph.componentslist[i]['transformations'][j]['x'];
					var ty = this.graph.componentslist[i]['transformations'][j]['y'];
					var tz = this.graph.componentslist[i]['transformations'][j]['z'];
					var transvec = vec3.fromValues(tx,ty,tz);
					mat4.translate(matrix, matrix, transvec);
				}
				else if(this.graph.componentslist[i]['transformations'][j]['type'] == 'scale')
				{
					var sx = this.graph.componentslist[i]['transformations'][j]['x'];
					var sy = this.graph.componentslist[i]['transformations'][j]['y'];
					var sz = this.graph.componentslist[i]['transformations'][j]['z'];
					var scalevector = vec3.fromValues(sx,sy,sz);
					mat4.scale(matrix, matrix, scalevector);
				}
				else if(this.graph.componentslist[i]['transformations'][j]['type'] == 'rotate')
				{
					var axis =  this.graph.componentslist[i]['transformations'][j]['axis'];
					var angle =  this.graph.componentslist[i]['transformations'][j]['angle'];
					var axisvec;

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
				}
			}
			transformation['transformation'] = matrix;
		}
		node.setTransformation(transformation);

		
		//Setting Materials, setting first as current and default	 
		var n_materials = this.graph.componentslist[i]['materials'].length;
		
		for(var j = 0; j < n_materials; j++)
		{
			var mat = this.graph.componentslist[i]['materials'][j];
			node.setMaterial(mat);

			if(j == 0)
			{
				node.setdefaultMaterial(mat, 0);
			}
		}
		
		//Setting Texture for component from DSX file
		var textur = this.graph.componentslist[i]['texture'];
		node.setTexture(textur);
			
		//Setting Primitives for component from DSX file
		if(this.graph.componentslist[i]['primitives'] != null)
		{			
			var n_primitives = this.graph.componentslist[i]['primitives'].length;
			for(var k = 0; k < n_primitives; k++)
			{
				var pr = this.graph.componentslist[i]['primitives'][k];
				node.setPrimitive(pr);
			}		
		}
		//Setting Animations for component from DSX file
		if(this.graph.componentslist[i]['animations'] != null)
		{
			var n_animations = this.graph.componentslist[i]['animations'].length;
			for(var c = 0; c < n_animations; c++)
			{
				var ar = this.graph.componentslist[i]['animations'][c];
				node.setAnimation(ar);
			}
		}
		//Setting Children for component from DSX file
		if(this.graph.componentslist[i]['children'] != null)
		{			
			var n_children = this.graph.componentslist[i]['children'].length;
			for(var t = 0; t < n_children; t++)
			{
				var ch = this.graph.componentslist[i]['children'][t];
				node.setChildren(ch);
			}		
		}
		
		// Pushing to Graph Array		 
		this.nodes[id] = node;
	}
};

/**
 * DISPLAY GRAPH SECTION
 * Funtion to prepare everything for the display cycle starting from the root.
 * Sets every default argument defined in the root and passes it through the 
 * displayNodes. The rules tested in MySceneGraph prevents from errors to pass 
 * down the graph.
 * - Passes a transformation matrix, the current/default material in Node, the Texture,
 * the children list and the primitives list.
 * This allows to apply the current transformation matrix to the other transformations
 * down the graph (Allways loads a transformation matrix even if Reference or not)
 * - Allows the material from the root to be applied in case of inherit.
 * Even if the default material is changed by pressing M/m it displays again the new 
 * current/default material
 * - Allows the texture to be applied if "inherit" appens downs the graph and to ingnored
 * if "none" happens.
 */
XMLscene.prototype.displayGraphElems=function()
{
	var id = this.root;

	var transformationtype = this.nodes[id].transformation['type'];
	var transformation;

	if(transformationtype == 'transformationref')
	{
		var transformationID =  this.nodes[id].transformation['transformation'];
		transformation = this.transformations[transformationID];
	}
	else
	{
		transformation = this.nodes[id].transformation['transformation'];
	}

	var materialst = this.nodes[id].defaultMaterial;
	var texture = this.nodes[id].texture;
	var children = this.nodes[id].children;
	var primitive = this.nodes[id].primitive;
	var animations = this.nodes[id].animations;		
	
	this.displayNodes(id, transformation, materialst, texture, children, primitive, animations);
	
};

/**
 * Function called for display primitives and recursivle call again for 
 * the next children.
 * 
 * PRIMITIVES: if any primitive is passed as argument:
 * - Able to process more than one primitive with internal cycle
 * - Updates textCoords from length_s and length_t, sets 'CLAMP_TO_EDGE',
 * and sets designated texture if texture argument is different from "none".
 * - The material always exisits to apply. "Inherit" material is passsed as argument
 * in the previous children and is applied. 
 * - Applies the Transformation matrix passed as argument to the scene
 * 
 * CHILDREN: if any children is passed as argument: 
 * - Process all children in the array from cycle (ignores if children invokes father)
 * - Load the transformation matrix from Reference or Implicit. Applies to the father matrix.
 * - Passes new material if children current material is not "inherit", otherwise passes the
 * father material
 * - Passes new texture if children texture is not "inherit", otherwise passes father texture
 * - Passes childrens list and primitives list
 */
XMLscene.prototype.displayNodes=function(id, transformation, material, texture, children, primitive, animations)
{
	if(primitive.length > 0)
	{
		for(var i = 0; i < primitive.length; i++)
		{
			var obj = this.primitives[primitive[i]];
			var materialToApply = this.materials[material];
			
			if(texture != "none")
			{
				materialToApply.setTextureWrap('CLAMP_TO_EDGE', 'CLAMP_TO_EDGE');
				materialToApply.setTexture(this.textures[texture]['texture']);
				obj.updateTextureCoords(this.textures[texture]['length_s'], this.textures[texture]['length_t']);
			}
	
			this.pushMatrix();	
				this.multMatrix(transformation);
				materialToApply.apply();			
				obj.display();			
			this.popMatrix();

			materialToApply.setTexture(null);

		}
	}
	if(children.length > 0)
	{
		for(var i = 0; i < children.length; i++)
		{
			var newid = children[i];
			if(newid != id)
			{
				var matrixtrans = mat4.create();
				var transtype = this.nodes[newid].transformation['type'];
				var trans;
				
				//Transformations
				if(transtype == 'transformationref')
				{
					var transid = this.nodes[newid].transformation['transformation'];
					trans = this.transformations[transid];
				}
				else
				{
					trans = this.nodes[newid].transformation['transformation'];
				}
				mat4.multiply(matrixtrans, transformation, trans);
				
				//Materials
				var newmaterial;
				if(this.nodes[newid].defaultMaterial == "inherit")
				{
					newmaterial = material;
				}
				else
				{
					newmaterial = this.nodes[newid].defaultMaterial;
				}
		
				//Textures
				var newTexture;
				if(this.nodes[newid].texture == "inherit")
				{
					newTexture = texture;
				}
				else
				{
					newTexture = this.nodes[newid].texture;
				}

				//Animations
				var newAnimations = [];
				
				for(var g = 0; g < this.nodes[newid].animations.length; g++)
				{
					newAnimations.push(this.nodes[newid].animations[g]);
				}

			
				
				//Children
				var newChildren = this.nodes[newid].children;
				//Primitives
				var newPrimitives = this.nodes[newid].primitive;
		
				this.displayNodes(newid, matrixtrans, newmaterial, newTexture, newChildren, newPrimitives, newAnimations);	
			}
			else
			{
				console.warn("WARNING: Prevented infinte loop. Children is calling Father: '" + id + "' <-> '" + newid + "'");
			}
		}
	}
};

/**
 * UPDATES FROM INTERFACE SECTION
 * Funtion called when pressed V/v. Checks if the current camera index is the last 
 * of cameras list. 
 * If true sets as 0 and sets the current camera the one with index 0
 * If false adds 1 to the current camera index and sets the current camera the one
 * in that new index in the cameras list.
 */
XMLscene.prototype.updateCamera=function()
{
	var camerasLength = this.graph.perspectiveContent.length;

	if(this.cameraIndex == camerasLength - 1)
	{
		this.cameraIndex = 0;
	}
	else
	{
		this.cameraIndex = this.cameraIndex + 1;
	}

	var newcm = this.graph.perspectiveContent[this.cameraIndex]['id'];
	console.log(newcm);
	this.camera = this.cameras[newcm];
	this.interface.setActiveCamera(this.camera);
	this.display();

}; 

/**
 * Function called when pressed M/m
 * Goes through all the components in the graph and sets for each a new material
 * if materials list is bigger than 1.
 * If current material index is the last of materials index sets as 0 and sets the 
 * material with index 0
 * If current material index is not the last of materials index, adds 1 as to the index
 * and sets the new material the material with the new index on the list.
 */
XMLscene.prototype.materialsUpdate=function()
{
	for(var i = 0; i < this.graph.componentslist.length; i++)
	{
		var idNode = this.graph.componentslist[i]['id'];
		var n_materiais = this.nodes[idNode]['materials'].length;

		if(n_materiais > 1)
		{
			var currMatIndex = this.nodes[idNode].defaultMaterialIndex;
			if(currMatIndex >= n_materiais - 1)
			{
				currMatIndex = 0;
				this.nodes[idNode].setdefaultMaterial( this.nodes[idNode]['materials'][currMatIndex],currMatIndex);
			}
			else
			{
				currMatIndex = currMatIndex + 1;
				this.nodes[idNode].setdefaultMaterial( this.nodes[idNode]['materials'][currMatIndex],currMatIndex);
			}

		}
	}
};

/**
 * UPDATE LIGHTS SECTION
 * Function called to update lights
 * Enables and disables lights if states are true or false.
 * Usefull with the Interface Lights folder checkboxes.
 */
XMLscene.prototype.updateLights=function()
{
	for(var i = 0; i < this.lights.length; i++)
	{
		var id = this.graph.lightslist[i]['id'];

		if(this.lightstates[id] == true)
			this.lights[i].enable();
		else
			this.lights[i].disable();

		this.lights[i].update();
	}
};

/**
 * Overriding Update
 */
XMLscene.prototype.update=function(currTime)
{

	if(this.animations != null)
	{
		for(var i = 0; i < this.animations.length; i++)
		{
			this.animations[i].update();	
		}
	} 
};


