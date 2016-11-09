function CircularAnimation(id, span, type, center, radius, startang, rotang)
{
     this.animation = new Animation(id, span, type);

     this.center = center;
     this.radius = radius;
     this.startang = startang;
     this.rotang = rotang;
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