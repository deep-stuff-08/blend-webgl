"use strict"
class kcamera {
    static #program;
    #path;
    #nsplines;
    #vaoPath;
    #vaoCamAxes;
    #orientationMat;
    #nPathVerts;
    constructor() {}
    updatePath(path) {
        this.#path = path;
        this.#nsplines = path.length - 1;
        this.#nPathVerts = 0;
        
        var vertShader = createShader('common/shaders/camera.vert', gl.VERTEX_SHADER);
        var fragShader = createShader('common/shaders/camera.frag', gl.FRAGMENT_SHADER);
        kcamera.#program = createProgram([vertShader, fragShader]);
        deleteShader(fragShader);
        deleteShader(vertShader);

        var pathVerts = [];
        for(var i = 0; i < path.length - 1; i++) {
            var posA = path[i][0];
            var velA = path[i][3];
            var posD = path[i+1][0];
            var velD = path[i+1][3];
            
            var posB = vec3.create();
            vec3.add(posB, posA, velA);
            var posC = vec3.create();
            vec3.subtract(posC, posD, velD);

            var t = 0.0;
            while(t < 1.0) {
                var P = vec3.create();
                vec3.bezier(P, posA, posB, posC, posD, t);
                pathVerts.push(P[0]);
                pathVerts.push(P[1]);
                pathVerts.push(P[2]);
                t += 0.01;
                this.#nPathVerts++;
            }
        }
        var pathVertsArray = new Float32Array(pathVerts);
        var vaoPath = gl.createVertexArray();
        gl.bindVertexArray(vaoPath);
        var vboPath = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vboPath);
        gl.bufferData(gl.ARRAY_BUFFER, pathVertsArray, gl.DYNAMIC_DRAW);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(0);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindVertexArray(null);
        this.#vaoPath = vaoPath;

        var camAxesVerts = new Float32Array([
            0.0, 0.0, 0.0, 1.0, 0.0, 0.0,   1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 1.0, 0.0,   0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 1.0,   0.0, 0.0,-1.0, 0.0, 0.0, 1.0
        ]);
        var vaoCam = gl.createVertexArray();
        gl.bindVertexArray(vaoCam);
        var vboCam = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vboCam);
        gl.bufferData(gl.ARRAY_BUFFER, camAxesVerts, gl.STATIC_DRAW);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 6 * camAxesVerts.BYTES_PER_ELEMENT, 0);
        gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 6 * camAxesVerts.BYTES_PER_ELEMENT, 3 * camAxesVerts.BYTES_PER_ELEMENT);
        gl.enableVertexAttribArray(0);
        gl.enableVertexAttribArray(1);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindVertexArray(null);
        this.#vaoCamAxes = vaoCam;
    }
    matrix(t) {
        var tspline = kcamera.#lerp(0.0, this.#nsplines, t);
        var startIdx = Math.floor(tspline);
        var tcurve = tspline - Math.floor(tspline);

        console.log(t);

        // safeguard against memory access issues due to float values
        if(startIdx > this.#nsplines)
            startIdx = this.#nsplines;

        // camera position
        var posA = this.#path[startIdx][0];
        var velA = this.#path[startIdx][3];
        var posD = this.#path[startIdx+1][0];
        var velD = this.#path[startIdx+1][3];

        var posB = vec3.create();
        vec3.add(posB, posA, velA);
        var posC = vec3.create();
        vec3.subtract(posC, posD, velD);
        var position = vec3.create();
        vec3.bezier(position, posA, posB, posC, posD, tcurve);

        // vantage point
        var center = vec3.create();
        vec3.lerp(center, this.#path[startIdx][1], this.#path[startIdx+1][1], tcurve);

        // up
        var up = this.#path[startIdx][2];  // !!! potential bug resolve for weirdness after an up-vector change
        vec3.normalize(up, up);

        var viewMat = mat4.create();
        mat4.lookAt(viewMat, position, center, up);
        this.#orientationMat = mat4.create();
        kcamera.#targetTo(this.#orientationMat, position, center, up);
        return viewMat;
    }
    renderPath(perspectiveMatrix, viewMatrix) {
        var prevProgram = gl.getParameter(gl.CURRENT_PROGRAM);
        var prevVertexArray = gl.getParameter(gl.VERTEX_ARRAY_BINDING);
        var prevLineWidth = gl.getParameter(gl.LINE_WIDTH);
        
        gl.useProgram(kcamera.#program);
        gl.uniformMatrix4fv(gl.getUniformLocation(kcamera.#program, "pMat"), false, perspectiveMatrix);
        gl.uniformMatrix4fv(gl.getUniformLocation(kcamera.#program, "vMat"), false, viewMatrix);
        gl.uniform1i(gl.getUniformLocation(kcamera.#program, "isPath"), 1);
        gl.bindVertexArray(this.#vaoPath);
        gl.drawArrays(gl.LINE_STRIP, 0, this.#nPathVerts);
        
        gl.useProgram(prevProgram);
        gl.lineWidth(prevLineWidth);
        gl.bindVertexArray(prevVertexArray);
    }
    render(perspectiveMatrix, viewMatrix, t) {
        var prevProgram = gl.getParameter(gl.CURRENT_PROGRAM);
        var prevVertexArray = gl.getParameter(gl.VERTEX_ARRAY_BINDING);

        this.matrix(t);

        gl.useProgram(kcamera.#program);
        gl.uniformMatrix4fv(gl.getUniformLocation(kcamera.#program, "pMat"), false, perspectiveMatrix);
        gl.uniformMatrix4fv(gl.getUniformLocation(kcamera.#program, "vMat"), false, viewMatrix);
        gl.uniformMatrix4fv(gl.getUniformLocation(kcamera.#program, "mMat"), false, this.#orientationMat);
        gl.uniform1i(gl.getUniformLocation(kcamera.#program, "isPath"), 0);
        gl.bindVertexArray(this.#vaoCamAxes);
        gl.drawArrays(gl.LINES, 0, 6);
        gl.useProgram(prevProgram);
        gl.bindVertexArray(prevVertexArray);
    }
    static #lerp(a, b, t) {
        return ((1 - t) * a) + (t * b);
    }
    /**
     * Generates a matrix that makes something look at something else.
     * (taken from https://glmatrix.net/docs/mat4.js.html#line1708)
     *
     * @param {mat4} out mat4 frustum matrix will be written into
     * @param {ReadonlyVec3} eye Position of the viewer
     * @param {ReadonlyVec3} center Point the viewer is looking at
     * @param {ReadonlyVec3} up vec3 pointing up
     * @returns {mat4} out
     */
    static #targetTo(out, eye, target, up) {
        let eyex = eye[0],
            eyey = eye[1],
            eyez = eye[2],
            upx = up[0],
            upy = up[1],
            upz = up[2];
        let z0 = eyex - target[0],
            z1 = eyey - target[1],
            z2 = eyez - target[2];
        let len = z0 * z0 + z1 * z1 + z2 * z2;
        if (len > 0) {
            len = 1 / Math.sqrt(len);
            z0 *= len;
            z1 *= len;
            z2 *= len;
        }
        let x0 = upy * z2 - upz * z1,
            x1 = upz * z0 - upx * z2,
            x2 = upx * z1 - upy * z0;
        len = x0 * x0 + x1 * x1 + x2 * x2;
        if (len > 0) {
            len = 1 / Math.sqrt(len);
            x0 *= len;
            x1 *= len;
            x2 *= len;
        }
        out[0] = x0;
        out[1] = x1;
        out[2] = x2;
        out[3] = 0;
        out[4] = z1 * x2 - z2 * x1;
        out[5] = z2 * x0 - z0 * x2;
        out[6] = z0 * x1 - z1 * x0;
        out[7] = 0;
        out[8] = z0;
        out[9] = z1;
        out[10] = z2;
        out[11] = 0;
        out[12] = eyex;
        out[13] = eyey;
        out[14] = eyez;
        out[15] = 1;
        return out;
    }    
}
