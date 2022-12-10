var canvas = null;
var gl = null;
var isFullscreen = false;
var canvasOriginalWidth, canvasOriginalHeight;

// for uniformity among programs
const KVD = {
    ATTRIBUTE_POSITION : 0,
    ATTRIBUTE_COLOR : 1,
    ATTRIBUTE_NORMAL : 2,
    ATTRIBUTE_TEXTURE0 : 3
};

// for GL
var shaderProgramObject;
var perspectiveProjectionMatrix;

var scene1_geom = {
    kvd_room : {
        vaoWall : null,
        vboWall : null,
    },
    kvd_table : {
        vaoCube : null,
        vboCube : null
    },
    kvd_lamp : {
        vaoCube : null,
        vboCube : null,
        vaoCylinder : null,
        vboCylinder : null,
        cylinderVertCount : null,
        vaoHead : null,
        vboHead : null,
        headVertCount : null,
        position : null
    },
    kvd_lamp_light : {
        ambient : [0.5, 0.5, 0.5],
        diffuse : [0.953, 0.91, 0.546],
        specular : [0.7, 0.7, 0.7],
    }
};
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
    canvas = document.getElementById("WebGLCanvas");
    if(!canvas)
        console.log("main(): failed to obtain canvas from gl-canvas.html\n");
    else
        console.log("main(): successfully obtained canvas from gl-canvas.html\n");

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

    // log GL information
    logGLInfo();

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
    scene1_kvd_initForRoom(scene1_geom);

    var scene1_kvd_tempData = scene1_kvd_initForTable();
    scene1_geom.kvd_table.vaoCube = scene1_kvd_tempData[0];
    scene1_geom.kvd_table.vboCube = scene1_kvd_tempData[1];

    scene1_kvd_tempData = scene1_kvd_initForLamp(1.0);
    scene1_geom.kvd_lamp.vaoCube = scene1_kvd_tempData[0];
    scene1_geom.kvd_lamp.vboCube = scene1_kvd_tempData[1];
    scene1_geom.kvd_lamp.vaoCylinder = scene1_kvd_tempData[2];
    scene1_geom.kvd_lamp.vboCylinder = scene1_kvd_tempData[3];
    scene1_geom.kvd_lamp.cylinderVertCount = scene1_kvd_tempData[4];
    scene1_geom.kvd_lamp.vaoHead = scene1_kvd_tempData[5];
    scene1_geom.kvd_lamp.vboHead = scene1_kvd_tempData[6];
    scene1_geom.kvd_lamp.headVertCount = scene1_kvd_tempData[7];

    // set clear color
    gl.clearColor(0.2, 0.5, 0.2, 1.0);

    // enable depth testing
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    gl.enable(gl.CULL_FACE);
}

function logGLInfo() {
    // code
    document.getElementById("webgl_vendor_string").innerText = "Vendor: " + gl.getParameter(gl.VENDOR);
    document.getElementById("webgl_version_string").innerText = "Version: " + gl.getParameter(gl.VERSION);
    document.getElementById("webgl_sl_version_string").innerText = "GLSL Version: " + gl.getParameter(gl.SHADING_LANGUAGE_VERSION);
    document.getElementById("webgl_renderer_string").innerText = "Renderer: " + gl.getParameter(gl.RENDERER);
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
    
    // code
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mat4.lookAt(modelViewMatrix, [0.0, 0.6, 3.0], [0.0, 0.0, 0.0], [0.0, 1.0, 0.0]);
    scene1_geom.kvd_lamp.position = [0.9, 0.0, -4.9, 1.0];
    
    scene1_kvd_drawRoom(modelViewMatrix, scene1_geom);
    mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, 0.0, -5.0]);
    mat4.scale(modelViewMatrix, modelViewMatrix, [0.75, 0.75, 0.75]);
    scene1_kvd_drawTable(modelViewMatrix, scene1_geom);
    mat4.translate(modelViewMatrix, modelViewMatrix, [1.2, 0.0, -1.2]);
    mat4.rotateY(modelViewMatrix, modelViewMatrix, 30.0 * Math.PI / 180.0);
    scene1_kvd_drawLamp(modelViewMatrix, scene1_geom);

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

    scene1_kvd_uninitForScene1();

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

function scene1_kvd_uninitForScene1()
{
    if(scene1_geom.kvd_lamp.vboCube != null)
    {
        gl.deleteBuffer(scene1_geom.kvd_lamp.vboCube);
        scene1_geom.kvd_lamp.vboCube = null;
    }

    if(scene1_geom.kvd_lamp.vaoCube != null)
    {
        gl.deleteVertexArray(scene1_geom.kvd_lamp.vaoCube);
        scene1_geom.kvd_lamp.vaoCube = null;
    }

    if(scene1_geom.kvd_lamp.vboCylinder != null)
    {
        gl.deleteBuffer(scene1_geom.kvd_lamp.vboCylinder);
        scene1_geom.kvd_lamp.vboCylinder = null;
    }

    if(scene1_geom.kvd_lamp.vaoCylinder != null)
    {
        gl.deleteVertexArray(scene1_geom.kvd_lamp.vaoCylinder);
        scene1_geom.kvd_lamp.vaoCylinder = null;
    }

    if(scene1_geom.kvd_table.vaoCube != null)
    {
        gl.deleteVertexArray(scene1_geom.kvd_table.vaoCube);
        scene1_geom.kvd_table.vaoCube = null;
    }

    if(scene1_geom.kvd_table.vboCube != null)
    {
        gl.deleteBuffer(scene1_geom.kvd_table.vboCube);
        scene1_geom.kvd_table.vboCube = null;
    }

    if(scene1_geom.kvd_table.vaoCube != null)
    {
        gl.deleteVertexArray(scene1_geom.kvd_table.vaoCube);
        scene1_geom.kvd_table.vaoCube = null;
    }

    if(scene1_geom.kvd_room.vboWall != null)
    {
        gl.deleteBuffer(scene1_geom.kvd_room.vboWall);
        scene1_geom.kvd_room.vboWall = null;
    }

    if(scene1_geom.kvd_room.vaoWall != null)
    {
        gl.deleteVertexArray(scene1_geom.kvd_room.vaoWall);
        scene1_geom.kvd_room.vaoWall = null;
    }
}
