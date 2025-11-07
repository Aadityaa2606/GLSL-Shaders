uniform float uTime;
uniform vec3 uCameraPosition;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vWorldPosition;
varying float vFresnel;

void main() {
    // Pass variables to fragment shader
    vPosition = position;
    vNormal = normalize(normalMatrix * normal);
    vUv = uv;
    
    // Calculate world position
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    
    // Calculate fresnel effect for rim lighting
    vec3 worldNormal = normalize(mat3(modelMatrix) * normal);
    vec3 viewDirection = normalize(uCameraPosition - worldPosition.xyz);
    vFresnel = 1.0 - abs(dot(worldNormal, viewDirection));
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}