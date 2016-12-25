#ifdef GL_ES
precision highp float; //set precision
#endif

varying vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform float divX;
uniform float divY;


uniform bool s11, s12, s13, s14, s15, s16, s17, s18, s19;
uniform bool s21, s22, s23, s24, s25, s26, s27, s28, s29;
uniform bool s31, s32, s33, s34, s35, s36, s37, s38, s39;
uniform bool s41, s42, s43, s44, s45, s46, s47, s48, s49;
uniform bool s51, s52, s53, s54, s55, s56, s57, s58, s59;
uniform bool s61, s62, s63, s64, s65, s66, s67, s68, s69;
uniform bool s71, s72, s73, s74, s75, s76, s77, s78, s79;
uniform bool s81, s82, s83, s84, s85, s86, s87, s88, s89;
uniform bool s91, s92, s93, s94, s95, s96, s97, s98, s99;


uniform float sr;
uniform float sg;
uniform float sb;
uniform float sa;

uniform float parts;
uniform float animdur;
uniform float update;

//get X index
float getX()
{
	float position = floor(vTextureCoord.s*divX);
	return position;
}

//get Y index
float getY()
{
	float position = floor(vTextureCoord.t*divY);
	return position;
}

float getSelectedValues(float X, float Y);

void main()
{
	
	//update animation
	float scale;

	if(update >= 0.0 && update < (animdur / 2.0))
	{
		scale = update / (animdur / 2.0);
	}
	else
	{
		scale = (animdur - update) / (animdur / 2.0);
	}
	

	//color update
	vec4 color = texture2D(uSampler, vTextureCoord);

	float su = getX();
	float sv = getY();

	float render = getSelectedValues(su, sv);

	if(render == 1.0)
	{	
		float divXparts = divX * parts;
		float divYparts = divY * parts;

		float actualdu = vTextureCoord.s * divXparts;
		float actualdv = vTextureCoord.t * divYparts;

		float sumiddle = (su * parts) + (parts/2.0);
		float svmiddle = (sv * parts) + (parts/2.0);

		float distText = sqrt((sumiddle-actualdu)*(sumiddle-actualdu) + (svmiddle-actualdv)*(svmiddle-actualdv));

		if(distText <= ((parts / 2.0) + 0.0))
		{
			color.r += sr*scale;
			color.g += sg*scale;
			color.b += sb*scale;
		}
	}

	gl_FragColor = color;
}

float getSelectedValues(float X, float Y)
{
	if(Y >= 1.0 && Y <= 9.0 && X >= 1.0 && X <= 9.0)
	{

		if(Y == 1.0)
		{
			if(s11 == true && X == 1.0) return 1.0;
			if(s12 == true && X == 2.0) return 1.0;
			if(s13 == true && X == 3.0) return 1.0;
			if(s14 == true && X == 4.0) return 1.0;
			if(s15 == true && X == 5.0) return 1.0;
			if(s16 == true && X == 6.0) return 1.0;
			if(s17 == true && X == 7.0) return 1.0;
			if(s18 == true && X == 8.0) return 1.0;
			if(s19 == true && X == 9.0) return 1.0;

		}
		else if(Y == 2.0)
		{
			if(s21 == true && X == 1.0) return 1.0;
			if(s22 == true && X == 2.0) return 1.0;
			if(s23 == true && X == 3.0) return 1.0;
			if(s24 == true && X == 4.0) return 1.0;
			if(s25 == true && X == 5.0) return 1.0;
			if(s26 == true && X == 6.0) return 1.0;
			if(s27 == true && X == 7.0) return 1.0;
			if(s28 == true && X == 8.0) return 1.0;
			if(s29 == true && X == 9.0) return 1.0;
		}
		else if(Y == 3.0)
		{
			if(s31 == true && X == 1.0) return 1.0;
			if(s32 == true && X == 2.0) return 1.0;
			if(s33 == true && X == 3.0) return 1.0;
			if(s34 == true && X == 4.0) return 1.0;
			if(s35 == true && X == 5.0) return 1.0;
			if(s36 == true && X == 6.0) return 1.0;
			if(s37 == true && X == 7.0) return 1.0;
			if(s38 == true && X == 8.0) return 1.0;
			if(s39 == true && X == 9.0) return 1.0;		
		}
		else if(Y == 4.0)
		{
			if(s41 == true && X == 1.0) return 1.0;
			if(s42 == true && X == 2.0) return 1.0;
			if(s43 == true && X == 3.0) return 1.0;
			if(s44 == true && X == 4.0) return 1.0;
			if(s45 == true && X == 5.0) return 1.0;
			if(s46 == true && X == 6.0) return 1.0;
			if(s47 == true && X == 7.0) return 1.0;
			if(s48 == true && X == 8.0) return 1.0;
			if(s49 == true && X == 9.0) return 1.0;
		}
		else if(Y == 5.0)
		{
			if(s51 == true && X == 1.0) return 1.0;
			if(s52 == true && X == 2.0) return 1.0;
			if(s53 == true && X == 3.0) return 1.0;
			if(s54 == true && X == 4.0) return 1.0;
			if(s55 == true && X == 5.0) return 1.0;
			if(s56 == true && X == 6.0) return 1.0;
			if(s57 == true && X == 7.0) return 1.0;
			if(s58 == true && X == 8.0) return 1.0;
			if(s59 == true && X == 9.0) return 1.0;
		}
		else if(Y == 6.0)
		{
			if(s61 == true && X == 1.0) return 1.0;
			if(s62 == true && X == 2.0) return 1.0;
			if(s63 == true && X == 3.0) return 1.0;
			if(s64 == true && X == 4.0) return 1.0;
			if(s65 == true && X == 5.0) return 1.0;
			if(s66 == true && X == 6.0) return 1.0;
			if(s67 == true && X == 7.0) return 1.0;
			if(s68 == true && X == 8.0) return 1.0;
			if(s69 == true && X == 9.0) return 1.0;
		}
		else if(Y == 7.0)
		{
			if(s71 == true && X == 1.0) return 1.0;
			if(s72 == true && X == 2.0) return 1.0;
			if(s73 == true && X == 3.0) return 1.0;
			if(s74 == true && X == 4.0) return 1.0;
			if(s75 == true && X == 5.0) return 1.0;
			if(s76 == true && X == 6.0) return 1.0;
			if(s77 == true && X == 7.0) return 1.0;
			if(s78 == true && X == 8.0) return 1.0;
			if(s79 == true && X == 9.0) return 1.0;
		}
		else if(Y == 8.0)
		{
			if(s81 == true && X == 1.0) return 1.0;
			if(s82 == true && X == 2.0) return 1.0;
			if(s83 == true && X == 3.0) return 1.0;
			if(s84 == true && X == 4.0) return 1.0;
			if(s85 == true && X == 5.0) return 1.0;
			if(s86 == true && X == 6.0) return 1.0;
			if(s87 == true && X == 7.0) return 1.0;
			if(s88 == true && X == 8.0) return 1.0;
			if(s89 == true && X == 9.0) return 1.0;
		}
		else if(Y == 9.0)
		{
			if(s91 == true && X == 1.0) return 1.0;
			if(s92 == true && X == 2.0) return 1.0;
			if(s93 == true && X == 3.0) return 1.0;
			if(s94 == true && X == 4.0) return 1.0;
			if(s95 == true && X == 5.0) return 1.0;
			if(s96 == true && X == 6.0) return 1.0;
			if(s97 == true && X == 7.0) return 1.0;
			if(s98 == true && X == 8.0) return 1.0;
			if(s99 == true && X == 9.0) return 1.0;
		}
	}
	return 0.0;

}

