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
	ubo: null,
	cube: null,
	fbo: null,
	tex: null,
	rbo: null
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
	oceanDeep.uniforms.samplerTexture = gl.getUniformLocation(oceanDeep.program, "samplerDiffuse")
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

	oceanDeep.fbo = gl.createFramebuffer()
	gl.bindFramebuffer(gl.FRAMEBUFFER, oceanDeep.fbo)

	oceanDeep.tex = gl.createTexture()
	gl.bindTexture(gl.TEXTURE_2D, oceanDeep.tex)
	gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA8, 1024, 1024)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, oceanDeep.tex, 0)

	oceanDeep.rbo = gl.createRenderbuffer()
	gl.bindRenderbuffer(gl.RENDERBUFFER, oceanDeep.rbo)
	gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT32F, 1024, 1024)
	gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, oceanDeep.rbo)

	gl.drawBuffers([gl.COLOR_ATTACHMENT0])

	gl.bindFramebuffer(gl.FRAMEBUFFER, null)
}

var timer = 0.0

function renderForOceanDeep(perspectiveMatrix, viewMatrix, modelMatrix) {
	var localModelMat

	var currentFbo = gl.getParameter(gl.FRAMEBUFFER_BINDING)
	var currentViewport = gl.getParameter(gl.VIEWPORT)

	gl.bindFramebuffer(gl.FRAMEBUFFER, oceanDeep.fbo)
	// gl.bindFramebuffer(gl.FRAMEBUFFER, currentFbo)
	gl.viewport(0, 0, 1024, 1024)

	gl.clearBufferfv(gl.COLOR, 0, [0.0, 1.0, 0.0, 1.0])
	gl.clearBufferfv(gl.DEPTH, 0, [1.0])

	var cameraMatrix = mat4.create()
	var newfront = vec3.create()
	var newCameraPosition = [cameraPosition[0], -cameraPosition[1], cameraPosition[2]]
	vec3.add(newfront, cameraFront, newCameraPosition)
	mat4.lookAt(cameraMatrix, newCameraPosition, newfront, cameraUp)

	localModelMat = mat4.create()
	mat4.translate(localModelMat, modelMatrix, [0.0, 2.0, 0.0])
	gl.useProgram(progPhongLightWithTexture.program)
	gl.uniformMatrix4fv(progPhongLightWithTexture.uniforms.pMat, false, perspectiveMatrix)
	gl.uniformMatrix4fv(progPhongLightWithTexture.uniforms.vMat, false, cameraMatrix)
	gl.uniformMatrix4fv(progPhongLightWithTexture.uniforms.mMat, false, localModelMat)
	gl.uniform1i(progPhongLightWithTexture.uniforms.isBlend, 0)
	gl.uniform1i(progPhongLightWithTexture.uniforms.isTexture, 0)
	gl.uniform1i(progPhongLightWithTexture.uniforms.isInvertNormals, 0)
	gl.uniform1i(progPhongLightWithTexture.uniforms.isLight, 1)
	gl.uniform3f(progPhongLightWithTexture.uniforms.lightPos, 0.0, 0.0, 5.0)
	oceanDeep.cube.render()

	gl.bindFramebuffer(gl.FRAMEBUFFER, currentFbo)
	gl.viewport(currentViewport[0], currentViewport[1], currentViewport[2], currentViewport[3])

	localModelMat = mat4.create()
	mat4.translate(localModelMat, modelMatrix, [0.0, 2.0, 0.0])
	gl.useProgram(progPhongLightWithTexture.program)
	gl.uniformMatrix4fv(progPhongLightWithTexture.uniforms.pMat, false, perspectiveMatrix)
	gl.uniformMatrix4fv(progPhongLightWithTexture.uniforms.vMat, false, viewMatrix)
	gl.uniformMatrix4fv(progPhongLightWithTexture.uniforms.mMat, false, localModelMat)
	gl.uniform1i(progPhongLightWithTexture.uniforms.isBlend, 0)
	gl.uniform1i(progPhongLightWithTexture.uniforms.isTexture, 0)
	gl.uniform1i(progPhongLightWithTexture.uniforms.isInvertNormals, 0)
	gl.uniform1i(progPhongLightWithTexture.uniforms.isLight, 1)
	gl.uniform3f(progPhongLightWithTexture.uniforms.lightPos, 0.0, 0.0, 5.0)
	oceanDeep.cube.render()

	localModelMat = mat4.create()
	mat4.scale(localModelMat, modelMatrix, [5.0, 5.0, 5.0])
	gl.useProgram(oceanDeep.program)
	gl.uniformMatrix4fv(oceanDeep.uniforms.pMat, false, perspectiveMatrix)
	gl.uniformMatrix4fv(oceanDeep.uniforms.vMat, false, viewMatrix)
	gl.uniformMatrix4fv(oceanDeep.uniforms.mMat, false, localModelMat)
	gl.uniform4fv(oceanDeep.uniforms.oceanData, new Float32Array(oceanDeep.oceanSettings.flat()))
	gl.uniform1f(oceanDeep.uniforms.time, timer)
	gl.uniform1i(oceanDeep.uniforms.samplerTexture, 0)
	gl.activeTexture(gl.TEXTURE0)
	gl.bindTexture(gl.TEXTURE_2D, oceanDeep.tex)
	gl.bindVertexArray(oceanDeep.vao)
	gl.bindBufferBase(gl.UNIFORM_BUFFER, 0, oceanDeep.ubo)
	gl.drawArrays(gl.TRIANGLES, 0, oceanDeep.count / 3)
	
	timer += 0.1
}