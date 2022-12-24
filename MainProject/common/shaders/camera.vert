#version 300 es

layout(location = 0) in vec4 vPos;
layout(location = 1) in vec4 vCol;

uniform mat4 pMat;
uniform mat4 vMat;
uniform mat4 mMat;
uniform bool isPath;

out vec4 color;

void main(void) {
    if(isPath) {
        color = vec4(0.0, 0.0, 0.0, 1.0);
        gl_Position = pMat * vMat * vPos;
    }
    else {
        color = vCol;
        gl_Position = pMat * vMat * mMat * vPos;
    }
}
