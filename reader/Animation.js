function Animation(span, type)
{
    this.span = span;
    this.type = type;

};
Animation.prototype.getSpan=function()
{
    return this.span;
};

Animation.prototype.getType=function()
{
    return this.type;
};