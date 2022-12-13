#version 300 es

in vec4 vPos;
in vec3 vNor;
in vec2 vTex;

uniform mat4 pMat;
uniform mat4 vMat;
uniform mat4 mMat;

out vec3 inN;
out vec3 inP;
out vec3 viewPos;
out vec2 tex;

void main(void) {
	inN = mat3(mMat) * vNor;
	inP = vec3(mMat * vPos);
	viewPos = vMat[3].xyz;
	tex = vTex;
	gl_Position = pMat * vMat * mMat * vPos;
}