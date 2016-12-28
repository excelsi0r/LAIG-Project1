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

    //adding scenes 
    this.skyboxes = this.gui.addFolder("Scenes");
    this.skyboxes.open();

    //adding game states box
    this.gamemode = this.gui.addFolder("Game Mode");
    this.gamemode.open();
    this.gamemode.add(this.scene, "GameMode", this.scene.GameModelist);

};
/**
 * Pushes all the lights to the Lights folder.
 * Creates a lightstates array to save the states of each light
 * each index saves the state of the light in the same index
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


MyInterface.prototype.addSkyboxes=function()
{
	 
	this.skyboxes.add(this.scene, "Skybox", this.scene.SkyboxesList);
};
/**
 * Overload the process Keyboard fucntion.
 * When M/m is pressed changes materials of every Node in the graph
 * When V/v is pressed changes the actvie camera of the scene
 */
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