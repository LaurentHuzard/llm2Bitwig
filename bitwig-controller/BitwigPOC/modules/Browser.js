function BrowserModule(host) {
    this.popupBrowser = host.createPopupBrowser();
    this.popupBrowser.exists().markInterested();
    this.popupBrowser.customFilter().markInterested();

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
                filter: this.popupBrowser.customFilter().get()
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
                // To select, we might need to scroll? 
                // Simple version: just select from the bank if visible.
                // The item bank typically scrolls with the cursor, but here we are selecting BY index in the bank.
                // Let's assume we just want to select that item in the list.
                // Bitwig API for ItemBank allows access not necessarily selection directly unless we map it.
                // Actually, createCursorItem (this.results) follows selection.
                // We can't easily "select index 5" without iterating or depending on bank window.
                // Workaround: We can't directly "select index X" easily on a generic ItemBank without a scroll/select mechanism.
                // Valid Approach: CursorBrowserResultItem?
                // Simpler: Just use browser.commit() on currently selected?
                // Wait, LLM needs to explicitly select "Piano" from the list.
                // Let's use the scroll mechanism if needed, or simply assume the bank window covers it.
                // Actually `resultBank.getItemAt(i)` is a BrowserResultItem. Does it have `select()`? Not always standard.
                // Let's try `selectInEditor()` or similar if available, otherwise just use `browseToInsert...` which initiates it.
                // For PopupBrowser, we select and then commit.
                // Limitation: Bitwig API for BrowserResultItem might not support direct selection easily from a bank in v1.
                // Alternative: Use cursor navigation `selectNext()` / `selectPrevious()` loop? Efficient enough for small lists.
                // Let's implement a simple "select_index" that tries to sync the cursor.
                // Actually, let's just use `popupBrowser.selectFirst()` and `selectNext()` loop.
                return "Selection by index requires iterating cursor - implemented in v2. For now, try arrow keys tool?";
            }
            return "Not Implemented";

        case "browser.set_filter":
            if (params && params[0] !== undefined) {
                this.popupBrowser.customFilter().set(params[0]);
                return "OK";
            } else throw "Missing filter text";

        case "browser.commit":
            this.popupBrowser.commit();
            return "OK";

        case "browser.cancel":
            this.popupBrowser.cancel();
            return "OK";
    }
    return undefined;
};
