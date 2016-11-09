function LinearAnimation(id, span, type, controlpoints)
{
    this.animation = new Animation(id, span, type);
    this.controlpoints = controlpoints;

    this.length = this.setLength();
    this.speed = this.setSpeed();

    this.currCoords = this.controlpoints[0];
    this.currContrtrolPoint = 0;

    this.refresh =  1 / 60;
    this.lengthinc = this.speed * this.refresh;

    this.kinc = 1 / this.lengthinc;
    
    this.state = "start";

    this.transMatrix = mat4.create();
    this.rotMatrix = mat4.create();
};

LinearAnimation.prototype.getControlPoints=function()
{
    return this.controlpoints;  
};

LinearAnimation.prototype.getSpan=function()
{
    return this.animation.getSpan();  
};

LinearAnimation.prototype.getType=function()
{
    return this.animation.getType();  
};

LinearAnimation.prototype.setLength=function()
{
      var length = 0;

      for(var i = 0; i < this.controlpoints.length - 1; i++)
      {
          var x1 = this.controlpoints[i]['x'];
          var y1 = this.controlpoints[i]['y'];
          var z1 = this.controlpoints[i]['z'];

          var x2 = this.controlpoints[i+1]['x'];
          var y2 = this.controlpoints[i+1]['y'];
          var z2 = this.controlpoints[i+1]['z'];

          var x = x2 - x1;
          var y = y2 - y1;
          var z = z2 - z1;

          length += Math.sqrt(x*x + y*y + z*z);         
      }
      return length;
};


LinearAnimation.prototype.getLength=function()
{
    return this.length;
};

LinearAnimation.prototype.setSpeed=function()
{
      return this.length / this.animation.getSpan();
};

LinearAnimation.prototype.getSpeed=function()
{
    return this.speed;
};

LinearAnimation.prototype.getCoords=function()
{
    return this.coords;  
};

LinearAnimation.prototype.getID=function()
{
    return this.animation.getID();  
};

LinearAnimation.prototype.update=function()
{
      if(this.state != "end")
      {
           var n_cpoints = this.controlpoints.length - 1;

           var x1 = this.currCoords['x'];
           var y1 = this.currCoords['y'];
           var z1 = this.currCoords['z'];

           var x2 = this.controlpoints[this.currContrtrolPoint]['x'];
           var y2 = this.controlpoints[this.currContrtrolPoint]['y'];           
           var z2 = this.controlpoints[this.currContrtrolPoint]['z'];

           var xnovo = x1 + this.kinc(x2 - x1);
           var ynovo = y1 + this.kinc(y2 - y1);
           var znovo = z1 + this.kinc(z2 - z1);

           var vec3 = vec3.fromValues(xnovo - x1, ynovo - y1, znovo - z1);

           mat4.translate(this.transMatrix, this.transMatrix, vec3);

           if(xnovo == x2 )

           //condiçoes de paragem,

             
      }
};