// Lens Distortion Shader
// GLSL fragment shader for subtle barrel distortion

uniform sampler2D uTexture;
uniform float uDistortion;
uniform vec2 uResolution;

varying vec2 vUv;

void main() {
    vec2 st = vUv;
    
    // Center
    vec2 center = vec2(0.5);
    
    // Distance from center
    float dist = distance(st, center);
    
    // Distortion factor
    float distortion = 1.0 + dist * dist * uDistortion;
    
    // Apply distortion
    vec2 uv = center + (st - center) * distortion;
    
    // Clamp to bounds
    uv = clamp(uv, 0.0, 1.0);
    
    // Sample texture
    vec4 color = texture2D(uTexture, uv);
    
    // Darken edges slightly
    float edge = smoothstep(0.5, 0.9, dist);
    color.rgb *= 1.0 - edge * 0.2;
    
    gl_FragColor = color;
}
