#version 300 es
precision highp float;

in vec2 texcoords;

uniform sampler2D woodTex;

out vec4 FragColor;

void main(void) {
	FragColor = texture(woodTex, texcoords);
}