import type { ControllerModule, RequestParams } from "../types/controller";

export class DeviceModule implements ControllerModule {
  public readonly trackBank: TrackBank;
  private readonly deviceBanks: DeviceBank[] = [];

  constructor(trackBank: TrackBank) {
    this.trackBank = trackBank;

    for (let i = 0; i < 8; i++) {
      const track = this.trackBank.getItemAt(i);
      const deviceBank = track.createDeviceBank(8);

      for (let j = 0; j < 8; j++) {
        const device = deviceBank.getItemAt(j);
        device.name().markInterested();
        device.isEnabled().markInterested();
        device.exists().markInterested();
      }

      this.deviceBanks.push(deviceBank);
    }
  }

  handleRequest(method: string, params?: RequestParams): unknown {
    switch (method) {
      case "device.list":
        if (params && params[0] !== undefined) {
          const trackIndex = params[0] as number;
          if (trackIndex < 0 || trackIndex >= 8) throw "Track index out of range (0-7)";

          const devices: Array<{ index: number; name: string; enabled: boolean }> = [];
          const deviceBank = this.deviceBanks[trackIndex];

          for (let i = 0; i < 8; i++) {
            const device = deviceBank.getItemAt(i);
            if (device.exists().get()) {
              devices.push({
                index: i,
                name: device.name().get(),
                enabled: device.isEnabled().get()
              });
            }
          }
          return devices;
        }
        throw "Missing trackIndex parameter";
      case "device.bypass":
        if (params && params[0] !== undefined && params[1] !== undefined && params[2] !== undefined) {
          const trackIndex = params[0] as number;
          const deviceIndex = params[1] as number;
          const state = params[2] as boolean;

          const device = this.deviceBanks[trackIndex].getItemAt(deviceIndex);
          device.isEnabled().set(!state);
          return "OK";
        }
        throw "Missing parameters (trackIndex, deviceIndex, bypassState)";
      case "device.delete":
        if (params && params[0] !== undefined && params[1] !== undefined) {
          const trackIndex = params[0] as number;
          const deviceIndex = params[1] as number;
          this.deviceBanks[trackIndex].getItemAt(deviceIndex).deleteObject();
          return "OK";
        }
        throw "Missing parameters (trackIndex, deviceIndex)";
    }
    return undefined;
  }
}
