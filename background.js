// Listener for incoming messages (if needed in the future)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Background script received a message:", message);
    if (message.action === 'LOG_EVENT') {
      console.log("Event logged:", message.data);
    }
  });