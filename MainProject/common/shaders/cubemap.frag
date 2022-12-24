#version 300 es
precision highp float;

uniform samplerCube texCube;

in vec3 tc;

layout(location = 0) out vec4 color;

void main(void) {
	color = texture(texCube, tc);
}