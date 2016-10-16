
function MySceneGraph(filename, scene) {
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

function floatErrorChecker(value){
	var checked = parseFloat(value);
	return checked;
}

/*
 * Callback to be executed after successful reading
 */
MySceneGraph.prototype.onXMLReady=function() 
{
	console.log("XML Loading finished.");
	var rootElement = this.reader.xmlDoc.documentElement;
	
	// Here should go the calls for different functions to parse the various blocks
	var error = this.parseSceneRoot(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}

	var error = this.parseViews(rootElement);
	if(error != null){
		this.onXMLError(error);
		return;
	}
	var error =  this.parseIllumination(rootElement);

	if(error != null){
		this.onXMLError(error);
		return;
	}	
	
	var error = this.parseLights(rootElement);
	if(error != null){
		this.onXMLError(error);
		return;
	}
	var error =  this.parseTextures(rootElement);

	if(error != null){
		this.onXMLError(error);
		return;
	}

	var error = this.parseMaterials(rootElement);
	if(error != null){
		this.onXMLError(error);
		return;
	}

	var error = this.parseTransformations(rootElement);
	if(error != null){
		this.onXMLError(error);
		return;
	}

	var error = this.parsePrimitives(rootElement);
	if(error != null){
		this.onXMLError(error);
		return;
	}

	var error = this.parseComponents(rootElement);
	if(error != null){
		this.onXMLError(error);
		return;
	}

	this.loadedOk=true;
	
	//As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
	this.scene.onGraphLoaded();
};

/*
 * Example of method that parses elements of one block and stores information in a specific data structure
 */
MySceneGraph.prototype.parseSceneRoot = function(rootElement) {
	
	var elems = rootElement.getElementsByTagName('scene');
	if(elems == null)
	{
		return "Scene Root missing";
	}

	if(elems.length != 1)
	{
		return "Either zero or more than one 'scene root' element found.";
	}

	this.root = elems[0].getAttribute('root');
	this.axis_length = elems[0].getAttribute('axis_length');
	console.log("Scene root: " + this.root +  "; axis_length: " + this.axis_length);
   
};

MySceneGraph.prototype.parseViews = function(rootElement)
{
	var elems = rootElement.getElementsByTagName('views');
	if(elems == null){
		return "Views element missing";
	}
	if(elems.length != 1){
		return "Either zero or more than one 'views' element found.";
	}

	this.default = elems[0].getAttribute('default');
	console.log("View default value= " + this.default);

	var nperspectives = elems[0].children.length;
	var perspectives = elems[0].children;
	if(perspectives == null || perspectives == 0){
		return "perspective element missing";
	}

	this.perspectiveContent = [];
	for(var i = 0; i < nperspectives; i++){
		var perspective = [];
		perspective['id'] = perspectives[i].getAttribute('id');
		perspective['near'] = perspectives[i].getAttribute('near');
		perspective['far'] = perspectives[i].getAttribute('far');
		perspective['angle'] = perspectives[i].getAttribute('angle');
		console.log("Perspective attributes: id=" + perspective['id'] + "; 'near'=" + perspective['near'] + "; 'far'=" + perspective['far'] + "; 'angle'=" + perspective['angle']);

		var elemFrom = perspectives[i].getElementsByTagName('from');
		var from = [];
		from['x'] = elemFrom[0].getAttribute('x');
		from['y'] = elemFrom[0].getAttribute('y');
		from['z'] = elemFrom[0].getAttribute('z');

		perspective['from'] = from;
		console.log("From: " + " x= " + from['x']+ " y= " + from['y']+ " z= " + from['z']);

		var elemTo = perspectives[i].getElementsByTagName('to');
		var to = [];
		to['x'] = elemTo[0].getAttribute('x');
		to['y'] = elemTo[0].getAttribute('y');
		to['z'] = elemTo[0].getAttribute('z');

		perspective['to'] = to;
		console.log("To: " + " x= " + to['x']+ " y= " + to['y']+ " z= " + to['z']);
		
		this.perspectiveContent.push(perspective);
	}

}

MySceneGraph.prototype.parseIllumination=function(rootElement)
{
	var elems = rootElement.getElementsByTagName('illumination');
	if(elems == null){
		return "Illumination element missing";
	}

	if(elems.length != 1){
		return "Either zero or more than one 'Illumination' element found.";
	}

	this.doublesided = elems[0].getAttribute('doublesided');
	this.local = elems[0].getAttribute('local');
	console.log("Doublesided value is " + this.doublesided + " and Local value is " + this.local);

	this.ambientIllumination = [];
	var ambientContent = elems[0].getElementsByTagName('ambient');
	if(ambientContent == null || ambientContent == 0){
		return "ambient element missing";
	}

	this.ambientIllumination['r'] = ambientContent[0].getAttribute('r');
	this.ambientIllumination['g'] = ambientContent[0].getAttribute('g');
	this.ambientIllumination['b'] = ambientContent[0].getAttribute('b');
	this.ambientIllumination['a'] = ambientContent[0].getAttribute('a');

	console.log("Ambient RED: " + this.ambientIllumination['r'] + "; GREEN: " + this.ambientIllumination['g'] + "; BLUE: " + this.ambientIllumination['b'] + "; A: " + this.ambientIllumination['a']);

	this.background = [];
	var backgroundContent = elems[0].getElementsByTagName('background');
	if(backgroundContent == null || backgroundContent == 0){
		return "background element missing";
	}
	this.background['r'] = backgroundContent[0].getAttribute('r');
	this.background['g'] = backgroundContent[0].getAttribute('g');
	this.background['b'] = backgroundContent[0].getAttribute('b');
	this.background['a'] = backgroundContent[0].getAttribute('a');

	console.log("Background RED: " + this.background['r'] + "; GREEN: " + this.background['g'] + "; BLUE: " + this.background['b'] + "; A: " + this.background['a']);
	
}

MySceneGraph.prototype.parseLights=function(rootElement)
{
	var elems = rootElement.getElementsByTagName('lights');
	if(elems == null){
		return "Lights element missing";
	}

	if(elems.length != 1)
	{
		return "Either zero or more than one 'Illumination' element found.";
	}

	var nlights = elems[0].children.length;
	console.log("Number of lights in the scene: " + nlights);
	//var typelights = elems[0].children[2].tagName;
	var light = elems[0].children;
	this.lightslist = [];
	var tagMissing = false;

	for(var i = 0; i < nlights; i++){
		var typelight = light[i].tagName;
		var lights = [];

		//console.log("Type of lights in the scene: " + typelights);
		if(typelight == 'omni'){
			lights['id'] = this.reader.getFloat(light[i], 'id');
			lights.enabled = this.reader.getBoolean(light[i], 'enabled');
			lights.omni = true;
			lights.spot = false;
			console.log("Lights 'omni' attributes: 'id'=" + lights.id + "; 'enabled'=" + lights.enabled);
			//light location
			var location = [];
			var elemLocation = light[i].getElementsByTagName('location');
			location.x = elemLocation[0].getAttribute('x');
			location.y = elemLocation[0].getAttribute('y');
			location.z = elemLocation[0].getAttribute('z');
			location.w = elemLocation[0].getAttribute('w');
			lights['location'] = location;
			console.log("Omni lights location X: " + location.x + "; Y: " + location.y + "; Z: " + location.z + "; W: " + location.w);

			var ambient = [];
			var elemAmbient = light[i].getElementsByTagName('ambient');
			ambient.r = elemAmbient[0].getAttribute('r');
			ambient.g = elemAmbient[0].getAttribute('g');
			ambient.b = elemAmbient[0].getAttribute('b');
			ambient.a = elemAmbient[0].getAttribute('a');
			lights['ambient'] = ambient;
			console.log("Omni lights ambient RED: " + ambient.r + "; GREEN: " + ambient.g + "; BLUE: " + ambient.b + "; Alpha: " + ambient.a);

			diffuse = [];
			var elemDiffuse = light[i].getElementsByTagName('diffuse');
			diffuse.r = elemDiffuse[0].getAttribute('r');
			diffuse.g = elemDiffuse[0].getAttribute('g');
			diffuse.b = elemDiffuse[0].getAttribute('b');
			diffuse.a = elemDiffuse[0].getAttribute('a');
			lights['diffuse'] = diffuse;
			console.log("Omni lights diffuse RED: " + diffuse.r + "; GREEN: " + diffuse.g + "; BLUE: " + diffuse.b + "; Alpha: " + diffuse.a);

			specular = [];
			var elemSpecular = light[i].getElementsByTagName('specular');
			specular.r = elemSpecular[0].getAttribute('r');
			specular.g = elemSpecular[0].getAttribute('g');
			specular.b = elemSpecular[0].getAttribute('b');
			specular.a = elemSpecular[0].getAttribute('a');
			lights['specular'] = specular;
			console.log("Omni lights specular RED: " + specular.r + "; GREEN: " + specular.g + "; BLUE: " + specular.b + "; Alpha: " + specular.a);
			//omni lights elements saves in lightslist
			this.lightslist.push(lights); 
			console.log(this.lightslist);


		}else if(typelight == 'spot'){
			lights.id = this.reader.getFloat(light[i], 'id');
			lights.enabled = this.reader.getBoolean(light[i], 'enabled');
			lights.angle = this.reader.getFloat(light[i], 'angle');
			lights.exponent = this.reader.getFloat(light[i], 'exponent');
			lights.omni = false;
			lights.spot = true;
			console.log("Lights 'spot' attributes: 'id'=" + lights.id + "; 'enabled'=" + lights.enabled + "; 'angle'=" + lights.angle + "; 'exponent'=" + lights.exponent);

			//light target
			target = [];
			var elemTarget = light[i].getElementsByTagName('target');
			target.x = elemTarget[0].getAttribute('x');
			target.y = elemTarget[0].getAttribute('y');
			target.z = elemTarget[0].getAttribute('z');
			lights['target'] = target;
			console.log("Spot lights target X: " + target.x + "; Y: " + target.y + "; Z: " + target.z);

			//light location
			location = [];
			var elemLocation = light[i].getElementsByTagName('location');
			location.x = elemLocation[0].getAttribute('x');
			location.y = elemLocation[0].getAttribute('y');
			location.z = elemLocation[0].getAttribute('z');
			lights['location'] = location;
			console.log("Spot lights location X: " + location.x + "; Y: " + location.y + "; Z: " + location.z);

			this.ambient = [];
			var elemAmbient = light[i].getElementsByTagName('ambient');
			ambient.r = elemAmbient[0].getAttribute('r');
			ambient.g = elemAmbient[0].getAttribute('g');
			ambient.b = elemAmbient[0].getAttribute('b');
			ambient.a = elemAmbient[0].getAttribute('a');
			lights['ambient'] = ambient;
			console.log("Spot lights ambient RED: " + ambient.r + "; GREEN: " + ambient.g + "; BLUE: " + ambient.b + "; Alpha: " + ambient.a);

			diffuse = [];
			var elemDiffuse = light[i].getElementsByTagName('diffuse');
			diffuse.r = elemDiffuse[0].getAttribute('r');
			diffuse.g = elemDiffuse[0].getAttribute('g');
			diffuse.b = elemDiffuse[0].getAttribute('b');
			diffuse.a = elemDiffuse[0].getAttribute('a');
			lights['diffuse'] = diffuse;
			console.log("Spot lights diffuse RED: " + diffuse.r + "; GREEN: " + diffuse.g + "; BLUE: " + diffuse.b + "; Alpha: " + diffuse.a);

			specular = [];
			var elemSpecular = light[i].getElementsByTagName('specular');
			specular.r = elemSpecular[0].getAttribute('r');
			specular.g = elemSpecular[0].getAttribute('g');
			specular.b = elemSpecular[0].getAttribute('b');
			specular.a = elemSpecular[0].getAttribute('a');
			lights['specular'] = specular;
			console.log("Spot lights specular RED: " + specular.r + "; GREEN: " + specular.g + "; BLUE: " + specular.b + "; Alpha: " + specular.a);
			//spot lights elements saves in lightslist
			this.lightslist.push(lights); 
			console.log(this.lightslist);
		}else{
			tagMissing = true;
			break;
		}
	}
	if(tagMissing){
		console.log("Missing 'omni' and 'spot' type of lights. Change tag name please.");
	}
	
}

MySceneGraph.prototype.parseTextures = function(rootElement){
	elems = rootElement.getElementsByTagName('textures');

	if(elems == null){
		return "Textures element missing";
	}
	if(elems.length != 1){
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

MySceneGraph.prototype.parseMaterials = function(rootElement){
	elems = rootElement.getElementsByTagName('materials');

	if(elems == null){
		return "materials element missing";
	}
	
	var nmaterials = elems[0].children.length;
	console.log("num. of materials: " + nmaterials);
	var material = elems[0].children;
	this.materialslist = [];

	for(var i = 0; i < nmaterials; i++)
	{
		var id = material[i].getAttribute('id');
		console.log("Material id: " + this.id);
		materials = [];
		
		materials['id'] = id;

		emissionAtt = [];
		var emission = material[i].getElementsByTagName('emission');
		emissionAtt.r = emission[0].getAttribute('r');
		emissionAtt.g = emission[0].getAttribute('g');
		emissionAtt.b = emission[0].getAttribute('b');
		emissionAtt.a = emission[0].getAttribute('a');
		console.log("Emission: r = " + emissionAtt.r+ " g = " + emissionAtt.g  +  " b = " + emissionAtt.b + " a = " +  emissionAtt.a);
		materials['emission'] = emissionAtt;

		ambientAtt = [];
		var ambient = material[i].getElementsByTagName('ambient');
		ambientAtt.r = ambient[0].getAttribute('r');
		ambientAtt.g = ambient[0].getAttribute('g');
		ambientAtt.b = ambient[0].getAttribute('b');
		ambientAtt.a = ambient[0].getAttribute('a');
		console.log("Ambient: r = " + ambientAtt.r+ " g = " + ambientAtt.g  +  " b = " + ambientAtt.b + " a = " +  ambientAtt.a);
		materials['ambient'] = ambientAtt;

		diffuseAtt = [];
		var diffuse = material[i].getElementsByTagName('diffuse');
		diffuseAtt.r = diffuse[0].getAttribute('r');
		diffuseAtt.g = diffuse[0].getAttribute('g');
		diffuseAtt.b = diffuse[0].getAttribute('b');
		diffuseAtt.a = diffuse[0].getAttribute('a');
		console.log("Diffuse: r = " + diffuseAtt.r+ " g = " + diffuseAtt.g  +  " b = " + diffuseAtt.b + " a = " +  diffuseAtt.a);
		materials['diffuse'] = diffuseAtt;

		specularAtt = [];
		var specular = material[i].getElementsByTagName('specular');
		specularAtt.r = specular[0].getAttribute('r');
		specularAtt.g = specular[0].getAttribute('g');
		specularAtt.b = specular[0].getAttribute('b');
		specularAtt.a = specular[0].getAttribute('a');
		console.log("Specular: r = " + specularAtt.r+ " g = " + specularAtt.g  +  " b = " + specularAtt.b + " a = " +  specularAtt.a);
		materials['specular'] = specularAtt;

		shininessAtt = [];
		var shininess = material[i].getElementsByTagName('shininess');
		shininessAtt.value = shininess[0].getAttribute('r');
		
		console.log("Shininess: r = " + shininessAtt.value);
		materials['shininess'] = shininessAtt;
		//material attributes saved in a list of materials
		this.materialslist.push(materials);
		console.log(this.materialslist);
	}

}


MySceneGraph.prototype.parseTransformations = function(rootElement){
    var elems = rootElement.getElementsByTagName('transformations');
	
	if(elems == null){
		return "Transformation element missing";
	}
	if(elems.length != 1){
		return "Either zero or more than one 'Transformation' element found.";
	}

    var ntransformations = elems[0].children.length;
    console.log("NUM. of transformations: " + ntransformations);

    var transformation = elems[0].children;
	this.transformationlist = [];

    for (var i = 0; i < ntransformations; i++){
        var id = transformation[i].getAttribute('id');
        console.log("Transformation id: " + id);
		
		transformations = [];
		transformations['id'] = id;
		
		translateAtt = [];
		var translate = transformation[i].getElementsByTagName('translate');
		if (translate == null  || translate.length==0) {
			return "translate element is missing.";
		}
		translateAtt['x'] = translate[0].getAttribute('x');
		translateAtt['y'] = translate[0].getAttribute('y');
		translateAtt['z'] = translate[0].getAttribute('z');
		console.log("Translate: X = " + translateAtt['x'] + ";  Y = " + translateAtt['y'] + ";  Z = " + translateAtt['z']);
		transformations['translate'] = translateAtt;
		
		rotateAtt = [];
		var rotate = transformation[i].getElementsByTagName('rotate');
		if (rotate == null  || rotate.length==0) {
			return "rotate element is missing.";
		}
		rotateAtt['axis'] = rotate[0].getAttribute('axis');
		rotateAtt['angle'] = rotate[0].getAttribute('angle');
		
		console.log("Rotate: AXIS = " + rotateAtt['axis'] + ";  ANGLE = " + rotateAtt['angle']);
		transformations['rotate'] = rotateAtt;
		
		scaleAtt = [];
		var scale = transformation[i].getElementsByTagName('scale');
		if (scale == null  || scale.length==0) {
			return "scale element is missing.";
		}
		scaleAtt['x'] = scale[0].getAttribute('x');
		scaleAtt['y'] = scale[0].getAttribute('y');
		scaleAtt['z'] = scale[0].getAttribute('z');
		console.log("Scale: X = " + scaleAtt['x'] + ";  Y = " + scaleAtt['y'] + ";  Z = " + scaleAtt['z']);
		transformations['scale'] = scaleAtt;
       
     	this.transformationlist.push(transformations);
     	console.log(this.transformationlist);
    }
}

MySceneGraph.prototype.parsePrimitives = function(rootElement){
    var elems = rootElement.getElementsByTagName('primitives');
	
	if(elems == null){
		return "Primitives element missing";
	}
	if(elems.length != 1){
		return "Either zero or more than one 'primitives' element found.";
	}

    var nprimitives = elems[0].children.length;
    console.log("NUM. of primitives: " + nprimitives);

    var primitive = elems[0].children;
	this.primitiveslist = [];

    for (var i = 0; i < nprimitives; i++){
        this.id = primitive[i].getAttribute('id');
        console.log("Primitive id: " + this.id);
		
		primitives = [];

		rectangleAtt = [];
		var rectangle = primitive[i].getElementsByTagName('rectangle');
		if (rectangle == null  || rectangle.length==0) {
			return "rectangle element is missing.";
		}
		rectangleAtt['x1'] = rectangle[0].getAttribute('x1');
		rectangleAtt['y1'] = rectangle[0].getAttribute('y1');
		rectangleAtt['x2'] = rectangle[0].getAttribute('x2');
		rectangleAtt['y2'] = rectangle[0].getAttribute('y2');

		console.log("Rectangle attributes: X1 = " + rectangleAtt['x1'] + ";  Y1 = " + rectangleAtt['y1']
                + ";  X2 = " + rectangleAtt['x2'] + ";  Y2 = " + rectangleAtt['y2']);
		primitives['rectangle'] = rectangleAtt;

		//Triangle
		triangleAtt = [];
		var triangle = primitive[i].getElementsByTagName('triangle');
		if (triangle == null  || triangle.length==0) {
			return "triangle element is missing.";
		}
		triangleAtt['x1'] = triangle[0].getAttribute('x1');
		triangleAtt['y1'] = triangle[0].getAttribute('y1');
		triangleAtt['x2'] = triangle[0].getAttribute('x2');
		triangleAtt['y2'] = triangle[0].getAttribute('y2');
		triangleAtt['x3'] = triangle[0].getAttribute('x3');
		triangleAtt['y3'] = triangle[0].getAttribute('y3');

		console.log("Triangle attributes: X1 = " + triangleAtt['x1'] + ";  Y1 = " + triangleAtt['y1']
                + ";  X2 = " + triangleAtt['x2'] + ";  Y2 = " + triangleAtt['y2']
                + ";  x3 = " + triangleAtt['x3'] + ";  Y3 = " + triangleAtt['y3']);
		primitives['triangle'] = triangleAtt;
		
		//cylinder
		cylinderAtt = [];
		var cylinder = primitive[i].getElementsByTagName('cylinder');
		if (cylinder == null  || cylinder.length==0) {
			return "cylinder element is missing.";
		}
		cylinderAtt['base'] = cylinder[0].getAttribute('base');
		cylinderAtt['top'] = cylinder[0].getAttribute('top');
		cylinderAtt['height'] = cylinder[0].getAttribute('height');
		cylinderAtt['slices'] = cylinder[0].getAttribute('slices');
		cylinderAtt['stacks'] = cylinder[0].getAttribute('stacks');

		console.log("Cylinder atts: BASE = " + cylinderAtt['base'] + "; TOP = " +  cylinderAtt['top']
                + ";  HEIGHT = " + cylinderAtt['height'] + ";  SLICE = " + cylinderAtt['slices']
                + "  STACK = " + cylinderAtt['stacks']);
		primitives['cylinder'] = cylinderAtt;

		//sphere
		sphereAtt = [];
		var sphere = primitive[i].getElementsByTagName('sphere');
		if (sphere == null  || sphere.length==0) {
			return "sphere element is missing.";
		}
		sphereAtt['radius'] = sphere[0].getAttribute('radius');
		sphereAtt['slices'] = sphere[0].getAttribute('slices');
		sphereAtt['stacks'] = sphere[0].getAttribute('stacks');

		console.log("Sphere attributes: RADIUS = " + sphereAtt['radius'] + 
		";  SLICES = " + sphereAtt['slices'] + "; STACKS = " + sphereAtt['stacks']);
		primitives['sphere'] = sphereAtt;

		//torus
		torusAtt = [];
		var torus = primitive[i].getElementsByTagName('torus');
		if (torus == null  || torus.length==0) {
			return "torus element is missing.";
		}
		
		torusAtt['inner'] = torus[0].getAttribute('inner');
		torusAtt['outer'] = torus[0].getAttribute('outer');
		torusAtt['slices'] = torus[0].getAttribute('slices');
		torusAtt['loops'] = torus[0].getAttribute('loops');

		console.log("Torus attributes: INNER = " + torusAtt['inner'] + ";  OUTER = " + torusAtt['outer']
                + ";  SLICES = " + torusAtt['slices'] + ";  LOOPS = " + torusAtt['loops'] );
		primitives['torus'] = torusAtt;

     	this.primitiveslist.push(primitives);
     	console.log(this.primitiveslist);
    }
}

MySceneGraph.prototype.parseComponents = function(rootElement){
	var elems = rootElement.getElementsByTagName('components');

    if(elems == null){
		return "Components element missing";
	}
	if(elems.length != 1){
		return "Either zero or more than one 'components' element found.";
	}

	var ncomponents = elems[0].children.length;
    var component = elems[0].children;
    this.componentslist = [];

    for(var i = 0; i < ncomponents; i++){
    	this.id = component[i].getAttribute('id');
    	console.log("Component id = " + this.id);
		
		//Transformations
       
        var transformations = component[i].getElementsByTagName('transformation');
        var ntranformation = transformations[0].children.length;
        var transformation = transformations[0].children;

        for(var j = 0; j < ntranformation; j++){
            var tag_name = transformation[j].tagName;
            if(tag_name === 'transformationref'){
                this.id = transformation[j].getAttribute('id');
                console.log("Reference to Transformation id = " + this.id);
            }else{
                if(tag_name === 'translate'){
                    this.x = transformation[j].getAttribute('x');
                    this.y = transformation[j].getAttribute('y');
                    this.z = transformation[j].getAttribute('z');

                    console.log("Translate: X = " + this.x + ";  Y = " + this.y + 
                    ";  Z = " + this.z);
                }
                else if(tag_name === 'scale'){
                    this.x = transformation[j].getAttribute('x');
                    this.y = transformation[j].getAttribute('y');
                    this.z = transformation[j].getAttribute('z');

                    console.log("Scale: X = " + this.x + ";  Y = " + this.y + 
                    ";  Z = " + this.z);
                }
                else if(tag_name === 'rotate'){
                    this.axis = transformation[j].getAttribute('axis');
                    this.angle = transformation[j].getAttribute('angle');

                    console.log("Rotate: AXIS = " + this.axis + 
                    "; ANGLE = " + this.angle);
                }
                else{
                    console.log("MISSING one of these elements: TRANSLATE, ROTATE OR SCALE");
                }
            }
        }

    	//Materials
        var materials = component[i].getElementsByTagName('materials');
        if (materials == null  || materials.length==0) {
			return "materials element is missing.";
		}
        var nmaterials = materials[0].children.length;
        console.log("NUM of Materials: " + nmaterials);
        var material = materials[0].children;
		
        for(var j = 0; j < nmaterials; j++){
            this.id = material[j].getAttribute('id');
            console.log("Material id = " + this.id);
        }

        //Textures
        var textures = component[i].getElementsByTagName('texture');
        if (textures == null  || textures.length==0) {
			return "textures element is missing.";
		}
        var ntextures = textures.length;
		console.log("NUM of Textures: " + ntextures);
        for(var j = 0; j < ntextures; j++){
            this.id = textures[j].getAttribute('id');
            console.log("Texture id: " + this.id);
        }
		
		//Children
        var children = component[i].getElementsByTagName('children');
        if (children == null  || children.length==0) {
			return "children element is missing.";
		}
        var nchildren = children[0].children.length;
        var kids = children[0].children;
        console.log("NUM of Children: " + nchildren);

        for(var j = 0; j < nchildren; j++){
            var tag_name = kids[j].tagName;

            if(tag_name === 'componentref'){
                this.id = kids[j].getAttribute('id');
                console.log("Reference to component with the id = " + this.id);
            }
            else if(tag_name === 'primitiveref'){
                this.id = kids[j].getAttribute('id');
                console.log("Reference to primitive with the id = " + this.id);
            }
            else{
                console.log("The references must be: compoenetref or primitiveref");
            }
        }

    }   
    
}
	
/*
 * Callback to be executed on any read error
 */
 
MySceneGraph.prototype.onXMLError=function (message) {
	console.error("XML Loading Error: "+message);	
	this.loadedOk=false;
};


