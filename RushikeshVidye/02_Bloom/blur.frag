#version 300 es

precision highp float;

out vec4 FragColor;

uniform sampler2D screenTexture;
uniform bool horizontal;

const int radius = 6;
float spreadBlur = 5.0;
float weights[radius];

void main(void)
{

    float x = 0.0;
    for(int i = 0; i < radius; i++)
    {
        if(spreadBlur <= 2.0)
            x += 3.0 / float(radius);
        else
            x += 6.0 / float(radius);

        weights[i] = exp(-0.5 * pow(x / spreadBlur,2.0)) / (spreadBlur * sqrt(2.0 * 3.14159265));
    }

    ivec2 tex_offset = 1 / textureSize(screenTexture,0);
    vec3 result = texture(screenTexture,gl_FragCoord.xy).rgb * weights[0];

    if(horizontal)
    {
        for(int i = 1; i < radius; i++)
        {
            result += texture(screenTexture,gl_FragCoord.xy + vec2(float(tex_offset.x) * float(i), 0.0)).rgb * weights[i];
            result += texture(screenTexture,gl_FragCoord.xy - vec2(float(tex_offset.x) * float(i), 0.0)).rgb * weights[i];
        }
    }
    else
    {
        for(int i = 1; i < radius; i++)
        {
            result += texture(screenTexture,gl_FragCoord.xy + vec2(float(tex_offset.y) * float(i), 0.0)).rgb * weights[i];
            result += texture(screenTexture,gl_FragCoord.xy - vec2(float(tex_offset.y) * float(i), 0.0)).rgb * weights[i];
        } 
    }
    FragColor = vec4(result,1.0);
}
