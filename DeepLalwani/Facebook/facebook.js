var facebookDeep = {
	objQuad: null,
	texFacebookBackground: null,
	texRoundedQuad: null
}

function setupProgramForFacebookDeep() {
}

function initForFacebookDeep() {
	facebookDeep.objQuad = dshapes.initQuad()
	facebookDeep.texFacebookBackground = loadTexture('resources/textures/Facebook.png', true)
	facebookDeep.texText1 = createFontTexture("60px Open Sans", "black", "May you get well soon")
	
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
}

function renderForFacebookDeep() {
	var modelMatrix

	gl.useProgram(progPhongLightWithTexture.program)
	gl.uniformMatrix4fv(progPhongLightWithTexture.uniforms.pMat, false, mat4.create())
	gl.uniformMatrix4fv(progPhongLightWithTexture.uniforms.vMat, false, mat4.create())
	gl.uniformMatrix2fv(progPhongLightWithTexture.uniforms.texMat, false, mat2.create())
	gl.uniform1i(progPhongLightWithTexture.uniforms.isInvertNormals, 0)
	gl.uniform1i(progPhongLightWithTexture.uniforms.isBlend, 0)
	gl.uniform1i(progPhongLightWithTexture.uniforms.isLight, 0)
	gl.uniform1i(progPhongLightWithTexture.uniforms.isTexture, 1)
	gl.uniform1i(progPhongLightWithTexture.uniforms.diffuseTextureSampler, 0)
	gl.uniform3fv(progPhongLightWithTexture.uniforms.lightPos, [0.0, 0.0, 0.0])
	gl.activeTexture(gl.TEXTURE0)
	gl.disable(gl.DEPTH_TEST)
	gl.enable(gl.BLEND)

	modelMatrix = mat4.create()
	gl.uniformMatrix4fv(progPhongLightWithTexture.uniforms.mMat, false, modelMatrix)
	gl.bindTexture(gl.TEXTURE_2D, facebookDeep.texFacebookBackground)
	facebookDeep.objQuad.render()
	

	modelMatrix = mat4.create()
	mat4.translate(modelMatrix, modelMatrix, trans)
	mat4.scale(modelMatrix, modelMatrix, [ sca, sca, sca ])
	gl.uniformMatrix4fv(progPhongLightWithTexture.uniforms.mMat, false, modelMatrix)
	gl.bindTexture(gl.TEXTURE_2D, facebookDeep.texRoundedQuad)
	facebookDeep.objQuad.render()

	gl.enable(gl.DEPTH_TEST)
	gl.disable(gl.BLEND)
	gl.useProgram(null)
}

function createFontTexture(font, color, str) {
	var textCanvas = document.createElement("canvas")
	textCanvas.width = 1024
	textCanvas.height = 1024
	var context = textCanvas.getContext("2d")
	if(!context) {
		console.log("Context Not Found")
	}

	context.fillStyle = "rgba(0, 0, 0, 0.0)"
	context.fillRect(0, 0, textCanvas.width, textCanvas.height)
	context.textAlign = "center"
	context.textBaseline = "middle"
	context.font = font

	context.fillStyle = color
	context.fillText(str, textCanvas.width / 2, textCanvas.height / 2)
	var tex = gl.createTexture()
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
	gl.bindTexture(gl.TEXTURE_2D, tex)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textCanvas)
	gl.generateMipmap(gl.TEXTURE_2D)
	gl.bindTexture(tex, null)
	return tex
}