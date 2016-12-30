/**
 * Documentation referencing only to the third part of the Project
 */
//Key animation function
function KeyAnimation(id, span)
{
    this.animation = new Animation(id, span, "key");

    this.controlPoints = [];
};

//return controlPoints
KeyAnimation.prototype.getControlPoints = function()
{
    return this.controlPoints;
};

//addcontrol points
KeyAnimation.prototype.addControlPoint=function(time, transX, transY, transZ, rotX, rotY, rotZ, scaleX, scaleY, ScaleZ)
{
    this.controlPoints.push([time, transX, transY, transZ, rotX, rotY, rotZ, scaleX, scaleY, ScaleZ]);
};

//get the current index with the given time
KeyAnimation.prototype.getCurrentKeyIndex=function(currTime)
{
    var ret;
    for(var i = 0; i < this.controlPoints.length; i++)
    {
        var time = this.controlPoints[i][0];

        ret =  i; 
        if(currTime < time)
        {
           ret =  i-1;  
           break;    
        }
    }
    return ret;
};

//interpolate values with times,
KeyAnimation.prototype.interpolatePoints=function(time0, val0, time1, val1, time)
{
      var val;
      if(time0 == time1)
      {
          val = val0;
      }
      else
      {
          val = val0 + (time - time0)*(val1-val0) / (time1 - time0);
      }
      return val;
};

//interpolate Frames
KeyAnimation.prototype.interpolateFrames=function(frame1, frame2, time)
{
    var newFrame = [];

    var time0 = frame1[0];
    var time1 = frame2[0];

    for(var i = 1 ; i < frame1.length; i++)
    {
        var val0 = frame1[i];
        var val1 = frame2[i];
        var val = this.interpolatePoints(time0, val0, time1, val1, time);
        newFrame.push(val);
    }

    return newFrame;                       
};

//return the new Transformation
KeyAnimation.prototype.getTransformation=function(currTime)
{
        //console.log(this);
        var firstKeyIndex = this.getCurrentKeyIndex(currTime);

        var nextKeyIndex = firstKeyIndex + 1;

        var firstKey;
        var nextKey;    
        var newFrame = [];

        if(firstKeyIndex >= this.controlPoints.length - 1)
        {
            firstKey = this.controlPoints[firstKeyIndex];
            for(var i = 1; i < firstKey.length; i++)
            {
                var val = firstKey[i];
                newFrame.push(val);
            }
        }
        else
        {
            firstKey = this.controlPoints[firstKeyIndex];
            nextKey = this.controlPoints[nextKeyIndex];

            newFrame = this.interpolateFrames(firstKey, nextKey, currTime);
        }

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


        //scale
        var scalevec = vec3.fromValues(newFrame[6], newFrame[7], newFrame[8]);
        mat4.scale(transMatrix, transMatrix, scalevec);

        return transMatrix;

};