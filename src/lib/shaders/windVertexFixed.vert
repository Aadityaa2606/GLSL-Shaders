uniform float uTime;
uniform vec3 uCarPosition;
uniform float uWindSpeed;
uniform float uWindStrength;

attribute vec3 aVelocity;
attribute float aLifetime;
attribute float aSize;

varying float vLifetime;
varying vec3 vVelocity;
varying float vDistanceFromCar;

void main() {
    // Use the built-in position attribute
    vec3 currentPosition = position;
    
    // Create wind flow around the car
    vec3 windDirection = vec3(0.0, 0.0, -1.0); // Base wind direction (front to back)
    
    // Calculate distance from car for aerodynamic effect
    float distanceFromCar = length(uCarPosition - currentPosition);
    vDistanceFromCar = distanceFromCar;
    
    // Create deflection around the car (simplified aerodynamics)
    float carInfluence = 1.0 / (1.0 + distanceFromCar * 0.5);
    vec3 deflection = vec3(0.0);
    
    if (distanceFromCar < 3.0) {
        // Create upward and sideways deflection around the car
        float sideDeflection = sign(currentPosition.x - uCarPosition.x) * carInfluence;
        float upwardDeflection = carInfluence * 0.5;
        deflection = vec3(sideDeflection, upwardDeflection, 0.0) * uWindStrength;
    }
    
    // Combine base wind with car deflection
    vec3 finalVelocity = (windDirection * uWindSpeed + deflection + aVelocity) * 0.1;
    
    // Animate particles over time
    vec3 animatedPosition = currentPosition + finalVelocity * uTime;
    
    // Reset particles that have gone too far back
    float lifecycle = mod(uTime + aLifetime, 10.0);
    if (lifecycle < 0.1) {
        animatedPosition.z = uCarPosition.z + 4.0; // Reset to front
        animatedPosition.x = currentPosition.x;
        animatedPosition.y = currentPosition.y;
    }
    
    vLifetime = lifecycle;
    vVelocity = finalVelocity;
    
    // Transform position
    gl_Position = projectionMatrix * modelViewMatrix * vec4(animatedPosition, 1.0);
    
    // Size particles based on distance and lifetime
    float sizeMultiplier = (1.0 - lifecycle / 10.0) * aSize;
    gl_PointSize = sizeMultiplier * 5.0;
}