const AdmZip = require("adm-zip");
const XmlReader = require('xml-reader');

function parseXML(xml) {
  const reader = XmlReader.create();
  return new Promise((resolve, reject) => {
    reader.on('done', data => {
      resolve(data)
    });
    reader.parse(xml);
  })
}


async function readStringFromZip(xmind_path, entryName) {
  const zip = new AdmZip(xmind_path);
  const zipEntries = zip.getEntries();
  const entry = zipEntries.filter(obj => obj.entryName === entryName)[0]
  const content = entry.getData().toString("utf8")
  return content
}


async function getInterestNodeListFromFile(the_path) {
  const xml = await readStringFromZip(the_path, "mapdata.xml")
  const data = await parseXML(xml)
  const attribute = data.attributes
  if (attribute.version !== "4.0") {
    throw new Error(`不支的iThoughtsX文件版本:${attribute.version}`)
  }
  const root = data.children[0].children[0]
  const node_list = []
  recursive_find(root, node_list)
  //补充mindmap路径
  node_list.forEach(node => {
    node._map_path = the_path
  })
  return node_list
}


function recursive_find(node, array) {
  // node.attributes
  // {
  //   uuid: 'EEECBC54-FFED-428D-B867-234C9B163CC5',
  //   position: '{116, 50}',
  //   text: 'C',
  //   created: '2022-10-19T20:54:06',
  //   modified: '2022-10-19T20:54:07'
  // }

  const text = node.attributes.text || ""
  const id = node.attributes.uuid

  if (isQANode(text)) {//感兴趣的
    let answer
    if (haveChild(node)) {//存在子节点
      answer = node.children.map(child_node => extractNodeContent(child_node))
    }
    array.push({"id": id, "q": extractNodeContent(node), "a": answer})
  }

  for (const child of (node.children || [])) {
    recursive_find(child, array)
  }
}

function extractNodeContent(node) {
  //XML
  //image-width="73.957031" att-id="F1187D88-AC1A-4B37-B5AB-66E79AF28047" att-name="image.png"

  let img_obj = null
  const has_img = node.attributes["att-name"] === "image.png"
  if (has_img) {
    img_obj = {
      src: node.attributes["att-id"],
    }
    if (node.attributes["image-width"]) {
      img_obj.width = node.attributes["image-width"]
    }
  }
  const obj = {
    title: node.attributes.text || "",
    image: img_obj
  }
  return obj
}


function isQANode(title) {
  title = title.trim()
  return title.endsWith("?") || title.endsWith("？")
}

function haveChild(node) {
  return node.children && node.children.length > 0
}


//======= 读取图片HTML
function readNodeImageHtml(mindmap_path, content_obj) {
  const zip = new AdmZip(mindmap_path);
  const entry = zip.getEntry(`assets/${content_obj.image.src}/image.png`)
  const buffer = entry.getData()
  const dataBase64 = buffer.toString('base64')
  const url_path = "data:image/png;base64, " + dataBase64

  let html = ""
  if (content_obj.image.width) {
    html += `<img src="${url_path}" width="${content_obj.image.width}"/>`
  } else {
    html += `<img src="${url_path}"/>`
  }
  return html
}


module.exports = {
  getInterestNodeListFromFile, readNodeImageHtml
}
