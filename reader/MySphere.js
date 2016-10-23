function MySphere(scene,radius,slices,stacks) {
    CGFobject.call(this,scene);

    this.radius = radius;
    this.slices = slices;
    this.stacks = stacks;

    this.initBuffers();
};

MySphere.prototype = Object.create(CGFobject.prototype);
MySphere.prototype.constructor=MySphere;


/*
 MySphere.prototype.updateTexCoords=function(amplifS, amplifT){

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

MySphere.prototype.initBuffers = function () {
    this.vertices = [];
    this.normals = [];
    this.indices = [];

    for(var s = 0;s <= this.stacks; s++){
        var verticalAngle = s * Math.PI/this.stacks;
        var cosV = Math.cos(verticalAngle);
        var sinV = Math.sin(verticalAngle);

        for(var l=0;l<=this.slices;l++){
            var horizontalAngle = l * Math.PI * 2 / this.slices;
            var cosH = Math.cos(horizontalAngle);
            var sinH = Math.sin(horizontalAngle);

            this.vertices.push(this.radius*sinV*cosH,this.radius*sinV*sinH,this.radius*cosV);
            this.normals.push(sinV*cosH,sinV*sinH,cosV);
        }
    }

    for (var s = 0; s < this.stacks; s++) {
        for (var l = 0; l < this.slices; l++) {
            this.indices.push((s * (this.slices + 1)) + l,(s * (this.slices + 1)) + l + this.slices + 1,(s * (this.slices + 1)) + l+1);
            this.indices.push((s * (this.slices + 1)) + l + this.slices + 1,(s * (this.slices + 1)) + l + this.slices + 2,(s * (this.slices + 1)) + l + 1);
        }
    }


    this.primitiveType=this.scene.gl.TRIANGLES;
    this.initGLBuffers();
}