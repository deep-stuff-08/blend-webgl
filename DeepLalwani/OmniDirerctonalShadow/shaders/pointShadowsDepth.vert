#version 300 es

layout(location = 0)in vec4 aPos;
layout(location = 1)in vec3 aNor;
layout(location = 2)in vec2 aTex;

uniform mat4 lpMat;
uniform mat4 mMat;

out vec4 FragPos;

void main() {
	FragPos = mMat * aPos;
	gl_Position = lpMat * FragPos;
}