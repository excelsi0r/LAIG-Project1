/**
 * Rectangle
 * @param scene CGFscene where the Rectangle will be displayed
 * @param x1 x coordinate of the left top vertex
 * @param y1 y coordinate of the left top vertex
 * @param x2 x coordinate of the right bottom vertex
 * @param y2 y coordinate of the right bottom vertex
 * @constructor
 */
function MyRectangle(scene, x1, y1, x2, y2) 
{
    CGFobject.call(this,scene);

    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;

    this.initBuffers();
};

MyRectangle.prototype = Object.create(CGFobject.prototype);
MyRectangle.prototype.constructor=MyRectangle;
/**
 * Updates the Rectangle length factors
 * @param lengthS s domain length factor
 * @param lengthT t domain length factor
 */
MyRectangle.prototype.updateTextureCoords=function(lengthS, lengthT)
{ 
    this.texCoords = [
     		lengthS, 0, //0
     		0, 0, //1
     		0, lengthT, //2
     		lengthS, lengthT//3
    ];

    this.updateTexCoordsGLBuffers();
};
/**
 * Initializes the Rectangle buffers (vertices, indices, normals and texCoords)
 */
MyRectangle.prototype.initBuffers = function () {
    this.vertices = [
        this.x1, this.y1, 0, //0
        this.x1, this.y2, 0, //1
        this.x2, this.y2, 0, //2
        this.x2, this.y1, 0  //3
    ];
    this.indices = [
        0,1,2,
        2,3,0
    ];
    this.normals = [
        0,0,1,
        0,0,1,
        0,0,1,
        0,0,1
    ];
    this.texCoords = [
        0,0,
        0,1,
        1,1,
        1,0
    ];

    this.primitiveType=this.scene.gl.TRIANGLES;
    this.initGLBuffers();
}