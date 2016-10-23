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

/**
 * Callback to be executed after successful reading. Checks if file is dsx type and starts to parse Everything by order
 * as specified in the  file.dsx example
 * Order of functions called have to be maintained
 * Checks for DSX name tag firts
 */
MySceneGraph.prototype.onXMLReady=function() 
{
	console.info("XML Loading finished.");
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

	this.scene.onGraphLoaded();
	this.loadedOk=true;
	
};

/**
 * Error checks in Floats and String implementation removed because code became illegible. 
 * User must always be conscient of valid arguments
 */

/**
 * Method to parse the Root and axis, stores in global variables
 * Checks if scene tag is 1, if 0 or more than 1 returns error
 * Checks if root tag exists, returns error if missing, passes 
 * as scene root the first one found and saves in 'root' class variable.
 * Checks if axis_lenght tag exists. If missing gives a warning and 
 * sets default of 2.0, If existing passes the first value found and
 * saves in 'axis_length' class variable.
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
		return "Either zero or more than one 'scene root' tag found. Only one allowed to be parsed";
	}

	this.root = elems[0].getAttribute('root');
	
	if(this.root == null)
	{
		return "Scene Root not defined";
	}

	this.axis_length = elems[0].getAttribute('axis_length');
	if(this.axis_length == null)
	{
		console.warn("WARING: Axis Length missing, setting axis with 2 unit of length");
		this.axis_length = 2.0;
	}
};

/**
 * Checks if tag Views exists, returns error if 0 or more than 1
 * Retrieves default view name
 * If default view null or empty. Sets as default the first one parsed 
 * Passes all the perspectives to an array 'perspectiveContent' with:
 * 
 * 			['id'], 
 * 			['near'], 
 * 			['far'], 
 * 			['angle'],
 * 			['from']['x'], ['from']['y'], ['from']['z'], 
 * 			['to']['x'], ['to']['y'] and ['to']['z']
 * 
 * If 'id', 'from' or 'to' tag missing returns error.
 * If no perspectives in the View, creates a default view with the default name parsed
 * If the default id is not defined, and no perspectives in the View tag
 * creates a default view with 'default' name and sets
 * that one as the default view. Gives Warning in any of this cases.
 * 
 * In case default view name exists and more than one tags as been parsed, searches for
 * the default view in the perspectives array. If not existing gives warning and sets 
 * a new default corresponding the first perspective in the array.
 * Checks for repeated id's in the array. If more than two same 'id' name found
 * returns error. 
 */
MySceneGraph.prototype.parseViews = function(rootElement)
{
	var elems = rootElement.getElementsByTagName('views');
	if(elems == null)
	{
		return "Views tag missing";
	}
	if(elems.length != 1)
	{
		return "Either zero or more than one 'views' tag found. Only one allowed to be parsed";
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
				console.warn("WARNING: Default tag not found, setting the first perpestive: '" + perspective['id'] + "'");
				this.default = perspective['id'];
			}

			if(perspective['id'] == null)
			{
				return "Missing ID in perspective number: " + i;
			}
				
			perspective['near'] = perspectives[i].getAttribute('near');
			perspective['far'] = perspectives[i].getAttribute('far');
			perspective['angle'] = perspectives[i].getAttribute('angle');

			var elemFrom = perspectives[i].getElementsByTagName('from');
			
			if(elemFrom.length < 1)
			{
				return "No 'From' content in perspective: '" + perspective['id'] + "'";
			}

			var from = [];
			from['x'] = elemFrom[0].getAttribute('x');
			from['y'] = elemFrom[0].getAttribute('y');
			from['z'] = elemFrom[0].getAttribute('z');
			perspective['from'] = from;

			var elemTo = perspectives[i].getElementsByTagName('to');

			if(elemTo.length < 1)
			{
				return "No 'To' content in perspective: '" + perspective['id'] + "'";
			}

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
		var perspective = [];

		if(this.default == null || this.default == "")
		{
			console.warn("WARNING: Default not defined and no perspectives, creating perspective with id 'default' and setting as default");
			perspective['id'] = "default";
		}
		else
		{
			console.warn("WARNING: Default defined but no perspectives defined, creating perspective with id '" + this.default + "' as default and setting as default");
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
		console.warn("WARNING: Not existing default in the Perspective content, setting as: " + this.default);	
	}

		//check for repeated ids

	for(var i = 0; i < this.perspectiveContent.length; i++)
	{
		var name_view = this.perspectiveContent[i]['id'];
		var n = 0;

		for(var j = 0; j < this.perspectiveContent.length; j++)
		{
			if(this.perspectiveContent[j]['id'] == name_view)
			{
				n++;
			}
		}

		if(n > 1)
		{
			return "Perspective repeated. ID: '" + name_view + "'";
		}
	}
};

/**
 * Function to parse the Ambient and Illumination values of the DSX file.
 * If 'illumination' tag missing returns error. If 0 or more than 1 found 
 * return error.
 * Parses the first doublesided and local values found and saves them to
 * 'doublesided' and 'local' class variables respectivly.
 * If the parsed values are 'null' (meaning not found) setting both as 0
 * Tries to get the Ambient Illumination values and to save them in 'ambientIllumination'
 * array class variable
 * If missing creates default values as R=0.2 G=0.2 B=0.2 A=1, saves in
 * ['r'], ['g'], ['b'], ['a'] respectivly and gives warning.
 * If exists saves respectivle in: ['r'], ['g'], ['b'], ['a'].	
 * Tries to get the Background values and to save them in 'background' array
 * class variable
 * If missing creates default values as	R=0 G=0 B=0 A=1, saves in 
 * ['r'], ['g'], ['b'], ['a'] respectivly and gives warning.
 * If exists saves respectivle in: ['r'], ['g'], ['b'], ['a']. 
 */
MySceneGraph.prototype.parseIllumination=function(rootElement)
{
	var elems = rootElement.getElementsByTagName('illumination');
	if(elems == null)
	{
		return "Illumination tag missing";
	}

	if(elems.length != 1)
	{
		return "Either zero or more than one 'Illumination' tag found. Only one allowed to be parsed";
	}

	this.doublesided = elems[0].getAttribute('doublesided');
	this.local = elems[0].getAttribute('local');


	if(this.doublesided == null)
	{
		console.warn("WARNING: Doublesided not found. Setting as false");
		this.doublesided = 0;
	}

	if(this.local == null)
	{
		console.warn("WARNING: Local not found. Setting as false");
		this.local = 0;
	}

	this.ambientIllumination = [];

	var ambientContent = elems[0].getElementsByTagName('ambient');
	if(ambientContent == null || ambientContent.length == 0)
	{
		console.warn("WARNING: Ambient Illumination not found, setting predefined attributes: R=0.2 G=0.2 B=0.2 A=1");
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

	if(backgroundContent == null || backgroundContent.length == 0)
	{
		console.warn("WARNING: Background color not found, setting predefined attributes: R=1 G=1 B=1 A=1");
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

/**
 * Function to parse the Lights
 * Searchs for lights tag. Returns error if not found or found more than 1
 * If there is no children of Lights (Omni or Spot lights) gives warning
 * Tries to parse lights and store them in the 'lightslist' array class variable
 * Searches for type of light. If different from Spot or Omni ignores.
 * 
 * OMNI:
 * Searches for id to save in ['id']. If missing returns error.
 * Searches for enabled to save in ['enabled']. If missing returns error.
 * Sets ['omni'] as true and ['spot'] as false.
 * Searches for location element to save in ['x'], ['y'], ['z'] and ['w'] inside
 * ['location']. If missing returns error.
 * If more than one location found. Gives warning and sets the first values found.
 * The Specular, Diffuse and Ambient parsing process is similar.
 * Searches for the corresponding tag. If any one was not found returns error
 * if more than one was found the first one of the same tag is set and gives a warning
 * If values were parsed correctly the are stored in ['r'], ['g'], ['b'] and ['a']
 * inside ['ambient'], for ambient, ['diffuse'], for diffuse and ['specular'] for specular
 * 
 * SPOT:
 * The spot parsing process is similar to the OMNI, the only difference is that searches for 
 * aditional values. Searches for angle and exponent, if any one was not found returns error
 * sets ['omni'] as false and ['spot'] as true.
 * And aditionally searches another paramether 'target'
 * with ['x'], ['y'] and ['z'] inside ['target'] if this was not found returns error. If more than
 * one found sets the first one and gives warning.
 * 
 * Finally. It starts to search if lights with the same id were parsed. If positive then returns error.
 */
MySceneGraph.prototype.parseLights=function(rootElement)
{
	var elems = rootElement.getElementsByTagName('lights');
	if(elems == null)
	{
		return "Lights tag missing";
	}

	if(elems.length != 1)
	{
		return "Either zero or more than one 'Illumination' tag found. Only one allowed to be parsed";
	}

	var nlights = elems[0].children.length;
	
	if(nlights == 0)
	{
		console.warn("WARNING: Threre is no spot or omni lights declared");
	}


	var light = elems[0].children;

	if(light.length < 1)
	{	
		console.warn("WARNING: No lights defined");
	}

	this.lightslist = [];
	var tagMissing = false;

	for(var i = 0; i < nlights; i++)
	{
		var typelight = light[i].tagName;
		var lights = [];

		if(typelight == 'omni')
		{
			lights['id'] = this.reader.getString(light[i], 'id');
			if(lights['id'] == null)
			{
				return "Missing id in Light numeber: " + i;
			}
			
			lights['enabled'] = this.reader.getBoolean(light[i], 'enabled');
			if(lights['enabled'] == null)
			{
				return "Missing enable value in Light: '" + lights['id'] + "'";
			}

			lights['omni'] = true;
			lights['spot'] = false;

			var location = [];
			var elemLocation = light[i].getElementsByTagName('location');		
			if(elemLocation.length < 1)
			{
				return "No location Paramethers for light '" + lights['id'] +  "'"; 
			}
			if(elemLocation.length > 1)
			{
				console.warn("WARNING: Light: '" + lights['id'] + "' as more than one Location Element, setting the first one encounteredo");
			}
			location.x = elemLocation[0].getAttribute('x');
			location.y = elemLocation[0].getAttribute('y');
			location.z = elemLocation[0].getAttribute('z');
			location.w = elemLocation[0].getAttribute('w');
			lights['location'] = location;

			var ambient = [];
			var elemAmbient = light[i].getElementsByTagName('ambient');
			if(elemAmbient.length < 1)
			{
				return "No Ambient Paramethers for light '" + lights['id'] +  "'"; 
			}
			if(elemAmbient.length > 1)
			{
				console.warn("WARNING: Light: '" + lights['id'] + "' as more than one Ambient Element, setting the first one encounteredo");
			}
			ambient.r = elemAmbient[0].getAttribute('r');
			ambient.g = elemAmbient[0].getAttribute('g');
			ambient.b = elemAmbient[0].getAttribute('b');
			ambient.a = elemAmbient[0].getAttribute('a');
			lights['ambient'] = ambient;

			var diffuse = [];
			var elemDiffuse = light[i].getElementsByTagName('diffuse');
			if(elemDiffuse.length < 1)
			{
				return "No Diffuse Parametheres for light '" + lights['id'] +  "'"; 
			}
			if(elemDiffuse.length > 1)
			{
				console.warn("WARNING: Light: '" + lights['id'] + "' as more than one Diffuse Element, setting the first one encounteredo");
			}
			diffuse.r = elemDiffuse[0].getAttribute('r');
			diffuse.g = elemDiffuse[0].getAttribute('g');
			diffuse.b = elemDiffuse[0].getAttribute('b');
			diffuse.a = elemDiffuse[0].getAttribute('a');
			lights['diffuse'] = diffuse;

			var specular = [];
			var elemSpecular = light[i].getElementsByTagName('specular');
			if(elemSpecular.length < 1)
			{
				return "No Specular Parametheres for light '" + lights['id'] +  "'"; 
			}
			if(elemSpecular.length > 1)
			{
				console.warn("WARNING: Light: '" + lights['id'] + "' as more than one Specular Element, setting the first one encounteredo");
			}
			specular.r = elemSpecular[0].getAttribute('r');
			specular.g = elemSpecular[0].getAttribute('g');
			specular.b = elemSpecular[0].getAttribute('b');
			specular.a = elemSpecular[0].getAttribute('a');
			lights['specular'] = specular;
			
			this.lightslist.push(lights); 
		}
		else if(typelight == 'spot')
		{
			lights.id = this.reader.getString(light[i], 'id');
			if(lights['id'] == null)
			{
				return "Missing id in Light";
			}
			lights.enabled = this.reader.getBoolean(light[i], 'enabled');
			if(lights['enabled'] == null)
			{
				return "Missing enable value in Light: '" + lights['id'] + "'";
			}
			lights.angle = this.reader.getFloat(light[i], 'angle');
			if(lights['angle'] == null)
			{
				return "Missing angle value in Light: '" + lights['id'] + "'";
			}
			lights.exponent = this.reader.getFloat(light[i], 'exponent');
			if(lights['exponent'] == null)
			{
				return "Missing exponent value in Light: '" + lights['id'] + "'";
			}
			lights.omni = false;
			lights.spot = true;

			var target = [];
			var elemTarget = light[i].getElementsByTagName('target');
			if(elemTarget.length < 1)
			{
				return "No target Paramethers for light '" + lights['id'] +  "'"; 
			}
			if(elemTarget.length > 1)
			{
				console.warn("WARNING: Light: '" + lights['id'] + "' as more than one target Element, setting the first one encounteredo");
			}
			target.x = elemTarget[0].getAttribute('x');
			target.y = elemTarget[0].getAttribute('y');
			target.z = elemTarget[0].getAttribute('z');
			lights['target'] = target;

			var location = [];
			var elemLocation = light[i].getElementsByTagName('location');
			if(elemLocation.length < 1)
			{
				return "No location Paramethers for light '" + lights['id'] +  "'"; 
			}
			if(elemLocation.length > 1)
			{
				console.warn("WARNING: Light: '" + lights['id'] + "' as more than one Location Element, setting the first one encounteredo");
			}
			location.x = elemLocation[0].getAttribute('x');
			location.y = elemLocation[0].getAttribute('y');
			location.z = elemLocation[0].getAttribute('z');
			lights['location'] = location;


			var ambient = [];
			var elemAmbient = light[i].getElementsByTagName('ambient');
			if(elemAmbient.length < 1)
			{
				return "No Ambient Paramethers for light '" + lights['id'] +  "'"; 
			}
			if(elemAmbient.length > 1)
			{
				console.warn("WARNING: Light: '" + lights['id'] + "' as more than one Ambient Element, setting the first one encounteredo");
			}
			ambient.r = elemAmbient[0].getAttribute('r');
			ambient.g = elemAmbient[0].getAttribute('g');
			ambient.b = elemAmbient[0].getAttribute('b');
			ambient.a = elemAmbient[0].getAttribute('a');
			lights['ambient'] = ambient;
			
			var diffuse = [];
			var elemDiffuse = light[i].getElementsByTagName('diffuse');
			if(elemDiffuse.length < 1)
			{
				return "No Diffuse Parametheres for light '" + lights['id'] +  "'"; 
			}
			if(elemDiffuse.length > 1)
			{
				console.warn("WARNING: Light: '" + lights['id'] + "' as more than one Diffuse Element, setting the first one encounteredo");
			}
			diffuse.r = elemDiffuse[0].getAttribute('r');
			diffuse.g = elemDiffuse[0].getAttribute('g');
			diffuse.b = elemDiffuse[0].getAttribute('b');
			diffuse.a = elemDiffuse[0].getAttribute('a');
			lights['diffuse'] = diffuse;

			var specular = [];
			var elemSpecular = light[i].getElementsByTagName('specular');
			if(elemSpecular.length < 1)
			{
				return "No Specular Parametheres for light '" + lights['id'] +  "'"; 
			}
			if(elemSpecular.length > 1)
			{
				console.warn("WARNING: Light: '" + lights['id'] + "' as more than one Specular Element, setting the first one encounteredo");
			}
			specular.r = elemSpecular[0].getAttribute('r');
			specular.g = elemSpecular[0].getAttribute('g');
			specular.b = elemSpecular[0].getAttribute('b');
			specular.a = elemSpecular[0].getAttribute('a');
			lights['specular'] = specular;

			this.lightslist.push(lights); 
		}
	}

	//Search for repeated ID's
	var numberLights = this.lightslist.length;

	for(var j = 0; j < numberLights; j++)
	{
		var id = this.lightslist[j]['id'];
		var n = 0;
		
		for(var v = 0; v < numberLights; v++)
		{
			if(id == this.lightslist[v]['id'])
			{
				n++;
			}
		}
	
		if(n > 1)
		{
			return "Repeated ID in Lights: '" + id + "' Number of Ocurrencies: '" + n + "'";
		}
		else
		{
			n = 0;
		}
	}
}

/**
 * Function to parse Textures
 * Checks if 'textures' tag is missing or is more than 1. If positive returns error.
 * Checks if there are 'texture' tags inside. If no Texture defined returns error. 
 * Must have at least one.
 * Starts to retrieve the texture and saves them in 'texturelist' array class variable:
 * 
 * 				['id']
 * 				['file']
 * 				['length_s']
 * 				['length_t']
 * 
 * Finally searches for repeated ID in texture and returns error.
 */
MySceneGraph.prototype.parseTextures = function(rootElement)
{
	elems = rootElement.getElementsByTagName('textures');

	if(elems == null)
	{
		return "Textures tag missing";
	}
	if(elems.length != 1)
	{
		return "Either zero or more than one 'Textures' tag found. Only one allowed to be parsed";
	}

	var ntextures = elems[0].children.length;

	if(ntextures < 1)
	{
		return "No Texture/s defined. Must have 1 or more";
	}

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

	for(var i = 0; i < this.texturelist.length; i++)
	{
		var text_name = this.texturelist[i]['id'];
		var n = 0;

		for(var j = 0; j < this.texturelist.length; j++)
		{
			if(text_name == this.texturelist[j]['id'])
			{
				n++;
			}
		}

		if(n > 1)
		{
			return "Texture with ID: '" + text_name + "' is repeated. Nr: " + n;
		}
	}

}
/**
 * Function to Parse Materials
 * Searches for materials tag. returns error if missing
 * Checks if number of materials is bigger than 1.
 * The materials will be parsed to the array 'materialslist' class variable
 * If no materials declared a default one will be created
 * with id 'default'. Sets r=0.1, g=0.1, b=0.1 and a=1 as ambient,
 * diffuse and specular, sets emission with r=0, g=0, b=0 and a=1,
 * and shininess as 20.
 * If materials are declared goes through all.
 * Checks for id. If missing returns error. Sets in ['id'].
 * If emission Attribute not found returns error, if more than one declared
 * gives warning and parses the first one declared.
 * Same goes for the Ambient, Diffuse, Specular and Shininess attributes
 * Saves them in: 
 * 
 * 		['emission']['r'],['emission']['b'],['emission']['g'],['emission']['a']
 * 		['ambient']['r'],['ambient']['b'],['ambient']['g'],['ambient']['a']
 * 		['diffuse']['r'],['diffuse']['b'],['diffuse']['g'],['diffuse']['a']
 * 		['specular']['r'],['specular']['b'],['specular']['g'],['specular']['a']
 * 		['shininess']
 * 
 * Finally checks if materials id are repeated and returns error
 */
MySceneGraph.prototype.parseMaterials = function(rootElement)
{
	elems = rootElement.getElementsByTagName('materials');

	if(elems == null)
	{
		return "No Materials tag found";
	}

	var nmaterials = elems[0].children.length;
	this.materialslist = [];

	if(nmaterials < 1)
	{
		console.warn("WARNING: No material found, creating 'default' material");

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
		shininessAtt.value = 20;
		materials['shininess'] = shininessAtt;
		
		this.materialslist.push(materials);
	}
	else
	{
		var material = elems[0].children;
		for(var i = 0; i < nmaterials; i++)
		{
			var id = material[i].getAttribute('id');
			var materials = [];

			materials['id'] = id;
			if(id == null)
			{
				return "Missing id in Material number: " + i;
			}

			var emissionAtt = [];
			var emission = material[i].getElementsByTagName('emission');
			if(emission.length < 1)
			{
				return "No Emission Parametheres for Material '" + id +  "'"; 
			}
			if(emission.length > 1)
			{
				console.warn("WARNING: Material '" + id + "' as more than one Emission Element, setting the first one encounteredo");
			}
			emissionAtt.r = emission[0].getAttribute('r');
			emissionAtt.g = emission[0].getAttribute('g');
			emissionAtt.b = emission[0].getAttribute('b');
			emissionAtt.a = emission[0].getAttribute('a');
			materials['emission'] = emissionAtt;

			ambientAtt = [];
			var ambient = material[i].getElementsByTagName('ambient');
			if(ambient.length < 1)
			{
				return "No Ambient Parametheres for Material '" + id +  "'"; 
			}
			if(ambient.length > 1)
			{
				console.warn("WARNING: Material '" + id + "' as more than one Ambient Element, setting the first one encounteredo");
			}
			ambientAtt.r = ambient[0].getAttribute('r');
			ambientAtt.g = ambient[0].getAttribute('g');
			ambientAtt.b = ambient[0].getAttribute('b');
			ambientAtt.a = ambient[0].getAttribute('a');
			materials['ambient'] = ambientAtt;

			diffuseAtt = [];
			var diffuse = material[i].getElementsByTagName('diffuse');
			if(diffuse.length < 1)
			{
				return "No Diffuse Parametheres for Material '" + id +  "'"; 
			}
			if(diffuse.length > 1)
			{
				console.warn("WARNING: Material '" + id + "' as more than one Diffuse Element, setting the first one encounteredo");
			}
			diffuseAtt.r = diffuse[0].getAttribute('r');
			diffuseAtt.g = diffuse[0].getAttribute('g');
			diffuseAtt.b = diffuse[0].getAttribute('b');
			diffuseAtt.a = diffuse[0].getAttribute('a');
			materials['diffuse'] = diffuseAtt;

			specularAtt = [];
			var specular = material[i].getElementsByTagName('specular');
			if(specular.length < 1)
			{
				return "No Specular Parametheres for Material '" + id +  "'"; 
			}
			if(specular.length > 1)
			{
				console.warn("WARNING: Material '" + id + "' as more than one Specular Element, setting the first one encounteredo");
			}
			specularAtt.r = specular[0].getAttribute('r');
			specularAtt.g = specular[0].getAttribute('g');
			specularAtt.b = specular[0].getAttribute('b');
			specularAtt.a = specular[0].getAttribute('a');
			materials['specular'] = specularAtt;

			shininessAtt = [];
			var shininess = material[i].getElementsByTagName('shininess');
			if(shininess.length < 1)
			{
				return "No Shininess Parametheres for Material '" + id +  "'"; 
			}
			if(shininess.length > 1)
			{
				console.warn("WARNING: Material '" + id + "' as more than one Shininess Element, setting the first one encounteredo");
			}
			shininessAtt.value = shininess[0].getAttribute('value');

			materials['shininess'] = shininessAtt;
			this.materialslist.push(materials);
		}
	}

	//CHECKING FOR REPEATED ID's
	var n_materials = this.materialslist.length;

	for(var j = 0; j < n_materials; j++)
	{
		var id = this.materialslist[j]['id'];
		var n = 0;
		
		for(var v = 0; v < n_materials; v++)
		{
			if(id == this.materialslist[v]['id'])
			{
				n++;
			}
		}
	
		if(n > 1)
		{
			return "Repeated ID in Material: " + id + " Number of Ocurrencies: " + n;
		}
		else
		{
			n = 0;
		}
	}
}

/**
 * Function to parse Transformations
 * Checks if 'transformations' tag exists. Returns error if 0 or more than 1.
 * All transformations will be stored in 'transformationlist' array class variable
 * If number of transformations is 0 a default transformation is created and gives warning.
 * with id 'default', translation (0,0,0), scale (1,1,1), rotation (x,0).
 * If more than 0 transformations defined, they are all parsed to the array.
 * A transformation can have has much operations as desired. If 0 then the Identity will later be
 * loaded in the Scene.
 * If there are more than 0 operations they are all selected through type: translate, scale, rotate
 * and stored respectivly:
 * 
 * 		['type'] = 'translate', ['x'], ['y'], ['z']
 * 		['type'] = 'scale', ['x'],['y'],['z']
 * 		['type'] = 'rotate', ['axis'], ['angle']
 * 
 * Finally the checks if ID's are repeated and returns error if positive.
 */
MySceneGraph.prototype.parseTransformations = function(rootElement)
{
    var elems = rootElement.getElementsByTagName('transformations');
	
	if(elems == null)
	{
		return "Transformation tag missing";
	}
	if(elems.length != 1)
	{
		return "Either zero or more than one 'Transformation' tag found.";
	}

    var elems = rootElement.getElementsByTagName('transformations');
    var ntransformations = elems[0].children.length;
    var transformations = elems[0].children;
	this.transformationlist = [];

	if(ntransformations > 1)
	{
		for (var i = 0; i < ntransformations; i++)
		{
			var transformation = [];
			transformation['id'] = transformations[i].getAttribute('id');
			if(transformation['id'] == null)
			{
				return "Missing ID in Transformation number: " + i + ""; 
			}

			var operations = transformations[i].children;
			var noperations = transformations[i].children.length;
			if(noperations < 1)
			{
				console.warn("WARNING: No Transformation elements found in Transformation: '" + transformation['id'] + "'")
			}
			var transformationsList = [];

			for(var j = 0; j < noperations; j++)
			{
				var operation = operations[j].tagName;
				var transformationInfo = [];
				if(operation == 'translate')
				{
					transformationInfo['type'] = 'translate';
					transformationInfo['x'] = operations[j].getAttribute('x');
					transformationInfo['y'] = operations[j].getAttribute('y');
					transformationInfo['z'] = operations[j].getAttribute('z');
				}
				else if(operation == 'scale')
				{
					transformationInfo['type'] = 'scale';
					transformationInfo['x'] = operations[j].getAttribute('x');
					transformationInfo['y'] = operations[j].getAttribute('y');
					transformationInfo['z'] = operations[j].getAttribute('z');
				}
				else if(operation == 'rotate')
				{
					transformationInfo['type'] = 'rotate';
					transformationInfo['axis'] = operations[j].getAttribute('axis');
					transformationInfo['angle'] = operations[j].getAttribute('angle');
				}
				transformationsList.push(transformationInfo);
			}
			transformation['list'] = transformationsList;
			this.transformationlist.push(transformation);
		}
	}
	else
	{
		console.warn("WARNING: No transformations defined. Creating transformation 'default' with Identity Transformation");

		var transformation = [];
		transformation['id'] = "default";

		var transformationsList = [];

		var transformationInfoT = [];
		transformationInfoT['type'] = 'translate';
		transformationInfoT['x'] = 0;
		transformationInfoT['y'] = 0;
		transformationInfoT['z'] = 0;
		transformationsList.push(transformationInfoT);

		var transformationInfoS = [];
		transformationInfoS['type'] = 'scale';
		transformationInfoS['x'] = 1;
		transformationInfoS['y'] = 1;
		transformationInfoS['z'] = 1;
		transformationsList.push(transformationInfoS);

		var transformationInfoR = [];
		transformationInfoR['type'] = 'rotate';
		transformationInfoR['axis'] = 'x';
		transformationInfoR['angle'] = 0;
		transformationsList.push(transformationInfoR);

		transformation['list'] = transformationsList;
		this.transformationlist.push(transformation);
	}

	var n_transformations = this.transformationlist.length;
	
	for(var i = 0; i < n_transformations; i++)
	{
		var t_name = this.transformationlist[i]['id'];
		var n = 0;

		for(var j = 0; j < n_transformations; j++)
		{
			if(t_name == this.transformationlist[j]['id'])
			{
				n++;
			}
		}
		if(n > 1)
		{
			return "Transformation: '" + t_name + "' Repeated. ID's must not be repeated. Times repeated: " + n;
		}
	}
}

/**
 * Function to parse the primitives.
 * Checks for 'primitives' tag, if 0 or more than 1 found returns error.
 * If no primitives declared returns error. At least one must be defined.
 * Primitives are stored in 'primitiveslist' array class variable.
 * For each primitve:
 * Checks if 'id' exists, if missing returs error, saves in ['id']
 * Checks if primitive 'type' exists, if missing returns error, saves in ['type']
 * acording to type, it will be parsed differently for all different primitives:
 * 		
 * 		['id'], ['type'] = 'rectangle', ['x1'], ['y1'], ['x2'], ['y2']
 * 		['id'], ['type'] = 'triangle', ['x1'], ['y1'], ['z1'], ['x2'], ['y2'], ['z2'], ['x3'], ['y3'], ['z3']
 * 		['id'], ['type'] = 'cylinder', ['base'], ['top'], ['height'], ['slices'], ['stacks']
 * 		['id'], ['type'] = 'sphere', ['radius'], ['slices'], ['stacks']
 * 		['id'], ['type'] = 'torus', ['inner'], ['outer'], ['slices'], ['loops']
 * 
 * Finally checks for repeated ID's and retursn error if positive
 */
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

    var primitive = elems[0].children;
	this.primitiveslist = [];
	

	if(nprimitives < 1)
	{
		return "Must exist at least one primitive";
	}
	else
	{
		for (var i = 0; i < nprimitives; i++)
		{
			var primtype = primitive[i].children[0].tagName;
			var primitiveitem = [];

			var id = primitive[i].getAttribute('id');
			if(id == null)
			{
				return "Missing ID in transformation number: " + i ;
			}

			if(primtype == null)
			{
				return "Primitive: '" + id + "' has no valid Primitive Type";
			}

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
			this.primitiveslist.push(primitiveitem);
		};
	}

	var n_primitives = this.primitiveslist.length;

	for(var j = 0; j < n_primitives; j++)
	{
		var id = this.primitiveslist[j]['id'];
		var n = 0;
		
		for(var v = 0; v < n_primitives; v++)
		{
			if(id == this.primitiveslist[v]['id'])
			{
				n++;
			}
		}
	
		if(n > 1)
		{
			return "Repeated ID in Transformation: '" + id + "' Number of Ocurrencies: '" + n +"'";
		}
		else
		{
			n = 0;
		}
	}
};

/**
 * Function to parse the Components
 * Checks if 'components' tag exists. Returns error if 0 or more than 1
 * If 0 components declared. Returns error. at least one must be declared.
 * Components will be stored in 'componentslist' array class variable.
 * Parses id of component. If missing returns error. Stores in ['id'] 
 * 
 * TRANSFORMATIONS:
 * Checks if 'transformation' tag exists, returns error if missing.
 * For each transformation checks if is 'transformationref'. If true stores 
 * in ['transformation']['type'] as 'transformationref'. Parses the id of
 * that Reference and stores in ['transformation']['id']
 * if different from 'transformationref' searches for 'translate', 'scale' or 'rotate'
 * if any of this is given it will store in ['transformation']['type'] and:
 * For translate:
 * 						['transformation']['type'] = 'translate'
 *						['transformation']['x']
 *						['transformation']['y']
 *						['transformation']['z']
 *
 * For scale: 
 * 						['transformation']['type'] = 'scale'
 *						['transformation']['x']
 *						['transformation']['y']
 *						['transformation']['z']
 * 	
 * For rotate:
 * 						['transformation']['type'] = 'rotate'
 *						['transformation']['axis']
 *						['transformation']['angle']
 *
 * If the component being parsed is the Root it is set as Identity transformation.
 * Checks if the Transformations are valid calling checkIfTransformationValid(id, transformations)
 * if valid continues, returns error otherwise.
 * 
 * MATERIALS:
 * Checks if 'materials' tag exist if false, returns error
 * Checks if components as at least one material defined
 * Parses all materials id's and stores in ['materials']
 * Checks if materials are valid with checkifMaterialValid(id, materialslist),
 * proceeds if true and returns if false
 * 
 * TEXTURES:
 * Checks if 'textures' tag exists. returns error if missing.
 * Checks if there is exactly one texture defined. 0 or more than 1 returns error.
 * stores in ['texture'] component, if id of texture is null returns error.
 * Checks if Texture is valid checkifTextureValid(id, texture)
 * 
 * CHILDREN:
 * Checks if 'children' tag exists, returns error if missing
 * Creates a primitives list and a children list. Everything that is a 'primitiveref' goes to
 * the primitives list and everything that is 'componentref' goes to the children list
 * If at least one primite or children not defined returns error
 * Checks if the primitives list is valid with checkifPrimitesValid(id, primitives)
 * If not valid returns error.
 * 
 * Finally checks if the graph is valid, if not returns error.
 */
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

    if(ncomponents < 1)
    {
		return "There must be at least one Node defined";
    }
    else
    {
		for(var i = 0; i < ncomponents; i++)
		{
			var idComponent = component[i].getAttribute('id');
			if(idComponent == null)
			{
				return "Component number: " + i + " has no ID"; 
			}

			
			var componentelem = [];
			componentelem['id'] = idComponent;

			//Transformations
			var transformationsTag = component[i].getElementsByTagName('transformation');

			if(transformationsTag.length < 1)
			{
				return "Transformation tag missing in component: '" + idComponent + "'";
			}

			var ntranformation = transformationsTag[0].children.length;
			var transformations = transformationsTag[0].children;

			if(transformations.length < 1)
			{
				return "Transformation missing in component: '" + idComponent + "'";
			}
			var componenttranslist = [];


			for(var j = 0; j < ntranformation; j++)
			{
				var tag_name = transformations[j].tagName;
				var transformation = [];

				if(tag_name == 'transformationref')
				{
					transformation['type'] = 'transformationref';

					var id = transformations[j].getAttribute('id');
					transformation['id'] = id;
				}
				else
				{
					if(tag_name == 'translate')
					{
						var x = transformations[j].getAttribute('x');
						var y = transformations[j].getAttribute('y');
						var z = transformations[j].getAttribute('z');

						transformation['type'] = 'translate';
						transformation['x'] = x;
						transformation['y'] = y;
						transformation['z'] = z;

					}
					else if(tag_name == 'scale')
					{
						var x = transformations[j].getAttribute('x');
						var y = transformations[j].getAttribute('y');
						var z = transformations[j].getAttribute('z');

						transformation['type'] = 'scale';
						transformation['x'] = x;
						transformation['y'] = y;
						transformation['z'] = z;
					}
					else if(tag_name == 'rotate')
					{
						var axis = transformations[j].getAttribute('axis');
						var angle = transformations[j].getAttribute('angle');

						transformation['type'] = 'rotate';
						transformation['axis'] = axis;
						transformation['angle'] = angle;
					}
				}
				componenttranslist.push(transformation);
			}

			componentelem['transformations'] = componenttranslist;


			if(idComponent == this.root && componentelem['transformations'].length < 1)
			{
				console.warn("Root as no Transformation. Setting Identity");

				var transformationInfoT = [];
				transformationInfoT['type'] = 'translate';
				transformationInfoT['x'] = 0;
				transformationInfoT['y'] = 0;
				transformationInfoT['z'] = 0;
				componenttranslist.push(transformationInfoT);

				var transformationInfoS = [];
				transformationInfoS['type'] = 'scale';
				transformationInfoS['x'] = 1;
				transformationInfoS['y'] = 1;
				transformationInfoS['z'] = 1;
				componenttranslist.push(transformationInfoS);

				var transformationInfoR = [];
				transformationInfoR['type'] = 'rotate';
				transformationInfoR['axis'] = 'x';
				transformationInfoR['angle'] = 0;
				componenttranslist.push(transformationInfoR);
			}

			var error = this.checkIfTransformationValid(idComponent, componentelem['transformations']);
			if(error != null)
			{
				return error;
			}


			//Materials - no problem if id repeated, just goes through it as a list of elems to display
			var materials = component[i].getElementsByTagName('materials');
			
			if(materials.length < 1)
			{
				return "Component: '" + componentelem['id'] + "' has no material tag";
			}

			var nmaterials = materials[0].children.length;
			var material = materials[0].children;
			var materialslst = [];


			if(nmaterials < 1)
			{
				return "Component: '" + componentelem['id'] + "' must have at least one material reference, inherit or none";
			}

			for(var j = 0; j < nmaterials; j++)
			{
				var id = material[j].getAttribute('id');
				materialslst.push(id);
			}

			componentelem['materials'] = materialslst;
			var materialisValid = this.checkifMaterialValid(componentelem['id'], materialslst);				

			if(materialisValid != null)
			{
				return materialisValid;
			}

			//Textures
			var textures = component[i].getElementsByTagName('texture');

			if (textures == null  || textures.length==0) 
			{
				return "Textures element is missing: '" + componentelem['id'] + "'";
			}
			var ntextures = textures.length;


			if(ntextures < 1)
			{
				return "Must have a texture reference, inherit or none. Component ID: '" + componentelem['id'] + "'";
			}

			if(ntextures > 1)
			{
				return "Can only have one Texture references. Component ID: '" + componentelem['id'] + "'";
			}

			var id = textures[0].getAttribute('id');

			componentelem['texture'] = id;

			if(componentelem['texture'] == null)
			{
				return "Texture reference missing in component: '" + componentelem['id'] + "'";
			}

			var resultCheckTexture = this.checkifTextureValid(componentelem['id'], componentelem['texture']);
			if(resultCheckTexture != null)
			{
				return resultCheckTexture;
			}

			//Children
			var children = component[i].getElementsByTagName('children');
			if (children == null  || children.length==0) 
			{
				return "Children tag is missing: '" + componentelem['id'] + "'";
			}

			var nchildren = children[0].children.length;
			var kids = children[0].children;
			var primitiveslst = [];
			var childrenlst = [];

			componentelem['children'] = [];
			componentelem['primitives'] = [];

			for(var j = 0; j < nchildren; j++)
			{
				var tag_name = kids[j].tagName;

				if(tag_name === 'componentref')
				{
					id = kids[j].getAttribute('id');
					childrenlst.push(id);
				}
				else if(tag_name === 'primitiveref')
				{
					id = kids[j].getAttribute('id');
					primitiveslst.push(id);
				}
				else
				{
					console.log("The references must be: compoenetref or primitiveref in component: '" + componentelem['id'] + "'" );
				}
			}

			componentelem['primitives'] = primitiveslst;
			componentelem['children'] = childrenlst;

			var n_refs = primitiveslst.length + childrenlst.length;

			if(n_refs < 1)
			{
				return "Must have at least one Children or/and at least on Primitives reference/s. Component: '" + componentelem['id'] + "'"
			}

			if(primitiveslst.length > 0)
			{
				var primitiveCheckValid = this.checkifPrimitesValid(componentelem['id'], primitiveslst);
				if(primitiveCheckValid != null)
				{
				    return primitiveCheckValid;
				}
			}
			this.componentslist.push(componentelem);
   		 }
	}

	var error = this.checkIfValidComponents()
	if(error != null)
	{
		this.onXMLError(error);
		return;
	}

};

/**
 * VALIDATION OF COMPONETS FIELD
 */

/**
 * Function to validate the material references of a Node
 * If Root as a "inherit" reference returns error
 * Checks if all of the materials references exist in the list of Materials
 */
MySceneGraph.prototype.checkifMaterialValid = function(id, materialslist)
{
	var inheritcount = 0;	
	var othercount = 0;	

	for(var v = 0; v < materialslist.length; v++)
	{
		if(materialslist[v] == "inherit")
		{
			inheritcount++;
		}
		else
		{
			othercount++;
		}
	}

	if(inheritcount > 0 && id == this.root)
	{
		return "Cannot define: inherit as Material for root: " + id;
	}

	for(var i = 0; i < materialslist.length; i++)
	{
		var m_name = materialslist[i];
		var n = 0;
	
		if(m_name != "inherit")
		{
			for(var j = 0; j < this.materialslist.length; j++)
			{	

				if(m_name == this.materialslist[j]['id'])
				{
					n++;
					break;
				}	
			}

			if(n < 1)
			{
				return "Invalid reference to material: '" + m_name + "' in component: '" + id + "'";
			}
		}
	}

		
};
/**
 * Function to test the texture of a Node
 * If root has "texture" inherit returns error
 * Checks if the texture exists in the textures list
 * "none" or "inherit" are ignored. They are valid and do not exist
 * in the textures list
 */
MySceneGraph.prototype.checkifTextureValid = function(id, texture)
{
	if((texture == "inherit") && id == this.root)
	{
		return "Cannot define texture 'inherit' for root: " + id;
	}

	if(texture == "inherit" ||  texture == "none")
	{
		return;
	}
	
	var n = 0;
	for(var i = 0; i < this.texturelist.length; i++)
	{
		if(this.texturelist[i]['id'] == texture)
		{
			n++;
			break;
		}
	}

	if(n < 1)
	{
		return "Invalid Texture reference: '" + texture + "' for component: '" + id + "'";
	}
	
};

/**
 * Function to check if the Primitives are valid for a Node
 * Checks if the Primitives reference exist in the Primitives list
 */
MySceneGraph.prototype.checkifPrimitesValid=function(id, primitiveslst)
{
	var n_prims = primitiveslst.length;
	var n = 0;

	for(var i = 0; i < n_prims; i++)
	{
		for(var j = 0; j < this.primitiveslist.length; j++)
		{
			if(primitiveslst[i] == this.primitiveslist[j]['id'])
			{
				n++;
				break;
			}
		}
		if(n < 1)
		{
			return "Primitive Reference: '" + primitiveslst[i] + "' not Valid in component: '" + id + "'";  
		}
		else
		{
			n=0;
		}
	}
		
};

/**
 * Function to check if the Transformations are valid for a Node
 * If a Transformation has more than one Transformation error returns error
 * If a Transformation reference and implicit transformations exist in the same node returns error
 * If only has one transformation reference checks if exists in the transformations list
 */
MySceneGraph.prototype.checkIfTransformationValid=function(idComponent, transformations)
{
	var countref = 0;
	var noref = 0;
	
	for(var i = 0; i < transformations.length; i++)
	{
		if(transformations[i]['type'] == 'transformationref')
		{
			countref++;
		}
		else
		{
			noref++;
		}
	}

	
	if(countref > 1)
	{
		return "Component: '" + idComponent + "' has more than one reference to a transformation. Transformation References must be defined only one time per component";
	}

	if(countref == 1 && noref > 0)
	{
		return "Cannot mix Transformation Reference with explicit Transformations. Component: '" + idComponent + "'";
	}
	
	if(countref == 1 && noref == 0)
	{
		var n = 0;
		for(var j = 0; j < this.transformationlist.length; j++)
		{
			if(transformations[0]['id'] == this.transformationlist[j]['id'])
			{
				n++;
				break;
			}
		}

		if(n < 1)
		{
			return "Undifined reference transformation reference in component: '" + idComponent + "' Reference: '" + transformations[0]['id'] + "'";
		}
	}
};

/**
 * Function to check if the Components are valid
 * Goes through all the Graph and checks if the components reference of each node 
 * exist in the final Components list
 */
MySceneGraph.prototype.checkIfValidComponents=function()
{
	for(var i = 0; i < this.componentslist.length; i++)
	{
		var nodeName = this.componentslist[i]['id'];
		var nodeChildren = this.componentslist[i].children;

		if(nodeChildren.length > 0)
		{
			var valid = this.checknoderefs(nodeName, nodeChildren);
			if(valid != null)
			{
				return valid;
			}
		}
	}
};

/**
 * CHECK if component refrences are non-existing and if children calls itself
 */
MySceneGraph.prototype.checknoderefs=function(nodeName, nodeChildren)
{
	for(var i = 0; i < nodeChildren.length; i++)
	{
		var childname = nodeChildren[i];
		var n=0;

		if(childname == nodeName)
		{
			return "Component '" + nodeName + "' is referencing itself. INFINITE LOOP";
		}

		for(var j=0; j < this.componentslist.length; j++)
		{
			if(childname == this.componentslist[j]['id'])
			{
				n++;
				break;
			}
		}

		if(n < 1)
		{
			return "Reference: '"  + childname + "' in '" + nodeName + "'  is not defined as a component";
		}
	}
};

	
/**
 * Callback to be executed on any read error
 */
 
MySceneGraph.prototype.onXMLError=function (message) 
{
	console.error("XML Loading Error: " + message);	
	this.loadedOk=false;
};


