#pragma once

#include"vmath.h"

enum VertexAttribs {
	BLEND_POSITION = 0,
	BLEND_COLOR = 1,
	BLEND_NORMAL = 2,
	BLEND_TEXCOORD =3
};

extern vmath::mat4 perspectiveMatrix;

void compileShader(unsigned shader, const char* src);
void linkProgram(unsigned program);
void printLog(const char* string, ...);
