#include<Windows.h>
#include"windowing.h"
#include"vmath.h"
#include<gl/glew.h>
#include<iostream>
#include"global.h"

#include"triangle.h"
#include"colorshader.h"

using namespace std;
using namespace vmath;

void init(void) {
	glEnable(GL_DEPTH_TEST);

	glClearColor(0.1f, 0.1f, 0.1f, 1.0f);
	glClearDepth(1.0f);

	initTriangle();
}

void setupPrograms() {
	initColorShader();
}

void render(void) {
	glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
	renderTriangle();
}

void uninit(void) {
	uninitTriangle();
	uninitColorShader();
}

void keyboard(unsigned int key, int state) {
	switch(key) {
	case 'F': case 'f':
		toggleFullscreen();
		break;
	case VK_ESCAPE:
		closeOpenGLWindow();
		break;
	}
}

int main(void) {
	setKeyboardFunc(keyboard);
	createOpenGLWindow();
	init();
	setupPrograms();
	while(!isOpenGLWindowClosed()) {
		processEvents();
		render();
		swapBuffers();
	}
	uninit();
	destroyOpenGLWindow();
}
