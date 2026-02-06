import type { ControllerModule, RequestParams } from "../types/controller";

export class SceneBankModule implements ControllerModule {
  private readonly sceneBank: SceneBank;
  private readonly project: Project;

  constructor(host: ControllerHost) {
    this.sceneBank = host.createSceneBank(8);
    this.project = host.getProject();
    for (let i = 0; i < 8; i++) {
      const scene = this.sceneBank.getScene(i);
      scene.name().markInterested();
      scene.sceneIndex().markInterested();
    }
  }

  handleRequest(method: string, params?: RequestParams): unknown {
    switch (method) {
      case "scene.launch":
        if (params && params[0] !== undefined) {
          this.sceneBank.getScene(params[0] as number).launch();
          return "OK";
        }
        throw "Missing parameters";
      case "scene.select":
        if (params && params[0] !== undefined) {
          this.sceneBank.getScene(params[0] as number).selectInEditor();
          return "OK";
        }
        throw "Missing parameters";
      case "scene.create_from_playing":
        this.project.createSceneFromPlayingLauncherClips();
        return "OK";
      case "scene.list": {
        const scenes: Array<{ index: number; name: string }> = [];
        for (let i = 0; i < 8; i++) {
          const scene = this.sceneBank.getScene(i);
          scenes.push({
            index: i,
            name: scene.name().get()
          });
        }
        return scenes;
      }
      case "scene.create":
        this.sceneBank.createScene();
        return "OK";
      case "scene.delete":
        if (params && params[0] !== undefined) {
          this.sceneBank.getScene(params[0] as number).deleteObject();
          return "OK";
        }
        throw "Missing sceneIndex parameter";
      case "scene.rename":
        if (params && params[0] !== undefined && params[1] !== undefined) {
          this.sceneBank.getScene(params[0] as number).name().set(params[1] as string);
          return "OK";
        }
        throw "Missing parameters (sceneIndex, name)";
    }
    return undefined;
  }
}
