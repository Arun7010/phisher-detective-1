document.addEventListener("DOMContentLoaded", () => {
  const showResultsButton = document.getElementById("showResults");
  showResultsButton.addEventListener("click", handleShowResults);
});

function handleShowResults() {
  const nonce = generateNonce();
  openResultsPage(nonce);
}

function openResultsPage(nonce) {
  const newPageUrl = `result.html?nonce=${nonce}`;
  window.open(newPageUrl, "_blank");
}

function generateNonce() {
  return Math.random().toString(36).substring(2, 15);
}
