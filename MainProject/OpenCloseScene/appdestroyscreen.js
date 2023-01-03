var appdestroyDeep = {
	objQuad: null,
	progNoise: null,
	texInstagram: null,
	texFacebook: null,
	texYoutube: null,
	texTinder: null,
	texTwitter: null,
	texSnapchat: null,
	texPhub: null,
	texWhatsapp: null,
	timeInstagram: null,
	timeFacebook: null,
	timeYoutube: null,
	timeTinder: null,
	timeTwitter: null,
	timeSnapchat: null,
	timePhub: null,
	timeWhatsapp: null,
	timeBeforeAppDestoy: null,
	isUpdate: true
}

function setupProgramForAppDestroyDeep() {
	setupProgramForExplosionDeep()

	var vertShader = createShader('OpenCloseScene/shaders/rainbownoise.vert', gl.VERTEX_SHADER)
	var fragShader = createShader('OpenCloseScene/shaders/rainbownoise.frag', gl.FRAGMENT_SHADER)
	appdestroyDeep.progNoise = createProgram([vertShader, fragShader])
	deleteShader(vertShader)
	deleteShader(fragShader)
}

function initForAppDestroyDeep() {
	initForExplosionDeep()

	appdestroyDeep.objQuad = dshapes.initQuad()
	appdestroyDeep.texInstagram = loadTexture('resources/textures/instagram.jpg', true)
	appdestroyDeep.texFacebook = loadTexture('resources/textures/facebook.jpg', true)
	appdestroyDeep.texYoutube = loadTexture('resources/textures/youtube.jpg', true)
	appdestroyDeep.texTinder = loadTexture('resources/textures/tinder.jpg', true)
	appdestroyDeep.texTwitter = loadTexture('resources/textures/twitter.jpg', true)
	appdestroyDeep.texSnapchat = loadTexture('resources/textures/snapchat.jpg', true)
	appdestroyDeep.texPhub = loadTexture('resources/textures/phub.jpg', true)
	appdestroyDeep.texWhatsapp = loadTexture('resources/textures/whatsapp.jpg', true)

	appdestroyDeep.timeInstagram = 0.0
	appdestroyDeep.timeFacebook = 0.0
	appdestroyDeep.timeYoutube = 0.0
	appdestroyDeep.timeTinder = 0.0
	appdestroyDeep.timeTwitter = 0.0
	appdestroyDeep.timeSnapchat = 0.0
	appdestroyDeep.timePhub = 0.0
	appdestroyDeep.timeWhatsapp = 0.0
	appdestroyDeep.timeBeforeAppDestoy = 0.0
}

function renderForAppDestroyDeep(deltatimeinc) {
	gl.useProgram(appdestroyDeep.progNoise)
	appdestroyDeep.objQuad.render()

	var mal = mat4.create()
	mat4.ortho(mal, -1.0, 1.0, -(1.0 / 0.6), (1.0 / 0.6), -1.0, 1.0)
	var modelMat

	if(appdestroyDeep.isUpdate) {
		appdestroyDeep.isUpdate = !updateTimerForAppDestoryDeep(deltatimeinc)
	} else {
		return true
	}
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

	modelMat = mat4.create()
	mat4.translate(modelMat, modelMat, [ 0.7, 0.6, 0.0 ])
	mat4.scale(modelMat, modelMat, [ 0.3, 0.3, 0.3 ])
	renderForExplosionDeep(mal, modelMat, appdestroyDeep.texTwitter, appdestroyDeep.timeTwitter)

	modelMat = mat4.create()
	mat4.translate(modelMat, modelMat, [ -0.7, 0.6, 0.0 ])
	mat4.scale(modelMat, modelMat, [ 0.3, 0.3, 0.3 ])
	renderForExplosionDeep(mal, modelMat, appdestroyDeep.texSnapchat, appdestroyDeep.timeSnapchat)

	modelMat = mat4.create()
	mat4.translate(modelMat, modelMat, [ -0.23, 0.6, 0.0 ])
	mat4.scale(modelMat, modelMat, [ 0.3, 0.3, 0.3 ])
	renderForExplosionDeep(mal, modelMat, appdestroyDeep.texPhub, appdestroyDeep.timePhub)
	
	modelMat = mat4.create()
	mat4.translate(modelMat, modelMat, [ 0.24, 0.6, 0.0 ])
	mat4.scale(modelMat, modelMat, [ 0.3, 0.3, 0.3 ])
	renderForExplosionDeep(mal, modelMat, appdestroyDeep.texWhatsapp, appdestroyDeep.timeWhatsapp)
	
	return false
}

function updateTimerForAppDestoryDeep(deltatimeinc) {
	if(appdestroyDeep.timeBeforeAppDestoy < 6.8) {
		appdestroyDeep.timeBeforeAppDestoy += deltatimeinc * 0.001
		return false
	} else if(appdestroyDeep.timeYoutube < 4.0) {
		appdestroyDeep.timeYoutube += deltatimeinc * 0.001
		return false
	} else if(appdestroyDeep.timeInstagram < 3.7) {
		appdestroyDeep.timeInstagram += deltatimeinc * 0.001
		return false
	} else if(appdestroyDeep.timeTinder < 3.7) {
		appdestroyDeep.timeTinder += deltatimeinc * 0.001
		return false
	} else if(appdestroyDeep.timeFacebook < 3.4) {
		appdestroyDeep.timeFacebook += deltatimeinc * 0.001
		return false
	} else if(appdestroyDeep.timeTwitter < 3.7) {
		appdestroyDeep.timeTwitter += deltatimeinc * 0.001
		return false
	} else if(appdestroyDeep.timeSnapchat < 3.7) {
		appdestroyDeep.timeSnapchat += deltatimeinc * 0.001
		return false
	} else if(appdestroyDeep.timePhub < 3.7) {
		appdestroyDeep.timePhub += deltatimeinc * 0.001
		return false
	} else if(appdestroyDeep.timeWhatsapp < 3.7) {
		appdestroyDeep.timeWhatsapp += deltatimeinc * 0.001
		return false
	} else {
		return true
	}
}
