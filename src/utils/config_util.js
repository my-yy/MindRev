// import {remote} from "electron";
const remote = require('@electron/remote')
import json_util from "@/utils/json_util"
import time_util from "@/utils/time_util"
import fs from "fs"
import path from "path"

const isDevelopment = process.env.NODE_ENV !== 'production'
const userDataDir = remote.app.getPath("userData")
const trial_json_file_path = path.join(userDataDir, ".trial")


function getRemainTrialDays() {
  const obj = json_util.readJson(trial_json_file_path)
  console.log("obj.start_date", obj.start_date)
  return 120 - time_util.getDayDiff_tz(new Date(), obj.start_date)
}


function isActivated() {
  // return fs.existsSync(activate_json_file_path)
  return true
}

function makeActivate() {
  // fs.writeFileSync(activate_json_file_path, "")
}

function deleteActivation() {
  // fs.rmSync(activate_json_file_path)
}


export default {
  isDevelopment,
  userDataDir,
  getRemainTrialDays,
  isActivated,
  makeActivate,
  deleteActivation
}
