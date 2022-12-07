#version 300 es

precision highp float;

layout(location = 0)out vec3 gPosition;
layout(location = 1)out vec3 gNormal;
layout(location = 2)out vec4 gAlbedoSpec;

in vec3 P;
in vec2 Tex;
in vec3 N;

uniform vec3 diffuseMat;
uniform vec3 specularMat;

void main()
{
    gPosition = P;
    gNormal = normalize(N);
    gAlbedoSpec.rgb = diffuseMat;
    gAlbedoSpec.a = specularMat.r;
}
