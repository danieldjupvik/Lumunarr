var fs = require("fs");

var getPlexDomain = function() {
  return new Promise(function(resolve, reject) {
    var domain = process.env.PLEX_DOMAIN_OVERRIDE || "plex.tv";
    
    fs.readFile("/config/settings.js", "utf8", function(err, fileData) {
      if (!err) {
        try {
          var settings = JSON.parse(fileData);
          if (settings.settings && settings.settings.plexDomain && settings.settings.plexDomain.trim() !== "") {
            domain = settings.settings.plexDomain.trim();
          }
        } catch (err) {
          console.error("Error parsing settings for Plex Domain:", err);
        }
      }
      resolve(domain);
    });
  });
};

module.exports = {
  getPlexDomain: getPlexDomain
};
