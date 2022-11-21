#version 300 es

layout(location = 0)in vec4 vPos;
layout(location = 1)in vec3 vNor;
layout(location = 2)in vec2 vTex;
layout(location = 3)in vec3 vTan;
layout(location = 4)in vec3 vBTan;
layout(location = 5)in vec4 vCol;

uniform mat4 pMat;
uniform mat4 vMat;
uniform mat4 mMat;

out vec2 Tex;
out vec4 Color;
out vec3 N;
out vec3 P;

void main(void) {
	gl_Position = pMat * vMat * mMat * vPos;
	Color = vCol;
	Tex = vTex;
	N = mat3(transpose(inverse(mMat))) * vNor;
	P = vec3(mMat * vPos);
}
