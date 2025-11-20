precision highp float;

uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uMouse;

varying vec2 vUv;

float sdCircle(vec2 p, float r) {
    return length(p) - r;
}

// Smooth noise function
float noise(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

// Smooth interpolated noise
float smoothNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    
    float a = noise(i);
    float b = noise(i + vec2(1.0, 0.0));
    float c = noise(i + vec2(0.0, 1.0));
    float d = noise(i + vec2(1.0, 1.0));
    
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

// Palette function for smooth color transitions
vec3 palette(float t) {
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.263, 0.416, 0.557);
    return a + b * cos(6.28318 * (c * t + d));
}

void main() {
    // Normalize coordinates
    vec2 uv = (gl_FragCoord.xy / uResolution) * 2.0 - 1.0;
    uv.x *= uResolution.x / uResolution.y;
    
    // Store original UV for reference
    vec2 uv0 = uv;
    
    // Mouse influence (normalized to -1 to 1 range)
    vec2 mouse = (uMouse / uResolution) * 2.0 - 1.0;
    mouse.x *= uResolution.x / uResolution.y;
    
    // Final color accumulator
    vec3 finalColor = vec3(0.0);
    
    // Create multiple layers of animated circles
    for(float i = 0.0; i < 4.0; i++) {
        // Fractal-like iteration
        uv = fract(uv * 1.5) - 0.5;
        
        // Animated position
        float t = uTime * 0.5 + i * 0.5;
        vec2 offset = vec2(
            cos(t + i * 2.0) * 0.3,
            sin(t * 1.3 + i * 1.5) * 0.3
        );
        
        // Add mouse influence
        offset += (mouse - uv0) * 0.1 * (1.0 + i * 0.2);
        
        // Calculate distance from offset position
        float d = length(uv - offset);
        
        // Dynamic radius with noise
        float radius = 0.15 + smoothNoise(vec2(t, i)) * 0.05;
        
        // Create glow effect
        float glow = 0.01 / abs(d - radius);
        glow += 0.005 / d; // Additional central glow
        
        // Animate color based on time and layer
        vec3 color = palette(length(uv0) + i * 0.15 + uTime * 0.1);
        
        // Add pulsing effect
        float pulse = sin(uTime * 2.0 + i) * 0.5 + 0.5;
        glow *= 0.5 + pulse * 0.5;
        
        // Accumulate color
        finalColor += color * glow * (0.3 + i * 0.15);
    }
    
    // Add ambient glow based on distance from center
    float centerDist = length(uv0);
    finalColor += palette(uTime * 0.05) * 0.02 / centerDist;
    
    // Add subtle vignette
    float vignette = 1.0 - centerDist * 0.3;
    finalColor *= vignette;
    
    // Add slight noise for texture
    finalColor += (smoothNoise(uv0 * 10.0 + uTime) - 0.5) * 0.02;
    
    gl_FragColor = vec4(finalColor, 1.0);
}