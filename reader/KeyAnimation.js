function KeyAnimation(id, span)
{
    this.animation = new Animation(id, span, "key");

    this.controlPoints = [];
};

KeyAnimation.prototype.getControlPoints = function()
{
    return this.controlPoints;
};

KeyAnimation.prototype.addControlPoint=function(time, transX, transY, transZ, rotX, rotY, rotZ, scaleX, scaleY, ScaleZ)
{
    this.controlPoints.push([time, transX, transY, transZ, rotX, rotY, rotZ, scaleX, scaleY, ScaleZ]);
};

KeyAnimation.prototype.getCurrentKeyIndex=function(currTime)
{
    for(var i = 1; i <= this.controlPoints.length-1; i++)
    {
        var time = this.controlPoints[i][0];

        if(currTime < time)
        {
            return i;      
        }
    }
};

KeyAnimation.prototype.interpolatePoints=function(x0, y0, x1, y1, x)
{
      var y;
      if(x0 == x1)
      {
          y = y0;
      }
      else
      {
          y = y0 + (x - x0)*(y1-y0) / (x1 - x0);
      }
      return y;
};

KeyAnimation.prototype.interpolateFrames=function(frame1, frame2, time)
{
    var newFrame = [];

    var time0 = frame1[0];
    var time1 = frame2[0];

    for(var i = 1 ; i < frame1.length; i++)
    {
        var y0 = frame1[i];
        var y1 = frame2[i];
        var y = this.interpolatePoints(time0, y0, time1, y1, time);
        newFrame.push(y);
    }

    return newFrame;                       


};

KeyAnimation.prototype.getTransformation=function(currTime)
{
        var firstKeyIndex = this.getCurrentKeyIndex(currTime);

        var nextKeyIndex = firstKeyIndex + 1;
        if(firstKeyIndex >= this.controlPoints.length - 1)
        {
          nextKeyIndex = firstKeyIndex;
        }

        var firstKey = this.controlPoints[firstKeyIndex];
        var nextKey = this.controlPoints[nextKeyIndex];

        var newFrame = this.interpolateFrames(firstKey, nextKey, currTime);

        var transMatrix = mat4.create();

        //translate
        var transvec = vec3.fromValues(newFrame[0], newFrame[1], newFrame[2]);
        mat4.translate(transMatrix, transMatrix, transvec);  

        //rotation x
        var axisvec = vec3.fromValues(1,0,0);
        mat4.rotate(transMatrix, transMatrix, newFrame[3], axisvec);

        //rotation y
        var axisvec = vec3.fromValues(0,1,0);
        mat4.rotate(transMatrix, transMatrix, newFrame[4], axisvec);

        //rotation z
        var axisvec = vec3.fromValues(0,0,1);
        mat4.rotate(transMatrix, transMatrix, newFrame[5], axisvec);

        //scaleX
        var scalevec = vec3.fromValues(newFrame[6], newFrame[7], newFrame[8]);
        mat4.scale(transMatrix, transMatrix, scalevec);

        return transMatrix;

};