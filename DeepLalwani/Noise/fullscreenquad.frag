#version 300 es
precision highp float;

in vec2 texcoords;

uniform sampler2D woodTex;
uniform sampler2D fireTex;

out vec4 FragColor;

void main(void) {
	vec4 color = texture(fireTex, texcoords); 
	FragColor = vec4(mix(texture(woodTex, texcoords).rgb, color.rgb, color.a), 1.0);
}