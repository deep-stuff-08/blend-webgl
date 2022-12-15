#version 300 es

layout(location = 0)in vec4 vPos;

uniform mat4 lpMat;
uniform mat4 mMat;

void main(void) {
	gl_Position = lpMat * mMat * vPos;
}