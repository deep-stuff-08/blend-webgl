#version 300 es

layout(location = 0)in vec4 vPos;
layout(location = 1)in vec2 vTex;
layout(location = 2)in vec3 vInsPos;

uniform mat4 pMat;
uniform mat4 vMat;
uniform mat4 mMat;

out vec2 texcoords;

void main(void) {
	texcoords = vTex;
	gl_Position = pMat * vMat * ((mMat * vPos) + vec4(vInsPos, 0.0));
}