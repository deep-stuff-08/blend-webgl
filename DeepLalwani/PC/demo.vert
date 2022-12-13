#version 300 es

layout(location = 0)in vec4 vPos;
layout(location = 1)in vec3 vNor;
layout(location = 2)in vec2 vTex;
layout(location = 3)in ivec4 vBoneIds;
layout(location = 4)in vec4 vWeights;

uniform mat4 pMat;
uniform mat4 vMat;
uniform mat4 mMat;
uniform mat4 bMat[100];
uniform bool isStatic;

out vec2 Tex;
out vec3 N;
out vec3 P;

void main(void) {
	gl_Position = pMat * vMat * mMat * vPos;
	Tex = vTex;
	N = mat3(mMat) * vNor;
	P = vec3(mMat * vPos);	
}
