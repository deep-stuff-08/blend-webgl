var Simulator = function (canvas, width, height) {
	var windX = INITIAL_WIND[0],
		windY = INITIAL_WIND[1],
		size = INITIAL_SIZE,
		choppiness = INITIAL_CHOPPINESS;

	var changed = true;

	gl.getExtension('OES_texture_float');
	gl.getExtension('OES_texture_float_linear');

	var fullscreenVertexShader = createShader('shaders/fullscreen.vert', gl.VERTEX_SHADER)

	var horizontalSubtransformFrag = createShader('shaders/horizontalSubtransform.frag', gl.FRAGMENT_SHADER)
	var horizontalSubtransformProgram = createProgram([fullscreenVertexShader, horizontalSubtransformFrag])
	gl.useProgram(horizontalSubtransformProgram)
	gl.uniform1f(gl.getUniformLocation(horizontalSubtransformProgram, 'u_transformSize'), RESOLUTION);

	var verticalSubtransformFrag = createShader('shaders/verticalSubtransform.frag', gl.FRAGMENT_SHADER)
	var verticalSubtransformProgram = createProgram([fullscreenVertexShader, verticalSubtransformFrag]);
	gl.useProgram(verticalSubtransformProgram);
	gl.uniform1f(gl.getUniformLocation(verticalSubtransformProgram, 'u_transformSize'), RESOLUTION);
	
	var initialSpectrumFrag = createShader('shaders/initialSpectrum.frag', gl.FRAGMENT_SHADER)
	var initialSpectrumProgram = createProgram([fullscreenVertexShader, initialSpectrumFrag]);
	gl.useProgram(initialSpectrumProgram);
	gl.uniform1f(gl.getUniformLocation(initialSpectrumProgram, 'u_resolution'), RESOLUTION);

	var phaseFrag = createShader('shaders/phase.frag', gl.FRAGMENT_SHADER)
	var phaseProgram = createProgram([fullscreenVertexShader, phaseFrag]);
	gl.useProgram(phaseProgram);
	gl.uniform1f(gl.getUniformLocation(phaseProgram, 'u_resolution'), RESOLUTION);

	var spectrumFrag = createShader('shaders/spectrum.frag', gl.FRAGMENT_SHADER)
	var spectrumProgram = createProgram([fullscreenVertexShader, spectrumFrag]);
	gl.useProgram(spectrumProgram);
	gl.uniform1i(gl.getUniformLocation(spectrumProgram, 'u_initialSpectrum'), INITIAL_SPECTRUM_UNIT);
	gl.uniform1f(gl.getUniformLocation(spectrumProgram, 'u_resolution'), RESOLUTION);

	var normalMapFrag = createShader('shaders/normalMap.frag', gl.FRAGMENT_SHADER)
	var normalMapProgram = createProgram([fullscreenVertexShader, normalMapFrag]);
	gl.useProgram(normalMapProgram);
	gl.uniform1i(gl.getUniformLocation(normalMapProgram, 'u_displacementMap'), DISPLACEMENT_MAP_UNIT);
	gl.uniform1f(gl.getUniformLocation(normalMapProgram, 'u_resolution'), RESOLUTION);

	var oceanVert = createShader('shaders/ocean.vert', gl.VERTEX_SHADER)
	var oceanFrag = createShader('shaders/ocean.frag', gl.FRAGMENT_SHADER)
	var oceanProgram = createProgram([oceanVert, oceanFrag]);
	gl.useProgram(oceanProgram);
	gl.uniform1f(gl.getUniformLocation(oceanProgram, 'u_geometrySize'), GEOMETRY_SIZE);
	gl.uniform1i(gl.getUniformLocation(oceanProgram, 'u_displacementMap'), DISPLACEMENT_MAP_UNIT);
	gl.uniform1i(gl.getUniformLocation(oceanProgram, 'u_normalMap'), NORMAL_MAP_UNIT);
	gl.uniform3fv(gl.getUniformLocation(oceanProgram, 'u_oceanColor'), OCEAN_COLOR);
	gl.uniform3fv(gl.getUniformLocation(oceanProgram, 'u_skyColor'), SKY_COLOR);
	gl.uniform3fv(gl.getUniformLocation(oceanProgram, 'u_sunDirection'), SUN_DIRECTION);
	gl.uniform1f(gl.getUniformLocation(oceanProgram, 'u_exposure'), EXPOSURE);

	gl.enableVertexAttribArray(0);

	var fullscreenVertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, fullscreenVertexBuffer);
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

	var oceanBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, oceanBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(oceanData), gl.STATIC_DRAW);
	gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 5 * SIZE_OF_FLOAT, 3 * SIZE_OF_FLOAT);

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

	var pingPhase = true;

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
	var initialSpectrumFramebuffer = buildFramebuffer(gl, initialSpectrumTexture),
		pingPhaseFramebuffer = buildFramebuffer(gl, pingPhaseTexture),
		pongPhaseFramebuffer = buildFramebuffer(gl, pongPhaseTexture),
		spectrumFramebuffer = buildFramebuffer(gl, spectrumTexture),
		displacementMapFramebuffer = buildFramebuffer(gl, displacementMap),
		normalMapFramebuffer = buildFramebuffer(gl, normalMap),
		pingTransformFramebuffer = buildFramebuffer(gl, pingTransformTexture),
		pongTransformFramebuffer = buildFramebuffer(gl, pongTransformTexture);

	this.render = function (deltaTime, projectionMatrix, viewMatrix, cameraPosition) {
		gl.viewport(0, 0, RESOLUTION, RESOLUTION);
		gl.disable(gl.DEPTH_TEST);

		gl.bindBuffer(gl.ARRAY_BUFFER, fullscreenVertexBuffer);
		gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

		if (changed) {
			gl.bindFramebuffer(gl.FRAMEBUFFER, initialSpectrumFramebuffer);
			gl.useProgram(initialSpectrumProgram);
			gl.uniform2f(gl.getUniformLocation(initialSpectrumProgram, 'u_wind'), windX, windY);
			gl.uniform1f(gl.getUniformLocation(initialSpectrumProgram, 'u_size'), size);
			gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
		}
		
		//store phases separately to ensure continuity of waves during parameter editing
		gl.useProgram(phaseProgram);
		gl.bindFramebuffer(gl.FRAMEBUFFER, pingPhase ? pongPhaseFramebuffer : pingPhaseFramebuffer);
		gl.uniform1i(gl.getUniformLocation(phaseProgram, 'u_phases'), pingPhase ? PING_PHASE_UNIT : PONG_PHASE_UNIT);
		pingPhase = !pingPhase;
		gl.uniform1f(gl.getUniformLocation(phaseProgram, 'u_deltaTime'), deltaTime);
		gl.uniform1f(gl.getUniformLocation(phaseProgram, 'u_size'), size);
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

		gl.useProgram(spectrumProgram);
		gl.bindFramebuffer(gl.FRAMEBUFFER, spectrumFramebuffer);
		gl.uniform1i(gl.getUniformLocation(spectrumProgram, 'u_phases'), pingPhase ? PING_PHASE_UNIT : PONG_PHASE_UNIT);
		gl.uniform1f(gl.getUniformLocation(spectrumProgram, 'u_size'), size);
		gl.uniform1f(gl.getUniformLocation(spectrumProgram, 'u_choppiness'), choppiness);
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

		var subtransformProgram = horizontalSubtransformProgram;
		gl.useProgram(horizontalSubtransformProgram);

		//GPU FFT using Stockham formulation
		var iterations = log2(RESOLUTION) * 2;
		for (var i = 0; i < iterations; i += 1) {
			if (i === 0) {
				gl.bindFramebuffer(gl.FRAMEBUFFER, pingTransformFramebuffer);
				gl.uniform1i(gl.getUniformLocation(subtransformProgram, 'u_input'), SPECTRUM_UNIT);
			} else if (i === iterations - 1) {
				gl.bindFramebuffer(gl.FRAMEBUFFER, displacementMapFramebuffer);
				gl.uniform1i(gl.getUniformLocation(subtransformProgram, 'u_input'), (iterations % 2 === 0) ? PING_TRANSFORM_UNIT : PONG_TRANSFORM_UNIT);
			} else if (i % 2 === 1) {
				gl.bindFramebuffer(gl.FRAMEBUFFER, pongTransformFramebuffer);
				gl.uniform1i(gl.getUniformLocation(subtransformProgram, 'u_input'), PING_TRANSFORM_UNIT);
			} else {
				gl.bindFramebuffer(gl.FRAMEBUFFER, pingTransformFramebuffer);
				gl.uniform1i(gl.getUniformLocation(subtransformProgram, 'u_input'), PONG_TRANSFORM_UNIT);
			}

			if (i === iterations / 2) {
				subtransformProgram = verticalSubtransformProgram;
				gl.useProgram(verticalSubtransformProgram);
			}

			gl.uniform1f(gl.getUniformLocation(subtransformProgram, 'u_subtransformSize'), Math.pow(2,(i % (iterations / 2)) + 1));
			gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
		}

		gl.bindFramebuffer(gl.FRAMEBUFFER, normalMapFramebuffer);
		gl.useProgram(normalMapProgram);
		if (changed) {
			gl.uniform1f(gl.getUniformLocation(normalMapProgram, 'u_size'), size);
		}
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		gl.viewport(0, 0, canvas.width, canvas.height);
		gl.enable(gl.DEPTH_TEST);
		gl.clearBufferfv(gl.COLOR, 0, [0.6, 0.6, 0.6, 1.0])
		gl.clearBufferfv(gl.DEPTH, 0, [1.0])

		gl.enableVertexAttribArray(1);

		gl.bindBuffer(gl.ARRAY_BUFFER, oceanBuffer);
		gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 5 * SIZE_OF_FLOAT, 0);

		gl.useProgram(oceanProgram);
		if (changed) {
			gl.uniform1f(gl.getUniformLocation(oceanProgram, 'u_size'), size);
			changed = false;
		}
		gl.uniformMatrix4fv(gl.getUniformLocation(oceanProgram, 'u_projectionMatrix'), false, projectionMatrix);
		gl.uniformMatrix4fv(gl.getUniformLocation(oceanProgram, 'u_viewMatrix'), false, viewMatrix);
		gl.uniform3fv(gl.getUniformLocation(oceanProgram, 'u_cameraPosition'), cameraPosition);
		gl.drawElements(gl.TRIANGLES, oceanIndices.length, gl.UNSIGNED_SHORT, 0);

		gl.disableVertexAttribArray(1);
		
	};

};