const remote = require('@electron/remote')
const userDataDir = remote.app.getPath("userData")
const path = require("path")
const fs = require("fs")
const Datastore = require('nedb-promises')
const db_folder_path = path.join(userDataDir, "my_database")

if (!fs.existsSync(db_folder_path)) {
  fs.mkdirSync(db_folder_path, {recursive: true})
}

const db_item_path = path.join(db_folder_path, "item.db")
const db_map_path = path.join(db_folder_path, "map.db")

console.log("db_map_path:", db_map_path)


const item_db = Datastore.create(db_item_path)

// item_db.load()

const mind_map_db = Datastore.create(db_map_path)
item_db.insert({"A": 1})

function getItemCollection() {
  return item_db
}

function getMapCollection() {
  return mind_map_db
}

function getDBRootPath() {
  return db_folder_path
}

module.exports = {
  getItemCollection,
  getMapCollection,
  getDBRootPath,
}
