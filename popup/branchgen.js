const getTaskTitle = (branchName) => {
  const root = document.getElementById("popup-content");

  if (!root) return;

  root.innerHTML = `<button id="copy">${branchName}</button>`;

  const btn = document.getElementById("copy");
  btn.addEventListener("click", async () => {
    const originalText = btn.textContent;

    try {
      await navigator.clipboard.writeText(branchName);
      btn.textContent = "✓ Copied";
      setTimeout(() => {
        btn.textContent = originalText;
      }, 2000);
    } catch (err) {
      console.error("Error... ", err);
    }
  });
};

browser.tabs
  .executeScript({ file: "/content_scripts/branchgen.js" })
  .then(() => {
    browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      browser.tabs.sendMessage(
        tabs[0].id,
        { action: "getData" },
        (response) => {
          getTaskTitle(response.content);
        },
      );
    });
  });
