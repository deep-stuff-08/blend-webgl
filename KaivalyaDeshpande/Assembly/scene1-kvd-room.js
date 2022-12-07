function scene1_kvd_initForRoom(scene1_geom_obj) {
    // data
    const cubeVerts = new Float32Array([
        // top
       -1.0,  1.0, -1.0,   0.0, -1.0,  0.0,   0.0, 1.0,
       -1.0,  1.0,  1.0,   0.0, -1.0,  0.0,   0.0, 0.0,
        1.0,  1.0,  1.0,   0.0, -1.0,  0.0,   1.0, 0.0,
        1.0,  1.0, -1.0,   0.0, -1.0,  0.0,   1.0, 1.0,
    
        // front
       -1.0,  1.0,  1.0,   0.0,  0.0, -1.0,   0.0, 0.0,  
       -1.0, -1.0,  1.0,   0.0,  0.0, -1.0,   1.0, 0.0,
        1.0, -1.0,  1.0,   0.0,  0.0, -1.0,   1.0, 1.0,
        1.0,  1.0,  1.0,   0.0,  0.0, -1.0,   0.0, 1.0,
    
        // right
        1.0,  1.0,  1.0,  -1.0,  0.0,  0.0,   0.0, 0.0,  
        1.0, -1.0,  1.0,  -1.0,  0.0,  0.0,   1.0, 0.0,
        1.0, -1.0, -1.0,  -1.0,  0.0,  0.0,   1.0, 1.0,
        1.0,  1.0, -1.0,  -1.0,  0.0,  0.0,   0.0, 1.0,
    
        // rear
        1.0,  1.0, -1.0,   0.0,  0.0,  1.0,   0.0, 0.0,  
        1.0, -1.0, -1.0,   0.0,  0.0,  1.0,   1.0, 0.0,
       -1.0, -1.0, -1.0,   0.0,  0.0,  1.0,   1.0, 1.0,
       -1.0,  1.0, -1.0,   0.0,  0.0,  1.0,   0.0, 1.0,
    
        // left
       -1.0,  1.0, -1.0,   1.0,  0.0,  0.0,   0.0, 0.0,  
       -1.0, -1.0, -1.0,   1.0,  0.0,  0.0,   1.0, 0.0,
       -1.0, -1.0,  1.0,   1.0,  0.0,  0.0,   1.0, 1.0,
       -1.0,  1.0,  1.0,   1.0,  0.0,  0.0,   0.0, 1.0,
    
        // bottom
       -1.0, -1.0, -1.0,   0.0,  1.0,  0.0,   0.0, 0.0,  
        1.0, -1.0, -1.0,   0.0,  1.0,  0.0,   1.0, 0.0,
        1.0, -1.0,  1.0,   0.0,  1.0,  0.0,   1.0, 1.0,
       -1.0, -1.0,  1.0,   0.0,  1.0,  0.0,   0.0, 1.0
    ]);
    
    // put geometry data into rendering pipeline
    var vao = gl.createVertexArray();
    var vbo = null;
    gl.bindVertexArray(vao);
    {
        // vbo
        vbo = gl.createBuffer();
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

    scene1_geom_obj.kvd_room.vaoWall = vao;
    scene1_geom_obj.kvd_room.vboWall = vbo;
}

function scene1_kvd_drawRoom(ctm, scene1_geom_obj)
{
    // local variables
    var modelViewMatrix = mat4.create();

    // code    
    gl.useProgram(shaderProgramObject);
    {
        // setting up lighting and material
        gl.uniform3fv(gl.getUniformLocation(shaderProgramObject, "u_La"), scene1_geom_obj.kvd_lamp_light.ambient);
        gl.uniform3fv(gl.getUniformLocation(shaderProgramObject, "u_Ld"), scene1_geom_obj.kvd_lamp_light.diffuse);
        gl.uniform3fv(gl.getUniformLocation(shaderProgramObject, "u_Ls"), scene1_geom_obj.kvd_lamp_light.specular);
        gl.uniform4fv(gl.getUniformLocation(shaderProgramObject, "u_lightPosition"), scene1_geom_obj.kvd_lamp.position);

        gl.uniform3f(gl.getUniformLocation(shaderProgramObject, "u_Ka"), 0.1, 0.1, 0.1);
        gl.uniform3f(gl.getUniformLocation(shaderProgramObject, "u_Kd"), 0.1, 0.1, 0.1);
        gl.uniform3f(gl.getUniformLocation(shaderProgramObject, "u_Ks"), 0.1, 0.1, 0.1);
        gl.uniform1f(gl.getUniformLocation(shaderProgramObject, "u_specularPower"), 128.0);

        // transformations for front-left table leg
        mat4.copy(modelViewMatrix, ctm);
        mat4.scale(modelViewMatrix, modelViewMatrix, [7.0, 5.0, 20.0]);

        // set transformation uniforms
        gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgramObject, "u_modelViewMatrix"), false, modelViewMatrix);
        gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgramObject, "u_projMatrix"), false, perspectiveProjectionMatrix);

        // draw front-left table leg
        gl.cullFace(gl.FRONT);
        gl.bindVertexArray(scene1_geom_obj.kvd_room.vaoWall);
            gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
            gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
            gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
            gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);
            gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);
        gl.bindVertexArray(null);
        gl.cullFace(gl.BACK);
    }
    gl.useProgram(null);
}
