/**
 * My Scene Graph
 */

function MySceneGraph(filename, scene) 
{
	this.loadedOk = null;
	
	// Establish bidirectional references between scene and graph
	this.scene = scene;
	scene.graph=this;//creates inside scene a variable graph equals
		
	// File reading 
	this.reader = new CGFXMLreader();

	/*
	 * Read the contents of the xml file, and refer to this class for loading and error handlers.
	 * After the file is read, the reader calls onXMLReady on this object.
	 * If any error occurs, the reader calls onXMLError on this object, with an error message
	 */
	 
	this.reader.open('scenes/'+filename, this);  
}

/*
 * 	Callback to be executed after successful reading. Checks if file is dsx type and starts to parse Everything by order
 *	as specified in the  file.dsx example
 */
MySceneGraph.prototype.onXMLReady=function() 
{
	console.log("XML Loading finished.");
	var rootElement = this.reader.xmlDoc.documentElement;

	if(rootElement.nodeName != "dsx")
	{
		var error = "Not a DSX file";
		this.onXMLError(error);
		return;
	}
	
	var error = this.parseSceneRoot(rootElement);

	if (error != null) 
	{
		this.onXMLError(error);
		return;
	}

	var error = this.parseViews(rootElement);
	if(error != null)
	{
		this.onXMLError(error);
		return;
	}
	var error =  this.parseIllumination(rootElement);

	if(error != null)
	{
		this.onXMLError(error);
		return;
	}	
	
	var error = this.parseLights(rootElement);
	if(error != null)
	{
		this.onXMLError(error);
		return;
	}
	var error =  this.parseTextures(rootElement);

	if(error != null)
	{
		this.onXMLError(error);
		return;
	}

	var error = this.parseMaterials(rootElement);
	if(error != null)
	{
		this.onXMLError(error);
		return;
	}

	var error = this.parseTransformations(rootElement);
	if(error != null)
	{
		this.onXMLError(error);
		return;
	}

	var error = this.parsePrimitives(rootElement);
	if(error != null)
	{
		this.onXMLError(error);
		return;
	}

	var error = this.parseComponents(rootElement);
	if(error != null)
	{
		this.onXMLError(error);
		return;
	}

	this.loadedOk=true;
	
	//As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
	this.scene.onGraphLoaded();
};

/*
 * Method to parse the Root and axis, stores in global variables
 */
MySceneGraph.prototype.parseSceneRoot = function(rootElement)
 {
	var elems = rootElement.getElementsByTagName('scene');
	if(elems == null)
	{
		return "Scene Tag Missing";
	}

	if(elems.length != 1)
	{
		return "Either zero or more than one 'scene root' element found.";
	}

	this.root = elems[0].getAttribute('root');

	if(this.root == null)
	{
		return "Scene Root not defined";
	}


	this.axis_length = elems[0].getAttribute('axis_length');

	if(this.axis_length == null)
	{
		console.log("WARING: Axis Length missing, setting axis with 2 unit of length");
		this.axis_length = 2.0;
	}
	
   
};

MySceneGraph.prototype.parseViews = function(rootElement)
{
	var elems = rootElement.getElementsByTagName('views');
	if(elems == null)
	{
		return "Views element missing";
	}
	if(elems.length != 1)
	{
		return "Either zero or more than one 'views' element found.";
	}

	this.perspectiveContent = [];
	var nperspectives = elems[0].children.length;
	this.default = elems[0].getAttribute('default');

	if(nperspectives > 0)
	{
		var perspectives = elems[0].children;

		for(var i = 0; i < nperspectives; i++)
		{
			var perspective = [];
			perspective['id'] = perspectives[i].getAttribute('id');

			if((i == 0 && this.default == null) || (i == 0 && this.default == ""))
			{
				console.log("WARNING: Default tag not found, setting the first perpestive: " + perspective['id']);
				this.default = perspective['id'];
			}
				
			perspective['near'] = perspectives[i].getAttribute('near');
			perspective['far'] = perspectives[i].getAttribute('far');
			perspective['angle'] = perspectives[i].getAttribute('angle');

			var elemFrom = perspectives[i].getElementsByTagName('from');
			var from = [];
			from['x'] = elemFrom[0].getAttribute('x');
			from['y'] = elemFrom[0].getAttribute('y');
			from['z'] = elemFrom[0].getAttribute('z');
			perspective['from'] = from;

			var elemTo = perspectives[i].getElementsByTagName('to');
			var to = [];
			to['x'] = elemTo[0].getAttribute('x');
			to['y'] = elemTo[0].getAttribute('y');
			to['z'] = elemTo[0].getAttribute('z');
			perspective['to'] = to;

			this.perspectiveContent.push(perspective);
		}
	}
	else
	{
		console.log(this.default);
		var perspective = [];

		if(this.default == null || this.default == "")
		{
			console.log("WARNING: Default not defined and no perspectives, creating perspective with id 'default' and setting as default");
			perspective['id'] = "default";
		}
		else
		{
			console.log("WARNING: Default defined but no perspectives defined, creating perspective with id" + this.default + " 'default' and setting as default");
			perspective['id'] = this.default;
		}

		perspective['near'] = 0.1;
		perspective['far'] = 500;
		perspective['angle'] = 0.4;

		var from = [];
		from['x'] = 15;
		from['y'] = 15;
		from['z'] = 15;
		perspective['from'] = from;

		var to = [];
		to['x'] = 0.0;
		to['y'] = 0.0;
		to['z'] = 0.0;
		perspective['to'] = to;

		this.perspectiveContent.push(perspective);
	}

	var n_perspectivesParsed = this.perspectiveContent.length;
	var defaultExists = false;

	for(var j = 0; j < n_perspectivesParsed; j++)
	{
		if(this.perspectiveContent[j]['id'] == this.default)
		{
			defaultExists = true;
			break;
		}
	}

	if(defaultExists == false)
	{
		this.default = this.perspectiveContent[0]['id'];
		console.log("WARNING: Not existing default in the Perspective content, setting as: " + this.default);	
	}

}
MySceneGraph.prototype.parseIllumination=function(rootElement)
{
	var elems = rootElement.getElementsByTagName('illumination');
	if(elems == null)
	{
		return "Illumination element missing";
	}

	if(elems.length != 1)
	{
		return "Either zero or more than one 'Illumination' element found.";
	}

	this.doublesided = elems[0].getAttribute('doublesided');
	this.local = elems[0].getAttribute('local');


	if(this.doublesided == null)
	{
		console.log("WARNING: Doublesided not found. Setting as true");
		this.doublesided = 1;
	}

	if(this.local == null)
	{
		console.log("WARNING: Local not found. Setting as true");
		this.local = 1;
	}

	this.ambientIllumination = [];

	var ambientContent = elems[0].getElementsByTagName('ambient');
	if(ambientContent == null || ambientContent == 0)
	{
		console.log("WARNING: Ambient Illumination not found, setting predefined attributes: R=0.2 G=0.2 B=0.2 A=1");
		this.ambientIllumination['r'] = 0.2;
		this.ambientIllumination['g'] = 0.2;
		this.ambientIllumination['b'] = 0.2;
		this.ambientIllumination['a'] = 1;
	}
	else
	{
		this.ambientIllumination['r'] = ambientContent[0].getAttribute('r');
		this.ambientIllumination['g'] = ambientContent[0].getAttribute('g');
		this.ambientIllumination['b'] = ambientContent[0].getAttribute('b');
		this.ambientIllumination['a'] = ambientContent[0].getAttribute('a');
	}


	this.background = [];
	var backgroundContent = elems[0].getElementsByTagName('background');

	if(backgroundContent == null || backgroundContent == 0)
	{
		console.log("WARNING: Background color not found, setting predefined attributes: R=1 G=1 B=1 A=1");
		this.background['r'] = 0;
		this.background['g'] = 0;
		this.background['b'] = 0;
		this.background['a'] = 1;
	}
	else
	{
		this.background['r'] = backgroundContent[0].getAttribute('r');
		this.background['g'] = backgroundContent[0].getAttribute('g');
		this.background['b'] = backgroundContent[0].getAttribute('b');
		this.background['a'] = backgroundContent[0].getAttribute('a');
	}
}

MySceneGraph.prototype.parseLights=function(rootElement)
{
	var elems = rootElement.getElementsByTagName('lights');
	if(elems == null)
	{
		return "Lights element missing";
	}

	if(elems.length != 1)
	{
		return "Either zero or more than one 'Illumination' element found.";
	}

	var nlights = elems[0].children.length;
	//console.log("Number of lights in the scene: " + nlights);
	var light = elems[0].children;
	this.lightslist = [];
	var tagMissing = false;

	for(var i = 0; i < nlights; i++)
	{
		var typelight = light[i].tagName;
		var lights = [];

		//console.log("Type of lights in the scene: " + typelights);
		if(typelight == 'omni')
		{
			lights['id'] = this.reader.getFloat(light[i], 'id');
			lights.enabled = this.reader.getBoolean(light[i], 'enabled');
			lights.omni = true;
			lights.spot = false;
			//console.log("Lights 'omni' attributes: 'id'=" + lights.id + "; 'enabled'=" + lights.enabled);
			//light location
			var location = [];
			var elemLocation = light[i].getElementsByTagName('location');
			location.x = elemLocation[0].getAttribute('x');
			location.y = elemLocation[0].getAttribute('y');
			location.z = elemLocation[0].getAttribute('z');
			location.w = elemLocation[0].getAttribute('w');
			lights['location'] = location;
			//console.log("Omni lights location X: " + location.x + "; Y: " + location.y + "; Z: " + location.z + "; W: " + location.w);

			var ambient = [];
			var elemAmbient = light[i].getElementsByTagName('ambient');
			ambient.r = elemAmbient[0].getAttribute('r');
			ambient.g = elemAmbient[0].getAttribute('g');
			ambient.b = elemAmbient[0].getAttribute('b');
			ambient.a = elemAmbient[0].getAttribute('a');
			lights['ambient'] = ambient;
			//console.log("Omni lights ambient RED: " + ambient.r + "; GREEN: " + ambient.g + "; BLUE: " + ambient.b + "; Alpha: " + ambient.a);

			diffuse = [];
			var elemDiffuse = light[i].getElementsByTagName('diffuse');
			diffuse.r = elemDiffuse[0].getAttribute('r');
			diffuse.g = elemDiffuse[0].getAttribute('g');
			diffuse.b = elemDiffuse[0].getAttribute('b');
			diffuse.a = elemDiffuse[0].getAttribute('a');
			lights['diffuse'] = diffuse;
			//console.log("Omni lights diffuse RED: " + diffuse.r + "; GREEN: " + diffuse.g + "; BLUE: " + diffuse.b + "; Alpha: " + diffuse.a);

			specular = [];
			var elemSpecular = light[i].getElementsByTagName('specular');
			specular.r = elemSpecular[0].getAttribute('r');
			specular.g = elemSpecular[0].getAttribute('g');
			specular.b = elemSpecular[0].getAttribute('b');
			specular.a = elemSpecular[0].getAttribute('a');
			lights['specular'] = specular;
			
			//console.log("Omni lights specular RED: " + specular.r + "; GREEN: " + specular.g + "; BLUE: " + specular.b + "; Alpha: " + specular.a);
			//omni lights elements saves in lightslist
			this.lightslist.push(lights); 
			//console.log(this.lightslist);


		}
		else if(typelight == 'spot')
		{
			lights.id = this.reader.getFloat(light[i], 'id');
			lights.enabled = this.reader.getBoolean(light[i], 'enabled');
			lights.angle = this.reader.getFloat(light[i], 'angle');
			lights.exponent = this.reader.getFloat(light[i], 'exponent');
			lights.omni = false;
			lights.spot = true;
			//console.log("Lights 'spot' attributes: 'id'=" + lights.id + "; 'enabled'=" + lights.enabled + "; 'angle'=" + lights.angle + "; 'exponent'=" + lights.exponent);

			//light target
			target = [];
			var elemTarget = light[i].getElementsByTagName('target');
			target.x = elemTarget[0].getAttribute('x');
			target.y = elemTarget[0].getAttribute('y');
			target.z = elemTarget[0].getAttribute('z');
			lights['target'] = target;
			//console.log("Spot lights target X: " + target.x + "; Y: " + target.y + "; Z: " + target.z);

			//light location
			location = [];
			var elemLocation = light[i].getElementsByTagName('location');
			location.x = elemLocation[0].getAttribute('x');
			location.y = elemLocation[0].getAttribute('y');
			location.z = elemLocation[0].getAttribute('z');
			lights['location'] = location;
			//console.log("Spot lights location X: " + location.x + "; Y: " + location.y + "; Z: " + location.z);

			this.ambient = [];
			var elemAmbient = light[i].getElementsByTagName('ambient');
			ambient.r = elemAmbient[0].getAttribute('r');
			ambient.g = elemAmbient[0].getAttribute('g');
			ambient.b = elemAmbient[0].getAttribute('b');
			ambient.a = elemAmbient[0].getAttribute('a');
			lights['ambient'] = ambient;
			//console.log("Spot lights ambient RED: " + ambient.r + "; GREEN: " + ambient.g + "; BLUE: " + ambient.b + "; Alpha: " + ambient.a);

			diffuse = [];
			var elemDiffuse = light[i].getElementsByTagName('diffuse');
			diffuse.r = elemDiffuse[0].getAttribute('r');
			diffuse.g = elemDiffuse[0].getAttribute('g');
			diffuse.b = elemDiffuse[0].getAttribute('b');
			diffuse.a = elemDiffuse[0].getAttribute('a');
			lights['diffuse'] = diffuse;
			//console.log("Spot lights diffuse RED: " + diffuse.r + "; GREEN: " + diffuse.g + "; BLUE: " + diffuse.b + "; Alpha: " + diffuse.a);

			specular = [];
			var elemSpecular = light[i].getElementsByTagName('specular');
			specular.r = elemSpecular[0].getAttribute('r');
			specular.g = elemSpecular[0].getAttribute('g');
			specular.b = elemSpecular[0].getAttribute('b');
			specular.a = elemSpecular[0].getAttribute('a');
			lights['specular'] = specular;
			//console.log("Spot lights specular RED: " + specular.r + "; GREEN: " + specular.g + "; BLUE: " + specular.b + "; Alpha: " + specular.a);
			//spot lights elements saves in lightslist
			this.lightslist.push(lights); 
			//console.log(this.lightslist);
		}
		else
		{
			tagMissing = true;
			break;
		}
	}
	if(tagMissing)
	{
		console.log("Missing 'omni' and 'spot' type of lights. Change tag name please.");
	}
	
}

MySceneGraph.prototype.parseTextures = function(rootElement)
{
	elems = rootElement.getElementsByTagName('textures');

	if(elems == null)
	{
		return "Textures element missing";
	}
	if(elems.length != 1)
	{
		return "Either zero or more than one 'Textures' element found.";
	}

	var ntextures = elems[0].children.length;
	this.texturelist = [];

	for(var i = 0; i < ntextures; i++)
	{
		var texture = [];

		var id = elems[0].children[i].getAttribute('id');
		var file = elems[0].children[i].getAttribute('file');
		var length_s = elems[0].children[i].getAttribute('length_s');
		var length_t = elems[0].children[i].getAttribute('length_t');

		texture['id'] = id;
		texture['file'] = file;
		texture['length_s'] = length_s;
		texture['length_t'] = length_t;

		this.texturelist.push(texture);		
	}

}

MySceneGraph.prototype.parseMaterials = function(rootElement)
{
	elems = rootElement.getElementsByTagName('materials');

	this.materialslist = [];

	if(elems == null)
	{
		console.log("WARNING: No material found, creating 'default' material");

		var materials = [];

		materials['id'] = "default";

		var emissionAtt = [];
		emissionAtt.r  = 0;
		emissionAtt.g  = 0;
		emissionAtt.b  = 0;
		emissionAtt.a  = 1;
		materials['emission'] = emissionAtt;

		var ambientAtt = [];
		ambientAtt.r  = 0.1;
		ambientAtt.g  = 0.1;
		ambientAtt.b  = 0.1;
		ambientAtt.a  = 1;
		materials['ambient'] = ambientAtt;

		var diffuseAtt = [];
		difuseAtt.r  = 0.1;
		difuseAtt.g  = 0.1;
		difuseAtt.b  = 0.1;
		difuseAtt.a  = 1;
		materials['diffuse'] = diffuseAtt;

		var specularAtt = [];
		specularAtt.r = 0.1;
		specularAtt.g = 0.1;
		specularAtt.b = 0.1;
		specularAtt.a = 0.1;
		materials['specular'] = specularAtt;

		var shininessAtt = [];
		shininessAtt.value = 0.1;
		materials['shininess'] = shininessAtt;
		
		this.materialslist.push(materials);
	}
	else
	{
	
		var nmaterials = elems[0].children.length;
		//console.log("num. of materials: " + nmaterials);
		var material = elems[0].children;
		
		for(var i = 0; i < nmaterials; i++)
		{
			var id = material[i].getAttribute('id');
			//console.log("Material id: " + id);
			var materials = [];

			materials['id'] = id;

			var emissionAtt = [];
			var emission = material[i].getElementsByTagName('emission');
			emissionAtt.r = emission[0].getAttribute('r');
			emissionAtt.g = emission[0].getAttribute('g');
			emissionAtt.b = emission[0].getAttribute('b');
			emissionAtt.a = emission[0].getAttribute('a');
			//console.log("Emission: r = " + emissionAtt.r+ " g = " + emissionAtt.g  +  " b = " + emissionAtt.b + " a = " +  emissionAtt.a);
			materials['emission'] = emissionAtt;

			ambientAtt = [];
			var ambient = material[i].getElementsByTagName('ambient');
			ambientAtt.r = ambient[0].getAttribute('r');
			ambientAtt.g = ambient[0].getAttribute('g');
			ambientAtt.b = ambient[0].getAttribute('b');
			ambientAtt.a = ambient[0].getAttribute('a');
			//console.log("Ambient: r = " + ambientAtt.r+ " g = " + ambientAtt.g  +  " b = " + ambientAtt.b + " a = " +  ambientAtt.a);
			materials['ambient'] = ambientAtt;

			diffuseAtt = [];
			var diffuse = material[i].getElementsByTagName('diffuse');
			diffuseAtt.r = diffuse[0].getAttribute('r');
			diffuseAtt.g = diffuse[0].getAttribute('g');
			diffuseAtt.b = diffuse[0].getAttribute('b');
			diffuseAtt.a = diffuse[0].getAttribute('a');
			//console.log("Diffuse: r = " + diffuseAtt.r+ " g = " + diffuseAtt.g  +  " b = " + diffuseAtt.b + " a = " +  diffuseAtt.a);
			materials['diffuse'] = diffuseAtt;

			specularAtt = [];
			var specular = material[i].getElementsByTagName('specular');
			specularAtt.r = specular[0].getAttribute('r');
			specularAtt.g = specular[0].getAttribute('g');
			specularAtt.b = specular[0].getAttribute('b');
			specularAtt.a = specular[0].getAttribute('a');
			//console.log("Specular: r = " + specularAtt.r+ " g = " + specularAtt.g  +  " b = " + specularAtt.b + " a = " +  specularAtt.a);
			materials['specular'] = specularAtt;

			shininessAtt = [];
			var shininess = material[i].getElementsByTagName('shininess');
			shininessAtt.value = shininess[0].getAttribute('value');

			//console.log("Shininess: r = " + shininessAtt.value);
			materials['shininess'] = shininessAtt;
			//material attributes saved in a list of materials
			this.materialslist.push(materials);
			//console.log(this.materialslist);
		}
	}
}


MySceneGraph.prototype.parseTransformations = function(rootElement)
{
    var elems = rootElement.getElementsByTagName('transformations');
	
	if(elems == null)
	{
		return "Transformation element missing";
	}
	if(elems.length != 1)
	{
		return "Either zero or more than one 'Transformation' element found.";
	}

    var ntransformations = elems[0].children.length;
    //console.log("NUM. of transformations: " + ntransformations);

    var transformation = elems[0].children;
	this.transformationlist = [];

    for (var i = 0; i < ntransformations; i++)
    {
        var id = transformation[i].getAttribute('id');
        //console.log("Transformation id: " + id);
		
		transformations = [];
		transformations['id'] = id;
		
		translateAtt = [];
		
		var translate = transformation[i].getElementsByTagName('translate');
		if (translate == null  || translate.length==0)
		{
			console.log("WARNING: No translation found on Transformation with id: " + id + ", giving translation (0,0,0) ");
			translateAtt['x'] = 0; 
			translateAtt['y'] = 0;
			translateAtt['z'] = 0;
		}
		else
		{
			translateAtt['x'] = translate[0].getAttribute('x');
			translateAtt['y'] = translate[0].getAttribute('y');
			translateAtt['z'] = translate[0].getAttribute('z');
		}
		//console.log("Translate: X = " + translateAtt['x'] + ";  Y = " + translateAtt['y'] + ";  Z = " + translateAtt['z']);
		transformations['translate'] = translateAtt;
		
		rotateAtt = [];
		
		var rotate = transformation[i].getElementsByTagName('rotate');
		if (rotate == null  || rotate.length==0) 
		{
			console.log("WARNING: No rotation found on Transformation with id: " + id + ", giving rotation (x, 0) ");
			rotateAtt['axis'] = "x";
			rotateAtt['angle'] = 0;			
		}
		else
		{
			rotateAtt['axis'] = rotate[0].getAttribute('axis');
			rotateAtt['angle'] = rotate[0].getAttribute('angle');
		}
		
		
		//console.log("Rotate: AXIS = " + rotateAtt['axis'] + ";  ANGLE = " + rotateAtt['angle']);
		transformations['rotate'] = rotateAtt;
		
		scaleAtt = [];
		var scale = transformation[i].getElementsByTagName('scale');
		
		if (scale == null  || scale.length==0) 
		{
			scaleAtt['x'] = 1
			scaleAtt['y'] = 1
			scaleAtt['z'] = 1
		}
		else
		{
			console.log("WARNING: No scale found on Transformation with id: " + id + ", giving scale (1,1,1) ");
			scaleAtt['x'] = scale[0].getAttribute('x');
			scaleAtt['y'] = scale[0].getAttribute('y');
			scaleAtt['z'] = scale[0].getAttribute('z');
		}
		
		//console.log("Scale: X = " + scaleAtt['x'] + ";  Y = " + scaleAtt['y'] + ";  Z = " + scaleAtt['z']);
		transformations['scale'] = scaleAtt;
       
     	this.transformationlist.push(transformations);
     	//console.log(this.transformationlist);
    }
}

MySceneGraph.prototype.parsePrimitives = function(rootElement)
{
    var elems = rootElement.getElementsByTagName('primitives');
	
	if(elems == null)
	{
		return "Primitives element missing";
	}
	if(elems.length != 1)
	{
		return "Either zero or more than one 'primitives' element found.";
	}

    var nprimitives = elems[0].children.length;
    //console.log("NUM. of primitives: " + nprimitives);

    var primitive = elems[0].children;
	this.primitiveslist = [];
	

	for (var i = 0; i < nprimitives; i++)
	{
		var primtype = primitive[i].children[0].tagName;

		var primitiveitem = [];

		var id = primitive[i].getAttribute('id');

		primitiveitem['type'] = primtype;
		primitiveitem['id'] = id;

		if(primtype == 'rectangle')
		{
			var x1 = primitive[i].children[0].getAttribute('x1');
			var y1 = primitive[i].children[0].getAttribute('y1');
			var x2 = primitive[i].children[0].getAttribute('x2');
			var y2 = primitive[i].children[0].getAttribute('y2');

			primitiveitem['x1'] = x1;
			primitiveitem['y1'] = y1;
			primitiveitem['x2'] = x2;
			primitiveitem['y2'] = y2;

		}
		else if(primtype == 'triangle')
		{
			var x1 = primitive[i].children[0].getAttribute('x1');
			var y1 = primitive[i].children[0].getAttribute('y1');
			var z1 = primitive[i].children[0].getAttribute('z1');
			var x2 = primitive[i].children[0].getAttribute('x2');
			var y2 = primitive[i].children[0].getAttribute('y2');
			var z2 = primitive[i].children[0].getAttribute('z2');
			var x3 = primitive[i].children[0].getAttribute('x3');
			var y3 = primitive[i].children[0].getAttribute('y3');
			var z3 = primitive[i].children[0].getAttribute('z3');
			

			primitiveitem['x1'] = x1;
			primitiveitem['y1'] = y1;
			primitiveitem['z1'] = z1;
			primitiveitem['x2'] = x2;
			primitiveitem['y2'] = y2;
			primitiveitem['z2'] = z2;
			primitiveitem['x3'] = x3;
			primitiveitem['y3'] = y3;
			primitiveitem['z3'] = z3;
		}
		else if(primtype == 'cylinder')
		{
			var base = primitive[i].children[0].getAttribute('base');
			var top = primitive[i].children[0].getAttribute('top');
			var height = primitive[i].children[0].getAttribute('height');
			var slices = primitive[i].children[0].getAttribute('slices');
			var stacks = primitive[i].children[0].getAttribute('stacks');

			primitiveitem['base'] = base;
			primitiveitem['top'] = top;
			primitiveitem['height'] = height;
			primitiveitem['slices'] = slices;
			primitiveitem['stacks'] = stacks;


		}
		else if(primtype == 'sphere')
		{
			var radius = primitive[i].children[0].getAttribute('radius');
			var slices = primitive[i].children[0].getAttribute('slices');
			var stacks = primitive[i].children[0].getAttribute('stacks');

			primitiveitem['radius'] = radius;
			primitiveitem['slices'] = slices;
			primitiveitem['stacks'] = stacks;


		}
		else if(primtype == 'torus')
		{
			var inner = primitive[i].children[0].getAttribute('inner');
			var outer = primitive[i].children[0].getAttribute('outer');
			var slices = primitive[i].children[0].getAttribute('slices');
			var loops = primitive[i].children[0].getAttribute('loops');

			primitiveitem['inner'] = inner;
			primitiveitem['outer'] = outer;
			primitiveitem['slices'] = slices;
			primitiveitem['loops'] = loops;
		}
		//console.log(primitiveitem);
		this.primitiveslist.push(primitiveitem);
	};
}

MySceneGraph.prototype.parseComponents = function(rootElement)
{
	var elems = rootElement.getElementsByTagName('components');

    if(elems == null)
    {
		return "Components element missing";
	}
	if(elems.length != 1)
	{
		return "Either zero or more than one 'components' element found.";
	}

	var ncomponents = elems[0].children.length;
    var component = elems[0].children;
    this.componentslist = [];

    for(var i = 0; i < ncomponents; i++)
    {
    	var id = component[i].getAttribute('id');

    	if(id != 'ignore')
    	{
			var componentelem = [];
			//console.log("Component id = " + id);
			componentelem['id'] = id;

			//Transformations

			var transformations = component[i].getElementsByTagName('transformation');
			var ntranformation = transformations[0].children.length;
			var transformation = transformations[0].children;
			
			componentelem['translationX'] = 0;
			componentelem['translationY'] = 0;
			componentelem['translationZ'] = 0;
			
			componentelem['scaleX'] = 1;
			componentelem['scaleY'] = 1;
			componentelem['scaleZ'] = 1;
			
			componentelem['rotateAxis'] = "x";
			componentelem['rotateAngle'] = 0;
			
			for(var j = 0; j < ntranformation; j++)
			{
				var tag_name = transformation[j].tagName;

				if(tag_name === 'transformationref')
				{
					var id = transformation[j].getAttribute('id');
					componentelem['transformationref'] = id;
					//console.log("Reference to Transformation id = " + id);
				}
				else
				{
					componentelem['transformationref'] = null;

					if(tag_name == 'translate')
					{
						var x = transformation[j].getAttribute('x');
						var y = transformation[j].getAttribute('y');
						var z = transformation[j].getAttribute('z');

						//console.log("Translate: X = " + x + ";  Y = " + y + ";  Z = " + z);

						componentelem['translationX'] = x;
						componentelem['translationY'] = y;
						componentelem['translationZ'] = z;

					}
					else if(tag_name == 'scale')
					{
						var x = transformation[j].getAttribute('x');
						var y = transformation[j].getAttribute('y');
						var z = transformation[j].getAttribute('z');

						//console.log("Scale: X = " + x + ";  Y = " + y + ";  Z = " + z);

						componentelem['scaleX'] = x;
						componentelem['scaleY'] = y;
						componentelem['scaleZ'] = z;
					}
					else if(tag_name == 'rotate')
					{
						var axis = transformation[j].getAttribute('axis');
						var angle = transformation[j].getAttribute('angle');

						//console.log("Rotate: AXIS = " + axis + "; ANGLE = " + angle);

						componentelem['rotateAxis'] = axis;
						componentelem['rotateAngle'] = angle;
					}
					else
					{
						console.log("MISSING one of these elements: TRANSLATE, ROTATE OR SCALE");
					}
				}
			}
    	

			//Materials
			var materials = component[i].getElementsByTagName('materials');


			console.log(materials);
			/*
			var nmaterials = materials[0].children.length;

			//console.log("NUM of Materials: " + nmaterials);

			var material = materials[0].children;

			var materialslst = [];
			componentelem['materials'] = materialslst;

			for(var j = 0; j < nmaterials; j++)
			{
				var id = material[j].getAttribute('id');
				//console.log("Material id = " + id);
				materialslst.push(id);
				componentelem['materials'] = materialslst;

			}
			*/


			//Textures
			var textures = component[i].getElementsByTagName('texture');
			
			if (textures == null  || textures.length==0) 
			{
				return "textures element is missing.";
			}
			var ntextures = textures.length;

			//console.log("NUM of Textures: " + ntextures);
		 
			
			var id = textures[0].getAttribute('id');
			//console.log("Texture id: " + id);
			
			componentelem['texture'] = id;

			//Children
			var children = component[i].getElementsByTagName('children');
			if (children == null  || children.length==0) 
			{
				return "children element is missing.";
			}

			var nchildren = children[0].children.length;
			var kids = children[0].children;

			//console.log("NUM of Children: " + nchildren);


			var primitiveslst = [];
			var childrenlst = [];

			componentelem['children'] = null;
			componentelem['primitives'] = null;

			for(var j = 0; j < nchildren; j++)
			{
				var tag_name = kids[j].tagName;

				if(tag_name === 'componentref')
				{
					id = kids[j].getAttribute('id');
					//console.log("Reference to component with the id = " + id);
					childrenlst.push(id);
				}
				else if(tag_name === 'primitiveref')
				{
					id = kids[j].getAttribute('id');
					//console.log("Reference to primitive with the id = " + id);
					primitiveslst.push(id);
				}
				else
				{
					console.log("The references must be: compoenetref or primitiveref");
				}
			}

			if(primitiveslst.length != 0)
			{
				componentelem['primitives'] = primitiveslst;
			}

			if(childrenlst.length != 0)
			{
			
				componentelem['children'] = childrenlst;
			}

			this.componentslist.push(componentelem);
    		}   
   		 }
    
	}

	
/*
 * Callback to be executed on any read error
 */
 
MySceneGraph.prototype.onXMLError=function (message) 
{
	console.error("XML Loading Error: "+message);	
	this.loadedOk=false;
};


