function SceneBankModule(host) {
    // Create Scene Bank (8 scenes)
    this.sceneBank = host.createSceneBank(8);
    this.project = host.getProject();
    for (var i = 0; i < 8; i++) {
        var scene = this.sceneBank.getScene(i);
        scene.name().markInterested();
        scene.sceneIndex().markInterested();
    }
}

SceneBankModule.prototype.handleRequest = function (method, params) {
    switch (method) {
        // --- Scene Control ---
        case "scene.launch":
            if (params && params[0] !== undefined) {
                this.sceneBank.getScene(params[0]).launch();
                return "OK";
            } else throw "Missing parameters";

        case "scene.select":
            if (params && params[0] !== undefined) {
                this.sceneBank.getScene(params[0]).selectInEditor();
                return "OK";
            } else throw "Missing parameters";

        case "scene.create_from_playing":
            this.project.createSceneFromPlayingLauncherClips();
            return "OK";

        case "scene.list":
            var scenes = [];
            for (var i = 0; i < 8; i++) {
                var s = this.sceneBank.getScene(i);
                scenes.push({
                    index: i,
                    name: s.name().get()
                });
            }
            return scenes;

        case "scene.create":
            this.sceneBank.createScene();
            return "OK";

        case "scene.delete":
            if (params && params[0] !== undefined) {
                this.sceneBank.getScene(params[0]).deleteObject();
                return "OK";
            } else throw "Missing sceneIndex parameter";

        case "scene.rename":
            if (params && params[0] !== undefined && params[1] !== undefined) {
                this.sceneBank.getScene(params[0]).name().set(params[1]);
                return "OK";
            } else throw "Missing parameters (sceneIndex, name)";
    }
    return undefined;
};
