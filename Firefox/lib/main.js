var pageMod = require("sdk/page-mod");
var self = require("sdk/self");

pageMod.PageMod({
  include: "*.youtube.com",
  contentScriptFile: self.data.url("script.js")
});