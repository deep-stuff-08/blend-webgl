function scene1_kvd_initForLamp(quailty) {
    // local variables
    let dTheta = 1.0 / quailty;

    // generating a cube for the base and head support
    const cubeGeom = new Float32Array([
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

    // generating a cylinder for base supports and light case
    let cylinderGeom = new Float32Array((6 * 2 + 2) * Math.ceil(360.0 / dTheta));
    let i = 0, cylinder_vertices = 0, theta = 0.0;
    while(i < cylinderGeom.length)
    {
        let theta_rad = theta * Math.PI / 180.0;
        
        // position of upper vertex 1
        cylinderGeom[i] = Math.cos(theta_rad);
        cylinderGeom[i + 1] = -1.0;
        cylinderGeom[i + 2] = Math.sin(theta_rad);

        // normal at upper vertex 1
        cylinderGeom[i + 3] = cylinderGeom[i];
        cylinderGeom[i + 4] = 0.0;
        cylinderGeom[i + 5] = cylinderGeom[i + 2];

        cylinder_vertices++;  // count a vertex

        // position of lower vertex 1
        cylinderGeom[i + 6] = cylinderGeom[i];
        cylinderGeom[i + 7] = 1.0;
        cylinderGeom[i + 8] = cylinderGeom[i + 2];

        // normal at lower vertex 1
        cylinderGeom[i + 9] = cylinderGeom[i + 3];
        cylinderGeom[i + 10] = cylinderGeom[i + 4];
        cylinderGeom[i + 11] = cylinderGeom[i + 5];

        cylinder_vertices++;  // count a vertex
        
        theta += dTheta;
        i += 6 * 2;
    }

    var vaoCube = gl.createVertexArray();
    var vboCube = null;
    gl.bindVertexArray(vaoCube);
    {
        vboCube = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vboCube);
        {
            gl.bufferData(gl.ARRAY_BUFFER, cubeGeom, gl.STATIC_DRAW);
            gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 8 * cubeGeom.BYTES_PER_ELEMENT, 0);
            gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 8 * cubeGeom.BYTES_PER_ELEMENT, 3 * cubeGeom.BYTES_PER_ELEMENT);
            gl.enableVertexAttribArray(0);
            gl.enableVertexAttribArray(1);
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }
    gl.bindVertexArray(null);

    var vaoCylinder = gl.createVertexArray();
    var vboCylinder = null;
    gl.bindVertexArray(vaoCylinder);
    {
        vboCylinder = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vboCylinder);
        {
            gl.bufferData(gl.ARRAY_BUFFER, cylinderGeom, gl.STATIC_DRAW);
            gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 6 * cylinderGeom.BYTES_PER_ELEMENT, 0);
            gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 6 * cylinderGeom.BYTES_PER_ELEMENT, 3 * cylinderGeom.BYTES_PER_ELEMENT);
            gl.enableVertexAttribArray(0);
            gl.enableVertexAttribArray(1);
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }
    gl.bindVertexArray(null);

    return [vaoCube, vboCube, vaoCylinder, vboCylinder, cylinder_vertices];
}

function scene1_kvd_drawLamp(ctm, scene1_geom_obj)
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

        gl.uniform3f(gl.getUniformLocation(shaderProgramObject, "u_Ka"), 0.5, 0.5, 0.5);
        gl.uniform3f(gl.getUniformLocation(shaderProgramObject, "u_Kd"), 0.5, 0.5, 0.5);
        gl.uniform3f(gl.getUniformLocation(shaderProgramObject, "u_Ks"), 1.0, 1.0, 1.0);
        gl.uniform1f(gl.getUniformLocation(shaderProgramObject, "u_specularPower"), 128.0);

        // transformations base support 2
        mat4.copy(modelViewMatrix, ctm);
        mat4.translate(modelViewMatrix, modelViewMatrix, [0.35, 0.55, -0.1]);
        mat4.rotateZ(modelViewMatrix, modelViewMatrix, -15.0 * Math.PI / 180.0);
        mat4.scale(modelViewMatrix, modelViewMatrix, [0.05, 0.5, 0.05]);

        // set transformation uniforms
        gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgramObject, "u_modelViewMatrix"), false, modelViewMatrix);
        gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgramObject, "u_projMatrix"), false, perspectiveProjectionMatrix);

        gl.bindVertexArray(scene1_geom_obj.kvd_lamp.vaoCylinder);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, scene1_geom_obj.kvd_lamp.cylinderVertCount);
        gl.bindVertexArray(null);

        // transformations for lamp head support
        mat4.copy(modelViewMatrix, ctm);
        mat4.translate(modelViewMatrix, modelViewMatrix, [0.35, 1.2, 0.0]);
        mat4.rotateZ(modelViewMatrix, modelViewMatrix, 30.0 * Math.PI / 180.0);
        mat4.scale(modelViewMatrix, modelViewMatrix, [0.05, 0.5, 0.05]);

        // set transformation uniforms
        gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgramObject, "u_modelViewMatrix"), false, modelViewMatrix);
        gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgramObject, "u_projMatrix"), false, perspectiveProjectionMatrix);

        gl.bindVertexArray(scene1_geom_obj.kvd_lamp.vaoCube);
            gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
            gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
            gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
            gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);
            gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);
            gl.drawArrays(gl.TRIANGLE_FAN, 20, 4);
        gl.bindVertexArray(null);


        // transformations base support 1
        mat4.copy(modelViewMatrix, ctm);
        mat4.translate(modelViewMatrix, modelViewMatrix, [0.35, 0.55, 0.1]);
        mat4.rotateZ(modelViewMatrix, modelViewMatrix, -15.0 * Math.PI / 180.0);
        mat4.scale(modelViewMatrix, modelViewMatrix, [0.05, 0.5, 0.05]);

        // set transformation uniforms
        gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgramObject, "u_modelViewMatrix"), false, modelViewMatrix);
        gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgramObject, "u_projMatrix"), false, perspectiveProjectionMatrix);

        gl.bindVertexArray(scene1_geom_obj.kvd_lamp.vaoCylinder);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, scene1_geom_obj.kvd_lamp.cylinderVertCount);
        gl.bindVertexArray(null);

        // transformations for base of the lamp
        mat4.copy(modelViewMatrix, ctm);
        mat4.scale(modelViewMatrix, modelViewMatrix, [0.4, 0.05, 0.15]);

        // set transformation uniforms
        gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgramObject, "u_modelViewMatrix"), false, modelViewMatrix);
        gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgramObject, "u_projMatrix"), false, perspectiveProjectionMatrix);

        gl.bindVertexArray(scene1_geom_obj.kvd_lamp.vaoCube);
            gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
            gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
            gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
            gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);
            gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);
            gl.drawArrays(gl.TRIANGLE_FAN, 20, 4);
        gl.bindVertexArray(null);
    }
    gl.useProgram(null);
}
