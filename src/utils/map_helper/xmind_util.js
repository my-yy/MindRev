const AdmZip = require("adm-zip");


function getInterestNodeListFromFile(xmind_path) {
  const json_data = readJsonMeta(xmind_path)
  const node_list = getInterestNodeList(json_data)
  //补充mindmap路径
  node_list.forEach(node => {
    node._map_path = xmind_path
  })
  return node_list
}


function readJsonMeta(xmind_path) {
  const zip = new AdmZip(xmind_path);
  const zipEntries = zip.getEntries();
  const entry = zipEntries.filter(obj => obj.entryName === "content.json")[0]
  const content = entry.getData().toString("utf8")
  const jsonObj = JSON.parse(content)
  return jsonObj
}

function getInterestNodeList(json_data) {
  const rootTopic = json_data[0].rootTopic
  const interest_node_list = []
  recursive_search(rootTopic, interest_node_list)
  return interest_node_list
}

function recursive_search(node, interest_node_list) {
  //曾经有报错说node.title是undefined
  const title = node.title || ""
  const id = node.id
  if (isQANode(title)) {//属于需求的内容
    let answer = []
    if (haveChild(node)) {//存在子节点
      answer = node.children.attached.map(child_node => extractNodeContent(child_node))
    }
    interest_node_list.push({id, "q": extractNodeContent(node), "a": answer})
  }
  if (haveChild(node)) {
    const array = node.children.attached
    for (const node of array) {
      recursive_search(node, interest_node_list)
    }
  }
}

function haveChild(node) {
  return node.children && node.children.attached
}

function isQANode(title) {


  return title.endsWith("?") || title.endsWith("？")
}

function extractNodeContent(node) {
  const obj = {
    title: node.title || "",
    image: node.image || null//这里的node.image是个对象，里面包含有 src、width、height字段
  }
  return obj
}


//======= 读取图片HTML
function readNodeImageHtml(mindmap_path, content_obj) {
  let html = ""
  const zip = new AdmZip(mindmap_path);
  const src = content_obj.image.src
  //xap:resources/....
  const entryName = src.split("xap:")[1]
  const entry = zip.getEntry(entryName)

  const buffer = entry.getData()
  const dataBase64 = buffer.toString('base64')
  const url_path = "data:image/png;base64, " + dataBase64
  //https://stackoverflow.com/questions/8499633/how-to-display-base64-images-in-html

  //图片尺寸：
  if (content_obj.image.width) {
    html += `<img src="${url_path}" width="${content_obj.image.width}" height=${content_obj.image.height}/>`
  } else {
    html += `<img src="${url_path}"/>`
  }
  return html
}


module.exports = {
  getInterestNodeListFromFile, readNodeImageHtml
}
