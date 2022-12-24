"use strict"
var tableKdesh = {
    program: null,
    uniforms: null,
    cubeObj: null,
    texWood: null
};

function setupProgramForTableKdesh() {
    tableKdesh.program = progPhongLightWithTexture.program;
    tableKdesh.uniforms = progPhongLightWithTexture.uniforms;
}

function initForTableKdesh() {
    tableKdesh.cubeObj = dshapes.initCube();
    tableKdesh.texWood = loadTexture("resources/textures/wood.png");
}

function renderForTableKdesh(perspectiveMatrix, viewMatrix, modelMatrix, lightPosition) {
    gl.useProgram(tableKdesh.program);

    gl.uniformMatrix4fv(tableKdesh.uniforms.pMat, false, perspectiveMatrix);
    gl.uniformMatrix4fv(tableKdesh.uniforms.vMat, false, viewMatrix);
    gl.uniform3fv(tableKdesh.uniforms.lightPos, lightPosition);
    gl.uniform1i(tableKdesh.uniforms.isInvertNormals, 0);
    gl.uniform1i(tableKdesh.uniforms.isLight, 1);
    gl.uniform1i(tableKdesh.uniforms.isTexture, 1);
    gl.uniform1i(tableKdesh.uniforms.diffuseTextureSampler, 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tableKdesh.texWood);

    var localTransforms = mat4.create();

    // top
    mat4.copy(localTransforms, modelMatrix);
    mat4.scale(localTransforms, localTransforms, [2.0, 0.1, 1.5]);
    gl.uniformMatrix4fv(tableKdesh.uniforms.mMat, false, localTransforms);
    tableKdesh.cubeObj.render();

    // rear-right leg
    mat4.translate(localTransforms, modelMatrix, [1.5, -1.0, -1.0]);
    mat4.rotate(localTransforms, localTransforms, glMatrix.toRadian(10), [0.0, 0.0, 1.0]);
    mat4.scale(localTransforms, localTransforms, [0.1, 1.0, 0.1]);
    gl.uniformMatrix4fv(tableKdesh.uniforms.mMat, false, localTransforms);
    tableKdesh.cubeObj.render();

    // rear-left leg
    mat4.translate(localTransforms, modelMatrix, [-1.5, -1.0, -1.0]);
    mat4.rotate(localTransforms, localTransforms, glMatrix.toRadian(10), [0.0, 0.0, -1.0]);
    mat4.scale(localTransforms, localTransforms, [0.1, 1.0, 0.1]);
    gl.uniformMatrix4fv(tableKdesh.uniforms.mMat, false, localTransforms);
    tableKdesh.cubeObj.render();

    // front-left leg
    mat4.translate(localTransforms, modelMatrix, [-1.5, -1.0, 1.0]);
    mat4.rotate(localTransforms, localTransforms, glMatrix.toRadian(10), [0.0, 0.0, -1.0]);
    mat4.scale(localTransforms, localTransforms, [0.1, 1.0, 0.1]);
    gl.uniformMatrix4fv(tableKdesh.uniforms.mMat, false, localTransforms);
    tableKdesh.cubeObj.render();

    // front-right leg
    mat4.translate(localTransforms, modelMatrix, [1.5, -1.0, 1.0]);
    mat4.rotate(localTransforms, localTransforms, glMatrix.toRadian(10), [0.0, 0.0, 1.0]);
    mat4.scale(localTransforms, localTransforms, [0.1, 1.0, 0.1]);
    gl.uniformMatrix4fv(tableKdesh.uniforms.mMat, false, localTransforms);
    tableKdesh.cubeObj.render();

    gl.useProgram(null);
}
