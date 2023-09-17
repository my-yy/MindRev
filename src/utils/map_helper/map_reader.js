const xmind_util = require("@/utils/map_helper/xmind_util");
const itmz_util = require("@/utils/map_helper/itmz_util");

async function getInterestNodeListFromFile(the_path) {
  if (the_path.endsWith(".xmind")) {
    return xmind_util.getInterestNodeListFromFile(the_path)
  } else {
    return await itmz_util.getInterestNodeListFromFile(the_path)
  }
}


function readNodeImageHTML(mindmap_path, content_obj) {
  if (mindmap_path.endsWith(".xmind")) {
    return xmind_util.readNodeImageHtml(mindmap_path, content_obj)
  } else {
    return itmz_util.readNodeImageHtml(mindmap_path, content_obj)
  }
}


module.exports = {
  getInterestNodeListFromFile,
  readNodeImageHTML,
}
