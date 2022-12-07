#version 300 es

layout (location = 0) in vec3 aPos;
layout (location = 1) in vec3 aNormal;
layout (location = 2) in vec2 aTex;

uniform mat4 mProj;
uniform mat4 mView;
uniform mat4 mModel;

void main()
{
    gl_Position = mProj * mView * mModel * vec4(aPos,1.0);
}