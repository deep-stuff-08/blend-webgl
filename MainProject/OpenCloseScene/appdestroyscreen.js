var appdestroyDeep = {
	objQuad: null,
	progNoise: null,
	uniforms: {
		color: null
	},
	texInstagram: null,
	texFacebook: null,
	texYoutube: null,
	texTinder: null,
	timeInstagram: null,
	timeFacebook: null,
	timeYoutube: null,
	timeTinder: null
}

function setupProgramForAppDestroyDeep() {
	setupProgramForExplosionDeep()

	var vertShader = createShader('OpenCloseScene/shaders/rainbownoise.vert', gl.VERTEX_SHADER)
	var fragShader = createShader('OpenCloseScene/shaders/rainbownoise.frag', gl.FRAGMENT_SHADER)
	appdestroyDeep.progNoise = createProgram([vertShader, fragShader])
	deleteShader(vertShader)
	deleteShader(fragShader)

	appdestroyDeep.uniforms.color = gl.getUniformLocation(appdestroyDeep.progNoise, "color")
}

function initForAppDestroyDeep() {
	initForExplosionDeep()

	appdestroyDeep.objQuad = dshapes.initQuad()
	appdestroyDeep.texInstagram = loadTexture('resources/textures/instagram.jpg', true)
	appdestroyDeep.texFacebook = loadTexture('resources/textures/facebook.jpg', true)
	appdestroyDeep.texYoutube = loadTexture('resources/textures/youtube.jpg', true)
	appdestroyDeep.texTinder = loadTexture('resources/textures/tinder.jpg', true)

	appdestroyDeep.timeInstagram = 0.0
	appdestroyDeep.timeFacebook = 0.0
	appdestroyDeep.timeYoutube = 0.0
	appdestroyDeep.timeTinder = 0.0
}

function renderForAppDestroyDeep() {
	gl.useProgram(appdestroyDeep.progNoise)
	gl.uniform3f(appdestroyDeep.uniforms.color, 0.1, 0.1, 0.1)
	appdestroyDeep.objQuad.render()

	var mal = mat4.create()
	mat4.ortho(mal, -1.0, 1.0, -(1.0 / 0.6), (1.0 / 0.6), -1.0, 1.0)
	var modelMat

	modelMat = mat4.create()
	mat4.translate(modelMat, modelMat, [ -0.7, 1.2, 0.0 ])
	mat4.scale(modelMat, modelMat, [ 0.3, 0.3, 0.3 ])
	renderForExplosionDeep(mal, modelMat, appdestroyDeep.texInstagram, appdestroyDeep.timeInstagram)
	
	modelMat = mat4.create()
	mat4.translate(modelMat, modelMat, [ -0.23, 1.19, 0.0 ])
	mat4.scale(modelMat, modelMat, [ 0.3, 0.3, 0.3 ])
	renderForExplosionDeep(mal, modelMat, appdestroyDeep.texYoutube, appdestroyDeep.timeYoutube)
	
	modelMat = mat4.create()
	mat4.translate(modelMat, modelMat, [ 0.24, 1.19, 0.0 ])
	mat4.scale(modelMat, modelMat, [ 0.3, 0.3, 0.3 ])
	renderForExplosionDeep(mal, modelMat, appdestroyDeep.texFacebook, appdestroyDeep.timeFacebook)
	
	modelMat = mat4.create()
	mat4.translate(modelMat, modelMat, [ 0.7, 1.21, 0.0 ])
	mat4.scale(modelMat, modelMat, [ 0.3, 0.3, 0.3 ])
	renderForExplosionDeep(mal, modelMat, appdestroyDeep.texTinder, appdestroyDeep.timeTinder)
}
