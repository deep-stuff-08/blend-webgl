"use strict"
var tableKdesh = {
    cubeObj: null,
    texWood: null
};

function setupProgramForTableKdesh() {
    
}

function initForTableKdesh() {
    tableKdesh.cubeObj = dshapes.initCube();
    tableKdesh.texWood = loadTexture("resources/textures/wood.png");
}

function renderForTableKdesh(perspectiveMatrix, viewMatrix, modelMatrix, lightPosition) {
    gl.useProgram(progCompleteLight.program);
    resetCompleteLight();
    setProjectionAndViewCompleteLight(perspectiveMatrix, viewMatrix, cameraPosition);
    setTextureMatrixCompleteLight(mat2.create());
    addLightCompleteLight(lightPosition, [0.7, 0.7, 0.7], [1.0, 1.0, 1.0], [1.0, 1.0, 1.0]);
    setMaterialCompleteLight([1.0, 1.0, 1.0], [0.6, 0.2, 0.0], [1.0, 1.0, 1.0], 128, 1.0);
    setFlagsCompleteLight(0, 0, 1, 1);
    setTextureSamplersCompleteLight(0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tableKdesh.texWood);

    var localTransforms = mat4.create();

    // top
    mat4.copy(localTransforms, modelMatrix);
    mat4.scale(localTransforms, localTransforms, [2.0, 0.1, 1.5]);
    setModelMatrixCompleteLight(localTransforms);
    tableKdesh.cubeObj.render();

    // rear-right leg
    mat4.translate(localTransforms, modelMatrix, [1.5, -1.0, -1.0]);
    mat4.rotate(localTransforms, localTransforms, glMatrix.toRadian(10), [0.0, 0.0, 1.0]);
    mat4.scale(localTransforms, localTransforms, [0.1, 1.0, 0.1]);
    setModelMatrixCompleteLight(localTransforms);
    tableKdesh.cubeObj.render();

    // rear-left leg
    mat4.translate(localTransforms, modelMatrix, [-1.5, -1.0, -1.0]);
    mat4.rotate(localTransforms, localTransforms, glMatrix.toRadian(10), [0.0, 0.0, -1.0]);
    mat4.scale(localTransforms, localTransforms, [0.1, 1.0, 0.1]);
    setModelMatrixCompleteLight(localTransforms);
    tableKdesh.cubeObj.render();

    // front-left leg
    mat4.translate(localTransforms, modelMatrix, [-1.5, -1.0, 1.0]);
    mat4.rotate(localTransforms, localTransforms, glMatrix.toRadian(10), [0.0, 0.0, -1.0]);
    mat4.scale(localTransforms, localTransforms, [0.1, 1.0, 0.1]);
    setModelMatrixCompleteLight(localTransforms);
    tableKdesh.cubeObj.render();

    // front-right leg
    mat4.translate(localTransforms, modelMatrix, [1.5, -1.0, 1.0]);
    mat4.rotate(localTransforms, localTransforms, glMatrix.toRadian(10), [0.0, 0.0, 1.0]);
    mat4.scale(localTransforms, localTransforms, [0.1, 1.0, 0.1]);
    setModelMatrixCompleteLight(localTransforms);
    tableKdesh.cubeObj.render();

    gl.useProgram(null);
}
