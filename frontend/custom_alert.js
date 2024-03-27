console.log("Custom alert script is running");

var tabid = "";

chrome.runtime.onMessage.addListener(async (req, send, rec) => {
  console.log(req);
  tabid = req.id;
  const proceed = await chrome.storage.local.get("isProceed");
  console.log(proceed.isProceed[tabid]);
  if (req.action === "alert_user" && proceed.isProceed[tabid] === false) {
    chrome.runtime.sendMessage({ url: window.location.href ,action:"show"});
    return true;
  }
});

document.addEventListener("DOMContentLoaded", function () {
  var modal = document.getElementById("customAlert");
  var proceedBtn = document.getElementById("proceedBtn");
  var backBtn = document.getElementById("backBtn");

  modal.style.display = "block";

  proceedBtn.onclick = async function () {
    var pro = await chrome.storage.local.get("isProceed");
    pro.isProceed[tabid] = true;
    await chrome.storage.local.set(pro);
    modal.style.display = "none"; // Hide the modal popup
    chrome.runtime.sendMessage("proceed");
    window.close(); // Close the tab
  };

  backBtn.onclick = function () {
    window.location.href = "https://www.google.com";
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
});
