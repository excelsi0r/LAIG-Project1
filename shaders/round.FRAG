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

	if(distText <= 5.0)
	{
		color.r += c3R*0.4;
		color.g += c3G*0.4;
		color.b += c3B*0.4;
	}



	gl_FragColor = color;
}