#ifdef GL_ES
precision highp float; //set precision
#endif

varying vec2 vTextureCoord;
uniform sampler2D uSampler;


void main()
{
	vec4 color = texture2D(uSampler, vTextureCoord);

	color.a = 0.0;

	gl_FragColor = color;
}