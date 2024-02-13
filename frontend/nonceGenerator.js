function generateNonce() {
  return Math.random().toString(36).substring(2, 15);
}

function applyNonce() {
  const nonce = generateNonce();
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
