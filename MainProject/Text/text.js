"use strict"
var textKdesh = {
    quadText: null,
    texAMCPresents: null,
    texTitle: null,
    texGuruDutt: null,
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
    textKdesh.texGuruDutt = loadTexture('resources/textures/GuruDutt.PNG', true);
    textKdesh.texCredits = loadTexture('resources/textures/Credits.PNG', true);
    textKdesh.texTechnicalSpecs = loadTexture('resources/textures/TechnicalSpecs.PNG', true);
    textKdesh.texSpecialEffects = loadTexture('resources/textures/SpecialEffects.PNG', true);
    textKdesh.texReferences = loadTexture('resources/textures/References.PNG', true);
    textKdesh.texSpecialThanks = loadTexture('resources/textures/SpecialThanks.PNG', true);
}

function renderForTextKdeshAMCPresents() {
    gl.useProgram(progCompleteLight.program);
    resetCompleteLight();
    setProjectionAndViewCompleteLight(mat4.create(), mat4.create(), [0.0, 0.0, 1.0]);
    setTextureMatrixCompleteLight(mat2.create());
    addLightCompleteLight([0.0, 0.0, 5.0], [1.0, 1.0, 1.0], [1.0, 1.0, 1.0], [1.0, 1.0, 1.0]);
    setMaterialCompleteLight([1.0, 1.0, 1.0], [1.0, 1.0, 1.0], [0.0, 0.0, 0.0], 128, 1.0);
    setFlagsCompleteLight(0, 0, 1, 0);
    setTextureSamplersCompleteLight(0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textKdesh.texAMCPresents);
    setModelMatrixCompleteLight(mat4.create());
    gl.disable(gl.DEPTH_TEST);
    textKdesh.quadText.render();
    gl.enable(gl.DEPTH_TEST);
}

function renderForTextKdeshTitle() {
    gl.useProgram(progCompleteLight.program);
    resetCompleteLight();
    setProjectionAndViewCompleteLight(mat4.create(), mat4.create(), [0.0, 0.0, 1.0]);
    setTextureMatrixCompleteLight(mat2.create());
    addLightCompleteLight([0.0, 0.0, 5.0], [1.0, 1.0, 1.0], [1.0, 1.0, 1.0], [1.0, 1.0, 1.0]);
    setMaterialCompleteLight([1.0, 1.0, 1.0], [1.0, 1.0, 1.0], [0.0, 0.0, 0.0], 128, 1.0);
    setFlagsCompleteLight(0, 0, 1, 0);
    setTextureSamplersCompleteLight(0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textKdesh.texTitle);
    setModelMatrixCompleteLight(mat4.create());
    gl.disable(gl.DEPTH_TEST);
    textKdesh.quadText.render();
    gl.enable(gl.DEPTH_TEST);
}

function renderForTextKdeshGuruDutt() {
    gl.useProgram(progCompleteLight.program);
    resetCompleteLight();
    setProjectionAndViewCompleteLight(mat4.create(), mat4.create(), [0.0, 0.0, 1.0]);
    setTextureMatrixCompleteLight(mat2.create());
    addLightCompleteLight([0.0, 0.0, 5.0], [1.0, 1.0, 1.0], [1.0, 1.0, 1.0], [1.0, 1.0, 1.0]);
    setMaterialCompleteLight([1.0, 1.0, 1.0], [1.0, 1.0, 1.0], [0.0, 0.0, 0.0], 128, 1.0);
    setFlagsCompleteLight(0, 0, 1, 0);
    setTextureSamplersCompleteLight(0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textKdesh.texGuruDutt);
    setModelMatrixCompleteLight(mat4.create());
    gl.disable(gl.DEPTH_TEST);
    textKdesh.quadText.render();
    gl.enable(gl.DEPTH_TEST);
}

function renderForTextKdeshCredits() {
    gl.useProgram(progCompleteLight.program);
    resetCompleteLight();
    setProjectionAndViewCompleteLight(mat4.create(), mat4.create(), [0.0, 0.0, 1.0]);
    setTextureMatrixCompleteLight(mat2.create());
    addLightCompleteLight([0.0, 0.0, 5.0], [1.0, 1.0, 1.0], [1.0, 1.0, 1.0], [1.0, 1.0, 1.0]);
    setMaterialCompleteLight([1.0, 1.0, 1.0], [1.0, 1.0, 1.0], [0.0, 0.0, 0.0], 128, 1.0);
    setFlagsCompleteLight(0, 0, 1, 0);
    setTextureSamplersCompleteLight(0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textKdesh.texCredits);
    setModelMatrixCompleteLight(mat4.create());
    gl.disable(gl.DEPTH_TEST);
    textKdesh.quadText.render();
    gl.enable(gl.DEPTH_TEST);
}

function renderForTextKdeshTechnicalSpecs() {
    gl.useProgram(progCompleteLight.program);
    resetCompleteLight();
    setProjectionAndViewCompleteLight(mat4.create(), mat4.create(), [0.0, 0.0, 1.0]);
    setTextureMatrixCompleteLight(mat2.create());
    addLightCompleteLight([0.0, 0.0, 5.0], [1.0, 1.0, 1.0], [1.0, 1.0, 1.0], [1.0, 1.0, 1.0]);
    setMaterialCompleteLight([1.0, 1.0, 1.0], [1.0, 1.0, 1.0], [0.0, 0.0, 0.0], 128, 1.0);
    setFlagsCompleteLight(0, 0, 1, 0);
    setTextureSamplersCompleteLight(0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textKdesh.texTechnicalSpecs);
    setModelMatrixCompleteLight(mat4.create());
    gl.disable(gl.DEPTH_TEST);
    textKdesh.quadText.render();
    gl.enable(gl.DEPTH_TEST);
}

function renderForTextKdeshSpecialEffects() {
    gl.useProgram(progCompleteLight.program);
    resetCompleteLight();
    setProjectionAndViewCompleteLight(mat4.create(), mat4.create(), [0.0, 0.0, 1.0]);
    setTextureMatrixCompleteLight(mat2.create());
    addLightCompleteLight([0.0, 0.0, 5.0], [1.0, 1.0, 1.0], [1.0, 1.0, 1.0], [1.0, 1.0, 1.0]);
    setMaterialCompleteLight([1.0, 1.0, 1.0], [1.0, 1.0, 1.0], [0.0, 0.0, 0.0], 128, 1.0);
    setFlagsCompleteLight(0, 0, 1, 0);
    setTextureSamplersCompleteLight(0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textKdesh.texSpecialEffects);
    setModelMatrixCompleteLight(mat4.create());
    gl.disable(gl.DEPTH_TEST);
    textKdesh.quadText.render();
    gl.enable(gl.DEPTH_TEST);
}

function renderForTextKdeshReferences() {
    gl.useProgram(progCompleteLight.program);
    resetCompleteLight();
    setProjectionAndViewCompleteLight(mat4.create(), mat4.create(), [0.0, 0.0, 1.0]);
    setTextureMatrixCompleteLight(mat2.create());
    addLightCompleteLight([0.0, 0.0, 5.0], [1.0, 1.0, 1.0], [1.0, 1.0, 1.0], [1.0, 1.0, 1.0]);
    setMaterialCompleteLight([1.0, 1.0, 1.0], [1.0, 1.0, 1.0], [0.0, 0.0, 0.0], 128, 1.0);
    setFlagsCompleteLight(0, 0, 1, 0);
    setTextureSamplersCompleteLight(0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textKdesh.texReferences);
    setModelMatrixCompleteLight(mat4.create());
    gl.disable(gl.DEPTH_TEST);
    textKdesh.quadText.render();
    gl.enable(gl.DEPTH_TEST);
}

function renderForTextKdeshSpecialThanks() {
    gl.useProgram(progCompleteLight.program);
    resetCompleteLight();
    setProjectionAndViewCompleteLight(mat4.create(), mat4.create(), [0.0, 0.0, 1.0]);
    setTextureMatrixCompleteLight(mat2.create());
    addLightCompleteLight([0.0, 0.0, 5.0], [1.0, 1.0, 1.0], [1.0, 1.0, 1.0], [1.0, 1.0, 1.0]);
    setMaterialCompleteLight([1.0, 1.0, 1.0], [1.0, 1.0, 1.0], [0.0, 0.0, 0.0], 128, 1.0);
    setFlagsCompleteLight(0, 0, 1, 0);
    setTextureSamplersCompleteLight(0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textKdesh.texSpecialThanks);
    setModelMatrixCompleteLight(mat4.create());
    gl.disable(gl.DEPTH_TEST);
    textKdesh.quadText.render();
    gl.enable(gl.DEPTH_TEST);
}
