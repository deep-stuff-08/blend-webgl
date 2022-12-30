"use strict"
var lampKdesh = {
    cubeObj: null,
    cylinderObj: null,
    paraboloidObj: null,
};

function setupProgramForLampKdesh() {
}

function initForLampKdesh() {
    lampKdesh.cubeObj = dshapes.initCube();
    lampKdesh.cylinderObj = dshapes.initCylinder(50);
    lampKdesh.paraboloidObj = dshapes.initParaboloid(2.0, 25);
}

function renderForLampKdesh(perspectiveMatrix, viewMatrix, modelMatrix, lightPosition) {
    gl.useProgram(progCompleteLight.program);
    resetCompleteLight();
    setProjectionAndViewCompleteLight(perspectiveMatrix, viewMatrix, cameraPosition);
    setTextureMatrixCompleteLight(mat2.create());
    addPointLightCompleteLight(lightPosition, [1.0, 1.0, 1.0], [1.0, 1.0, 1.0], [1.0, 1.0, 1.0], [0.8, 0.1, 0.05]);
    setMaterialCompleteLight([0.1, 0.1, 0.1], [1.0, 1.0, 1.0], [1.0, 1.0, 1.0], 128, 1.0);
    setFlagsCompleteLight(0, 0, 0, 1);

    var localTransforms = mat4.create();

    // transformations base support 2
    mat4.translate(localTransforms, modelMatrix, [0.35, 0.55, -0.1]);
    mat4.rotateZ(localTransforms, localTransforms, -15.0 * Math.PI / 180.0);
    mat4.scale(localTransforms, localTransforms, [0.05, 0.6, 0.05]);
    setModelMatrixCompleteLight(localTransforms);
    lampKdesh.cylinderObj.render();

    // transformations for lamp head support
    mat4.translate(localTransforms, modelMatrix, [0.35, 1.2, 0.0]);
    mat4.rotateZ(localTransforms, localTransforms, 30.0 * Math.PI / 180.0);
    mat4.scale(localTransforms, localTransforms, [0.05, 0.5, 0.05]);
    setModelMatrixCompleteLight(localTransforms);
    lampKdesh.cubeObj.render();

    // transformations lamp source cylinder
    mat4.translate(localTransforms, modelMatrix, [0.35, 1.0, 0.0]);
    mat4.rotateZ(localTransforms, localTransforms, 30.0 * Math.PI / 180.0);
    mat4.translate(localTransforms, localTransforms, [0.06, 0.7, 0.0]);
    mat4.rotateZ(localTransforms, localTransforms, 90.0 * Math.PI / 180.0);
    mat4.scale(localTransforms, localTransforms, [0.1, 0.15, 0.1]);
    setModelMatrixCompleteLight(localTransforms);
    lampKdesh.cylinderObj.render();

    // lamp head
    mat4.translate(localTransforms, modelMatrix, [0.35, 1.0, 0.0]);
    mat4.rotateZ(localTransforms, localTransforms, 30.0 * Math.PI / 180.0);
    mat4.translate(localTransforms, localTransforms, [0.06, 0.7, 0.0]);
    mat4.rotateZ(localTransforms, localTransforms, 90.0 * Math.PI / 180.0);
    mat4.scale(localTransforms, localTransforms, [0.3, 0.3, 0.3]);
    setModelMatrixCompleteLight(localTransforms);
    lampKdesh.paraboloidObj.render();

    // transformations for base of the lamp
    mat4.scale(localTransforms, modelMatrix, [0.4, 0.05, 0.15]);
    setModelMatrixCompleteLight(localTransforms);
    lampKdesh.cubeObj.render();

    // transformations base support 1
    mat4.translate(localTransforms, modelMatrix, [0.35, 0.55, 0.1]);
    mat4.rotateZ(localTransforms, localTransforms, -15.0 * Math.PI / 180.0);
    mat4.scale(localTransforms, localTransforms, [0.05, 0.6, 0.05]);
    setModelMatrixCompleteLight(localTransforms);
    lampKdesh.cylinderObj.render();
}
