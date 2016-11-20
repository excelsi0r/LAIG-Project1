#ifdef GL_ES
precision highp float;
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

float getX()
{
	float position = floor(vTextureCoord.s*du);
	return position;
}

float getY()
{
	float position = floor(vTextureCoord.t*dv);
	return position;
}

void main()
{
	vec4 color = texture2D(uSampler, vTextureCoord);
	
	float X = getX();
	float Y = getY();

	float sum = X + Y;

	float remain = mod(sum, 2.0);

	if(remain == 0.0)
	{
		color.r += c1R*0.4;
		color.g += c1G*0.4;
		color.b += c1B*0.4;
	}
	else
	{
		color.r += c2R*0.4;
		color.g += c2G*0.4;
		color.b += c2B*0.4;
	}

	if(X == su && Y == sv)
	{
		color.r += c3R*0.4;
		color.g += c3G*0.4;
		color.b += c3B*0.4;
	}


	

	gl_FragColor = color;
}