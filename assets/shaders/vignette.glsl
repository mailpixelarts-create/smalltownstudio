// Vignette Shader
// GLSL fragment shader for dark edges

uniform sampler2D uTexture;
uniform float uIntensity;
uniform float uSmoothness;

varying vec2 vUv;

void main() {
    vec2 st = vUv;
    
    // Center distance
    float dist = distance(st, vec2(0.5));
    
    // Vignette factor
    float vignette = smoothstep(0.8, 0.8 * uSmoothness, dist * uIntensity);
    
    // Apply vignette
    vec4 color = texture2D(uTexture, st);
    color.rgb *= vignette;
    
    gl_FragColor = color;
}
