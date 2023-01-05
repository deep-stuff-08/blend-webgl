"use strict"
var windowKdesh = {
    program: null,
    uniforms: null,
    cube: null,
    quad: null,
    texWood: null
};

function setupProgramForWindowKdesh() {
    windowKdesh.program = progPhongLightWithTexture.program;
    windowKdesh.uniforms = progPhongLightWithTexture.uniforms;
}

function initForWindowKdesh() {
    windowKdesh.cube = dshapes.initCube();
    windowKdesh.quad = dshapes.initQuad();

    windowKdesh.texWindow = loadTexture("resources/textures/wood.png");
}

function renderForWindowKdesh(perspectiveMatrix, viewMatrix, modelMatrix, lightPosition, texOutside) {
    var cameraPosition = debugCamera.cameraPosition;
    
    gl.useProgram(progCompleteLight.program);
    resetCompleteLight();
    setProjectionAndViewCompleteLight(perspectiveMatrix, viewMatrix, cameraPosition);
    setTextureMatrixCompleteLight(mat2.create());
    addLightCompleteLight(lightPosition, [0.7, 0.7, 0.7], [0.0, 0.0, 0.0], [1.0, 1.0, 1.0]);
    setMaterialCompleteLight([1.0, 1.0, 1.0], [1.0, 1.0, 1.0], [1.0, 1.0, 1.0], 128, 1.0);
    setTextureSamplersCompleteLight(0);
    gl.activeTexture(gl.TEXTURE0);
    setFlagsCompleteLight(0, 0, 1, 0);

    var localMat = mat4.create();

    gl.bindTexture(gl.TEXTURE_2D, texOutside);
    setModelMatrixCompleteLight(modelMatrix);
    windowKdesh.quad.render();

	setFlagsCompleteLight(0, 0, 1, 1);
    setMaterialCompleteLight([0.5, 0.5, 0.5], [0.4, 0.1, 0.0], [1.0, 1.0, 1.0], 128, 1.0);
    gl.bindTexture(gl.TEXTURE_2D, windowKdesh.texWindow);
    mat4.translate(localMat, modelMatrix, [-1.0, 0.0, 0.0]);
    mat4.scale(localMat, localMat, [0.03, 1.05, 0.05]);
    setModelMatrixCompleteLight(localMat);
    windowKdesh.cube.render();

    mat4.translate(localMat, modelMatrix, [0.0,-1.0, 0.0]);
    mat4.scale(localMat, localMat, [1.0, 0.05, 0.05]);
    setModelMatrixCompleteLight(localMat);
    windowKdesh.cube.render();

    mat4.translate(localMat, modelMatrix, [1.0, 0.0, 0.0]);
    mat4.scale(localMat, localMat, [0.03, 1.05, 0.05]);
    setModelMatrixCompleteLight(localMat);
    windowKdesh.cube.render();

    mat4.translate(localMat, modelMatrix, [0.0, 1.0, 0.0]);
    mat4.scale(localMat, localMat, [1.0, 0.05, 0.05]);
    setModelMatrixCompleteLight(localMat);
    windowKdesh.cube.render();
}
