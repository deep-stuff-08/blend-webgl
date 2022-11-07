#version 300 es

layout(location = 0)in vec2 vPos;
layout(location = 1)in vec3 vCol;

out vec4 incolor;

void main(void) {
	gl_Position = vec4(vPos, 0.0, 1.0);
	incolor = vec4(vCol, 1.0);
}
