var colors = {
  "-1": "#58bc8a",
  0: "#ffeb3c",
  1: "#ff8b66",
};

var featureList = document.getElementById("features");



chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log(message);

  if (message.action === "alert_user") {
    // Show the custom alert
    console.log("Received message to show alert");
    try {
      chrome.tabs.update({ url: "test.html" });
    } catch (error) {
      console.log(error);
    }
  }
  sendResponse("got it ");
});


chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {


  chrome.storage.local.get(
    ["results", "legitimatePercents", "isPhish"],
    function (items) {
      var result = items.results[tabs[0].id];
      var isPhish = items.isPhish[tabs[0].id];
      var legitimatePercent = items.legitimatePercents[tabs[0].id];

      
      var progressBarWidth = parseInt(legitimatePercent);
      document.getElementById("site_progress").style.width =
      progressBarWidth + "%";
      document.getElementById("site_score").textContent =
        progressBarWidth + "%";

      if (progressBarWidth < 55) {
        document.getElementById("site_progress").style.background = "#14db49";
      }
      if (progressBarWidth >= 55 && progressBarWidth < 80) {
        document.getElementById("site_progress").style.background = "#f7e40a";
      }
      if (progressBarWidth >= 80 && progressBarWidth <= 100) {
        document.getElementById("site_progress").style.background = "#d42004";
      }

      // Display warning message for phishing sites
      if (isPhish) {
        
        document.getElementById("site_msg").textContent =
          "Be carefull this site seems to be phisher";
        document.getElementById("site_score").textContent =
          parseInt(legitimatePercent) -20 + "%";
      }

      // Display features/results
      for (var key in result) {
        var newFeature = document.createElement("li");
        newFeature.textContent = key;
        newFeature.style.backgroundColor = colors[result[key]];
        featureList.appendChild(newFeature);
      }
    }
  );
});
