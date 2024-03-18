document.addEventListener("DOMContentLoaded",async function () {
  function extractDomain(url) {
    // Remove protocol (http:// or https://) and www (if any)
    let domain = url.replace(/^https?:\/\//i, "").replace(/^www\./i, "");
    // Extract domain
    domain = domain.split("/")[0];
    // Extract top-level domain
    const topLevelDomain = domain.split(".").pop();
    // Check if the top-level domain contains a two-letter country code
    if (topLevelDomain.length === 2) {
      // Remove the last part (country code) if it exists
      domain = domain.split(".").slice(0, -1).join(".");
    }
    return domain;
  }

  const getdata = async (domain) => {
    const url = `https://zozor54-whois-lookup-v1.p.rapidapi.com/?domain=${domain}&format=json&_forceRefresh=0`;
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "cc1e943a51msh03b7a322c743df6p175593jsnd1b04bc9b3ac",
        "X-RapidAPI-Host": "zozor54-whois-lookup-v1.p.rapidapi.com",
      },
    };

    try {
      console.log("from");
      const response = await fetch(url, options);
      const result = await response.json();
      console.log(result);

      if (result) {
        // Get the element by its ID
        const domainNameElement = document.getElementById("domainName");
          console.log(domainNameElement);
        // Update the inner HTML
        domainNameElement.innerHTML = result.name || result.idnName || "NAN";

        console.log("Domain Name:", result.name || result.idnName);
        console.log("Creation Date:", result.created);
        console.log("Last Updated Date:", result.changed);
        console.log("Expiry Date:", result.expires);
        console.log("Registrar Information:");
        if (result.registrar) {
          console.log("  Name:", result.registrar.name);
          console.log("  Email:", result.registrar.email);
          console.log("  URL:", result.registrar.url);
          console.log("  Phone:", result.registrar.phone);
        } else {
          console.log("  Not available");
        }
        console.log("Nameservers:", result.nameserver);
        console.log("Domain Status:", result.status);
        console.log("Registrant Contact Information:");
        if (
          result.contacts &&
          result.contacts.owner &&
          result.contacts.owner[0]
        ) {
          const owner = result.contacts.owner[0];
          console.log("  Name:", owner.name);
          console.log("  Organization:", owner.organization);
          console.log("  Email:", owner.email);
          console.log("  Address:", owner.address);
          console.log("  Phone:", owner.phone);
        } else {
          console.log("  Not available");
        }
        console.log("Administrative Contact Information:");
        // Similar checks for admin and tech contacts
      } else {
        console.log("No WHOIS data available");
      }

      console.log("from2");
    } catch (error) {
      console.error(error);
    }
  };

  const currentUrl = window.location.href;
  const domain = extractDomain(currentUrl);
  console.log(domain);
  await getdata(domain);
});
