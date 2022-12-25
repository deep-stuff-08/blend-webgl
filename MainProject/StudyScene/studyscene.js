"use strict"
var scene1Kdesh = {
    program: null,
    uniforms: null,
    cubeRoom: null,
    quadWindow: null,
    fboWindow: null,
    texOutside: null,
    texWall: null,
    camera: null,
    cameraPath: [
        //      position            center               up               velocity      //
        [ [-1.0,  0.0, -3.0], [ 0.0,  0.0, -3.0], [ 0.0,  1.0,  0.0], [ 0.0,  1.0,  1.0] ],
        [ [ 0.0,  1.0,  3.0], [ 0.0,  0.0, -3.0], [ 0.0,  1.0,  0.0], [ 0.0,  1.0,  1.0] ],
        [ [ 1.0,  2.0,  6.0], [ 0.0,  0.0, -3.0], [ 0.0,  1.0,  0.0], [ 0.0,  1.0,  1.0] ]
    ]
};

function setupProgramForScene1Kdesh() {
    scene1Kdesh.program = progPhongLightWithTexture.program;
	scene1Kdesh.uniforms = progPhongLightWithTexture.uniforms;

    setupProgramForTableKdesh();
    setupProgramForLampKdesh();
    setupProgramForBottleKdesh();
    setupProgramForWindowKdesh();
}

function initForScene1Kdesh(sceneCamera) {
    initForTableKdesh();
    initForLampKdesh();
    initForBottleKdesh();
    initForWindowKdesh();

    scene1Kdesh.fboWindow = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, scene1Kdesh.fboWindow);

    scene1Kdesh.texOutside = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, scene1Kdesh.texOutside);
    gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA8, 1024, 1024);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, scene1Kdesh.texOutside, 0);
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    scene1Kdesh.cubeRoom = dshapes.initCube();
    scene1Kdesh.quadWindow = dshapes.initQuad();

    scene1Kdesh.texWall = loadTexture("resources/textures/whitewall.jpg");

    sceneCamera.updatePath(scene1Kdesh.cameraPath);
}

function renderForScene1Kdesh(perspectiveMatrix, viewMatrix) {
    var lastBoundFbo = gl.getParameter(gl.FRAMEBUFFER_BINDING);
    var lastViewport = gl.getParameter(gl.VIEWPORT);

    var lightPosition = [0.0, 4.5, 0.0];
    // renderLightSourceDeep(perspectiveMatrix, viewMatrix, lightPosition, [1.0, 0.0, 0.0]);

    gl.bindFramebuffer(gl.FRAMEBUFFER, scene1Kdesh.fboWindow);
    gl.clearBufferfv(gl.COLOR, 0, [0.1, 0.1, 0.1, 1.0]);
    gl.viewport(0, 0, 1024, 1024);

    // TODO: render window outside

    gl.bindFramebuffer(gl.FRAMEBUFFER, lastBoundFbo);
    gl.viewport(lastViewport[0], lastViewport[1], lastViewport[2], lastViewport[3]);

    gl.useProgram(scene1Kdesh.program);
    gl.uniformMatrix4fv(scene1Kdesh.uniforms.pMat, false, perspectiveMatrix);
    gl.uniformMatrix4fv(scene1Kdesh.uniforms.vMat, false, viewMatrix);
    gl.uniform3fv(scene1Kdesh.uniforms.lightPos, lightPosition);
    gl.uniform1i(scene1Kdesh.uniforms.isInvertNormals, 1);
    gl.uniform1i(scene1Kdesh.uniforms.isLight, 1);
    gl.uniform1i(scene1Kdesh.uniforms.isTexture, 1);
    gl.uniform1i(scene1Kdesh.uniforms.diffuseTextureSampler, 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, scene1Kdesh.texWall);

    var modelMatrix = mat4.create();
    mat4.translate(modelMatrix, modelMatrix, [0.0, 1.0, 5.0]);
    mat4.scale(modelMatrix, modelMatrix, [5.0, 4.0, 10.0]);
    gl.uniformMatrix4fv(scene1Kdesh.uniforms.mMat, false, modelMatrix);
    scene1Kdesh.cubeRoom.render();

    modelMatrix = mat4.create();
    mat4.translate(modelMatrix, modelMatrix, [0.0, 0.5, -4.8]);
    mat4.scale(modelMatrix, modelMatrix, [1.5, 1.0, 1.0]);
    renderForWindowKdesh(perspectiveMatrix, viewMatrix, modelMatrix, lightPosition, scene1Kdesh.texOutside);

    modelMatrix = mat4.create();
    mat4.translate(modelMatrix, modelMatrix, [0.0, -1.05, -3.49]);
    renderForTableKdesh(perspectiveMatrix, viewMatrix, modelMatrix, lightPosition);

    modelMatrix = mat4.create();
    mat4.translate(modelMatrix, modelMatrix, [0.9, -0.9, -4.5]);
    mat4.rotate(modelMatrix, modelMatrix, Math.PI / 6.0, [0.0, 1.0, 0.0]);
    mat4.scale(modelMatrix, modelMatrix, [0.6, 0.6, 0.6]);
    renderForLampKdesh(perspectiveMatrix, viewMatrix, modelMatrix, lightPosition);

    modelMatrix = mat4.create();
    mat4.translate(modelMatrix, modelMatrix, [-2.5, -2.775, -4.5]);
    mat4.scale(modelMatrix, modelMatrix, [1.5, 1.5, 1.5]);
    renderForBottleKdesh(perspectiveMatrix, viewMatrix, modelMatrix, lightPosition);

    modelMatrix = mat4.create();
    mat4.translate(modelMatrix, modelMatrix, [-2.3, -2.775, -4.5]);
    mat4.scale(modelMatrix, modelMatrix, [1.5, 1.5, 1.5]);
    renderForBottleKdesh(perspectiveMatrix, viewMatrix, modelMatrix, lightPosition);

    modelMatrix = mat4.create();
    mat4.translate(modelMatrix, modelMatrix, [-2.4, -2.775, -4.3]);
    mat4.scale(modelMatrix, modelMatrix, [1.5, 1.5, 1.5]);
    renderForBottleKdesh(perspectiveMatrix, viewMatrix, modelMatrix, lightPosition);
}
