(() => {
  if (window.hasRun) return;

  window.hasRun = true;

  const elements = document.getElementsByClassName("text-node");
  if (elements.length < 1) return;

  const title = elements[0].innerText;

  browser.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.action !== "getData") return true;

    browser.runtime.sendMessage(
      { action: "processWithGemini", data: title },
      (response) => {
        sendResponse({ content: response.result });
      },
    );

    return true;
  });
})();
