#ifdef GL_ES
precision highp float; //set precision
#endif

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform float du;
uniform float dv;
uniform float su;
uniform float sv;

//get X index
float getX()
{

	float position = floor(aTextureCoord.s*du);
	return position;
}

//get Y index
float getY()
{

	float position = floor(aTextureCoord.t*dv);
	return position;
}

void main()
{
	float X = getX();
	float Y = getY();
	
	vec3 trans = vec3(0.0, 0.0, 0.0);
	//X and Y are su and sv it is the selected position
	if(X == su && Y == sv)
	{
		trans.z = 0.02;
	}

	gl_Position = uPMatrix*uMVMatrix*vec4(aVertexPosition + trans, 1.0);
	vTextureCoord = aTextureCoord;
}