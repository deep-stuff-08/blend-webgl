"use strict"
var studySceneKdesh = {
    program: null,
    uniforms: null,
    cubeRoom: null,
    quadBill1: null,
    texBill1: null,
    quadBill2: null,
    texBill1: null,
    quadBill3: null,
    texBill1: null,
    quadBill4: null,
    texBill1: null,
    quadBill5: null,
    texBill1: null,
    fboWindow: null,
    texOutside: null,
    texWall: null,
    camera: null,
    cameraPath: [
        //      position            center               up               velocity      //
        [ [-1.0,  0.0, -3.0], [ 0.0,  0.0, -3.0], [ 0.0,  1.0,  0.0], [ 0.0,  1.0,  1.0] ],
        [ [ 0.0,  1.0,  3.0], [ 0.0,  0.0, -3.0], [ 0.0,  1.0,  0.0], [ 0.0,  1.0,  1.0] ],
        [ [ 1.0,  2.0,  6.0], [ 0.0,  0.0, -3.0], [ 0.0,  1.0,  0.0], [ 0.0,  1.0,  1.0] ]
    ]
};

function setupProgramForStudySceneKdesh() {
    studySceneKdesh.program = progPhongLightWithTexture.program;
	studySceneKdesh.uniforms = progPhongLightWithTexture.uniforms;

    setupProgramForTableKdesh();
    setupProgramForLampKdesh();
    setupProgramForBottleKdesh();
    setupProgramForWindowKdesh();
}

function initForStudySceneKdesh(sceneCamera) {
    initForTableKdesh();
    initForLampKdesh();
    initForBottleKdesh();
    initForWindowKdesh();

    studySceneKdesh.fboWindow = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, studySceneKdesh.fboWindow);

    studySceneKdesh.texOutside = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, studySceneKdesh.texOutside);
    gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA8, 1024, 1024);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, studySceneKdesh.texOutside, 0);
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    studySceneKdesh.cubeRoom = dshapes.initCube();
    studySceneKdesh.quadBill1 = dshapes.initQuad();
    studySceneKdesh.quadBill2 = dshapes.initQuad();
    studySceneKdesh.quadBill3 = dshapes.initQuad();
    studySceneKdesh.quadBill4 = dshapes.initQuad();
    studySceneKdesh.quadBill5 = dshapes.initQuad();

    studySceneKdesh.texWall = loadTexture("resources/textures/whitewall.jpg");
    studySceneKdesh.texBill1 = loadTexture("resources/textures/bill1.png");
    studySceneKdesh.texBill2 = loadTexture("resources/textures/bill2.png");
    studySceneKdesh.texBill3 = loadTexture("resources/textures/bill3.png");
    studySceneKdesh.texBill4 = loadTexture("resources/textures/bill4.png");
    studySceneKdesh.texBill5 = loadTexture("resources/textures/bill5.png");

    sceneCamera.updatePath(studySceneKdesh.cameraPath);
}

function renderForStudySceneKdesh(perspectiveMatrix, viewMatrix) {
    var lastBoundFbo = gl.getParameter(gl.FRAMEBUFFER_BINDING);
    var lastViewport = gl.getParameter(gl.VIEWPORT);

    var lightPosition = [0.0, 4.5, 0.0];
    // renderLightSourceDeep(perspectiveMatrix, viewMatrix, lightPosition, [1.0, 0.0, 0.0]);

    gl.bindFramebuffer(gl.FRAMEBUFFER, studySceneKdesh.fboWindow);
    gl.clearBufferfv(gl.COLOR, 0, [0.1, 0.1, 0.1, 1.0]);
    gl.viewport(0, 0, 1024, 1024);

    // TODO: render window outside

    gl.bindFramebuffer(gl.FRAMEBUFFER, lastBoundFbo);
    gl.viewport(lastViewport[0], lastViewport[1], lastViewport[2], lastViewport[3]);

    gl.useProgram(studySceneKdesh.program);
    gl.uniformMatrix4fv(studySceneKdesh.uniforms.pMat, false, perspectiveMatrix);
    gl.uniformMatrix4fv(studySceneKdesh.uniforms.vMat, false, viewMatrix);
    gl.uniform3fv(studySceneKdesh.uniforms.lightPos, lightPosition);
    gl.uniform1i(studySceneKdesh.uniforms.isInvertNormals, 1);
    gl.uniform1i(studySceneKdesh.uniforms.isLight, 1);
    gl.uniform1i(studySceneKdesh.uniforms.isTexture, 1);
    gl.uniform1i(studySceneKdesh.uniforms.diffuseTextureSampler, 0);
    gl.activeTexture(gl.TEXTURE0);
    
    gl.bindTexture(gl.TEXTURE_2D, studySceneKdesh.texWall);
    var modelMatrix = mat4.create();
    mat4.translate(modelMatrix, modelMatrix, [0.0, 1.0, 5.0]);
    mat4.scale(modelMatrix, modelMatrix, [5.0, 4.0, 10.0]);
    gl.uniformMatrix4fv(studySceneKdesh.uniforms.mMat, false, modelMatrix);
    studySceneKdesh.cubeRoom.render();

    gl.bindTexture(gl.TEXTURE_2D, studySceneKdesh.texBill1);
    gl.uniform1i(studySceneKdesh.uniforms.isLight, 0);
    gl.uniformMatrix4fv(studySceneKdesh.uniforms.mMat, false, mat4.create());
    gl.uniformMatrix2fv(studySceneKdesh.uniforms.texMat, false, mat2.create());
    studySceneKdesh.quadBill1.render();
    gl.uniform1i(studySceneKdesh.uniforms.isLight, 1);

    modelMatrix = mat4.create();
    mat4.translate(modelMatrix, modelMatrix, [0.0, 0.5, -4.8]);
    mat4.scale(modelMatrix, modelMatrix, [1.5, 1.0, 1.0]);
    renderForWindowKdesh(perspectiveMatrix, viewMatrix, modelMatrix, lightPosition, studySceneKdesh.texOutside);

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

    gl.useProgram(null);
}
