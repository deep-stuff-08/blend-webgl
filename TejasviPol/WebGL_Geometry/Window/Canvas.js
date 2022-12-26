//JavaScript source code
var canvas = null;
var gl = null;
var bFullScreen = false;
var context = null;
var canvas_orignal_width, canvas_orignal_height;

const webGLMacros =
{
    AMC_ATTRIBUTE_POSITION: 0,
    AMC_ATTRIBUTE_COLOR: 1,
    AMC_ATTRIBUTE_NORMAL: 2,
    AMC_ATTRIBUTE_TEXTURE0: 3
};

var shaderProgramObject;

var vao;
var vbo;
var mvpMatrixUniform;
var perspectiveProjectionMatrix;
var textureSamplerUniform;
var vbo_texcord;
var texture_window;

//Function pointer
var requestAnimationFrame =
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame;

function main() {
    // code


    //1. Get canvas

    canvas = document.getElementById("TRP");

    if (!canvas)
        console.log("Obtaining Canvas Failed.\n");
    else
        console.log("Obtaining Canvas Succeed.\n");

    //Backup Canvas Dimenstion
    canvas_orignal_width = canvas.width;
    canvas_orignal_height = canvas.height;

    //initialise
    initialise();

    //resize
    resize();

    //display
    display();

    //4. Event Handling
    //Adding keyboard and mouse event handler

    window.addEventListener("keydown", keyDown, false);
    window.addEventListener("click", mouseDown, false);
    window.addEventListener("resize", resize, false);
}

function toggelFullScreen() {
    //code
    var fullScreen_Element = document.fullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement ||
        null;

    if (fullScreen_Element == null) //If fullScreen is null
    {
        if (canvas.requestFullscreen)
            canvas.requestFullscreen();
        else if (canvas.mozRequestFullScreen)
            canvas.mozRequestFullScreen();
        else if (canvas.webkitRequestFullscreen)
            canvas.webkitRequestFullscreen();
        else if (canvas.msRequestFullscreen)
            canvas.msRequestFullscreen();

        bFullScreen = true;
    }
    else {
        if (document.exitFullscreen)
            document.exitFullscreen();
        else if (document.mozExitFullScreen)
            document.mozExitFullScreen();
        else if (document.webkitExitFullscreen)
            document.webkitExitFullscreen();
        else if (document.msExitFullscreen)
            document.msExitFullscreen();

        bFullScreen = false;
    }
}

function initialise() {

    //code
    //2. Get WebGL2 Context From Canvas
    gl = canvas.getContext("webgl2");

    if (!gl)
        console.log("Obtaining webgl2 Failed. \n");
    else
        console.log("Obtaining webgl2 Succeed. \n");

    //Set viewport width and height
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;

    //Vertex shader
    var vertextShaderSourceCode =
        "#version 300 es" +
        "\n" +
        "in vec4 a_position; " +
        "in vec2 a_texcoord;" +
        "uniform mat4 u_mvpMatrix;" +
        "out vec2 a_texcoord_out;" +
        "void main(void)" +
        "{" +
        "gl_Position = u_mvpMatrix * a_position;" +
        "a_texcoord_out = a_texcoord;" +
        "}";

    var vertexShaderObject = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShaderObject, vertextShaderSourceCode);
    gl.compileShader(vertexShaderObject);

    // error checking of sha
    if (gl.getShaderParameter(vertexShaderObject, gl.COMPILE_STATUS) == false) {
        var error = gl.getShaderInfoLog(vertexShaderObject);
        if (error.length > 0) {
            alert("Vertex Shader Compilation Error : " + error);
            uninitialise();
        }
    }

    // Fragment shader
    var fragmentShaderSourceCode =
        "#version 300 es" +
        "\n" +
        "precision highp float;" +
        "in vec2 a_texcoord_out;" +
        "uniform highp sampler2D u_textureSampler;" +
        "out vec4 FragColor;" +
        "void main(void)" +
        "{" +
        "FragColor = texture(u_textureSampler,a_texcoord_out);" +
        "}";

    var fragmentShaderObject = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShaderObject, fragmentShaderSourceCode);
    gl.compileShader(fragmentShaderObject);

    if (gl.getShaderParameter(fragmentShaderObject, gl.COMPILE_STATUS) == false) {
        var error = gl.getShaderInfoLog(fragmentShaderObject);
        if (error.length > 0) {
            alert("Fragment Shader Compilation Error : " + error);
            uninitialise();
        }
    }

    // Shader program Object created
    shaderProgramObject = gl.createProgram(); // no parameter

    gl.attachShader(shaderProgramObject, vertexShaderObject);
    gl.attachShader(shaderProgramObject, fragmentShaderObject);

    // Pre linking shader attribute binding
    gl.bindAttribLocation(shaderProgramObject, webGLMacros.AMC_ATTRIBUTE_POSITION, "a_position"); // first step where andhar come
    gl.bindAttribLocation(shaderProgramObject, webGLMacros.AMC_ATTRIBUTE_TEXTURE0, "a_texcoord"); // first step where andhar come

    gl.linkProgram(shaderProgramObject);

    if (gl.getProgramParameter(shaderProgramObject, gl.LINK_STATUS) == false) {
        var error = gl.getProgramInfoLog(shaderProgramObject);
        if (error.length > 0) {
            alert("Shader Compilation Error : " + error);
            uninitialise();
        }
    }

    //Get uniform location : Post linking
    mvpMatrixUniform = gl.getUniformLocation(shaderProgramObject, "u_mvpMatrix");
    textureSamplerUniform = gl.getUniformLocation(shaderProgramObject, "u_textureSampler");

    var squareVertices = new Float32Array(
        [
            1.8, 1.0, 0.0,
            -1.8, 1.0, 0.0,
            -1.8, -1.0, 0.0,
            1.8, -1.0, 0.0

        ]
    );

    var texcoords = new Float32Array(
        [
            1.0, 1.0,
            0.0, 1.0,
            0.0, 0.0,
            1.0, 0.0

        ]
    );
    vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, squareVertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(webGLMacros.AMC_ATTRIBUTE_POSITION, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(webGLMacros.AMC_ATTRIBUTE_POSITION);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);


    //
    vbo_texcord = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo_texcord);
    gl.bufferData(gl.ARRAY_BUFFER, texcoords, gl.STATIC_DRAW);
    gl.vertexAttribPointer(webGLMacros.AMC_ATTRIBUTE_TEXTURE0, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(webGLMacros.AMC_ATTRIBUTE_TEXTURE0);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    gl.bindVertexArray(null);

    texture_window = loadTexture("window.bmp");

    //Depth related code

    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    // clear the screen by blue color
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    perspectiveProjectionMatrix = mat4.create();

}

function resize() {

    // code
    if (bFullScreen == true) {

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

    }
    else {

        canvas.width = canvas_orignal_width;
        canvas.height = canvas_orignal_height;

    }

    if (canvas.height == 0)
        canvas.height = 1;

    gl.viewport(0, 0, canvas.width, canvas.height);

    mat4.perspective(perspectiveProjectionMatrix, 45.0,
        parseFloat(canvas.width) / parseFloat(canvas.height),
        0.1, 100.0);

}


function display() {

    //code
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(shaderProgramObject);

    var modelViewMatrix = mat4.create();
    var translationMatrix = mat4.create();
    var modelViewProjectionMatrix = mat4.create();

    mat4.translate(translationMatrix, translationMatrix, [0.0, 0.0, -4.0]);
    mat4.multiply(modelViewMatrix, translationMatrix, modelViewMatrix);
    mat4.multiply(modelViewProjectionMatrix, perspectiveProjectionMatrix, modelViewMatrix);

    gl.uniformMatrix4fv(mvpMatrixUniform, false, modelViewProjectionMatrix);


    gl.activeTexture(gl.TEXTURE0); //
    gl.bindTexture(gl.TEXTURE_2D, texture_window);
    gl.uniform1i(textureSamplerUniform, 0);

    gl.bindVertexArray(vao);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

    gl.bindVertexArray(null);
    gl.bindTexture(gl.TEXTURE_2D, null);

    //Here it should be drawing code
    //Unused the shapder program object
    gl.useProgram(null);

    //Double buffering imulation 
    requestAnimationFrame(display, canvas);
    update();
}

function update() {
    // code
}

//Keyboard event listener
function keyDown(event) {

    //code

    switch (event.keyCode) {

        case 69:
            uninitialise
            window.close(); // not all browser will follow these
            break;

        case 70:
            toggelFullScreen();
            // drawText("Hello World !!!");
            break;

        default: break;
    }

}

//Mouse event listener
function mouseDown() {

    // code

}

function uninitialise() {
    // code

    if (vao) {
        gl.deleteVertexArray(vao);
        vao = null;
    }

    if (vbo) {
        gl.deleteBuffer(vbo);
        vbo = null;
    }

    if (shaderProgramObject) {
        gl.useProgram(shaderProgramObject);
        var shaderObjects = gl.getAttachedShaders(shaderProgramObject);

        for (let i = 0; i < shaderObjects.length; i++) {
            gl.detachShader(shaderProgramObject, shaderObjects[i]);
            gl.deleteShader(shaderObjects[i]);
            shaderObjects[i] = null;
        }

        gl.deleteProgram(shaderProgramObject);
        shaderProgramObject = null;
    }
}


function loadTexture(src) {
    var tex = gl.createTexture();
    tex.image = new Image();
    tex.image.src = src;

    tex.image.onload = function () {
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, tex.image);
        gl.bindTexture(gl.TEXTURE_2D, null);
    };

    return tex;
}

