function MyCylinder(scene,base,top,height,slices,stacks) {
    CGFobject.call(this,scene);

    this.base = base;
    this.top = top;
    this.height = height;
    this.slices = slices;
    this.stacks = stacks;

    this.initBuffers();
};

MyCylinder.prototype = Object.create(CGFobject.prototype);
MyCylinder.prototype.constructor=MyCylinder;


/*
 MyCylinder.prototype.updateTexCoords=function(amplifS, amplifT){

 var width = this.Rbotx;
 var height = this.Ltopy;

 this.texCoords = [
 0,0,
 0.0, height /amplifT,
 width /amplifS, height /amplifT,
 width /amplifS, 0.0
 ];


 this.updateTexCoordsGLBuffers();


 };
 */

MyCylinder.prototype.initBuffers = function () {
    this.vertices = [];
    this.normals = [];
    this.indices = [];
    ///////////////Corpo
    //vertices + normais
    var step = this.height/this.stacks;
    var radius_difference = (this.top - this.base);
    var alpha = 2 * Math.PI/this.slices;
    for(var h=0 ; h <= this.stacks ; h++){

       var radius_percentage = h/this.stacks;
       var radius = radius_percentage * radius_difference + this.base;

        for(var s=0;s < this.slices;s++){
            var angle = s*alpha;
            this.vertices.push(radius*Math.cos(angle),radius*Math.sin(angle),h*step);
            this.normals.push(Math.cos(angle), Math.sin(angle), 0);
        }
    }
    //indices
    var current_slice = 1;
    for(var t=0;t<this.slices*this.stacks;t++){

        if(current_slice == this.slices) { //quando chega à última slice, queremos que ligue o vertice ao primeiro e não ao primeiro da próxima stack
            this.indices.push(t, t - this.slices + 1, t + this.slices);
            this.indices.push(t+this.slices, t - this.slices + 1, t + 1);
            current_slice = 1;
        }
        else{
            this.indices.push(t,t+1,t+this.slices);
            if(t != this.slices*this.stacks - 1)
                this.indices.push(t+this.slices,t+1,t+1+this.slices);
            current_slice++;
        }
    }
    /////////////////////////////////////////////////////////////
    /////////Tampas
    this.vertices.push(0,0,0); //centro base
    this.vertices.push(0,0,this.height); //centro top
    var bot_center = (this.vertices.length/3) - 2;
    var top_center = (this.vertices.length/3) - 1;
    for(var i = 0; i<this.slices;i++) {
        this.normals.push(0, 0, -1);
        this.normals.push(0, 0, 1);
    }
    current_slice = 1;
    for(var x = 0; x < this.slices ; x++){
        if(current_slice == this.slices) { //quando chega à última slice, queremos que ligue o vertice ao primeiro e não ao primeiro da próxima stack
            this.indices.push(bot_center, x+1-this.slices, x);
            this.indices.push(x+this.stacks*this.slices,x+this.stacks*this.slices-this.slices+1,top_center);
            current_slice = 1;
        }
        this.indices.push(bot_center,x+1,x);
        this.indices.push(x+this.stacks*this.slices,x+1+this.stacks*this.slices,top_center);
        current_slice++;
    }
    ////////////////////////////////////////////////////////////
    this.primitiveType=this.scene.gl.TRIANGLES;
    this.initGLBuffers();
}