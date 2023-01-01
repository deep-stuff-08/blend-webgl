#version 300 es

layout(location = 0)in vec4 vPos;
layout(location = 1)in vec3 vNor;
layout(location = 2)in vec2 vTex;

uniform mat4 pMat;
uniform mat4 vMat;
uniform mat4 mMat;
//amplitude-x
//direction-yz
//wavelenght-w
uniform float time;
uniform vec4 oceanData[10];

out vec2 Tex;
out vec3 N;
out vec3 P;
out vec3 viewPos;
out vec4 C;

void main(void) {
	vec4 newPos = vPos;
	for(int i = 0; i < 10; i++) {
		float amplitude = oceanData[i].x / 10.0;
		vec2 direction = oceanData[i].yz;
		float frequency = 3.14 / oceanData[i].w;
		newPos.y += amplitude * sin(dot(normalize(direction), vPos.xz) * frequency + time);
	}
	C = pMat * vMat * mMat * vPos;
	gl_Position = pMat * vMat * mMat * vPos;
	Tex = vTex;
	N = mat3(mMat) * vNor;
	P = vec3(mMat * newPos);	
	viewPos = -vMat[3].xyz;
}
