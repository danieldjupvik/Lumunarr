const fs = require("fs");

var getPlexDomain = function() {
  return new Promise(function(resolve) {
    var domain = process.env.PLEX_DOMAIN_OVERRIDE || "plex.tv";
    
    fs.readFile("/config/settings.js", "utf8", function(err, fileData) {
      if (!err) {
        try {
          var settings = JSON.parse(fileData);
          if (settings.settings && settings.settings.plexDomain && settings.settings.plexDomain.trim() !== "") {
            domain = settings.settings.plexDomain.trim();
          }
        } catch (parseErr) {
          console.error("Error parsing settings for Plex Domain:", parseErr);
        }
      }
      resolve(domain);
    });
  });
};

module.exports = {
  getPlexDomain: getPlexDomain
};