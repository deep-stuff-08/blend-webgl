#pragma once

struct basicColorProgramUniforms {
	int color;
	int mvpMatrix;
};

extern unsigned basicColorProgram;
extern basicColorProgramUniforms basicColorUniforms;

void initColorShader();
void uninitColorShader();