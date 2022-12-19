#version 300 es

layout(location = 0)in vec4 vPos;
layout(location = 1)in vec3 vNor;
layout(location = 2)in vec2 vTex;

out vec3 fragPos;
out vec3 normal;
out vec2 texCoords;

uniform mat4 pMat;
uniform mat4 vMat;
uniform mat4 mMat;
uniform int normalDirection;

void main(void) {
	fragPos = vec3(mMat * vPos);
	normal = transpose(inverse(mat3(mMat))) * float(normalDirection) * vNor;
	texCoords = vTex;
	gl_Position = pMat * vMat * mMat * vPos;
}