console.log("[Storage Copier] content.js loaded on", window.location.href);

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "export") {
    let data = {};
    try {
      if (msg.storageType === "local") {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          data[key] = localStorage.getItem(key);
        }
      } else {
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          data[key] = sessionStorage.getItem(key);
        }
      }
      sendResponse({ data });
    } catch (e) {
      sendResponse({ data: null });
    }
    return true;
  }
  if (msg.action === "import") {
    try {
      if (msg.storageType === "local") {
        for (const key in msg.data) {
          localStorage.setItem(key, msg.data[key]);
        }
      } else {
        for (const key in msg.data) {
          sessionStorage.setItem(key, msg.data[key]);
        }
      }
      sendResponse({ success: true });
    } catch (e) {
      sendResponse({ success: false });
    }
    return true;
  }
});
