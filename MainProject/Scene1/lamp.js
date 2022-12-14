"use strict"
var lampKdesh = {
    program: null,
    uniforms: null,
    cubeObj: null,
    cylinderObj: null,
    paraboloidObj: null,
    texWood: null
};

function setupProgramForLampKdesh() {
    lampKdesh.program = progPhongLightWithTexture.program;
    lampKdesh.uniforms = progPhongLightWithTexture.uniforms;
}

function initForLampKdesh() {
    lampKdesh.cubeObj = dshapes.initCube();
    lampKdesh.cylinderObj = dshapes.initCylinder(50);
    lampKdesh.paraboloidObj = dshapes.initParaboloid(2.0, 25);

    lampKdesh.texWood = loadTexture("resources/textures/wood.png");
}

function renderForLampKdesh(perspectiveMatrix, viewMatrix, modelMatrix, lightPosition) {
    gl.useProgram(lampKdesh.program);
    gl.uniformMatrix4fv(lampKdesh.uniforms.pMat, false, perspectiveMatrix);
    gl.uniformMatrix4fv(lampKdesh.uniforms.vMat, false, viewMatrix);
    gl.uniform3fv(lampKdesh.uniforms.lightPos, lightPosition);
    gl.uniform1i(lampKdesh.uniforms.isInvertNormals, 0);
    gl.uniform1i(lampKdesh.uniforms.isLight, 1);
    gl.uniform1i(lampKdesh.uniforms.isTexture, 1);
    gl.uniform1i(lampKdesh.uniforms.diffuseTextureSampler, 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, lampKdesh.texWood);

    var localTransforms = mat4.create();

    // transformations base support 2
    mat4.translate(localTransforms, modelMatrix, [0.35, 0.55, -0.1]);
    mat4.rotateZ(localTransforms, localTransforms, -15.0 * Math.PI / 180.0);
    mat4.scale(localTransforms, localTransforms, [0.05, 0.6, 0.05]);
    gl.uniformMatrix4fv(lampKdesh.uniforms.mMat, false, localTransforms);
    lampKdesh.cylinderObj.render();

    // transformations for lamp head support
    mat4.translate(localTransforms, modelMatrix, [0.35, 1.2, 0.0]);
    mat4.rotateZ(localTransforms, localTransforms, 30.0 * Math.PI / 180.0);
    mat4.scale(localTransforms, localTransforms, [0.05, 0.5, 0.05]);
    gl.uniformMatrix4fv(lampKdesh.uniforms.mMat, false, localTransforms);
    lampKdesh.cubeObj.render();

    // transformations lamp source cylinder
    mat4.translate(localTransforms, modelMatrix, [0.35, 1.0, 0.0]);
    mat4.rotateZ(localTransforms, localTransforms, 30.0 * Math.PI / 180.0);
    mat4.translate(localTransforms, localTransforms, [0.06, 0.7, 0.0]);
    mat4.rotateZ(localTransforms, localTransforms, 90.0 * Math.PI / 180.0);
    mat4.scale(localTransforms, localTransforms, [0.1, 0.15, 0.1]);
    gl.uniformMatrix4fv(lampKdesh.uniforms.mMat, false, localTransforms);
    lampKdesh.cylinderObj.render();

    // lamp head
    mat4.translate(localTransforms, modelMatrix, [0.35, 1.0, 0.0]);
    mat4.rotateZ(localTransforms, localTransforms, 30.0 * Math.PI / 180.0);
    mat4.translate(localTransforms, localTransforms, [0.06, 0.7, 0.0]);
    mat4.rotateZ(localTransforms, localTransforms, 90.0 * Math.PI / 180.0);
    mat4.scale(localTransforms, localTransforms, [0.3, 0.3, 0.3]);
    gl.uniformMatrix4fv(lampKdesh.uniforms.mMat, false, localTransforms);
    lampKdesh.paraboloidObj.render();

    // transformations base support 1
    mat4.translate(localTransforms, modelMatrix, [0.35, 0.55, 0.1]);
    mat4.rotateZ(localTransforms, localTransforms, -15.0 * Math.PI / 180.0);
    mat4.scale(localTransforms, localTransforms, [0.05, 0.6, 0.05]);
    gl.uniformMatrix4fv(lampKdesh.uniforms.mMat, false, localTransforms);
    lampKdesh.cylinderObj.render();

    // transformations for base of the lamp
    mat4.scale(localTransforms, modelMatrix, [0.4, 0.05, 0.15]);
    gl.uniformMatrix4fv(lampKdesh.uniforms.mMat, false, localTransforms);
    lampKdesh.cubeObj.render();
    gl.useProgram(null);
}
