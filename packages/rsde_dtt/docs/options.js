const config = require("config");
// options.js
module.exports = {
  info: {
    title: config.get("name"),

    description: `Documentation for ${config.get("name")} API endpoints.`,
  },
  servers: [
    {
      url: `http://localhost:${config.get("port")}`,
      description: "Local server",
    },
    {
      url: `https://digiwork-lta-dev.net/${config.get("name")}`,
      description: "Sandbox environment server",
    },
  ],
  folders: {
    concat: false,
    separator: " > ",
  },
};
