import type { ControllerModule, RequestParams } from "../types/controller";

export class BrowserModule implements ControllerModule {
  private readonly popupBrowser: PopupBrowser;
  private readonly resultBank: BrowserResultItemBank;

  constructor(host: ControllerHost) {
    this.popupBrowser = host.createPopupBrowser();
    this.popupBrowser.exists().markInterested();

    // Results
    this.popupBrowser.resultsColumn().createCursorItem();
    this.resultBank = this.popupBrowser.resultsColumn().createItemBank(100);

    // Mark interested on result items
    for (let i = 0; i < 100; i++) {
      this.resultBank.getItemAt(i).name().markInterested();
    }
  }

  handleRequest(method: string, params?: RequestParams): unknown {
    switch (method) {
      case "browser.get_status":
        return {
          exists: this.popupBrowser.exists().get(),
          filter: null
        };
      case "browser.list_results": {
        const items: Array<{ index: number; name: string }> = [];
        for (let i = 0; i < 100; i++) {
          const item = this.resultBank.getItemAt(i);
          const name = item.name().get();
          if (name && name.length > 0) {
            items.push({ index: i, name });
          }
        }
        return items;
      }
      case "browser.select_result":
        if (params && params[0] !== undefined) {
          const index = params[0] as number;
          this.popupBrowser.selectFirstFile();
          for (let i = 0; i < index; i++) {
            this.popupBrowser.selectNextFile();
          }
          return "OK";
        }
        return "Missing index parameter";
      case "browser.set_filter":
        return "Unsupported: Bitwig 6 popup browser does not expose a text filter in the controller API";
      case "browser.select_first_file":
        this.popupBrowser.selectFirstFile();
        return "OK";
      case "browser.select_last_file":
        this.popupBrowser.selectLastFile();
        return "OK";
      case "browser.select_next_file":
        this.popupBrowser.selectNextFile();
        return "OK";
      case "browser.select_previous_file":
        this.popupBrowser.selectPreviousFile();
        return "OK";
      case "browser.commit":
        this.popupBrowser.commit();
        return "OK";
      case "browser.cancel":
        this.popupBrowser.cancel();
        return "OK";
    }
    return undefined;
  }
}
