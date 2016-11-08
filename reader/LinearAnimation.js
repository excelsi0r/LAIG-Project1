function LinearAnimation(span, type, controlpoints)
{
    this.animation = new Animation(span, type);
    this.controlpoints = controlpoints;
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