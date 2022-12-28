var explosionDeep = {
	progExplosion: null,
	uniformsExplosion: {
		pMat: null,
		vMat: null,
		mMat: null,
		diffuseTextureSampler: null,
		time: null
	},
	objQuad: null,
	texCon: null,
	vaoExplosionPoints: null,
	countExplosionPoints: null
}

function setupProgramForExplosionDeep() {
	var vertShader = createShader('explosion.vert', gl.VERTEX_SHADER)
	var fragShader = createShader('explosion.frag', gl.FRAGMENT_SHADER)
	explosionDeep.progExplosion = createProgram([vertShader, fragShader])
	deleteShader(vertShader)
	deleteShader(fragShader)

	explosionDeep.uniformsExplosion.pMat = gl.getUniformLocation(explosionDeep.progExplosion, "pMat")
	explosionDeep.uniformsExplosion.vMat = gl.getUniformLocation(explosionDeep.progExplosion, "vMat")
	explosionDeep.uniformsExplosion.mMat = gl.getUniformLocation(explosionDeep.progExplosion, "mMat")
	explosionDeep.uniformsExplosion.time = gl.getUniformLocation(explosionDeep.progExplosion, "time")
	explosionDeep.uniformsExplosion.diffuseTextureSampler = gl.getUniformLocation(explosionDeep.progExplosion, "samplerDiffuse")
}

function initForExplosionDeep() {
	var vertexArray = []

	explosionDeep.countExplosionPoints = 100

	for(var i = 0; i < explosionDeep.countExplosionPoints; i++) {
		for(var j = 0; j < explosionDeep.countExplosionPoints; j++) {
			vertexArray.push([2.0 * j / explosionDeep.countExplosionPoints - 1.0, 2.0 * i / explosionDeep.countExplosionPoints - 1.0])
		}
	}

	var vertexArrayQuad = new Float32Array([
		1 / explosionDeep.countExplosionPoints, 1 / explosionDeep.countExplosionPoints, 0.0,
		-1 / explosionDeep.countExplosionPoints, 1 / explosionDeep.countExplosionPoints, 0.0,
		-1 / explosionDeep.countExplosionPoints, -1 / explosionDeep.countExplosionPoints, 0.0,
		-1 / explosionDeep.countExplosionPoints, -1 / explosionDeep.countExplosionPoints, 0.0,
		1 / explosionDeep.countExplosionPoints, -1 / explosionDeep.countExplosionPoints, 0.0,
		1 / explosionDeep.countExplosionPoints, 1 / explosionDeep.countExplosionPoints, 0.0,
	])

	var vao = gl.createVertexArray()
	gl.bindVertexArray(vao)

	explosionDeep.vaoExplosionPoints = gl.createVertexArray()
	gl.bindVertexArray(explosionDeep.vaoExplosionPoints)
	var vbo1 = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo1)
	gl.bufferData(gl.ARRAY_BUFFER, vertexArrayQuad, gl.STATIC_DRAW)
	gl.enableVertexAttribArray(0)
	gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0)
	
	var vbo2 = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo2)
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexArray.flat()), gl.STATIC_DRAW)
	gl.enableVertexAttribArray(1)
	gl.vertexAttribPointer(1, 2, gl.FLOAT, gl.FALSE, 0, 0)
	gl.vertexAttribDivisor(1, 1)

	gl.bindVertexArray(null)

	// explosionDeep.texCon = loadTexture('facebook.jpg', true)
	explosionDeep.texCon = loadTexture('instagram.jpg', true)
	// explosionDeep.texCon = loadTexture('youtube.jpg', true)
	// explosionDeep.texCon = loadTexture('tinder.jpg', true)
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
}

var time = 0.0

function renderForExplosionDeep(perspectiveMatrix, viewMatrix) {
	var modelMat = mat4.create()
	// mat4.scale(modelMat, modelMat, [0.1, 0.1, 0.1])
	gl.enable(gl.BLEND)
	gl.useProgram(explosionDeep.progExplosion)
	gl.uniformMatrix4fv(explosionDeep.uniformsExplosion.pMat, false, perspectiveMatrix)
	gl.uniformMatrix4fv(explosionDeep.uniformsExplosion.vMat, false, viewMatrix)
	gl.uniformMatrix4fv(explosionDeep.uniformsExplosion.mMat, false,modelMat)
	gl.uniform1f(explosionDeep.uniformsExplosion.time, time)
	gl.uniform1i(explosionDeep.uniformsExplosion.diffuseTextureSampler, 0)
	gl.activeTexture(gl.TEXTURE0)
	gl.bindTexture(gl.TEXTURE_2D, explosionDeep.texCon)
	gl.bindVertexArray(explosionDeep.vaoExplosionPoints)
	gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, explosionDeep.countExplosionPoints * explosionDeep.countExplosionPoints)
	gl.bindVertexArray(null)
	gl.disable(gl.BLEND)
	time += 0.07
}