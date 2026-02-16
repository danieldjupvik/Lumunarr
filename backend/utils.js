var fs = require("fs");

function getPlexDomain() {
  var domain = process.env.PLEX_DOMAIN_OVERRIDE || "plex.tv";

  try {
    var fileData = fs.readFileSync("/config/settings.js");
    var settings = JSON.parse(fileData);

    if (settings.settings && settings.settings.plexDomain && settings.settings.plexDomain.trim() !== "") {
      domain = settings.settings.plexDomain.trim();
    }
  } catch (err) {
    if (err.code !== "ENOENT") {
      console.error("Error reading/parsing settings for Plex Domain:", err);
    }
  }

  var domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  if (!domainRegex.test(domain)) {
    console.error(`Invalid domain format detected: "${domain}". Using default "plex.tv"`);
    domain = "plex.tv";
  }

  return domain;
}

module.exports = {
  getPlexDomain,
};
