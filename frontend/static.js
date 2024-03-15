var colors = {
  "-1": "#58bc8a",
  0: "#ffeb3c",
  1: "#ff8b66",
};
chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
  console.log("hai");
  chrome.storage.local.get(
    ["results", "legitimatePercents", "isPhish"],
    function (items) {
      var result = items.results[tabs[0].id];
      var featureList = document.getElementById("feature-list");
      for (var key in result) {
        var newFeature = document.createElement("li");
        newFeature.textContent = key;
        newFeature.classList.add("newFeature");
        newFeature.style.backgroundColor = colors[result[key]];
        featureList.appendChild(newFeature);
      }
    }
  );
});
