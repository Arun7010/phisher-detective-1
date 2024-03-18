async function query(data) {
  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/elftsdmr/malware-url-detect",
      {
        headers: {
          Authorization: "Bearer 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",
        },
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error querying URL:", error);
    // Handle the error appropriately, e.g., display an error message to the user
    return { error: "An error occurred while querying the URL." };
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("urlinput");
  var btn = document.getElementById("Submit");
  btn.addEventListener("click", async () => {
    const url = input.value;
    await checkURL(url);
  });
});

async function checkURL(url) {
  const parsedUrl = new URL(url);
  const domain = parsedUrl.hostname;
  console.log("Domain:", domain);
  const result = await query(domain);
  document.getElementById(
    "result"
    ).innerHTML = result[0][0]["label"];
  
}
