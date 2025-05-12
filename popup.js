document
  .getElementById("export-storage")
  .addEventListener("click", async () => {
    const storageType = document.querySelector(
      'input[name="storage-type"]:checked'
    ).value;
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    console.log("Attempting to export", storageType, "from tab", tab.id);
    chrome.tabs.sendMessage(
      tab.id,
      { action: "export", storageType },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error(
            "Error sending message to content script:",
            chrome.runtime.lastError.message
          );
          alert("Failed to export storage. (content script error)");
          return;
        }
        if (response && response.data) {
          chrome.storage.local.set({
            copiedStorage: { type: storageType, data: response.data },
          });
          alert("Storage exported!");
        } else {
          console.error("No data received from content script:", response);
          alert("Failed to export storage. (no data)");
        }
      }
    );
  });

document
  .getElementById("import-storage")
  .addEventListener("click", async () => {
    const storageType = document.querySelector(
      'input[name="storage-type"]:checked'
    ).value;
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    chrome.storage.local.get("copiedStorage", (result) => {
      if (result.copiedStorage && result.copiedStorage.type === storageType) {
        chrome.tabs.sendMessage(
          tab.id,
          { action: "import", storageType, data: result.copiedStorage.data },
          (response) => {
            if (chrome.runtime.lastError) {
              console.error(
                "Error sending import message to content script:",
                chrome.runtime.lastError.message
              );
              alert("Failed to import storage. (content script error)");
              return;
            }
            if (response && response.success) {
              alert("Storage imported!");
            } else {
              console.error("Import failed, response:", response);
              alert("Failed to import storage. (no success)");
            }
          }
        );
      } else {
        alert("No exported storage found for this type.");
      }
    });
  });
