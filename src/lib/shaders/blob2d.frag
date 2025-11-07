precision highp float;
varying vec2 vUv;
uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uMouse;
uniform float uBlobSize;

// Simple 2D noise function
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    
    vec2 u = f * f * (3.0 - 2.0 * f);
    
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

void main() {
    vec2 uv = (gl_FragCoord.xy / uResolution) * 2.0 - 1.0;
    uv.x *= uResolution.x / uResolution.y;

    // Define random spawn points
    const int numPoints = 5;
    vec2 spawnPoints[5];
    spawnPoints[0] = vec2(-0.5, 0.3);
    spawnPoints[1] = vec2(0.6, 0.5);
    spawnPoints[2] = vec2(-0.3, -0.6);
    spawnPoints[3] = vec2(0.4, -0.3);
    spawnPoints[4] = vec2(0.0, 0.2);
    
    // Mouse position
    vec2 mouseUv = (uMouse / uResolution) * 2.0 - 1.0;
    mouseUv.x *= uResolution.x / uResolution.y;
    
    float distToMouse = length(uv - mouseUv);
    float blobAngle = atan(uv.y - mouseUv.y, uv.x - mouseUv.x);
    float blobNoise = noise(vec2(blobAngle * 3.0, uTime * 0.3)) * 0.1;
    
    // Base radius that will be scaled by uBlobSize
    float baseRadius = 0.3 + blobNoise;
    float blobRadius = baseRadius * uBlobSize;
    
    // Simple circle blob (no smoothstep)
    float blob = distToMouse < blobRadius ? 1.0 : 0.0;
    bool insideBlob = distToMouse < blobRadius;
    
    // Calculate circle patterns and check if current pixel is inside any circle
    vec3 finalColor = vec3(0.97); // Background color
    bool insideAnyCircle = false;
    
    for (int i = 0; i < numPoints; i++) {
        vec2 center = spawnPoints[i];
        vec2 toCenter = uv - center;
        float angle = atan(toCenter.y, toCenter.x);
        
        // Add noise to the circles
        float noiseValue = noise(vec2(angle * 1.5, uTime * 0.5 + float(i) * 10.0)) * 0.3;
        float d = length(toCenter) + noiseValue;
        
        // Random max radius for each spawn point (between 0.5 and 1.5)
        float randomSeed = float(i) * 12.345;
        float maxRadius = 0.5 + random(vec2(randomSeed, randomSeed + 1.0)) * 1.0;
        
        // Animation: grow to max, then shrink back
        float cycleDuration = 4.0; // seconds for full cycle
        float cycleOffset = random(vec2(randomSeed + 2.0, randomSeed + 3.0)) * cycleDuration;
        float cycleTime = mod(uTime + cycleOffset, cycleDuration);
        
        // Triangle wave: 0 -> 1 -> 0
        float growth = cycleTime < cycleDuration * 0.5 
            ? cycleTime / (cycleDuration * 0.5)  // Growing phase
            : 2.0 - (cycleTime / (cycleDuration * 0.5)); // Shrinking phase
        
        float currentMaxRadius = maxRadius * growth;
        
        // Check if we're inside this circle (between circle lines)
        if (d < currentMaxRadius && growth > 0.01) {
            float circlePattern = sin(d * 6.0 - uTime) * 0.5;
            circlePattern = abs(circlePattern);
            
            // Determine if we're in the filled area (between lines)
            float lineThreshold = 0.01;
            if (circlePattern < lineThreshold) {
                // On a circle line - draw the line
                finalColor = vec3(0.8);
            } else {
                // Between circle lines - we're "inside" this circle pattern
                float cyclicDist = mod(d * 6.0 - uTime, 3.14159 * 2.0);
                if (cyclicDist < 3.14159) {
                    insideAnyCircle = true;
                }
            }
        }
    }

    // Apply blob with color based on whether it's inside or outside circles
    if (blob > 0.0) {
        vec3 blobColor;
        
        if (insideAnyCircle) {
            blobColor = vec3(1.0, 0.0, 0.0); // Red inside circles
        } else {
            blobColor = vec3(0.0, 1.0, 0.0); // Green outside circles
        }
        
        finalColor = mix(finalColor, blobColor, blob * 0.8);
    }

    gl_FragColor = vec4(finalColor, 1.0);
}