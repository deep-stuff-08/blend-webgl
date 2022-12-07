#version 300 es

precision highp float;

layout (location = 0) out vec4 FragColor;

uniform vec3 lightcolor;

void main()
{
    FragColor = vec4(lightcolor,1.0);
}

