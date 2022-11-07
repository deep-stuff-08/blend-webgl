var canvas;
var gl;
main();
function main() {
    canvas = document.createElement('canvas');
    gl = canvas.getContext('webgl2');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.style.margin = "0";
    document.body.appendChild(canvas);
    window.addEventListener('resize', function () {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
    init();
    setupProgram();
    render();
    window.addEventListener('close', uninit);
}
function setupProgram() {
    DeepTriangle.setupProgram();
}
function init() {
    DeepTriangle.init();
    gl.enable(gl.DEPTH_TEST);
}
function render() {
    gl.clearBufferfv(gl.COLOR, 0, [0.0, 0.0, 0.0, 1.0]);
    gl.viewport(0, 0, canvas.width, canvas.height);
    DeepTriangle.render();
    window.requestAnimationFrame(render);
}
function uninit() {
    DeepTriangle.uninit();
}
function createShader(filename, shaderType) {
    var shader = gl.createShader(shaderType);
    var xhr = new XMLHttpRequest();
    xhr.open("GET", filename, false);
    xhr.overrideMimeType("text/plain");
    xhr.send();
    gl.shaderSource(shader, xhr.responseText);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.log(gl.getShaderInfoLog(shader));
    }
    return shader;
}
function deleteShader(shader) {
    gl.deleteShader(shader);
}
function createProgram(shaders) {
    var program = gl.createProgram();
    for (var i = 0; i < shaders.length; i++) {
        gl.attachShader(program, shaders[i]);
    }
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.log(gl.getProgramInfoLog(program));
    }
    for (var i = 0; i < shaders.length; i++) {
        gl.detachShader(program, shaders[i]);
    }
    return program;
}
function deleteProgram(program) {
    gl.deleteProgram(program);
}
