# 🎨 Three.js & WebGL Shader Showcase

A collection of interactive 3D visualizations and WebGL shader experiments built with **SvelteKit**, **Three.js**, **Threlte**, and custom GLSL shaders.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![SvelteKit](https://img.shields.io/badge/SvelteKit-5-orange.svg)
![Three.js](https://img.shields.io/badge/Three.js-0.180-blue.svg)

## ✨ Features

- **6 Interactive Scenes** - Each showcasing different aspects of WebGL and Three.js
- **Custom GLSL Shaders** - Hand-crafted vertex and fragment shaders
- **Particle Systems** - Advanced particle effects and galaxy simulations
- **Interactive Controls** - Mouse interaction, orbit controls, and real-time manipulation
- **Responsive Design** - Fully responsive gallery and scenes
- **TypeScript** - Full type safety throughout the project

## 🎬 Scene Gallery

### Scene 1: 3D Car with Shader & Wind Particles

- **Tech**: Three.js, Threlte, Custom Fresnel Shader
- **Features**:
  - Porsche 911 3D model
  - Animated wind particle system
  - Custom shader effects
  - Interactive camera controls

### Scene 2: Animated ISO Shader

- **Tech**: WebGL, Custom GLSL
- **Features**:
  - Smooth gradient patterns
  - Time-based animations
  - Trippy visual effects

### Scene 3: Dynamic Gradient Effect

- **Tech**: WebGL, Custom GLSL
- **Features**:
  - Color transitions
  - Animated gradients
  - Pattern variations

### Scene 4: Interactive Iso Waves

- **Tech**: WebGL, Custom GLSL
- **Features**:
  - Mouse-reactive wave patterns
  - Customizable blob size
  - Fluid-like motion

### Scene 5: Fractal Particle Kaleidoscope ⭐

- **Tech**: WebGL, GLSL, Advanced Algorithms
- **Features**:
  - Multi-layered glowing circles
  - Fractal iterations
  - Procedural color palettes
  - Pulsing animations
  - Mouse interaction
  - Noise-based effects

### Scene 6: Particle Galaxy with Morphing Sphere ⭐

- **Tech**: Three.js, Advanced Particle Systems
- **Features**:
  - 15,000+ particles forming a spiral galaxy
  - Morphing central sphere with vertex displacement
  - 3 animated glowing torus rings
  - 8 orbiting cubes with independent paths
  - Dynamic multi-colored lighting
  - Auto-rotating camera with orbit controls
  - Fog effects and additive blending

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm**, **pnpm**, or **yarn**

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Aadityaa2606/threeJSlearn.git
   cd threeJSlearn
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

3. **Start development server**

   ```bash
   npm run dev
   # or start with browser auto-open
   npm run dev -- --open
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run check` - Run TypeScript type checking
- `npm run lint` - Lint code with ESLint
- `npm run format` - Format code with Prettier
- `npm run storybook` - Start Storybook development server
- `npm run build-storybook` - Build Storybook

### Project Structure

```
threeJSlearn/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   └── scenes/          # Scene components
│   │   │       ├── Scene.svelte
│   │   │       ├── Scene2.svelte
│   │   │       ├── Scene3.svelte
│   │   │       ├── Scene4.svelte
│   │   │       ├── Scene5.svelte
│   │   │       └── Scene6.svelte
│   │   └── shaders/             # GLSL shader files
│   │       ├── *.vert           # Vertex shaders
│   │       └── *.frag           # Fragment shaders
│   ├── routes/                  # SvelteKit routes
│   │   ├── +page.svelte         # Gallery homepage
│   │   ├── scene1/
│   │   ├── scene2/
│   │   ├── scene3/
│   │   ├── scene4/
│   │   ├── scene5/
│   │   └── scene6/
│   └── stories/                 # Storybook stories
├── static/                      # Static assets
├── package.json
├── svelte.config.js
├── vite.config.ts
└── tsconfig.json
```

## 🎨 Technologies Used

### Core Framework

- **SvelteKit 2** - Modern web application framework
- **Svelte 5** - Reactive UI framework
- **TypeScript** - Type-safe development

### 3D & Graphics

- **Three.js 0.180** - 3D graphics library
- **Threlte** - Svelte wrapper for Three.js
- **WebGL** - Hardware-accelerated graphics
- **GLSL** - OpenGL Shading Language

### Build Tools

- **Vite 7** - Next-generation build tool
- **TailwindCSS 4** - Utility-first CSS framework
- **ESLint** - Code linting
- **Prettier** - Code formatting

### Development Tools

- **Storybook** - Component development environment
- **TypeScript ESLint** - TypeScript-specific linting

## 📝 Creating Custom Shaders

Shaders are located in `src/lib/shaders/`. To create a new shader:

1. Create vertex shader (`*.vert`) and fragment shader (`*.frag`)
2. Import as raw text in your component:
   ```typescript
   import vertexShader from '$lib/shaders/myshader.vert?raw';
   import fragmentShader from '$lib/shaders/myshader.frag?raw';
   ```
3. Use with WebGL or Three.js ShaderMaterial

### Example Fragment Shader

```glsl
precision highp float;

uniform vec2 uResolution;
uniform float uTime;

void main() {
    vec2 uv = gl_FragCoord.xy / uResolution;
    vec3 color = vec3(uv.x, uv.y, sin(uTime));
    gl_FragColor = vec4(color, 1.0);
}
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Three.js community for excellent documentation
- Threlte team for Svelte integration
- Inspired by various WebGL and shader artists

## 📧 Contact

**Aaditya Anagarajan**

- GitHub: [@Aadityaa2606](https://github.com/Aadityaa2606)
- Repository: [threeJSlearn](https://github.com/Aadityaa2606/threeJSlearn)

---

Built with ❤️ using SvelteKit and Three.js
