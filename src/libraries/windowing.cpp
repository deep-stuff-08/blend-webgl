#include<stdio.h>
#include<stdlib.h>
#include<memory.h>
#include<time.h>
#include<Windows.h>
#include<GL/glew.h>
#include<FreeImage.h>
#include"vmath.h"
#include"windowing.h"

using namespace vmath;

bool isClosed = false;
winParam winSize;
mat4 perspectiveMatrix;

static HGLRC gHGLRC;
static HDC gHDC;
static HWND gHWND;

static keyboardfunc keyboardFunction;
static mousefunc mouseFunction;

void toggleFullscreen(void) {
	static bool bFullscreen = false;
	static DWORD dwStyle_dl;
	static WINDOWPLACEMENT wpPrev_dl = { sizeof(WINDOWPLACEMENT) };
	MONITORINFO mi_dl = { sizeof(MONITORINFO) };
	bFullscreen = !bFullscreen;
	if (bFullscreen) {
		SetWindowLong(gHWND, GWL_STYLE, dwStyle_dl | WS_OVERLAPPEDWINDOW);
		SetWindowPlacement(gHWND, &wpPrev_dl);
		SetWindowPos(gHWND, HWND_TOP, 0, 0, 0, 0, SWP_NOMOVE | SWP_NOSIZE | SWP_NOOWNERZORDER | SWP_NOZORDER | SWP_FRAMECHANGED);
	}
	else {
		dwStyle_dl = GetWindowLong(gHWND, GWL_STYLE);
		GetWindowPlacement(gHWND, &wpPrev_dl);
		GetMonitorInfo(MonitorFromWindow(gHWND, MONITORINFOF_PRIMARY), &mi_dl);
		SetWindowLong(gHWND, GWL_STYLE, dwStyle_dl & ~WS_OVERLAPPEDWINDOW);
		SetWindowPos(gHWND, HWND_TOP, mi_dl.rcMonitor.left, mi_dl.rcMonitor.top, mi_dl.rcMonitor.right - mi_dl.rcMonitor.left, mi_dl.rcMonitor.bottom - mi_dl.rcMonitor.top, SWP_NOZORDER | SWP_FRAMECHANGED);
	}
}

LRESULT CALLBACK WndProc(HWND hwnd, UINT iMsg, WPARAM wParam, LPARAM lParam) {
	switch(iMsg) {
	case WM_KEYDOWN:
		if(keyboardFunction) {
			keyboardFunction(wParam, 0);
		}
		break;
	case WM_MOUSEMOVE:
		if(mouseFunction) {
			mouseFunction(LOWORD(lParam), HIWORD(lParam));
		}
		break;
	case WM_SIZE:
		winSize.w = LOWORD(lParam);
		winSize.h = HIWORD(lParam);
		glViewport(0, 0, winSize.w, winSize.h);
		perspectiveMatrix = perspective(45.0f, winSize.w / winSize.h, 0.1f, 1000.0f);
		break;
	case WM_CLOSE:
		isClosed = true;
		break;
	default:
		break;
	}
	return DefWindowProc(hwnd, iMsg, wParam, lParam);
}

void createOpenGLWindow(void) {
	WNDCLASSEX wnd_dl;
	MSG msg_dl;
	TCHAR szAppName[] = TEXT("Deep's App");

	FILE *file;
	fopen_s(&file, "OGL.log", "w");
	fclose(file);

	wnd_dl.cbClsExtra = 0;
	wnd_dl.cbWndExtra = 0;
	wnd_dl.cbSize = sizeof(WNDCLASSEX);
	wnd_dl.hbrBackground = (HBRUSH)GetStockObject(BLACK_BRUSH);
	wnd_dl.hCursor = LoadCursor(NULL, IDC_ARROW);
	wnd_dl.hIcon = LoadIcon(NULL, IDI_APPLICATION);
	wnd_dl.hIconSm = LoadIcon(NULL, IDI_APPLICATION);
	wnd_dl.hInstance = GetModuleHandle(NULL);
	wnd_dl.lpfnWndProc = WndProc;
	wnd_dl.lpszClassName = szAppName;
	wnd_dl.lpszMenuName = NULL;
	wnd_dl.style = CS_HREDRAW | CS_VREDRAW | CS_OWNDC;
	RegisterClassEx(&wnd_dl);
	gHWND = CreateWindowEx(WS_EX_APPWINDOW, szAppName, TEXT("Programmable Pipeline Bluescreen"), WS_OVERLAPPEDWINDOW | WS_CLIPCHILDREN | WS_CLIPSIBLINGS | WS_VISIBLE, 100, 100, 800, 600, NULL, NULL, GetModuleHandle(NULL), NULL);
	ShowWindow(gHWND, SW_SHOW);
	SetFocus(gHWND);
	SetForegroundWindow(gHWND);
	
	PIXELFORMATDESCRIPTOR pfd_dl;
	int iPixelFormatIndex_dl;

	gHDC = GetDC(gHWND);

	ZeroMemory(&pfd_dl, sizeof(pfd_dl));
	pfd_dl.nSize = sizeof(pfd_dl);
	pfd_dl.nVersion = 1;
	pfd_dl.dwFlags = PFD_DRAW_TO_WINDOW | PFD_SUPPORT_OPENGL | PFD_DOUBLEBUFFER;
	pfd_dl.iPixelType = PFD_TYPE_RGBA;
	pfd_dl.cColorBits = 32;
	pfd_dl.cRedBits = 8;
	pfd_dl.cGreenBits = 8;
	pfd_dl.cBlueBits = 8;
	pfd_dl.cAlphaBits = 8;
	pfd_dl.cDepthBits = 32;

	iPixelFormatIndex_dl = ChoosePixelFormat(gHDC, &pfd_dl);
	SetPixelFormat(gHDC, iPixelFormatIndex_dl, &pfd_dl);
	gHGLRC = wglCreateContext(gHDC);
	wglMakeCurrent(gHDC, gHGLRC);
	glewInit();
}

void setKeyboardFunc(keyboardfunc key) {
	keyboardFunction = key;
}

void setMouseFunc(mousefunc mouse) {
	mouseFunction = mouse;
}

void processEvents(void) {
	static MSG msg;
	if(PeekMessage(&msg, NULL, 0, 0, PM_REMOVE)) {
		if(msg.message == WM_QUIT) {
			isClosed = true;
		} else {
			TranslateMessage(&msg);
			DispatchMessage(&msg);
		}
	}
}

bool isOpenGLWindowClosed() {
	return isClosed;
}

void swapBuffers(void) {
	SwapBuffers(gHDC);
}

void closeOpenGLWindow(void) {
	CloseWindow(gHWND);
	PostQuitMessage(0);
}

void destroyOpenGLWindow(void) {
	if(gHGLRC) {
		wglDeleteContext(gHGLRC);
	}
	if(gHDC) {
		ReleaseDC(gHWND, gHDC);
	}
	if(gHWND) {
		DestroyWindow(gHWND);
	}
}

unsigned char* loadTexture(const char* filename, int* w, int* h) {
	FREE_IMAGE_FORMAT fif;
	fif = FreeImage_GetFileType(filename);
	if(fif == FIF_UNKNOWN) {
		fif = FreeImage_GetFIFFromFilename(filename);
		if(fif == FIF_UNKNOWN) {
			return NULL;
		}
	}

	FIBITMAP* dib = FreeImage_Load(fif, filename);
	*w = FreeImage_GetWidth(dib);
	*h = FreeImage_GetHeight(dib);

	return FreeImage_GetBits(dib);
}
