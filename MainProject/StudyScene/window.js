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

function renderForWindowKdesh(projectionMatrix, viewMatrix, modelMatrix, lightPosition, texOutside) {
    gl.useProgram(windowKdesh.program);
    gl.uniformMatrix4fv(windowKdesh.uniforms.pMat, false, projectionMatrix);
    gl.uniformMatrix4fv(windowKdesh.uniforms.vMat, false, viewMatrix);
    gl.uniform3fv(windowKdesh.uniforms.lightPos, lightPosition);
    gl.uniform1i(windowKdesh.uniforms.isInvertNormals, 0);
    gl.uniform1i(windowKdesh.uniforms.isLight, 0);
    gl.uniform1i(windowKdesh.uniforms.isTexture, 1);
    gl.uniform1i(windowKdesh.uniforms.diffuseTextureSampler, 0);
    gl.activeTexture(gl.TEXTURE0);

    var localMat = mat4.create();

    gl.bindTexture(gl.TEXTURE_2D, texOutside);
    gl.uniformMatrix4fv(windowKdesh.uniforms.mMat, false, modelMatrix);
    windowKdesh.quad.render();

    gl.bindTexture(gl.TEXTURE_2D, windowKdesh.texWindow);
    mat4.translate(localMat, modelMatrix, [-1.0, 0.0, 0.0]);
    mat4.scale(localMat, localMat, [0.1, 1.1, 0.05]);
    gl.uniformMatrix4fv(windowKdesh.uniforms.mMat, false, localMat);
    windowKdesh.cube.render();

    mat4.translate(localMat, modelMatrix, [0.0,-1.0, 0.0]);
    mat4.scale(localMat, localMat, [1.0, 0.1, 0.05]);
    gl.uniformMatrix4fv(windowKdesh.uniforms.mMat, false, localMat);
    windowKdesh.cube.render();

    mat4.translate(localMat, modelMatrix, [1.0, 0.0, 0.0]);
    mat4.scale(localMat, localMat, [0.1, 1.1, 0.05]);
    gl.uniformMatrix4fv(windowKdesh.uniforms.mMat, false, localMat);
    windowKdesh.cube.render();

    mat4.translate(localMat, modelMatrix, [0.0, 1.0, 0.0]);
    mat4.scale(localMat, localMat, [1.0, 0.1, 0.05]);
    gl.uniformMatrix4fv(windowKdesh.uniforms.mMat, false, localMat);
    windowKdesh.cube.render();
    gl.bindTexture(gl.TEXTURE_2D, null);
}
