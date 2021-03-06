#ifdef GL_ES
precision highp float; //set precision
#endif

varying vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform float divX;
uniform float divY;
uniform float su;
uniform float sv;

uniform float sr;
uniform float sg;
uniform float sb;
uniform float sa;

uniform float parts;
uniform float animdur;
uniform float update;

void main()
{
	vec4 color = texture2D(uSampler, vTextureCoord);
	
	float divXparts = divX * parts;
	float divYparts = divY * parts;

	float actualdu = vTextureCoord.s * divXparts;
	float actualdv = vTextureCoord.t * divYparts;

	float sumiddle = (su * parts) + (parts/2.0);
	float svmiddle = (sv * parts) + (parts/2.0);

	float distText = sqrt((sumiddle-actualdu)*(sumiddle-actualdu) + (svmiddle-actualdv)*(svmiddle-actualdv));

	float scale;

	if(update >= 0.0 && update < (animdur / 2.0))
	{
		scale = update / (animdur / 2.0);
	}
	else
	{
		scale = (animdur - update) / (animdur / 2.0);
	}
	

	if(distText <= ((parts / 2.0) + 0.0))
	{
		color.r += sr*scale;
		color.g += sg*scale;
		color.b += sb*scale;
	}

	gl_FragColor = color;
}