function MySkybox(scene, id, folder)
{
    this.id = id;
    this.scene = scene;
    this.folder = folder;

    this.wall = new MyQuad(this.scene);

    this.textureUp = new CGFtexture(this.scene, "../skybox/" + folder + "/up.png");
    this.textureDown = new CGFtexture(this.scene, "../skybox/" + folder + "/down.png");
    this.textureLeft = new CGFtexture(this.scene, "../skybox/" + folder + "/left.png");
    this.textureRight = new CGFtexture(this.scene, "../skybox/" + folder + "/right.png");
    this.textureFront = new CGFtexture(this.scene, "../skybox/" + folder + "/front.png");
    this.textureBack = new CGFtexture(this.scene, "../skybox/" + folder + "/back.png");

    this.appearence = new CGFappearance(this.scene);
    this.appearence.setAmbient(1,1,1,1);
};

MySkybox.prototype.display=function()
{
    //down image
    this.scene.pushMatrix();

        this.appearence.setTexture(this.textureDown);
        this.appearence.apply();
        
        this.scene.translate(0,-250,0);
        this.scene.scale(502,502,502);
        this.scene.rotate(Math.PI/2, -1,0,0);
        
        this.wall.display();

    this.scene.popMatrix();

    //front image
    this.scene.pushMatrix();

        this.appearence.setTexture(this.textureFront);
        this.appearence.apply();
        
        this.scene.translate(0,0,-250);
        this.scene.scale(502,502,502);
        
        this.scene.rotate(Math.PI/2, 0,0,0);
        
        this.wall.display();

    this.scene.popMatrix();

    //back image
    this.scene.pushMatrix();

        this.appearence.setTexture(this.textureBack);
        this.appearence.apply();
        
        this.scene.translate(0,0,250);
        this.scene.scale(502,502,502);
        this.scene.rotate(Math.PI, 0,0,1);
        this.scene.rotate(Math.PI, -1,0,0);
        
        this.wall.display();

    this.scene.popMatrix();


    //left image
    this.scene.pushMatrix();

        this.appearence.setTexture(this.textureLeft);
        this.appearence.apply();
        
        this.scene.translate(-250,0,0);
        this.scene.scale(502,502,502);
        this.scene.rotate(Math.PI/2, 0,1,0);
        
        this.wall.display();

    this.scene.popMatrix();

    //right image
    this.scene.pushMatrix();

        this.appearence.setTexture(this.textureRight);
        this.appearence.apply();
        
        this.scene.translate(250,0,0);
        this.scene.scale(502,502,502);
        this.scene.rotate(Math.PI/2, 0,-1,0);
        
        this.wall.display();

    this.scene.popMatrix();

    //up image
    this.scene.pushMatrix();

        this.appearence.setTexture(this.textureUp);
        this.appearence.apply();
        
        this.scene.translate(0,250,0);
        this.scene.scale(502,502,502);
        this.scene.rotate(Math.PI, 0,1,0);
        this.scene.rotate(Math.PI/2, 1,0,0);
        
        this.wall.display();

    this.scene.popMatrix();
};
