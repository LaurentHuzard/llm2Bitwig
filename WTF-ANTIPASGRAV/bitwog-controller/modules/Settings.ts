import type { ControllerModule, RequestParams } from "../types/controller";

export class SettingsModule implements ControllerModule {
  private readonly preferences: Preferences;
  private readonly documentState: DocumentState;
  private readonly settings: Map<string, SettableEnumValue | SettableBooleanValue | SettableRangedValue | SettableStringValue> = new Map();

  constructor(host: ControllerHost) {
    this.preferences = host.getPreferences();
    this.documentState = host.getDocumentState();

    // Pre-register some useful settings
    this.registerSetting("preferences", "AI Assistant Mode", "General", "boolean", true);
    this.registerSetting("preferences", "Log Level", "General", "enum", "Info", ["Debug", "Info", "Warning", "Error"]);
    this.registerSetting("document", "Project AI Context", "Project", "string", "");
  }

  private registerSetting(target: "preferences" | "document", label: string, category: string, type: "boolean" | "enum" | "number" | "string", initialValue: any, options?: string[]) {
    const root = target === "preferences" ? this.preferences : this.documentState;
    let setting: any;

    switch (type) {
      case "boolean":
        setting = root.getBooleanSetting(label, category, initialValue as boolean);
        break;
      case "enum":
        setting = root.getEnumSetting(label, category, options || [], initialValue as string);
        break;
      case "number":
        // For numbers we use default range 0-100 if not specified
        setting = root.getNumberSetting(label, category, 0, 100, 0.1, "", initialValue as number);
        break;
      case "string":
        setting = root.getStringSetting(label, category, 255, initialValue as string);
        break;
    }

    if (setting) {
      setting.markInterested();
      this.settings.set(label, setting);
    }
  }

  handleRequest(method: string, params?: RequestParams): unknown {
    const args = params as unknown[];
    switch (method) {
      case "settings.get_all": {
        const result: Record<string, any> = {};
        this.settings.forEach((setting, label) => {
          result[label] = setting.get();
        });
        return result;
      }
      case "settings.set_value":
        if (args && args[0] !== undefined && args[1] !== undefined) {
          const label = args[0] as string;
          const value = args[1];
          const setting = this.settings.get(label);
          if (setting) {
            if (typeof value === "boolean") (setting as SettableBooleanValue).set(value);
            else if (typeof value === "number") (setting as SettableRangedValue).set(value);
            else if (typeof value === "string") (setting as SettableStringValue).set(value);
            return "OK";
          }
          throw `Setting not found: ${label}`;
        }
        throw "Missing parameters (label, value)";
    }
    return undefined;
  }
}
