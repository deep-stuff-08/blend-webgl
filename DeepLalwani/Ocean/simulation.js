oceanDeep = {
	windX: INITIAL_WIND[0],
	windY: INITIAL_WIND[1],
	size: INITIAL_SIZE,
	choppiness: INITIAL_CHOPPINESS,
	changed: true,
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
}

function initMyOcean() {
	gl.getExtension('OES_texture_float');
	gl.getExtension('OES_texture_float_linear');

	var fullscreenVertexShader = createShader('shaders/fullscreen.vert', gl.VERTEX_SHADER)

	var horizontalSubtransformFrag = createShader('shaders/horizontalSubtransform.frag', gl.FRAGMENT_SHADER)
	oceanDeep.horizontalSubtransformProgram = createProgram([fullscreenVertexShader, horizontalSubtransformFrag])
	gl.useProgram(oceanDeep.horizontalSubtransformProgram)
	gl.uniform1f(gl.getUniformLocation(oceanDeep.horizontalSubtransformProgram, 'u_transformSize'), RESOLUTION);

	var verticalSubtransformFrag = createShader('shaders/verticalSubtransform.frag', gl.FRAGMENT_SHADER)
	oceanDeep.verticalSubtransformProgram = createProgram([fullscreenVertexShader, verticalSubtransformFrag]);
	gl.useProgram(oceanDeep.verticalSubtransformProgram);
	gl.uniform1f(gl.getUniformLocation(oceanDeep.verticalSubtransformProgram, 'u_transformSize'), RESOLUTION);
	
	var initialSpectrumFrag = createShader('shaders/initialSpectrum.frag', gl.FRAGMENT_SHADER)
	oceanDeep.initialSpectrumProgram = createProgram([fullscreenVertexShader, initialSpectrumFrag]);
	gl.useProgram(oceanDeep.initialSpectrumProgram);
	gl.uniform1f(gl.getUniformLocation(oceanDeep.initialSpectrumProgram, 'u_resolution'), RESOLUTION);

	var phaseFrag = createShader('shaders/phase.frag', gl.FRAGMENT_SHADER)
	oceanDeep.phaseProgram = createProgram([fullscreenVertexShader, phaseFrag]);
	gl.useProgram(oceanDeep.phaseProgram);
	gl.uniform1f(gl.getUniformLocation(oceanDeep.phaseProgram, 'u_resolution'), RESOLUTION);

	var spectrumFrag = createShader('shaders/spectrum.frag', gl.FRAGMENT_SHADER)
	oceanDeep.spectrumProgram = createProgram([fullscreenVertexShader, spectrumFrag]);
	gl.useProgram(oceanDeep.spectrumProgram);
	gl.uniform1i(gl.getUniformLocation(oceanDeep.spectrumProgram, 'u_initialSpectrum'), INITIAL_SPECTRUM_UNIT);
	gl.uniform1f(gl.getUniformLocation(oceanDeep.spectrumProgram, 'u_resolution'), RESOLUTION);

	var normalMapFrag = createShader('shaders/normalMap.frag', gl.FRAGMENT_SHADER)
	oceanDeep.normalMapProgram = createProgram([fullscreenVertexShader, normalMapFrag]);
	gl.useProgram(oceanDeep.normalMapProgram);
	gl.uniform1i(gl.getUniformLocation(oceanDeep.normalMapProgram, 'u_displacementMap'), DISPLACEMENT_MAP_UNIT);
	gl.uniform1f(gl.getUniformLocation(oceanDeep.normalMapProgram, 'u_resolution'), RESOLUTION);

	var oceanVert = createShader('shaders/ocean.vert', gl.VERTEX_SHADER)
	var oceanFrag = createShader('shaders/ocean.frag', gl.FRAGMENT_SHADER)
	oceanDeep.oceanProgram = createProgram([oceanVert, oceanFrag]);
	gl.useProgram(oceanDeep.oceanProgram);
	gl.uniform1f(gl.getUniformLocation(oceanDeep.oceanProgram, 'u_geometrySize'), GEOMETRY_SIZE);
	gl.uniform1i(gl.getUniformLocation(oceanDeep.oceanProgram, 'u_displacementMap'), DISPLACEMENT_MAP_UNIT);
	gl.uniform1i(gl.getUniformLocation(oceanDeep.oceanProgram, 'u_normalMap'), NORMAL_MAP_UNIT);
	gl.uniform3fv(gl.getUniformLocation(oceanDeep.oceanProgram, 'u_oceanColor'), OCEAN_COLOR);
	gl.uniform3fv(gl.getUniformLocation(oceanDeep.oceanProgram, 'u_skyColor'), SKY_COLOR);
	gl.uniform3fv(gl.getUniformLocation(oceanDeep.oceanProgram, 'u_sunDirection'), SUN_DIRECTION);
	gl.uniform1f(gl.getUniformLocation(oceanDeep.oceanProgram, 'u_exposure'), EXPOSURE);

	gl.enableVertexAttribArray(0);

	oceanDeep.fullscreenVertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, oceanDeep.fullscreenVertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0]), gl.STATIC_DRAW);
	
	var oceanData = [];
	for (var zIndex = 0; zIndex < GEOMETRY_RESOLUTION; zIndex += 1) {
		for (var xIndex = 0; xIndex < GEOMETRY_RESOLUTION; xIndex += 1) {
			oceanData.push((xIndex * GEOMETRY_SIZE) / (GEOMETRY_RESOLUTION - 1) + GEOMETRY_ORIGIN[0]);
			oceanData.push((0.0));
			oceanData.push((zIndex * GEOMETRY_SIZE) / (GEOMETRY_RESOLUTION - 1) + GEOMETRY_ORIGIN[1]);
			oceanData.push(xIndex / (GEOMETRY_RESOLUTION - 1));
			oceanData.push(zIndex / (GEOMETRY_RESOLUTION - 1));
		}
	}
	
	var oceanIndices = [];
	for (var zIndex = 0; zIndex < GEOMETRY_RESOLUTION - 1; zIndex += 1) {
		for (var xIndex = 0; xIndex < GEOMETRY_RESOLUTION - 1; xIndex += 1) {
			var topLeft = zIndex * GEOMETRY_RESOLUTION + xIndex,
				topRight = topLeft + 1,
				bottomLeft = topLeft + GEOMETRY_RESOLUTION,
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
	gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 5 * SIZE_OF_FLOAT, 3 * SIZE_OF_FLOAT);

	oceanDeep.countOfIndicesOcean = oceanIndices.length
	var oceanIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, oceanIndexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(oceanIndices), gl.STATIC_DRAW);

	var initialSpectrumTexture = buildTexture(gl, INITIAL_SPECTRUM_UNIT, gl.RGBA, gl.FLOAT, RESOLUTION, RESOLUTION, null, gl.REPEAT, gl.REPEAT, gl.NEAREST, gl.NEAREST),
		pongPhaseTexture = buildTexture(gl, PONG_PHASE_UNIT, gl.RGBA, gl.FLOAT, RESOLUTION, RESOLUTION, null, gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE, gl.NEAREST, gl.NEAREST),
		spectrumTexture = buildTexture(gl, SPECTRUM_UNIT, gl.RGBA, gl.FLOAT, RESOLUTION, RESOLUTION, null, gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE, gl.NEAREST, gl.NEAREST),
		displacementMap = buildTexture(gl, DISPLACEMENT_MAP_UNIT, gl.RGBA, gl.FLOAT, RESOLUTION, RESOLUTION, null, gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE, gl.LINEAR, gl.LINEAR),
		normalMap = buildTexture(gl, NORMAL_MAP_UNIT, gl.RGBA, gl.FLOAT, RESOLUTION, RESOLUTION, null, gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE, gl.LINEAR, gl.LINEAR),
		pingTransformTexture = buildTexture(gl, PING_TRANSFORM_UNIT, gl.RGBA, gl.FLOAT, RESOLUTION, RESOLUTION, null, gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE, gl.NEAREST, gl.NEAREST),
		pongTransformTexture = buildTexture(gl, PONG_TRANSFORM_UNIT, gl.RGBA, gl.FLOAT, RESOLUTION, RESOLUTION, null, gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE, gl.NEAREST, gl.NEAREST);

	var phaseArray = new Float32Array(RESOLUTION * RESOLUTION * 4);
	for (var i = 0; i < RESOLUTION; i += 1) {
		for (var j = 0; j < RESOLUTION; j += 1) {
			phaseArray[i * RESOLUTION * 4 + j * 4] = Math.random() * 2.0 * Math.PI;
			phaseArray[i * RESOLUTION * 4 + j * 4 + 1] = 0;
			phaseArray[i * RESOLUTION * 4 + j * 4 + 2] = 0;
			phaseArray[i * RESOLUTION * 4 + j * 4 + 3] = 0;
		}
	}
	var pingPhaseTexture = buildTexture(gl, PING_PHASE_UNIT, gl.RGBA, gl.FLOAT, RESOLUTION, RESOLUTION, phaseArray, gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE, gl.NEAREST, gl.NEAREST);

	//changing framebuffers faster than changing attachments in WebGL
	oceanDeep.initialSpectrumFramebuffer = buildFramebuffer(gl, initialSpectrumTexture)
	oceanDeep.pingPhaseFramebuffer = buildFramebuffer(gl, pingPhaseTexture)
	oceanDeep.pongPhaseFramebuffer = buildFramebuffer(gl, pongPhaseTexture)
	oceanDeep.spectrumFramebuffer = buildFramebuffer(gl, spectrumTexture)
	oceanDeep.displacementMapFramebuffer = buildFramebuffer(gl, displacementMap)
	oceanDeep.normalMapFramebuffer = buildFramebuffer(gl, normalMap)
	oceanDeep.pingTransformFramebuffer = buildFramebuffer(gl, pingTransformTexture)
	oceanDeep.pongTransformFramebuffer = buildFramebuffer(gl, pongTransformTexture)
}

function renderMyOcean(deltaTime, projectionMatrix, viewMatrix, cameraPosition) {
	gl.viewport(0, 0, RESOLUTION, RESOLUTION);
	gl.disable(gl.DEPTH_TEST);

	gl.bindBuffer(gl.ARRAY_BUFFER, oceanDeep.fullscreenVertexBuffer);
	gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

	if (oceanDeep.changed) {
		gl.bindFramebuffer(gl.FRAMEBUFFER, oceanDeep.initialSpectrumFramebuffer);
		gl.useProgram(oceanDeep.initialSpectrumProgram);
		gl.uniform2f(gl.getUniformLocation(oceanDeep.initialSpectrumProgram, 'u_wind'), oceanDeep.windX, oceanDeep.windY);
		gl.uniform1f(gl.getUniformLocation(oceanDeep.initialSpectrumProgram, 'u_size'), oceanDeep.size);
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
	}
	
	//store phases separately to ensure continuity of waves during parameter editing
	gl.useProgram(oceanDeep.phaseProgram);
	gl.bindFramebuffer(gl.FRAMEBUFFER, oceanDeep.pingPhase ? oceanDeep.pongPhaseFramebuffer : oceanDeep.pingPhaseFramebuffer);
	gl.uniform1i(gl.getUniformLocation(oceanDeep.phaseProgram, 'u_phases'), oceanDeep.pingPhase ? PING_PHASE_UNIT : PONG_PHASE_UNIT);
	oceanDeep.pingPhase = !oceanDeep.pingPhase;
	gl.uniform1f(gl.getUniformLocation(oceanDeep.phaseProgram, 'u_deltaTime'), deltaTime);
	gl.uniform1f(gl.getUniformLocation(oceanDeep.phaseProgram, 'u_size'), oceanDeep.size);
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

	gl.useProgram(oceanDeep.spectrumProgram);
	gl.bindFramebuffer(gl.FRAMEBUFFER, oceanDeep.spectrumFramebuffer);
	gl.uniform1i(gl.getUniformLocation(oceanDeep.spectrumProgram, 'u_phases'), oceanDeep.pingPhase ? PING_PHASE_UNIT : PONG_PHASE_UNIT);
	gl.uniform1f(gl.getUniformLocation(oceanDeep.spectrumProgram, 'u_size'), oceanDeep.size);
	gl.uniform1f(gl.getUniformLocation(oceanDeep.spectrumProgram, 'u_choppiness'), oceanDeep.choppiness);
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

	var subtransformProgram = oceanDeep.horizontalSubtransformProgram;
	gl.useProgram(oceanDeep.horizontalSubtransformProgram);

	//GPU FFT using Stockham formulation
	var iterations = log2(RESOLUTION) * 2;
	for (var i = 0; i < iterations; i += 1) {
		if (i === 0) {
			gl.bindFramebuffer(gl.FRAMEBUFFER, oceanDeep.pingTransformFramebuffer);
			gl.uniform1i(gl.getUniformLocation(subtransformProgram, 'u_input'), SPECTRUM_UNIT);
		} else if (i === iterations - 1) {
			gl.bindFramebuffer(gl.FRAMEBUFFER, oceanDeep.displacementMapFramebuffer);
			gl.uniform1i(gl.getUniformLocation(subtransformProgram, 'u_input'), (iterations % 2 === 0) ? PING_TRANSFORM_UNIT : PONG_TRANSFORM_UNIT);
		} else if (i % 2 === 1) {
			gl.bindFramebuffer(gl.FRAMEBUFFER, oceanDeep.pongTransformFramebuffer);
			gl.uniform1i(gl.getUniformLocation(subtransformProgram, 'u_input'), PING_TRANSFORM_UNIT);
		} else {
			gl.bindFramebuffer(gl.FRAMEBUFFER, oceanDeep.pingTransformFramebuffer);
			gl.uniform1i(gl.getUniformLocation(subtransformProgram, 'u_input'), PONG_TRANSFORM_UNIT);
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
	if (oceanDeep.changed) {
		gl.uniform1f(gl.getUniformLocation(oceanDeep.normalMapProgram, 'u_size'), oceanDeep.size);
	}
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.enable(gl.DEPTH_TEST);
	gl.clearBufferfv(gl.COLOR, 0, [0.6, 0.6, 0.6, 1.0])
	gl.clearBufferfv(gl.DEPTH, 0, [1.0])

	gl.enableVertexAttribArray(1);

	gl.bindBuffer(gl.ARRAY_BUFFER, oceanDeep.oceanBuffer);
	gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 5 * SIZE_OF_FLOAT, 0);

	gl.useProgram(oceanDeep.oceanProgram);
	if (oceanDeep.changed) {
		gl.uniform1f(gl.getUniformLocation(oceanDeep.oceanProgram, 'u_size'), oceanDeep.size);
		oceanDeep.changed = false;
	}
	gl.uniformMatrix4fv(gl.getUniformLocation(oceanDeep.oceanProgram, 'u_projectionMatrix'), false, projectionMatrix);
	gl.uniformMatrix4fv(gl.getUniformLocation(oceanDeep.oceanProgram, 'u_viewMatrix'), false, viewMatrix);
	gl.uniform3fv(gl.getUniformLocation(oceanDeep.oceanProgram, 'u_cameraPosition'), cameraPosition);
	gl.drawElements(gl.TRIANGLES, oceanDeep.countOfIndicesOcean, gl.UNSIGNED_SHORT, 0);

	gl.disableVertexAttribArray(1);
	
}
