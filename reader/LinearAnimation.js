function LinearAnimation(id, span, type, controlpoints)
{
    this.animation = new Animation(id, span, type);
    this.controlpoints = controlpoints;

    this.length = this.setLength();
    this.speed = this.setSpeed();

    this.coords = this.controlpoints[0];

    this.state = "start";

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
      
};