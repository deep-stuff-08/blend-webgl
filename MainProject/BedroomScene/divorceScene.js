var programForBedroomScene;
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
var mBottle2;
var mGlass;
var mBed;
var mRing;

var Light = [];

function setupprogramForBedroomScene() {
	var vertShader = createShader('BedroomScene/shaders/demo.vert', gl.VERTEX_SHADER);
	var fragShader = createShader('BedroomScene/shaders/point.frag', gl.FRAGMENT_SHADER);
	programForBedroomScene = createProgram([vertShader, fragShader]);
	deleteShader(vertShader);
	deleteShader(fragShader);
}

function initForBedroomScene() {
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

	pMatUniformForSceneTwo = gl.getUniformLocation(programForBedroomScene, "pMat")
	vMatUniformForSceneTwo = gl.getUniformLocation(programForBedroomScene, "vMat")
	mMatUniformForSceneTwo = gl.getUniformLocation(programForBedroomScene, "mMat")
	viewPosUniformForSceneTwo = gl.getUniformLocation(programForBedroomScene, "viewPos")
	//diffuseUnifromForDeepCube = gl.getUniformLocation(programForBedroomScene, "diffuse")

	var v = [[1.0, 1.0, 0.0,-1.0, 1.0, 0.0,-1.0, -1.0, 0.0,-1.0,-1.0, 0.0, 1.0, -1.0, 0.0, 1.0, 1.0, 0.0],[0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0],[1.0, 1.0, 0.0, 1.0,0.0, 0.0, 0.0, 0.0,	1.0, 0.0,1.0, 1.0,]];
	mPlane = new mesh(v,null,null);
	mPlane.setMaterial(new material());
	console.log(mPlane);

	mcab1 = new Model('BedroomScene/resources/cab1.json');
	mcab2 = new Model('BedroomScene/resources/cab2.json');
	mLight = new Model('BedroomScene/resources/light.json');
	mDoor = new Model('BedroomScene/resources/door.json');
	mFan = new Model('BedroomScene/resources/fan.json');
	mBed = new Model('BedroomScene/resources/bed.json');
	mBottle2 = new Model('BedroomScene/resources/bottle2.json');
	mGlass = new Model('BedroomScene/resources/glass.json');
	mRing = new Model('BedroomScene/resources/ring.json');

	Light.push(
	{	
		position : [-1.0,-1.0,-1.0],
		ambient : [0.2,0.2,0.2],
		diffuse : [1.0,1.0,1.0],
		specular : [1.0,1.0,1.0]
	});

	Light.push(
		{	
			position : [8.5,-10.0,-13.0],
			ambient : [0.2,0.2,0.2],
			diffuse : [0.0,0.0,1.0],
			specular : [1.0,1.0,1.0]
		});

	//console.log(Light);

}

function renderForBedroomScene(time , perspectiveMatrix, viewMatrix) {
	// Draw All Opaue Objects

	var modelMatrix = mat4.create();
	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
	gl.disable(gl.CULL_FACE);
	// back
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [0.0,0.0,-7.0]);
	//mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(90.0), [0.0, 1.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[5.0,5.0,5.0]);
	gl.useProgram(programForBedroomScene);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition)
	gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light.direction"), [-3.0,3.5,-4.0]);
	gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light.ambient"), [0.2,0.2,0.2]);
	gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light.diffuse"), [1.0,1.0,1.0]);
	gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light.specular"), [1.0,1.0,1.0]);
	mPlane.render(programForBedroomScene);
	gl.useProgram(null);

	//front
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [0.0,0.0,7.0]);
	mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(-180.0), [0.0, 1.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[5.0,5.0,5.0]);
	gl.useProgram(programForBedroomScene);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition)
	gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light.direction"), [-3.0,3.5,-4.0]);
	gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light.ambient"), [0.2,0.2,0.2]);
	gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light.diffuse"), [1.0,1.0,1.0]);
	gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light.specular"), [1.0,1.0,1.0]);
	mPlane.render(programForBedroomScene);
	gl.useProgram(null);

	// right
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [5.0,0.0,0.0]);
	mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(-90.0), [0.0, 1.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[7.0,5.0,5.0]);
	gl.useProgram(programForBedroomScene);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition);
	gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light.direction"), [-3.0,3.5,-4.0]);
	gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light.ambient"), [0.2,0.2,0.2]);
	gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light.diffuse"), [1.0,1.0,1.0]);
	gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light.specular"), [1.0,1.0,1.0]);
	mPlane.render(programForBedroomScene);
	gl.useProgram(null);

	// left
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-5.0,0.0,0.0]);
	mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(90.0), [0.0, 1.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[7.0,5.0,5.0]);
	gl.useProgram(programForBedroomScene);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition)
	gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light.direction"), [-3.0,3.5,-4.0]);
	gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light.ambient"), [0.2,0.2,0.2]);
	gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light.diffuse"), [1.0,1.0,1.0]);
	gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light.specular"), [1.0,1.0,1.0]);
	mPlane.render(programForBedroomScene);
	gl.useProgram(null);

	// bottom
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [0.0,-5.0,0.0]);
	mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(-90.0), [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[5.0,7.0,5.0]);
	gl.useProgram(programForBedroomScene);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition)
	gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light.direction"), [-3.0,3.5,-4.0]);
	gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light.ambient"), [0.2,0.2,0.2]);
	gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light.diffuse"), [1.0,1.0,1.0]);
	gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light.specular"), [1.0,1.0,1.0]);
	mPlane.render(programForBedroomScene);
	gl.useProgram(null);

	//top
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [0.0,5.0,0.0]);
	mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(90.0), [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[5.0,7.0,5.0]);
	gl.useProgram(programForBedroomScene);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light.direction"), [-3.0,3.5,-4.0]);
	gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light.ambient"), [0.2,0.2,0.2]);
	gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light.diffuse"), [1.0,1.0,1.0]);
	gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light.specular"), [1.0,1.0,1.0]);
	mPlane.render(programForBedroomScene);
	gl.useProgram(null);


	gl.enable(gl.CULL_FACE);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [4.0,-3.6,-5.5]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(90.0), [1.0, 0.0, 0.0]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(-90.0), [0.0, 0.0, 1.0]);
	mat4.scale(modelMatrix,modelMatrix,[0.1,0.1,0.1]);
	gl.useProgram(programForBedroomScene);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition)
	gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light.direction"), [-3.0,3.5,-4.0]);
	gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light.ambient"), [0.2,0.2,0.2]);
	gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light.diffuse"), [1.0,1.0,1.0]);
	gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light.specular"), [1.0,1.0,1.0]);
	mcab1.render(programForBedroomScene);
	gl.useProgram(null);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-3.0,-1.5,6.5]);
	//mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(90.0), [1.0, 0.0, 0.0]);
	//mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(-90.0), [0.0, 0.0, 1.0]);
	mat4.scale(modelMatrix,modelMatrix,[0.15,0.1,0.05]);
	gl.useProgram(programForBedroomScene);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition)
	gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light.direction"), [-3.0,3.5,-4.0]);
	gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light.ambient"), [0.2,0.2,0.2]);
	gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light.diffuse"), [1.0,1.0,1.0]);
	gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light.specular"), [1.0,1.0,1.0]);
	mcab2.render(programForBedroomScene);
	gl.useProgram(null);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-7.5,-3.2,-3.3]);
	//mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(90.0), [1.0, 0.0, 0.0]);
	//mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(-90.0), [0.0, 0.0, 1.0]);
	mat4.scale(modelMatrix,modelMatrix,[3.0,3.0,3.0]);
	gl.useProgram(programForBedroomScene);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition)
	gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light.direction"), [-3.0,3.5,-4.0]);
	gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light.ambient"), [0.2,0.2,0.2]);
	gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light.diffuse"), [1.0,1.0,1.0]);
	gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light.specular"), [1.0,1.0,1.0]);
	mBed.render(programForBedroomScene);
	gl.useProgram(null);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [0.0,4.3,0.0]);
	mat4.rotate(modelMatrix, modelMatrix, angle, [0.0, 1.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[0.3,0.3,0.3]);
	gl.useProgram(programForBedroomScene);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition)
	gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light.direction"), [-3.0,3.5,-4.0]);
	gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light.ambient"), [0.2,0.2,0.2]);
	gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light.diffuse"), [1.0,1.0,1.0]);
	gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light.specular"), [1.0,1.0,1.0]);
	mFan.render(programForBedroomScene);
	gl.useProgram(null);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-7.0,1.0,7.9]);
	mat4.rotate(modelMatrix, modelMatrix,glMatrix.toRadian(-90), [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[0.2,0.2,0.2]);
	gl.useProgram(programForBedroomScene);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition)
	gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light.direction"), [-3.0,3.5,-4.0]);
	gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light.ambient"), [0.2,0.2,0.2]);
	gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light.diffuse"), [1.0,1.0,1.0]);
	gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light.specular"), [1.0,1.0,1.0]);
	mDoor.render(programForBedroomScene);
	gl.useProgram(null);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-4.0,1.5,-7.6]);
	mat4.rotate(modelMatrix, modelMatrix,glMatrix.toRadian(-90), [1.0, 0.0, 0.0]);
	mat4.rotate(modelMatrix, modelMatrix,glMatrix.toRadian(-90), [0.0, 0.0, 1.0]);
	mat4.scale(modelMatrix,modelMatrix,[0.3,0.3,0.3]);
	gl.useProgram(programForBedroomScene);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition)
	gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light.direction"), [-3.0,3.5,-4.0]);
	gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light.ambient"), [0.2,0.2,0.2]);
	gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light.diffuse"), [1.0,1.0,1.0]);
	gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light.specular"), [1.0,1.0,1.0]);
	mLight.render(programForBedroomScene);
	gl.useProgram(null);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [4.0,-2.05,-6.0]);
	mat4.rotate(modelMatrix, modelMatrix,glMatrix.toRadian(90), [1.0, 0.0, 0.0]);
	//mat4.rotate(modelMatrix, modelMatrix,glMatrix.toRadian(-90), [0.0, 0.0, 1.0]);
	mat4.scale(modelMatrix,modelMatrix,[4.0,4.0,4.0]);
	gl.useProgram(programForBedroomScene);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition)
	gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light.direction"), [-3.0,3.5,-4.0]);
	gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light.ambient"), [0.2,0.2,0.2]);
	gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light.diffuse"), [1.0,1.0,1.0]);
	gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light.specular"), [1.0,1.0,1.0]);
	mBottle2.render(programForBedroomScene);
	gl.useProgram(null);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [3.5,-2.65,-7.0]);
	mat4.rotate(modelMatrix, modelMatrix,glMatrix.toRadian(-90), [1.0, 0.0, 0.0]);
	//mat4.rotate(modelMatrix, modelMatrix,glMatrix.toRadian(-90), [0.0, 0.0, 1.0]);
	mat4.scale(modelMatrix,modelMatrix,[5.0,5.0,5.0]);
	gl.useProgram(programForBedroomScene);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition)
	gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light.direction"), [-3.0,3.5,-4.0]);
	gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light.ambient"), [0.2,0.2,0.2]);
	gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light.diffuse"), [1.0,1.0,1.0]);
	gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light.specular"), [1.0,1.0,1.0]);
	mGlass.render(programForBedroomScene);
	gl.useProgram(null);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [3.0,-4.95,-3.0]);
	//mat4.rotate(modelMatrix, modelMatrix,glMatrix.toRadian(-90), [1.0, 0.0, 0.0]);
	//mat4.rotate(modelMatrix, modelMatrix,glMatrix.toRadian(-90), [0.0, 0.0, 1.0]);
	mat4.scale(modelMatrix,modelMatrix,[0.1,0.1,0.1]);
	gl.useProgram(programForBedroomScene);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition)
	gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light.direction"), [-3.0,3.5,-4.0]);
	gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light.ambient"), [0.2,0.2,0.2]);
	gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light.diffuse"), [1.0,1.0,1.0]);
	gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light.specular"), [1.0,1.0,1.0]);
	mRing.render(programForBedroomScene);
	gl.useProgram(null);

	// light src test
	/*
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [8.5,10.0,13.0]);
	//mat4.rotate(modeslMatrix, modelMatrix, 90.0, [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[0.5,0.5,0.5]);
	gl.useProgram(programForBedroomScene);
	gl.bindVertexArray(vao);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition)
	for(var l = 0; l < Light.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light["+l+"].direction"),Light[l].position );
		gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light["+l+"].ambient"), Light[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light["+l+"].diffuse"), Light[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light["+l+"].specular"), Light[l].specular);
	}

	gl.drawArrays(gl.TRIANGLES, 0, 36);
	gl.bindVertexArray(null);
	gl.useProgram(null);
	*/

	angle += 0.01;
}

function uninitForBedroomScene() {
	deleteProgram(programForBedroomScene);
}
