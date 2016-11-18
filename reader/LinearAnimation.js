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

    this.rotAng;

    this.xinc;
    this.yinc;
    this.zinc;

    this.transMatrix = mat4.create();   
    this.rotMatrix = mat4.create();

    this.state = "start";
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


LinearAnimation.prototype.getLength=function()
{
    return this.length;
};

LinearAnimation.prototype.setSpeed=function()
{
      return this.length / this.animation.getSpan();
};

LinearAnimation.prototype.getSpeed=function()
{
    return this.speed;
};

LinearAnimation.prototype.getCoords=function()
{
    return this.coords;  
};

LinearAnimation.prototype.getID=function()
{
    return this.animation.getID();  
};

LinearAnimation.prototype.update=function(currTime)
{
    
       /* console.log("State: ", this.state);
        console.log("Repart:" , this.repart);
        console.log("CurrRepart: ", this.currPartition);
        console.log("Length:", this.length);
        console.log("Speed: ", this.speed);
        console.log("Kinc: ", this.kinc);
        console.log("Matrix: ", this.transMatrix);*/
   

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


           //increments
            this.currPartition++;
            this.currPartitionPoint++;

        }

        else if(this.state != "end")
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

      //  console.log(this.transvec);
   
};