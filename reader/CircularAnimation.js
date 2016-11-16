function CircularAnimation(id, span, type, center, radius, startang, rotang, updatePeriod)
{
     this.animation = new Animation(id, span, type);

     this.center = center;
     this.radius = radius;
     this.startang = startang;
     this.rotang = rotang;
    this.refresh = 1 / updatePeriod;
     this.transMatrix = mat4.create();
     this.rotMatrix = mat4.create();
};


CircularAnimation.prototype.getCenter=function()
{
    return this.center;  
};

CircularAnimation.prototype.getRadius=function()
{
    return this.radius;  
};

CircularAnimation.prototype.getStartang=function()
{
    return this.startang;  
};

CircularAnimation.prototype.getRotang=function()
{
    return this.rotang;  
};

CircularAnimation.prototype.getSpan=function()
{
    return this.animation.getSpan();  
};

CircularAnimation.prototype.getType=function()
{
    return this.animation.getType();  
};

CircularAnimation.prototype.getID=function()
{
    return this.animation.getID();  
};

CircularAnimation.prototype.update=function()
{
      
};