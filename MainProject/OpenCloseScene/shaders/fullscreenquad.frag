#version 300 es
precision highp float;

in vec2 texcoords;

uniform sampler2D fireTex;

out vec4 FragColor;

void main(void) {
	vec4 color = texture(fireTex, texcoords);
	FragColor = vec4(color.rgba);
}