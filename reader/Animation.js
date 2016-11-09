function Animation(id, span, type)
{
    this.id = id;
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

Animation.prototype.getID=function()
{
      return this.id;
};