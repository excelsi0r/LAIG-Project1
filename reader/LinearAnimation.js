/**
 * Documentation refering to the second part of the project
 * 
 * @param id
 * @param span
 * @param type
 * @param controlpoints
 * @param updatePeriod
 * @returns
 * 
 * Constructor for linear animation
 * Creates a general Animation.
 * Sets the controlpoints
 * Calculates the number of parts in this animaion. (Trajectories that will be followed),
 * always the number of controlpoints - 1
 * Calculates the totalLentgh of the animation
 * Sets the currControlPoint to 0 currControlPoint is the point that is being processed
 * Sets the RPS to updatedPeriod
 * Kinc to know the vector incremenation for each update
 * calculates the number of reparts, supposed number of times the update is called before finshed
 * Time for updating state purpose
 * repartPoint is used to know the state of each trajectory
 * currPartitionPoint is used to know the current partition for each trajectory
 * currX, currY, currZ were the object is
 * RotAng, were the object is facing
 * xinc, yinc, zinc the incremental values for the current state update
 * State, goes from "waiting" to "start" to "end", is initialized as "waiting" because is not
 * finished but it has not started yet.
 * TransMatrix translation Matrix
 * RotMatrix rotation Matrix
 * Calls initialize
 * 
 */
function LinearAnimation(id, span, type, controlpoints, updatePeriod)
{
    this.animation = new Animation(id, span, type);
    this.controlpoints = controlpoints;
    this.numberofreparts = this.controlpoints.length - 1;

    this.totallength = this.setLength();
    
    this.currContrtrolPoint = 0;

    this.RPS = updatePeriod;

    this.kinc;

    this.reparts = this.RPS*this.getSpan();//distribuition through length
    this.currPartition = 0; //update state point, to use with repart
    this.Time;

    this.repartPoint;//for use with individual points
    this.currPartitionPoint = 0;//for use with currPartitionPoint
    
    this.currX;
    this.currY;
    this.currZ;

    this.rotAng = 0;

    this.xinc;
    this.yinc;
    this.zinc;

    this.transMatrix = mat4.create();   
    this.rotMatrix = mat4.create();

    this.state = "waiting";

    this.initialize();
};

/**
 * Get controlpoints
 * @returns controlpoints
 */
LinearAnimation.prototype.getControlPoints=function()
{
    return this.controlpoints;  
};

/**
 * Get Span
 * @returns animation span
 */
LinearAnimation.prototype.getSpan=function()
{
    return this.animation.getSpan();  
};

/**
 * Get type  
 * @returns animation type
 */
LinearAnimation.prototype.getType=function()
{
    return this.animation.getType();  
};

/**
 * Calculates the total lentgh of the animation by calculating 
 * all trajectories lentgh first
 * @returns length
 */
LinearAnimation.prototype.setLength=function()
{
      var length = 0;

      for(var i = 0; i < this.controlpoints.length - 1; i++)
      {
          var x1 = this.controlpoints[i]['x'];
          var y1 = this.controlpoints[i]['y'];
          var z1 = this.controlpoints[i]['z'];

          var x2 = this.controlpoints[i+1]['x'];
          var y2 = this.controlpoints[i+1]['y'];
          var z2 = this.controlpoints[i+1]['z'];

          var x = x2 - x1;
          var y = y2 - y1;
          var z = z2 - z1;

          length += Math.sqrt(x*x + y*y + z*z);         
      }
      return length;
};

/**
 * Get Length
 * @returns length
 */
LinearAnimation.prototype.getLength=function()
{
    return this.length;
};

/**
 * Calculates the speed for this animation, from the total length and span
 * @returns speed
 */
LinearAnimation.prototype.setSpeed=function()
{
      return this.length / this.animation.getSpan();
};

/**
 * Get Speed
 * @returns speed
 */
LinearAnimation.prototype.getSpeed=function()
{
    return this.speed;
};

/**
 * Get ID
 * @returns ID from animation
 */
LinearAnimation.prototype.getID=function()
{
    return this.animation.getID();  
};

/**
 * Updates animation acording to the currTime
 * 
 * @param currTime
 * 
 * Checks if the currPartition is 0, if true means it is the first time being called and sets the 
 * Time to the currTime when the animation update was called
 * Checks if state is "end" and if the currPartionPoint is 0, means is the first Time the update
 * for that trajectory is called, this is used to calculate initial values for the control point
 * Calculates x1, y1, z1, x2, y2, z2, which is the points for the vector to follow in this animation
 * (x1, y1, z1) is the start and (x2, y2, z2) is the end
 * currX, currY, currZ is set has x1, y1, z1
 * Vector is calculated from the start and end points
 * From the xv, yv, zv  (vector) values, the is calculated
 * if it is a animation in YY, the rotation stays the same, if not then the new rotAng is calculated
 * and the direction is set acording if xv is positive or not
 * a new RotMatrix is calculated.
 * Total vector Lentgh is calculated
 * The number of partitions for this vector is calculated from the total number of reparts and the
 * total trajectory length
 * the new kinc is calculated corresponding to this trajectory.
 * the new x, y, z are calculated and from that the xinc, yinc, and zinc for the current trajectory
 * A new transMatrix is created and currPartition and currPartitionPoint is incremented
 * IF the state is not "end" that the update itself will be called~.
 * Calculates the difference between the first time and the current Time when update was called
 * asserts Time for the currTime when it was called
 * This difference and asserting a new time when update was last called is usefull
 * because the update may not be called the exact number of times expected. When this happens
 * the real animation span is much bigger than expected. The currX, currY, and currZ are updated
 * the number of times the update was supposed to be called since the last time.
 * The currPartitionPoint and currPartition are asserted to have the parttion atualized
 * Checks if the currPartitonPoint is equal or bigger than the currPartiton, meanign
 * this trajectory is finished, incrementes the currControlPoint
 * finally checks if controlpoint is invalid or if the currPartiton is equal or bigger than repart
 * meaning this linear animation is finished, sets state to end. 
 */
LinearAnimation.prototype.update=function(currTime)
{
        if(this.currPartition == 0)
        {
            this.Time = currTime;
        }

        if(this.state != "end" && this.currPartitionPoint == 0)
        {

            //intial
   
            var x1 = parseFloat(this.controlpoints[this.currContrtrolPoint]['x']);
            var y1 = parseFloat(this.controlpoints[this.currContrtrolPoint]['y']);
            var z1 = parseFloat(this.controlpoints[this.currContrtrolPoint]['z']);

            var x2 = parseFloat(this.controlpoints[this.currContrtrolPoint + 1]['x']);
            var y2 = parseFloat(this.controlpoints[this.currContrtrolPoint + 1]['y']);           
            var z2 = parseFloat(this.controlpoints[this.currContrtrolPoint + 1]['z']);

            this.currX = x1;
            this.currY = y1;
            this.currZ = z1;

            var xv = x2 - x1;
            var yv = y2 - y1;
            var zv = z2 - z1;                       

            //rotation
            var veclengthXY = Math.sqrt(xv*xv + zv*zv);

            if(veclengthXY > 0) 
            {
                this.rotAng = Math.acos( (xv * 0 + zv * 1) / veclengthXY);
                
                if(xv < 0)
                {
                    this.rotAng = -this.rotAng;
                }

                var axisvec = vec3.fromValues(0,1,0);

                this.rotMatrix = mat4.create();
                this.rotMatrix = mat4.rotate(this.rotMatrix, this.rotMatrix, this.rotAng, axisvec);
            }            
            
            //translate 
            var veclength = Math.sqrt(xv*xv + yv*yv + zv*zv);

            this.repartPoint = (this.reparts * veclength) / this.totallength;
            
            this.kinc = (veclength / this.repartPoint) / veclength;


            var xnovo = x1 + this.kinc*(x2 - x1);
            var ynovo = y1 + this.kinc*(y2 - y1);
            var znovo = z1 + this.kinc*(z2 - z1);

            this.xinc = xnovo - x1;
            this.yinc = ynovo - y1;
            this.zinc = znovo - z1;

            var transvec = vec3.fromValues(this.currX, this.currY, this.currZ);
            this.transMatrix = mat4.create();

            mat4.translate(this.transMatrix, this.transMatrix,transvec);


           //increments
            this.currPartition++;
            this.currPartitionPoint++;

        }

        if(this.state != "end")
        {
            var diff = currTime - this.Time;

            this.Time = currTime;

            var n_part_asserts = (diff * this.RPS)  / 1000;
            var assertPoint = Math.round(n_part_asserts);

            for(var i = 0; i < assertPoint; i++)
            {
                this.currX += this.xinc;
                this.currY += this.yinc;
                this.currZ += this.zinc; 
            }

            

            var transvec = vec3.fromValues(this.currX, this.currY, this.currZ);
            this.transMatrix = mat4.create();

            mat4.translate(this.transMatrix, this.transMatrix,transvec);

            this.currPartition += assertPoint;
            this.currPartitionPoint += assertPoint;
        }
       
        if( this.currPartitionPoint >=  this.repartPoint)
        {
           this.currPartitionPoint = 0;
           this.currContrtrolPoint++;
        } 
   

        if(this.currPartition >= this.repart || this.currContrtrolPoint >= this.numberofreparts)
        {
            this.state = "end";
        }
   
};
/**
 * Initialize function for intializing values for the first controlpoint, this function is
 * usefull because the first display of object should already have the first transformation 
 * matrices set, for not displaying identity in a frame, before update is called
 * Calculates x1, y1, z1, x2, y2, z2, which is the points for the vector to follow in this animation
 * (x1, y1, z1) is the start and (x2, y2, z2) is the end
 * currX, currY, currZ is set has x1, y1, z1
 * Vector is calculated from the start and end points
 * From the xv, yv, zv  (vector) values, the is calculated
 * if it is a animation in YY, the rotation stays the same, if not then the new rotAng is calculated
 * and the direction is set acording if xv is positive or not
 * a new RotMatrix is calculated.
 * Total vector Lentgh is calculated
 * The number of partitions for this vector is calculated from the total number of reparts and the
 * total trajectory length
 * the new kinc is calculated corresponding to this trajectory.
 * the new x, y, z are calculated and from that the xinc, yinc, and zinc for the current trajectory
 * A new transMatrix is created.
 */
LinearAnimation.prototype.initialize=function()
{
        var x1 = parseFloat(this.controlpoints[this.currContrtrolPoint]['x']);
        var y1 = parseFloat(this.controlpoints[this.currContrtrolPoint]['y']);
        var z1 = parseFloat(this.controlpoints[this.currContrtrolPoint]['z']);

        var x2 = parseFloat(this.controlpoints[this.currContrtrolPoint + 1]['x']);
        var y2 = parseFloat(this.controlpoints[this.currContrtrolPoint + 1]['y']);           
        var z2 = parseFloat(this.controlpoints[this.currContrtrolPoint + 1]['z']);

        this.currX = x1;
        this.currY = y1;
        this.currZ = z1;

        var xv = x2 - x1;
        var yv = y2 - y1;
        var zv = z2 - z1;                       

        //rotation
        var veclengthXY = Math.sqrt(xv*xv + zv*zv);

        if(veclengthXY > 0) 
        {
            this.rotAng = Math.acos( (xv * 0 + zv * 1) / veclengthXY);

            if(xv < 0)
            {
                this.rotAng = -this.rotAng;
            }

            var axisvec = vec3.fromValues(0,1,0);

            this.rotMatrix = mat4.create();
            this.rotMatrix = mat4.rotate(this.rotMatrix, this.rotMatrix, this.rotAng, axisvec);
        }            

        //translate 
        var veclength = Math.sqrt(xv*xv + zv*zv);

        this.repartPoint = (this.reparts * veclength) / this.totallength;

        this.kinc = (veclength / this.repartPoint) / veclength;


        var xnovo = x1 + this.kinc*(x2 - x1);
        var ynovo = y1 + this.kinc*(y2 - y1);
        var znovo = z1 + this.kinc*(z2 - z1);

        this.xinc = xnovo - x1;
        this.yinc = ynovo - y1;
        this.zinc = znovo - z1;

        var transvec = vec3.fromValues(this.currX, this.currY, this.currZ);
        this.transMatrix = mat4.create();

        mat4.translate(this.transMatrix, this.transMatrix,transvec);
};