// Bloom Shader
// GLSL fragment shader for soft glow effect

uniform sampler2D uTexture;
uniform float uThreshold;
uniform float uIntensity;
uniform vec2 uResolution;

varying vec2 vUv;

void main() {
    vec2 st = vUv;
    
    vec4 color = texture2D(uTexture, st);
    
    // Extract bright areas
    float brightness = dot(color.rgb, vec3(0.299, 0.587, 0.114));
    
    if (brightness > uThreshold) {
        // Soft blur
        vec4 bloom = vec4(0.0);
        float blur = 2.0 / uResolution.x;
        
        for (float x = -2.0; x <= 2.0; x += 1.0) {
            for (float y = -2.0; y <= 2.0; y += 1.0) {
                bloom += texture2D(uTexture, st + vec2(x, y) * blur);
            }
        }
        bloom /= 25.0;
        
        // Add bloom
        color.rgb += bloom.rgb * uIntensity * (brightness - uThreshold);
    }
    
    gl_FragColor = color;
}
