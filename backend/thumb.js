var express = require("express");
var router = express.Router();
var axios = require("axios").default;
var parser = require("xml-js");
var fs = require("fs");

function getPlexDomain() {
  var domain = process.env.PLEX_DOMAIN_OVERRIDE || "plex.tv";
  try {
    if (fs.existsSync("/config/settings.js")) {
      var fileData = fs.readFileSync("/config/settings.js");
      var settings = JSON.parse(fileData);
      if (settings.settings && settings.settings.plexDomain && settings.settings.plexDomain.trim() !== "") {
        domain = settings.settings.plexDomain.trim();
      }
    }
  } catch (err) {
    console.error("Error reading settings for Plex Domain:", err);
  }
  return domain;
}

router.post("/", async function (req, res, next) {
  var PLEX_DOMAIN = getPlexDomain();
  var url = `https://${PLEX_DOMAIN}/users/account`;

  await axios
    .get(url, { params: { "X-Plex-Token": req.body.token } })

    .then(function (response) {
      console.info("Retrieving thumbnail from Plex account");

      let thumb = parser.xml2js(response.data, { compact: true, spaces: 4 }).user._attributes.thumb;
      let username = parser.xml2js(response.data, { compact: true, spaces: 4 }).user._attributes.username;
      let email = parser.xml2js(response.data, { compact: true, spaces: 4 }).user._attributes.email;

      let data = { thumb, username, email };

      res.send(JSON.stringify(data));
    })
    .catch(function (error) {
      if (error.request) {
        console.error("Could not connect to the Plex sewrver");
        res.status(403).send("Could not connect to the Plex server");
      }
    });
});

module.exports = router;