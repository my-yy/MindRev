import {shell} from "electron";

const isMacOS = process.platform === 'darwin';


function openFile(the_path) {
  shell.openPath(the_path)
}

export default {
  openFile
}

