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
	vaoOcean: null
}

const oceanDeepConst = {
	SIZE_OF_FLOAT: 4,
	INITIAL_SPECTRUM_UNIT: 0,
	SPECTRUM_UNIT: 1,
	DISPLACEMENT_MAP_UNIT: 2,
	NORMAL_MAP_UNIT: 3,
	PING_PHASE_UNIT: 4,
	PONG_PHASE_UNIT: 5,
	PING_TRANSFORM_UNIT: 6,
	PONG_TRANSFORM_UNIT: 7,

	GEOMETRY_ORIGIN: [-1000.0, -1000.0],
	SUN_DIRECTION: [-1.0, 1.0, 1.0],
	OCEAN_COLOR: [0.004, 0.016, 0.047],
	SKY_COLOR: [3.2, 9.6, 12.8],
	EXPOSURE: 0.15,
	GEOMETRY_RESOLUTION: 256,
	GEOMETRY_SIZE: 2000,
	RESOLUTION: 512,
}

function createFramebufferFromTexture(attachment) {
		var framebuffer = gl.createFramebuffer();
		gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, attachment, 0);
		return framebuffer;
}

var createTextureFromParams = function(unit, internalFormat, format, type, width, height, data, wrapS, wrapT, minFilter, magFilter) {
    var texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, width, height, 0, format, type, data);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter);
    return texture;
}

function setupProgramForOceanDeep() {
	oceanDeep.wind = [30.0, 10.0]
	oceanDeep.choppiness = 1.5
	oceanDeep.size = 100

	var fullscreenVertexShader = createShader('shaders/fullscreen.vert', gl.VERTEX_SHADER)

	var horizontalSubtransformFrag = createShader('shaders/horizontalSubtransform.frag', gl.FRAGMENT_SHADER)
	oceanDeep.horizontalSubtransformProgram = createProgram([fullscreenVertexShader, horizontalSubtransformFrag])
	gl.useProgram(oceanDeep.horizontalSubtransformProgram)
	gl.uniform1f(gl.getUniformLocation(oceanDeep.horizontalSubtransformProgram, 'u_transformSize'), oceanDeepConst.RESOLUTION);

	var verticalSubtransformFrag = createShader('shaders/verticalSubtransform.frag', gl.FRAGMENT_SHADER)
	oceanDeep.verticalSubtransformProgram = createProgram([fullscreenVertexShader, verticalSubtransformFrag]);
	gl.useProgram(oceanDeep.verticalSubtransformProgram);
	gl.uniform1f(gl.getUniformLocation(oceanDeep.verticalSubtransformProgram, 'u_transformSize'), oceanDeepConst.RESOLUTION);
	
	var initialSpectrumFrag = createShader('shaders/initialSpectrum.frag', gl.FRAGMENT_SHADER)
	oceanDeep.initialSpectrumProgram = createProgram([fullscreenVertexShader, initialSpectrumFrag]);
	gl.useProgram(oceanDeep.initialSpectrumProgram);
	gl.uniform1f(gl.getUniformLocation(oceanDeep.initialSpectrumProgram, 'u_resolution'), oceanDeepConst.RESOLUTION);

	var phaseFrag = createShader('shaders/phase.frag', gl.FRAGMENT_SHADER)
	oceanDeep.phaseProgram = createProgram([fullscreenVertexShader, phaseFrag]);
	gl.useProgram(oceanDeep.phaseProgram);
	gl.uniform1f(gl.getUniformLocation(oceanDeep.phaseProgram, 'u_resolution'), oceanDeepConst.RESOLUTION);

	var spectrumFrag = createShader('shaders/spectrum.frag', gl.FRAGMENT_SHADER)
	oceanDeep.spectrumProgram = createProgram([fullscreenVertexShader, spectrumFrag]);
	gl.useProgram(oceanDeep.spectrumProgram);
	gl.uniform1i(gl.getUniformLocation(oceanDeep.spectrumProgram, 'u_initialSpectrum'), oceanDeepConst.INITIAL_SPECTRUM_UNIT);
	gl.uniform1f(gl.getUniformLocation(oceanDeep.spectrumProgram, 'u_resolution'), oceanDeepConst.RESOLUTION);

	var normalMapFrag = createShader('shaders/normalMap.frag', gl.FRAGMENT_SHADER)
	oceanDeep.normalMapProgram = createProgram([fullscreenVertexShader, normalMapFrag]);
	gl.useProgram(oceanDeep.normalMapProgram);
	gl.uniform1i(gl.getUniformLocation(oceanDeep.normalMapProgram, 'u_displacementMap'), oceanDeepConst.DISPLACEMENT_MAP_UNIT);
	gl.uniform1f(gl.getUniformLocation(oceanDeep.normalMapProgram, 'u_resolution'), oceanDeepConst.RESOLUTION);

	var oceanVert = createShader('shaders/ocean.vert', gl.VERTEX_SHADER)
	var oceanFrag = createShader('shaders/ocean.frag', gl.FRAGMENT_SHADER)
	oceanDeep.oceanProgram = createProgram([oceanVert, oceanFrag]);
	gl.useProgram(oceanDeep.oceanProgram);
	gl.uniform1f(gl.getUniformLocation(oceanDeep.oceanProgram, 'u_geometrySize'), oceanDeepConst.GEOMETRY_SIZE);
	gl.uniform1i(gl.getUniformLocation(oceanDeep.oceanProgram, 'u_displacementMap'), oceanDeepConst.DISPLACEMENT_MAP_UNIT);
	gl.uniform1i(gl.getUniformLocation(oceanDeep.oceanProgram, 'u_normalMap'), oceanDeepConst.NORMAL_MAP_UNIT);
	gl.uniform3fv(gl.getUniformLocation(oceanDeep.oceanProgram, 'u_oceanColor'), oceanDeepConst.OCEAN_COLOR);
	gl.uniform3fv(gl.getUniformLocation(oceanDeep.oceanProgram, 'u_skyColor'), oceanDeepConst.SKY_COLOR);
	gl.uniform3fv(gl.getUniformLocation(oceanDeep.oceanProgram, 'u_sunDirection'), oceanDeepConst.SUN_DIRECTION);
	gl.uniform1f(gl.getUniformLocation(oceanDeep.oceanProgram, 'u_exposure'), oceanDeepConst.EXPOSURE);
}

function initForOceanDeep() {
	gl.getExtension('OES_texture_float');
	gl.getExtension('OES_texture_float_linear');

	
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

	var initialSpectrumTexture = createTextureFromParams(oceanDeepConst.INITIAL_SPECTRUM_UNIT, gl.RGBA16F, gl.RGBA, gl.FLOAT, oceanDeepConst.RESOLUTION, oceanDeepConst.RESOLUTION, null, gl.REPEAT, gl.REPEAT, gl.NEAREST, gl.NEAREST)
	var pongPhaseTexture = createTextureFromParams(oceanDeepConst.PONG_PHASE_UNIT, gl.RGBA16F, gl.RGBA, gl.FLOAT, oceanDeepConst.RESOLUTION, oceanDeepConst.RESOLUTION, null, gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE, gl.NEAREST, gl.NEAREST)
	var spectrumTexture = createTextureFromParams(oceanDeepConst.SPECTRUM_UNIT, gl.RGBA16F, gl.RGBA, gl.FLOAT, oceanDeepConst.RESOLUTION, oceanDeepConst.RESOLUTION, null, gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE, gl.NEAREST, gl.NEAREST)
	var displacementMap = createTextureFromParams(oceanDeepConst.DISPLACEMENT_MAP_UNIT, gl.RGBA16F, gl.RGBA, gl.FLOAT, oceanDeepConst.RESOLUTION, oceanDeepConst.RESOLUTION, null, gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE, gl.LINEAR, gl.LINEAR)
	var normalMap = createTextureFromParams(oceanDeepConst.NORMAL_MAP_UNIT, gl.RGBA16F, gl.RGBA, gl.FLOAT, oceanDeepConst.RESOLUTION, oceanDeepConst.RESOLUTION, null, gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE, gl.LINEAR, gl.LINEAR)
	var pingTransformTexture = createTextureFromParams(oceanDeepConst.PING_TRANSFORM_UNIT, gl.RGBA16F, gl.RGBA, gl.FLOAT, oceanDeepConst.RESOLUTION, oceanDeepConst.RESOLUTION, null, gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE, gl.NEAREST, gl.NEAREST)
	var pongTransformTexture = createTextureFromParams(oceanDeepConst.PONG_TRANSFORM_UNIT, gl.RGBA16F, gl.RGBA, gl.FLOAT, oceanDeepConst.RESOLUTION, oceanDeepConst.RESOLUTION, null, gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE, gl.NEAREST, gl.NEAREST)

	var phaseArray = new Float32Array(oceanDeepConst.RESOLUTION * oceanDeepConst.RESOLUTION * 4);
	for (var i = 0; i < oceanDeepConst.RESOLUTION; i += 1) {
		for (var j = 0; j < oceanDeepConst.RESOLUTION; j += 1) {
			phaseArray[i * oceanDeepConst.RESOLUTION * 4 + j * 4] = Math.random() * 2.0 * Math.PI;
			phaseArray[i * oceanDeepConst.RESOLUTION * 4 + j * 4 + 1] = 0;
			phaseArray[i * oceanDeepConst.RESOLUTION * 4 + j * 4 + 2] = 0;
			phaseArray[i * oceanDeepConst.RESOLUTION * 4 + j * 4 + 3] = 0;
		}
	}
	var pingPhaseTexture = createTextureFromParams(oceanDeepConst.PING_PHASE_UNIT, gl.RGBA16F, gl.RGBA, gl.FLOAT, oceanDeepConst.RESOLUTION, oceanDeepConst.RESOLUTION, phaseArray, gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE, gl.NEAREST, gl.NEAREST);

	//changing framebuffers faster than changing attachments in WebGL
	oceanDeep.initialSpectrumFramebuffer = createFramebufferFromTexture(initialSpectrumTexture)
	oceanDeep.pingPhaseFramebuffer = createFramebufferFromTexture(pingPhaseTexture)
	oceanDeep.pongPhaseFramebuffer = createFramebufferFromTexture(pongPhaseTexture)
	oceanDeep.spectrumFramebuffer = createFramebufferFromTexture(spectrumTexture)
	oceanDeep.displacementMapFramebuffer = createFramebufferFromTexture(displacementMap)
	oceanDeep.normalMapFramebuffer = createFramebufferFromTexture(normalMap)
	oceanDeep.pingTransformFramebuffer = createFramebufferFromTexture(pingTransformTexture)
	oceanDeep.pongTransformFramebuffer = createFramebufferFromTexture(pongTransformTexture)
}

function renderForOceanDeep(projectionMatrix, viewMatrix, cameraPosition, modelMatrix) {
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
	gl.uniform1i(gl.getUniformLocation(oceanDeep.phaseProgram, 'u_phases'), oceanDeep.pingPhase ? oceanDeepConst.PING_PHASE_UNIT : oceanDeepConst.PONG_PHASE_UNIT);
	oceanDeep.pingPhase = !oceanDeep.pingPhase;
	gl.uniform1f(gl.getUniformLocation(oceanDeep.phaseProgram, 'u_deltaTime'), 0.005);
	gl.uniform1f(gl.getUniformLocation(oceanDeep.phaseProgram, 'u_size'), oceanDeep.size);
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

	gl.useProgram(oceanDeep.spectrumProgram);
	gl.bindFramebuffer(gl.FRAMEBUFFER, oceanDeep.spectrumFramebuffer);
	gl.uniform1i(gl.getUniformLocation(oceanDeep.spectrumProgram, 'u_phases'), oceanDeep.pingPhase ? oceanDeepConst.PING_PHASE_UNIT : oceanDeepConst.PONG_PHASE_UNIT);
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
			gl.uniform1i(gl.getUniformLocation(subtransformProgram, 'u_input'), oceanDeepConst.SPECTRUM_UNIT);
		} else if (i === iterations - 1) {
			gl.bindFramebuffer(gl.FRAMEBUFFER, oceanDeep.displacementMapFramebuffer);
			gl.uniform1i(gl.getUniformLocation(subtransformProgram, 'u_input'), (iterations % 2 === 0) ? oceanDeepConst.PING_TRANSFORM_UNIT : oceanDeepConst.PONG_TRANSFORM_UNIT);
		} else if (i % 2 === 1) {
			gl.bindFramebuffer(gl.FRAMEBUFFER, oceanDeep.pongTransformFramebuffer);
			gl.uniform1i(gl.getUniformLocation(subtransformProgram, 'u_input'), oceanDeepConst.PING_TRANSFORM_UNIT);
		} else {
			gl.bindFramebuffer(gl.FRAMEBUFFER, oceanDeep.pingTransformFramebuffer);
			gl.uniform1i(gl.getUniformLocation(subtransformProgram, 'u_input'), oceanDeepConst.PONG_TRANSFORM_UNIT);
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
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.enable(gl.DEPTH_TEST);
	gl.clearBufferfv(gl.COLOR, 0, [0.6, 0.6, 0.6, 1.0])
	gl.clearBufferfv(gl.DEPTH, 0, [1.0])

	gl.bindVertexArray(oceanDeep.vaoOcean)

	gl.useProgram(oceanDeep.oceanProgram);
	gl.uniform1f(gl.getUniformLocation(oceanDeep.oceanProgram, 'u_size'), oceanDeep.size);
	gl.uniformMatrix4fv(gl.getUniformLocation(oceanDeep.oceanProgram, 'u_projectionMatrix'), false, projectionMatrix);
	gl.uniformMatrix4fv(gl.getUniformLocation(oceanDeep.oceanProgram, 'u_viewMatrix'), false, viewMatrix);
	gl.uniformMatrix4fv(gl.getUniformLocation(oceanDeep.oceanProgram, 'u_modelMatrix'), false, modelMatrix);
	gl.uniform3fv(gl.getUniformLocation(oceanDeep.oceanProgram, 'u_cameraPosition'), cameraPosition);
	gl.drawElements(gl.TRIANGLES, oceanDeep.countOfIndicesOcean, gl.UNSIGNED_SHORT, 0);	
}
