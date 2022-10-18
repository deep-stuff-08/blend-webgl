#pragma once
#include"vmath.h"

#define DL_NO_CONTEXT_BIT 0x0000
#define DL_DEBUG_CONTEX_BIT 0x0002
#define DL_FORWARD_CONTEX_BIT 0x0001
#define DL_CORE_CONTEXT 100
#define DL_ES_CONTEXT 101
#define DL_COMPATIBILTY_CONTEXT 102

typedef struct winParam_t {
	float w;
	float h;
} winParam;

extern winParam winSize;
extern vmath::mat4 perspectiveMatrix;

typedef void (*keyboardfunc)(unsigned int key, int state);
typedef void (*mousefunc)(int x, int y);

void toggleFullscreen(void);
void createOpenGLWindow(void);
void processEvents(void);
void closeOpenGLWindow(void);
void destroyOpenGLWindow(void);
bool isOpenGLWindowClosed();
void swapBuffers(void);
void setKeyboardFunc(keyboardfunc key);
void setMouseFunc(mousefunc mouse);
unsigned char* loadTexture(const char* filename, int* w, int* h);