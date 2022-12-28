var programForBedroomScene;
var vaoForDeepCube;
var pMatUniformForSceneTwo;
var vMatUniformForSceneTwo;
var mMatUniformForSceneTwo;
var viewPosUniformForSceneTwo;
var angle = 0.0;

var vaoCube;

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

var Lights = [];

function setupprogramForBedroomScene() {
	var vertShader = createShader('BedroomScene/shaders/demo.vert', gl.VERTEX_SHADER);
	var fragShader = createShader('BedroomScene/shaders/point.frag', gl.FRAGMENT_SHADER);
	programForBedroomScene = createProgram([vertShader, fragShader]);
	deleteShader(vertShader);
	deleteShader(fragShader);
}

function initForBedroomScene() {

	    // data
		const cubeVerts = new Float32Array([
			// top
		   -1.0,  1.0, -1.0,   0.0,  1.0,  0.0,   0.0, 1.0,
		   -1.0,  1.0,  1.0,   0.0,  1.0,  0.0,   0.0, 0.0,
			1.0,  1.0,  1.0,   0.0,  1.0,  0.0,   1.0, 0.0,
			1.0,  1.0, -1.0,   0.0,  1.0,  0.0,   1.0, 1.0,
		
			// front
		   -1.0,  1.0,  1.0,   0.0,  0.0,  1.0,   0.0, 0.0,  
		   -1.0, -1.0,  1.0,   0.0,  0.0,  1.0,   1.0, 0.0,
			1.0, -1.0,  1.0,   0.0,  0.0,  1.0,   1.0, 1.0,
			1.0,  1.0,  1.0,   0.0,  0.0,  1.0,   0.0, 1.0,
		
			// right
			1.0,  1.0,  1.0,   1.0,  0.0,  0.0,   0.0, 0.0,  
			1.0, -1.0,  1.0,   1.0,  0.0,  0.0,   1.0, 0.0,
			1.0, -1.0, -1.0,   1.0,  0.0,  0.0,   1.0, 1.0,
			1.0,  1.0, -1.0,   1.0,  0.0,  0.0,   0.0, 1.0,
		
			// rear
			1.0,  1.0, -1.0,   0.0,  0.0, -1.0,   0.0, 0.0,  
			1.0, -1.0, -1.0,   0.0,  0.0, -1.0,   1.0, 0.0,
		   -1.0, -1.0, -1.0,   0.0,  0.0, -1.0,   1.0, 1.0,
		   -1.0,  1.0, -1.0,   0.0,  0.0, -1.0,   0.0, 1.0,
		
			// left
		   -1.0,  1.0, -1.0,  -1.0,  0.0,  0.0,   0.0, 0.0,  
		   -1.0, -1.0, -1.0,  -1.0,  0.0,  0.0,   1.0, 0.0,
		   -1.0, -1.0,  1.0,  -1.0,  0.0,  0.0,   1.0, 1.0,
		   -1.0,  1.0,  1.0,  -1.0,  0.0,  0.0,   0.0, 1.0,
		
			// bottom
		   -1.0, -1.0, -1.0,   0.0, -1.0,  0.0,   0.0, 0.0,  
			1.0, -1.0, -1.0,   0.0, -1.0,  0.0,   1.0, 0.0,
			1.0, -1.0,  1.0,   0.0, -1.0,  0.0,   1.0, 1.0,
		   -1.0, -1.0,  1.0,   0.0, -1.0,  0.0,   0.0, 1.0
		]);

	vaoCube =  gl.createVertexArray();
    gl.bindVertexArray(vaoCube);
	var vbo = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
	{
		gl.bufferData(gl.ARRAY_BUFFER, cubeVerts, gl.STATIC_DRAW);
		gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 8 * cubeVerts.BYTES_PER_ELEMENT, 0);
		gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 8 * cubeVerts.BYTES_PER_ELEMENT, 3 * cubeVerts.BYTES_PER_ELEMENT);
		gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 8 * cubeVerts.BYTES_PER_ELEMENT, 5 * cubeVerts.BYTES_PER_ELEMENT);
		gl.enableVertexAttribArray(0);
		gl.enableVertexAttribArray(1);
		gl.enableVertexAttribArray(2);
	}
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

	// Light Setups
	Lights.push(
		{	
			position : [-2.5,2.4,-6.5],
			ambient : [0.5,0.5,0.5],
			diffuse : [1.0,1.0,1.0],
			specular : [1.0,1.0,1.0]
		});

		Lights.push(
			{	
				position : [0.0,4.0,6.5],
				ambient : [0.1,0.1,0.1],
				diffuse : [1.0,1.0,1.0],
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

	for(var l  = 0; l < Lights.length; l++)
		renderLightSourceDeep(perspectiveMatrix, viewMatrix, Lights[l].position, Lights[l].diffuse);

	// back
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [0.0,-1.0,-7.0]);
	//mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(90.0), [0.0, 1.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[7.0,4.0,5.0]);
	gl.useProgram(programForBedroomScene);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition)
	for(var l = 0; l < Lights.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light["+l+"].direction"),Lights[l].position );
		gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light["+l+"].ambient"), Lights[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light["+l+"].diffuse"), Lights[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light["+l+"].specular"), Lights[l].specular);
	}
	mPlane.render(programForBedroomScene);
	gl.useProgram(null);

	//front
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [0.0,-1.0,7.0]);
	mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(-180.0), [0.0, 1.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[7.0,4.0,5.0]);
	gl.useProgram(programForBedroomScene);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition)
	for(var l = 0; l < Lights.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light["+l+"].direction"),Lights[l].position );
		gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light["+l+"].ambient"), Lights[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light["+l+"].diffuse"), Lights[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light["+l+"].specular"), Lights[l].specular);
	}
	mPlane.render(programForBedroomScene);
	gl.useProgram(null);

	// right
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [7.0,-1.0,0.0]);
	mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(-90.0), [0.0, 1.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[7.0,4.0,5.0]);
	gl.useProgram(programForBedroomScene);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition);
	for(var l = 0; l < Lights.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light["+l+"].direction"),Lights[l].position );
		gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light["+l+"].ambient"), Lights[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light["+l+"].diffuse"), Lights[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light["+l+"].specular"), Lights[l].specular);
	}
	mPlane.render(programForBedroomScene);
	gl.useProgram(null);

	// left
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-7.0,-1.0,0.0]);
	mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(90.0), [0.0, 1.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[7.0,4.0,5.0]);
	gl.useProgram(programForBedroomScene);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition)
	for(var l = 0; l < Lights.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light["+l+"].direction"),Lights[l].position );
		gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light["+l+"].ambient"), Lights[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light["+l+"].diffuse"), Lights[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light["+l+"].specular"), Lights[l].specular);
	}
	mPlane.render(programForBedroomScene);
	gl.useProgram(null);

	// bottom
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [0.0,-5.0,0.0]);
	mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(-90.0), [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[7.0,7.0,5.0]);
	gl.useProgram(programForBedroomScene);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition)
	for(var l = 0; l < Lights.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light["+l+"].direction"),Lights[l].position );
		gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light["+l+"].ambient"), Lights[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light["+l+"].diffuse"), Lights[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light["+l+"].specular"), Lights[l].specular);
	}
	mPlane.render(programForBedroomScene);
	gl.useProgram(null);

	//top
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [0.0,3.0,0.0]);
	mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(90.0), [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[7.0,7.0,5.0]);
	gl.useProgram(programForBedroomScene);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	for(var l = 0; l < Lights.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light["+l+"].direction"),Lights[l].position );
		gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light["+l+"].ambient"), Lights[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light["+l+"].diffuse"), Lights[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light["+l+"].specular"), Lights[l].specular);
	}
	mPlane.render(programForBedroomScene);
	gl.useProgram(null);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-4.0,0.0,-7.6]);
	mat4.rotate(modelMatrix, modelMatrix,glMatrix.toRadian(-90), [1.0, 0.0, 0.0]);
	mat4.rotate(modelMatrix, modelMatrix,glMatrix.toRadian(-90), [0.0, 0.0, 1.0]);
	mat4.scale(modelMatrix,modelMatrix,[0.3,0.3,0.3]);
	gl.useProgram(programForBedroomScene);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition)
	for(var l = 0; l < Lights.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light["+l+"].direction"),Lights[l].position );
		gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light["+l+"].ambient"), Lights[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light["+l+"].diffuse"), Lights[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light["+l+"].specular"), Lights[l].specular);
	}
	mLight.render(programForBedroomScene);
	gl.useProgram(null);

	gl.enable(gl.CULL_FACE);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [3.0,-3.6,-5.5]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(90.0), [1.0, 0.0, 0.0]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(-90.0), [0.0, 0.0, 1.0]);
	mat4.scale(modelMatrix,modelMatrix,[0.1,0.1,0.1]);
	gl.useProgram(programForBedroomScene);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition)
	for(var l = 0; l < Lights.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light["+l+"].direction"),Lights[l].position );
		gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light["+l+"].ambient"), Lights[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light["+l+"].diffuse"), Lights[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light["+l+"].specular"), Lights[l].specular);
	}
	mcab1.render(programForBedroomScene);
	gl.useProgram(null);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [6.5,-1.5,-5.5]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(90.0), [0.0, 1.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[0.1,0.1,0.05]);
	gl.useProgram(programForBedroomScene);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition)
	for(var l = 0; l < Lights.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light["+l+"].direction"),Lights[l].position );
		gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light["+l+"].ambient"), Lights[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light["+l+"].diffuse"), Lights[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light["+l+"].specular"), Lights[l].specular);
	}
	mcab2.render(programForBedroomScene);
	gl.useProgram(null);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-10.5,-3.2,-3.3]);
	//mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(90.0), [1.0, 0.0, 0.0]);
	//mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(-90.0), [0.0, 0.0, 1.0]);
	mat4.scale(modelMatrix,modelMatrix,[4.0,3.0,3.0]);
	gl.useProgram(programForBedroomScene);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition)
	for(var l = 0; l < Lights.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light["+l+"].direction"),Lights[l].position );
		gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light["+l+"].ambient"), Lights[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light["+l+"].diffuse"), Lights[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light["+l+"].specular"), Lights[l].specular);
	}
	mBed.render(programForBedroomScene);
	gl.useProgram(null);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [0.0,2.4,0.0]);
	mat4.rotate(modelMatrix, modelMatrix, angle, [0.0, 1.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[0.3,0.3,0.3]);
	gl.useProgram(programForBedroomScene);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition)
	for(var l = 0; l < Lights.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light["+l+"].direction"),Lights[l].position );
		gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light["+l+"].ambient"), Lights[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light["+l+"].diffuse"), Lights[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light["+l+"].specular"), Lights[l].specular);
	}
	mFan.render(programForBedroomScene);
	gl.useProgram(null);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-8.0,2.3,8.0]);
	mat4.rotate(modelMatrix, modelMatrix,glMatrix.toRadian(-90), [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[0.25,0.25,0.25]);
	gl.useProgram(programForBedroomScene);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition)
	for(var l = 0; l < Lights.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light["+l+"].direction"),Lights[l].position );
		gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light["+l+"].ambient"), Lights[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light["+l+"].diffuse"), Lights[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light["+l+"].specular"), Lights[l].specular);
	}
	mDoor.render(programForBedroomScene);
	gl.useProgram(null);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [3.0,-4.95,-3.0]);
	//mat4.rotate(modelMatrix, modelMatrix,glMatrix.toRadian(-90), [1.0, 0.0, 0.0]);
	//mat4.rotate(modelMatrix, modelMatrix,glMatrix.toRadian(-90), [0.0, 0.0, 1.0]);
	mat4.scale(modelMatrix,modelMatrix,[0.2,0.2,0.2]);
	gl.useProgram(programForBedroomScene);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition)
	for(var l = 0; l < Lights.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light["+l+"].direction"),Lights[l].position );
		gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light["+l+"].ambient"), Lights[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light["+l+"].diffuse"), Lights[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light["+l+"].specular"), Lights[l].specular);
	}
	mRing.render(programForBedroomScene);
	gl.useProgram(null);

	// Draw Amols Cupboard
	{
	ctm = mat4.create();
	mat4.translate(ctm,ctm,[-2.0,-3.8,8.0]);
	mat4.scale(ctm, ctm, [1.5, 1.5, 1.0]);
	mat4.identity(modelMatrix);
	mat4.copy(modelMatrix,ctm);
	mat4.translate(modelMatrix, modelMatrix, [0.0, 1.0, -1.0]);
	mat4.scale(modelMatrix, modelMatrix, [2.0, 2.0, 0.1]);

	gl.useProgram(programForBedroomScene);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition)
	gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"material.diffuseMat"),[0.234551,0.111932,0.05448]);
	gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"material.specularMat"),[1.0,1.0,1.0]);
	gl.uniform1f(gl.getUniformLocation(programForBedroomScene,"material.shininess"),32);
	gl.uniform1f(gl.getUniformLocation(programForBedroomScene,"material.opacity"),1.0);
	for(var l = 0; l < Lights.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light["+l+"].direction"),Lights[l].position );
		gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light["+l+"].ambient"), Lights[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light["+l+"].diffuse"), Lights[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light["+l+"].specular"), Lights[l].specular);
	}
	gl.bindVertexArray(vaoCube);
		gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
		gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
		gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
		gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);
		gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);
		gl.drawArrays(gl.TRIANGLE_FAN, 20, 4);
	gl.bindVertexArray(null);

	// cupboard top
	mat4.copy(modelMatrix, ctm);
	mat4.translate(modelMatrix, modelMatrix, [0.0, 3.0, -2.0]);
	mat4.scale(modelMatrix, modelMatrix, [2.0, 0.05, 1.0]);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)

	gl.bindVertexArray(vaoCube);
		gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
		gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
		gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
		gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);
		gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);
		gl.drawArrays(gl.TRIANGLE_FAN, 20, 4);
	gl.bindVertexArray(null);

	// cupboard bottom
	mat4.copy(modelMatrix, ctm);
	mat4.translate(modelMatrix, modelMatrix, [0.0, -1.0, -2.0]);
	mat4.scale(modelMatrix, modelMatrix, [2.0, 0.05, 1.0]);
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)

	gl.bindVertexArray(vaoCube);
		gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
		gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
		gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
		gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);
		gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);
		gl.drawArrays(gl.TRIANGLE_FAN, 20, 4);
	gl.bindVertexArray(null);
	
	// transformations cupboard left
	mat4.copy(modelMatrix, ctm);
	mat4.translate(modelMatrix, modelMatrix, [-1.9, 1.0, -2.0]);
	mat4.scale(modelMatrix, modelMatrix, [0.05, 2.0, 1.0]);
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	// draw front-left table leg
	gl.bindVertexArray(vaoCube);
		gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
		gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
		gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
		gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);
		gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);
	gl.bindVertexArray(null);
	
	// transformations cupboard right
	mat4.copy(modelMatrix, ctm);
	mat4.translate(modelMatrix, modelMatrix, [1.9, 1.0, -2.0]);
	mat4.scale(modelMatrix, modelMatrix, [0.05, 2.0, 1.0]);
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	// draw front-left table leg
	gl.bindVertexArray(vaoCube);
		gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
		gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
		gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
		gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);
		gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);
	gl.bindVertexArray(null);

	 // cupboard middle
	mat4.copy(modelMatrix, ctm);
	mat4.translate(modelMatrix, modelMatrix, [0.0, 0.5, -2.0]);
	mat4.scale(modelMatrix, modelMatrix, [1.9, 0.05, 1.0]);
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.bindVertexArray(vaoCube);
		gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
		gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
		gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
		gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);
		gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);
		gl.drawArrays(gl.TRIANGLE_FAN, 20, 4);
	gl.bindVertexArray(null);

	// cupboard middle
	mat4.copy(modelMatrix, ctm);
	mat4.translate(modelMatrix, modelMatrix, [0.0, -0.5, -2.0]);
	mat4.scale(modelMatrix, modelMatrix, [1.9, 0.05, 1.0]);
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.bindVertexArray(vaoCube);
		gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
		gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
		gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
		gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);
		gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);
		gl.drawArrays(gl.TRIANGLE_FAN, 20, 4);
	gl.bindVertexArray(null);

	gl.useProgram(null);
	}

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [3.0,-2.05,-6.0]);
	mat4.rotate(modelMatrix, modelMatrix,glMatrix.toRadian(90), [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[4.0,4.0,4.0]);
	gl.useProgram(programForBedroomScene);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition)
	for(var l = 0; l < Lights.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light["+l+"].direction"),Lights[l].position );
		gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light["+l+"].ambient"), Lights[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light["+l+"].diffuse"), Lights[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light["+l+"].specular"), Lights[l].specular);
	}
	mBottle2.render(programForBedroomScene);
	gl.useProgram(null);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [2.5,-2.65,-7.0]);
	mat4.rotate(modelMatrix, modelMatrix,glMatrix.toRadian(-90), [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[5.0,5.0,5.0]);
	gl.useProgram(programForBedroomScene);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition)
	for(var l = 0; l < Lights.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light["+l+"].direction"),Lights[l].position );
		gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light["+l+"].ambient"), Lights[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light["+l+"].diffuse"), Lights[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programForBedroomScene,"light["+l+"].specular"), Lights[l].specular);
	}
	mGlass.render(programForBedroomScene);
	gl.useProgram(null);

	angle += 0.01;
}

function uninitForBedroomScene() {
	deleteProgram(programForBedroomScene);
}
