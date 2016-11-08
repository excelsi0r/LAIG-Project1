function CircularAnimation(span, type, center, radius, startang, rotang)
{
     this.animation = new Animation(span, type);

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