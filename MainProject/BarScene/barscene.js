var programForBarScene;
var vaoForDeepCube;
var pMatUniformForSceneTwo;
var vMatUniformForSceneTwo;
var mMatUniformForSceneTwo;
var viewPosUniformForSceneTwo;
var angle = 0.0;

var mCube;
var mcab1;
var mcab2;
var mLight;
var mDoor;
var mFan;
var mCoke;
var mPepsi;

var mBottle;
var mBottle2;

var mTable;
var mChair
var mStool;

var mGlass;

var quad;
var angle;

var fboECGWave;
var textureECGWave;
var textureForm;

var video;
var copyVideo = false;
var videoTexture;

var Light = [];

function updateTexture(gl,texture,video)
{
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
	gl.bindTexture(gl.TEXTURE_2D, null);
}

function setupprogramForBarScene() {
	var vertShader = createShader('BarScene/shaders/demo.vert', gl.VERTEX_SHADER);
	var fragShader = createShader('BarScene/shaders/demo.frag', gl.FRAGMENT_SHADER);
	programForBarScene = createProgram([vertShader, fragShader]);
	deleteShader(vertShader);
	deleteShader(fragShader);
}

function initForBarScene() {
	var data = new Float32Array([
		//Front
		1.0, 1.0, 1.0, 1.0,		1.0, 0.0, 0.0, 1.0,		0.0, 0.0, 1.0,		1.0, 1.0,
		-1.0, 1.0, 1.0, 1.0,	1.0, 0.0, 0.0, 1.0,		0.0, 0.0, 1.0,		0.0, 1.0,
		-1.0, -1.0, 1.0, 1.0,	1.0, 0.0, 0.0, 1.0,		0.0, 0.0, 1.0,		0.0, 0.0,
		
		-1.0, -1.0, 1.0, 1.0,	1.0, 0.0, 0.0, 1.0,		0.0, 0.0, 1.0,		0.0, 0.0,
		1.0, -1.0, 1.0, 1.0,	1.0, 0.0, 0.0, 1.0,		0.0, 0.0, 1.0,		1.0, 0.0,
		1.0, 1.0, 1.0, 1.0,		1.0, 0.0, 0.0, 1.0,		0.0, 0.0, 1.0,		1.0, 1.0,

		//Right
		1.0, 1.0, -1.0, 1.0,	0.0, 0.0, 1.0, 1.0,		1.0, 0.0, 0.0,		1.0, 1.0,
		1.0, 1.0, 1.0, 1.0,		0.0, 0.0, 1.0, 1.0,		1.0, 0.0, 0.0,		0.0, 1.0,
		1.0, -1.0, 1.0, 1.0,	0.0, 0.0, 1.0, 1.0,		1.0, 0.0, 0.0,		0.0, 0.0,
		
		1.0, 1.0, -1.0, 1.0,	0.0, 0.0, 1.0, 1.0,		1.0, 0.0, 0.0,		1.0, 1.0,
		1.0, -1.0, -1.0, 1.0,	0.0, 0.0, 1.0, 1.0,		1.0, 0.0, 0.0,		1.0, 0.0,
		1.0, -1.0, 1.0, 1.0,	0.0, 0.0, 1.0, 1.0,		1.0, 0.0, 0.0,		0.0, 0.0,

		//Back
		-1.0, 1.0, -1.0, 1.0,	1.0, 0.0, 1.0, 1.0,		0.0, 0.0, -1.0,		1.0, 1.0,
		1.0, 1.0, -1.0, 1.0,	1.0, 0.0, 1.0, 1.0,		0.0, 0.0, -1.0,		0.0, 1.0,
		1.0, -1.0, -1.0, 1.0,	1.0, 0.0, 1.0, 1.0,		0.0, 0.0, -1.0,		0.0, 0.0,

		-1.0, 1.0, -1.0, 1.0,	1.0, 0.0, 1.0, 1.0,		0.0, 0.0, -1.0,		1.0, 1.0,
		-1.0, -1.0, -1.0, 1.0,	1.0, 0.0, 1.0, 1.0,		0.0, 0.0, -1.0,		1.0, 0.0,
		1.0, -1.0, -1.0, 1.0,	1.0, 0.0, 1.0, 1.0,		0.0, 0.0, -1.0,		0.0, 0.0,

		//Left
		-1.0, 1.0, 1.0, 1.0,	0.0, 1.0, 1.0, 1.0,		-1.0, 0.0, 0.0,		1.0, 1.0,
		-1.0, 1.0, -1.0, 1.0,	0.0, 1.0, 1.0, 1.0,		-1.0, 0.0, 0.0,		0.0, 1.0,
		-1.0, -1.0, -1.0, 1.0,	0.0, 1.0, 1.0, 1.0,		-1.0, 0.0, 0.0,		0.0, 0.0,
		
		-1.0, -1.0, -1.0, 1.0,	0.0, 1.0, 1.0, 1.0,		-1.0, 0.0, 0.0,		0.0, 0.0,
		-1.0, -1.0, 1.0, 1.0,	0.0, 1.0, 1.0, 1.0,		-1.0, 0.0, 0.0,		1.0, 0.0,
		-1.0, 1.0, 1.0, 1.0,	0.0, 1.0, 1.0, 1.0,		-1.0, 0.0, 0.0,		1.0, 1.0,

		//Top
		1.0, 1.0, -1.0, 1.0,	0.0, 1.0, 0.0, 1.0,		0.0, 1.0, 0.0,		1.0, 1.0,
		-1.0, 1.0, -1.0, 1.0,	0.0, 1.0, 0.0, 1.0,		0.0, 1.0, 0.0,		0.0, 1.0,
		-1.0, 1.0, 1.0, 1.0,	0.0, 1.0, 0.0, 1.0,		0.0, 1.0, 0.0,		0.0, 0.0,
		
		-1.0, 1.0, 1.0, 1.0,	0.0, 1.0, 0.0, 1.0,		0.0, 1.0, 0.0,		0.0, 0.0,
		1.0, 1.0, 1.0, 1.0,		0.0, 1.0, 0.0, 1.0,		0.0, 1.0, 0.0,		1.0, 0.0,
		1.0, 1.0, -1.0, 1.0,	0.0, 1.0, 0.0, 1.0,		0.0, 1.0, 0.0,		1.0, 1.0,

		//Bottom
		1.0, -1.0, 1.0, 1.0,	1.0, 1.0, 0.0, 1.0,		0.0, -1.0, 0.0,		1.0, 1.0,
		-1.0, -1.0, 1.0, 1.0,	1.0, 1.0, 0.0, 1.0,		0.0, -1.0, 0.0,		0.0, 1.0,
		-1.0, -1.0, -1.0, 1.0,	1.0, 1.0, 0.0, 1.0,		0.0, -1.0, 0.0,		0.0, 0.0,
		
		-1.0, -1.0, -1.0, 1.0,	1.0, 1.0, 0.0, 1.0,		0.0, -1.0, 0.0,		0.0, 0.0,
		1.0, -1.0, -1.0, 1.0,	1.0, 1.0, 0.0, 1.0,		0.0, -1.0, 0.0,		1.0, 0.0,
		1.0, -1.0, 1.0, 1.0,	1.0, 1.0, 0.0, 1.0,		0.0, -1.0, 0.0,		1.0, 1.0,
	]);

	vao = gl.createVertexArray();
	var vbo = gl.createBuffer();
	gl.bindVertexArray(vao);
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
	gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
	gl.vertexAttribPointer(0, 4, gl.FLOAT, false, 4 * 13, 4 * 0)
	gl.enableVertexAttribArray(0)
	gl.vertexAttribPointer(5, 4, gl.FLOAT, false, 4 * 13, 4 * 4)
	gl.enableVertexAttribArray(5)
	gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 4 * 13, 4 * 8)
	gl.enableVertexAttribArray(1)
	gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 4 * 13, 4 * 11)
	gl.enableVertexAttribArray(2)
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	gl.bindVertexArray(null);

	pMatUniformForSceneTwo = gl.getUniformLocation(programForBarScene, "pMat")
	vMatUniformForSceneTwo = gl.getUniformLocation(programForBarScene, "vMat")
	mMatUniformForSceneTwo = gl.getUniformLocation(programForBarScene, "mMat")
	viewPosUniformForSceneTwo = gl.getUniformLocation(programForBarScene, "viewPos")
	//diffuseUnifromForDeepCube = gl.getUniformLocation(programForBarScene, "diffuse")

	var v = [[1.0, 1.0, 0.0,-1.0, 1.0, 0.0,-1.0, -1.0, 0.0,-1.0,-1.0, 0.0, 1.0, -1.0, 0.0, 1.0, 1.0, 0.0],[0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0],[1.0, 1.0, 0.0, 1.0,0.0, 0.0, 0.0, 0.0,	1.0, 0.0,1.0, 1.0,]];
	mPlane = new mesh(v,null,null);
	mPlane.setMaterial(new material());
	console.log(mPlane);


	quad = dshapes.initQuad();

	mcab1 = new Model('BarScene/resources/cab1.json');
	mcab2 = new Model('BarScene/resources/cab2.json');
	mLight = new Model('BarScene/resources/light.json');
	mDoor = new Model('BarScene/resources/door.json');
	mFan = new Model('BarScene/resources/fan.json');
	mBottle = new Model('BarScene/resources/bottle.json');
	mBottle2 = new Model('BarScene/resources/bottle2.json');
	mCoke = new Model('BarScene/resources/coke.json');
	mPepsi = new Model('BarScene/resources/pepsi.json');
	mTable = new Model('BarScene/resources/table.json');
	mChair = new Model('BarScene/resources/chair.json');
	mStool = new Model('BarScene/resources/stool.json');
	mGlass = new Model('BarScene/resources/glass.json');

	Light.push(
	{	
		position : [-8.5,-10.0,-13.0],
		ambient : [0.2,0.2,0.2],
		diffuse : [1.0,0.0,0.0],
		specular : [1.0,1.0,1.0]
	});

	Light.push(
		{	
			position : [8.5,-10.0,-13.0],
			ambient : [0.2,0.2,0.2],
			diffuse : [0.0,0.0,1.0],
			specular : [1.0,1.0,1.0]
		});

	console.log(Light);

}

function renderForBarScene(time , perspectiveMatrix, viewMatrix) {
	// Draw All Opaue Objects

	var modelMatrix = mat4.create();

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [8.5,10.0,13.0]);
	//mat4.rotate(modeslMatrix, modelMatrix, 90.0, [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[0.5,0.5,0.5]);
	gl.useProgram(programForBarScene);
	gl.bindVertexArray(vao);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition)
	for(var l = 0; l < Light.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].direction"),Light[l].position );
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].ambient"), Light[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].diffuse"), Light[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].specular"), Light[l].specular);
	}

	gl.drawArrays(gl.TRIANGLES, 0, 36);
	gl.bindVertexArray(null);
	gl.useProgram(null);

	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
	gl.disable(gl.CULL_FACE);
	// back
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [0.0,0.0,-5.0]);
	//mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(90.0), [0.0, 1.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[10.0,5.0,5.0]);
	gl.useProgram(programForBarScene);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition)
	for(var l = 0; l < Light.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].direction"),Light[l].position );
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].ambient"), Light[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].diffuse"), Light[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].specular"), Light[l].specular);
	}
	mPlane.render(programForBarScene);
	gl.useProgram(null);

	//front
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [0.0,0.0,15.0]);
	mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(-180.0), [0.0, 1.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[10.0,5.0,5.0]);
	gl.useProgram(programForBarScene);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition)
	for(var l = 0; l < Light.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].direction"),Light[l].position );
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].ambient"), Light[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].diffuse"), Light[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].specular"), Light[l].specular);
	}
	mPlane.render(programForBarScene);
	gl.useProgram(null);

	// right
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [10.0,0.0,5.0]);
	mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(-90.0), [0.0, 1.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[10.0,5.0,5.0]);
	gl.useProgram(programForBarScene);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition);
	for(var l = 0; l < Light.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].direction"),Light[l].position );
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].ambient"), Light[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].diffuse"), Light[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].specular"), Light[l].specular);
	}
	mPlane.render(programForBarScene);
	gl.useProgram(null);

	// left
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-10.0,0.0,5.0]);
	mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(90.0), [0.0, 1.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[10.0,5.0,5.0]);
	gl.useProgram(programForBarScene);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition)
	for(var l = 0; l < Light.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].direction"),Light[l].position );
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].ambient"), Light[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].diffuse"), Light[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].specular"), Light[l].specular);
	}
	mPlane.render(programForBarScene);
	gl.useProgram(null);

	// bottom
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [0.0,-5.0,5.0]);
	mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(-90.0), [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[10.0,10.0,5.0]);
	gl.useProgram(programForBarScene);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition)
	for(var l = 0; l < Light.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].direction"),Light[l].position );
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].ambient"), Light[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].diffuse"), Light[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].specular"), Light[l].specular);
	}
	mPlane.render(programForBarScene);
	gl.useProgram(null);

	//top
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [0.0,5.0,5.0]);
	mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(90.0), [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[10.0,10.0,5.0]);
	gl.useProgram(programForBarScene);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition)
	for(var l = 0; l < Light.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].direction"),Light[l].position );
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].ambient"), Light[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].diffuse"), Light[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].specular"), Light[l].specular);
	}
	mPlane.render(programForBarScene);
	gl.useProgram(null);

	gl.enable(gl.CULL_FACE);
	
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-6.0,-2.8,-1.0]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(90.0), [1.0, 0.0, 0.0]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(90.0), [0.0, 0.0, 1.0]);
	mat4.scale(modelMatrix,modelMatrix,[0.1,0.5,0.1]);
	gl.useProgram(programForBarScene);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition)
	for(var l = 0; l < Light.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].direction"),Light[l].position );
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].ambient"), Light[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].diffuse"), Light[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].specular"), Light[l].specular);
	}
	mcab1.render(programForBarScene);
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
		gl.useProgram(programForBarScene);
		gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
		gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
		gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
		gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition)
		for(var l = 0; l < Light.length; l++)
		{
			gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].direction"),Light[l].position );
			gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].ambient"), Light[l].ambient);
			gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].diffuse"), Light[l].diffuse);
			gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].specular"), Light[l].specular);
		}
		mStool.render(programForBarScene);
		gl.useProgram(null);
		x += 2.0;
	}

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-6.0,-1.5,-4.0]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(180.0), [0.0, 1.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[0.15,0.1,0.03]);
	gl.useProgram(programForBarScene);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition)
	for(var l = 0; l < Light.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].direction"),Light[l].position );
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].ambient"), Light[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].diffuse"), Light[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].specular"), Light[l].specular);
	}
	mcab2.render(programForBarScene);
	gl.useProgram(null);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [7.0,-5.0,-13.0]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(180.0), [0.0, 0.0, 1.0]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(-90.0), [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[8.0,8.0,8.0]);
	gl.useProgram(programForBarScene);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition)
	for(var l = 0; l < Light.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].direction"),Light[l].position );
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].ambient"), Light[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].diffuse"), Light[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].specular"), Light[l].specular);
	}
	mCoke.render(programForBarScene);
	gl.useProgram(null);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [0.0,4.3,4.0]);
	mat4.rotate(modelMatrix, modelMatrix, angle, [0.0, 1.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[0.3,0.3,0.3]);
	gl.useProgram(programForBarScene);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition)
	for(var l = 0; l < Light.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].direction"),Light[l].position );
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].ambient"), Light[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].diffuse"), Light[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].specular"), Light[l].specular);
	}
	mFan.render(programForBarScene);
	gl.useProgram(null);

	// light src test
	/*

	*/
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-8.0,3.8,16.0]);
	mat4.rotate(modelMatrix, modelMatrix,glMatrix.toRadian(-90), [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[0.3,0.3,0.3]);
	gl.useProgram(programForBarScene);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition)
	for(var l = 0; l < Light.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].direction"),Light[l].position );
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].ambient"), Light[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].diffuse"), Light[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].specular"), Light[l].specular);
	}
	mDoor.render(programForBarScene);
	gl.useProgram(null);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-6.0,-3.3,10.5]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(90.0), [1.0, 0.0, 0.0]);
	//mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(-90.0), [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[3.0,1.5,1.5]);
	gl.useProgram(programForBarScene);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition)
	for(var l = 0; l < Light.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].direction"),Light[l].position );
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].ambient"), Light[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].diffuse"), Light[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].specular"), Light[l].specular);
	}
	mTable.render(programForBarScene);
	gl.useProgram(null);
	gl.bindTexture(gl.TEXTURE_2D,null);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-7.5,-2.7,13.5]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(90.0), [1.0, 0.0, 0.0]);
	//mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(-90.0), [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[2.0,2.0,2.0]);
	gl.useProgram(programForBarScene);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition)
	for(var l = 0; l < Light.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].direction"),Light[l].position );
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].ambient"), Light[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].diffuse"), Light[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].specular"), Light[l].specular);
	}
	mChair.render(programForBarScene);
	gl.useProgram(null);
	gl.bindTexture(gl.TEXTURE_2D,null);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-4.5,-2.7,13.5]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(90.0), [1.0, 0.0, 0.0]);
	//mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(-90.0), [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[2.0,2.0,2.0]);
	gl.useProgram(programForBarScene);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition)
	for(var l = 0; l < Light.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].direction"),Light[l].position );
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].ambient"), Light[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].diffuse"), Light[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].specular"), Light[l].specular);
	}
	mChair.render(programForBarScene);
	gl.useProgram(null);
	gl.bindTexture(gl.TEXTURE_2D,null);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-7.5,-2.7,7.5]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(90.0), [1.0, 0.0, 0.0]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(180.0), [0.0, 0.0, 1.0]);
	mat4.scale(modelMatrix,modelMatrix,[2.0,2.0,2.0]);
	gl.useProgram(programForBarScene);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition)
	for(var l = 0; l < Light.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].direction"),Light[l].position );
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].ambient"), Light[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].diffuse"), Light[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].specular"), Light[l].specular);
	}
	mChair.render(programForBarScene);
	gl.useProgram(null);
	gl.bindTexture(gl.TEXTURE_2D,null);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-4.5,-2.7,7.5]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(90.0), [1.0, 0.0, 0.0]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(180.0), [0.0, 0.0, 1.0]);
	mat4.scale(modelMatrix,modelMatrix,[2.0,2.0,2.0]);
	gl.useProgram(programForBarScene);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition)
	for(var l = 0; l < Light.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].direction"),Light[l].position );
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].ambient"), Light[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].diffuse"), Light[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].specular"), Light[l].specular);
	}
	mChair.render(programForBarScene);
	gl.useProgram(null);
	gl.bindTexture(gl.TEXTURE_2D,null);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [7.0,-3.3,5.0]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(90.0), [1.0, 0.0, 0.0]);
	//mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(-90.0), [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[3.0,1.5,1.5]);
	gl.useProgram(programForBarScene);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition)
	for(var l = 0; l < Light.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].direction"),Light[l].position );
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].ambient"), Light[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].diffuse"), Light[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].specular"), Light[l].specular);
	}
	mTable.render(programForBarScene);
	gl.useProgram(null);
	gl.bindTexture(gl.TEXTURE_2D,null);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [5.5,-2.7,8.0]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(90.0), [1.0, 0.0, 0.0]);
	//mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(-90.0), [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[2.0,2.0,2.0]);
	gl.useProgram(programForBarScene);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition)
	for(var l = 0; l < Light.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].direction"),Light[l].position );
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].ambient"), Light[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].diffuse"), Light[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].specular"), Light[l].specular);
	}
	mChair.render(programForBarScene);
	gl.useProgram(null);
	gl.bindTexture(gl.TEXTURE_2D,null);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [8.5,-2.7,8.0]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(90.0), [1.0, 0.0, 0.0]);
	//mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(-90.0), [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[2.0,2.0,2.0]);
	gl.useProgram(programForBarScene);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition)
	for(var l = 0; l < Light.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].direction"),Light[l].position );
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].ambient"), Light[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].diffuse"), Light[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].specular"), Light[l].specular);
	}
	mChair.render(programForBarScene);
	gl.useProgram(null);
	gl.bindTexture(gl.TEXTURE_2D,null);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [5.5,-2.7,2.0]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(90.0), [1.0, 0.0, 0.0]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(180.0), [0.0, 0.0, 1.0]);
	mat4.scale(modelMatrix,modelMatrix,[2.0,2.0,2.0]);
	gl.useProgram(programForBarScene);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition)
	for(var l = 0; l < Light.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].direction"),Light[l].position );
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].ambient"), Light[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].diffuse"), Light[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].specular"), Light[l].specular);
	}
	mChair.render(programForBarScene);
	gl.useProgram(null);
	gl.bindTexture(gl.TEXTURE_2D,null);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [8.5,-2.7,2.0]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(90.0), [1.0, 0.0, 0.0]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(180.0), [0.0, 0.0, 1.0]);
	mat4.scale(modelMatrix,modelMatrix,[2.0,2.0,2.0]);
	gl.useProgram(programForBarScene);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition)
	for(var l = 0; l < Light.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].direction"),Light[l].position );
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].ambient"), Light[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].diffuse"), Light[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].specular"), Light[l].specular);
	}
	mChair.render(programForBarScene);
	gl.useProgram(null);
	gl.bindTexture(gl.TEXTURE_2D,null);

	// Draw All Transparent Objects

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [3.0,-2.3,-1.8]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(88.0), [1.0, 0.0, 0.0]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(180.0), [0.0, 0.0, 180.0]);
	//mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(-90.0), [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[4.0,4.0,4.0]);
	gl.useProgram(programForBarScene);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition)
	for(var l = 0; l < Light.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].direction"),Light[l].position );
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].ambient"), Light[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].diffuse"), Light[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].specular"), Light[l].specular);
	}
	mPepsi.render(programForBarScene);
	gl.useProgram(null);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-2.0,-1.3,-0.5]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(90.0), [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[6.0,8.0,6.0]);
	gl.useProgram(programForBarScene);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition)
	for(var l = 0; l < Light.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].direction"),Light[l].position );
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].ambient"), Light[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].diffuse"), Light[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].specular"), Light[l].specular);
	}
	mBottle.render(programForBarScene);
	gl.useProgram(null);

	var y = 1.0;
	for(var i = 0; i < 3 ; i++)
	{
		var x = -1.0;
		for(var j = 0; j < 2; j++)
		{
			mat4.identity(modelMatrix);
			mat4.translate(modelMatrix, modelMatrix, [x,y,-4.0]);
			mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(90.0), [1.0, 0.0, 0.0]);
			mat4.scale(modelMatrix,modelMatrix,[8.0,8.0,8.0]);
			gl.useProgram(programForBarScene);
			gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
			gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
			gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
			gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition)
			for(var l = 0; l < Light.length; l++)
			{
				gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].direction"),Light[l].position );
				gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].ambient"), Light[l].ambient);
				gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].diffuse"), Light[l].diffuse);
				gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].specular"), Light[l].specular);
			}
			mBottle.render(programForBarScene);
			gl.useProgram(null);

			x += 1.5;
		}
		y -= 1.7;
	}

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-6.0,-1.65,10.5]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(90.0), [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[4.0,4.0,4.0]);
	gl.useProgram(programForBarScene);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition)
	for(var l = 0; l < Light.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].direction"),Light[l].position );
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].ambient"), Light[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].diffuse"), Light[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].specular"), Light[l].specular);
	}
	mBottle2.render(programForBarScene);
	gl.useProgram(null);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [7.0,-1.65,5.0]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(90.0), [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[4.0,4.0,4.0]);
	gl.useProgram(programForBarScene);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition)
	for(var l = 0; l < Light.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].direction"),Light[l].position );
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].ambient"), Light[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].diffuse"), Light[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].specular"), Light[l].specular);
	}
	mBottle2.render(programForBarScene);
	gl.useProgram(null);


	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [8.0,-2.3,5.0]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(-90.0), [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[5.0,5.0,5.0]);
	gl.useProgram(programForBarScene);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition)
	for(var l = 0; l < Light.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].direction"),Light[l].position );
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].ambient"), Light[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].diffuse"), Light[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].specular"), Light[l].specular);
	}
	mGlass.render(programForBarScene);
	gl.useProgram(null);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [5.5,-2.3,3.5]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(-90.0), [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[5.0,5.0,5.0]);
	gl.useProgram(programForBarScene);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition)
	for(var l = 0; l < Light.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].direction"),Light[l].position );
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].ambient"), Light[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].diffuse"), Light[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].specular"), Light[l].specular);
	}
	mGlass.render(programForBarScene);
	gl.useProgram(null);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-5.0,-2.3,10.5]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(-90.0), [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[5.0,5.0,5.0]);
	gl.useProgram(programForBarScene);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition)
	for(var l = 0; l < Light.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].direction"),Light[l].position );
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].ambient"), Light[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].diffuse"), Light[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].specular"), Light[l].specular);
	}
	mGlass.render(programForBarScene);
	gl.useProgram(null);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-7.0,-2.3,9.5]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(-90.0), [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[5.0,5.0,5.0]);
	gl.useProgram(programForBarScene);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition)
	for(var l = 0; l < Light.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].direction"),Light[l].position );
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].ambient"), Light[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].diffuse"), Light[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].specular"), Light[l].specular);
	}
	mGlass.render(programForBarScene);
	gl.useProgram(null);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-4.0,-1.85,-1.3]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(-90.0), [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[5.0,5.0,5.0]);
	gl.useProgram(programForBarScene);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition)
	for(var l = 0; l < Light.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].direction"),Light[l].position );
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].ambient"), Light[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].diffuse"), Light[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programForBarScene,"light["+l+"].specular"), Light[l].specular);
	}
	mGlass.render(programForBarScene);
	gl.useProgram(null);


	angle += 0.01;
}

function uninitForBarScene() {
	deleteProgram(programForBarScene);
}
