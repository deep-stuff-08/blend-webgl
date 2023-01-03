"use strict"
var textKdesh = {
    quadText: null,
    texAMCPresents: null,
    texTitle: null,
    texCredits: null,
    texTechnicalSpecs: null,
    texSpecialEffects: null,
    texReferences: null,
    texSpecialThanks: null
};

function initForTextKdesh() {
    textKdesh.quadText = dshapes.initQuad();

    textKdesh.texAMCPresents = loadTexture('resources/textures/AMCPresents.PNG', true);
    textKdesh.texTitle = loadTexture('resources/textures/Title.PNG', true);
    textKdesh.texCredits = loadTexture('resources/textures/Credits.PNG', true);
    textKdesh.texTechnicalSpecs = loadTexture('resources/textures/TechnicalSpecs.PNG', true);
    textKdesh.texSpecialEffects = loadTexture('resources/textures/SpecialEffects.PNG', true);
    textKdesh.texReferences = loadTexture('resources/textures/References.PNG', true);
    textKdesh.texSpecialThanks = loadTexture('resources/textures/SpecialThanks.PNG', true);
}

function renderForTextKdeshAMCPresents(perspectiveMatrix, viewMatrix) {
    gl.useProgram(progCompleteLight.program);
    resetCompleteLight();
    setProjectionAndViewCompleteLight(perspectiveMatrix, viewMatrix, [0.0, 0.0, 1.0]);
    setTextureMatrixCompleteLight(mat2.create());
    addLightCompleteLight([0.0, 0.0, 5.0], [1.0, 1.0, 1.0], [1.0, 1.0, 1.0], [1.0, 1.0, 1.0]);
    setMaterialCompleteLight([1.0, 1.0, 1.0], [1.0, 1.0, 1.0], [0.0, 0.0, 0.0], 128, 1.0);
    setFlagsCompleteLight(0, 0, 1, 0);
    setTextureSamplersCompleteLight(0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textKdesh.texAMCPresents);
    var modelMatrix = mat4.create();
    mat4.scale(modelMatrix, modelMatrix, [3.0*canvas.width/1280, 2.0*canvas.height/720, 0.0]);
    setModelMatrixCompleteLight(modelMatrix);
    gl.disable(gl.DEPTH_TEST);
    textKdesh.quadText.render();
    gl.enable(gl.DEPTH_TEST);
}

function renderForTextKdeshTitle(perspectiveMatrix, viewMatrix) {
    gl.useProgram(progCompleteLight.program);
    resetCompleteLight();
    setProjectionAndViewCompleteLight(perspectiveMatrix, viewMatrix, [0.0, 0.0, 1.0]);
    setTextureMatrixCompleteLight(mat2.create());
    addLightCompleteLight([0.0, 0.0, 5.0], [1.0, 1.0, 1.0], [1.0, 1.0, 1.0], [1.0, 1.0, 1.0]);
    setMaterialCompleteLight([1.0, 1.0, 1.0], [1.0, 1.0, 1.0], [0.0, 0.0, 0.0], 128, 1.0);
    setFlagsCompleteLight(0, 0, 1, 0);
    setTextureSamplersCompleteLight(0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textKdesh.texTitle);
    var modelMatrix = mat4.create();
    mat4.scale(modelMatrix, modelMatrix, [3.0*canvas.width/1280, 2.0*canvas.height/720, 0.0]);
    setModelMatrixCompleteLight(modelMatrix);
    gl.disable(gl.DEPTH_TEST);
    textKdesh.quadText.render();
    gl.enable(gl.DEPTH_TEST);
}

function renderForTextKdeshCredits(perspectiveMatrix, viewMatrix) {
    gl.useProgram(progCompleteLight.program);
    resetCompleteLight();
    setProjectionAndViewCompleteLight(perspectiveMatrix, viewMatrix, [0.0, 0.0, 1.0]);
    setTextureMatrixCompleteLight(mat2.create());
    addLightCompleteLight([0.0, 0.0, 5.0], [1.0, 1.0, 1.0], [1.0, 1.0, 1.0], [1.0, 1.0, 1.0]);
    setMaterialCompleteLight([1.0, 1.0, 1.0], [1.0, 1.0, 1.0], [0.0, 0.0, 0.0], 128, 1.0);
    setFlagsCompleteLight(0, 0, 1, 0);
    setTextureSamplersCompleteLight(0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textKdesh.texCredits);
    var modelMatrix = mat4.create();
    mat4.scale(modelMatrix, modelMatrix, [3.0*canvas.width/1280, 2.0*canvas.height/720, 0.0]);
    setModelMatrixCompleteLight(modelMatrix);
    gl.disable(gl.DEPTH_TEST);
    textKdesh.quadText.render();
    gl.enable(gl.DEPTH_TEST);
}

function renderForTextKdeshTechnicalSpecs(perspectiveMatrix, viewMatrix) {
    gl.useProgram(progCompleteLight.program);
    resetCompleteLight();
    setProjectionAndViewCompleteLight(perspectiveMatrix, viewMatrix, [0.0, 0.0, 1.0]);
    setTextureMatrixCompleteLight(mat2.create());
    addLightCompleteLight([0.0, 0.0, 5.0], [1.0, 1.0, 1.0], [1.0, 1.0, 1.0], [1.0, 1.0, 1.0]);
    setMaterialCompleteLight([1.0, 1.0, 1.0], [1.0, 1.0, 1.0], [0.0, 0.0, 0.0], 128, 1.0);
    setFlagsCompleteLight(0, 0, 1, 0);
    setTextureSamplersCompleteLight(0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textKdesh.texTechnicalSpecs);
    var modelMatrix = mat4.create();
    mat4.scale(modelMatrix, modelMatrix, [3.0*canvas.width/1280, 2.0*canvas.height/720, 0.0]);
    setModelMatrixCompleteLight(modelMatrix);
    gl.disable(gl.DEPTH_TEST);
    textKdesh.quadText.render();
    gl.enable(gl.DEPTH_TEST);
}

function renderForTextKdeshSpecialEffects(perspectiveMatrix, viewMatrix) {
    gl.useProgram(progCompleteLight.program);
    resetCompleteLight();
    setProjectionAndViewCompleteLight(perspectiveMatrix, viewMatrix, [0.0, 0.0, 1.0]);
    setTextureMatrixCompleteLight(mat2.create());
    addLightCompleteLight([0.0, 0.0, 5.0], [1.0, 1.0, 1.0], [1.0, 1.0, 1.0], [1.0, 1.0, 1.0]);
    setMaterialCompleteLight([1.0, 1.0, 1.0], [1.0, 1.0, 1.0], [0.0, 0.0, 0.0], 128, 1.0);
    setFlagsCompleteLight(0, 0, 1, 0);
    setTextureSamplersCompleteLight(0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textKdesh.texSpecialEffects);
    var modelMatrix = mat4.create();
    mat4.scale(modelMatrix, modelMatrix, [3.0*canvas.width/1280, 2.0*canvas.height/720, 0.0]);
    setModelMatrixCompleteLight(modelMatrix);
    gl.disable(gl.DEPTH_TEST);
    textKdesh.quadText.render();
    gl.enable(gl.DEPTH_TEST);
}

function renderForTextKdeshReferences(perspectiveMatrix, viewMatrix) {
    gl.useProgram(progCompleteLight.program);
    resetCompleteLight();
    setProjectionAndViewCompleteLight(perspectiveMatrix, viewMatrix, [0.0, 0.0, 1.0]);
    setTextureMatrixCompleteLight(mat2.create());
    addLightCompleteLight([0.0, 0.0, 5.0], [1.0, 1.0, 1.0], [1.0, 1.0, 1.0], [1.0, 1.0, 1.0]);
    setMaterialCompleteLight([1.0, 1.0, 1.0], [1.0, 1.0, 1.0], [0.0, 0.0, 0.0], 128, 1.0);
    setFlagsCompleteLight(0, 0, 1, 0);
    setTextureSamplersCompleteLight(0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textKdesh.texReferences);
    var modelMatrix = mat4.create();
    mat4.scale(modelMatrix, modelMatrix, [3.0*canvas.width/1280, 2.0*canvas.height/720, 0.0]);
    setModelMatrixCompleteLight(modelMatrix);
    gl.disable(gl.DEPTH_TEST);
    textKdesh.quadText.render();
    gl.enable(gl.DEPTH_TEST);
}

function renderForTextKdeshSpecialThanks(perspectiveMatrix, viewMatrix) {
    gl.useProgram(progCompleteLight.program);
    resetCompleteLight();
    setProjectionAndViewCompleteLight(perspectiveMatrix, viewMatrix, [0.0, 0.0, 1.0]);
    setTextureMatrixCompleteLight(mat2.create());
    addLightCompleteLight([0.0, 0.0, 5.0], [1.0, 1.0, 1.0], [1.0, 1.0, 1.0], [1.0, 1.0, 1.0]);
    setMaterialCompleteLight([1.0, 1.0, 1.0], [1.0, 1.0, 1.0], [0.0, 0.0, 0.0], 128, 1.0);
    setFlagsCompleteLight(0, 0, 1, 0);
    setTextureSamplersCompleteLight(0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textKdesh.texSpecialThanks);
    var modelMatrix = mat4.create();
    mat4.scale(modelMatrix, modelMatrix, [3.0*canvas.width/1280, 2.0*canvas.height/720, 0.0]);
    setModelMatrixCompleteLight(modelMatrix);
    gl.disable(gl.DEPTH_TEST);
    textKdesh.quadText.render();
    gl.enable(gl.DEPTH_TEST);
}
