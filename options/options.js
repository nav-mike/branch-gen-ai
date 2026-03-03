const saveOptions = (e) => {
  e.preventDefault();

  browser.storage.sync.set({
    apikey: document.getElementById("apikey").value,
    model: document.getElementById("model").value,
  });
};

const restoreOptions = () => {
  const setCurrentChoice = (result) => {
    document.getElementById("apikey").value = result.apikey || "";
    document.getElementById("model").value = result.model || "";
  };

  const onError = (error) => {
    console.error("Error... ", error);
  };

  const getting = browser.storage.sync.get(["apikey", "model"]);
  getting.then(setCurrentChoice, onError);
};

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
