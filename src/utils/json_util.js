const fs = require("fs")
const path = require("path")

const dateIsoPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
const dateTransformer = function (key, value) {
  if (typeof value === "string" && dateIsoPattern.test(value)) {
    return new Date(value);
  }
  return value;
}

function readJson(conf_path) {

  return JSON.parse(fs.readFileSync(conf_path).toString(), dateTransformer)
}


function writeJson(desc_path, obj) {
  const replacer = (key, value) => { //去掉以_开头的
    if (key.startsWith("_")) {
      return undefined;
    }
    return value;
  }
  fs.writeFileSync(desc_path, JSON.stringify(obj, replacer, 2))
}


module.exports = {
  readJson,
  writeJson,
  dateTransformer
}
