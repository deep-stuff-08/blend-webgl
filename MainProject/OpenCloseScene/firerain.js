var fireDeep = {
	progFire: null,
	uniforms: {
		resolution: null,
		time: null,
	},
	progTexture: null,
	uniformsTextures: {
		pMat: null,
		vMat: null,
		mMat: null,
		texSam: null,
	},
	debugPositionArray: [],
	speedArray: [],
	fireFbo: null,
	fireTex: null,
	fireRainPosVbo: null,
	pointCount: 1000,
	fireRainVao: null,
	emptyVao: null,
}


function setupProgramForFire() {
	var vertShader = createShader("OpenCloseScene/shaders/fire.vert", gl.VERTEX_SHADER)
	var fragShader = createShader("OpenCloseScene/shaders/fire.frag", gl.FRAGMENT_SHADER)

	fireDeep.progFire = createProgram([vertShader, fragShader])
	
	fireDeep.uniforms.resolution = gl.getUniformLocation(fireDeep.progFire, "resolution")
	fireDeep.uniforms.time = gl.getUniformLocation(fireDeep.progFire, "time")

	vertShader = createShader("OpenCloseScene/shaders/fullscreenquad.vert", gl.VERTEX_SHADER)
	fragShader = createShader("OpenCloseScene/shaders/fullscreenquad.frag", gl.FRAGMENT_SHADER)
	
	fireDeep.progTexture = createProgram([vertShader, fragShader])
	
	fireDeep.uniformsTextures.mMat = gl.getUniformLocation(fireDeep.progTexture, "mMat")
	fireDeep.uniformsTextures.vMat = gl.getUniformLocation(fireDeep.progTexture, "vMat")
	fireDeep.uniformsTextures.pMat = gl.getUniformLocation(fireDeep.progTexture, "pMat")
	fireDeep.uniformsTextures.texSam = gl.getUniformLocation(fireDeep.progTexture, "fireTex")
}

function initForFire() {
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

	for(var i = 0; i < fireDeep.pointCount; i++) {
		fireDeep.debugPositionArray.push([Math.random() * 15.0 - 7.5, 15.0, Math.random() * 15.0 - 7.5])
		fireDeep.speedArray.push(Math.random() * 0.01 + 0.005)
	}

	fireDeep.fireRainVao = gl.createVertexArray()
	gl.bindVertexArray(fireDeep.fireRainVao)
	var vbo = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(circlePos), gl.STATIC_DRAW)
	gl.enableVertexAttribArray(0)
	gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 5 * 4, 0)
	gl.enableVertexAttribArray(1)
	gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 5 * 4, 3 * 4)
	fireDeep.fireRainPosVbo = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, fireDeep.fireRainPosVbo)
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(fireDeep.debugPositionArray.flat()), gl.DYNAMIC_DRAW)
	gl.enableVertexAttribArray(2)
	gl.vertexAttribPointer(2, 3, gl.FLOAT, false, 0, 0)
	gl.vertexAttribDivisor(2, 1)
	gl.bindVertexArray(null)

	fireDeep.emptyVao = gl.createVertexArray()
	gl.bindVertexArray(fireDeep.emptyVao)
	gl.bindVertexArray(null)

	fireDeep.fireFbo = gl.createFramebuffer()
	gl.bindFramebuffer(gl.FRAMEBUFFER, fireDeep.fireFbo)

	fireDeep.fireTex = gl.createTexture()
	gl.bindTexture(gl.TEXTURE_2D, fireDeep.fireTex)
	gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA8, 1024, 1024)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, fireDeep.fireTex, 0)

	gl.drawBuffers([gl.COLOR_ATTACHMENT0])
	gl.bindFramebuffer(gl.FRAMEBUFFER, null)
}

var time = 0.0

function renderFireForDeepFire() {
	gl.useProgram(fireDeep.progFire)
	gl.uniform2f(fireDeep.uniforms.resolution, 1024, 1024)
	gl.uniform1f(fireDeep.uniforms.time, time)

	gl.bindVertexArray(fireDeep.emptyVao)
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
	time += 0.005
}

function renderQuad(perspectiveMatrix, viewMatrix, modelMat, count) {
	gl.useProgram(fireDeep.progTexture)
	gl.bindBuffer(gl.ARRAY_BUFFER, fireDeep.fireRainPosVbo)
	count = Math.min(count, fireDeep.pointCount)
	for(var i = 0; i < count; i++) {
		fireDeep.debugPositionArray[i][1] -= fireDeep.speedArray[i]
		if(fireDeep.debugPositionArray[i][1] < -3.0) {
			fireDeep.debugPositionArray[i][0] = Math.random() * 15.0 - 7.5
			fireDeep.debugPositionArray[i][2] = Math.random() * 15.0 - 7.5
			fireDeep.debugPositionArray[i][1] = 15.0
		}
	}

	gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(fireDeep.debugPositionArray.flat()))
	gl.bindBuffer(gl.ARRAY_BUFFER, null)
	var mMat = mat4.clone(modelMat)
	mat4.scale(mMat, mMat, [0.7 * 0.1, 2.0 * 0.1, 1.0]) 
	gl.uniformMatrix4fv(fireDeep.uniformsTextures.pMat, false, perspectiveMatrix)
	gl.uniformMatrix4fv(fireDeep.uniformsTextures.vMat, false, viewMatrix)
	gl.uniformMatrix4fv(fireDeep.uniformsTextures.mMat, false, mMat)
	gl.bindVertexArray(fireDeep.fireRainVao)
	gl.uniform1i(fireDeep.uniformsTextures.texSam, 0)
	gl.activeTexture(gl.TEXTURE0)
	gl.bindTexture(gl.TEXTURE_2D, fireDeep.fireTex)
	gl.drawArraysInstanced(gl.TRIANGLES, 0, 120, fireDeep.pointCount)
}

function renderForDeepFire(perspectiveMatrix, viewMatrix, modelMat, count) {
	var currentFbo = gl.getParameter(gl.FRAMEBUFFER_BINDING)
	var currentViewport = gl.getParameter(gl.VIEWPORT)

	gl.bindFramebuffer(gl.FRAMEBUFFER, fireDeep.fireFbo)
	gl.viewport(0, 0, 1024, 1024)
	renderFireForDeepFire()

	gl.bindFramebuffer(gl.FRAMEBUFFER, currentFbo)
	gl.viewport(currentViewport[0], currentViewport[1], currentViewport[2], currentViewport[3])
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
	gl.enable(gl.BLEND)
	renderQuad(perspectiveMatrix, viewMatrix, modelMat, count)
	gl.disable(gl.BLEND)
}