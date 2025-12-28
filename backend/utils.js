const fs = require("fs");

const getPlexDomain = async function() {
  let domain = process.env.PLEX_DOMAIN_OVERRIDE || "plex.tv";
  
  try {
    const fileData = await fs.promises.readFile("/config/settings.js", "utf8");
    const settings = JSON.parse(fileData);
    
    if (settings.settings && settings.settings.plexDomain && settings.settings.plexDomain.trim() !== "") {
      domain = settings.settings.plexDomain.trim();
    }
  } catch (err) {
    // If file doesn't exist, just use default/env. Log other errors.
    if (err.code !== 'ENOENT') {
      console.error("Error reading/parsing settings for Plex Domain:", err);
    }
  }

  // Validate domain format to prevent SSRF/Injection
  // Matches alphanumeric domains/subdomains. Does not match ports or protocol prefixes.
  const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  if (!domainRegex.test(domain)) {
    console.error(`Invalid domain format detected: "${domain}". Using default "plex.tv"`);
    domain = "plex.tv";
  }

  return domain;
};

module.exports = {
  getPlexDomain
};
