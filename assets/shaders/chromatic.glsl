// Chromatic Aberration Shader
// GLSL fragment shader for subtle color fringing

uniform sampler2D uTexture;
uniform float uOffset;
uniform vec2 uResolution;

varying vec2 vUv;

void main() {
    vec2 st = vUv;
    
    // Chromatic offset
    float offset = uOffset / uResolution.x;
    
    // Sample RGB channels with slight offset
    float r = texture2D(uTexture, st + vec2(offset, 0.0)).r;
    float g = texture2D(uTexture, st).g;
    float b = texture2D(uTexture, st - vec2(offset, 0.0)).b;
    
    gl_FragColor = vec4(r, g, b, 1.0);
}
