var programForBedroomScene;
var vaoForDeepCube;
var pMatUniformForSceneTwo;
var vMatUniformForSceneTwo;
var mMatUniformForSceneTwo;
var viewPosUniformForSceneTwo;
var angle = 0.0;

var programRenderBedroom = {
	program : null,
	uniform : {
		pMat : null,
		vMat : null,
		mMat : null,
		viewPos : null
	}
};

var BedroomSceneObjects = {
	mPlane : null,
	mcab1 : null,
	mcab2 : null,
	mLight : null,
	mDoor : null,
	mFan : null,
	mBottle2 : null,
	mGlass : null,
	mBed : null,
	mRing : null,
	mTV : null,
	texPhone: null,
	texWall: null,
	objCube: null
};

var vaoCube;

var mcab1;
var mcab2;
var mLight;
var mDoor;
var mFan;
var mBottle2;
var mGlass;
var mBed;
var mRing;
var mTV;

var Lights = [];

var cameraPathBedroom = [
	//  position            center             up             velocity      //
	[[-1.0, -2.0, -2.5], [-1.0, -3.0, -2.5], [0.0, 1.0, 0.0], [1.0, 1.0, 1.5]],
	[[-1.0, -1.5, -3.0], [1.0, -1.51, -2.5], [0.0, 1.0, 0.0], [4.0, 0.5, -1.5]],
	[[1.0, -1.5, -2.0], [-1.5, -1.51, -4.0], [0.0, 1.0, 0.0], [1.0, 0.0, 1.5]],
	[[3.5, -4.0, -1.0], [3.0, -4.9, -3.0], [0.0, 1.0, 0.0], [0.0, -1.5, -1.5]]
];

function setupprogramForBedroomScene() {
	var vertShader = createShader('BedroomScene/shaders/demo.vert', gl.VERTEX_SHADER);
	var fragShader = createShader('BedroomScene/shaders/demo.frag', gl.FRAGMENT_SHADER);
	programForBedroomScene = createProgram([vertShader, fragShader]);
	programRenderBedroom.program = createProgram([vertShader, fragShader]);
	deleteShader(vertShader);
	deleteShader(fragShader);

	programRenderBedroom.uniform.pMat = gl.getUniformLocation(programRenderBedroom.program,"pMat");
	programRenderBedroom.uniform.vMat = gl.getUniformLocation(programRenderBedroom.program,"vMat");
	programRenderBedroom.uniform.mMat = gl.getUniformLocation(programRenderBedroom.program,"mMat");
	programRenderBedroom.uniform.viewPos = gl.getUniformLocation(programRenderBedroom.program,"viewPos");

}

function initForBedroomScene() {
	var v = [[1.0, 1.0, 0.0,-1.0, 1.0, 0.0,-1.0, -1.0, 0.0,-1.0,-1.0, 0.0, 1.0, -1.0, 0.0, 1.0, 1.0, 0.0],[0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0],[1.0, 1.0, 0.0, 1.0,0.0, 0.0, 0.0, 0.0,	1.0, 0.0,1.0, 1.0,]];
	BedroomSceneObjects.mPlane = new mesh(v,null,null);

	BedroomSceneObjects.mcab1 = new Model('BedroomScene/resources/cab1.json');
	BedroomSceneObjects.mcab2 = new Model('BedroomScene/resources/cab2.json');
	BedroomSceneObjects.mLight = new Model('BedroomScene/resources/light.json');
	BedroomSceneObjects.mDoor = new Model('BedroomScene/resources/door.json');
	BedroomSceneObjects.mFan = new Model('BedroomScene/resources/fan.json');
	BedroomSceneObjects.mBed = new Model('BedroomScene/resources/bed.json');
	BedroomSceneObjects.mBottle2 = new Model('BedroomScene/resources/bottle2.json');
	BedroomSceneObjects.mGlass = new Model('BedroomScene/resources/glass.json');
	BedroomSceneObjects.mRing = new Model('BedroomScene/resources/ring.json');
	BedroomSceneObjects.mTV = new Model('BedroomScene/resources/tv.json');
	BedroomSceneObjects.texPhone = loadTexture('resources/textures/Phub.jpg', true)
	BedroomSceneObjects.texWall = loadTexture('resources/textures/whitewall.jpg', true)
	BedroomSceneObjects.objCube = dshapes.initCube()

	// Light Setups
	Lights.push(
		{	
			position : [-2.5,2.4,-6.5],
			ambient : [0.1,0.1,0.1],
			diffuse : [1.0,1.0,1.0],
			specular : [1.0,1.0,1.0]
		});

		Lights.push(
			{	
				position : [2.0,2.0,6.0],
				ambient : [0.1,0.1,0.1],
				diffuse : [1.0,1.0,1.0],
				specular : [1.0,1.0,1.0]
			});

		Lights.push(
			{	
				position : [-2.0,0.5,6.5],
				ambient : [0.1,0.1,0.1],
				diffuse : [1.0,1.0,1.0],
				specular : [1.0,1.0,1.0]
			});

	// console.log(Light);
	// sceneCamera.updatePath(cameraPathBedroom);
}

function renderForBedroomScene(time , perspectiveMatrix, viewMatrix, viewPos) {
	var modelMatrix = mat4.create();
	// gl.enable(gl.BLEND);
	// gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
	// gl.disable(gl.CULL_FACE);

	// renderLightSourceDeep(perspectiveMatrix, viewMatrix, placementHelp.trans, [1.0, 1.0, 1.0])

	gl.useProgram(progCompleteLight.program);
	resetCompleteLight()
	setProjectionAndViewCompleteLight(perspectiveMatrix, viewMatrix, viewPos)
	setFlagsCompleteLight(false, false, true, true)

	addLightCompleteLight([0.0, 0.0, 0.0], [0.5, 0.3, 0.2], [0.9, 0.8, 0.6], [0.0, 0.0, 0.0])
	addPointLightCompleteLight([-4.9, 1.9, 0.0], [0.1, 0.1, 0.1], [1.0, 0.8, 0.4], [0.0, 0.0, 0.0], [1.0, 0.2, 0.01])
	addPointLightCompleteLight([4.9, 1.9, 0.0], [0.1, 0.1, 0.1], [1.0, 0.8, 0.4], [0.0, 0.0, 0.0], [1.0, 0.2, 0.01])

	setTextureSamplersCompleteLight(0)
	gl.activeTexture(gl.TEXTURE0)

	// back
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [0.0,-1.0,-7.0]);
	//mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(90.0), [0.0, 1.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[7.0,4.0,5.0]);
	setModelMatrixCompleteLight(modelMatrix)
	gl.bindTexture(gl.TEXTURE_2D, BedroomSceneObjects.texWall)
	BedroomSceneObjects.mPlane.render();

	//front
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [0.0,-1.0,7.0]);
	mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(-180.0), [0.0, 1.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[7.0,4.0,5.0]);
	setModelMatrixCompleteLight(modelMatrix)
	gl.bindTexture(gl.TEXTURE_2D, BedroomSceneObjects.texWall)
	BedroomSceneObjects.mPlane.render();

	// right
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [7.0,-1.0,0.0]);
	mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(-90.0), [0.0, 1.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[7.0,4.0,5.0]);
	setModelMatrixCompleteLight(modelMatrix)
	gl.bindTexture(gl.TEXTURE_2D, BedroomSceneObjects.texWall)
	BedroomSceneObjects.mPlane.render();
	
	// left
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-7.0,-1.0,0.0]);
	mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(90.0), [0.0, 1.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[7.0,4.0,5.0]);
	setModelMatrixCompleteLight(modelMatrix)
	gl.bindTexture(gl.TEXTURE_2D, BedroomSceneObjects.texWall)
	BedroomSceneObjects.mPlane.render();
	
	// bottom
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [0.0,-5.0,0.0]);
	mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(-90.0), [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[7.0,7.0,5.0]);
	setModelMatrixCompleteLight(modelMatrix)
	gl.bindTexture(gl.TEXTURE_2D, BedroomSceneObjects.texWall)
	BedroomSceneObjects.mPlane.render();
	
	//top
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [0.0,3.0,0.0]);
	mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(90.0), [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[7.0,7.0,5.0]);
	setModelMatrixCompleteLight(modelMatrix)
	gl.bindTexture(gl.TEXTURE_2D, BedroomSceneObjects.texWall)
	BedroomSceneObjects.mPlane.render();
	
	setMaterialCompleteLight([0.1, 0.1, 0.1], [1.0, 1.0, 1.0], [0.0, 0.0, 0.0], 1.0, 1.0);
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-1.0,-3.0,-2.5]);
	mat4.rotate(modelMatrix, modelMatrix,glMatrix.toRadian(90), [1.0, 0.0, 0.0]);
	mat4.rotate(modelMatrix, modelMatrix,glMatrix.toRadian(180), [0.0, 1.0, 0.0]);
	mat4.rotate(modelMatrix, modelMatrix,glMatrix.toRadian(180), [0.0, 0.0, 1.0]);
	mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(00), [0.0, 0.0, 1.0]);
	mat4.scale(modelMatrix,modelMatrix,[0.3,0.3,0.3]);	
	setModelMatrixCompleteLight(modelMatrix)
	renderForPhoneDeep(modelMatrix, BedroomSceneObjects.texPhone);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-4.0,0.0,-7.6]);
	mat4.rotate(modelMatrix, modelMatrix,glMatrix.toRadian(-90), [1.0, 0.0, 0.0]);
	mat4.rotate(modelMatrix, modelMatrix,glMatrix.toRadian(-90), [0.0, 0.0, 1.0]);
	mat4.scale(modelMatrix,modelMatrix,[0.3,0.3,0.3]);
	setModelMatrixCompleteLight(modelMatrix)
	BedroomSceneObjects.mLight.render();
	
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [6.5,-1.5,-5.5]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(90.0), [0.0, 1.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[0.1,0.1,0.05]);
	setModelMatrixCompleteLight(modelMatrix)
	BedroomSceneObjects.mcab2.render();
	
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [3.0,-3.6,-5.5]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(90.0), [1.0, 0.0, 0.0]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(-90.0), [0.0, 0.0, 1.0]);
	mat4.scale(modelMatrix,modelMatrix,[0.1,0.1,0.1]);
	setModelMatrixCompleteLight(modelMatrix)
	BedroomSceneObjects.mcab1.render();
	
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-10.5,-3.2,-3.3]);
	//mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(90.0), [1.0, 0.0, 0.0]);
	//mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(-90.0), [0.0, 0.0, 1.0]);
	mat4.scale(modelMatrix,modelMatrix,[4.0,3.0,3.0]);
	setModelMatrixCompleteLight(modelMatrix)
	BedroomSceneObjects.mBed.render();
		
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-8.0,2.3,8.0]);
	mat4.rotate(modelMatrix, modelMatrix,glMatrix.toRadian(-90), [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[0.25,0.25,0.25]);
	setModelMatrixCompleteLight(modelMatrix)
	BedroomSceneObjects.mDoor.render();
	
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [3.0,-4.95,-3.0]);
	//mat4.rotate(modelMatrix, modelMatrix,glMatrix.toRadian(-90), [1.0, 0.0, 0.0]);
	//mat4.rotate(modelMatrix, modelMatrix,glMatrix.toRadian(-90), [0.0, 0.0, 1.0]);
	mat4.scale(modelMatrix,modelMatrix,[0.2,0.2,0.2]);
	setModelMatrixCompleteLight(modelMatrix)
	BedroomSceneObjects.mRing.render();
	
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-2.0,-1.3,6.0]);
	mat4.rotate(modelMatrix, modelMatrix,glMatrix.toRadian(180), [0.0, 1.0, 0.0]);
	//mat4.rotate(modelMatrix, modelMatrix,glMatrix.toRadian(-90), [0.0, 0.0, 1.0]);
	mat4.scale(modelMatrix,modelMatrix,[2.8,2.8,3.0]);
	setModelMatrixCompleteLight(modelMatrix)
	BedroomSceneObjects.mTV.render();
	
	// Draw Amols Cupboard
	{
	setFlagsCompleteLight(undefined, undefined, false, undefined)
	ctm = mat4.create();
	mat4.translate(ctm,ctm,[-2.0,-3.8,8.0]);
	mat4.scale(ctm, ctm, [1.5, 1.5, 1.0]);
	mat4.identity(modelMatrix);
	mat4.copy(modelMatrix,ctm);
	mat4.translate(modelMatrix, modelMatrix, [0.0, 1.0, -1.0]);
	mat4.scale(modelMatrix, modelMatrix, [2.0, 2.0, 0.1]);
	setModelMatrixCompleteLight(modelMatrix)
	BedroomSceneObjects.objCube.render()

	// cupboard top
	mat4.copy(modelMatrix, ctm);
	mat4.translate(modelMatrix, modelMatrix, [0.0, 3.0, -2.0]);
	mat4.scale(modelMatrix, modelMatrix, [2.0, 0.05, 1.0]);
	setModelMatrixCompleteLight(modelMatrix)
	BedroomSceneObjects.objCube.render()

	// cupboard bottom
	mat4.copy(modelMatrix, ctm);
	mat4.translate(modelMatrix, modelMatrix, [0.0, -1.0, -2.0]);
	mat4.scale(modelMatrix, modelMatrix, [2.0, 0.05, 1.0]);
	setModelMatrixCompleteLight(modelMatrix)
	BedroomSceneObjects.objCube.render()

	// transformations cupboard left
	mat4.copy(modelMatrix, ctm);
	mat4.translate(modelMatrix, modelMatrix, [-1.9, 1.0, -2.0]);
	mat4.scale(modelMatrix, modelMatrix, [0.05, 2.0, 1.0]);
	setModelMatrixCompleteLight(modelMatrix)
	// draw front-left table leg
	BedroomSceneObjects.objCube.render()

	// transformations cupboard right
	mat4.copy(modelMatrix, ctm);
	mat4.translate(modelMatrix, modelMatrix, [1.9, 1.0, -2.0]);
	mat4.scale(modelMatrix, modelMatrix, [0.05, 2.0, 1.0]);
	setModelMatrixCompleteLight(modelMatrix)
	// draw front-left table leg
	BedroomSceneObjects.objCube.render()

	 // cupboard middle
	mat4.copy(modelMatrix, ctm);
	mat4.translate(modelMatrix, modelMatrix, [0.0, 0.5, -2.0]);
	mat4.scale(modelMatrix, modelMatrix, [1.9, 0.05, 1.0]);
	setModelMatrixCompleteLight(modelMatrix)
	BedroomSceneObjects.objCube.render()

	// cupboard middle
	mat4.copy(modelMatrix, ctm);
	mat4.translate(modelMatrix, modelMatrix, [0.0, -0.5, -2.0]);
	mat4.scale(modelMatrix, modelMatrix, [1.9, 0.05, 1.0]);
	setModelMatrixCompleteLight(modelMatrix)
	BedroomSceneObjects.objCube.render()

	}

	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
	gl.enable(gl.BLEND)
	setFlagsCompleteLight(undefined, true, undefined, undefined)
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [3.0,-2.05,-6.0]);
	mat4.rotate(modelMatrix, modelMatrix,glMatrix.toRadian(90), [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[4.0,4.0,4.0]);
	setModelMatrixCompleteLight(modelMatrix)
	BedroomSceneObjects.mBottle2.render();
	
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [2.5,-2.65,-7.0]);
	mat4.rotate(modelMatrix, modelMatrix,glMatrix.toRadian(-90), [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[5.0,5.0,5.0]);
	setModelMatrixCompleteLight(modelMatrix)
	BedroomSceneObjects.mGlass.render();
	
	gl.disable(gl.BLEND)

	angle += 0.01;
}

function updateCamPosForBedroomScene(camera, camSplinePosition) {
	var splineInfo = camera.getSplineAndPos(camSplinePosition);
	var spline = splineInfo.spline;
	var position = splineInfo.position;

	switch(spline) {
		case 1: return 0.00055;
		case 2: return 0.0004;
		default: return 0.0006;
	}
}

function uninitForBedroomScene() {
	deleteProgram(programRenderBedroom.program);
}
