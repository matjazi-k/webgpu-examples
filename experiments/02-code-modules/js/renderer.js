import { UnlitRenderer } from 'engine/renderers/UnlitRenderer.js';

export async function setupRenderer(canvas) {
    const renderer = new UnlitRenderer(canvas);
    await renderer.initialize();
    return renderer;
}