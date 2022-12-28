#version 300 es

layout(location = 0)in vec4 vPos;

void main(void) {
	gl_Position = vPos;
}
