/**
 * 
 * @param id
 * @param span
 * @param type
 * @returns
 * 
 * Animation Constructor with id, span and type
 */

function Animation(id, span, type)
{
    this.id = id;
    this.span = span;
    this.type = type;

};

/**
 * Get span
 * @returns span
 */
Animation.prototype.getSpan=function()
{
    return this.span;
};

/**
 * Get type
 * @returns type
 */
Animation.prototype.getType=function()
{
    return this.type;
};

/**
 * Get ID
 * @returns id
 */
Animation.prototype.getID=function()
{
      return this.id;
};