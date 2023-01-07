var programForDeepFire
var programForDeepFullscreen
var fireRainVao
var debugVao
var woodTextureForDeepFire
var debugProgram
var debugTimeUniform
var debugVao

var mUniform
var vUniform
var pUniform
var resolutionUniform
var timeUniform
var woodTextureUniform
var fboForDeepFire
var texFireForDeepFire
var time = 0.0
var debugPositionArray = []
var speedArray = []
var fireRainPosVbo

function initForDeepFire() {
	var vertShader = createShader("fire.vert", gl.VERTEX_SHADER)
	var fragShader = createShader("fire.frag", gl.FRAGMENT_SHADER)

	programForDeepFire = createProgram([vertShader, fragShader])
	
	resolutionUniform = gl.getUniformLocation(programForDeepFire, "resolution")
	timeUniform = gl.getUniformLocation(programForDeepFire, "time")

	vertShader = createShader("debug.vert", gl.VERTEX_SHADER)
	fragShader = createShader("debug.frag", gl.FRAGMENT_SHADER)

	debugProgram = createProgram([vertShader, fragShader])
	debugTimeUniform = gl.getUniformLocation(debugProgram, "time")

	// deleteShader(vertShader)
	// deleteShader(fragShader)

	vertShader = createShader("fullscreenquad.vert", gl.VERTEX_SHADER)
	fragShader = createShader("fullscreenquad.frag", gl.FRAGMENT_SHADER)
	
	programForDeepFullscreen = createProgram([vertShader, fragShader])
	
	mUniform = gl.getUniformLocation(programForDeepFullscreen, "mMat")
	vUniform = gl.getUniformLocation(programForDeepFullscreen, "vMat")
	pUniform = gl.getUniformLocation(programForDeepFullscreen, "pMat")
	woodTextureUniform = gl.getUniformLocation(programForDeepFullscreen, "woodTex")
	fireTextureUniform = gl.getUniformLocation(programForDeepFullscreen, "fireTex")
	
	// deleteShader(vertShader)
	// deleteShader(fragShader)

	var circlePos = []
	for(var i = 0; i < 40; i++) {
		var theta = 2.0 * Math.PI * (i / 40)
		var theta1 = 2.0 * Math.PI * ((i+1) / 40)
		circlePos.push(Math.cos(theta), Math.sin(theta), 0.0)
		circlePos.push(Math.cos(theta) * 0.5 + 0.5, Math.sin(theta) * 0.5 + 0.5)

		circlePos.push(0.0, 0.0, 0.0)
		circlePos.push(0.5, 0.5)
	
		circlePos.push(Math.cos(theta1), Math.sin(theta1), 0.0)
		circlePos.push(Math.cos(theta1) * 0.5 + 0.5, Math.sin(theta1) * 0.5 + 0.5)
	}

	for(var i = 0; i < 10; i++) {
		debugPositionArray.push([Math.random() * 2.0 - 1.0, 3.0, Math.random() * 2.0 - 1.0])
		speedArray.push(Math.random() * 0.01 + 0.005)
	}
	fireRainVao = gl.createVertexArray()
	gl.bindVertexArray(fireRainVao)
	var vbo = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(circlePos), gl.STATIC_DRAW)
	gl.enableVertexAttribArray(0)
	gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 5 * 4, 0)
	gl.enableVertexAttribArray(1)
	gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 5 * 4, 3 * 4)
	fireRainPosVbo = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, fireRainPosVbo)
	gl.bufferData(gl.ARRAY_BUFFER, 4 * 3 * 10, gl.DYNAMIC_DRAW)
	gl.enableVertexAttribArray(2)
	gl.vertexAttribPointer(2, 3, gl.FLOAT, false, 0, 0)
	gl.vertexAttribDivisor(2, 1)
	gl.bindVertexArray(null)

	fboForDeepFire = gl.createFramebuffer()
	gl.bindFramebuffer(gl.FRAMEBUFFER, fboForDeepFire)

	texFireForDeepFire = gl.createTexture()
	gl.bindTexture(gl.TEXTURE_2D, texFireForDeepFire)
	gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA8, 1024, 1024)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texFireForDeepFire, 0)

	gl.drawBuffers([gl.COLOR_ATTACHMENT0])
	gl.bindFramebuffer(gl.FRAMEBUFFER, null)
}

function renderFireForDeepFire() {
	gl.useProgram(programForDeepFire)
	gl.uniform2f(resolutionUniform, 1024, 1024)
	gl.uniform1f(timeUniform, time)

	gl.bindVertexArray(fireRainVao)
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
	time += 0.005
}

function renderQuad(perspectiveMatrix, viewMatrix) {
	gl.useProgram(programForDeepFullscreen)
	gl.bindBuffer(gl.ARRAY_BUFFER, fireRainPosVbo)
	for(var i = 0; i < 10; i++) {
		debugPositionArray[i][1] -= speedArray[i]
		if(debugPositionArray[i][1] < -3.0) {
			debugPositionArray[i][0] = Math.random() * 1.0 - 0.5
			debugPositionArray[i][2] = Math.random() * 6.0 - 3.0
			debugPositionArray[i][1] = 3.0
		}
	}
	var func = function(a, b) {
		return a[2]-b[2]
	}
	debugPositionArray.sort(func)
	gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(debugPositionArray.flat()))
	var mMat = mat4.create()
	mat4.scale(mMat, mMat, [0.7 * 0.1, 2.0 * 0.1, 1.0]) 
	gl.uniformMatrix4fv(pUniform, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vUniform, false, viewMatrix)
	gl.uniformMatrix4fv(mUniform, false, mMat)
	gl.bindVertexArray(fireRainVao)
	gl.uniform1i(fireTextureUniform, 0)
	gl.activeTexture(gl.TEXTURE0)
	gl.bindTexture(gl.TEXTURE_2D, texFireForDeepFire)
	gl.drawArraysInstanced(gl.TRIANGLES, 0, 120, 10)
}

function renderForDeepFire(perspectiveMatrix, viewMatrix) {
	gl.bindFramebuffer(gl.FRAMEBUFFER, fboForDeepFire)
	gl.viewport(0, 0, 1024, 1024)
	renderFireForDeepFire()

	gl.bindFramebuffer(gl.FRAMEBUFFER, null)
	gl.viewport(0, 0, canvas.width, canvas.height)
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
	gl.enable(gl.BLEND)
	renderQuad(perspectiveMatrix, viewMatrix)
	gl.disable(gl.BLEND)
	// gl.useProgram(debugProgram)
	// gl.bindVertexArray(debugVao)
	// gl.drawArraysInstanced(gl.POINTS, 0, 1, 10)
}

function uninitForDeepFire() {
	gl.deleteVertexArray(vao)
	gl.deleteBuffer(vbo)
	gl.deleteProgram(program)
}