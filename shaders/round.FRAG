#ifdef GL_ES
precision highp float; //set precision
#endif

varying vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform float du;
uniform float dv;
uniform float su;
uniform float sv;

uniform float c1R;
uniform float c1G;
uniform float c1B;
uniform float c1A;

uniform float c2R;
uniform float c2G;
uniform float c2B;
uniform float c2A;

uniform float c3R;
uniform float c3G;
uniform float c3B;
uniform float c3A;

uniform float update;

void main()
{
	vec4 color = texture2D(uSampler, vTextureCoord);
	
	float duparts = du * 10.0;
	float dvparts = dv * 10.0;

	float actualdu = vTextureCoord.s * duparts;
	float actualdv = vTextureCoord.t * dvparts;

	float sumiddle = su * 10.0 + 5.0;
	float svmiddle = sv * 10.0 + 5.0;

	float distText = sqrt((sumiddle-actualdu)*(sumiddle-actualdu) + (svmiddle-actualdv)*(svmiddle-actualdv));

	float scale;

	if(update >= 0.0 && update < 30.0)
	{
		scale = update / 30.0;
	}
	else
	{
		scale = (60.0 - update) / 30.0;
	}
	

	if(distText <= 5.0)
	{
		color.r += c3R*scale;
		color.g += c3G*scale;
		color.b += c3B*scale;
	}



	gl_FragColor = color;
}