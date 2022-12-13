#version 300 es

layout(location = 0)in vec4 vPos;
layout(location = 1)in vec3 vNor;
layout(location = 2)in vec2 vTex;

uniform mat4 pMat;
uniform mat4 vMat;
uniform mat4 mMat;

out vec2 Tex;

void main(void) {
	Tex = vTex;
	gl_Position = pMat * vMat * mMat * vPos;
}
