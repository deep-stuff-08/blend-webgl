var oceanDeep = {
	vboFullscreen: null,
	vboOceanBuffer: null,
	fboInitialSpectrum: null,
	fboPingPhaseFramebuffer: null,
	fboPongPhaseFramebuffer: null,
	fboSpectrumFramebuffer: null,
	fboDisplacementMapFramebuffer: null,
	fboNormalMapFramebuffer: null,
	fboPingTransformFramebuffer: null,
	fboPongTransformFramebuffer: null,
	
	progHorizontalSubtransform: null,
	uniformsHorizontalSubtransform: {
		input: null,
		subtransformSize: null,
	},
	progVerticalSubtransform: null,
	uniformsVerticalSubtransform: {
		input: null,
		subtransformSize: null,
	},
	progInitialSpectrum: null,
	uniformsInitialSpectrum: {
		wind: null,
		size: null,
	},
	progPhase: null,
	uniformsPhase: {
		phases: null,
		deltaTime: null,
		size: null,
	},
	progSpectrum: null,
	uniformsSpectrum: {
		phases: null,
		size: null,
		choppiness: null,
	},
	progNormalMap: null,
	uniformsNormalMap: {
		size: null,
	},
	progOcean: null,
	uniformsOcean: {
		size: null,
		pMat: null,
		vMat: null,
		viewPos: null,
	},

	pingPhase: true,
	triangleCount: null,
}

const oceanDeepConst = {
	windX: 10.0,
	windY: 10.0,
	size: 250.0,
	choppiness: 1.5,
	RESOLUTION: 512,
	GEOMETRY_RESOLUTION: 256,
	GEOMETRY_SIZE: 2000,
	GEOMETRY_ORIGIN: [-1000.0, -1000.0],
	SUN_DIRECTION: [-1.0, 1.0, 1.0],
	OCEAN_COLOR: [0.004, 0.016, 0.047],
	SKY_COLOR: [3.2, 9.6, 12.8],
	EXPOSURE: 0.35,
	INITIAL_SPECTRUM_UNIT: 0,
	OCEAN_COORDINATES_UNIT: 1,
	DISPLACEMENT_MAP_UNIT: 2,
	NORMAL_MAP_UNIT: 3,
	PING_PHASE_UNIT: 4,
	PONG_PHASE_UNIT: 5,
	PING_TRANSFORM_UNIT: 6,
	PONG_TRANSFORM_UNIT: 7
}

const SIZE_OF_FLOAT = 4

function createTextureFromParams(unit, format, type, width, height, data, wrapS, wrapT, minFilter, magFilter) {
	var texture = gl.createTexture();
	gl.activeTexture(gl.TEXTURE0 + unit);
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, format, width, height, 0, format, type, data);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter);
	return texture;
}

function createFramebufferFromTexture(texture) {
	var fbo = gl.createFramebuffer()
	gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0)
	return fbo
}

function setupProgramForOceanDeep() {
	var fullscreenVertexShader = createShader("shaders/fullscreen.vert", gl.VERTEX_SHADER)

	var horizontalSubtransformShader = createShader("shaders/horizontalSubtransform.frag", gl.FRAGMENT_SHADER) 
	oceanDeep.progHorizontalSubtransform = createProgram([fullscreenVertexShader, horizontalSubtransformShader])
	gl.useProgram(oceanDeep.progHorizontalSubtransform)
	gl.uniform1f(gl.getUniformLocation(oceanDeep.progHorizontalSubtransform, 'u_transformSize'), oceanDeepConst.RESOLUTION)
	oceanDeep.uniformsHorizontalSubtransform.input = gl.getUniformLocation(oceanDeep.progHorizontalSubtransform, 'u_input')
	oceanDeep.uniformsHorizontalSubtransform.subtransformSize = gl.getUniformLocation(oceanDeep.progHorizontalSubtransform, 'u_subtransformSize')

	var verticalSubtransformShader = createShader("shaders/verticalSubtransform.frag", gl.FRAGMENT_SHADER)
	oceanDeep.progVerticalSubtransform = createProgram([fullscreenVertexShader, verticalSubtransformShader])
	gl.useProgram(oceanDeep.progVerticalSubtransform)
	gl.uniform1f(gl.getUniformLocation(oceanDeep.progVerticalSubtransform, 'u_transformSize'), oceanDeepConst.RESOLUTION)
	oceanDeep.uniformsVerticalSubtransform.input = gl.getUniformLocation(oceanDeep.progVerticalSubtransform, 'u_input')
	oceanDeep.uniformsVerticalSubtransform.subtransformSize = gl.getUniformLocation(oceanDeep.progVerticalSubtransform, 'u_subtransformSize')

	var initialSpectrumShader = createShader("shaders/initialSpectrum.frag", gl.FRAGMENT_SHADER)
	oceanDeep.progInitialSpectrum = createProgram([fullscreenVertexShader, initialSpectrumShader])
	gl.useProgram(oceanDeep.progInitialSpectrum)
	gl.uniform1f(gl.getUniformLocation(oceanDeep.progInitialSpectrum, 'u_resolution'), oceanDeepConst.RESOLUTION)
	oceanDeep.uniformsInitialSpectrum.wind = gl.getUniformLocation(oceanDeep.progInitialSpectrum, 'u_wind')
	oceanDeep.uniformsInitialSpectrum.size = gl.getUniformLocation(oceanDeep.progInitialSpectrum, 'u_size')

	var phaseShader = createShader("shaders/phase.frag", gl.FRAGMENT_SHADER)
	oceanDeep.progPhase = createProgram([fullscreenVertexShader, phaseShader])
	gl.useProgram(oceanDeep.progPhase)
	gl.uniform1f(gl.getUniformLocation(oceanDeep.progPhase, 'u_resolution'), oceanDeepConst.RESOLUTION)
	oceanDeep.uniformsPhase.phases = gl.getUniformLocation(oceanDeep.progPhase, 'u_phases')
	oceanDeep.uniformsPhase.size = gl.getUniformLocation(oceanDeep.progPhase, 'u_size')
	oceanDeep.uniformsPhase.deltaTime = gl.getUniformLocation(oceanDeep.progPhase, 'u_deltaTime')

	var spectrumShader = createShader("shaders/spectrum.frag", gl.FRAGMENT_SHADER)
	oceanDeep.progSpectrum = createProgram([fullscreenVertexShader, spectrumShader])
	gl.useProgram(oceanDeep.progSpectrum)
	gl.uniform1f(gl.getUniformLocation(oceanDeep.progSpectrum, 'u_resolution'), oceanDeepConst.RESOLUTION)
	gl.uniform1i(gl.getUniformLocation(oceanDeep.progSpectrum, 'u_initialSpectrum'), oceanDeepConst.INITIAL_SPECTRUM_UNIT)
	oceanDeep.uniformsSpectrum.phases = gl.getUniformLocation(oceanDeep.progSpectrum, 'u_phases')
	oceanDeep.uniformsSpectrum.size = gl.getUniformLocation(oceanDeep.progSpectrum, 'u_size')
	oceanDeep.uniformsSpectrum.choppiness = gl.getUniformLocation(oceanDeep.progSpectrum, 'u_choppiness')

	var normalMapShader = createShader("shaders/normalMap.frag", gl.FRAGMENT_SHADER)
	oceanDeep.progNormalMap = createProgram([fullscreenVertexShader, normalMapShader])
	gl.useProgram(oceanDeep.progNormalMap)
	gl.uniform1f(gl.getUniformLocation(oceanDeep.progNormalMap, 'u_resolution'), oceanDeepConst.RESOLUTION)
	gl.uniform1i(gl.getUniformLocation(oceanDeep.progNormalMap, 'u_displacementMap'), oceanDeepConst.INITIAL_SPECTRUM_UNIT)
	oceanDeep.uniformsNormalMap.size = gl.getUniformLocation(oceanDeep.progNormalMap, 'u_size')

	var oceanVertShader = createShader("shaders/ocean.vert", gl.VERTEX_SHADER)
	var oceanFragShader = createShader("shaders/ocean.frag", gl.FRAGMENT_SHADER)
	oceanDeep.progOcean = createProgram([oceanVertShader, oceanFragShader])
	gl.useProgram(oceanDeep.progOcean)
	gl.uniform1f(gl.getUniformLocation(oceanDeep.progOcean, 'u_geometrySize'), oceanDeepConst.GEOMETRY_SIZE)
	gl.uniform1i(gl.getUniformLocation(oceanDeep.progOcean, 'u_displacementMap'), oceanDeepConst.DISPLACEMENT_MAP_UNIT)
	gl.uniform1i(gl.getUniformLocation(oceanDeep.progOcean, 'u_normalMap'), oceanDeepConst.NORMAL_MAP_UNIT)
	gl.uniform3fv(gl.getUniformLocation(oceanDeep.progOcean, 'u_oceanColor'), oceanDeepConst.OCEAN_COLOR)
	gl.uniform3fv(gl.getUniformLocation(oceanDeep.progOcean, 'u_skyColor'), oceanDeepConst.SKY_COLOR)
	gl.uniform3fv(gl.getUniformLocation(oceanDeep.progOcean, 'u_sunDirection'), oceanDeepConst.SUN_DIRECTION)
	gl.uniform1f(gl.getUniformLocation(oceanDeep.progOcean, 'u_exposure'), oceanDeepConst.EXPOSURE)
	oceanDeep.uniformsOcean.size = gl.getUniformLocation(oceanDeep.progOcean, 'u_size')
	oceanDeep.uniformsOcean.pMat = gl.getUniformLocation(oceanDeep.progOcean, 'u_projectionMatrix')
	oceanDeep.uniformsOcean.vMat = gl.getUniformLocation(oceanDeep.progOcean, 'u_viewMatrix')
	oceanDeep.uniformsOcean.viewPos = gl.getUniformLocation(oceanDeep.progOcean, 'u_cameraPosition')
}

function initForOceanDeep() {
	gl.clearColor.apply(gl, [1.0, 1.0, 1.0, 0.0])
	gl.enable(gl.DEPTH_TEST)

	gl.enableVertexAttribArray(0)

	var fullscreen = [
		-1.0, -1.0, 
		-1.0, 1.0, 
		1.0, -1.0, 
		1.0, 1.0
	]

	oceanDeep.vboFullscreen = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, oceanDeep.vboFullscreen);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(fullscreen), gl.STATIC_DRAW);

	var oceanData = []
	for (var zIndex = 0; zIndex < oceanDeepConst.GEOMETRY_RESOLUTION; zIndex += 1) {
		for (var xIndex = 0; xIndex < oceanDeepConst.GEOMETRY_RESOLUTION; xIndex += 1) {
			oceanData.push((xIndex * oceanDeepConst.GEOMETRY_SIZE) / (oceanDeepConst.GEOMETRY_RESOLUTION - 1) + oceanDeepConst.GEOMETRY_ORIGIN[0]);
			oceanData.push((0.0));
			oceanData.push((zIndex * oceanDeepConst.GEOMETRY_SIZE) / (oceanDeepConst.GEOMETRY_RESOLUTION - 1) + oceanDeepConst.GEOMETRY_ORIGIN[1]);
			oceanData.push(xIndex / (oceanDeepConst.GEOMETRY_RESOLUTION - 1));
			oceanData.push(zIndex / (oceanDeepConst.GEOMETRY_RESOLUTION - 1));
		}
	}

	var oceanIndices = [];
	for (var zIndex = 0; zIndex < oceanDeepConst.GEOMETRY_RESOLUTION - 1; zIndex += 1) {
		for (var xIndex = 0; xIndex < oceanDeepConst.GEOMETRY_RESOLUTION - 1; xIndex += 1) {
			var topLeft = zIndex * oceanDeepConst.GEOMETRY_RESOLUTION + xIndex,
				topRight = topLeft + 1,
				bottomLeft = topLeft + oceanDeepConst.GEOMETRY_RESOLUTION,
				bottomRight = bottomLeft + 1;

			oceanIndices.push(topLeft);
			oceanIndices.push(bottomLeft);
			oceanIndices.push(bottomRight);
			oceanIndices.push(bottomRight);
			oceanIndices.push(topRight);
			oceanIndices.push(topLeft);
		}
	}

	oceanDeep.vboOceanBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, oceanDeep.vboOceanBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(oceanData), gl.STATIC_DRAW);
	gl.vertexAttribPointer(oceanDeepConst.OCEAN_COORDINATES_UNIT, 2, gl.FLOAT, false, 5 * SIZE_OF_FLOAT, 3 * SIZE_OF_FLOAT);

	oceanDeep.triangleCount = oceanIndices.length
	var oceanIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, oceanIndexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(oceanIndices), gl.STATIC_DRAW);

	var initialSpectrumTexture = createTextureFromParams(oceanDeepConst.INITIAL_SPECTRUM_UNIT, gl.RGBA, gl.FLOAT, oceanDeepConst.RESOLUTION, oceanDeepConst.RESOLUTION, null, gl.REPEAT, gl.REPEAT, gl.NEAREST, gl.NEAREST),
		pongPhaseTexture = createTextureFromParams(oceanDeepConst.PONG_PHASE_UNIT, gl.RGBA, gl.FLOAT, oceanDeepConst.RESOLUTION, oceanDeepConst.RESOLUTION, null, gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE, gl.NEAREST, gl.NEAREST),
		spectrumTexture = createTextureFromParams(oceanDeepConst.SPECTRUM_UNIT, gl.RGBA, gl.FLOAT, oceanDeepConst.RESOLUTION, oceanDeepConst.RESOLUTION, null, gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE, gl.NEAREST, gl.NEAREST),
		displacementMap = createTextureFromParams(oceanDeepConst.DISPLACEMENT_MAP_UNIT, gl.RGBA, gl.FLOAT, oceanDeepConst.RESOLUTION, oceanDeepConst.RESOLUTION, null, gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE, gl.LINEAR, gl.LINEAR),
		normalMap = createTextureFromParams(oceanDeepConst.NORMAL_MAP_UNIT, gl.RGBA, gl.FLOAT, oceanDeepConst.RESOLUTION, oceanDeepConst.RESOLUTION, null, gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE, gl.LINEAR, gl.LINEAR),
		pingTransformTexture = createTextureFromParams(oceanDeepConst.PING_TRANSFORM_UNIT, gl.RGBA, gl.FLOAT, oceanDeepConst.RESOLUTION, oceanDeepConst.RESOLUTION, null, gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE, gl.NEAREST, gl.NEAREST),
		pongTransformTexture = createTextureFromParams(oceanDeepConst.PONG_TRANSFORM_UNIT, gl.RGBA, gl.FLOAT, oceanDeepConst.RESOLUTION, oceanDeepConst.RESOLUTION, null, gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE, gl.NEAREST, gl.NEAREST)

	var phaseArray = new Float32Array(oceanDeepConst.RESOLUTION * oceanDeepConst.RESOLUTION * 4);
	for (var i = 0; i < oceanDeepConst.RESOLUTION; i += 1) {
		for (var j = 0; j < oceanDeepConst.RESOLUTION; j += 1) {
			phaseArray[i * oceanDeepConst.RESOLUTION * 4 + j * 4] = Math.random() * 2.0 * Math.PI;
			phaseArray[i * oceanDeepConst.RESOLUTION * 4 + j * 4 + 1] = 0;
			phaseArray[i * oceanDeepConst.RESOLUTION * 4 + j * 4 + 2] = 0;
			phaseArray[i * oceanDeepConst.RESOLUTION * 4 + j * 4 + 3] = 0;
		}
	}
	var pingPhaseTexture = createTextureFromParams(oceanDeepConst.PING_PHASE_UNIT, gl.RGBA, gl.FLOAT, oceanDeepConst.RESOLUTION, oceanDeepConst.RESOLUTION, phaseArray, gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE, gl.NEAREST, gl.NEAREST);

	//changing framebuffers faster than changing attachments in WebGL
	oceanDeep.fboInitialSpectrum = createFramebufferFromTexture(initialSpectrumTexture)
	oceanDeep.fboPingPhaseFramebuffer = createFramebufferFromTexture(pingPhaseTexture)
	oceanDeep.fboPongPhaseFramebuffer = createFramebufferFromTexture(pongPhaseTexture)
	oceanDeep.fboSpectrumFramebuffer = createFramebufferFromTexture(spectrumTexture)
	oceanDeep.fboDisplacementMapFramebuffer = createFramebufferFromTexture(displacementMap)
	oceanDeep.fboNormalMapFramebuffer = createFramebufferFromTexture(normalMap)
	oceanDeep.fboPingTransformFramebuffer = createFramebufferFromTexture(pingTransformTexture)
	oceanDeep.fboPongTransformFramebuffer = createFramebufferFromTexture(pongTransformTexture)
}

function renderForOceanDeep(perspectiveMatrix, viewMatrix, modelMatrix, viewPos) {
	// gl.disable(gl.DEPTH_TEST)

	// gl.bindBuffer(gl.ARRAY_BUFFER, oceanDeep.vboFullscreen)
	// gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)

	// gl.bindFramebuffer(gl.FRAMEBUFFER, oceanDeep.fboInitialSpectrum)
	// gl.useProgram(oceanDeep.progInitialSpectrum)
	// gl.uniform2f(oceanDeep.uniformsInitialSpectrum.wind, oceanDeepConst.windX, oceanDeepConst.windY)
	// gl.uniform1f(oceanDeep.uniformsInitialSpectrum.size, oceanDeepConst.size)
	// gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

	// gl.useProgram(oceanDeep.progPhase)
	// gl.bindFramebuffer(gl.FRAMEBUFFER, oceanDeep.pingPhase ? oceanDeep.fboPongPhaseFramebuffer : oceanDeep.fboPingPhaseFramebuffer)
	// gl.uniform1i(oceanDeep.uniformsPhase.phases, oceanDeep.pingPhase ? oceanDeepConst.PING_PHASE_UNIT : oceanDeepConst.PONG_PHASE_UNIT)
	// gl.uniform1f(oceanDeep.uniformsPhase.deltaTime, 0.1)
	// gl.uniform1f(oceanDeep.uniformsPhase.size, oceanDeepConst.size)
	// oceanDeep.pingPhase = !oceanDeep.pingPhase
	// gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

	// gl.useProgram(oceanDeep.progSpectrum)
	// gl.bindFramebuffer(gl.FRAMEBUFFER, oceanDeep.fboSpectrumFramebuffer)
	// gl.uniform1i(oceanDeep.uniformsSpectrum.phases, oceanDeep.pingPhase ? oceanDeepConst.PING_PHASE_UNIT : oceanDeepConst.PONG_PHASE_UNIT)
	// gl.uniform1f(oceanDeep.uniformsSpectrum.size, oceanDeepConst.size)
	// gl.uniform1f(oceanDeep.uniformsSpectrum.choppiness, oceanDeepConst.choppiness)
	// gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

	// var subtransformUniforms = oceanDeep.uniformsHorizontalSubtransform
	// gl.useProgram(oceanDeep.progHorizontalSubtransform)

	// var iterations = Math.log2(oceanDeepConst.RESOLUTION)
	// for(var i = 0; i < iterations; i++) {
	// 	if(i === 0) {
	// 		gl.bindFramebuffer(gl.FRAMEBUFFER, oceanDeep.fboPingTransformFramebuffer)
	// 		gl.uniform1i(subtransformUniforms.input, oceanDeepConst.SPECTRUM_UNIT)
	// 	} else if(i === iterations - 1) {
	// 		gl.bindFramebuffer(gl.FRAMEBUFFER, oceanDeep.fboDisplacementMapFramebuffer)
	// 		gl.uniform1i(subtransformUniforms.input, (iterations % 2 === 0) ? oceanDeepConst.PING_TRANSFORM_UNIT : oceanDeepConst.PONG_TRANSFORM_UNIT)
	// 	} else if(i % 2 === 1) {
	// 		gl.bindFramebuffer(gl.FRAMEBUFFER, oceanDeep.fboPongTransformFramebuffer)
	// 		gl.uniform1i(subtransformUniforms.input, oceanDeepConst.PING_TRANSFORM_UNIT)
	// 	} else {
	// 		gl.bindFramebuffer(gl.FRAMEBUFFER, oceanDeep.fboPingTransformFramebuffer)
	// 		gl.uniform1i(subtransformUniforms.input, oceanDeepConst.PONG_TRANSFORM_UNIT)	
	// 	}
	// 	if(i === iterations / 2) {
	// 		subtransformUniforms = oceanDeep.uniformsVerticalSubtransform
	// 		gl.useProgram(oceanDeep.progVerticalSubtransform)
	// 	}

	// 	gl.uniform1f(subtransformUniforms.subtransformSize, Math.pow(2 , (i % (iterations / 2)) + 1))
	// 	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
	// }

	// gl.bindFramebuffer(gl.FRAMEBUFFER, oceanDeep.fboNormalMapFramebuffer)
	// gl.useProgram(oceanDeep.progNormalMap)
	// gl.uniform1f(oceanDeep.uniformsNormalMap.size, oceanDeepConst.size)
	// gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

	gl.bindFramebuffer(gl.FRAMEBUFFER, null)
	gl.viewport(0, 0, canvas.width, canvas.height)
	gl.enable(gl.DEPTH_TEST)
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

	gl.enableVertexAttribArray(oceanDeepConst.OCEAN_COORDINATES_UNIT)

	gl.bindBuffer(gl.ARRAY_BUFFER, oceanDeep.vboOceanBuffer)
	gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 5 * SIZE_OF_FLOAT, 0)

	gl.useProgram(oceanDeep.progOcean)
	gl.uniform1f(oceanDeep.uniformsOcean.size, oceanDeepConst.size)
	gl.uniformMatrix4fv(oceanDeep.uniformsOcean.pMat, false, perspectiveMatrix)
	gl.uniformMatrix4fv(oceanDeep.uniformsOcean.vMat, false, viewMatrix)
	gl.uniform3fv(oceanDeep.uniformsOcean.viewPos, viewPos)
	gl.drawElements(gl.TRIANGLES, oceanDeep.triangleCount, gl.UNSIGNED_SHORT, 0)

	gl.disableVertexAttribArray(oceanDeepConst.OCEAN_COORDINATES_UNIT)
}