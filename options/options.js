const saveOptions = (e) => {
  e.preventDefault();

  browser.storage.sync.set({
    apikey: document.getElementById("apikey").value,
  });
};

const restoreOptions = () => {
  const setCurrentChoice = (result) => {
    document.getElementById("apikey").value = result.apikey || "";
  };

  const onError = (error) => {
    console.error("Error... ", error);
  };

  const getting = browser.storage.sync.get("apikey");
  getting.then(setCurrentChoice, onError);
};

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
