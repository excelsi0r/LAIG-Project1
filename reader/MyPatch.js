function MyPatch(scene, orderU, orderV, partsU, partsV, controlpoints)
{
    this.scene = scene;
    this.orderU = orderU;
    this.orderV = orderV;
    this.partsU = partsU;
    this.partsV = partsV;
    this.controlpoints = controlpoints;

    this.newControlPoints = this.assertNewControlPointsArray();

    this.plane = this.makeSurface(this.orderU, this.orderV, this.newControlPoints);
    
}

MyPatch.prototype = Object.create(CGFobject.prototype);
MyPatch.prototype.constructor=MyPatch;

MyPatch.prototype.assertNewControlPointsArray = function()
{
		var newControlPoints = [];

		for(var u = 0; u < this.orderU + 1; u++)
		{
			var uarray = [];

			for(var v = 0; v < this.orderV + 1; v++)
			{
				var point = this.controlpoints[(this.orderV + 1)*u + v];
				point.push(1);
				uarray.push(point);
			}

			newControlPoints.push(uarray);
		}
		console.log(newControlPoints);
		return newControlPoints;

};

MyPatch.prototype.makeSurface = function (degree1, degree2, controlvertexes) {
		
	var knots1 = this.getKnotsVector(degree1); 
	var knots2 = this.getKnotsVector(degree2);
		
	var nurbsSurface = new CGFnurbsSurface(degree1, degree2, knots1, knots2, controlvertexes); 
	getSurfacePoint = function(u, v) {
		return nurbsSurface.getPoint(u, v);
	};

	var obj = new CGFnurbsObject(this.scene, getSurfacePoint, this.partsU, this.partsV);
	return obj;		
};

MyPatch.prototype.getKnotsVector = function(degree) 
{ 
	
	var v = new Array();
	for (var i=0; i<=degree; i++) {
		v.push(0);
	}
	for (var i=0; i<=degree; i++) {
		v.push(1);
	}
	return v;
};

MyPatch.prototype.display = function()
{
	this.plane.display();
};

MyPatch.prototype.updateTextureCoords=function(s, t) {};