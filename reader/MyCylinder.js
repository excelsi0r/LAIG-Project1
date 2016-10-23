/**
 * Cylinder
 * @param scene CGFscene where the Cylinder will be displayed
 * @param base radius of the bottom base of the cylinder, placed on the (0, 0, 0) point
 * @param top radius of the top base of the cylinder
 * @param height Cylinder height
 * @param slices ammount of slices the Cylinder will be divided into along its perimeter
 * @param stacks ammount of stacks the Cylinder will be divided along its height
 * @constructor
 */
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

/**
 * Initializes the Cylinder buffers (vertices, indices, normals and texCoords)
 */
MyCylinder.prototype.initBuffers = function () 
{
    this.vertices = [];
    this.normals = [];
    this.indices = [];
    //vertices and normals
    var step = this.height/this.stacks;
    var deltaRadius = (this.top - this.base);
    var delta = 2 * Math.PI/this.slices;
    
    for(var i = 0 ; i <= this.stacks ; i++)
    {
       var radPercent = i/this.stacks;
       var radius = radPercent * deltaRadius + this.base;

        for(var j = 0; j < this.slices; j++)
        {
            var angle = j * delta;
            this.vertices.push(radius * Math.cos(angle), radius * Math.sin(angle), i * step);
            this.normals.push(Math.cos(angle), Math.sin(angle), 0);
        }
    }
    //indices
    var currentSlice = 1;
    for(var i = 0; i < this.slices*this.stacks; i++)
    {
        if(currentSlice == this.slices) 
        { 
            this.indices.push(i, i - this.slices + 1, i + this.slices);
            this.indices.push(i+this.slices, i - this.slices + 1, i + 1);
            currentSlice = 1;
        }
        else
        {
            this.indices.push(i, i+1, i + this.slices);
            if(i != this.slices * this.stacks - 1)
                this.indices.push(i+this.slices, i + 1, i + 1 + this.slices);
            currentSlice++;
        }
    }
    //Top
    this.vertices.push(0,0,0); //base center
    this.vertices.push(0,0,this.height); //top center
    var baseCenter = (this.vertices.length/3) - 2;
    var topCenter = (this.vertices.length/3) - 1;
    for(var i = 0; i < this.slices; i++) 
    {
        this.normals.push(0, 0, -1);
        this.normals.push(0, 0, 1);
    }
    currentSlice = 1;
    for(var j = 0; j < this.slices; j++)
    {
        if(currentSlice == this.slices) 
        {
            this.indices.push(baseCenter, j + 1 - this.slices, j);
            this.indices.push(j + this.stacks * this.slices, j + this.stacks * this.slices-this.slices + 1, topCenter);
            currentSlice = 1;
        }
        this.indices.push(baseCenter, j + 1, j);
        this.indices.push(j + this.stacks * this.slices, j + 1 + this.stacks * this.slices, topCenter);
        currentSlice++;
    }
    
    this.primitiveType=this.scene.gl.TRIANGLES;
    this.initGLBuffers();
}