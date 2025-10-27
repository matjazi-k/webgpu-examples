import { Entity } from 'engine/core/core.js';
import { Model } from 'engine/core/core.js';
import { Transform } from 'engine/core/Transform.js';
import { FirstPerson3dController } from 'engine/controllers/FirstPerson3dController.js';
import { GLTFLoader } from 'engine/loaders/GLTFLoader.js';

export async function createPlayer(player_model_path, canvas) {
    const loader = new GLTFLoader();
    await loader.load(new URL(player_model_path, import.meta.url));

    const playerEntity = new Entity();
    const playerTransform = new Transform();
    const playerModel = loader.loadScene();

    playerEntity.addComponent(playerTransform);
    playerEntity.addComponent(new Model(playerModel[0]));
    playerEntity.addComponent(new FirstPerson3dController(playerEntity, canvas));

    console.log(playerEntity);

    return playerEntity;
}
