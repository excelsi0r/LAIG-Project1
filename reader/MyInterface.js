function MyInterface()
{
  CGFinterface.call(this);  
};

MyInterface.prototype = Object.create(CGFinterface.prototype);
MyInterface.prototype.constructor = MyInterface;

/**
 * Function called when Interface is created. Creates new Lights Folder
 */
MyInterface.prototype.init = function(application)
{
    CGFinterface.prototype.init.call(this,application);
    this.gui= new dat.GUI();
    this.lightsgroup= this.gui.addFolder("Lights");
    this.lightsgroup.open();
};
/**
 * Pushes all the lights to the Lights folder.
 */
MyInterface.prototype.addLights=function(lights)
{
    this.scene.lightstates = [];
    for(var i = 0; i < lights.length; i++)
    {
        var id = lights[i]['id'];

        this.scene.lightstates[id]=lights[i]['enabled'];
        this.lightsgroup.add(this.scene.lightstates,lights[i].id);
    }
}; 

MyInterface.prototype.processKeyboard = function(event) 
{
	CGFinterface.prototype.processKeyboard.call(this,event);
	switch (event.keyCode)
	{
		case(86): //V
            this.scene.updateCamera();
            break;
        case(118)://v
            this.scene.updateCamera();
            break;
        case(77): //M
            this.scene.materialsUpdate();
            break;
        case(109): //m
            this.scene.materialsUpdate();
            break;
	};
};