var oceanDeep = {
	program: null,
	uniforms: {
		pMat: null,
		vMat: null,
		mMat: null,
		oceanData: null,
		time: null,
		samplerTexture: null
	},
	vao: null,
	count: null,
	oceanSettings: null,
	ubo: null
}

function setupProgramForOceanDeep() {
	var vertShader = createShader('shaders/ocean.vert', gl.VERTEX_SHADER)
	var fragShader = createShader('shaders/ocean.frag', gl.FRAGMENT_SHADER)
	oceanDeep.program = createProgram([vertShader, fragShader])
	deleteShader(vertShader)
	deleteShader(fragShader)
	oceanDeep.uniforms.pMat = gl.getUniformLocation(oceanDeep.program, "pMat")
	oceanDeep.uniforms.vMat = gl.getUniformLocation(oceanDeep.program, "vMat")
	oceanDeep.uniforms.mMat = gl.getUniformLocation(oceanDeep.program, "mMat")
	oceanDeep.uniforms.oceanData = gl.getUniformLocation(oceanDeep.program, "oceanData")
	oceanDeep.uniforms.time = gl.getUniformLocation(oceanDeep.program, "time")
}

function initForOceanDeep() {
	cameraPosition = [0.0, 2.0, 5.0]

	const numCols = 20
	const numRows = 20
	oceanDeep.vao = gl.createVertexArray()
	var vbo = gl.createBuffer()
	oceanDeep.ubo = gl.createBuffer()

	var oceanArray = []

	for(var i = 0; i < numCols; i++) {
		var x = (i / numCols) * 2.0 - 1.0
		var x_1 = ((i + 1) / numCols) * 2.0 - 1.0
		for(var j = 0; j < numRows; j++) {
			var y = (j / numRows) * 2.0 - 1.0
			var y_1 = ((j + 1) / numRows) * 2.0 - 1.0
			oceanArray.push(x);oceanArray.push(0.0);oceanArray.push(y)
			oceanArray.push(x_1);oceanArray.push(0.0);oceanArray.push(y)
			oceanArray.push(x_1);oceanArray.push(0.0);oceanArray.push(y_1)

			oceanArray.push(x_1);oceanArray.push(0.0);oceanArray.push(y_1)
			oceanArray.push(x);oceanArray.push(0.0);oceanArray.push(y_1)
			oceanArray.push(x);oceanArray.push(0.0);oceanArray.push(y)
		}
	}
	oceanDeep.count = oceanArray.length
	
	gl.bindVertexArray(oceanDeep.vao)
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(oceanArray), gl.STATIC_DRAW)
	gl.enableVertexAttribArray(0)
	gl.vertexAttribPointer(0, 3, gl.FLOAT, gl.FALSE, 0, 0)

	oceanDeep.oceanSettings = []
	oceanDeep.oceanSettings.push([0.3, 1.0, 1.0, 0.5])
	oceanDeep.oceanSettings.push([0.4, 1.0, 0.0, 0.7])
	oceanDeep.oceanSettings.push([0.1, 1.0, -1.0, 0.2])
	oceanDeep.oceanSettings.push([0.3, -1.0, 1.0, 1.1])
	oceanDeep.oceanSettings.push([0.2, 1.0, 1.0, 0.6])
	oceanDeep.oceanSettings.push([0.6, 0.0, 1.0, 0.7])
	oceanDeep.oceanSettings.push([0.7, 1.0, 0.0, 1.1])
	oceanDeep.oceanSettings.push([0.1, -1.0, 1.0, 0.67])
	oceanDeep.oceanSettings.push([0.3, -1.0, 0.0, 0.45])
	oceanDeep.oceanSettings.push([0.4, 1.0, 1.0, 0.6])

	oceanDeep.cube = dshapes.initCube()

	cameraPosition = [0.0, 2.0, 10.0]
}

var timer = 0.0

function renderForOceanDeep(perspectiveMatrix, viewMatrix, modelMatrix) {
	var localModelMat

	var cameraMatrix = mat4.create()
	var newfront = vec3.create()
	var newCameraPosition = [cameraPosition[0], -cameraPosition[1], cameraPosition[2]]
	vec3.add(newfront, cameraFront, newCameraPosition)
	mat4.lookAt(cameraMatrix, newCameraPosition, newfront, cameraUp)

	localModelMat = mat4.create()
	mat4.scale(localModelMat, modelMatrix, [5.0, 5.0, 5.0])
	gl.useProgram(oceanDeep.program)
	gl.uniformMatrix4fv(oceanDeep.uniforms.pMat, false, perspectiveMatrix)
	gl.uniformMatrix4fv(oceanDeep.uniforms.vMat, false, viewMatrix)
	gl.uniformMatrix4fv(oceanDeep.uniforms.mMat, false, localModelMat)
	gl.uniform4fv(oceanDeep.uniforms.oceanData, new Float32Array(oceanDeep.oceanSettings.flat()))
	gl.uniform1f(oceanDeep.uniforms.time, timer)
	gl.activeTexture(gl.TEXTURE0)
	gl.bindTexture(gl.TEXTURE_2D, oceanDeep.tex)
	gl.bindVertexArray(oceanDeep.vao)
	gl.bindBufferBase(gl.UNIFORM_BUFFER, 0, oceanDeep.ubo)
	gl.drawArrays(gl.TRIANGLES, 0, oceanDeep.count / 3)
	
	timer += 0.1
}