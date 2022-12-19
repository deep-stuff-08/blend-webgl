var shadowDeep = {
	programLight: null,
	uniformsLight: {
		lpMat: null,
		mMat: null,
		lightPos: null,
		farPlane: null
	},
	programCamera: null,
	uniformsCamera: {
		pMat: null,
		vMat: null,
		mMat: null,
		normalDirection: null,
		lightPos: null,
		viewPos: null,
		farPlane: null,
		diffuse: null,
		depthMap: null
	},
	quadObj: null,
	cubeObj: null,
	fboLight: null,
	texLightDepth: null,
	texLightColor: null,
	rotationCube: null
}
const SHADOW_WIDTH_HEIGHT = 1024

function setupProgramForShadowDeep() {
	var vertShader = createShader('shaders/pointShadowsDepth.vert', gl.VERTEX_SHADER)
	var fragShader = createShader('shaders/pointShadowsDepth.frag', gl.FRAGMENT_SHADER)
	shadowDeep.programLight = createProgram([vertShader, fragShader])
	deleteShader(vertShader)
	deleteShader(fragShader)

	shadowDeep.uniformsLight.lpMat = gl.getUniformLocation(shadowDeep.programLight, "lpMat")
	shadowDeep.uniformsLight.mMat = gl.getUniformLocation(shadowDeep.programLight, "mMat")
	shadowDeep.uniformsLight.lightPos = gl.getUniformLocation(shadowDeep.programLight, "lightPos")
	shadowDeep.uniformsLight.farPlane = gl.getUniformLocation(shadowDeep.programLight, "farPlane")

	vertShader = createShader('shaders/pointShadows.vert', gl.VERTEX_SHADER)
	fragShader = createShader('shaders/pointShadows.frag', gl.FRAGMENT_SHADER)
	shadowDeep.programCamera = createProgram([vertShader, fragShader])
	deleteShader(vertShader)
	deleteShader(fragShader)

	shadowDeep.uniformsCamera.pMat = gl.getUniformLocation(shadowDeep.programCamera, "pMat")
	shadowDeep.uniformsCamera.vMat = gl.getUniformLocation(shadowDeep.programCamera, "vMat")
	shadowDeep.uniformsCamera.mMat = gl.getUniformLocation(shadowDeep.programCamera, "mMat")
	shadowDeep.uniformsCamera.normalDirection = gl.getUniformLocation(shadowDeep.programCamera, "normalDirection")
	shadowDeep.uniformsCamera.lightPos = gl.getUniformLocation(shadowDeep.programCamera, "lightPos")
	shadowDeep.uniformsCamera.viewPos = gl.getUniformLocation(shadowDeep.programCamera, "viewPos")
	shadowDeep.uniformsCamera.farPlane = gl.getUniformLocation(shadowDeep.programCamera, "farPlane")
	shadowDeep.uniformsCamera.diffuse = gl.getUniformLocation(shadowDeep.programCamera, "diffuse")
	shadowDeep.uniformsCamera.depthMap = gl.getUniformLocation(shadowDeep.programCamera, "depthMap")
}

function initForShadowDeep() {
	shadowDeep.cubeObj = dshapes.initCube()
	// shadowDeep.quadObj = dshapes.initQuad()

	shadowDeep.fboLight = gl.createFramebuffer()
	shadowDeep.texLightDepth = gl.createTexture()
	
	gl.bindTexture(gl.TEXTURE_CUBE_MAP, shadowDeep.texLightDepth)
	gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
	gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
	gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
	gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
	gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE)
	gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, gl.DEPTH_COMPONENT32F, SHADOW_WIDTH_HEIGHT, SHADOW_WIDTH_HEIGHT, 0, gl.DEPTH_COMPONENT, gl.FLOAT, null)
	gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, gl.DEPTH_COMPONENT32F, SHADOW_WIDTH_HEIGHT, SHADOW_WIDTH_HEIGHT, 0, gl.DEPTH_COMPONENT, gl.FLOAT, null)
	gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, gl.DEPTH_COMPONENT32F, SHADOW_WIDTH_HEIGHT, SHADOW_WIDTH_HEIGHT, 0, gl.DEPTH_COMPONENT, gl.FLOAT, null)
	gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, gl.DEPTH_COMPONENT32F, SHADOW_WIDTH_HEIGHT, SHADOW_WIDTH_HEIGHT, 0, gl.DEPTH_COMPONENT, gl.FLOAT, null)
	gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, gl.DEPTH_COMPONENT32F, SHADOW_WIDTH_HEIGHT, SHADOW_WIDTH_HEIGHT, 0, gl.DEPTH_COMPONENT, gl.FLOAT, null)
	gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, gl.DEPTH_COMPONENT32F, SHADOW_WIDTH_HEIGHT, SHADOW_WIDTH_HEIGHT, 0, gl.DEPTH_COMPONENT, gl.FLOAT, null)
	
	gl.bindFramebuffer(gl.FRAMEBUFFER, shadowDeep.fboLight)
	gl.drawBuffers([ gl.NONE ])
	gl.readBuffer(gl.NONE)
	gl.bindFramebuffer(gl.FRAMEBUFFER, null)

	shadowDeep.texLightColor = loadTexture('wood.png', false)

	gl.enable(gl.DEPTH_TEST)
	// gl.enable(gl.CULL_FACE)

	gl.clearDepth(1.0)
	gl.clearColor(0.1, 0.1, 0.1, 1.0)
}

var lightPos = [0.0, 0.0, 3.0]
var rot = 0.0

function renderThisScene(forDepth) {
	var modelMat
	var modelLoc = forDepth ? shadowDeep.uniformsLight.mMat : shadowDeep.uniformsCamera.mMat
	// gl.disable(gl.CULL_FACE)
	modelMat = mat4.create()
	mat4.scale(modelMat, modelMat, [5.0, 5.0, 5.0])
	if(!forDepth) {
		gl.uniform1i(shadowDeep.uniformsCamera.normalDirection, -1)
		gl.uniformMatrix4fv(modelLoc, false, modelMat)
		shadowDeep.cubeObj.render()
		gl.uniform1i(shadowDeep.uniformsCamera.normalDirection, 1)
	} else {
		gl.uniformMatrix4fv(modelLoc, false, modelMat)
		shadowDeep.cubeObj.render()
	}

	// gl.enable(gl.CULL_FACE)
	modelMat = mat4.create()
	mat4.translate(modelMat, modelMat, [2.0, 3.0, 1.0])
	mat4.scale(modelMat, modelMat, [0.75, 0.75, 0.75])
	gl.uniformMatrix4fv(modelLoc, false, modelMat)
	shadowDeep.cubeObj.render()
	modelMat = mat4.create()
	mat4.translate(modelMat, modelMat, [-3.0, -1.0, 0.0])
	mat4.scale(modelMat, modelMat, [0.5, 0.5, 0.5])
	gl.uniformMatrix4fv(modelLoc, false, modelMat)
	shadowDeep.cubeObj.render()
	modelMat = mat4.create()
	mat4.translate(modelMat, modelMat, [-1.5, 1.0, 1.5])
	mat4.scale(modelMat, modelMat, [0.5, 0.5, 0.5])
	gl.uniformMatrix4fv(modelLoc, false, modelMat)
	shadowDeep.cubeObj.render()
	modelMat = mat4.create()
	mat4.translate(modelMat, modelMat, [-1.5, 2.0, -3.0])
	mat4.rotate(modelMat, modelMat, glMatrix.toRadian(60.0), [1.0, 0.0, 1.0])
	mat4.scale(modelMat, modelMat, [0.75, 0.75, 0.75])
	gl.uniformMatrix4fv(modelLoc, false, modelMat)
	shadowDeep.cubeObj.render()
}

function renderForShadowDeep(perspectiveMatrix, viewMatrix) {
	lightPos[2] = Math.sin(rot * 0.5) * 3.0

	var proj = mat4.create()
	mat4.perspective(proj, glMatrix.toRadian(90.0), 1.0, 1.0, 25.0)
	var shadowView = [
		mat4.create(),
		mat4.create(),
		mat4.create(),
		mat4.create(),
		mat4.create(),
		mat4.create()
	]
	mat4.multiply(shadowView[0], proj, mat4.lookAt(mat4.create(), lightPos, vec3.add(vec3.create(), lightPos, [1.0, 0.0, 0.0]), [0.0, -1.0, 0.0]))
	mat4.multiply(shadowView[1], proj, mat4.lookAt(mat4.create(), lightPos, vec3.add(vec3.create(), lightPos, [-1.0, 0.0, 0.0]), [0.0, -1.0, 0.0]))
	mat4.multiply(shadowView[2], proj, mat4.lookAt(mat4.create(), lightPos, vec3.add(vec3.create(), lightPos, [0.0, 1.0, 0.0]), [0.0, 0.0, 1.0]))
	mat4.multiply(shadowView[3], proj, mat4.lookAt(mat4.create(), lightPos, vec3.add(vec3.create(), lightPos, [0.0, -1.0, 0.0]), [0.0, 0.0, -1.0]))
	mat4.multiply(shadowView[4], proj, mat4.lookAt(mat4.create(), lightPos, vec3.add(vec3.create(), lightPos, [0.0, 0.0, 1.0]), [0.0, -1.0, 0.0]))
	mat4.multiply(shadowView[5], proj, mat4.lookAt(mat4.create(), lightPos, vec3.add(vec3.create(), lightPos, [0.0, 0.0, -1.0]), [0.0, -1.0, 0.0]))
	
	gl.bindFramebuffer(gl.FRAMEBUFFER, shadowDeep.fboLight)
	gl.viewport(0, 0, SHADOW_WIDTH_HEIGHT, SHADOW_WIDTH_HEIGHT)
	gl.useProgram(shadowDeep.programLight)
	
	for(var i = 0; i < 6; i++) {
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, shadowDeep.texLightDepth, 0)
		gl.clear(gl.DEPTH_BUFFER_BIT)		
		gl.uniformMatrix4fv(shadowDeep.uniformsLight.lpMat, false, shadowView[i])
		gl.uniform3fv(shadowDeep.uniformsLight.lightPos, lightPos)
		gl.uniform1f(shadowDeep.uniformsLight.farPlane, 25.0)
		renderThisScene(true)
	}
	
	gl.viewport(0, 0, canvas.width, canvas.height)
	gl.useProgram(shadowDeep.programCamera)
	gl.bindFramebuffer(gl.FRAMEBUFFER, null)
	gl.uniformMatrix4fv(shadowDeep.uniformsCamera.pMat, false, perspectiveMatrix)
	gl.uniformMatrix4fv(shadowDeep.uniformsCamera.vMat, false, viewMatrix)
	gl.uniform3fv(shadowDeep.uniformsCamera.lightPos, lightPos)
	gl.uniform3fv(shadowDeep.uniformsCamera.viewPos, cameraPosition)
	gl.uniform1f(shadowDeep.uniformsCamera.farPlane, 25.0)
	gl.uniform1i(shadowDeep.uniformsCamera.diffuse, 0)
	gl.activeTexture(gl.TEXTURE0)
	gl.bindTexture(gl.TEXTURE_2D, shadowDeep.texLightColor)
	gl.uniform1i(shadowDeep.uniformsCamera.depthMap, 1)
	gl.activeTexture(gl.TEXTURE1)
	gl.bindTexture(gl.TEXTURE_CUBE_MAP, shadowDeep.texLightDepth)
	renderThisScene(false)

	rot += 0.01
}