const remote = require('@electron/remote')
const userDataDir = remote.app.getPath("userData")
const path = require("path")
const fs = require("fs")
const loki = require("lokijs")
const db_folder_path = path.join(userDataDir, "my_database")
const json_util = require("./json_util")
if (!fs.existsSync(db_folder_path)) {
  fs.mkdirSync(db_folder_path, {recursive: true})
}

const db_path = path.join(db_folder_path, "mindrev.db")
console.log("db_path:", db_path)

let the_db


function getOrAddCollection(db, name) {
  let item = db.getCollection(name);
  if (item === null) {
    item = db.addCollection(name);
  }
  return item
}


function initDB() {
  if (the_db) {//已经初始化了
    return
  }
  return new Promise(resolve => {
    const db = new loki(db_path, {
      autoload: true,
      autoloadCallback: () => {


        item_collection = getOrAddCollection(db, "item", {
          unique: ['_id'] //并没有用默认的$loki，而是用自己的_id字段
        })
        map_collection = getOrAddCollection(db, "map", {
          unique: ['path']
        })
        the_db = db
        console.log("db inited~")

        resolve()

      },//成功加载后的回调
      autosave: true,
      autosaveInterval: 4000
    });
  })
}


let item_collection
let map_collection


function closeDB() {
  the_db.close()
}


function getItemCollection() {
  return item_collection
}

function getMapCollection() {
  return map_collection
}

function getDBRootPath() {
  return db_folder_path
}

function deleteMindMapByPath(val) {
  map_collection.chain().find({"path": val}).remove()
}

function getItemById(_id) {
  const item = item_collection.findOne({_id})
  if (!item) {
    return
  }
  return JSON.parse(JSON.stringify(item), json_util.dateTransformer)
}

function updateItem(item) {
  item_collection.update(item)
}

function insertItem(item) {
  item_collection.insert(item)
}

function deleteItemByID(the_id) {
  item_collection.chain().find({"_id": the_id}).remove()
}

module.exports = {
  closeDB,
  initDB,
  getMapCollection,
  updateItem,
  getDBRootPath,
  deleteMindMapByPath,
  getItemById,
  insertItem,
  deleteItemByID
}
