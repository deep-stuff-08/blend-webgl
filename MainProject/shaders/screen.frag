#version 300 es

precision highp float;

in vec2 Tex;

uniform sampler2D samplerDiffuse;

out vec4 color;

void main(void) {
	color = texture(samplerDiffuse, Tex);
}