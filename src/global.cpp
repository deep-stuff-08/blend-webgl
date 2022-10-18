#include<gl/glew.h>
#include<stdio.h>
#include<stdarg.h>
#include"global.h"

void printLog(const char* formatString, ...) {
	FILE *file;
	fopen_s(&file, "OGL.log", "a");
	va_list list;
	va_start(list, formatString);
	vfprintf_s(file, formatString, list);
	va_end(list);
	fclose(file);
}

void compileShader(unsigned shader, const char* src) {
	GLint status;
	char buffer[1024];
	glShaderSource(shader, 1, &src, 0);
	glCompileShader(shader);
	glGetShaderiv(shader, GL_COMPILE_STATUS, &status);
	if(status == GL_FALSE) {
		glGetShaderInfoLog(shader, 1024, NULL, buffer);
		printLog("Failed with:\n%s", buffer);
	}
}

void linkProgram(unsigned program) {
	GLint status;
	char buffer[1024];
	glLinkProgram(program);
	glGetProgramiv(program, GL_COMPILE_STATUS, &status);
	if(status == GL_FALSE) {
		glGetProgramInfoLog(program, 1024, NULL, buffer);
		printLog("Failed with:\n%s", buffer);
	}
}