var oceanDeep = {
	wind: null,
	size: null,
	choppiness: null,
	fullscreenVertexBuffer: null,
	initialSpectrumFramebuffer: null,
	pingPhaseFramebuffer: null,
	pongPhaseFramebuffer: null,
	spectrumFramebuffer: null,
	displacementMapFramebuffer: null,
	normalMapFramebuffer: null,
	pingTransformFramebuffer: null,
	pongTransformFramebuffer: null,
	horizontalSubtransformProgram: null,
	verticalSubtransformProgram: null,
	initialSpectrumProgram: null,
	phaseProgram: null,
	spectrumProgram: null,
	normalMapProgram: null,
	oceanProgram: null,
	pingPhase: true,
	oceanBuffer: null,
	countOfIndicesOcean: null,
	vaoFullscreen: null,
	vaoOcean: null,
	initialSpectrumTexture: null,
	pingPhaseTexture: null,
	pongPhaseTexture: null,
	spectrumTexture: null,
	displacementMap: null,
	normalMap: null,
	pingTransformTexture: null,
	pongTransformTexture: null,
}

const oceanDeepConst = {
	SIZE_OF_FLOAT: 4,
	GEOMETRY_ORIGIN: [-200.0, -200.0],
	SUN_DIRECTION: [-1.0, 1.0, 1.0],
	OCEAN_COLOR: [0.004, 0.016, 0.047],
	SKY_COLOR: [3.2, 9.6, 12.8],
	EXPOSURE: 0.15,
	GEOMETRY_RESOLUTION: 256,
	GEOMETRY_SIZE: 400,
	RESOLUTION: 512,
}

function createFramebufferFromTexture(attachment) {
		var framebuffer = gl.createFramebuffer();
		gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, attachment, 0);
		return framebuffer;
}

var createTextureFromParams = function(internalFormat, format, type, width, height, data, wrapS, wrapT, minFilter, magFilter) {
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, width, height, 0, format, type, data);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter);
    gl.bindTexture(gl.TEXTURE_2D, null);
    return texture;
}

function setupProgramForOceanDeep() {
	oceanDeep.wind = [6.0, 0.0]
	oceanDeep.choppiness = 0.5
	oceanDeep.size = 300

	var fullscreenVertexShader = createShader('OpenCloseScene/shaders/fullscreen.vert', gl.VERTEX_SHADER)

	var horizontalSubtransformFrag = createShader('OpenCloseScene/shaders/horizontalSubtransform.frag', gl.FRAGMENT_SHADER)
	oceanDeep.horizontalSubtransformProgram = createProgram([fullscreenVertexShader, horizontalSubtransformFrag])
	gl.useProgram(oceanDeep.horizontalSubtransformProgram)
	gl.uniform1f(gl.getUniformLocation(oceanDeep.horizontalSubtransformProgram, 'u_transformSize'), oceanDeepConst.RESOLUTION);

	var verticalSubtransformFrag = createShader('OpenCloseScene/shaders/verticalSubtransform.frag', gl.FRAGMENT_SHADER)
	oceanDeep.verticalSubtransformProgram = createProgram([fullscreenVertexShader, verticalSubtransformFrag]);
	gl.useProgram(oceanDeep.verticalSubtransformProgram);
	gl.uniform1f(gl.getUniformLocation(oceanDeep.verticalSubtransformProgram, 'u_transformSize'), oceanDeepConst.RESOLUTION);
	
	var initialSpectrumFrag = createShader('OpenCloseScene/shaders/initialSpectrum.frag', gl.FRAGMENT_SHADER)
	oceanDeep.initialSpectrumProgram = createProgram([fullscreenVertexShader, initialSpectrumFrag]);
	gl.useProgram(oceanDeep.initialSpectrumProgram);
	gl.uniform1f(gl.getUniformLocation(oceanDeep.initialSpectrumProgram, 'u_resolution'), oceanDeepConst.RESOLUTION);

	var phaseFrag = createShader('OpenCloseScene/shaders/phase.frag', gl.FRAGMENT_SHADER)
	oceanDeep.phaseProgram = createProgram([fullscreenVertexShader, phaseFrag]);
	gl.useProgram(oceanDeep.phaseProgram);
	gl.uniform1f(gl.getUniformLocation(oceanDeep.phaseProgram, 'u_resolution'), oceanDeepConst.RESOLUTION);

	var spectrumFrag = createShader('OpenCloseScene/shaders/spectrum.frag', gl.FRAGMENT_SHADER)
	oceanDeep.spectrumProgram = createProgram([fullscreenVertexShader, spectrumFrag]);
	gl.useProgram(oceanDeep.spectrumProgram);
	gl.uniform1f(gl.getUniformLocation(oceanDeep.spectrumProgram, 'u_resolution'), oceanDeepConst.RESOLUTION);

	var normalMapFrag = createShader('OpenCloseScene/shaders/normalMap.frag', gl.FRAGMENT_SHADER)
	oceanDeep.normalMapProgram = createProgram([fullscreenVertexShader, normalMapFrag]);
	gl.useProgram(oceanDeep.normalMapProgram);
	gl.uniform1f(gl.getUniformLocation(oceanDeep.normalMapProgram, 'u_resolution'), oceanDeepConst.RESOLUTION);

	var oceanVert = createShader('OpenCloseScene/shaders/ocean.vert', gl.VERTEX_SHADER)
	var oceanFrag = createShader('OpenCloseScene/shaders/ocean.frag', gl.FRAGMENT_SHADER)
	oceanDeep.oceanProgram = createProgram([oceanVert, oceanFrag]);
	gl.useProgram(oceanDeep.oceanProgram);
	gl.uniform1f(gl.getUniformLocation(oceanDeep.oceanProgram, 'u_geometrySize'), oceanDeepConst.GEOMETRY_SIZE);
	gl.uniform3fv(gl.getUniformLocation(oceanDeep.oceanProgram, 'u_sunDirection'), oceanDeepConst.SUN_DIRECTION);
	gl.uniform1f(gl.getUniformLocation(oceanDeep.oceanProgram, 'u_exposure'), oceanDeepConst.EXPOSURE);
}

function initForOceanDeep() {
	oceanDeep.vaoFullscreen = gl.createVertexArray()
	gl.bindVertexArray(oceanDeep.vaoFullscreen)
	oceanDeep.fullscreenVertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, oceanDeep.fullscreenVertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0]), gl.STATIC_DRAW);
	gl.enableVertexAttribArray(0);
	gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
	
	oceanDeep.vaoOcean = gl.createVertexArray()
	gl.bindVertexArray(oceanDeep.vaoOcean)
	var oceanData = [];
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

	oceanDeep.oceanBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, oceanDeep.oceanBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(oceanData), gl.STATIC_DRAW);
	gl.enableVertexAttribArray(0)
	gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 5 * oceanDeepConst.SIZE_OF_FLOAT, 0);
	gl.enableVertexAttribArray(1)
	gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 5 * oceanDeepConst.SIZE_OF_FLOAT, 3 * oceanDeepConst.SIZE_OF_FLOAT);

	oceanDeep.countOfIndicesOcean = oceanIndices.length
	var oceanIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, oceanIndexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(oceanIndices), gl.STATIC_DRAW);

	gl.bindVertexArray(null)

	oceanDeep.initialSpectrumTexture = createTextureFromParams(gl.RGBA16F, gl.RGBA, gl.FLOAT, oceanDeepConst.RESOLUTION, oceanDeepConst.RESOLUTION, null, gl.REPEAT, gl.REPEAT, gl.NEAREST, gl.NEAREST)
	oceanDeep.pongPhaseTexture = createTextureFromParams(gl.RGBA16F, gl.RGBA, gl.FLOAT, oceanDeepConst.RESOLUTION, oceanDeepConst.RESOLUTION, null, gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE, gl.NEAREST, gl.NEAREST)
	oceanDeep.spectrumTexture = createTextureFromParams(gl.RGBA16F, gl.RGBA, gl.FLOAT, oceanDeepConst.RESOLUTION, oceanDeepConst.RESOLUTION, null, gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE, gl.NEAREST, gl.NEAREST)
	oceanDeep.displacementMap = createTextureFromParams(gl.RGBA16F, gl.RGBA, gl.FLOAT, oceanDeepConst.RESOLUTION, oceanDeepConst.RESOLUTION, null, gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE, gl.LINEAR, gl.LINEAR)
	oceanDeep.normalMap = createTextureFromParams(gl.RGBA16F, gl.RGBA, gl.FLOAT, oceanDeepConst.RESOLUTION, oceanDeepConst.RESOLUTION, null, gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE, gl.LINEAR, gl.LINEAR)
	oceanDeep.pingTransformTexture = createTextureFromParams(gl.RGBA16F, gl.RGBA, gl.FLOAT, oceanDeepConst.RESOLUTION, oceanDeepConst.RESOLUTION, null, gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE, gl.NEAREST, gl.NEAREST)
	oceanDeep.pongTransformTexture = createTextureFromParams(gl.RGBA16F, gl.RGBA, gl.FLOAT, oceanDeepConst.RESOLUTION, oceanDeepConst.RESOLUTION, null, gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE, gl.NEAREST, gl.NEAREST)

	var phaseArray = new Float32Array(oceanDeepConst.RESOLUTION * oceanDeepConst.RESOLUTION * 4);
	for (var i = 0; i < oceanDeepConst.RESOLUTION; i += 1) {
		for (var j = 0; j < oceanDeepConst.RESOLUTION; j += 1) {
			phaseArray[i * oceanDeepConst.RESOLUTION * 4 + j * 4] = Math.random() * 2.0 * Math.PI;
			phaseArray[i * oceanDeepConst.RESOLUTION * 4 + j * 4 + 1] = 0;
			phaseArray[i * oceanDeepConst.RESOLUTION * 4 + j * 4 + 2] = 0;
			phaseArray[i * oceanDeepConst.RESOLUTION * 4 + j * 4 + 3] = 0;
		}
	}
	oceanDeep.pingPhaseTexture = createTextureFromParams(gl.RGBA16F, gl.RGBA, gl.FLOAT, oceanDeepConst.RESOLUTION, oceanDeepConst.RESOLUTION, phaseArray, gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE, gl.NEAREST, gl.NEAREST);

	//changing framebuffers faster than changing attachments in WebGL
	oceanDeep.initialSpectrumFramebuffer = createFramebufferFromTexture(oceanDeep.initialSpectrumTexture)
	oceanDeep.pingPhaseFramebuffer = createFramebufferFromTexture(oceanDeep.pingPhaseTexture)
	oceanDeep.pongPhaseFramebuffer = createFramebufferFromTexture(oceanDeep.pongPhaseTexture)
	oceanDeep.spectrumFramebuffer = createFramebufferFromTexture(oceanDeep.spectrumTexture)
	oceanDeep.displacementMapFramebuffer = createFramebufferFromTexture(oceanDeep.displacementMap)
	oceanDeep.normalMapFramebuffer = createFramebufferFromTexture(oceanDeep.normalMap)
	oceanDeep.pingTransformFramebuffer = createFramebufferFromTexture(oceanDeep.pingTransformTexture)
	oceanDeep.pongTransformFramebuffer = createFramebufferFromTexture(oceanDeep.pongTransformTexture)
}

function renderForOceanDeep(projectionMatrix, viewMatrix, cameraPosition, modelMatrix, skycolor, oceancolor) {
	var currentFbo = gl.getParameter(gl.FRAMEBUFFER_BINDING)
	var currentViewport = gl.getParameter(gl.VIEWPORT)

	gl.viewport(0, 0, oceanDeepConst.RESOLUTION, oceanDeepConst.RESOLUTION);
	gl.disable(gl.DEPTH_TEST);

	gl.bindVertexArray(oceanDeep.vaoFullscreen)

	gl.bindFramebuffer(gl.FRAMEBUFFER, oceanDeep.initialSpectrumFramebuffer);
	gl.useProgram(oceanDeep.initialSpectrumProgram);
	gl.uniform2fv(gl.getUniformLocation(oceanDeep.initialSpectrumProgram, 'u_wind'), oceanDeep.wind);
	gl.uniform1f(gl.getUniformLocation(oceanDeep.initialSpectrumProgram, 'u_size'), oceanDeep.size);
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

	//store phases separately to ensure continuity of waves during parameter editing
	gl.useProgram(oceanDeep.phaseProgram);
	gl.bindFramebuffer(gl.FRAMEBUFFER, oceanDeep.pingPhase ? oceanDeep.pongPhaseFramebuffer : oceanDeep.pingPhaseFramebuffer);
	gl.activeTexture(gl.TEXTURE20)
	gl.bindTexture(gl.TEXTURE_2D, oceanDeep.pingPhase ? oceanDeep.pingPhaseTexture : oceanDeep.pongPhaseTexture)
	gl.uniform1i(gl.getUniformLocation(oceanDeep.phaseProgram, 'u_phases'), 20);
	oceanDeep.pingPhase = !oceanDeep.pingPhase;
	gl.uniform1f(gl.getUniformLocation(oceanDeep.phaseProgram, 'u_deltaTime'), 0.005);
	gl.uniform1f(gl.getUniformLocation(oceanDeep.phaseProgram, 'u_size'), oceanDeep.size);
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

	gl.useProgram(oceanDeep.spectrumProgram);
	gl.bindFramebuffer(gl.FRAMEBUFFER, oceanDeep.spectrumFramebuffer);
	gl.activeTexture(gl.TEXTURE20)
	gl.bindTexture(gl.TEXTURE_2D, oceanDeep.pingPhase ? oceanDeep.pingPhaseTexture : oceanDeep.pongPhaseTexture)
	gl.uniform1i(gl.getUniformLocation(oceanDeep.spectrumProgram, 'u_phases'), 20);
	gl.activeTexture(gl.TEXTURE21)
	gl.bindTexture(gl.TEXTURE_2D, oceanDeep.initialSpectrumTexture)
	gl.uniform1i(gl.getUniformLocation(oceanDeep.spectrumProgram, 'u_initialSpectrum'), 21);
	gl.uniform1f(gl.getUniformLocation(oceanDeep.spectrumProgram, 'u_size'), oceanDeep.size);
	gl.uniform1f(gl.getUniformLocation(oceanDeep.spectrumProgram, 'u_choppiness'), oceanDeep.choppiness);
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

	var subtransformProgram = oceanDeep.horizontalSubtransformProgram;
	gl.useProgram(oceanDeep.horizontalSubtransformProgram);

	//GPU FFT using Stockham formulation
	var iterations = Math.log2(oceanDeepConst.RESOLUTION) * 2;
	for (var i = 0; i < iterations; i += 1) {
		if (i === 0) {
			gl.bindFramebuffer(gl.FRAMEBUFFER, oceanDeep.pingTransformFramebuffer);
			gl.activeTexture(gl.TEXTURE20)
			gl.bindTexture(gl.TEXTURE_2D, oceanDeep.spectrumTexture)
			gl.uniform1i(gl.getUniformLocation(subtransformProgram, 'u_input'), 20);
		} else if (i === iterations - 1) {
			gl.bindFramebuffer(gl.FRAMEBUFFER, oceanDeep.displacementMapFramebuffer);
			gl.activeTexture(gl.TEXTURE20)
			gl.bindTexture(gl.TEXTURE_2D, (iterations % 2 === 0) ? oceanDeep.pingTransformTexture : oceanDeep.pongTransformTexture)
			gl.uniform1i(gl.getUniformLocation(subtransformProgram, 'u_input'), 20);
		} else if (i % 2 === 1) {
			gl.bindFramebuffer(gl.FRAMEBUFFER, oceanDeep.pongTransformFramebuffer);
			gl.activeTexture(gl.TEXTURE20)
			gl.bindTexture(gl.TEXTURE_2D, oceanDeep.pingTransformTexture)
			gl.uniform1i(gl.getUniformLocation(subtransformProgram, 'u_input'), 20);
		} else {
			gl.bindFramebuffer(gl.FRAMEBUFFER, oceanDeep.pingTransformFramebuffer);
			gl.activeTexture(gl.TEXTURE20)
			gl.bindTexture(gl.TEXTURE_2D, oceanDeep.pongTransformTexture)
			gl.uniform1i(gl.getUniformLocation(subtransformProgram, 'u_input'), 20);
		}

		if (i === iterations / 2) {
			subtransformProgram = oceanDeep.verticalSubtransformProgram;
			gl.useProgram(oceanDeep.verticalSubtransformProgram);
		}

		gl.uniform1f(gl.getUniformLocation(subtransformProgram, 'u_subtransformSize'), Math.pow(2,(i % (iterations / 2)) + 1));
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
	}

	gl.bindFramebuffer(gl.FRAMEBUFFER, oceanDeep.normalMapFramebuffer);
	gl.useProgram(oceanDeep.normalMapProgram);
	gl.uniform1f(gl.getUniformLocation(oceanDeep.normalMapProgram, 'u_size'), oceanDeep.size);
	gl.activeTexture(gl.TEXTURE20)
	gl.bindTexture(gl.TEXTURE_2D, oceanDeep.displacementMap)
	gl.uniform1i(gl.getUniformLocation(oceanDeep.normalMapProgram, 'u_displacementMap'), 20);
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

	gl.bindFramebuffer(gl.FRAMEBUFFER, currentFbo);
	gl.viewport(currentViewport[0], currentViewport[1], currentViewport[2], currentViewport[3]);
	gl.enable(gl.DEPTH_TEST);

	gl.bindVertexArray(oceanDeep.vaoOcean)

	gl.useProgram(oceanDeep.oceanProgram);
	gl.uniform1f(gl.getUniformLocation(oceanDeep.oceanProgram, 'u_size'), oceanDeep.size);
	gl.uniformMatrix4fv(gl.getUniformLocation(oceanDeep.oceanProgram, 'u_projectionMatrix'), false, projectionMatrix);
	gl.uniformMatrix4fv(gl.getUniformLocation(oceanDeep.oceanProgram, 'u_viewMatrix'), false, viewMatrix);
	gl.uniformMatrix4fv(gl.getUniformLocation(oceanDeep.oceanProgram, 'u_modelMatrix'), false, modelMatrix);
	gl.uniform3fv(gl.getUniformLocation(oceanDeep.oceanProgram, 'u_cameraPosition'), cameraPosition);
	gl.activeTexture(gl.TEXTURE20)
	gl.bindTexture(gl.TEXTURE_2D, oceanDeep.displacementMap)
	gl.uniform1i(gl.getUniformLocation(oceanDeep.oceanProgram, 'u_displacementMap'), 20);
	gl.activeTexture(gl.TEXTURE21)
	gl.bindTexture(gl.TEXTURE_2D, oceanDeep.normalMap)
	gl.uniform1i(gl.getUniformLocation(oceanDeep.oceanProgram, 'u_normalMap'), 21);
	gl.uniform3fv(gl.getUniformLocation(oceanDeep.oceanProgram, 'u_skyColor'), skycolor);
	gl.uniform3fv(gl.getUniformLocation(oceanDeep.oceanProgram, 'u_oceanColor'), oceancolor);
	gl.drawElements(gl.TRIANGLES, oceanDeep.countOfIndicesOcean, gl.UNSIGNED_SHORT, 0);	
}
