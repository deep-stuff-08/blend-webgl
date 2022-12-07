var programForDeepCube;
var vaoForDeepCube;
var pMatUnifromForDeepCube;
var vMatUnifromForDeepCube;
var mMatUnifromForDeepCube;
var viewPosUnifromForDeepCube;
var diffuseUnifromForDeepCube;
var diffuseTextureForDeepCube;
var angle = 0.0

function setupProgramForDeepCube() {
	var vertShader = createShader('shaders/phonglight.vert', gl.VERTEX_SHADER);
	var fragShader = createShader('shaders/phonglight.frag', gl.FRAGMENT_SHADER);
	programForDeepCube = createProgram([vertShader, fragShader]);
	deleteShader(vertShader);
	deleteShader(fragShader);
}

function initForDeepCube() {
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
	gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 4 * 13, 4 * 4)
	gl.enableVertexAttribArray(1)
	gl.vertexAttribPointer(2, 3, gl.FLOAT, false, 4 * 13, 4 * 8)
	gl.enableVertexAttribArray(2)
	gl.vertexAttribPointer(3, 2, gl.FLOAT, false, 4 * 13, 4 * 11)
	gl.enableVertexAttribArray(3)
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	gl.bindVertexArray(null);

	diffuseTextureForDeepCube = loadTexture("resources/textures/marble.png")

	pMatUnifromForDeepCube = gl.getUniformLocation(programForDeepCube, "pMat")
	vMatUnifromForDeepCube = gl.getUniformLocation(programForDeepCube, "vMat")
	mMatUnifromForDeepCube = gl.getUniformLocation(programForDeepCube, "mMat")
	viewPosUnifromForDeepCube = gl.getUniformLocation(programForDeepCube, "viewPos")
	diffuseUnifromForDeepCube = gl.getUniformLocation(programForDeepCube, "diffuse")
}

function renderForDeepCube(perspectiveMatrix, viewMatrix) {
	var modelMatrix = mat4.create()
	mat4.rotate(modelMatrix, modelMatrix, angle, [1.0, 1.0, 1.0])
	
	gl.useProgram(programForDeepCube);
	gl.bindVertexArray(vao);
	gl.uniformMatrix4fv(pMatUnifromForDeepCube, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUnifromForDeepCube, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUnifromForDeepCube, false, modelMatrix)
	gl.uniform3fv(viewPosUnifromForDeepCube, cameraPosition)
	gl.uniform1i(diffuseUnifromForDeepCube, 0)
	gl.activeTexture(gl.TEXTURE0)
	gl.bindTexture(gl.TEXTURE_2D, diffuseTextureForDeepCube)
	gl.drawArrays(gl.TRIANGLES, 0, 36);

	angle += 0.01
}

function uninitForDeepCube() {
	deleteProgram(programForDeepCube);
}
