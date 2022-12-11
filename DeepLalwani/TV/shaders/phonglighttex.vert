#version 300 es

layout(location = 0)in vec4 vPos;
layout(location = 1)in vec3 vNor;
layout(location = 2)in vec2 vTex;

uniform mat4 pMat;
uniform mat4 vMat;
uniform mat4 mMat;
uniform bool isInvertNormal;

out vec2 Tex;
out vec3 N;
out vec3 P;
out vec3 viewPos;

void main(void) {
	gl_Position = pMat * vMat * mMat * vPos;
	Tex = vTex;
	if(isInvertNormal) {
		N = mat3(mMat) * -vNor;
	} else {
		N = mat3(mMat) * vNor;
	}
	P = vec3(mMat * vPos);	
	viewPos = vMat[3].xyz;
}
