#version 300 es

layout(location = 0) in vec4 vPos;
layout(location = 1)in vec3 vNor;
layout(location = 2)in vec2 vTex;

uniform mat4 pMat;
uniform mat4 vMat;
uniform mat4 mMat;
uniform int flip;

out vec2 Tex;
out vec3 N;
out vec3 P;

vec2 rotateUV(vec2 uv, vec2 pivot, float rotation)
{
	float cosa = cos(radians(rotation));
	float sina = sin(radians(rotation));

	uv -= pivot;
	return vec2(cosa * uv.x - sina * uv.y, cosa * uv.y + sina * uv.x) + pivot;
}

void main(void)
{
    gl_Position = pMat * vMat * mMat * vPos;

    if(flip == 1)
    {
        Tex = rotateUV(vTex,vec2(0.5,0.5),-90.0f);
    }
    else
    {
        Tex = vTex;
    }
    N = mat3(transpose(inverse(mMat))) * vNor;
    P = vec3(mMat * vPos);
}
