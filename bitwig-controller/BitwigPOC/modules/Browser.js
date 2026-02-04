function BrowserModule(host) {
    this.popupBrowser = host.createPopupBrowser();
    this.popupBrowser.exists().markInterested();

    // Results
    this.results = this.popupBrowser.resultsColumn().createCursorItem();
    this.resultBank = this.popupBrowser.resultsColumn().createItemBank(100); // Fetch up to 100 items

    // Mark interested on result items
    for (var i = 0; i < 100; i++) {
        this.resultBank.getItemAt(i).name().markInterested();
    }
}

BrowserModule.prototype.handleRequest = function (method, params) {
    switch (method) {
        case "browser.get_status":
            return {
                exists: this.popupBrowser.exists().get(),
                filter: null
            };

        case "browser.list_results":
            var items = [];
            // Only return items that actually have content
            for (var i = 0; i < 100; i++) {
                var item = this.resultBank.getItemAt(i);
                var name = item.name().get();
                if (name && name.length > 0) {
                    items.push({ index: i, name: name });
                }
            }
            return items;

        case "browser.select_result":
            if (params && params[0] !== undefined) {
                var index = params[0];
                var item = this.resultBank.getItemAt(index);
                if (item) {
                    item.isSelected().set(true);
                    return "OK";
                }
                return "Item not found at index " + index;
            }
            return "Missing index parameter";

        case "browser.set_filter":
            if (params && params[0] !== undefined) {
                // Try smartCollectionColumn.getWildcardFilter().set()
                this.popupBrowser.smartCollectionColumn().getWildcardFilter().set(params[0]);
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
};
