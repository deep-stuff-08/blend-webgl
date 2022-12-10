function scene1_kvd_initForTable() {
    // data
    const cubeVerts = new Float32Array([
        // top
       -1.0,  1.0, -1.0,   0.0,  1.0,  0.0,   0.0, 1.0,
       -1.0,  1.0,  1.0,   0.0,  1.0,  0.0,   0.0, 0.0,
        1.0,  1.0,  1.0,   0.0,  1.0,  0.0,   1.0, 0.0,
        1.0,  1.0, -1.0,   0.0,  1.0,  0.0,   1.0, 1.0,
    
        // front
       -1.0,  1.0,  1.0,   0.0,  0.0,  1.0,   0.0, 0.0,  
       -1.0, -1.0,  1.0,   0.0,  0.0,  1.0,   1.0, 0.0,
        1.0, -1.0,  1.0,   0.0,  0.0,  1.0,   1.0, 1.0,
        1.0,  1.0,  1.0,   0.0,  0.0,  1.0,   0.0, 1.0,
    
        // right
        1.0,  1.0,  1.0,   1.0,  0.0,  0.0,   0.0, 0.0,  
        1.0, -1.0,  1.0,   1.0,  0.0,  0.0,   1.0, 0.0,
        1.0, -1.0, -1.0,   1.0,  0.0,  0.0,   1.0, 1.0,
        1.0,  1.0, -1.0,   1.0,  0.0,  0.0,   0.0, 1.0,
    
        // rear
        1.0,  1.0, -1.0,   0.0,  0.0, -1.0,   0.0, 0.0,  
        1.0, -1.0, -1.0,   0.0,  0.0, -1.0,   1.0, 0.0,
       -1.0, -1.0, -1.0,   0.0,  0.0, -1.0,   1.0, 1.0,
       -1.0,  1.0, -1.0,   0.0,  0.0, -1.0,   0.0, 1.0,
    
        // left
       -1.0,  1.0, -1.0,  -1.0,  0.0,  0.0,   0.0, 0.0,  
       -1.0, -1.0, -1.0,  -1.0,  0.0,  0.0,   1.0, 0.0,
       -1.0, -1.0,  1.0,  -1.0,  0.0,  0.0,   1.0, 1.0,
       -1.0,  1.0,  1.0,  -1.0,  0.0,  0.0,   0.0, 1.0,
    
        // bottom
       -1.0, -1.0, -1.0,   0.0, -1.0,  0.0,   0.0, 0.0,  
        1.0, -1.0, -1.0,   0.0, -1.0,  0.0,   1.0, 0.0,
        1.0, -1.0,  1.0,   0.0, -1.0,  0.0,   1.0, 1.0,
       -1.0, -1.0,  1.0,   0.0, -1.0,  0.0,   0.0, 1.0
    ]);
    
    // put geometry data into rendering pipeline
    var vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    {
        // vbo
        var vbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        {
            gl.bufferData(gl.ARRAY_BUFFER, cubeVerts, gl.STATIC_DRAW);
            gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 8 * cubeVerts.BYTES_PER_ELEMENT, 0);
            gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 8 * cubeVerts.BYTES_PER_ELEMENT, 3 * cubeVerts.BYTES_PER_ELEMENT);
            gl.vertexAttribPointer(2, 3, gl.FLOAT, false, 8 * cubeVerts.BYTES_PER_ELEMENT, 5 * cubeVerts.BYTES_PER_ELEMENT);
            gl.enableVertexAttribArray(0);
            gl.enableVertexAttribArray(1);
            gl.enableVertexAttribArray(2);
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }
    gl.bindVertexArray(null);

    return [vao, vbo];
}

function scene1_kvd_drawTable(ctm)
{
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    // local variables
    var modelViewMatrix = mat4.create();

    // code    
    gl.useProgram(shaderProgramObject);
    {
        // setting up lighting and material
        gl.uniform3f(gl.getUniformLocation(shaderProgramObject, "u_La"), 0.1, 0.1, 0.1);
        gl.uniform3f(gl.getUniformLocation(shaderProgramObject, "u_Ld"), 1.0, 1.0, 1.0);
        gl.uniform3f(gl.getUniformLocation(shaderProgramObject, "u_Ls"), 1.0, 1.0, 1.0);
        gl.uniform4f(gl.getUniformLocation(shaderProgramObject, "u_lightPosition"), 0.0, 5.0, 5.0, 1.0);

        gl.uniform3f(gl.getUniformLocation(shaderProgramObject, "u_Ka"), 0.5, 0.5, 0.5);
        gl.uniform3f(gl.getUniformLocation(shaderProgramObject, "u_Kd"), 0.5, 0.2, 0.7);
        gl.uniform3f(gl.getUniformLocation(shaderProgramObject, "u_Ks"), 0.7, 0.7, 0.7);
        gl.uniform1f(gl.getUniformLocation(shaderProgramObject, "u_specularPower"), 128.0);

        // transformations for front-left table leg
        mat4.copy(modelViewMatrix, ctm);
        mat4.translate(modelViewMatrix, modelViewMatrix, [-1.5, -1.0, 1.0]);
        mat4.scale(modelViewMatrix, modelViewMatrix, [0.1, 1.0, 0.1]);

        // set transformation uniforms
        gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgramObject, "u_modelViewMatrix"), false, modelViewMatrix);
        gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgramObject, "u_projMatrix"), false, perspectiveProjectionMatrix);

        // draw front-left table leg
        gl.bindVertexArray(scene1_kvd_data[0]);
            gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
            gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
            gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
            gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);
            gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);
        gl.bindVertexArray(null);

        // transformations for front-right table leg
        mat4.copy(modelViewMatrix, ctm);
        mat4.translate(modelViewMatrix, modelViewMatrix, [1.5, -1.0, 1.0]);
        mat4.scale(modelViewMatrix, modelViewMatrix, [0.1, 1.0, 0.1]);

        // set transformation uniforms
        gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgramObject, "u_modelViewMatrix"), false, modelViewMatrix);
        gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgramObject, "u_projMatrix"), false, perspectiveProjectionMatrix);

        // draw front-right table leg
        gl.bindVertexArray(scene1_kvd_data[0]);
            gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
            gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
            gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
            gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);
            gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);
        gl.bindVertexArray(null);

        // transformations for rear-right table leg
        mat4.copy(modelViewMatrix, ctm);
        mat4.translate(modelViewMatrix, modelViewMatrix, [1.5, -1.0, -1.0]);
        mat4.scale(modelViewMatrix, modelViewMatrix, [0.1, 1.0, 0.1]);

        // set transformation uniforms
        gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgramObject, "u_modelViewMatrix"), false, modelViewMatrix);
        gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgramObject, "u_projMatrix"), false, perspectiveProjectionMatrix);

        // draw rear-right table leg
        gl.bindVertexArray(scene1_kvd_data[0]);
            gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
            gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
            gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
            gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);
            gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);
        gl.bindVertexArray(null);

        // transformations for rear-left table leg
        mat4.copy(modelViewMatrix, ctm);
        mat4.translate(modelViewMatrix, modelViewMatrix, [-1.5, -1.0, -1.0]);
        mat4.scale(modelViewMatrix, modelViewMatrix, [0.1, 1.0, 0.1]);

        // set transformation uniforms
        gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgramObject, "u_modelViewMatrix"), false, modelViewMatrix);
        gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgramObject, "u_projMatrix"), false, perspectiveProjectionMatrix);

        // draw rear-left table leg
        gl.bindVertexArray(scene1_kvd_data[0]);
            gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
            gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
            gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
            gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);
            gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);
        gl.bindVertexArray(null);

        // transformations for table top
        mat4.copy(modelViewMatrix, ctm);
        mat4.scale(modelViewMatrix, modelViewMatrix, [2.0, 0.1, 1.5]);

        // set transformation uniforms
        gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgramObject, "u_modelViewMatrix"), false, modelViewMatrix);
        gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgramObject, "u_projMatrix"), false, perspectiveProjectionMatrix);

        // draw top of the table
        gl.bindVertexArray(scene1_kvd_data[0]);
            gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
            gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
            gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
            gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);
            gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);
        gl.bindVertexArray(null);
    }
    gl.useProgram(null);
}
