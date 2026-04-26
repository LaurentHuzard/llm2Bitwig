import type { ControllerModule, RequestParams } from "../types/controller";

export class BrowserModule implements ControllerModule {
  private readonly popupBrowser: PopupBrowser;
  private readonly resultBank: BrowserResultItemBank;
  private readonly columnBanks: Map<string, BrowserFilterItemBank> = new Map();

  constructor(host: ControllerHost) {
    this.popupBrowser = host.createPopupBrowser();
    this.popupBrowser.exists().markInterested();
    this.popupBrowser.title().markInterested();
    this.popupBrowser.contentTypeNames().markInterested();
    this.popupBrowser.selectedContentTypeName().markInterested();
    this.popupBrowser.selectedContentTypeIndex().markInterested();
    this.popupBrowser.shouldAudition().markInterested();
    this.popupBrowser.canAudition().markInterested();

    // Results
    this.popupBrowser.resultsColumn().createCursorItem();
    this.resultBank = this.popupBrowser.resultsColumn().createItemBank(100);
    for (let i = 0; i < 100; i++) {
      this.resultBank.getItemAt(i).name().markInterested();
    }

    // Columns
    this.initColumnBank("smartCollection", this.popupBrowser.smartCollectionColumn());
    this.initColumnBank("location", this.popupBrowser.locationColumn());
    this.initColumnBank("device", this.popupBrowser.deviceColumn());
    this.initColumnBank("category", this.popupBrowser.categoryColumn());
    this.initColumnBank("tag", this.popupBrowser.tagColumn());
    this.initColumnBank("deviceType", this.popupBrowser.deviceTypeColumn());
    this.initColumnBank("fileType", this.popupBrowser.fileTypeColumn());
    this.initColumnBank("creator", this.popupBrowser.creatorColumn());
  }

  private initColumnBank(name: string, column: BrowserFilterColumn) {
    const bank = column.createItemBank(16);
    for (let i = 0; i < 16; i++) {
      bank.getItemAt(i).name().markInterested();
      bank.getItemAt(i).isSelected().markInterested();
    }
    this.columnBanks.set(name, bank);
  }

  handleRequest(method: string, params?: RequestParams): unknown {
    const args = params as unknown[];
    switch (method) {
      case "browser.get_status":
        return {
          exists: this.popupBrowser.exists().get(),
          title: this.popupBrowser.title().get(),
          contentTypes: this.popupBrowser.contentTypeNames().get(),
          selectedContentType: this.popupBrowser.selectedContentTypeName().get(),
          selectedContentTypeIndex: this.popupBrowser.selectedContentTypeIndex().get(),
          shouldAudition: this.popupBrowser.shouldAudition().get(),
          canAudition: this.popupBrowser.canAudition().get()
        };

      case "browser.set_content_type":
        if (args && args[0] !== undefined) {
          this.popupBrowser.selectedContentTypeIndex().set(args[0] as number);
          return "OK";
        }
        throw "Missing index parameter";

      case "browser.set_should_audition":
        if (args && args[0] !== undefined) {
          this.popupBrowser.shouldAudition().set(args[0] as boolean);
          return "OK";
        }
        throw "Missing state parameter";

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

      case "browser.column.get_items":
        if (args && args[0] !== undefined) {
          const colName = args[0] as string;
          const bank = this.columnBanks.get(colName);
          if (bank) {
            const items = [];
            for (let i = 0; i < 16; i++) {
              const item = bank.getItemAt(i);
              const name = item.name().get();
              if (name && name.length > 0) {
                items.push({ index: i, name, isSelected: item.isSelected().get() });
              }
            }
            return items;
          }
          throw `Column not found: ${colName}`;
        }
        throw "Missing columnName parameter";

      case "browser.column.select_item":
        if (args && args[0] !== undefined && args[1] !== undefined) {
          const colName = args[0] as string;
          const index = args[1] as number;
          const bank = this.columnBanks.get(colName);
          if (bank) {
            bank.getItemAt(index).isSelected().set(true);
            return "OK";
          }
          throw `Column not found: ${colName}`;
        }
        throw "Missing parameters (columnName, index)";

      case "browser.select_result":
        if (args && args[0] !== undefined) {
          const index = args[0] as number;
          const item = this.resultBank.getItemAt(index);
          if (item) {
            item.isSelected().set(true);
            return "OK";
          }
          return `Item not found at index ${index}`;
        }
        return "Missing index parameter";

      case "browser.set_filter":
        if (args && args[0] !== undefined) {
          this.popupBrowser.smartCollectionColumn().getWildcardFilter().set(args[0] as string);
          return "OK";
        }
        return "Missing filter text parameter";

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
