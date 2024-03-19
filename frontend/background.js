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

    fetchCLF(async function (clf) {
      var rf = random_forest(clf);
      y = rf.predict(X);

      if (y[0][0]) {
        isPhish[tabId] = true;
      } else {
        isPhish[tabId] = false;
      }
      isPhish[tabId] = true;
      isProceed[tabId] = false;
      chrome.storage.local.set({
        results: results,
        legitimatePercents: legitimatePercents,
        isPhish: isPhish,
        isProceed: isProceed,
      });

      if (isPhish[tabId]) {
        var w = 900;
        var h = 900;
        var left = 300; // Default left position
        var top = 300; // Default top position

        // Create the window
        chrome.windows.create(
          {
            url: "alert.html",
            type: "popup",
            width: w,
            height: h,
            left: left,
            top: top,
          },
          function (window) {
            // Window creation callback
          }
        );

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

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.url && request.action === "show") {
    //chrome.tabs.update({ url: "alert.html" });
  }
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "proceed") {
    // Proceed with the original URL
    chrome.tabs.sendMessage(sender.tab.id, { action: "proceed" });
  }
});

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.message === "fetchWhoisData" && request.url) {
    function extractDomain(url) {
      let domain = url.replace(/^https?:\/\//i, "").replace(/^www\./i, "");
      domain = domain.split("/")[0];
      const topLevelDomain = domain.split(".").pop();
      if (topLevelDomain.length === 2) {
        domain = domain.split(".").slice(0, -1).join(".");
      }
      return domain;
    }
    const getdata = async (domain) => {
      const url = `https://zozor54-whois-lookup-v1.p.rapidapi.com/?domain=${domain}.com&format=json&_forceRefresh=0`;
      const options = {
        method: "GET",
        headers: {
          "X-RapidAPI-Key":
            "cc1e943a51msh03b7a322c743df6p175593jsnd1b04bc9b3ac",
          "X-RapidAPI-Host": "zozor54-whois-lookup-v1.p.rapidapi.com",
        },
      };

      try {
        const response = await fetch(url, options);
        const result = await response.json();

        if (result) {
          // Get the element by its ID
          let whois = chrome.storage.local.get("whois") || {};

          let tab = sender["tab"];
          whois[tab["id"]] = result;

          await chrome.storage.local.set(
            {
              whois: whois,
            },
            (res) => {
              console.log(sendResponse("datafetch complete"));
            }
          );
        } else {
          console.log("No WHOIS data available");
        }
      } catch (error) {
        console.error(error);
      }
    };
    const currentUrl = request.url;
    const domain = extractDomain(currentUrl);
    await getdata(domain);
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "result") {
    results[sender.tab.id] = request.result;
    classify(sender.tab.id, request.result);
    sendResponse({ received: "result" });
  }
});
// Intercept incoming responses
chrome.webRequest.onHeadersReceived.addListener(
  function (details) {
    const responseHeaders = details.responseHeaders;
    const setCookieHeaders = responseHeaders.filter(
      (header) => header.name.toLowerCase() === "set-cookie"
    );
    if (setCookieHeaders.length > 0) {
      console.log("Incoming response with cookies:", details.url);
      console.log("Response headers:", responseHeaders);
    }
  },
  { urls: ["<all_urls>"] },
  ["responseHeaders"]
);

let startTime = performance.now();
let totalBytesReceived = 0;
let totalmb = 0;

chrome.webRequest.onHeadersReceived.addListener(
  function (details) {
    const responseHeaders = details.responseHeaders;
    const contentLengthHeader = responseHeaders.find(
      (header) => header.name.toLowerCase() === "content-length"
    );
    if (contentLengthHeader) {
      const contentLength = parseInt(contentLengthHeader.value, 10);
      totalBytesReceived += contentLength;
      totalmb += contentLength;
    }
  },
  { urls: ["<all_urls>"] },
  ["responseHeaders"]
);

chrome.webRequest.onCompleted.addListener(
  function (details) {
    const endTime = performance.now();
    const duration = endTime - startTime; // Duration in milliseconds
    const bytesPerSecond = totalBytesReceived / (duration / 1000); // Bytes per second
    const downloadSpeedMbps = (bytesPerSecond * 8) / 1000000; // Download speed in Mbps

    console.log("Download speed:", downloadSpeedMbps.toFixed(2), "Mbps");
    console.log(totalmb / (1024 * 1024));
    // You can calculate uplink speed in a similar way if needed

    // Reset variables for the next request
    startTime = performance.now();
    totalBytesReceived = 0;
  },
  { urls: ["<all_urls>"] }
);
