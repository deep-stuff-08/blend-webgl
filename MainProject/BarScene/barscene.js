var FanAngle = 0.0;

var BarSceneObjects = {
	mPlane : null,
	mcab1 : null,
	mcab2 : null,
	mLight : null,
	mDoor : null,
	mFan : null,
	mCoke : null,
	mPepsi : null,
	mBottle : null,
	mBottle2 : null,
	mTable : null,
	mChair : null,
	mStool : null,
	mCigar : null,
	mGlass : null,
	texPhone: null,
	texWall: null,
	texPoster1 : null,
	texPoster2 : null,
	texPoster3 : null,
	texPoster4 : null
};

var programRenderBar = {
	program : null,
	uniform : {
		pMat : null,
		vMat : null,
		mMat : null,
		viewPos : null
	}
};

var cameraControls = {
	theta: 0.0,
	isLookingUpDone: false
};

var cameraBar =  null;
var cameraPathBar = [
	//  position            center             up             velocity      //
	[[-5.0, -1.3, -0.3], [-5.0, -1.8, -0.3], [0.0, 1.0, 0.0], [0.0, 0.0, 0.0]],
	[[-5.0, -0.5, 1.3], [-5.0, -0.8, -0.3], [0.0, 1.0, 0.0], [0.0, 0.0, 0.0]],
	[[-5.0, -0.5, 1.3], [-3.0, -0.8, -2.3], [0.0, 1.0, 0.0], [0.0, 0.0, 0.0]],
	[[-5.0, -0.5, 1.3], [-1.0, -0.8, -0.3], [0.0, 1.0, 0.0], [0.0, 0.0, 0.0]],
	[[-5.0, -0.5, 1.3], [-3.0, -0.8, 2.3], [0.0, 1.0, 0.0], [0.0, 0.0, 0.0]],
	[[-5.0, -0.5, 1.3], [-5.0, -0.8, 4.3], [0.0, 1.0, 0.0], [0.0, 0.0, 0.0]],
	[[-5.0, -0.5, 1.3], [-7.0, -0.8, 2.3], [0.0, 1.0, 0.0], [0.0, 0.0, 0.0]],
	[[-5.0, -0.5, 1.3], [-9.0, -0.8, -0.3], [0.0, 1.0, 0.0], [0.0, 0.0, 0.0]],
	// [[-5.0, -0.5, 1.3], [-7.0, -0.8, -2.3], [0.0, 1.0, 0.0], [0.0, 0.0, 0.0]],
	[[-7.3, -0.8, 2.3], [-7.3, -1.6, -0.3], [0.0, 1.0, 0.0], [-0.1, -0.1, 0.0]]
];


var Light = [];

function setupprogramForBarScene() {
	var vertShader = createShader('BarScene/shaders/demo.vert', gl.VERTEX_SHADER);
	var fragShader = createShader('BarScene/shaders/demo.frag', gl.FRAGMENT_SHADER);
	programForBarScene = createProgram([vertShader, fragShader]);

	programRenderBar.program = createProgram([vertShader, fragShader]);
	deleteShader(vertShader);
	deleteShader(fragShader);

	programRenderBar.uniform.pMat = gl.getUniformLocation(programRenderBar.program,"pMat");
	programRenderBar.uniform.vMat = gl.getUniformLocation(programRenderBar.program,"vMat");
	programRenderBar.uniform.mMat = gl.getUniformLocation(programRenderBar.program,"mMat");
	programRenderBar.uniform.viewPos = gl.getUniformLocation(programRenderBar.program,"viewPos");

	//console.log(programRenderBar);

}

function initForBarScene() {

	vao = gl.createVertexArray();
	console.log(programRenderBar);

	//console.log(pMatUniformForSceneTwo);
	//diffuseUnifromForDeepCube = gl.getUniformLocation(programForBarScene, "diffuse")

	var v = [[1.0, 1.0, 0.0,-1.0, 1.0, 0.0,-1.0, -1.0, 0.0,-1.0,-1.0, 0.0, 1.0, -1.0, 0.0, 1.0, 1.0, 0.0],[0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0],[1.0, 1.0, 0.0, 1.0,0.0, 0.0, 0.0, 0.0,	1.0, 0.0,1.0, 1.0,]];
	BarSceneObjects.mPlane	= new mesh(v,null,null);
	// BarSceneObjects.mPlane.setMaterial(new material());
	//console.log(mPlane);

	BarSceneObjects.mcab1 = new Model('BarScene/resources/cab1.json');

	BarSceneObjects.mcab2 = new Model('BarScene/resources/cab2.json');
	BarSceneObjects.mLight = new Model('BarScene/resources/light.json');
	BarSceneObjects.mDoor = new Model('BarScene/resources/bardoor.json');
	// BarSceneObjects.mFan = new Model('BarScene/resources/fan.json');
	BarSceneObjects.mBottle = new Model('resources/models/static/LiquorBottles/jackdaniels.json');
	BarSceneObjects.mBottle2 = new Model('BarScene/resources/bottle2.json');
	BarSceneObjects.mCoke = new Model('BarScene/resources/coke.json');
	// BarSceneObjects.mPepsi = new Model('BarScene/resources/pepsi.json');
	BarSceneObjects.mTable = new Model('BarScene/resources/table.json');
	BarSceneObjects.mCigar = new Model('BarScene/resources/cigar.json');
	BarSceneObjects.mChair = new Model('BarScene/resources/chair.json');
	BarSceneObjects.mStool = new Model('BarScene/resources/stool.json');
	BarSceneObjects.mGlass = new Model('BarScene/resources/glass.json');

	BarSceneObjects.texPhone = loadTexture('resources/textures/Youtube.jpg', true);
	BarSceneObjects.texWall = loadTexture('resources/textures/whitewall.jpg');
	BarSceneObjects.texPoster1 = loadTexture('BarScene/resources/textures/Sharaabi.jpg',true);
	BarSceneObjects.texPoster2 = loadTexture('BarScene/resources/textures/poster.jpg',true);
	BarSceneObjects.texPoster3 = loadTexture('BarScene/resources/textures/bar2.jpg',true);
	BarSceneObjects.texPoster4 = loadTexture('BarScene/resources/textures/bar.jpg',true);

	Light.push(
	{	
		position : [-8.5,-10.0,-13.0],
		ambient : [0.2,0.2,0.2],
		diffuse : [1.0,0.0,0.0],
		specular : [1.0,0.0,0.0]
	});

	Light.push(
	{	
		position : [-6.0,4.0,15.5],
		ambient : [0.1,0.1,0.1],
		diffuse : [1.0,1.0,1.0],
		specular : [1.0,1.0,1.0]
		});

	console.log(Light);

	// camera setup

	// sceneCamera.updatePath(cameraPathBar);
}

function updateCamPosForBarScene(camera, currentSplinePosition) {
	var splineInfo = camera.getSplineAndPos(currentSplinePosition);
	spline = splineInfo.spline;
	position = splineInfo.position;

	switch(spline) {
		case 1:
			if(position > 0.5)
				return 0.0006;
		default:
			return 0.00045;
	}
}

function renderForBarScene(perspectiveMatrix, camMatrix, viewPos, deltatimeinc) {
	var viewMatrix = mat4.clone(camMatrix);
	//mat4.translate(viewMatrix, viewMatrix, [-camPosition[0], -camPosition[1], -camPosition[2]])
	//mat4.rotate(viewMatrix, viewMatrix, glMatrix.toRadian(cameraControls.theta), [0.0, 1.0, 0.0]);
	// mat4.translate(viewMatrix, viewMatrix, camPosition)
	// renderLightSourceDeep(perspectiveMatrix, viewMatrix, placementHelp.trans, [1.0, 1.0, 1.0]);
	// Draw All Opaue Objects

	updateForBarScene()
	
	// renderLightSourceDeep(perspectiveMatrix, viewMatrix, placementHelp.trans, [1.0, 1.0, 1.0])

	gl.useProgram(progCompleteLight.program);
	resetCompleteLight()
	setProjectionAndViewCompleteLight(perspectiveMatrix, viewMatrix, viewPos)
	setFlagsCompleteLight(false, false, true, true)
	setTextureSamplersCompleteLight(0)
	gl.activeTexture(gl.TEXTURE0)

	addLightCompleteLight([0.0, 0.0, 4.2], [0.4, 0.1, 0.1], [0.6, 0.2, 0.1], [0.0, 0.0, 0.0])
	addSpotLightCompleteLight([-6.0, 6.5, -4.1], [0.01, 0.01, 0.01], [0.9, 0.7, 0.1], [0.7, 0.7, 0.7], [1.0, 0.0001, 0.0001], [20.0, 23.0], [0.0, -1.0, 0.01])
	addPointLightCompleteLight([0.2, 5.4, 6.5], [0.01, 0.01, 0.01], [0.6, 0.3, 0.0], [0.7, 0.7, 0.7], [1.0, 0.1, 0.01])
	addPointLightCompleteLight([-10.2, 5.4, 9.5], [0.01, 0.01, 0.01], [0.6, 0.3, 0.0], [0.7, 0.7, 0.7], [1.0, 0.1, 0.01])

	var modelMatrix = mat4.create();

	// back
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [0.0,0.0,-5.0]);
	//mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(90.0), [0.0, 1.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[10.0,5.0,5.0]);
	setModelMatrixCompleteLight(modelMatrix)
	gl.bindTexture(gl.TEXTURE_2D, BarSceneObjects.texWall)
	BarSceneObjects.mPlane.render();

	//front
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [0.0,0.0,15.0]);
	mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(-180.0), [0.0, 1.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[10.0,5.0,5.0]);
	setModelMatrixCompleteLight(modelMatrix)
	gl.bindTexture(gl.TEXTURE_2D, BarSceneObjects.texWall)
	BarSceneObjects.mPlane.render();
	
	// right
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [10.0,0.0,5.0]);
	mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(-90.0), [0.0, 1.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[10.0,5.0,5.0]);
	setModelMatrixCompleteLight(modelMatrix)
	gl.bindTexture(gl.TEXTURE_2D, BarSceneObjects.texWall)
	BarSceneObjects.mPlane.render();
	
	// left
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-10.0,0.0,5.0]);
	mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(90.0), [0.0, 1.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[10.0,5.0,5.0]);
	setModelMatrixCompleteLight(modelMatrix)
	gl.bindTexture(gl.TEXTURE_2D, BarSceneObjects.texWall)
	BarSceneObjects.mPlane.render();
	
	// bottom
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [0.0,-5.0,5.0]);
	mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(-90.0), [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[10.0,10.0,5.0]);
	setModelMatrixCompleteLight(modelMatrix)
	gl.bindTexture(gl.TEXTURE_2D, BarSceneObjects.texWall)
	BarSceneObjects.mPlane.render();
	
	//top
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [0.0,5.0,5.0]);
	mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(90.0), [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[10.0,10.0,5.0]);
	setModelMatrixCompleteLight(modelMatrix)
	gl.bindTexture(gl.TEXTURE_2D, BarSceneObjects.texWall)
	BarSceneObjects.mPlane.render();
	
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-5.0,-1.8,-0.3]);
	mat4.rotate(modelMatrix, modelMatrix,glMatrix.toRadian(90), [1.0, 0.0, 0.0]);
	mat4.rotate(modelMatrix, modelMatrix,glMatrix.toRadian(180), [0.0, 1.0, 0.0]);
	mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(180), [0.0, 0.0, 1.0]);
	mat4.scale(modelMatrix,modelMatrix,[0.3,0.3,0.3]);
	setModelMatrixCompleteLight(modelMatrix)
	setMaterialCompleteLight([0.1, 0.1, 0.1], [1.0, 1.0, 1.0], [0.0, 0.0, 0.0], 1.0, 1.0);
	renderForPhoneDeep(modelMatrix, BarSceneObjects.texPhone);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-6.0,-2.8,-1.0]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(90.0), [1.0, 0.0, 0.0]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(90.0), [0.0, 0.0, 1.0]);
	mat4.scale(modelMatrix,modelMatrix,[0.1,0.5,0.1]);
	setModelMatrixCompleteLight(modelMatrix)
	BarSceneObjects.mcab1.render();

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-5.5,-3.1,-0.5]);
	//mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(90.0), [1.0, 0.0, 0.0]);
	//mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(90.0), [0.0, 0.0, 1.0]);
	mat4.scale(modelMatrix,modelMatrix,[0.3,0.3,0.3]);
	setModelMatrixCompleteLight(modelMatrix)
	BarSceneObjects.mCigar.render();
	
	var x = -9.5;
	for(var i = 0; i < 4; i++) {		
		mat4.identity(modelMatrix);
		mat4.translate(modelMatrix, modelMatrix, [x,-3.7,1.0]);
		mat4.rotate(modelMatrix, modelMatrix,glMatrix.toRadian(90), [1.0, 0.0, 0.0]);
		//mat4.rotate(modelMatrix, modelMatrix,glMatrix.toRadian(-90), [0.0, 0.0, 1.0]);
		//mat4.rotate(modeslMatrix, modelMatrix, 90.0, [1.0, 0.0, 0.0]);
		mat4.scale(modelMatrix,modelMatrix,[0.3,0.3,0.3]);
		setModelMatrixCompleteLight(modelMatrix)
		BarSceneObjects.mStool.render();
		x += 2.0;
	}

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-6.0,-1.5,-4.0]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(180.0), [0.0, 1.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[0.15,0.1,0.03]);
	setModelMatrixCompleteLight(modelMatrix)
	BarSceneObjects.mcab2.render();
	
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [7.0,-5.0,-13.0]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(180.0), [0.0, 0.0, 1.0]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(-90.0), [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[8.0,8.0,8.0]);
	setModelMatrixCompleteLight(modelMatrix)
	BarSceneObjects.mCoke.render();
		
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [6.0,-5.0,15.0]);
	//mat4.rotate(modelMatrix, modelMatrix,glMatrix.toRadian(-90), [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[0.08,0.08,0.08]);
	setModelMatrixCompleteLight(modelMatrix)
	BarSceneObjects.mDoor.render();
	
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-6.0,-3.3,10.5]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(90.0), [1.0, 0.0, 0.0]);
	//mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(-90.0), [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[3.0,1.5,1.5]);
	setModelMatrixCompleteLight(modelMatrix)
	BarSceneObjects.mTable.render();

	/*
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-7.5,-2.7,13.5]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(90.0), [1.0, 0.0, 0.0]);
	//mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(-90.0), [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[2.0,2.0,2.0]);
	setModelMatrixCompleteLight(modelMatrix)
	BarSceneObjects.mChair.render();
	*/

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-4.5,-2.7,13.2]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(90.0), [1.0, 0.0, 0.0]);
	//mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(-90.0), [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[2.0,2.0,2.0]);
	setModelMatrixCompleteLight(modelMatrix)
	BarSceneObjects.mChair.render();
	
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-7.5,-2.7,7.5]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(90.0), [1.0, 0.0, 0.0]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(180.0), [0.0, 0.0, 1.0]);
	mat4.scale(modelMatrix,modelMatrix,[2.0,2.0,2.0]);
	setModelMatrixCompleteLight(modelMatrix)
	BarSceneObjects.mChair.render();
	
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-4.0,-3.5,7.2]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(90.0), [1.0, 0.0, 0.0]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(180.0), [0.0, 0.0, 1.0]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(90.0), [0.0, 1.0, .0]);
	mat4.scale(modelMatrix,modelMatrix,[2.0,2.0,2.0]);
	setModelMatrixCompleteLight(modelMatrix)
	BarSceneObjects.mChair.render();
	
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [7.0,-3.3,5.0]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(90.0), [1.0, 0.0, 0.0]);
	//mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(-90.0), [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[3.0,1.5,1.5]);
	setModelMatrixCompleteLight(modelMatrix)
	BarSceneObjects.mTable.render();
	
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [5.5,-2.7,8.0]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(90.0), [1.0, 0.0, 0.0]);
	//mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(-90.0), [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[2.0,2.0,2.0]);
	setModelMatrixCompleteLight(modelMatrix)
	BarSceneObjects.mChair.render();
	
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [8.5,-2.7,8.0]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(90.0), [1.0, 0.0, 0.0]);
	//mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(-90.0), [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[2.0,2.0,2.0]);
	setModelMatrixCompleteLight(modelMatrix)
	BarSceneObjects.mChair.render();

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [2.5,-3.2,1.0]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(90.0), [1.0, 0.0, 0.0]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(180.0), [0.0, 0.0, 1.0]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(-90.0), [0.0, 1.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[2.0,2.0,2.0]);
	setModelMatrixCompleteLight(modelMatrix)
	BarSceneObjects.mChair.render();
	
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [8.5,-2.7,2.0]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(90.0), [1.0, 0.0, 0.0]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(180.0), [0.0, 0.0, 1.0]);
	mat4.scale(modelMatrix,modelMatrix,[2.0,2.0,2.0]);
	setModelMatrixCompleteLight(modelMatrix)
	BarSceneObjects.mChair.render();
	
	// // Draw All Transparent Objects

	setFlagsCompleteLight(undefined, true, undefined, undefined)
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
	gl.enable(gl.BLEND)

	// mat4.identity(modelMatrix);
	// mat4.translate(modelMatrix, modelMatrix, [3.0,-2.3,-1.8]);
	// mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(88.0), [1.0, 0.0, 0.0]);
	// mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(180.0), [0.0, 0.0, 180.0]);
	// //mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(-90.0), [1.0, 0.0, 0.0]);
	// mat4.scale(modelMatrix,modelMatrix,[4.0,4.0,4.0]);
	// setModelMatrixCompleteLight(modelMatrix)
	// BarSceneObjects.mPepsi.render();
	
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-7.3,-1.3,-0.5]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(90.0), [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[4.0,4.0,4.0]);
	setModelMatrixCompleteLight(modelMatrix)
	BarSceneObjects.mBottle2.render();


	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-6.5,-0.8,-4.0]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(-90.0), [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[0.2,0.2,0.7]);
	setModelMatrixCompleteLight(modelMatrix);
	BarSceneObjects.mBottle.render();

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-5.5,-0.8,-4.0]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(-90.0), [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[0.2,0.2,0.7]);
	setModelMatrixCompleteLight(modelMatrix);
	BarSceneObjects.mBottle.render();

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-6.0,-2.5,-4.0]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(-90.0), [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[0.2,0.2,0.7]);
	setModelMatrixCompleteLight(modelMatrix);
	BarSceneObjects.mBottle.render();
	
	/*
	var y = 1.1;
	for(var i = 0; i < 3 ; i++) {
		var x = -1.0;
		for(var j = 0; j < 2; j++) {
			// mat4.identity(modelMatrix);
			// mat4.translate(modelMatrix, modelMatrix, [x,y,-4.0]);
			// mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(90.0), [1.0, 0.0, 0.0]);
			// mat4.scale(modelMatrix,modelMatrix,[8.0,8.0,8.0]);
			// setModelMatrixCompleteLight(modelMatrix)
			// BarSceneObjects.mBottle.render();
			x += 1.5;
		}
		y -= 1.7;
	}
*/

	// mat4.identity(modelMatrix);
	// mat4.translate(modelMatrix, modelMatrix, [-6.0,-1.65,10.5]);
	// mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(90.0), [1.0, 0.0, 0.0]);
	// mat4.scale(modelMatrix,modelMatrix,[4.0,4.0,4.0]);
	// setModelMatrixCompleteLight(modelMatrix)
	// BarSceneObjects.mBottle2.render();
	
	// mat4.identity(modelMatrix);
	// mat4.translate(modelMatrix, modelMatrix, [7.0,-1.65,5.0]);
	// mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(90.0), [1.0, 0.0, 0.0]);
	// mat4.scale(modelMatrix,modelMatrix,[4.0,4.0,4.0]);
	// setModelMatrixCompleteLight(modelMatrix)
	// BarSceneObjects.mBottle2.render();

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [8.0,-2.1,5.0]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(-90.0), [1.0, 0.0, 0.0]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(-90.0), [0.0, 1.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[5.0,5.0,5.0]);
	setModelMatrixCompleteLight(modelMatrix)
	BarSceneObjects.mGlass.render();
	
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [5.5,-2.3,3.5]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(-90.0), [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[5.0,5.0,5.0]);
	setModelMatrixCompleteLight(modelMatrix)
	BarSceneObjects.mGlass.render();

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-5.0,-2.1,10.5]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(-90.0), [1.0, 0.0, 0.0]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(-90.0), [0.0, 1.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[5.0,5.0,5.0]);
	setModelMatrixCompleteLight(modelMatrix)
	BarSceneObjects.mGlass.render();
	
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-7.0,-2.1,9.5]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(-90.0), [1.0, 0.0, 0.0]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(-90.0), [0.0, 1.0, 0.0]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(120.0), [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[5.0,5.0,5.0]);
	setModelMatrixCompleteLight(modelMatrix)
	BarSceneObjects.mGlass.render();
	
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-4.0,-1.85,-1.3]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(-90.0), [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[5.0,5.0,5.0]);
	BarSceneObjects.mGlass.render();

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [9.8,0.0,5.0]);
	mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(-90.0), [0.0, 1.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[1.0,2.0,1.0]);
	renderForWindowKdesh(perspectiveMatrix, viewMatrix, modelMatrix, [0.0,0.0,1.0], BarSceneObjects.texPoster1);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [0.0,0.0,14.5]);
	mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(-180.0), [0.0, 1.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[1.0,2.0,1.0]);
	renderForWindowKdesh(perspectiveMatrix, viewMatrix, modelMatrix, [0.0,0.0,1.0], BarSceneObjects.texPoster2);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-6.0,0.0,14.5]);
	mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(-180.0), [0.0, 1.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[1.0,2.0,1.0]);
	renderForWindowKdesh(perspectiveMatrix, viewMatrix, modelMatrix, [0.0,0.0,1.0], BarSceneObjects.texPoster3);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-9.8,0.0,7.0]);
	mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(90.0), [0.0, 1.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[1.0,2.0,1.0]);
	renderForWindowKdesh(perspectiveMatrix, viewMatrix, modelMatrix, [0.0,0.0,1.0], BarSceneObjects.texPoster4);

	gl.disable(gl.BLEND)
	FanAngle += 0.01;

	if(camSplinePosition > 0.9999) {
		cameraControls.isLookingUpDone = true
	}

	//return cameraControls.isLookingUpDone ? 0.0 : deltatimeinc * 0.01 
}

function uninitForBarScene() {
	deleteProgram(programRenderBar.program);
}

function updateForBarScene() {
	if(cameraControls.isLookingUpDone) {
		cameraControls.theta += 0.1;
		if(cameraControls.theta > 360.0) {
			cameraControls.isLookingUpDone = false;
		}
	}
}