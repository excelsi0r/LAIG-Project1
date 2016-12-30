/**
 * Documentation referencing only to the third part of the Project
 */
//View Transition constructor, id, currTime, and span
function MyViewTransition(scene, id, currTime, span)
{
    this.id = id;
    this.scene = scene;

    this.firstTime = currTime;
    this.lastTime = currTime + (span * 1000);

    this.near = null;	
	this.far = null;
    this.angle = null;

    this.fromx = null;	
    this.fromy = null;	
    this.fromz = null;	

    this.tox = null;	
    this.toy = null;	
    this.toz = null;	
		


	if(this.id == "p1")
	{
        this.setP1camera();
	}
	else if(this.id == "p2")
	{
        this.setP2camera();
	}
	else this.setDefault();
 
};

//interpolate Points with  times
MyViewTransition.prototype.interpolatePoints=function(time0, val0, time1, val1, time)
{
      var val;
      if(time0 >= time1)
      {
          val = val0;
      }
      else
      {
          val = val0 + (time - time0)*(val1-val0) / (time1 - time0);
      }
      return val;
};

//get the new View updated
MyViewTransition.prototype.getCameraUpdated=function(currTime)
{
	
		var near = this.scene.interface.activeCamera.near;
		var far = this.scene.interface.activeCamera.far;
		var angle = this.scene.interface.activeCamera.fov;

		var fromx = this.scene.interface.activeCamera.position[0];
		var fromy = this.scene.interface.activeCamera.position[1];
		var fromz = this.scene.interface.activeCamera.position[2];

		var tox = this.scene.interface.activeCamera.target[0];
		var toy = this.scene.interface.activeCamera.target[1];
		var toz = this.scene.interface.activeCamera.target[2];


		//calculate
		var newnear = this.interpolatePoints(this.firstTime, near, this.lastTime, this.near, currTime);
		var newfar = this.interpolatePoints(this.firstTime, far, this.lastTime, this.far, currTime);
		var newangle = this.interpolatePoints(this.firstTime, angle, this.lastTime, this.angle, currTime);

		var newfromx = this.interpolatePoints(this.firstTime, fromx, this.lastTime, this.fromx, currTime);
		var newfromy = this.interpolatePoints(this.firstTime, fromy, this.lastTime, this.fromy, currTime);
		var newfromz = this.interpolatePoints(this.firstTime, fromz, this.lastTime, this.fromz, currTime);

		var newtox = this.interpolatePoints(this.firstTime, tox, this.lastTime, this.tox, currTime);
		var newtoy = this.interpolatePoints(this.firstTime, toy, this.lastTime, this.toy, currTime);
		var newtoz = this.interpolatePoints(this.firstTime, toz, this.lastTime, this.toz, currTime);


		var cm = new CGFcamera(newangle, newnear, newfar, vec3.fromValues(newfromx, newfromy, newfromz), vec3.fromValues(newtox, newtoy, newtoz));
		return cm;
	
};

//set default values
MyViewTransition.prototype.setDefault=function()
{
    this.near = 0.1;
    this.far = 500;
    this.angle = Math.PI*45/180;

    this.fromx = 5;	
    this.fromy = 20;	
    this.fromz = 5;	

    this.tox = 5;	
    this.toy = 0;	
    this.toz = 4.99;	
};

//set camera to player 1
MyViewTransition.prototype.setP1camera=function()
{
    this.near = 0.1;
    this.far = 500;
    this.angle = Math.PI*45/180;

    this.fromx = 0;	
    this.fromy = 20;	
    this.fromz = 5;	

    this.tox = 0;	
    this.toy = 0;	
    this.toz = 4.99;	
};

//set camera to player 2
MyViewTransition.prototype.setP2camera=function()
{
    this.near = 0.1;
    this.far = 500;
    this.angle = Math.PI*45/180;

    this.fromx = 10;	
    this.fromy = 20;	
    this.fromz = 5;	

    this.tox = 10;	
    this.toy = 0;	
    this.toz = 4.99;	
};