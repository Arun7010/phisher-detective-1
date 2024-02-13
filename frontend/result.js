document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const nonce = urlParams.get("nonce");
  
  if (nonce) {
    applyNonce(nonce);

    // Retrieve URL detection results from local storage
      const storedResult = localStorage.getItem("urlDetectionResult");
      console.log(storedResult);
    if (storedResult) {
      const detectionResult = JSON.parse(storedResult);
      displayDetectionResult(detectionResult);
    } else {
      displayNoDetectionResult();
    }
  } else {
    displayNoDetectionResult();
  }
});

function applyNonce(nonce) {
  const cspMeta = document.querySelector(
    'meta[http-equiv="Content-Security-Policy"]'
  );
  const scripts = document.querySelectorAll("script");

  if (cspMeta) {
    cspMeta.setAttribute("content", `script-src 'self' 'nonce-${nonce}'`);
  }

  if (scripts) {
    scripts.forEach((script) => {
      script.setAttribute("nonce", nonce);
    });
  }
}

function displayDetectionResult(result) {
  const detectionResultElement = document.getElementById("detectionResult");
  if (detectionResultElement) {
    let resultText = `URL: ${result.url}<br>`;
    resultText += `Is Malicious: ${result.isMalicious ? "Yes" : "No"}<br>`;
    resultText += `Has Third-Party Cookies: ${
      result.hasThirdPartyCookies ? "Yes" : "No"
    }<br>`;
    detectionResultElement.innerHTML = resultText;
  }
}

function displayNoDetectionResult() {
  const detectionResultElement = document.getElementById("detectionResult");
  if (detectionResultElement) {
    detectionResultElement.innerHTML = "No URL detection result found.";
  }
}
