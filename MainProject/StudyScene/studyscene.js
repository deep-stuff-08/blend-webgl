"use strict"
var scene1Kdesh = {
    program: null,
    uniforms: null,
    cubeRoom: null,
    quadWindow: null,
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
}

function initForScene1Kdesh(sceneCamera) {
    initForTableKdesh();
    initForLampKdesh();
    initForBottleKdesh();

    scene1Kdesh.cubeRoom = dshapes.initCube();
    scene1Kdesh.quadWindow = dshapes.initQuad();

    scene1Kdesh.texWall = loadTexture("resources/textures/whitewall.jpg");

    sceneCamera.updatePath(scene1Kdesh.cameraPath);
}

function renderForScene1Kdesh(perspectiveMatrix, viewMatrix) {
    var lightPosition = [0.0, 4.5, 0.0];
    // renderLightSourceDeep(perspectiveMatrix, viewMatrix, lightPosition, [1.0, 0.0, 0.0]);

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
