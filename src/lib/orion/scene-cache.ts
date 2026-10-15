import type { GLTF } from 'three/addons/loaders/GLTFLoader.js';

/**
 * Loads three.js and Orion's GLB once per page session.
 *
 * Re-opening the Orion panel previously re-downloaded and re-parsed the model;
 * now each mount clones the cached scene graph (geometry is shared, so clones
 * are cheap) and only creates its own renderer and mutable materials.
 */

/** Meshopt-compressed derivative of orion-reference-v001.glb (same nodes and pivots). */
export const ORION_MODEL_URL = '/character-assets/orion/orion-reference-v001.meshopt.glb';
export const ORION_POSTER_URL = '/character-assets/orion/orion-reference-v001-hero.png';
export const ORION_AVATAR_URL = '/character-assets/orion/orion-avatar-128.webp';

export type OrionAssets = {
  three: typeof import('three');
  gltf: GLTF;
};

let assetsPromise: Promise<OrionAssets> | null = null;

export function loadOrionAssets(): Promise<OrionAssets> {
  if (!assetsPromise) {
    assetsPromise = (async () => {
      const [three, { GLTFLoader }, { MeshoptDecoder }] = await Promise.all([
        import('three'),
        import('three/addons/loaders/GLTFLoader.js'),
        import('three/addons/libs/meshopt_decoder.module.js'),
      ]);
      const loader = new GLTFLoader();
      loader.setMeshoptDecoder(MeshoptDecoder);
      const gltf = await loader.loadAsync(ORION_MODEL_URL);
      return { three, gltf };
    })();
    // Allow a later retry if the network or decoder failed.
    assetsPromise.catch(() => { assetsPromise = null; });
  }
  return assetsPromise;
}

/** Warms the cache (e.g. when the learner hovers the Orion launcher). Never throws. */
export function preloadOrion(): void {
  if (typeof window === 'undefined') return;
  loadOrionAssets().catch(() => {});
}
