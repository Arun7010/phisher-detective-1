chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
  console.log("hai");
  chrome.storage.local.get("whois", async (data) => {
    let tabid = tabs[0].id;
    let result = data.whois[tabid];
    let nameElement = document.getElementById("domainName");
    nameElement.innerHTML = result.name || result.idnName || "null";
    let created = document.getElementById("created");
    created.innerHTML = result.created || "Not available";
    let updated = document.getElementById("updated");
    updated.innerHTML = result.changed || "null";
    let exp = document.getElementById("exp");
    exp.innerHTML = result.expires || "null";
    let Domain_Status = document.getElementById("Domain Status:");
    Domain_Status.innerHTML = result.status || "null";

    let ips = document.getElementById("ips");
    ips.innerHTML = result.ips || "null";

    let address = document.getElementById("address");
    address.innerHTML = result.contacts.admin[0].address || "null";

    let city = document.getElementById("city");
    city.innerHTML = result.contacts.admin[0].city || "null";

    let state = document.getElementById("state");
    state.innerHTML = result.contacts.admin[0].state || "null";

    let zipcode = document.getElementById("zipcode");
    zipcode.innerHTML = result.contacts.admin[0].zipcode || "null";

    let name = document.getElementById("name");
    name.innerHTML = result.contacts.admin[0].name || "null";

    let country = document.getElementById("country");
    country.innerHTML = result.contacts.admin[0].country || "null";

    let phone = document.getElementById("phone");
    phone.innerHTML = result.contacts.admin[0].phone || "null";

    let email = document.getElementById("email");
    email.innerHTML = result.contacts.admin[0].email || "null";

    let rname = document.getElementById("rname");
    rname.innerHTML = result.registrar.name || "null";

    let remail = document.getElementById("remail");
    remail.innerHTML = result.registrar.email || "null";

    let rurl = document.getElementById("rurl");
    rurl.innerHTML = result.registrar.url || "null";

    let rphone = document.getElementById("rphone");
    rphone.innerHTML = result.registrar.phone || "null";
  });
});
