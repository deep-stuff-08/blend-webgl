#version 300 es

precision highp float;

out vec4 FragColor;
uniform sampler2D screenTexture;

void main(void)
{
    int samples = 128;
    float intensity = 0.08, Decay = 0.9;
    vec2 TexCoord = vec2(gl_FragCoord.xy);
    vec2 Direction = vec2(0.5) - TexCoord;
    Direction /= vec2(150,150);

    vec3 color = texelFetch(screenTexture, ivec2(TexCoord),0).rgb;

    for(int Sample = 0; Sample < samples; Sample++)
    {
        color += texelFetch(screenTexture, ivec2(TexCoord),0).rgb * intensity;
        intensity *= Decay;
        TexCoord += Direction;
    }
    FragColor = vec4(color,1.0);
}
