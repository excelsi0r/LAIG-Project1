function MyTriangle(scene,x1,y1,z1,x2,y2,z2,x3,y3,z3) {
    CGFobject.call(this,scene);

    this.x1 = x1;
    this.x2 = x2;
    this.x3 = x3;
    this.y1 = y1;
    this.y2 = y2;
    this.y3 = y3;
    this.z1 = z1;
    this.z2 = z2;
    this.z3 = z3;

    this.initBuffers();
};

MyTriangle.prototype = Object.create(CGFobject.prototype);
MyTriangle.prototype.constructor=MyTriangle;

/*
MyTriangle.prototype.updateTexCoords=function(amplifS, amplifT){

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

MyTriangle.prototype.initBuffers = function () {

    this.vertices = [
        this.x1, this.y1, this.z1,
        this.x2, this.y2, this.z2,
        this.x3, this.y3, this.z3
    ];

    this.indices = [
        0,1,2
    ];

    var v1 = [  this.x1-this.x2,
                this.y1-this.y2,
                this.z1-this.z2];

    var v2 = [  this.x1-this.x3,
                this.y1-this.y3,
                this.z1-this.z3];
    var normal = vec3.create();
    vec3.cross(normal,v1,v2);

    this.normals = [
        normal[0],normal[1],normal[2],
        normal[0],normal[1],normal[2],
        normal[0],normal[1],normal[2]
    ];


    this.primitiveType=this.scene.gl.TRIANGLES;
    this.initGLBuffers();
}