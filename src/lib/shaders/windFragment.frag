precision mediump float;

uniform float uTime;
uniform vec3 uWindColor;

varying float vLifetime;
varying vec3 vVelocity;
varying float vDistanceFromCar;

void main() {
    // Create circular particles
    vec2 center = gl_PointCoord - vec2(0.5);
    float distance = length(center);
    
    if (distance > 0.5) {
        discard;
    }
    
    // Calculate particle opacity based on lifetime and distance from car
    float alpha = 1.0 - (vLifetime / 10.0);
    alpha *= (1.0 - distance * 2.0); // Fade towards edges
    alpha *= 0.8; // Increased opacity for visibility
    
    // Color based on velocity and car influence
    float speed = length(vVelocity);
    vec3 baseColor = uWindColor;
    
    // Make particles near the car more visible (aerodynamic effect)
    if (vDistanceFromCar < 3.0) {
        alpha *= 1.5;
        baseColor = mix(baseColor, vec3(1.0, 0.4, 0.0), 0.3); // Slight orange tint near car
    }
    
    // Add some speed-based coloring
    baseColor = mix(baseColor, vec3(1.0, 1.0, 0.0), speed * 0.1);
    
    gl_FragColor = vec4(baseColor, alpha);
}