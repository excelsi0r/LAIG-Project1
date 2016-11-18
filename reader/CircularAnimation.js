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

CircularAnimation.prototype.getID=function()
{
    return this.animation.getID();  
};

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