"use strict"
var studySceneKdesh = {
    program: null,
    uniforms: null,
    programForModels: null,
    uniformsForModels: {
        pMat: null,
        vMat: null,
        mMat: null,
        viewPos: null
    },
    lights: [],
    cubeRoom: null,
    bottle: null,
    glass: null,
    dustbin: null,
    sofa: null,
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

    var vertShader = createShader('BarScene/shaders/demo.vert', gl.VERTEX_SHADER);
	var fragShader = createShader('BarScene/shaders/demo.frag', gl.FRAGMENT_SHADER);
	studySceneKdesh.programForModels = createProgram([vertShader, fragShader]);
	deleteShader(vertShader);
	deleteShader(fragShader);

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

    studySceneKdesh.uniformsForModels.pMat = gl.getUniformLocation(studySceneKdesh.programForModels, "pMat");
	studySceneKdesh.uniformsForModels.vMat = gl.getUniformLocation(studySceneKdesh.programForModels, "vMat");
	studySceneKdesh.uniformsForModels.mMat = gl.getUniformLocation(studySceneKdesh.programForModels, "mMat");
	studySceneKdesh.uniformsForModels.viewPos = gl.getUniformLocation(studySceneKdesh.programForModels, "viewPos");

    studySceneKdesh.cubeRoom = dshapes.initCube();
    studySceneKdesh.quadBill1 = dshapes.initQuad();
    studySceneKdesh.quadBill2 = dshapes.initQuad();
    studySceneKdesh.quadBill3 = dshapes.initQuad();
    studySceneKdesh.quadBill4 = dshapes.initQuad();
    studySceneKdesh.quadBill5 = dshapes.initQuad();

    studySceneKdesh.texWall = loadTexture("resources/textures/whitewall.jpg");
    studySceneKdesh.texBill1 = loadTexture("resources/textures/bill1.png", true);
    studySceneKdesh.texBill2 = loadTexture("resources/textures/bill2.png", true);
    studySceneKdesh.texBill3 = loadTexture("resources/textures/bill3.png");
    studySceneKdesh.texBill4 = loadTexture("resources/textures/bill4.png");
    studySceneKdesh.texBill5 = loadTexture("resources/textures/bill5.png");

    studySceneKdesh.bottle = new Model('BarScene/resources/bottle.json');
    studySceneKdesh.glass = new Model('BarScene/resources/glass.json');
    studySceneKdesh.dustbin = new Model('resources/models/static/Dustbin/dustbin.json');
    studySceneKdesh.sofa = new Model('HospitalScene/resources/sofa.json');

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

    gl.useProgram(progCompleteLight.program);
    resetCompleteLight();
    setProjectionAndViewCompleteLight(perspectiveMatrix, viewMatrix, cameraPosition);
    setTextureMatrixCompleteLight(mat2.create());
    addLightCompleteLight(lightPosition, [0.7, 0.7, 0.7], [1.0, 1.0, 1.0], [1.0, 1.0, 1.0]);
    setMaterialCompleteLight([0.8, 0.8, 0.8], [1.0, 1.0, 1.0], [1.0, 1.0, 1.0], 128, 1.0);
    setFlagsCompleteLight(1, 0, 1, 1);
    setTextureSamplersCompleteLight(0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, studySceneKdesh.texWall);
    var modelMatrix = mat4.create();
    mat4.translate(modelMatrix, modelMatrix, [0.0, 1.0, 1.0]);
    mat4.scale(modelMatrix, modelMatrix, [6.0, 4.0, 6.0]);
    setModelMatrixCompleteLight(modelMatrix);
    studySceneKdesh.cubeRoom.render();

    setFlagsCompleteLight(1, 0, 1, 0);  // !!! lights going off
    gl.bindTexture(gl.TEXTURE_2D, studySceneKdesh.texBill1);
    modelMatrix = mat4.create();
    mat4.translate(modelMatrix, modelMatrix, [0.98, -0.945, -3.3]);
    mat4.rotate(modelMatrix, modelMatrix, Math.PI / 2, [-1.0, 0.0, 0.0]);
    mat4.rotate(modelMatrix, modelMatrix, Math.PI / 6, [0.0, 0.0, -1.0]);
    mat4.scale(modelMatrix, modelMatrix, [0.6, 0.7, 1.0]);
    setModelMatrixCompleteLight(modelMatrix);
    studySceneKdesh.quadBill1.render();

    gl.bindTexture(gl.TEXTURE_2D, studySceneKdesh.texBill2);
    modelMatrix = mat4.create();
    mat4.translate(modelMatrix, modelMatrix, [0.5, -0.94, -3.3]);
    mat4.rotate(modelMatrix, modelMatrix, Math.PI / 2, [-1.0, 0.0, 0.0]);
    mat4.rotate(modelMatrix, modelMatrix, Math.PI / 12, [0.0, 0.0, 1.0]);
    mat4.scale(modelMatrix, modelMatrix, [0.6, 0.7, 1.0]);
    setModelMatrixCompleteLight(modelMatrix);
    studySceneKdesh.quadBill1.render();

    /* modelMatrix = mat4.create();
    mat4.translate(modelMatrix, modelMatrix, [0.5, -2.5, -4.5]);
    mat4.rotate(modelMatrix, modelMatrix, Math.PI / 2, [1.0, 0.0, 0.0]);
    mat4.scale(modelMatrix, modelMatrix, [5.0, 5.0, 5.0]);
    gl.uniformMatrix4fv(studySceneKdesh.uniforms.mMat, false, modelMatrix);
    studySceneKdesh.bottle.render(studySceneKdesh.program);  // rendered light
    mat4.translate(modelMatrix, modelMatrix, [0.1, 0.0, 0.0]);
    gl.uniformMatrix4fv(studySceneKdesh.uniforms.mMat, false, modelMatrix);
    studySceneKdesh.bottle.render(studySceneKdesh.program);  // rendered dark??
    mat4.translate(modelMatrix, modelMatrix, [-0.05, 0.05, 0.0]);
    gl.uniformMatrix4fv(studySceneKdesh.uniforms.mMat, false, modelMatrix);
    studySceneKdesh.bottle.render(studySceneKdesh.program);  // rendered dark?? */

    /* modelMatrix = mat4.create();
    mat4.translate(modelMatrix, modelMatrix, [3.5, -3.0, -4.2]);
    mat4.rotate(modelMatrix,modelMatrix, Math.PI / 2, [0.0, -1.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix, [0.2, 0.2, 0.2]);
	gl.useProgram(studySceneKdesh.programForModels);
	gl.uniformMatrix4fv(studySceneKdesh.uniformsForModels.pMat, false, perspectiveMatrix);
	gl.uniformMatrix4fv(studySceneKdesh.uniformsForModels.vMat, false, viewMatrix);
	gl.uniformMatrix4fv(studySceneKdesh.uniformsForModels.mMat, false, modelMatrix);
	gl.uniform3fv(studySceneKdesh.uniformsForModels.viewPos, cameraPosition);
	for(var l = 0; l < studySceneKdesh.lights.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(studySceneKdesh.programForModels,"light["+l+"].direction"),studySceneKdesh.lights[l].position);
		gl.uniform3fv(gl.getUniformLocation(studySceneKdesh.programForModels,"light["+l+"].ambient"), studySceneKdesh.lights[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(studySceneKdesh.programForModels,"light["+l+"].diffuse"), studySceneKdesh.lights[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(studySceneKdesh.programForModels,"light["+l+"].specular"), studySceneKdesh.lights[l].specular);
	}
    studySceneKdesh.dustbin.render(studySceneKdesh.program);
    gl.useProgram(null);

    modelMatrix = mat4.create();
    mat4.translate(modelMatrix, modelMatrix, [5.3, -2.2, 3.5]);
    mat4.rotate(modelMatrix,modelMatrix, Math.PI / 2, [0.0, -1.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[0.8, 0.3, 0.3]);
	gl.useProgram(studySceneKdesh.programForModels);
	gl.uniformMatrix4fv(studySceneKdesh.uniformsForModels.pMat, false, perspectiveMatrix);
	gl.uniformMatrix4fv(studySceneKdesh.uniformsForModels.vMat, false, viewMatrix);
	gl.uniformMatrix4fv(studySceneKdesh.uniformsForModels.mMat, false, modelMatrix);
	gl.uniform3fv(studySceneKdesh.uniformsForModels.viewPos, cameraPosition);
	for(var l = 0; l < studySceneKdesh.lights.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(studySceneKdesh.programForModels,"light["+l+"].direction"),studySceneKdesh.lights[l].position);
		gl.uniform3fv(gl.getUniformLocation(studySceneKdesh.programForModels,"light["+l+"].ambient"), studySceneKdesh.lights[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(studySceneKdesh.programForModels,"light["+l+"].diffuse"), studySceneKdesh.lights[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(studySceneKdesh.programForModels,"light["+l+"].specular"), studySceneKdesh.lights[l].specular);
	}
	studySceneKdesh.sofa.render(studySceneKdesh.programForModels);
	gl.useProgram(null); */
    // !!! lights coming back on

    modelMatrix = mat4.create();
    mat4.translate(modelMatrix, modelMatrix, [0.0, 1.0, -4.8]);
    mat4.scale(modelMatrix, modelMatrix, [3.5, 1.5, 1.0]);
    renderForWindowKdesh(perspectiveMatrix, viewMatrix, modelMatrix, lightPosition, studySceneKdesh.texOutside);

    modelMatrix = mat4.create();
    mat4.translate(modelMatrix, modelMatrix, [0.9, -0.93, -2.7]);
    mat4.rotate(modelMatrix, modelMatrix, Math.PI / 2, [-1.0, 0.0, 0.0]);
    mat4.rotate(modelMatrix, modelMatrix, Math.PI / 6, [0.0, 0.0, -1.0]);
    mat4.scale(modelMatrix, modelMatrix, [0.2, 0.2, 0.2]);
    renderForPhoneDeep(perspectiveMatrix, viewMatrix, modelMatrix, lightPosition, studySceneKdesh.texOutside);

    modelMatrix = mat4.create();
    mat4.translate(modelMatrix, modelMatrix, [0.0, -1.05, -3.49]);
    renderForTableKdesh(perspectiveMatrix, viewMatrix, modelMatrix, lightPosition);

    modelMatrix = mat4.create();
    mat4.translate(modelMatrix, modelMatrix, [0.9, -0.9, -4.5]);
    mat4.rotate(modelMatrix, modelMatrix, Math.PI / 6.0, [0.0, 1.0, 0.0]);
    mat4.scale(modelMatrix, modelMatrix, [0.6, 0.6, 0.6]);
    renderForLampKdesh(perspectiveMatrix, viewMatrix, modelMatrix, lightPosition);

    gl.enable(gl.BLEND);
    gl.useProgram(studySceneKdesh.programForModels);
	gl.uniformMatrix4fv(studySceneKdesh.uniformsForModels.pMat, false, perspectiveMatrix);
	gl.uniformMatrix4fv(studySceneKdesh.uniformsForModels.vMat, false, viewMatrix);
    gl.uniform3fv(studySceneKdesh.uniformsForModels.viewPos, cameraPosition);
    modelMatrix = mat4.create();
    mat4.rotate(modelMatrix,modelMatrix, Math.PI / 2, [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[5.0,5.0,5.0]);
    mat4.translate(modelMatrix, modelMatrix, [0.5, -2.5, -4.5]);
	gl.uniformMatrix4fv(studySceneKdesh.uniformsForModels.mMat, false, modelMatrix);
    gl.uniform3fv(gl.getUniformLocation(studySceneKdesh.programForModels,"light[0].direction"), [0.5, -2.5, -4.0]);
    gl.uniform3fv(gl.getUniformLocation(studySceneKdesh.programForModels,"light[0].ambient"), [0.5,0.5,0.5]);
    gl.uniform3fv(gl.getUniformLocation(studySceneKdesh.programForModels,"light[0].diffuse"), [0.8,0.8,0.8]);
    gl.uniform3fv(gl.getUniformLocation(studySceneKdesh.programForModels,"light[0].specular"), [1.0,1.0,1.0]);
	studySceneKdesh.bottle.render(studySceneKdesh.programForModels);
    gl.useProgram(null);

    gl.useProgram(progCompleteLight.program);
    resetCompleteLight();
    setProjectionAndViewCompleteLight(perspectiveMatrix, viewMatrix, cameraPosition);
    setFlagsCompleteLight(0, 1, 0, 1);
    addLightCompleteLight(lightPosition, [0.7, 0.7, 0.7], [1.0, 1.0, 1.0], [1.0, 1.0, 1.0]);
    setMaterialCompleteLight([0.8, 0.8, 0.8], [0.8, 0.8, 0.8], [1.0, 1.0, 1.0], 128, 0.6);
    modelMatrix = mat4.create();
    mat4.translate(modelMatrix, modelMatrix, [-0.7, -0.005, -2.4]);
    mat4.rotate(modelMatrix, modelMatrix, Math.PI / 30, [-1.0, 0.0, 0.0]);
    mat4.rotate(modelMatrix, modelMatrix, Math.PI / 6, [0.0, 1.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix, [5.0, 5.0, 5.0]);
	setModelMatrixCompleteLight(modelMatrix);
    studySceneKdesh.glass.render(progCompleteLight.program);
    gl.useProgram(null);
    gl.disable(gl.BLEND);
}
