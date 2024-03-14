console.log("Custom alert script is running");
var url = "";
chrome.storage.local.set({ isClicked: false });
//console.log(chrome.storage.local.get('isClicked'));
chrome.runtime.onMessage.addListener(async (req, send, rec) => {
  console.log(req);
  const isClicked = await chrome.storage.local.get("isClicked").isClicked;
  console.log(isClicked=== false);
  if (req.action === "alert_user" && (!isClicked || isClicked.length === 0)) {
    chrome.runtime.sendMessage({ url: window.location.href });
    return true;
  }
  // alert(window.location.href);
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log(message);
  if (message.url) {
    url = message.url;
    console.log(url);
  }
  sendResponse(true);
});

document.addEventListener("DOMContentLoaded", function () {
  // Get the modal
  var modal = document.getElementById("customAlert");

  // Get the buttons
  var proceedBtn = document.getElementById("proceedBtn");
  var backBtn = document.getElementById("backBtn");

  // When the user clicks the button, open the modal
  modal.style.display = "block";

  // When the user clicks on the "Proceed" button, close the modal
  proceedBtn.onclick = function () {
    isClicked = true;
    chrome.storage.local.set({ isClicked: true });
    chrome.runtime.sendMessage({ message: "proceed" });
    
  };

  // When the user clicks on the "Back to Google" button, redirect to google.com
  backBtn.onclick = function () {
    window.location.href = "https://www.google.com";
  };

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
});

// Listen for messages from other parts of the extension
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.msg === "alert") {
    // Show the custom alert
    console.log("Received message to show alert");
    var modal = document.getElementById("customAlert");
    modal.style.display = "block";
    return true;
  }
});
