#version 300 es
precision highp float;

in vec2 texcoords;

uniform sampler2D woodTex;
uniform sampler2D fireTex;

out vec4 FragColor;

void main(void) {
	FragColor = vec4(texture(woodTex, texcoords).rgb, 1.0);
}