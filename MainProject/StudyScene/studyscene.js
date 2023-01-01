"use strict"
var studySceneKdesh = {
    program: null,
    uniforms: null,
    cubeRoom: null,
    quadBill: null,
    sofa: null,
    liquorCabinet: null,
    chair: null,
    dustbin: null,
    wine: null,
    champagne: null,
    hennessy: null,
    jackDaniels: null,
    glass: null,
    crumbledPaper: null,
    texBill1: null,
    texBill1: null,
    texBill1: null,
    texBill1: null,
    texBill1: null,
    texSteel: null,
    texWall: null,
    texWood: null,
    texSofa: null,
    texOutside: null,
    fboWindow: null,
    cameraPath: [
        //  position            center             up             velocity      //
        [[4.5, -1.0, 4.8], [4.5, -1.8, 4.8], [0.0, 1.0, 0.0], [-0.5, 0.5, 0.4]],
        [[2.0, -0.5, 5.0], [2.5, -0.45, 5.0], [0.0, 1.0, 0.0], [-0.34, 0.5, -0.4]],
        [[3.0, 0.0, 5.0], [1.5, 0.15, 5.0], [0.0, 1.0, 0.0], [-0.17, 0.5, 0.4]],
        [[0.0, 0.5, 4.0], [0.0, 0.0, 2.0], [0.0, 1.0, 0.0], [0.0, 0.5, -0.4]],
        [[0.0, 1.0, -1.0], [0.0, -2.0, -4.0], [0.0, 1.0, 0.0], [0.0, -0.5, -0.4]]
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

function initForStudySceneKdesh() {
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
    studySceneKdesh.quadBill = dshapes.initQuad();

    studySceneKdesh.texWall = loadTexture("resources/textures/whitewall.jpg");
    studySceneKdesh.texBill1 = loadTexture("resources/textures/bill1.png", true);
    studySceneKdesh.texBill2 = loadTexture("resources/textures/bill2.png", true);
    studySceneKdesh.texBill3 = loadTexture("resources/textures/bill3.png");
    studySceneKdesh.texBill4 = loadTexture("resources/textures/bill4.png");
    studySceneKdesh.texBill5 = loadTexture("resources/textures/bill5.png");
    studySceneKdesh.texSteel = loadTexture("resources/textures/steel.jpg");
    studySceneKdesh.texWood = loadTexture("resources/textures/wood.png");
    studySceneKdesh.texSofa = loadTexture("resources/textures/sofa.jpg");
    studySceneKdesh.texPhone = loadTexture("resources/textures/Instagram.jpg", true);

    studySceneKdesh.glass = new Model('BarScene/resources/glass.json');
    studySceneKdesh.dustbin = new Model('resources/models/static/Dustbin/dustbin.json');
    studySceneKdesh.sofa = new Model('resources/models/static/Sofa/sofa.json');
    studySceneKdesh.chair = new Model('resources/models/static/StudyChair/studychair.json');
    studySceneKdesh.liquorCabinet = new Model('resources/models/static/LiquorCabinet/liquorcabinet.json');
    studySceneKdesh.crumbledPaper = new Model('resources/models/static/CrumbledPaper/crumbledPaper.json');
    studySceneKdesh.wine = new Model('resources/models/static/LiquorBottles/wine.json');
    studySceneKdesh.champagne = new Model('resources/models/static/LiquorBottles/champagne.json');
    studySceneKdesh.hennessy = new Model('resources/models/static/LiquorBottles/hennessy.json');
    studySceneKdesh.jackDaniels = new Model('resources/models/static/LiquorBottles/jackdaniels.json');

    // sceneCamera.updatePath(studySceneKdesh.cameraPath);
}

function renderForStudySceneKdesh(perspectiveMatrix, viewMatrix) {
    var lastBoundFbo = gl.getParameter(gl.FRAMEBUFFER_BINDING);
    var lastViewport = gl.getParameter(gl.VIEWPORT);

    var lightPosition = [0.8, -0.05, -4.5];
    var phonePosition = [4.5, -1.75, 4.8];
    var bottlePosition = [-5.5, -1.2, -3.0];
    // renderLightSourceDeep(perspectiveMatrix, viewMatrix, lightPosition, [1.0, 1.0, 1.0]);
    // renderLightSourceDeep(perspectiveMatrix, viewMatrix, phonePosition, [1.0, 1.0, 1.0]);
    // renderLightSourceDeep(perspectiveMatrix, viewMatrix, bottlePosition, [1.0, 1.0, 1.0]);

    gl.bindFramebuffer(gl.FRAMEBUFFER, studySceneKdesh.fboWindow);
    gl.clearBufferfv(gl.COLOR, 0, [0.1, 0.5, 0.1, 1.0]);
    gl.viewport(0, 0, 1024, 1024);

    // TODO: render window outside

    gl.bindFramebuffer(gl.FRAMEBUFFER, lastBoundFbo);
    gl.viewport(lastViewport[0], lastViewport[1], lastViewport[2], lastViewport[3]);

    var cameraPosition = debugCamera.cameraPosition;

    gl.useProgram(progCompleteLight.program);
    resetCompleteLight();
    setProjectionAndViewCompleteLight(perspectiveMatrix, viewMatrix, cameraPosition);
    setTextureMatrixCompleteLight(mat2.create());
    // addPointLightCompleteLight(lightPosition, [0.7, 0.7, 0.7], [1.0, 1.0, 1.0], [1.0, 1.0, 1.0], [0.0, 0.0, 0.0]);
    addPointLightCompleteLight(lightPosition, [0.7, 0.7, 0.7], [1.0, 1.0, 1.0], [1.0, 1.0, 1.0], [0.8, 0.1, 0.05]);
    addPointLightCompleteLight(phonePosition, [0.5, 0.5, 0.5], [1.0, 1.0, 1.0], [0.1, 0.1, 0.1], [0.8, 0.8, 0.8]);
    addPointLightCompleteLight(bottlePosition, [0.2, 0.7, 0.8], [1.0, 1.0, 1.0], [0.1, 0.1, 0.1], [0.99, 0.99, 0.99]);
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

    setFlagsCompleteLight(0, 0, 1, 0);  // !!! lights going off
    gl.bindTexture(gl.TEXTURE_2D, studySceneKdesh.texBill1);
    modelMatrix = mat4.create();
    mat4.translate(modelMatrix, modelMatrix, [0.98, -0.945, -3.3]);
    mat4.rotate(modelMatrix, modelMatrix, Math.PI / 2, [-1.0, 0.0, 0.0]);
    mat4.rotate(modelMatrix, modelMatrix, Math.PI / 6, [0.0, 0.0, -1.0]);
    mat4.scale(modelMatrix, modelMatrix, [0.6, 0.7, 1.0]);
    setModelMatrixCompleteLight(modelMatrix);
    studySceneKdesh.quadBill.render();
    gl.bindTexture(gl.TEXTURE_2D, studySceneKdesh.texBill2);
    mat4.identity(modelMatrix)
    mat4.translate(modelMatrix, modelMatrix, [0.5, -0.935, -3.3]);
    mat4.rotate(modelMatrix, modelMatrix, Math.PI / 2, [-1.0, 0.0, 0.0]);
    mat4.rotate(modelMatrix, modelMatrix, Math.PI / 12, [0.0, 0.0, 1.0]);
    mat4.scale(modelMatrix, modelMatrix, [0.6, 0.7, 1.0]);
    setModelMatrixCompleteLight(modelMatrix);
    studySceneKdesh.quadBill.render();
    gl.bindTexture(gl.TEXTURE_2D, studySceneKdesh.texBill3);
    mat4.identity(modelMatrix);
    setFlagsCompleteLight(1, 0, 1, 0);
    mat4.translate(modelMatrix, modelMatrix, [-0.5, -0.94, -3.3]);
    mat4.rotate(modelMatrix, modelMatrix, Math.PI / 2, [1.0, 0.0, 0.0]);
    mat4.rotate(modelMatrix, modelMatrix, Math.PI / 12, [0.0, 0.0, 1.0]);
    mat4.scale(modelMatrix, modelMatrix, [0.6, 0.7, 1.0]);
    setModelMatrixCompleteLight(modelMatrix);
    studySceneKdesh.quadBill.render();
    gl.bindTexture(gl.TEXTURE_2D, studySceneKdesh.texBill4);
    mat4.identity(modelMatrix);
    mat4.translate(modelMatrix, modelMatrix, [-1.0, -0.93, -3.3]);
    mat4.rotate(modelMatrix, modelMatrix, Math.PI / 2, [1.0, 0.0, 0.0]);
    mat4.rotate(modelMatrix, modelMatrix, Math.PI / 24, [0.0, 0.0, -1.0]);
    mat4.scale(modelMatrix, modelMatrix, [0.6, 0.7, 1.0]);
    setModelMatrixCompleteLight(modelMatrix);
    studySceneKdesh.quadBill.render();
    gl.bindTexture(gl.TEXTURE_2D, studySceneKdesh.texBill5);
    mat4.identity(modelMatrix);
    mat4.translate(modelMatrix, modelMatrix, [-1.3, -0.935, -3.3]);
    mat4.rotate(modelMatrix, modelMatrix, Math.PI / 2, [1.0, 0.0, 0.0]);
    mat4.rotate(modelMatrix, modelMatrix, Math.PI / 12, [0.0, 0.0, -1.0]);
    mat4.scale(modelMatrix, modelMatrix, [0.6, 0.7, 1.0]);
    setModelMatrixCompleteLight(modelMatrix);
    studySceneKdesh.quadBill.render();

    setFlagsCompleteLight(0, 0, 1, 1);
    gl.bindTexture(gl.TEXTURE_2D, studySceneKdesh.texSteel);
    modelMatrix = mat4.create();
    mat4.translate(modelMatrix, modelMatrix, [3.5, -3.02, -4.2]);
    mat4.rotate(modelMatrix,modelMatrix, Math.PI / 2, [0.0, -1.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix, [0.2, 0.2, 0.2]);
    setModelMatrixCompleteLight(modelMatrix);
    studySceneKdesh.dustbin.render(progCompleteLight.program);

    setFlagsCompleteLight(0, 0, 1, 1);
    modelMatrix = mat4.create();
    mat4.translate(modelMatrix, modelMatrix, [-5.6, -0.2, -3.7]);
    mat4.rotate(modelMatrix, modelMatrix, Math.PI / 2, [-1.0, 0.0, 0.0]);
    mat4.rotate(modelMatrix, modelMatrix, Math.PI / 2, [0.0, 0.0, 1.0]);
	mat4.scale(modelMatrix,modelMatrix, [0.34, 0.34, 1.0]);
	mat4.scale(modelMatrix,modelMatrix, [0.7, 0.7, 0.7]);
    setModelMatrixCompleteLight(modelMatrix);
    studySceneKdesh.champagne.render(progCompleteLight.program);
    mat4.identity(modelMatrix);
    mat4.translate(modelMatrix, modelMatrix, [-5.6, -0.2, -3.0]);
    mat4.rotate(modelMatrix, modelMatrix, Math.PI / 2, [-1.0, 0.0, 0.0]);
    mat4.rotate(modelMatrix, modelMatrix, Math.PI / 2, [0.0, 0.0, 1.0]);
	mat4.scale(modelMatrix,modelMatrix, [0.34, 0.34, 1.0]);
	mat4.scale(modelMatrix,modelMatrix, [0.7, 0.7, 0.7]);
    setModelMatrixCompleteLight(modelMatrix);
    studySceneKdesh.hennessy.render(progCompleteLight.program);
    mat4.identity(modelMatrix);
    mat4.translate(modelMatrix, modelMatrix, [-5.6, -0.2, -2.3]);
    mat4.rotate(modelMatrix, modelMatrix, Math.PI / 2, [-1.0, 0.0, 0.0]);
    mat4.rotate(modelMatrix, modelMatrix, Math.PI / 2, [0.0, 0.0, 1.0]);
	mat4.scale(modelMatrix,modelMatrix, [0.34, 0.34, 1.0]);
	mat4.scale(modelMatrix,modelMatrix, [0.7, 0.7, 0.7]);
    setModelMatrixCompleteLight(modelMatrix);
    studySceneKdesh.jackDaniels.render(progCompleteLight.program);
    mat4.identity(modelMatrix);
    mat4.translate(modelMatrix, modelMatrix, [-5.6, -1.75, -3.7]);
    mat4.rotate(modelMatrix, modelMatrix, Math.PI / 2, [-1.0, 0.0, 0.0]);
    mat4.rotate(modelMatrix, modelMatrix, Math.PI / 2, [0.0, 0.0, 1.0]);
	mat4.scale(modelMatrix,modelMatrix, [0.34, 0.34, 1.0]);
	mat4.scale(modelMatrix,modelMatrix, [0.7, 0.7, 0.7]);
    setModelMatrixCompleteLight(modelMatrix);
    studySceneKdesh.champagne.render(progCompleteLight.program);
    mat4.identity(modelMatrix);
    mat4.translate(modelMatrix, modelMatrix, [-5.6, -1.75, -3.0]);
    mat4.rotate(modelMatrix, modelMatrix, Math.PI / 2, [-1.0, 0.0, 0.0]);
    mat4.rotate(modelMatrix, modelMatrix, Math.PI / 2, [0.0, 0.0, 1.0]);
	mat4.scale(modelMatrix,modelMatrix, [0.34, 0.34, 1.0]);
	mat4.scale(modelMatrix,modelMatrix, [0.7, 0.7, 0.7]);
    setModelMatrixCompleteLight(modelMatrix);
    studySceneKdesh.hennessy.render(progCompleteLight.program);
    mat4.identity(modelMatrix);
    mat4.translate(modelMatrix, modelMatrix, [-5.6, -1.75, -2.3]);
    mat4.rotate(modelMatrix, modelMatrix, Math.PI / 2, [-1.0, 0.0, 0.0]);
    mat4.rotate(modelMatrix, modelMatrix, Math.PI / 2, [0.0, 0.0, 1.0]);
	mat4.scale(modelMatrix,modelMatrix, [0.34, 0.34, 1.0]);
	mat4.scale(modelMatrix,modelMatrix, [0.7, 0.7, 0.7]);
    setModelMatrixCompleteLight(modelMatrix);
    studySceneKdesh.jackDaniels.render(progCompleteLight.program);

    gl.bindTexture(gl.TEXTURE_2D, studySceneKdesh.texBill1);
    modelMatrix = mat4.create();
    mat4.translate(modelMatrix, modelMatrix, [3.5, -2.9, -4.0]);
    mat4.rotate(modelMatrix, modelMatrix, Math.PI / 2, [1.0, 0.0, 0.0]);
    mat4.scale(modelMatrix, modelMatrix, [0.3, 0.3, 0.3]);
    setModelMatrixCompleteLight(modelMatrix);
    studySceneKdesh.crumbledPaper.render(progCompleteLight.program);
    gl.bindTexture(gl.TEXTURE_2D, studySceneKdesh.texBill1);
    mat4.identity(modelMatrix);
    mat4.translate(modelMatrix, modelMatrix, [2.5, -2.9, -3.0]);
    mat4.rotate(modelMatrix, modelMatrix, Math.PI / 2, [1.0, 0.0, 0.0]);
    mat4.scale(modelMatrix, modelMatrix, [0.3, 0.3, 0.3]);
    setModelMatrixCompleteLight(modelMatrix);
    studySceneKdesh.crumbledPaper.render(progCompleteLight.program);
    gl.bindTexture(gl.TEXTURE_2D, studySceneKdesh.texBill1);
    mat4.identity(modelMatrix);
    mat4.translate(modelMatrix, modelMatrix, [4.5, -2.9, -3.0]);
    mat4.rotate(modelMatrix, modelMatrix, Math.PI / 2, [1.0, 0.0, 0.0]);
    mat4.scale(modelMatrix, modelMatrix, [0.3, 0.3, 0.3]);
    setModelMatrixCompleteLight(modelMatrix);
    studySceneKdesh.crumbledPaper.render(progCompleteLight.program);
    gl.bindTexture(gl.TEXTURE_2D, studySceneKdesh.texBill1);
    mat4.identity(modelMatrix);
    mat4.translate(modelMatrix, modelMatrix, [-1.5, -2.9, -2.0]);
    mat4.rotate(modelMatrix, modelMatrix, Math.PI / 2, [1.0, 0.0, 0.0]);
    mat4.scale(modelMatrix, modelMatrix, [0.3, 0.3, 0.3]);
    setModelMatrixCompleteLight(modelMatrix);
    studySceneKdesh.crumbledPaper.render(progCompleteLight.program);
    gl.bindTexture(gl.TEXTURE_2D, studySceneKdesh.texBill1);
    mat4.identity(modelMatrix);
    mat4.translate(modelMatrix, modelMatrix, [0.5, -2.9, -1.4]);
    mat4.rotate(modelMatrix, modelMatrix, Math.PI / 2, [1.0, 0.0, 0.0]);
    mat4.scale(modelMatrix, modelMatrix, [0.3, 0.3, 0.3]);
    setModelMatrixCompleteLight(modelMatrix);
    studySceneKdesh.crumbledPaper.render(progCompleteLight.program);
    gl.bindTexture(gl.TEXTURE_2D, studySceneKdesh.texBill1);
    mat4.identity(modelMatrix);
    mat4.translate(modelMatrix, modelMatrix, [4.5, -2.9, -4.0]);
    mat4.rotate(modelMatrix, modelMatrix, Math.PI / 2, [1.0, 0.0, 0.0]);
    mat4.scale(modelMatrix, modelMatrix, [0.3, 0.3, 0.3]);
    setModelMatrixCompleteLight(modelMatrix);
    studySceneKdesh.crumbledPaper.render(progCompleteLight.program);
    gl.bindTexture(gl.TEXTURE_2D, studySceneKdesh.texBill1);
    mat4.identity(modelMatrix);
    mat4.translate(modelMatrix, modelMatrix, [0.0, -2.9, 0.0]);
    mat4.rotate(modelMatrix, modelMatrix, Math.PI / 2, [1.0, 0.0, 0.0]);
    mat4.scale(modelMatrix, modelMatrix, [0.3, 0.3, 0.3]);
    setModelMatrixCompleteLight(modelMatrix);
    studySceneKdesh.crumbledPaper.render(progCompleteLight.program);

    setMaterialCompleteLight([0.5, 0.5, 0.5], [0.6, 0.2, 0.0], [1.0, 1.0, 1.0], 128, 1.0);
    gl.bindTexture(gl.TEXTURE_2D, studySceneKdesh.texSofa);
    modelMatrix = mat4.create();
    mat4.translate(modelMatrix, modelMatrix, [5.6, -3.0, 1.5]);
    mat4.rotate(modelMatrix,modelMatrix, Math.PI / 2, [-1.0, 0.0, 0.0]);
    mat4.rotate(modelMatrix, modelMatrix, Math.PI / 2, [0.0, 0.0, -1.0]);
	mat4.scale(modelMatrix,modelMatrix,[3.0, 3.0, 3.0]);
	setModelMatrixCompleteLight(modelMatrix);
	studySceneKdesh.sofa.render(progCompleteLight.program);

    gl.bindTexture(gl.TEXTURE_2D, studySceneKdesh.texWood);
    modelMatrix = mat4.create();
    mat4.translate(modelMatrix, modelMatrix, [1.0, -3.0, -1.0]);
    mat4.rotate(modelMatrix, modelMatrix, 3 * Math.PI / 4, [0.0, -1.0, 0.0]);
    mat4.scale(modelMatrix, modelMatrix, [3.0, 3.0, 3.0]);
    setModelMatrixCompleteLight(modelMatrix);
    studySceneKdesh.chair.render(studySceneKdesh.program);

    setMaterialCompleteLight([0.8, 0.8, 0.8], [0.6, 0.2, 0.0], [1.0, 1.0, 1.0], 128, 1.0);
    setFlagsCompleteLight(0, 0, 1, 1);
    modelMatrix = mat4.create();
    mat4.translate(modelMatrix, modelMatrix, [-5.55, -1.7, -3.0]);
    mat4.rotate(modelMatrix, modelMatrix, Math.PI / 2, [1.0, 0.0, 0.0]);
    mat4.rotate(modelMatrix, modelMatrix, Math.PI / 2, [0.0, 0.0, 1.0]);
    mat4.scale(modelMatrix, modelMatrix, [0.15, 0.15, 0.15]);
    setModelMatrixCompleteLight(modelMatrix);
    studySceneKdesh.liquorCabinet.render(progCompleteLight.program);

    modelMatrix = mat4.create();
    mat4.translate(modelMatrix, modelMatrix, [0.0, 1.0, -4.8]);
    mat4.scale(modelMatrix, modelMatrix, [3.5, 1.5, 1.0]);
    renderForWindowKdesh(perspectiveMatrix, viewMatrix, modelMatrix, lightPosition, studySceneKdesh.texOutside);

    modelMatrix = mat4.create();
    mat4.translate(modelMatrix, modelMatrix, phonePosition);
    mat4.rotate(modelMatrix, modelMatrix, Math.PI / 2, [-1.0, 0.0, 0.0]);
    mat4.rotate(modelMatrix, modelMatrix, Math.PI / 3, [0.0, 0.0, 1.0]);
    mat4.scale(modelMatrix, modelMatrix, [0.2, 0.2, 0.2]);
    renderForPhoneDeep(modelMatrix,studySceneKdesh.texPhone);

    modelMatrix = mat4.create();
    mat4.translate(modelMatrix, modelMatrix, [0.9, -0.9, -4.5]);
    mat4.rotate(modelMatrix, modelMatrix, Math.PI / 6.0, [0.0, 1.0, 0.0]);
    mat4.scale(modelMatrix, modelMatrix, [0.6, 0.6, 0.6]);
    renderForLampKdesh(perspectiveMatrix, viewMatrix, modelMatrix, lightPosition);

    modelMatrix = mat4.create();
    mat4.translate(modelMatrix, modelMatrix, [0.0, -1.05, -3.49]);
    renderForTableKdesh(perspectiveMatrix, viewMatrix, modelMatrix, lightPosition);

    gl.enable(gl.BLEND);
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
