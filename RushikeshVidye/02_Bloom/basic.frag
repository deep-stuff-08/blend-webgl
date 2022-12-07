#version 300 es

precision highp float;

out vec4 FragColor;

uniform float bloomFactor;
uniform sampler2D screenTexture;
uniform sampler2D bloomTexture;
uniform float gamma;

void main(void)
{
    vec3 fragment = texelFetch(screenTexture, ivec2(gl_FragCoord.xy),0).rgb;
    vec3 bloom = texelFetch(bloomTexture, ivec2(gl_FragCoord.xy),0).rgb * bloomFactor;

    vec3 color = fragment + bloom;

    float exposure = 0.5;

    vec3 toneMapped = vec3(1.0) - exp(-color  * exposure);

    FragColor = vec4(pow(toneMapped,vec3(1.0/gamma)),1.0);
}
