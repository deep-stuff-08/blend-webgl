var canvas = null;
var gl = null;
var isFullscreen = false;
var canvasOriginalWidth, canvasOriginalHeight;
var cameraFront = vec3.set(vec3.create(), 0.0, 0.0, -1.0);
var cameraPosition = vec3.set(vec3.create(), 0.0, 0.0, 5.0);
var cameraUp = vec3.set(vec3.create(), 0.0, 1.0, 0.0);

// for uniformity among programs
const AUS = {
    ATTRIBUTE_POSITION : 0,
    ATTRIBUTE_COLOR : 1,
    ATTRIBUTE_NORMAL : 2,
    ATTRIBUTE_TEXTURE0 : 3
};

// for GL
var shaderProgramObject;
var perspectiveProjectionMatrix;

var scene4_aus_data = [];
var theta = 0.0;

// requestAnimationFrame() (browser-specific buffer-swapping function)
var requestAnimationFrame =
    window.requestAnimationFrame ||     // google chrome
    window.mozRequestAnimationFrame ||  // firefox
    window.oRequestAnimationFrame ||    // opera
    window.msRequestAnimationFrame ||   // ie/edge
    window.webkitRequestAnimationFrame; // safari

function main() {
    // code
    canvas = document.getElementById("aus");
    if(!canvas)
        console.log("main(): failed to obtain canvas from canvas.html\n");
    else
        console.log("main(): successfully obtained canvas from canvas.html\n");

    // record canvas dimensions for future resize() calls
    canvasOriginalWidth = canvas.width;
    canvasOriginalHeight = canvas.height;

    initialize(); // initialize WebGL
    resize();     // warm-up resize()

    // first render() call (no game loop in JS, instead cleverly use that of the browser)
    render();
    
    // add listeners that allow event to bubble up the hierarchy
    window.addEventListener("keydown", keyDown, false);
    window.addEventListener("click", mouseDown, false);
    window.addEventListener("resize", resize, false);
}

/* keyboard event listener */
function keyDown(event) {
    // code
    switch(event.keyCode)
    {
    case 81:   // Q (esc is already used by browsers to toggle back from fullscreen mode)
    case 113:  // q
        uninitialize();
        window.close();  // try exiting the canvas' window (not all browsers like this)
        break;

    case 70:  // F
    case 102: // f
        toggleFullscreen();
        break;
    
    default:
        break;
    }

    var speed = 0.5
    if(event.code == 'KeyA') {
        var dir = vec3.create()
        vec3.cross(dir, cameraFront, cameraUp)
        vec3.normalize(dir, dir)
        vec3.multiply(dir, dir, [speed, speed, speed])
        vec3.add(cameraPosition, cameraPosition, dir)
    } else if(event.code == 'KeyW') {
        var dir = vec3.create()
        vec3.multiply(dir, cameraFront, [speed, speed, speed])
        vec3.add(cameraPosition, cameraPosition, dir)
    } else if(event.code == 'KeyS') {
        var dir = vec3.create()
        vec3.multiply(dir, cameraFront, [speed, speed, speed])
        vec3.subtract(cameraPosition, cameraPosition, dir)
    } else if(event.code == 'KeyD') {
        var dir = vec3.create()
        vec3.cross(dir, cameraFront, cameraUp)
        vec3.normalize(dir, dir)
        vec3.multiply(dir, dir, [speed, speed, speed])
        vec3.subtract(cameraPosition, cameraPosition, dir)
		} 
}

/* mouse event listener */
function mouseDown() {
    // code
}

/* fullscreen toggler */
function toggleFullscreen() {
    // code
    // 
    var fullscreen_element =
        document.fullscreenElement ||         // chrome/opera
        document.mozFullScreenElement ||      // firefox
        document.webkitFullscreenElement ||   // safari
        document.msFullscreenElement ||       // ie/edge
        null;                                 // already fullscreen

    if(!fullscreen_element)
    {
        if(canvas.requestFullscreen)
            canvas.requestFullscreen();
        else if(canvas.mozRequestFullScreen)
            canvas.mozRequestFullScreen();
        else if(canvas.webkitRequestFullscreen)
            canvas.webkitRequestFullscreen();
        else if(canvas.msRequestFullscreen)
            canvas.msRequestFullscreen();
        
        isFullscreen = true;
    }
    else
    {
        if(document.exitFullscreen)
            document.exitFullscreen();
        else if(document.mozExitFullScreen)
            document.mozExitFullScreen();
        else if(document.webkitExitFullscreen)
            document.webkitExitFullscreen();
        else if(document.msExitFullscreen)
            document.msExitFullscreen();

        isFullscreen = false;
    }
}

function initialize() {
    // variable declarations
    var status;
    var infoLog;

    // code
    // obtain WebGL 2.0 context
    gl = canvas.getContext("webgl2");
    if(!gl)
        console.log("initialize(): failed to obtain WebGL 2.0 context from canvas\n");
    else
        console.log("initialize(): successfully obtained WebGL 2.0 context from canvas\n");
    
    // set context viewport width & height: an original idiosynchracy of WebGL
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;

    // vertex shader
    status = false;
    infoLog = "";

    var vertexShaderSource =
    `#version 300 es

    precision lowp int;
    precision mediump float;

    layout(location = 0) in vec4 a_position;
    layout(location = 1) in vec3 a_normal;
    layout(location = 2) in vec2 a_texCoord;

    uniform mat4 u_modelViewMatrix;
    uniform mat4 u_projMatrix;

    uniform vec4 u_lightPosition;  // in eye coordinates

    out vec3 vs_o_normal;
    out vec3 vs_o_lightDirection;
    out vec3 vs_o_viewDirection;
    out vec2 vs_o_texCoord;

    void main(void)
    {
        vec4 eyeCoordinate = u_modelViewMatrix * a_position;

        vs_o_normal = mat3(transpose(inverse(u_modelViewMatrix))) * a_normal;
        vs_o_lightDirection = u_lightPosition.xyz - eyeCoordinate.xyz;
        vs_o_viewDirection = -eyeCoordinate.xyz;

        vs_o_texCoord = a_texCoord;

        gl_Position = u_projMatrix * eyeCoordinate;
    }`;

    var vertexShaderObject = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShaderObject, vertexShaderSource);
    gl.compileShader(vertexShaderObject);
    status = gl.getShaderParameter(vertexShaderObject, gl.COMPILE_STATUS);
    if(!status)
    {
        infoLog = gl.getShaderInfoLog(vertexShaderObject);
        console.log("initialize(): *** vertex shader compilation errors ***\n");
        console.log(infoLog);

        uninitialize();
    }
    else
        console.log("initialize(): vertex shader was compiled successfully\n");

    // fragment shader
    status = false;
    infoLog = "";

    var fragmentShaderSource = 
    `#version 300 es
        
    precision lowp int;
    precision mediump float;

    in vec3 vs_o_normal;
    in vec3 vs_o_lightDirection;
    in vec3 vs_o_viewDirection;
    in vec2 vs_o_texCoord;

    uniform vec3 u_La;
    uniform vec3 u_Ld;
    uniform vec3 u_Ls;

    uniform vec3 u_Ka;
    uniform vec3 u_Kd;
    uniform vec3 u_Ks;
    uniform float u_specularPower;

    out vec4 FragColor;

    vec4 computePhongLighting(void)
    {
        vec3 normal = normalize(vs_o_normal);
        vec3 lightRay = normalize(vs_o_lightDirection);
        vec3 viewerRay = normalize(vs_o_viewDirection);
        vec3 reflectedRay = reflect(-lightRay, normal);

        vec3 ambientColor = u_La * u_Ka;
        vec3 diffuseColor = u_Ld * u_Kd * max(dot(lightRay, normal), 0.0);
        vec3 specularColor = u_Ls * u_Ks * pow(max(dot(reflectedRay, viewerRay), 0.0), u_specularPower);

        return vec4(ambientColor + diffuseColor + specularColor, 1.0);
    }
    
    void main(void)
    {
        FragColor = computePhongLighting();
    }`;

    var fragmentShaderObject = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShaderObject, fragmentShaderSource);
    gl.compileShader(fragmentShaderObject);
    status = gl.getShaderParameter(fragmentShaderObject, gl.COMPILE_STATUS);
    if(!status)
    {
        infoLog = gl.getShaderInfoLog(fragmentShaderObject);
        console.log("initialize(): *** fragment shader compilation errors ***\n");
        console.log(infoLog);

        uninitialize();
    }
    else
        console.log("initialize(): fragment shader was compiled successfully\n");

    // shader program object
    status = false;
    infoLog = "";

    shaderProgramObject = gl.createProgram();
    gl.attachShader(shaderProgramObject, vertexShaderObject);
    gl.attachShader(shaderProgramObject, fragmentShaderObject);
    gl.linkProgram(shaderProgramObject);
    status = gl.getProgramParameter(shaderProgramObject, gl.LINK_STATUS);
    if(!status)
    {
        infoLog = gl.getProgramInfoLog(shaderProgramObject);
        console.log("initialize(): *** there were linking errors ***\n");
        console.log(infoLog + "\n");

        uninitialize();
    }
    else
        console.log("initialize(): shader program was linked successfully\n");

    // create and initialize perspective projection matrix
    perspectiveProjectionMatrix = mat4.create();
    mat4.identity(perspectiveProjectionMatrix);

    // initialize scene1 objects
    var scene4_aus_tempData = scene4_aus_initForCupboard();
    scene4_aus_data.push(scene4_aus_tempData[0]);
    scene4_aus_data.push(scene4_aus_tempData[1]);

    // set clear color
    gl.clearColor(0.2, 0.5, 0.2, 1.0);

    // enable depth testing
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    gl.enable(gl.CULL_FACE);
}


function resize() {
    // code
    if(isFullscreen)
    {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    else
    {
        canvas.width = canvasOriginalWidth;
        canvas.height = canvasOriginalHeight;
    }

    gl.viewport(0, 0, canvas.width, canvas.height);

    let aspectRatio = canvas.width / canvas.height;
    mat4.perspective(perspectiveProjectionMatrix, 45.0, aspectRatio, 0.0, 100.0);
}

function render() {
    // local variables
    var modelViewMatrix = mat4.create();

    var cameraMatrix = mat4.create()
	var newfront = vec3.create()
	vec3.add(newfront, cameraFront, cameraPosition)
	mat4.lookAt(cameraMatrix, cameraPosition, newfront, cameraUp)
    
    // code
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, -1.5, -6.0]);
    scene4_aus_drawCupboard(modelViewMatrix);

    // swap buffers and maintain the rendering loop
    requestAnimationFrame(render, canvas);

    // update the frame
    update();
}

function update() {
    // code
    theta += 1.0;
    if(theta >= 360.0)
        theta -= 360.0;
}

function uninitialize() {
    // code
    if(isFullscreen)
        toggleFullscreen();
    
    if(scene4_aus_data[1] != null)
    {
        gl.deleteBuffer(scene4_aus_data[1]);
        scene4_aus_data[1] = null;
    }

    if(scene4_aus_data[0] != null)
    {
        gl.deleteVertexArray(scene4_aus_data[0]);
        scene4_aus_data[0] = null;
    }

    if(shaderProgramObject != null)
    {
        let attachedShadersCount = gl.getProgramParameter(shaderProgramObject, gl.ATTACHED_SHADERS);
        if(attachedShadersCount > 0)
        {
            let attachedShadersList = gl.getAttachedShaders(shaderProgramObject);
            let reversedAttachedShadersList = attachedShadersList.reverse();

            for(let i = 0; i < attachedShadersCount; i++)
            {
                gl.detachShader(shaderProgramObject, reversedAttachedShadersList[i]);
                gl.deleteShader(reversedAttachedShadersList[i]);
                reversedAttachedShadersList[i] = null;
            }
        }
        
        console.log("uninitialize(): detached and deleted " + attachedShadersCount + " shader objects\n");
        
        gl.deleteProgram(shaderProgramObject);
        shaderProgramObject = null;
    }
}
