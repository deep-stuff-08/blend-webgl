"use strict"
var canvas
var gl
var lastmousex = -1, lastmousey = -1
var cameraYaw = -90.0, cameraPitch = 0.0
var cameraFront = vec3.set(vec3.create(), 0.0, 0.0, -1.0)
var cameraPosition = vec3.set(vec3.create(), 0.0, 0.0, 5.0)
var cameraUp = vec3.set(vec3.create(), 0.0, 1.0, 0.0)

const SceneEnum = {
	Tester: -1,
	OpenScene: 0,
	StudyScene: 1,
	BarScene: 2,
	HospitalScene: 3,
	BedroomScene: 4,
	UninstallScene: 5,
	CloseScene: 6
}

var renderScene = SceneEnum.CloseScene
var doRenderToHdr = true
var trans = [ 0.0, 0.0, 0.0 ]
var sca = 1.0
var sceneCamera
var devCam = true
var showCamPath = false
var showCam = false
var camSplinePosition = 0.0
var debugMode = true

var modelList = [
	// { name: "Vampire", files:[ 'resources/models/dynamic/vampire/dancing_vampire.dae' ], flipTex:true },
	// { name: "Backpack", files:[ 'resources/models/static/backpack/backpack.obj', 'resources/models/static/backpack/backpack.mtl'], flipTex:false },
	// { name: "PC", files:[ 'resources/models/static/PC/PC.obj', 'resources/models/static/PC/PC.mtl'], flipTex:true },
	{ name: "Brian", files:[ 'resources/models/dynamic/Brian/SadWalk.dae' ], flipTex:true },
	{ name: "BlueCar", files:[ 'resources/models/static/Car/bluecar.obj', 'resources/models/static/Car/bluecar.mtl' ], flipTex:true },
	{ name: "BlackCar", files:[ 'resources/models/static/Car/blackcar.obj', 'resources/models/static/Car/blackcar.mtl' ], flipTex:true },
	{ name: "SilverCar", files:[ 'resources/models/static/Car/silvercar.obj', 'resources/models/static/Car/silvercar.mtl' ], flipTex:true },
]

var loadedTextures = {}

var fboForHdr
var texForHdr
var progForHdr
var vaoForHdr
var uniformExposureForHdr
var currentExposure = 1.0
var isLoadModels = false

assimpjs().then (function (ajs) {
	if(isLoadModels) {
		Promise.all(modelList.flatMap(o => o.files).map((fileToLoad) => fetch (fileToLoad))).then ((responses) => {
			return Promise.all(responses.map ((res) => res.arrayBuffer()))
		}).then((arrayBuffers) => {
			var k = 0
			for(var i = 0; i < modelList.length; i++) {
				console.log("Loading Files for " + modelList[i].name + "....")
				let fileList = new ajs.FileList()
				for (let j = 0; j < modelList[i].files.length; j++) {
					fileList.AddFile(modelList[i].files[j], new Uint8Array(arrayBuffers[k++]))
				}
				console.log("Loaded Files")
				console.log("Converting Files to AssimpJSON....")
				let result = ajs.ConvertFileList(fileList, 'assjson')
				if (!result.IsSuccess() || result.FileCount() == 0) {
					console.log(result.GetErrorCode())
					return
				}
				console.log("Converted Files")
				console.log("Parse JSON String....")
				let resultFile = result.GetFile(0)
				let jsonContent = new TextDecoder().decode(resultFile.GetContent())
				let resultJson = JSON.parse(jsonContent)
				console.log("Parsed JSON")
				modelList[i].json = resultJson
				modelList[i].directory = modelList[i].files[0].substring(0, modelList[i].files[0].lastIndexOf('/'))
			}
			main()
		})
	} else {
		main()
	}
})

function main() {
	canvas = document.createElement('canvas')
	gl = canvas.getContext('webgl2')
	canvas.width = window.innerWidth
	canvas.height = window.innerHeight
	document.body.style.margin = "0"
	document.body.appendChild(canvas)
	window.addEventListener('resize', function () {
		canvas.width = window.innerWidth
		canvas.height = window.innerHeight
	})
	canvas.addEventListener('mousedown', function (event) {
		lastmousex = event.x
		lastmousey = event.y
	})
	canvas.addEventListener('mousemove', function (event) {
		if(lastmousex != -1 && lastmousey != -1) {
			var xoffset = event.x - lastmousex
			var yoffset = lastmousey - event.y 
			lastmousex = event.x
			lastmousey = event.y
			const sensitivity = 0.1
			xoffset *= sensitivity
			yoffset *= sensitivity
			cameraYaw += xoffset
			cameraPitch += yoffset
		
			if(cameraPitch > 89.0) {
				cameraPitch = 89.0
			} else if(cameraPitch < -89.0) {
				cameraPitch = -89.0
			}
			var direction = [Math.cos(glMatrix.toRadian(cameraYaw)) * Math.cos(glMatrix.toRadian(cameraPitch)), Math.sin(glMatrix.toRadian(cameraPitch)), Math.sin(glMatrix.toRadian(cameraYaw)) * Math.cos(glMatrix.toRadian(cameraPitch))]
			vec3.normalize(cameraFront, direction)
		}
	})
	canvas.addEventListener('mouseup', function (event) {
		lastmousex = -1
		lastmousey = -1
	})
	window.addEventListener("keypress", function (event) {
		var speed = 0.3
		if(event.code == 'KeyA') {
			var dir = vec3.create()
			vec3.cross(dir, cameraFront, cameraUp)
			vec3.normalize(dir, dir)
			vec3.multiply(dir, dir, [speed, speed, speed])
			vec3.subtract(cameraPosition, cameraPosition, dir)
		} else if(event.code == 'KeyW') {
			var dir = vec3.create()
			vec3.multiply(dir, cameraFront, [speed, speed, speed])
			vec3.add(cameraPosition, cameraPosition, dir)
		} else if(event.code == 'KeyS') {
			var dir = vec3.create()
			vec3.multiply(dir, cameraFront, [speed, speed, speed])
			vec3.subtract(cameraPosition, cameraPosition, dir)
		} else if(event.code == 'KeyD') {
			var dir = vec3.create()
			vec3.cross(dir, cameraFront, cameraUp)
			vec3.normalize(dir, dir)
			vec3.multiply(dir, dir, [speed, speed, speed])
			vec3.add(cameraPosition, cameraPosition, dir)
		} else if(event.code == 'KeyI') {
			trans[1] += 0.1
		} else if(event.code == 'KeyK') {
			trans[1] -= 0.1
		} else if(event.code == 'KeyJ') {
			trans[0] -= 0.1
		} else if(event.code == 'KeyL') {
			trans[0] += 0.1
		} else if(event.code == 'KeyM') {
			trans[2] -= 0.1
		} else if(event.code == 'KeyN') {
			trans[2] += 0.1
		} else if(event.code == 'KeyE') {
			currentExposure -= 0.01
		} else if(event.code == 'KeyR') {
			currentExposure += 0.01
		} else if(event.code == 'KeyP') {
			if(devCam)
				showCamPath = !showCamPath
		} else if(event.code == 'KeyC') {
			if(devCam)
				showCam = !showCam
		} else if(event.code == 'KeyV') {
			devCam = !devCam
			if(!devCam) {
				showCamPath = false;
				showCam = false;
			}
		} else if(event.code == 'Space') {
			if(debugMode) {
				renderScene = (renderScene + 1) % 7
			}
		} else if(event.code == 'KeyO') {
			sca += 0.01
		} else if(event.code == 'KeyU') {
			sca -= 0.01
		}
	})
	
	gl.getExtension("EXT_color_buffer_float")
	gl.getExtension("EXT_float_blend")
	gl.getExtension("OES_texture_float_linear")

	setupProgram()
	init()
	render()
	window.addEventListener('close', uninit)
}

function setupProgram() {
	setupCommonPrograms()
	setupProgramForLightSourceRendererDeep()
	// setupProgramForTestModelLoadByDeep()

	if(debugMode) {
		switch(renderScene) {
		case SceneEnum.OpenScene:
			setupProgramForOpenSceneDeep()
			break
		case SceneEnum.StudyScene:
			setupProgramForScene1Kdesh()
			break
		case SceneEnum.BarScene:
			setupprogramForBarScene()
			break
		case SceneEnum.BedroomScene:
			setupprogramForBedroomScene()
			break
		case SceneEnum.HospitalScene:
			setupprogramForSceneTwo()
			break
		case SceneEnum.CloseScene:
			setupProgramForOpenSceneDeep()
			break
		}
	} else {
		setupProgramForOpenSceneDeep()
		setupProgramForScene1Kdesh()
		setupprogramForBarScene()
		setupprogramForSceneTwo()
		setupprogramForBedroomScene()
	}
	
	vertShader = createShader('common/shaders/hdr.vert', gl.VERTEX_SHADER)
	fragShader = createShader('common/shaders/hdr.frag', gl.FRAGMENT_SHADER)
	progForHdr = createProgram([vertShader, fragShader])
	deleteShader(vertShader)
	deleteShader(fragShader)
	gl.useProgram(progForHdr)
	gl.uniform1i(gl.getUniformLocation(progForHdr, "hdrTex"), 0)
	uniformExposureForHdr = gl.getUniformLocation(progForHdr, "exposure")
	gl.useProgram(null)
}

function init() {
	initForLightSourceRendererDeep()
	initForPhoneDeep()
	// initForTestModelLoadByDeep()

	fboForHdr = gl.createFramebuffer()
	texForHdr = gl.createTexture()
	vaoForHdr = gl.createVertexArray()
	var rbo = gl.createRenderbuffer()

	gl.bindFramebuffer(gl.FRAMEBUFFER, fboForHdr)
	gl.bindTexture(gl.TEXTURE_2D, texForHdr)
	gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA32F, 2048, 2048)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texForHdr, 0)
	gl.bindRenderbuffer(gl.RENDERBUFFER, rbo)
	gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT32F, 2048, 2048)
	gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, rbo)
	gl.bindTexture(gl.TEXTURE_2D, null)
	gl.bindFramebuffer(gl.FRAMEBUFFER, null)

	sceneCamera = new kcamera()

	if(debugMode) {
		switch(renderScene) {
		case SceneEnum.OpenScene:
			initForOpenSceneDeep()
			break
		case SceneEnum.StudyScene:
			initForScene1Kdesh()
			break
		case SceneEnum.BarScene:
			initForBarScene()
			break
		case SceneEnum.BedroomScene:
			initForBedroomScene()
			break
		case SceneEnum.HospitalScene:
			initForSceneTwo()
			break
		case SceneEnum.CloseScene:
			initForOpenSceneDeep()
		}
	} else {
		initForOpenSceneDeep()
		initForScene1Kdesh(sceneCamera)
		initForSceneTwo()
		initForBarScene()
		initForBedroomScene()
	}

	gl.enable(gl.DEPTH_TEST)
}
function printMatrix(m) {
	for(var i = 0; i < 4; i++) {
		console.log(m[i * 4 + 0] + "   " + m[i * 4 + 1] + "   " + m[i * 4 + 2] + "   " + m[i * 4 + 3])
	}
}

function render(time) {
	if(doRenderToHdr) {
		gl.bindFramebuffer(gl.FRAMEBUFFER, fboForHdr)
		gl.viewport(0, 0, 2048, 2048)
	} else {
		gl.viewport(0, 0, canvas.width, canvas.height)
	}
	
	var perspectiveMatrix = mat4.create()
	mat4.perspective(perspectiveMatrix, glMatrix.toRadian(45.0), canvas.width / canvas.height, 0.1, 1000.0)

	/* var cameraMatrix = mat4.create()
	var newfront = vec3.create()
	vec3.add(newfront, cameraFront, cameraPosition)
	mat4.lookAt(cameraMatrix, cameraPosition, newfront, cameraUp) */
	
	if(devCam) {
		var cameraMatrix = mat4.create()
		var newfront = vec3.create()
		vec3.add(newfront, cameraFront, cameraPosition)
		mat4.lookAt(cameraMatrix, cameraPosition, newfront, cameraUp)
	} else {
		var cameraMatrix = sceneCamera.matrix(camSplinePosition)
	}

	gl.clearBufferfv(gl.COLOR, 0, [0.0, 0.0, 1.0, 1.0])
	gl.clearBufferfv(gl.DEPTH, 0, [1.0])

	if(showCamPath)
		sceneCamera.renderPath(perspectiveMatrix, cameraMatrix)
	if(showCam)
		sceneCamera.render(perspectiveMatrix, cameraMatrix, camSplinePosition)

	switch(renderScene) {
	case SceneEnum.Tester:
		// renderCubemapDeep(cameraMatrix, temptex)
		break
	case SceneEnum.OpenScene:
		renderForOpenSceneDeep(perspectiveMatrix, cameraMatrix)
		break
	case SceneEnum.StudyScene:
		renderForScene1Kdesh(perspectiveMatrix, cameraMatrix)
		camSplinePosition += 0.001
		if(camSplinePosition > 1.0)
		camSplinePosition = 0.0
		break
	case SceneEnum.BarScene:
		renderForBarScene(time, perspectiveMatrix, cameraMatrix)
	break
	case SceneEnum.HospitalScene:
		renderForSceneTwo(time, perspectiveMatrix, cameraMatrix)
	break
	case SceneEnum.BedroomScene:
		renderForBedroomScene(time, perspectiveMatrix, cameraMatrix)
	break
	case SceneEnum.CloseScene:
		renderForCloseSceneDeep(perspectiveMatrix, cameraMatrix)
		break
	default:
		renderForDeepCube(perspectiveMatrix, cameraMatrix)
		break
	}
	// renderForTestModelLoadByDeep(perspectiveMatrix, cameraMatrix)

	if(doRenderToHdr) {
		gl.bindFramebuffer(gl.FRAMEBUFFER, null)
		gl.clearBufferfv(gl.COLOR, 0, [0.1, 0.1, 0.1, 1.0])
		gl.clearBufferfv(gl.DEPTH, 0, [1.0])
		gl.viewport(0, 0, canvas.width, canvas.height)
		gl.useProgram(progForHdr)
		gl.uniform1f(uniformExposureForHdr, currentExposure)
		gl.activeTexture(gl.TEXTURE0)
		gl.bindTexture(gl.TEXTURE_2D, texForHdr)
		gl.bindVertexArray(vaoForHdr)
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
		gl.bindVertexArray(null)
		gl.bindTexture(gl.TEXTURE_2D, null)
		gl.useProgram(null)
	}

	window.requestAnimationFrame(render)
}

function uninit() {
}

function createShader(filename, shaderType) {
	console.log("Loading ", filename)
	var shader = gl.createShader(shaderType)
	var xhr = new XMLHttpRequest()
	xhr.open("GET", filename, false)
	xhr.overrideMimeType("text/plain")
	xhr.send()
	gl.shaderSource(shader, xhr.responseText)
	gl.compileShader(shader)
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		console.log(gl.getShaderInfoLog(shader))
	}
	return shader
}

function deleteShader(shader) {
	gl.deleteShader(shader)
}

function createProgram(shaders, attribBindFunction) {
	var program = gl.createProgram()
	for (var i = 0; i < shaders.length; i++) {
		gl.attachShader(program, shaders[i])
	}
	if(attribBindFunction != undefined) {
		attribBindFunction(program)
	}
	gl.linkProgram(program)
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.log(gl.getProgramInfoLog(program))
	}
	for (var i = 0; i < shaders.length; i++) {
		gl.detachShader(program, shaders[i])
	}
	return program
}

function deleteProgram(program) {
	gl.deleteProgram(program)
}

function loadTexture(path, isTexFlipped) {
	if(loadedTextures[path] == undefined) {
		var tbo = gl.createTexture()
		tbo.image = new Image()
		tbo.image.src = path
		console.log("Loading: " + path)
		tbo.image.onload = function() {
			gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, isTexFlipped)
			gl.bindTexture(gl.TEXTURE_2D, tbo)
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT)
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, tbo.image)
			gl.generateMipmap(gl.TEXTURE_2D)
			console.log("Successfully Loaded: " + path)
			gl.bindTexture(gl.TEXTURE_2D, null)
		}
		tbo.image.onerror = function() {
			loadedTextures[path] = undefined
			console.log("Failed Load: " + path)
		}
		loadedTextures[path] = tbo
		return tbo
	} else {
		return loadedTextures[path]
	}
}

function loadTextureCubemap(path, isTexFlipped) {
	var tbo = gl.createTexture()
	var ext = path.substr(path.lastIndexOf(".")) 
	var apath = path.substr(0, path.lastIndexOf("."))
	var cubemapFaces = [
		{ bind: gl.TEXTURE_CUBE_MAP_POSITIVE_X, name: "px" + ext},
		{ bind: gl.TEXTURE_CUBE_MAP_NEGATIVE_X, name: "nx" + ext},
		{ bind: gl.TEXTURE_CUBE_MAP_POSITIVE_Y, name: "py" + ext},
		{ bind: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, name: "ny" + ext},
		{ bind: gl.TEXTURE_CUBE_MAP_POSITIVE_Z, name: "pz" + ext},
		{ bind: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, name: "nz" + ext},
	]
	var imageData = [ null, null, null, null, null, null]
	imageData[0] = new Image()
	imageData[0].src = apath + "/" + cubemapFaces[0].name
	imageData[0].tname = cubemapFaces[0].name
	imageData[0].bind = cubemapFaces[0].bind
	imageData[0].onload = function() {
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, isTexFlipped)
		gl.bindTexture(gl.TEXTURE_CUBE_MAP, tbo)
		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
		gl.texImage2D(this.bind, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imageData[0])
		console.log("Successfully Loaded: " + apath + "/" + this.tname + " at " + this.bind)
		gl.bindTexture(gl.TEXTURE_CUBE_MAP, null)
	}
	imageData[1] = new Image()
	imageData[1].src = apath + "/" + cubemapFaces[1].name
	imageData[1].tname = cubemapFaces[1].name
	imageData[1].bind = cubemapFaces[1].bind
	imageData[1].onload = function() {
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, isTexFlipped)
		gl.bindTexture(gl.TEXTURE_CUBE_MAP, tbo)
		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
		gl.texImage2D(this.bind, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imageData[1])
		console.log("Successfully Loaded: " + apath + "/" + this.tname + " at " + this.bind)
		gl.bindTexture(gl.TEXTURE_CUBE_MAP, null)
	}
	imageData[2] = new Image()
	imageData[2].src = apath + "/" + cubemapFaces[2].name
	imageData[2].tname = cubemapFaces[2].name
	imageData[2].bind = cubemapFaces[2].bind
	imageData[2].onload = function() {
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, isTexFlipped)
		gl.bindTexture(gl.TEXTURE_CUBE_MAP, tbo)
		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
		gl.texImage2D(this.bind, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imageData[2])
		console.log("Successfully Loaded: " + apath + "/" + this.tname + " at " + this.bind)
		gl.bindTexture(gl.TEXTURE_CUBE_MAP, null)
	}
	imageData[3] = new Image()
	imageData[3].src = apath + "/" + cubemapFaces[3].name
	imageData[3].tname = cubemapFaces[3].name
	imageData[3].bind = cubemapFaces[3].bind
	imageData[3].onload = function() {
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, isTexFlipped)
		gl.bindTexture(gl.TEXTURE_CUBE_MAP, tbo)
		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
		gl.texImage2D(this.bind, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imageData[3])
		console.log("Successfully Loaded: " + apath + "/" + this.tname + " at " + this.bind)
		gl.bindTexture(gl.TEXTURE_CUBE_MAP, null)
	}
	imageData[4] = new Image()
	imageData[4].src = apath + "/" + cubemapFaces[4].name
	imageData[4].tname = cubemapFaces[4].name
	imageData[4].bind = cubemapFaces[4].bind
	imageData[4].onload = function() {
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, isTexFlipped)
		gl.bindTexture(gl.TEXTURE_CUBE_MAP, tbo)
		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
		gl.texImage2D(this.bind, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imageData[4])
		console.log("Successfully Loaded: " + apath + "/" + this.tname + " at " + this.bind)
		gl.bindTexture(gl.TEXTURE_CUBE_MAP, null)
	}
	imageData[5] = new Image()
	imageData[5].src = apath + "/" + cubemapFaces[5].name
	imageData[5].tname = cubemapFaces[5].name
	imageData[5].bind = cubemapFaces[5].bind
	imageData[5].onload = function() {
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, isTexFlipped)
		gl.bindTexture(gl.TEXTURE_CUBE_MAP, tbo)
		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
		gl.texImage2D(this.bind, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imageData[5])
		console.log("Successfully Loaded: " + apath + "/" + this.tname + " at " + this.bind)
		gl.bindTexture(gl.TEXTURE_CUBE_MAP, null)
	}
	return tbo
}