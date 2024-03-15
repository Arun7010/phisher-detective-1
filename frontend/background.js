var results = {};
var legitimatePercents = {};
var isPhish = {};
var isProceed = {};

function fetchLive(callback) {
  fetch(
    "https://raw.githubusercontent.com/picopalette/phishing-detection-plugin/master/static/classifier.json",
    {
      method: "GET",
    }
  )
    .then(function (response) {
      if (!response.ok) {
        throw response;
      }
      return response.json();
    })
    .then(function (data) {
      chrome.storage.local.set(
        { cache: data, cacheTime: Date.now() },
        function () {
          callback(data);
        }
      );
    });
}

function fetchCLF(callback) {
  chrome.storage.local.get(["cache", "cacheTime"], function (items) {
    if (items.cache && items.cacheTime) {
      return callback(items.cache);
    }
    fetchLive(callback);
  });
}

async function classify(tabId, result) {
  var legitimateCount = 0;
  var suspiciousCount = 0;
  var phishingCount = 0;

  console.log(result);
  for (var key in result) {
    if (result[key] == "1") phishingCount++;
    else if (result[key] == "1" && key === "Malicious")
      phishingCount = phishingCount + 1;
    else if (result[key] == "0") suspiciousCount++;
    else legitimateCount++;
  }
  legitimatePercents[tabId] =
    (legitimateCount / (phishingCount + suspiciousCount + legitimateCount)) *
    100;

  if (result.length != 0) {
    var X = [];
    X[0] = [];
    for (var key in result) {
      X[0].push(parseInt(result[key]));
    }
    console.log(result);
    console.log(X);
    fetchCLF(async function (clf) {
      var rf = random_forest(clf);
      y = rf.predict(X);
      console.log(y[0]);
      if (y[0][0]) {
        isPhish[tabId] = true;
      } else {
        isPhish[tabId] = false;
      }

      isProceed[tabId] = false;
      chrome.storage.local.set({
        results: results,
        legitimatePercents: legitimatePercents,
        isPhish: isPhish,
        isProceed: isProceed,
      });

      if (isPhish[tabId]) {
        // var w = 440;
        // var h = 220;
        // var left = 100; // Default left position
        // var top = 100; // Default top position

        // // Create the window
        // chrome.windows.create(
        //   {
        //     url: "custom_alert.html",
        //     type: "popup",
        //     width: w,
        //     height: h,
        //     left: left,
        //     top: top,
        //   },
        //   function (window) {
        //     // Window creation callback
        //   }
        // );
        
        chrome.tabs.query(
          { active: true, currentWindow: true },
          function (tabs) {
            chrome.tabs.sendMessage(
              tabs[0].id,
              { action: "alert_user", id: tabs[0].id },
              function (response) {}
            );
          }
        );
      }
    });
  }
}
var url_ = "";

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "alert_user") {
    chrome.tabs.sendMessage(sender.tab.id, { action: "show_alert" });
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.url) {
    console.log(request.url);
    url_ = request.url;
    chrome.tabs.update({ url: "alert.html" });
  }
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "proceed") {
    // Proceed with the original URL
    chrome.tabs.sendMessage(sender.tab.id, { action: "proceed" });
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  results[sender.tab.id] = request;
  classify(sender.tab.id, request);
  sendResponse({ received: "result" });
});
