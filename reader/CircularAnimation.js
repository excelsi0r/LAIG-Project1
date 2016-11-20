/**
 * Documentation refering to the second part of the project
 * 
 * @param id
 * @param span
 * @param type
 * @param center (array with x,y,z)
 * @param radius
 * @param startang
 * @param rotang
 * @param updatePeriod
 * @returns
 * 
 * Constructor for Circular animation
 * Contains General animation element
 * Time parameter that is updated acording to the time received when updating
 * CurrPartiiton parameter register the current state of the animation
 * Repart parameter calculates all the times update should be called to update animation state
 * it is calculated acording with the Span and updatePeriod
 * CurrRotAng intial rotation angle
 * AssertAng is always Half-Radian, this angle sets the direction of rotation
 * CurrX, currY and currZ are the coordinates for the object location in 3D space, currY is always 0
 * because circular animation does not suport rotations with other axis. 
 * Incang is the incremental angle, each time the update is called the currRotAng is incremented 
 * with incang simulating rotation allong time.
 * RPS or refreshes per second, is the times per second that the animation update is called.
 * TransMatrix, translation Matrix, atualized each time the update is called.
 * RotMatrix, rotation Matrix, atualized each time the update is called.
 * State, goes from "waiting" to "start" to "end", is initialized as "waiting" because is not
 * finished but it has not started yet.
 * Calls initialize for creating initial parameters, ex: transMatrix and rotMatrix.
 *  
 */
function CircularAnimation(id, span, type, center, radius, startang, rotang, updatePeriod)
{
     this.animation = new Animation(id, span, type);

     this.center = center;
     this.radius = radius;
     this.startang = startang;
     this.rotang = rotang;
     
     this.Time;

     this.currPartition = 0;
     this.repart;

     this.currRotAng = 0;
     this.assertAng = Math.PI / 2;

     this.currX;
     this.currY = 0;
     this.currZ;

     this.incang;

     this.RPS = updatePeriod;
     this.transMatrix;
     this.rotMatrix;

     this.state = "waiting";

     this.initialize();
};

/**
 * Get Center 
 * @returns center
 */
CircularAnimation.prototype.getCenter=function()
{
    return this.center;  
};

/**
 * Get Radius
 * @returns radius
 */
CircularAnimation.prototype.getRadius=function()
{
    return this.radius;  
};

/**
 * Get Start Angle
 * @returns startang
 */
CircularAnimation.prototype.getStartang=function()
{
    return this.startang;  
};

/**
 * Get Rotation Angle
 * @returns rotang
 */
CircularAnimation.prototype.getRotang=function()
{
    return this.rotang;  
};

/**
 * Get Span
 * @returns span from aniamtion
 */
CircularAnimation.prototype.getSpan=function()
{
    return this.animation.getSpan();  
};

/**
 * Get Type
 * @returns type aniamtion
 */ 
CircularAnimation.prototype.getType=function()
{
    return this.animation.getType();  
};

/**
 * Get ID
 * @returns ID from aniamtion
 */
CircularAnimation.prototype.getID=function()
{
    return this.animation.getID();  
};

/**
 * Update function
 * Checks if the currPartition is 0, means it is the first time update is being called, sets the time
 * for the first time. Time when update was firstly called, increments currPartition
 * If state is not "end" atualizes animation
 * Calculates the difference between the first time and the current Time when update was called
 * asserts Time for the currTime when it was called
 * This difference and asserting a new time when update was last called is usefull
 * because the update may not be called the exact number of times expected. When this happens
 * the real animation span is much bigger than expected.
 * From the difference in time, from the RPS we are able to know how many partitions were skiped
 * so now we incremente the currRotAng with incang the number of times the update was supposed to 
 * be called since the last one.
 * A new rotMatrix is created with the new rotation updated
 * With the new rotAng we use trigonomerty to calculate new values for X, Y, Z indicating were
 * the object should be with the new rotation. 
 * X, Y, Z are incremented with center position for final coordinates of object.
 * A new transMatrix is created with the new values.
 * the currPartition is incremented with the numebr of 'updates' this 'update' represented
 * Finally checks if the currPartition is equal or bigger than the previously calculated
 * repart, if true means that the animation is finished and the update was called enough times
 * to finish the animation, so the state is set to "end"
 * @param currTime
 */
CircularAnimation.prototype.update=function(currTime)
{
      if(this.currPartition == 0)
      {
          this.Time = currTime;
          this.currPartition++;
          
          return;
      }

      if(this.state != "end")
      {
            var Diff = currTime - this.Time;
            this.Time = currTime;

            var n_part_asserts = (Diff * this.RPS)  / 1000;
            var assertPoint = Math.round(n_part_asserts);


            for(var i = 0; i < assertPoint; i++)
            {
                this.currRotAng += this.incang;
            }

            //rotating
            var axisvec = vec3.fromValues(0,1,0);
            this.rotMatrix = mat4.create();
            this.rotMatrix = mat4.rotate(this.rotMatrix, this.rotMatrix, this.currRotAng + this.assertAng, axisvec);

            //translating
            this.currX = this.radius * Math.sin(this.currRotAng);
            this.currZ = this.radius * Math.cos(this.currRotAng);

            var transformX = this.currX + this.center['x'];
            var transformY = this.currY + this.center['y'];
            var transformZ = this.currZ + this.center['z'];


            var transvec = vec3.fromValues(transformX, transformY, transformZ);
            this.transMatrix = mat4.create();
            mat4.translate(this.transMatrix, this.transMatrix,transvec);

            this.currPartition += assertPoint;
      }

      if(this.currPartition >= this.repart)
      {
          this.state = "end";
      }
};

/**
 * Intialize function
 * 
 * Creates first values for Circular Animation
 * First checks if the rotang is positive or negative (indicates rotation direction)
 * If negative than the assertAng is saved as negative assertAng
 * The currRotAng is calculated, with startAng and with Half Radian. The half radian is to
 * convert the angle from ZZ to XX.
 * A new rotation Matrix is created from the currRotAng and the assertAng
 * We use trigonometry to determine the initial positions x,z acordig to the currRotAng
 * we increment x, y, z with the values from center, so now we have the exact postion pretended
 * curr.Y is always 0, because this animation does not use vertical translations
 * the repart is calculated with the RPS and Span, so now the animation knows how 
 * many times the update will be called before finishing
 * The incang is calculated from the rotAng (the amount of radians the animation will be rotated) 
 * and from the repart, so now we know the angle each update should increment to have the desired
 * rotation in the end. 
 */
CircularAnimation.prototype.initialize=function()
{
        //intial rotation 
        if(this.rotang < 0)
        {
            this.assertAng = -this.assertAng;
        }

        this.currRotAng += this.startang + Math.PI / 2;
        
        var axisvec = vec3.fromValues(0,1,0);
        this.rotMatrix = mat4.create();
        this.rotMatrix = mat4.rotate(this.rotMatrix, this.rotMatrix, this.currRotAng + this.assertAng, axisvec);


        //initial translation
        this.currX = this.radius * Math.sin(this.currRotAng);
        this.currZ = this.radius * Math.cos(this.currRotAng);

        var transformX = this.currX + this.center['x'];
        var transformY = this.currY + this.center['y'];
        var transformZ = this.currZ + this.center['z'];

        var transvec = vec3.fromValues(transformX, transformY, transformZ);
        this.transMatrix = mat4.create();
        mat4.translate(this.transMatrix, this.transMatrix,transvec);   

        //calculating total partitions and incremet anglev
        //var totalrot = Math.abs(this.rotang);
        this.repart = this.RPS * this.getSpan();
        this.incang = this.rotang / this.repart;
};