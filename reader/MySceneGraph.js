
function MySceneGraph(filename, scene) {
	this.loadedOk = null;
	
	// Establish bidirectional references between scene and graph
	this.scene = scene;
	scene.graph=this;
		
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

MySceneGraph.prototype.parseViews = function(rootElement){
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

	this.ambientContent = [];
	var ambient = elems[0].getElementsByTagName('ambient');
	if(ambient == null || ambient == 0){
		return "ambient element missing";
	}

	this.ambientContent['r'] = ambient[0].getAttribute('r');
	this.ambientContent['g'] = ambient[0].getAttribute('g');
	this.ambientContent['b'] = ambient[0].getAttribute('b');
	this.ambientContent['a'] = ambient[0].getAttribute('a');

	console.log("Ambient RED: " + this.ambientContent['r'] + "; GREEN: " + this.ambientContent['g'] + "; BLUE: " + this.ambientContent['b'] + "; A: " + this.ambientContent['a']);

	this.background = [];
	var backgroundContent = elems[0].getElementsByTagName('background');
	if(backgroundContent == null || backgroundContent == 0){
		return "background element missing";
	}
	this.background[0] = backgroundContent[0].getAttribute('r');
	this.background[1] = backgroundContent[0].getAttribute('g');
	this.background[2] = backgroundContent[0].getAttribute('b');
	this.background[3] = backgroundContent[0].getAttribute('a');


	//console.log("Background RED: " + this.background['r'] + "; GREEN: " + this.background['g'] + "; BLUE: " + this.background['b'] + "; A: " + this.background['a']);
	
}

MySceneGraph.prototype.parseLights=function(rootElement)
{
	var elems = rootElement.getElementsByTagName('lights');
	if(elems == null){
		return "Lights element missing";
	}

	if(elems.length != 1){
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
		this.lights = [];

		//console.log("Type of lights in the scene: " + typelights);
		if(typelight === 'omni'){
			this.lights.id = this.reader.getFloat(light[i], 'id');
			this.lights.enabled = this.reader.getBoolean(light[i], 'enabled');
			this.lights.omni = true;
			this.lights.spot = false;
			console.log("Lights 'omni' attributes: 'id'=" + this.lights.id + "; 'enabled'=" + this.lights.enabled);
			//light location
			this.location = [];
			var elemLocation = light[i].getElementsByTagName('location');
			this.location.x = elemLocation[0].getAttribute('x');
			this.location.y = elemLocation[0].getAttribute('y');
			this.location.z = elemLocation[0].getAttribute('z');
			this.location.w = elemLocation[0].getAttribute('w');
			this.lights['location'] = this.location;
			console.log("Omni lights location X: " + this.location.x + "; Y: " + this.location.y + "; Z: " + this.location.z + "; W: " + this.location.w);

			this.ambient = [];
			var elemAmbient = light[i].getElementsByTagName('ambient');
			this.ambient.r = elemAmbient[0].getAttribute('r');
			this.ambient.g = elemAmbient[0].getAttribute('g');
			this.ambient.b = elemAmbient[0].getAttribute('b');
			this.ambient.a = elemAmbient[0].getAttribute('a');
			this.lights['ambient'] = this.ambient;
			console.log("Omni lights ambient RED: " + this.ambient.r + "; GREEN: " + this.ambient.g + "; BLUE: " + this.ambient.b + "; Alpha: " + this.ambient.a);

			this.diffuse = [];
			var elemDiffuse = light[i].getElementsByTagName('diffuse');
			this.diffuse.r = elemDiffuse[0].getAttribute('r');
			this.diffuse.g = elemDiffuse[0].getAttribute('g');
			this.diffuse.b = elemDiffuse[0].getAttribute('b');
			this.diffuse.a = elemDiffuse[0].getAttribute('a');
			this.lights['diffuse'] = this.diffuse;
			console.log("Omni lights diffuse RED: " + this.diffuse.r + "; GREEN: " + this.diffuse.g + "; BLUE: " + this.diffuse.b + "; Alpha: " + this.diffuse.a);

			this.specular = [];
			var elemSpecular = light[i].getElementsByTagName('specular');
			this.specular.r = elemSpecular[0].getAttribute('r');
			this.specular.g = elemSpecular[0].getAttribute('g');
			this.specular.b = elemSpecular[0].getAttribute('b');
			this.specular.a = elemSpecular[0].getAttribute('a');
			this.lights['specular'] = this.specular;
			console.log("Omni lights specular RED: " + this.specular.r + "; GREEN: " + this.specular.g + "; BLUE: " + this.specular.b + "; Alpha: " + this.specular.a);
			//omni lights elements saves in lightslist
			this.lightslist.push(this.lights); 
			//console.log(this.lightslist);


		}else if(typelight === 'spot'){
			this.lights.id = this.reader.getFloat(light[i], 'id');
			this.lights.enabled = this.reader.getBoolean(light[i], 'enabled');
			this.lights.angle = this.reader.getFloat(light[i], 'angle');
			this.lights.exponent = this.reader.getFloat(light[i], 'exponent');
			this.lights.omni = false;
			this.lights.spot = true;
			console.log("Lights 'spot' attributes: 'id'=" + this.lights.id + "; 'enabled'=" + this.lights.enabled + "; 'angle'=" + this.lights.angle + "; 'exponent'=" + this.lights.exponent);

			//light target
			this.target = [];
			var elemTarget = light[i].getElementsByTagName('target');
			this.target.x = elemTarget[0].getAttribute('x');
			this.target.y = elemTarget[0].getAttribute('y');
			this.target.z = elemTarget[0].getAttribute('z');
			this.lights['target'] = this.target;
			console.log("Spot lights target X: " + this.target.x + "; Y: " + this.target.y + "; Z: " + this.target.z);

			//light location
			this.location = [];
			var elemLocation = light[i].getElementsByTagName('location');
			this.location.x = elemLocation[0].getAttribute('x');
			this.location.y = elemLocation[0].getAttribute('y');
			this.location.z = elemLocation[0].getAttribute('z');
			this.lights['location'] = this.location;
			console.log("Spot lights location X: " + this.location.x + "; Y: " + this.location.y + "; Z: " + this.location.z);

			this.ambient = [];
			var elemAmbient = light[i].getElementsByTagName('ambient');
			this.ambient.r = elemAmbient[0].getAttribute('r');
			this.ambient.g = elemAmbient[0].getAttribute('g');
			this.ambient.b = elemAmbient[0].getAttribute('b');
			this.ambient.a = elemAmbient[0].getAttribute('a');
			this.lights['ambient'] = this.ambient;
			console.log("Spot lights ambient RED: " + this.ambient.r + "; GREEN: " + this.ambient.g + "; BLUE: " + this.ambient.b + "; Alpha: " + this.ambient.a);

			this.diffuse = [];
			var elemDiffuse = light[i].getElementsByTagName('diffuse');
			this.diffuse.r = elemDiffuse[0].getAttribute('r');
			this.diffuse.g = elemDiffuse[0].getAttribute('g');
			this.diffuse.b = elemDiffuse[0].getAttribute('b');
			this.diffuse.a = elemDiffuse[0].getAttribute('a');
			this.lights['diffuse'] = this.diffuse;
			console.log("Spot lights diffuse RED: " + this.diffuse.r + "; GREEN: " + this.diffuse.g + "; BLUE: " + this.diffuse.b + "; Alpha: " + this.diffuse.a);

			this.specular = [];
			var elemSpecular = light[i].getElementsByTagName('specular');
			this.specular.r = elemSpecular[0].getAttribute('r');
			this.specular.g = elemSpecular[0].getAttribute('g');
			this.specular.b = elemSpecular[0].getAttribute('b');
			this.specular.a = elemSpecular[0].getAttribute('a');
			this.lights['specular'] = this.specular;
			console.log("Spot lights specular RED: " + this.specular.r + "; GREEN: " + this.specular.g + "; BLUE: " + this.specular.b + "; Alpha: " + this.specular.a);
			//spot lights elements saves in lightslist
			this.lightslist.push(this.lights); 
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
	console.log("ntextures: " + ntextures);

	for(var i = 0; i < ntextures; i++){
		this.id = elems[0].children[i].getAttribute('id');
		this.file = elems[0].children[i].getAttribute('file');
		this.length_s = elems[0].children[i].getAttribute('length_s');
		this.length_t = elems[0].children[i].getAttribute('length_t');
		console.log("Textures attributes:" + " id= " + this.id  + "; file= " + this.file + "; length_s= " + this.length_s  + "; length_t= " + this.length_t);
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

	for(var i = 0; i < nmaterials; i++){
		this.id = material[i].getAttribute('id');
		console.log("Material id: " + this.id);
		this.materials = [];

		this.emissionAtt = [];
		var emission = material[i].getElementsByTagName('emission');
		this.emissionAtt.r = emission[0].getAttribute('r');
		this.emissionAtt.g = emission[0].getAttribute('g');
		this.emissionAtt.b = emission[0].getAttribute('b');
		this.emissionAtt.a = emission[0].getAttribute('a');
		console.log("Emission: r = " + this.emissionAtt.r+ " g = " + this.emissionAtt.g  +  " b = " + this.emissionAtt.b + " a = " +  this.emissionAtt.a);
		this.materials['emission'] = this.emissionAtt;

		this.ambientAtt = [];
		var ambient = material[i].getElementsByTagName('ambient');
		this.ambientAtt.r = ambient[0].getAttribute('r');
		this.ambientAtt.g = ambient[0].getAttribute('g');
		this.ambientAtt.b = ambient[0].getAttribute('b');
		this.ambientAtt.a = ambient[0].getAttribute('a');
		console.log("Ambient: r = " + this.ambientAtt.r+ " g = " + this.ambientAtt.g  +  " b = " + this.ambientAtt.b + " a = " +  this.ambientAtt.a);
		this.materials['ambient'] = this.ambientAtt;

		this.diffuseAtt = [];
		var diffuse = material[i].getElementsByTagName('diffuse');
		this.diffuseAtt.r = diffuse[0].getAttribute('r');
		this.diffuseAtt.g = diffuse[0].getAttribute('g');
		this.diffuseAtt.b = diffuse[0].getAttribute('b');
		this.diffuseAtt.a = diffuse[0].getAttribute('a');
		console.log("Diffuse: r = " + this.diffuseAtt.r+ " g = " + this.diffuseAtt.g  +  " b = " + this.diffuseAtt.b + " a = " +  this.diffuseAtt.a);
		this.materials['diffuse'] = this.diffuseAtt;

		this.specularAtt = [];
		var specular = material[i].getElementsByTagName('specular');
		this.specularAtt.r = specular[0].getAttribute('r');
		this.specularAtt.g = specular[0].getAttribute('g');
		this.specularAtt.b = specular[0].getAttribute('b');
		this.specularAtt.a = specular[0].getAttribute('a');
		console.log("Specular: r = " + this.specularAtt.r+ " g = " + this.specularAtt.g  +  " b = " + this.specularAtt.b + " a = " +  this.specularAtt.a);
		this.materials['specular'] = this.specularAtt;

		this.shininessAtt = [];
		var shininess = material[i].getElementsByTagName('shininess');
		this.shininessAtt.value = shininess[0].getAttribute('r');
		
		console.log("Shininess: r = " + this.shininessAtt.value);
		this.materials['shininess'] = this.shininessAtt;
		//material attributes saved in a list of materials
		this.materialslist.push(this.materials);
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
        this.id = transformation[i].getAttribute('id');
        console.log("Transformation id: " + this.id);
		
		this.transformations = [];

		this.translateAtt = [];
		var translate = transformation[i].getElementsByTagName('translate');
		if (translate == null  || translate.length==0) {
			return "translate element is missing.";
		}
		this.translateAtt['x'] = translate[0].getAttribute('x');
		this.translateAtt['y'] = translate[0].getAttribute('y');
		this.translateAtt['z'] = translate[0].getAttribute('z');
		console.log("Translate: X = " + this.translateAtt['x'] + ";  Y = " + this.translateAtt['y'] + ";  Z = " + this.translateAtt['z']);
		this.transformations['translate'] = this.translateAtt;
		
		this.rotateAtt = [];
		var rotate = transformation[i].getElementsByTagName('rotate');
		if (rotate == null  || rotate.length==0) {
			return "rotate element is missing.";
		}
		this.rotateAtt['axis'] = rotate[0].getAttribute('axis');
		this.rotateAtt['angle'] = rotate[0].getAttribute('angle');
		
		console.log("Rotate: AXIS = " + this.rotateAtt['axis'] + ";  ANGLE = " + this.rotateAtt['angle']);
		this.transformations['rotate'] = this.rotateAtt;
		
		this.scaleAtt = [];
		var scale = transformation[i].getElementsByTagName('scale');
		if (scale == null  || scale.length==0) {
			return "scale element is missing.";
		}
		this.scaleAtt['x'] = scale[0].getAttribute('x');
		this.scaleAtt['y'] = scale[0].getAttribute('y');
		this.scaleAtt['z'] = scale[0].getAttribute('z');
		console.log("Scale: X = " + this.scaleAtt['x'] + ";  Y = " + this.scaleAtt['y'] + ";  Z = " + this.scaleAtt['z']);
		this.transformations['scale'] = this.scaleAtt;
       
     	this.transformationlist.push(this.transformations);
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
		
		this.primitives = [];

		this.rectangleAtt = [];
		var rectangle = primitive[i].getElementsByTagName('rectangle');
		if (rectangle == null  || rectangle.length==0) {
			return "rectangle element is missing.";
		}
		this.rectangleAtt['x1'] = rectangle[0].getAttribute('x1');
		this.rectangleAtt['y1'] = rectangle[0].getAttribute('y1');
		this.rectangleAtt['x2'] = rectangle[0].getAttribute('x2');
		this.rectangleAtt['y2'] = rectangle[0].getAttribute('y2');

		console.log("Rectangle attributes: X1 = " + this.rectangleAtt['x1'] + ";  Y1 = " + this.rectangleAtt['y1']
                + ";  X2 = " + this.rectangleAtt['x2'] + ";  Y2 = " + this.rectangleAtt['y2']);
		this.primitives['rectangle'] = this.rectangleAtt;

		//Triangle
		this.triangleAtt = [];
		var triangle = primitive[i].getElementsByTagName('triangle');
		if (triangle == null  || triangle.length==0) {
			return "triangle element is missing.";
		}
		this.triangleAtt['x1'] = triangle[0].getAttribute('x1');
		this.triangleAtt['y1'] = triangle[0].getAttribute('y1');
		this.triangleAtt['x2'] = triangle[0].getAttribute('x2');
		this.triangleAtt['y2'] = triangle[0].getAttribute('y2');
		this.triangleAtt['x3'] = triangle[0].getAttribute('x3');
		this.triangleAtt['y3'] = triangle[0].getAttribute('y3');

		console.log("Triangle attributes: X1 = " + this.triangleAtt['x1'] + ";  Y1 = " + this.triangleAtt['y1']
                + ";  X2 = " + this.triangleAtt['x2'] + ";  Y2 = " + this.triangleAtt['y2']
                + ";  x3 = " + this.triangleAtt['x3'] + ";  Y3 = " + this.triangleAtt['y3']);
		this.primitives['triangle'] = this.triangleAtt;
		
		//cylinder
		this.cylinderAtt = [];
		var cylinder = primitive[i].getElementsByTagName('cylinder');
		if (cylinder == null  || cylinder.length==0) {
			return "cylinder element is missing.";
		}
		this.cylinderAtt['base'] = cylinder[0].getAttribute('base');
		this.cylinderAtt['top'] = cylinder[0].getAttribute('top');
		this.cylinderAtt['height'] = cylinder[0].getAttribute('height');
		this.cylinderAtt['slices'] = cylinder[0].getAttribute('slices');
		this.cylinderAtt['stacks'] = cylinder[0].getAttribute('stacks');

		console.log("Cylinder atts: BASE = " + this.cylinderAtt['base'] + "; TOP = " +  this.cylinderAtt['top']
                + ";  HEIGHT = " + this.cylinderAtt['height'] + ";  SLICE = " + this.cylinderAtt['slices']
                + "  STACK = " + this.cylinderAtt['stacks']);
		this.primitives['cylinder'] = this.cylinderAtt;

		//sphere
		this.sphereAtt = [];
		var sphere = primitive[i].getElementsByTagName('sphere');
		if (sphere == null  || sphere.length==0) {
			return "sphere element is missing.";
		}
		this.sphereAtt['radius'] = sphere[0].getAttribute('radius');
		this.sphereAtt['slices'] = sphere[0].getAttribute('slices');
		this.sphereAtt['stacks'] = sphere[0].getAttribute('stacks');

		console.log("Sphere attributes: RADIUS = " + this.sphereAtt['radius'] + 
		";  SLICES = " + this.sphereAtt['slices'] + "; STACKS = " + this.sphereAtt['stacks']);
		this.primitives['sphere'] = this.sphereAtt;

		//torus
		this.torusAtt = [];
		var torus = primitive[i].getElementsByTagName('torus');
		if (torus == null  || torus.length==0) {
			return "torus element is missing.";
		}
		
		this.torusAtt['inner'] = torus[0].getAttribute('inner');
		this.torusAtt['outer'] = torus[0].getAttribute('outer');
		this.torusAtt['slices'] = torus[0].getAttribute('slices');
		this.torusAtt['loops'] = torus[0].getAttribute('loops');

		console.log("Torus attributes: INNER = " + this.torusAtt['inner'] + ";  OUTER = " + this.torusAtt['outer']
                + ";  SLICES = " + this.torusAtt['slices'] + ";  LOOPS = " + this.torusAtt['loops'] );
		this.primitives['torus'] = this.torusAtt;

     	this.primitiveslist.push(this.primitives);
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


