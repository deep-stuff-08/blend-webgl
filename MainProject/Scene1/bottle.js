"use strict"
var bottleKdesh = {
    program: null,
    uniforms: null,
    cylinderObj: null,
    paraboloidObj: null,
    texWood: null
};

function setupProgramForBottleKdesh() {
    bottleKdesh.program = progPhongLightWithTexture.program;
    bottleKdesh.uniforms = progPhongLightWithTexture.uniforms;
}

function initForBottleKdesh() {
    bottleKdesh.cylinderObj = dshapes.initCylinder(50);
    bottleKdesh.paraboloidObj = dshapes.initParaboloid(1.0, 25);

    bottleKdesh.texWood = loadTexture("resources/textures/wood.png");
}

function renderForBottleKdesh(perspectiveMatrix, viewMatrix, modelMatrix, lightPosition) {
    gl.useProgram(bottleKdesh.program);
    gl.uniformMatrix4fv(bottleKdesh.uniforms.pMat, false, perspectiveMatrix);
    gl.uniformMatrix4fv(bottleKdesh.uniforms.vMat, false, viewMatrix);
    gl.uniform3fv(bottleKdesh.uniforms.lightPos, lightPosition);
    gl.uniform1i(bottleKdesh.uniforms.isInvertNormals, 0);
    gl.uniform1i(bottleKdesh.uniforms.isLight, 1);
    gl.uniform1i(bottleKdesh.uniforms.isTexture, 1);
    gl.uniform1i(bottleKdesh.uniforms.diffuseTextureSampler, 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, bottleKdesh.texWood);

    var localTransforms = mat4.create();

    // body
    mat4.scale(localTransforms, modelMatrix, [0.05, 0.15, 0.05]);
    gl.uniformMatrix4fv(bottleKdesh.uniforms.mMat, false, localTransforms);
    bottleKdesh.cylinderObj.render();

    mat4.translate(localTransforms, modelMatrix, [0.0, 0.2, 0.0]);
    mat4.rotate(localTransforms, localTransforms, Math.PI, [1.0, 0.0, 0.0]);
    mat4.scale(localTransforms, localTransforms, [0.05, 0.05, 0.05]);
    gl.uniformMatrix4fv(bottleKdesh.uniforms.mMat, false, localTransforms);
    bottleKdesh.paraboloidObj.render();

    mat4.translate(localTransforms, modelMatrix, [0.0, 0.25, 0.0]);
    mat4.scale(localTransforms, localTransforms, [0.02, 0.07, 0.02]);
    gl.uniformMatrix4fv(bottleKdesh.uniforms.mMat, false, localTransforms);
    bottleKdesh.cylinderObj.render();
}

