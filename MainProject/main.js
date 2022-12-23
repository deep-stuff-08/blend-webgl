"use strict"
var canvas
var gl
var lastmousex = -1, lastmousey = -1
var cameraYaw = -90.0, cameraPitch = 0.0
var cameraFront = vec3.set(vec3.create(), 0.0, 0.0, -1.0)
var cameraPosition = vec3.set(vec3.create(), 0.0, 0.0, 5.0)
var cameraUp = vec3.set(vec3.create(), 0.0, 1.0, 0.0)

var renderScene = 2
var doRenderToHdr = true
var trans = [ 0.0, 0.0, 0.0 ]

var modelList = [
	// { name: "Vampire", files:[ 'resources/models/dynamic/vampire/dancing_vampire.dae' ], flipTex:true },
	// { name: "Backpack", files:[ 'resources/models/static/backpack/backpack.obj', 'resources/models/static/backpack/backpack.mtl'], flipTex:false },
	{ name: "PC", files:[ 'resources/models/static/PC/PC.obj', 'resources/models/static/PC/PC.mtl'], flipTex:true },
]

var loadedTextures = {}

var fboForHdr
var texForHdr
var progForHdr
var vaoForHdr
var uniformExposureForHdr
var currentExposure = 1.0

assimpjs().then (function (ajs) {
	Promise.all(modelList.flatMap(o => o.files).map((fileToLoad) => fetch (fileToLoad))).then ((responses) => {
		return Promise.all(responses.map ((res) => res.arrayBuffer()))
	}).then((arrayBuffers) => {
		for(var i = 0; i < modelList.length; i++) {
			console.log("Loading Files for " + modelList[i].name + "....")
			let fileList = new ajs.FileList()
			for (let j = 0; j < modelList[i].files.length; j++) {
				fileList.AddFile(modelList[i].files[j], new Uint8Array(arrayBuffers[i + j]))
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
			trans[1] += 0.01
		} else if(event.code == 'KeyK') {
			trans[1] -= 0.01
		} else if(event.code == 'KeyJ') {
			trans[0] -= 0.01
		} else if(event.code == 'KeyL') {
			trans[0] += 0.01
		} else if(event.code == 'KeyM') {
			trans[2] -= 0.01
		} else if(event.code == 'KeyN') {
			trans[2] += 0.01
		} else if(event.code == 'KeyE') {
			currentExposure -= 0.01
		} else if(event.code == 'KeyR') {
			currentExposure += 0.01
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
	setupProgramForDeepCube()
	// setupProgramForTestModelLoadByDeep()

	if(renderScene === 1) {
		setupProgramForScene1Kdesh();
	}
	if(renderScene === 2)
	{
		setupprogramForSceneTwo();
	}
	if(renderScene === 5) {
		setupProgramForScene5Deep()
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
	initForDeepCube()
	initForLightSourceRendererDeep()
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
	gl.bindFramebuffer(gl.FRAMEBUFFER, null)

	if(renderScene === 1) {
		initForScene1Kdesh()
	}
	if(renderScene === 2)
	{
		initForSceneTwo();
	}
	if(renderScene === 5) {
		initForScene5Deep()
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
	mat4.perspective(perspectiveMatrix, glMatrix.toRadian(45.0), canvas.width / canvas.height, 0.1, 100.0)

	var cameraMatrix = mat4.create()
	var newfront = vec3.create()
	vec3.add(newfront, cameraFront, cameraPosition)
	mat4.lookAt(cameraMatrix, cameraPosition, newfront, cameraUp)
	
	gl.clearBufferfv(gl.COLOR, 0, [0.0, 0.0, 1.0, 1.0])
	gl.clearBufferfv(gl.DEPTH, 0, [1.0])

	if(renderScene === 0) {
		renderForDeepCube(perspectiveMatrix, cameraMatrix);
	} else if(renderScene === 1) {
		renderForScene1Kdesh(perspectiveMatrix, cameraMatrix);
	} else if(renderScene === 2) {
		renderForSceneTwo(time,perspectiveMatrix, cameraMatrix);
	} else if(renderScene === 5) {
		renderForScene5Deep(perspectiveMatrix, cameraMatrix);
	}
	// renderForTestModelLoadByDeep(perspectiveMatrix, cameraMatrix)

	if(doRenderToHdr) {
		gl.bindFramebuffer(gl.FRAMEBUFFER, null)
		gl.clearBufferfv(gl.COLOR, 0, [0.0, 0.0, 1.0, 1.0])
		gl.clearBufferfv(gl.DEPTH, 0, [1.0])
		gl.viewport(0, 0, canvas.width, canvas.height)
		gl.useProgram(progForHdr)
		gl.uniform1f(uniformExposureForHdr, currentExposure)
		gl.activeTexture(gl.TEXTURE0)
		gl.bindTexture(gl.TEXTURE_2D, texForHdr)
		gl.bindVertexArray(vaoForHdr)
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
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
		tbo.image.onload = function() {
			gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, isTexFlipped)
			gl.bindTexture(gl.TEXTURE_2D, tbo)
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
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