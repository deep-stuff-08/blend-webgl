
#include<windows.h>
#include<stdio.h>
#include "OGL.h"
//OpenGL Header Files
#include<GL/gl.h>
#include<GL/glu.h>

// OpenGL libraries
#pragma comment (lib,"OpenGL32.lib")
#pragma comment (lib,"glu32.lib")

#define WIN_WIDTH 800
#define WIN_HEIGHT 600


// Global function declarations/ prototype/ signature

LRESULT CALLBACK WndProc(HWND, UINT, WPARAM, LPARAM);

// Global variable declaration
HWND ghWnd = NULL;
HDC ghdc = NULL;
HGLRC ghrc = NULL;
BOOL gbFullScreen = FALSE;
BOOL gbActiveWindow = FALSE;
FILE* gpFile = NULL;

GLuint texture_window;
int keyPressed = -1;
// Entry Point Function
int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpszCmdLine, int iCmdShow) 
{
	//function declarations
	int initialize(void);
	void display(void);
	void update(void);
	void uninitialize(void);

	// Variable declarations.

	WNDCLASSEX wndClass;
	HWND hwnd;
	MSG msg;
	TCHAR szAppName[] = TEXT("MyWindow");
	RECT rc;
	int xPos, yPos;
	BOOL bDone = FALSE;
	int iRetVal = 0;


	//Code

	//File IO
	if (fopen_s(&gpFile, "Log.txt", "w") != 0)
	{
		MessageBox(NULL, TEXT("Creation of Log file failed!!! Existing..."), TEXT("File I/O Error"), MB_OK);
		exit(0);
	}
	else
	{
		fprintf(gpFile, "Log File is Successfully Created.\n");
	}


	//Initialization of WNDCLASSEX Structure
	wndClass.cbSize = sizeof(WNDCLASSEX);
	wndClass.style = CS_HREDRAW | CS_VREDRAW | CS_OWNDC;
	wndClass.cbClsExtra = 0;
	wndClass.cbWndExtra = 0;
	wndClass.lpfnWndProc = WndProc;
	wndClass.hInstance = hInstance;
	wndClass.hbrBackground = (HBRUSH)GetStockObject(BLACK_BRUSH);
	wndClass.hIcon = LoadIcon(hInstance, MAKEINTRESOURCE(MYICON));  //User specific Icon
	wndClass.hCursor = LoadCursor(NULL, IDC_ARROW);
	wndClass.lpszClassName = szAppName;
	wndClass.lpszMenuName = NULL;
	wndClass.hIconSm = LoadIcon(hInstance, MAKEINTRESOURCE(MYICON));

	//Register WNDCLASSEX
	RegisterClassEx(&wndClass);

	//Create the Window

	hwnd = CreateWindowEx(WS_EX_APPWINDOW, szAppName,
		TEXT("Tejasvi Ramesh Pol : window Texture on Quad"),
		WS_OVERLAPPEDWINDOW | WS_CLIPCHILDREN | WS_CLIPSIBLINGS | WS_VISIBLE,
		CW_USEDEFAULT,
		CW_USEDEFAULT,
		WIN_WIDTH,
		WIN_HEIGHT,
		NULL,
		NULL,
		hInstance,
		NULL);

	ghWnd = hwnd;

	//Centering of window
	GetWindowRect(ghWnd, &rc);

	int width = rc.right - rc.left;
	int height = rc.bottom - rc.top;

	xPos = (GetSystemMetrics(SM_CXSCREEN) - rc.right) / 2;
	yPos = (GetSystemMetrics(SM_CYSCREEN) - rc.bottom) / 2;
	SetWindowPos(ghWnd, 0, xPos, yPos, width / 2, height / 2, (SWP_NOZORDER | SWP_NOSIZE));
	
	ShowWindow(ghWnd, iCmdShow);

	// initialize
	iRetVal = initialize();
	if (iRetVal == -1)
	{
		fprintf(gpFile, "Choose pixelFormat failed\n");
		uninitialize();
	}
	else if (iRetVal == -2)
	{
		fprintf(gpFile, "Set Pixel Format Failed!!!\n");
		uninitialize();
	}
	else if (iRetVal == -1)
	{
		fprintf(gpFile, "Create OpenGL Context failed !!!\n");
		uninitialize();
	}
	else if (iRetVal == -4)
	{
		fprintf(gpFile, "Making OpenGL Context as current context failed !!!\n");
		uninitialize();
	}
	else {
		fprintf(gpFile, "Making OpenGL Context as current context successfull !!!\n");
	}
	// foregrounding and focusing the window
	SetForegroundWindow(hwnd);
	SetFocus(hwnd);

	//Game Loop
	while (bDone == FALSE)
	{
		if (PeekMessage(&msg, NULL, 0, 0, PM_REMOVE))
		{
			if (msg.message == WM_QUIT)
			{
				bDone = TRUE;
			}
			else
			{
				TranslateMessage(&msg);
				DispatchMessage(&msg);
			}
		}
		else
		{
			if (gbActiveWindow == TRUE)
			{
				// Render the c
				display();

				//update the c
				update();
			}
		}
	}

	return ((int)msg.wParam);
}

//CALLBACK Function.

LRESULT CALLBACK  WndProc(HWND hWnd, UINT iMsg, WPARAM wParam, LPARAM lParam)
{
	// function declaration
	void toggelFullScreen(void);
	void resize(int, int);
	void uninitialize(void);

	// Code
	switch (iMsg)
	{
	case WM_CHAR:

		switch (wParam)
		{
		case 'F':
		case 'f':
			toggelFullScreen();
			break;

		default:
			break;
		}
		break;


	//Active Window
	case WM_SETFOCUS:
		gbActiveWindow = TRUE;
		break;


	case WM_KILLFOCUS:
		gbActiveWindow = FALSE;
		break;


	case WM_ERASEBKGND:
		return(0);

	case WM_SIZE:
		resize(LOWORD(lParam),HIWORD(lParam));
		break;


	case WM_CLOSE:
		DestroyWindow(ghWnd);
		break;


	case WM_DESTROY:
		PostQuitMessage(0); //Indray swaha takshkay swaha
		break;


	default: 
		break;
	}

	return (DefWindowProc(hWnd, iMsg, wParam, lParam));
}

void toggelFullScreen(void)
{
	//variable declarations
	static DWORD dwStyle;
	static WINDOWPLACEMENT wp;
	MONITORINFO mi;

	//code
	wp.length = sizeof(WINDOWPLACEMENT);

	if (gbFullScreen == FALSE)
	{
		dwStyle = GetWindowLong(ghWnd, GWL_STYLE);

		if (dwStyle & WS_OVERLAPPEDWINDOW)
		{
			mi.cbSize = sizeof(MONITORINFO);

			if (GetWindowPlacement(ghWnd, &wp) && GetMonitorInfo(MonitorFromWindow(ghWnd, MONITORINFOF_PRIMARY), &mi))
			{
				SetWindowLong(ghWnd, GWL_STYLE, dwStyle & ~WS_OVERLAPPEDWINDOW);
				SetWindowPos(ghWnd, HWND_TOP, mi.rcMonitor.left, mi.rcMonitor.top, (mi.rcMonitor.right - mi.rcMonitor.left), (mi.rcMonitor.bottom - mi.rcMonitor.top),
					(SWP_NOZORDER | SWP_FRAMECHANGED));
			}
			ShowCursor(FALSE);
			gbFullScreen = TRUE;
		}
	}
	else
	{
		SetWindowLong(ghWnd, GWL_STYLE, (dwStyle | WS_OVERLAPPEDWINDOW));
		SetWindowPlacement(ghWnd, &wp);
		SetWindowPos(ghWnd, HWND_TOP, 0, 0, 0, 0, (SWP_NOMOVE | SWP_NOSIZE | SWP_NOOWNERZORDER | SWP_NOZORDER | SWP_FRAMECHANGED));

		ShowCursor(TRUE);
		gbFullScreen = FALSE;
	}

}

int initialize(void)
{
	//Function declarations
	void resize(int, int);
	BOOL loadGLTexture(GLuint*, TCHAR[]);
	void uninitialize(void);
	//variable declarations
	PIXELFORMATDESCRIPTOR pfd;
	INT iPixelFormatIndex = 0;
	
	//code
	ZeroMemory(&pfd, sizeof(PIXELFORMATDESCRIPTOR));

	//Initilization of PIXELFORMATDESCRIPTOR structure
	pfd.nSize = sizeof(PIXELFORMATDESCRIPTOR);
	pfd.nVersion = 1;
	pfd.dwFlags = PFD_DRAW_TO_WINDOW | PFD_SUPPORT_OPENGL | PFD_DOUBLEBUFFER;
	pfd.iPixelType = PFD_TYPE_RGBA;
	pfd.cColorBits = 32;
	pfd.cRedBits = 8;
	pfd.cGreenBits = 8;
	pfd.cBlueBits = 8;
	pfd.cAlphaBits = 8;
	pfd.cDepthBits = 32;//24 can be also assigned
	//GetDC
	ghdc = GetDC(ghWnd);


	//choose pixel format
	iPixelFormatIndex = ChoosePixelFormat(ghdc, &pfd);
	if (iPixelFormatIndex == 0)
	{
		return (- 1);
	}
	//Set the choosen pixel format
	if (SetPixelFormat(ghdc, iPixelFormatIndex, &pfd) == FALSE)
	{
		return(-2);
	}
	// create  OpenGL Rendering context
	ghrc = wglCreateContext(ghdc);
	if (ghrc == NULL)
	{
		return(-3);
	}
	//make rendering context as current context
	if (wglMakeCurrent(ghdc, ghrc) == FALSE)
	{
		return(-4);
	}
	//Here starts OpenGL code
	//CLear the screen using blue screen
	glClearColor(0.0f, 0.0f, 0.0f, 1.0f);

	//Depth related changes
	glClearDepth(1.0f);
	glEnable(GL_DEPTH_TEST);
	glDepthFunc(GL_LEQUAL);
	glShadeModel(GL_SMOOTH);
	glHint(GL_PERSPECTIVE_CORRECTION_HINT, GL_NICEST);
	// texture related code

	if (loadGLTexture(&texture_window, MAKEINTRESOURCE(IDBITMAP_WINDOW)) == FALSE)
	{
		fprintf(gpFile, "Failed to load window texture");
		uninitialize();
		return -6;
	}


	resize(WIN_WIDTH, WIN_HEIGHT);// WarmUP Resize call
	return(0);
}
BOOL loadGLTexture(GLuint* texture, TCHAR imageResourceId[])
{
	// function declaration
	void uninitialized(void);

	// variable declaration
	HBITMAP hBitMap = NULL;
	BITMAP bmp;
	BOOL bResult = FALSE;

	// code

	hBitMap = (HBITMAP)LoadImage(GetModuleHandle(NULL), imageResourceId, IMAGE_BITMAP, 0, 0, LR_CREATEDIBSECTION);

	if (hBitMap)
	{
		bResult = TRUE;
		GetObject(hBitMap, sizeof(BITMAP), &bmp);

		glPixelStorei(GL_UNPACK_ALIGNMENT, 4);

		glGenTextures(1, texture);

		glBindTexture(GL_TEXTURE_2D, *texture);

		glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
		glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR_MIPMAP_LINEAR);

		gluBuild2DMipmaps(GL_TEXTURE_2D, 3, bmp.bmWidth, bmp.bmHeight, GL_BGR_EXT, GL_UNSIGNED_BYTE, bmp.bmBits);

		glBindTexture(GL_TEXTURE_2D, 0);

		DeleteObject(hBitMap);
	}

	return bResult;
}


void resize(int width, int height)
{

	//code
	if (height == 0)
		height = 1;	// to avoid divide by zero for future calls

	glViewport(0, 0, (GLsizei)width, (GLsizei)height);

	glMatrixMode(GL_PROJECTION);
	glLoadIdentity();
	gluPerspective(45.0f,
		(GLfloat)width / (GLfloat)height,
		0.1f,
		100.0f);
	
}
void display(void)
{

	// code
	glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);  // for 3d, to clear buffer of depth

	glMatrixMode(GL_MODELVIEW);
	glLoadIdentity();
	glTranslatef(0.0f, 0.0f, -4.0f);

	// texture
	glBindTexture(GL_TEXTURE_2D, texture_window);

	glEnable(GL_TEXTURE_2D);

	// CUBE

	glBegin(GL_QUADS);
	glTexCoord2f(1.0, 1.0);
	glVertex2f(1.8f, 1.0f);

	glTexCoord2f(0.0, 1.0);
	glVertex2f(-1.8f, 1.0f);

	glTexCoord2f(0.0, 0.0);
	glVertex2f(-1.8f, -1.0f);

	glTexCoord2f(1.0, 0.0);
	glVertex2f(1.8f, -1.0f);
	glEnd();
	
	SwapBuffers(ghdc);

	
}
void update(void)
{
	//code
	
}
void uninitialize(void)
{
	//function declarations
	void toggleFullscreen(void);

	//code
	if (gbFullScreen)
	{
		toggelFullScreen(); //i.e. if when window is in fullscreen should toggle to normal screen, then destroy it
	}
	if (wglGetCurrentContext() == ghrc)
	{
		wglMakeCurrent(NULL, NULL);
	}
	if (ghrc)
	{
		wglDeleteContext(ghrc);
		ghrc = NULL;
	}
	if (ghdc)
	{
		ReleaseDC(ghWnd, ghdc);
		ghdc = NULL;
	}
	if (ghWnd)
	{
		DestroyWindow(ghWnd);
		ghWnd = NULL;
	}
	glDeleteTextures(1, &texture_window);
	if (gpFile)
	{
		fprintf(gpFile, "Log file Successfully closed.\n");
		fclose(gpFile);
		gpFile = NULL;
	}

}
