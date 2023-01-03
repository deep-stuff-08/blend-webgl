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
	texPhone: null
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
	[[-5.0, -0.5, -0.3], [-5.0, -1.8, -0.3], [0.0, 1.0, 0.0], [0.0, 0.0, 0.0]],
	[[-5.0, -0.5, 1.3], [-5.0, -0.8, -0.3], [0.0, 1.0, 0.0], [0.0, 0.0, 0.0]],
	[[-5.0, -0.5, 1.3], [-3.0, -0.8, -2.3], [0.0, 1.0, 0.0], [0.0, 0.0, 0.0]],
	[[-5.0, -0.5, 1.3], [-1.0, -0.8, -0.3], [0.0, 1.0, 0.0], [0.0, 0.0, 0.0]],
	[[-5.0, -0.5, 1.3], [-3.0, -0.8, 2.3], [0.0, 1.0, 0.0], [0.0, 0.0, 0.0]],
	[[-5.0, -0.5, 1.3], [-5.0, -0.8, 4.3], [0.0, 1.0, 0.0], [0.0, 0.0, 0.0]],
	[[-5.0, -0.5, 1.3], [-7.0, -0.8, 2.3], [0.0, 1.0, 0.0], [0.0, 0.0, 0.0]],
	[[-5.0, -0.5, 1.3], [-9.0, -0.8, -0.3], [0.0, 1.0, 0.0], [0.0, 0.0, 0.0]],
	[[-5.0, -0.5, 1.3], [-7.0, -0.8, -2.3], [0.0, 1.0, 0.0], [0.0, 0.0, 0.0]],
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
	BarSceneObjects.mPlane.setMaterial(new material());
	//console.log(mPlane);

	BarSceneObjects.mcab1 = new Model('BarScene/resources/cab1.json');

	BarSceneObjects.mcab2 = new Model('BarScene/resources/cab2.json');
	BarSceneObjects.mLight = new Model('BarScene/resources/light.json');
	BarSceneObjects.mDoor = new Model('BarScene/resources/door.json');
	BarSceneObjects.mFan = new Model('BarScene/resources/fan.json');
	BarSceneObjects.mBottle = new Model('BarScene/resources/bottle.json');
	BarSceneObjects.mBottle2 = new Model('BarScene/resources/bottle2.json');
	BarSceneObjects.mCoke = new Model('BarScene/resources/coke.json');
	BarSceneObjects.mPepsi = new Model('BarScene/resources/pepsi.json');
	BarSceneObjects.mTable = new Model('BarScene/resources/table.json');
	BarSceneObjects.mCigar = new Model('BarScene/resources/cigar.json');
	BarSceneObjects.mChair = new Model('BarScene/resources/chair.json');
	BarSceneObjects.mStool = new Model('BarScene/resources/stool.json');
	BarSceneObjects.mGlass = new Model('BarScene/resources/glass.json');

	BarSceneObjects.texPhone = loadTexture('resources/textures/Youtube.jpg', true)

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
			if(position < 0.5)
				return 0.0004;
			else
				return 0.0006;
		case 2:
			if(position < 0.5)
				return 0.0003;
			else
				return 0.0003;
		default:
			return 0.0003;
	}
}

function renderForBarScene(perspectiveMatrix, camMatrix, camPosition, deltatimeinc) {
	var viewMatrix = mat4.clone(camMatrix);
	//mat4.translate(viewMatrix, viewMatrix, [-camPosition[0], -camPosition[1], -camPosition[2]])
	//mat4.rotate(viewMatrix, viewMatrix, glMatrix.toRadian(cameraControls.theta), [0.0, 1.0, 0.0]);
	// mat4.translate(viewMatrix, viewMatrix, camPosition)
	// renderLightSourceDeep(perspectiveMatrix, viewMatrix, placementHelp.trans, [1.0, 1.0, 1.0]);
	var cameraPosition = camPosition;
	// Draw All Opaue Objects

	updateForBarScene()

	var modelMatrix = mat4.create();

	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
	gl.disable(gl.CULL_FACE);
	// back
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [0.0,0.0,-5.0]);
	//mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(90.0), [0.0, 1.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[10.0,5.0,5.0]);
	gl.useProgram(programRenderBar.program);
	gl.uniformMatrix4fv(programRenderBar.uniform.pMat, false, perspectiveMatrix);
	gl.uniformMatrix4fv(programRenderBar.uniform.vMat, false, viewMatrix);
	gl.uniformMatrix4fv(programRenderBar.uniform.mMat, false, modelMatrix);
	gl.uniform3fv(programRenderBar.uniform.viewPos, debugCamera.cameraPosition);
	for(var l = 0; l < Light.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].direction"),Light[l].position );
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].ambient"), Light[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].diffuse"), Light[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].specular"), Light[l].specular);
	}
	BarSceneObjects.mPlane.render(programRenderBar.program);
	gl.useProgram(null);

	//front
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [0.0,0.0,15.0]);
	mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(-180.0), [0.0, 1.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[10.0,5.0,5.0]);
	gl.useProgram(programRenderBar.program);
	gl.uniformMatrix4fv(programRenderBar.uniform.pMat, false, perspectiveMatrix);
	gl.uniformMatrix4fv(programRenderBar.uniform.vMat, false, viewMatrix);
	gl.uniformMatrix4fv(programRenderBar.uniform.mMat, false, modelMatrix);
	gl.uniform3fv(programRenderBar.uniform.viewPos, debugCamera.cameraPosition);
	for(var l = 0; l < Light.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].direction"),Light[l].position );
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].ambient"), Light[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].diffuse"), Light[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].specular"), Light[l].specular);
	}
	BarSceneObjects.mPlane.render(programRenderBar.program);
	gl.useProgram(null);

	// right
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [10.0,0.0,5.0]);
	mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(-90.0), [0.0, 1.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[10.0,5.0,5.0]);
	gl.useProgram(programRenderBar.program);
	gl.uniformMatrix4fv(programRenderBar.uniform.pMat, false, perspectiveMatrix);
	gl.uniformMatrix4fv(programRenderBar.uniform.vMat, false, viewMatrix);
	gl.uniformMatrix4fv(programRenderBar.uniform.mMat, false, modelMatrix);
	gl.uniform3fv(programRenderBar.uniform.viewPos, debugCamera.cameraPosition);
	for(var l = 0; l < Light.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].direction"),Light[l].position );
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].ambient"), Light[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].diffuse"), Light[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].specular"), Light[l].specular);
	}
	BarSceneObjects.mPlane.render(programRenderBar.program);
	gl.useProgram(null);

	// left
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-10.0,0.0,5.0]);
	mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(90.0), [0.0, 1.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[10.0,5.0,5.0]);
	gl.useProgram(programRenderBar.program);
	gl.uniformMatrix4fv(programRenderBar.uniform.pMat, false, perspectiveMatrix);
	gl.uniformMatrix4fv(programRenderBar.uniform.vMat, false, viewMatrix);
	gl.uniformMatrix4fv(programRenderBar.uniform.mMat, false, modelMatrix);
	gl.uniform3fv(programRenderBar.uniform.viewPos, debugCamera.cameraPosition);
	for(var l = 0; l < Light.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].direction"),Light[l].position );
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].ambient"), Light[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].diffuse"), Light[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].specular"), Light[l].specular);
	}
	BarSceneObjects.mPlane.render(programRenderBar.program);
	gl.useProgram(null);

	// bottom
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [0.0,-5.0,5.0]);
	mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(-90.0), [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[10.0,10.0,5.0]);
	gl.useProgram(programRenderBar.program);
	gl.uniformMatrix4fv(programRenderBar.uniform.pMat, false, perspectiveMatrix);
	gl.uniformMatrix4fv(programRenderBar.uniform.vMat, false, viewMatrix);
	gl.uniformMatrix4fv(programRenderBar.uniform.mMat, false, modelMatrix);
	gl.uniform3fv(programRenderBar.uniform.viewPos, debugCamera.cameraPosition);
	for(var l = 0; l < Light.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].direction"),Light[l].position );
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].ambient"), Light[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].diffuse"), Light[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].specular"), Light[l].specular);
	}
	BarSceneObjects.mPlane.render(programRenderBar.program);
	gl.useProgram(null);

	//top
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [0.0,5.0,5.0]);
	mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(90.0), [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[10.0,10.0,5.0]);
	gl.useProgram(programRenderBar.program);
	gl.uniformMatrix4fv(programRenderBar.uniform.pMat, false, perspectiveMatrix);
	gl.uniformMatrix4fv(programRenderBar.uniform.vMat, false, viewMatrix);
	gl.uniformMatrix4fv(programRenderBar.uniform.mMat, false, modelMatrix);
	gl.uniform3fv(programRenderBar.uniform.viewPos, debugCamera.cameraPosition);
	for(var l = 0; l < Light.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].direction"),Light[l].position );
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].ambient"), Light[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].diffuse"), Light[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].specular"), Light[l].specular);
	}
	BarSceneObjects.mPlane.render(programRenderBar.program);
	gl.useProgram(null);

	//renderLightSourceDeep(perspectiveMatrix, viewMatrix, [-5.0,0.0,-0.3], [1.0,0.0,0.0]);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-5.0,-1.8,-0.3]);
	mat4.rotate(modelMatrix, modelMatrix,glMatrix.toRadian(90), [1.0, 0.0, 0.0]);
	mat4.rotate(modelMatrix, modelMatrix,glMatrix.toRadian(180), [0.0, 1.0, 0.0]);
	mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(180), [0.0, 0.0, 1.0]);
	mat4.scale(modelMatrix,modelMatrix,[0.3,0.3,0.3]);
	gl.useProgram(progCompleteLight.program);
	resetCompleteLight();
	setProjectionAndViewCompleteLight(perspectiveMatrix, viewMatrix, debugCamera.cameraPosition);
	setFlagsCompleteLight(false, false, true, true);
	setTextureSamplersCompleteLight(0);
	setMaterialCompleteLight([0.1, 0.1, 0.1], [1.0, 1.0, 1.0], [0.0, 0.0, 0.0], 1.0, 1.0);
	addPointLightCompleteLight([-5.0,0.0,-0.3], [0.1, 0.1, 0.1], [1.0, 1.0, 1.0], [1.0, 1.0, 1.0],[1.0,0.022,0.0019]);
	renderForPhoneDeep(modelMatrix, BarSceneObjects.texPhone);

	// light src test
	for(var l  = 0; l < Light.length; l++)
		// renderLightSourceDeep(perspectiveMatrix, viewMatrix, Light[l].position, Light[l].diffuse);

	gl.enable(gl.CULL_FACE);
	
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-6.0,-2.8,-1.0]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(90.0), [1.0, 0.0, 0.0]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(90.0), [0.0, 0.0, 1.0]);
	mat4.scale(modelMatrix,modelMatrix,[0.1,0.5,0.1]);
	gl.useProgram(programRenderBar.program);
	gl.uniformMatrix4fv(programRenderBar.uniform.pMat, false, perspectiveMatrix);
	gl.uniformMatrix4fv(programRenderBar.uniform.vMat, false, viewMatrix);
	gl.uniformMatrix4fv(programRenderBar.uniform.mMat, false, modelMatrix);
	gl.uniform3fv(programRenderBar.uniform.viewPos, debugCamera.cameraPosition);
	for(var l = 0; l < Light.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].direction"),Light[l].position );
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].ambient"), Light[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].diffuse"), Light[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].specular"), Light[l].specular);
	}
	BarSceneObjects.mcab1.render(programRenderBar.program);
	gl.useProgram(null);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-2.0,-3.1,-0.5]);
	//mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(90.0), [1.0, 0.0, 0.0]);
	//mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(90.0), [0.0, 0.0, 1.0]);
	mat4.scale(modelMatrix,modelMatrix,[0.3,0.3,0.3]);
	gl.useProgram(programRenderBar.program);
	gl.uniformMatrix4fv(programRenderBar.uniform.pMat, false, perspectiveMatrix);
	gl.uniformMatrix4fv(programRenderBar.uniform.vMat, false, viewMatrix);
	gl.uniformMatrix4fv(programRenderBar.uniform.mMat, false, modelMatrix);
	gl.uniform3fv(programRenderBar.uniform.viewPos, debugCamera.cameraPosition);
	for(var l = 0; l < Light.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].direction"),Light[l].position );
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].ambient"), Light[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].diffuse"), Light[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].specular"), Light[l].specular);
	}
	BarSceneObjects.mCigar.render(programRenderBar.program);
	gl.useProgram(null);

	var x = -9.5;
	for(var i = 0; i < 4; i++)
	{		
		mat4.identity(modelMatrix);
		mat4.translate(modelMatrix, modelMatrix, [x,-3.7,1.0]);
		mat4.rotate(modelMatrix, modelMatrix,glMatrix.toRadian(90), [1.0, 0.0, 0.0]);
		//mat4.rotate(modelMatrix, modelMatrix,glMatrix.toRadian(-90), [0.0, 0.0, 1.0]);
		//mat4.rotate(modeslMatrix, modelMatrix, 90.0, [1.0, 0.0, 0.0]);
		mat4.scale(modelMatrix,modelMatrix,[0.3,0.3,0.3]);
		gl.useProgram(programRenderBar.program);
		gl.uniformMatrix4fv(programRenderBar.uniform.pMat, false, perspectiveMatrix);
		gl.uniformMatrix4fv(programRenderBar.uniform.vMat, false, viewMatrix);
		gl.uniformMatrix4fv(programRenderBar.uniform.mMat, false, modelMatrix);
		gl.uniform3fv(programRenderBar.uniform.viewPos, debugCamera.cameraPosition);
		for(var l = 0; l < Light.length; l++)
		{
			gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].direction"),Light[l].position );
			gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].ambient"), Light[l].ambient);
			gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].diffuse"), Light[l].diffuse);
			gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].specular"), Light[l].specular);
		}
		BarSceneObjects.mStool.render(programRenderBar.program);
		gl.useProgram(null);
		x += 2.0;
	}

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-6.0,-1.5,-4.0]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(180.0), [0.0, 1.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[0.15,0.1,0.03]);
	gl.useProgram(programRenderBar.program);
	gl.uniformMatrix4fv(programRenderBar.uniform.pMat, false, perspectiveMatrix);
	gl.uniformMatrix4fv(programRenderBar.uniform.vMat, false, viewMatrix);
	gl.uniformMatrix4fv(programRenderBar.uniform.mMat, false, modelMatrix);
	gl.uniform3fv(programRenderBar.uniform.viewPos, debugCamera.cameraPosition);
	for(var l = 0; l < Light.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].direction"),Light[l].position );
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].ambient"), Light[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].diffuse"), Light[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].specular"), Light[l].specular);
	}
	BarSceneObjects.mcab2.render(programRenderBar.program);
	gl.useProgram(null);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [7.0,-5.0,-13.0]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(180.0), [0.0, 0.0, 1.0]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(-90.0), [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[8.0,8.0,8.0]);
	gl.useProgram(programRenderBar.program);
	gl.uniformMatrix4fv(programRenderBar.uniform.pMat, false, perspectiveMatrix);
	gl.uniformMatrix4fv(programRenderBar.uniform.vMat, false, viewMatrix);
	gl.uniformMatrix4fv(programRenderBar.uniform.mMat, false, modelMatrix);
	gl.uniform3fv(programRenderBar.uniform.viewPos, debugCamera.cameraPosition);
	for(var l = 0; l < Light.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].direction"),Light[l].position );
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].ambient"), Light[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].diffuse"), Light[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].specular"), Light[l].specular);
	}
	BarSceneObjects.mCoke.render(programRenderBar.program);
	gl.useProgram(null);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [0.0,4.3,4.0]);
	mat4.rotate(modelMatrix, modelMatrix, FanAngle, [0.0, 1.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[0.3,0.3,0.3]);
	gl.useProgram(programRenderBar.program);
	gl.uniformMatrix4fv(programRenderBar.uniform.pMat, false, perspectiveMatrix);
	gl.uniformMatrix4fv(programRenderBar.uniform.vMat, false, viewMatrix);
	gl.uniformMatrix4fv(programRenderBar.uniform.mMat, false, modelMatrix);
	gl.uniform3fv(programRenderBar.uniform.viewPos, debugCamera.cameraPosition);
	for(var l = 0; l < Light.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].direction"),Light[l].position );
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].ambient"), Light[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].diffuse"), Light[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].specular"), Light[l].specular);
	}
	BarSceneObjects.mFan.render(programRenderBar.program);
	gl.useProgram(null);

	// light src test
	/*

	*/
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-8.0,3.8,16.0]);
	mat4.rotate(modelMatrix, modelMatrix,glMatrix.toRadian(-90), [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[0.3,0.3,0.3]);
	gl.useProgram(programRenderBar.program);
	gl.uniformMatrix4fv(programRenderBar.uniform.pMat, false, perspectiveMatrix);
	gl.uniformMatrix4fv(programRenderBar.uniform.vMat, false, viewMatrix);
	gl.uniformMatrix4fv(programRenderBar.uniform.mMat, false, modelMatrix);
	gl.uniform3fv(programRenderBar.uniform.viewPos, debugCamera.cameraPosition);
	for(var l = 0; l < Light.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].direction"),Light[l].position );
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].ambient"), Light[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].diffuse"), Light[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].specular"), Light[l].specular);
	}
	BarSceneObjects.mDoor.render(programRenderBar.program);
	gl.useProgram(null);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-6.0,-3.3,10.5]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(90.0), [1.0, 0.0, 0.0]);
	//mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(-90.0), [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[3.0,1.5,1.5]);
	gl.useProgram(programRenderBar.program);
	gl.uniformMatrix4fv(programRenderBar.uniform.pMat, false, perspectiveMatrix);
	gl.uniformMatrix4fv(programRenderBar.uniform.vMat, false, viewMatrix);
	gl.uniformMatrix4fv(programRenderBar.uniform.mMat, false, modelMatrix);
	gl.uniform3fv(programRenderBar.uniform.viewPos, debugCamera.cameraPosition);
	for(var l = 0; l < Light.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].direction"),Light[l].position );
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].ambient"), Light[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].diffuse"), Light[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].specular"), Light[l].specular);
	}
	BarSceneObjects.mTable.render(programRenderBar.program);
	gl.useProgram(null);
	gl.bindTexture(gl.TEXTURE_2D,null);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-7.5,-2.7,13.5]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(90.0), [1.0, 0.0, 0.0]);
	//mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(-90.0), [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[2.0,2.0,2.0]);
	gl.useProgram(programRenderBar.program);
	gl.uniformMatrix4fv(programRenderBar.uniform.pMat, false, perspectiveMatrix);
	gl.uniformMatrix4fv(programRenderBar.uniform.vMat, false, viewMatrix);
	gl.uniformMatrix4fv(programRenderBar.uniform.mMat, false, modelMatrix);
	gl.uniform3fv(programRenderBar.uniform.viewPos, debugCamera.cameraPosition);
	for(var l = 0; l < Light.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].direction"),Light[l].position );
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].ambient"), Light[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].diffuse"), Light[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].specular"), Light[l].specular);
	}
	BarSceneObjects.mChair.render(programRenderBar.program);
	gl.useProgram(null);
	gl.bindTexture(gl.TEXTURE_2D,null);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-4.5,-2.7,13.5]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(90.0), [1.0, 0.0, 0.0]);
	//mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(-90.0), [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[2.0,2.0,2.0]);
	gl.useProgram(programRenderBar.program);
	gl.uniformMatrix4fv(programRenderBar.uniform.pMat, false, perspectiveMatrix);
	gl.uniformMatrix4fv(programRenderBar.uniform.vMat, false, viewMatrix);
	gl.uniformMatrix4fv(programRenderBar.uniform.mMat, false, modelMatrix);
	gl.uniform3fv(programRenderBar.uniform.viewPos, debugCamera.cameraPosition);
	for(var l = 0; l < Light.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].direction"),Light[l].position );
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].ambient"), Light[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].diffuse"), Light[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].specular"), Light[l].specular);
	}
	BarSceneObjects.mChair.render(programRenderBar.program);
	gl.useProgram(null);
	gl.bindTexture(gl.TEXTURE_2D,null);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-7.5,-2.7,7.5]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(90.0), [1.0, 0.0, 0.0]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(180.0), [0.0, 0.0, 1.0]);
	mat4.scale(modelMatrix,modelMatrix,[2.0,2.0,2.0]);
	gl.useProgram(programRenderBar.program);
	gl.uniformMatrix4fv(programRenderBar.uniform.pMat, false, perspectiveMatrix);
	gl.uniformMatrix4fv(programRenderBar.uniform.vMat, false, viewMatrix);
	gl.uniformMatrix4fv(programRenderBar.uniform.mMat, false, modelMatrix);
	gl.uniform3fv(programRenderBar.uniform.viewPos, debugCamera.cameraPosition);
	for(var l = 0; l < Light.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].direction"),Light[l].position );
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].ambient"), Light[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].diffuse"), Light[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].specular"), Light[l].specular);
	}
	BarSceneObjects.mChair.render(programRenderBar.program);
	gl.useProgram(null);
	gl.bindTexture(gl.TEXTURE_2D,null);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-4.5,-2.7,7.5]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(90.0), [1.0, 0.0, 0.0]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(180.0), [0.0, 0.0, 1.0]);
	mat4.scale(modelMatrix,modelMatrix,[2.0,2.0,2.0]);
	gl.useProgram(programRenderBar.program);
	gl.uniformMatrix4fv(programRenderBar.uniform.pMat, false, perspectiveMatrix);
	gl.uniformMatrix4fv(programRenderBar.uniform.vMat, false, viewMatrix);
	gl.uniformMatrix4fv(programRenderBar.uniform.mMat, false, modelMatrix);
	gl.uniform3fv(programRenderBar.uniform.viewPos, debugCamera.cameraPosition);
	for(var l = 0; l < Light.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].direction"),Light[l].position );
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].ambient"), Light[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].diffuse"), Light[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].specular"), Light[l].specular);
	}
	BarSceneObjects.mChair.render(programRenderBar.program);
	gl.useProgram(null);
	gl.bindTexture(gl.TEXTURE_2D,null);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [7.0,-3.3,5.0]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(90.0), [1.0, 0.0, 0.0]);
	//mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(-90.0), [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[3.0,1.5,1.5]);
	gl.useProgram(programRenderBar.program);
	gl.uniformMatrix4fv(programRenderBar.uniform.pMat, false, perspectiveMatrix);
	gl.uniformMatrix4fv(programRenderBar.uniform.vMat, false, viewMatrix);
	gl.uniformMatrix4fv(programRenderBar.uniform.mMat, false, modelMatrix);
	gl.uniform3fv(programRenderBar.uniform.viewPos, debugCamera.cameraPosition);
	for(var l = 0; l < Light.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].direction"),Light[l].position );
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].ambient"), Light[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].diffuse"), Light[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].specular"), Light[l].specular);
	}
	BarSceneObjects.mTable.render(programRenderBar.program);
	gl.useProgram(null);
	gl.bindTexture(gl.TEXTURE_2D,null);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [5.5,-2.7,8.0]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(90.0), [1.0, 0.0, 0.0]);
	//mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(-90.0), [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[2.0,2.0,2.0]);
	gl.useProgram(programRenderBar.program);
	gl.uniformMatrix4fv(programRenderBar.uniform.pMat, false, perspectiveMatrix);
	gl.uniformMatrix4fv(programRenderBar.uniform.vMat, false, viewMatrix);
	gl.uniformMatrix4fv(programRenderBar.uniform.mMat, false, modelMatrix);
	gl.uniform3fv(programRenderBar.uniform.viewPos, debugCamera.cameraPosition);
	for(var l = 0; l < Light.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].direction"),Light[l].position );
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].ambient"), Light[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].diffuse"), Light[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].specular"), Light[l].specular);
	}
	BarSceneObjects.mChair.render(programRenderBar.program);
	gl.useProgram(null);
	gl.bindTexture(gl.TEXTURE_2D,null);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [8.5,-2.7,8.0]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(90.0), [1.0, 0.0, 0.0]);
	//mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(-90.0), [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[2.0,2.0,2.0]);
	gl.useProgram(programRenderBar.program);
	gl.uniformMatrix4fv(programRenderBar.uniform.pMat, false, perspectiveMatrix);
	gl.uniformMatrix4fv(programRenderBar.uniform.vMat, false, viewMatrix);
	gl.uniformMatrix4fv(programRenderBar.uniform.mMat, false, modelMatrix);
	gl.uniform3fv(programRenderBar.uniform.viewPos, debugCamera.cameraPosition);
	for(var l = 0; l < Light.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].direction"),Light[l].position );
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].ambient"), Light[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].diffuse"), Light[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].specular"), Light[l].specular);
	}
	BarSceneObjects.mChair.render(programRenderBar.program);
	gl.useProgram(null);
	gl.bindTexture(gl.TEXTURE_2D,null);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [5.5,-2.7,2.0]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(90.0), [1.0, 0.0, 0.0]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(180.0), [0.0, 0.0, 1.0]);
	mat4.scale(modelMatrix,modelMatrix,[2.0,2.0,2.0]);
	gl.useProgram(programRenderBar.program);
	gl.uniformMatrix4fv(programRenderBar.uniform.pMat, false, perspectiveMatrix);
	gl.uniformMatrix4fv(programRenderBar.uniform.vMat, false, viewMatrix);
	gl.uniformMatrix4fv(programRenderBar.uniform.mMat, false, modelMatrix);
	gl.uniform3fv(programRenderBar.uniform.viewPos, debugCamera.cameraPosition);
	for(var l = 0; l < Light.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].direction"),Light[l].position );
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].ambient"), Light[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].diffuse"), Light[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].specular"), Light[l].specular);
	}
	BarSceneObjects.mChair.render(programRenderBar.program);
	gl.useProgram(null);
	gl.bindTexture(gl.TEXTURE_2D,null);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [8.5,-2.7,2.0]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(90.0), [1.0, 0.0, 0.0]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(180.0), [0.0, 0.0, 1.0]);
	mat4.scale(modelMatrix,modelMatrix,[2.0,2.0,2.0]);
	gl.useProgram(programRenderBar.program);
	gl.uniformMatrix4fv(programRenderBar.uniform.pMat, false, perspectiveMatrix);
	gl.uniformMatrix4fv(programRenderBar.uniform.vMat, false, viewMatrix);
	gl.uniformMatrix4fv(programRenderBar.uniform.mMat, false, modelMatrix);
	gl.uniform3fv(programRenderBar.uniform.viewPos, debugCamera.cameraPosition);
	for(var l = 0; l < Light.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].direction"),Light[l].position );
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].ambient"), Light[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].diffuse"), Light[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].specular"), Light[l].specular);
	}
	BarSceneObjects.mChair.render(programRenderBar.program);
	gl.useProgram(null);
	gl.bindTexture(gl.TEXTURE_2D,null);

	// Draw All Transparent Objects

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [3.0,-2.3,-1.8]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(88.0), [1.0, 0.0, 0.0]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(180.0), [0.0, 0.0, 180.0]);
	//mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(-90.0), [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[4.0,4.0,4.0]);
	gl.useProgram(programRenderBar.program);
	gl.uniformMatrix4fv(programRenderBar.uniform.pMat, false, perspectiveMatrix);
	gl.uniformMatrix4fv(programRenderBar.uniform.vMat, false, viewMatrix);
	gl.uniformMatrix4fv(programRenderBar.uniform.mMat, false, modelMatrix);
	gl.uniform3fv(programRenderBar.uniform.viewPos, debugCamera.cameraPosition);
	for(var l = 0; l < Light.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].direction"),Light[l].position );
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].ambient"), Light[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].diffuse"), Light[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].specular"), Light[l].specular);
	}
	BarSceneObjects.mPepsi.render(programRenderBar.program);
	gl.useProgram(null);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-3.0,-1.3,-0.5]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(90.0), [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[6.0,8.0,6.0]);
	gl.useProgram(programRenderBar.program);
	gl.uniformMatrix4fv(programRenderBar.uniform.pMat, false, perspectiveMatrix);
	gl.uniformMatrix4fv(programRenderBar.uniform.vMat, false, viewMatrix);
	gl.uniformMatrix4fv(programRenderBar.uniform.mMat, false, modelMatrix);
	gl.uniform3fv(programRenderBar.uniform.viewPos, debugCamera.cameraPosition);
	for(var l = 0; l < Light.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].direction"),Light[l].position );
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].ambient"), Light[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].diffuse"), Light[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].specular"), Light[l].specular);
	}
	BarSceneObjects.mBottle.render(programRenderBar.program);
	gl.useProgram(null);

	var y = 1.1;
	for(var i = 0; i < 3 ; i++)
	{
		var x = -1.0;
		for(var j = 0; j < 2; j++)
		{
			mat4.identity(modelMatrix);
			mat4.translate(modelMatrix, modelMatrix, [x,y,-4.0]);
			mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(90.0), [1.0, 0.0, 0.0]);
			mat4.scale(modelMatrix,modelMatrix,[8.0,8.0,8.0]);
			gl.useProgram(programRenderBar.program);
			gl.uniformMatrix4fv(programRenderBar.uniform.pMat, false, perspectiveMatrix);
			gl.uniformMatrix4fv(programRenderBar.uniform.vMat, false, viewMatrix);
			gl.uniformMatrix4fv(programRenderBar.uniform.mMat, false, modelMatrix);
			gl.uniform3fv(programRenderBar.uniform.viewPos, debugCamera.cameraPosition);
			for(var l = 0; l < Light.length; l++)
			{
				gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].direction"),Light[l].position );
				gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].ambient"), Light[l].ambient);
				gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].diffuse"), Light[l].diffuse);
				gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].specular"), Light[l].specular);
			}
			BarSceneObjects.mBottle.render(programRenderBar.program);
			gl.useProgram(null);
			x += 1.5;
		}
		y -= 1.7;
	}

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-6.0,-1.65,10.5]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(90.0), [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[4.0,4.0,4.0]);
	gl.useProgram(programRenderBar.program);
	gl.uniformMatrix4fv(programRenderBar.uniform.pMat, false, perspectiveMatrix);
	gl.uniformMatrix4fv(programRenderBar.uniform.vMat, false, viewMatrix);
	gl.uniformMatrix4fv(programRenderBar.uniform.mMat, false, modelMatrix);
	gl.uniform3fv(programRenderBar.uniform.viewPos, debugCamera.cameraPosition);
	for(var l = 0; l < Light.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].direction"),Light[l].position );
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].ambient"), Light[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].diffuse"), Light[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].specular"), Light[l].specular);
	}
	BarSceneObjects.mBottle2.render(programRenderBar.program);
	gl.useProgram(null);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [7.0,-1.65,5.0]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(90.0), [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[4.0,4.0,4.0]);
	gl.useProgram(programRenderBar.program);
	gl.uniformMatrix4fv(programRenderBar.uniform.pMat, false, perspectiveMatrix);
	gl.uniformMatrix4fv(programRenderBar.uniform.vMat, false, viewMatrix);
	gl.uniformMatrix4fv(programRenderBar.uniform.mMat, false, modelMatrix);
	gl.uniform3fv(programRenderBar.uniform.viewPos, debugCamera.cameraPosition);
	for(var l = 0; l < Light.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].direction"),Light[l].position );
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].ambient"), Light[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].diffuse"), Light[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].specular"), Light[l].specular);
	}
	BarSceneObjects.mBottle2.render(programRenderBar.program);
	gl.useProgram(null);


	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [8.0,-2.3,5.0]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(-90.0), [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[5.0,5.0,5.0]);
	gl.useProgram(programRenderBar.program);
	gl.uniformMatrix4fv(programRenderBar.uniform.pMat, false, perspectiveMatrix);
	gl.uniformMatrix4fv(programRenderBar.uniform.vMat, false, viewMatrix);
	gl.uniformMatrix4fv(programRenderBar.uniform.mMat, false, modelMatrix);
	gl.uniform3fv(programRenderBar.uniform.viewPos, debugCamera.cameraPosition);
	for(var l = 0; l < Light.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].direction"),Light[l].position );
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].ambient"), Light[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].diffuse"), Light[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].specular"), Light[l].specular);
	}
	BarSceneObjects.mGlass.render(programRenderBar.program);
	gl.useProgram(null);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [5.5,-2.3,3.5]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(-90.0), [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[5.0,5.0,5.0]);
	gl.useProgram(programRenderBar.program);
	gl.uniformMatrix4fv(programRenderBar.uniform.pMat, false, perspectiveMatrix);
	gl.uniformMatrix4fv(programRenderBar.uniform.vMat, false, viewMatrix);
	gl.uniformMatrix4fv(programRenderBar.uniform.mMat, false, modelMatrix);
	gl.uniform3fv(programRenderBar.uniform.viewPos, debugCamera.cameraPosition);
	for(var l = 0; l < Light.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].direction"),Light[l].position );
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].ambient"), Light[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].diffuse"), Light[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].specular"), Light[l].specular);
	}
	BarSceneObjects.mGlass.render(programRenderBar.program);
	gl.useProgram(null);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-5.0,-2.3,10.5]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(-90.0), [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[5.0,5.0,5.0]);
	gl.useProgram(programRenderBar.program);
	gl.uniformMatrix4fv(programRenderBar.uniform.pMat, false, perspectiveMatrix);
	gl.uniformMatrix4fv(programRenderBar.uniform.vMat, false, viewMatrix);
	gl.uniformMatrix4fv(programRenderBar.uniform.mMat, false, modelMatrix);
	gl.uniform3fv(programRenderBar.uniform.viewPos, debugCamera.cameraPosition);
	for(var l = 0; l < Light.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].direction"),Light[l].position );
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].ambient"), Light[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].diffuse"), Light[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].specular"), Light[l].specular);
	}
	BarSceneObjects.mGlass.render(programRenderBar.program);
	gl.useProgram(null);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-7.0,-2.3,9.5]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(-90.0), [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[5.0,5.0,5.0]);
	gl.useProgram(programRenderBar.program);
	gl.uniformMatrix4fv(programRenderBar.uniform.pMat, false, perspectiveMatrix);
	gl.uniformMatrix4fv(programRenderBar.uniform.vMat, false, viewMatrix);
	gl.uniformMatrix4fv(programRenderBar.uniform.mMat, false, modelMatrix);
	gl.uniform3fv(programRenderBar.uniform.viewPos, debugCamera.cameraPosition);
	for(var l = 0; l < Light.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].direction"),Light[l].position );
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].ambient"), Light[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].diffuse"), Light[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].specular"), Light[l].specular);
	}
	BarSceneObjects.mGlass.render(programRenderBar.program);
	gl.useProgram(null);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-4.0,-1.85,-1.3]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(-90.0), [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[5.0,5.0,5.0]);
	gl.useProgram(programRenderBar.program);
	gl.uniformMatrix4fv(programRenderBar.uniform.pMat, false, perspectiveMatrix);
	gl.uniformMatrix4fv(programRenderBar.uniform.vMat, false, viewMatrix);
	gl.uniformMatrix4fv(programRenderBar.uniform.mMat, false, modelMatrix);
	gl.uniform3fv(programRenderBar.uniform.viewPos, debugCamera.cameraPosition);
	for(var l = 0; l < Light.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].direction"),Light[l].position );
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].ambient"), Light[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].diffuse"), Light[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programRenderBar.program,"light["+l+"].specular"), Light[l].specular);
	}
	BarSceneObjects.mGlass.render(programRenderBar.program);
	gl.useProgram(null);

	FanAngle += 0.01;

	if(camSplinePosition > 0.9999) {
		cameraControls.isLookingUpDone = true
	}
	gl.disable(gl.CULL_FACE);

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