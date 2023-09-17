import {app} from "electron";

export const isMacOS = process.platform === 'darwin';

let isQuiting = false
app.on('before-quit', () => isQuiting = true); //cmd+Q

export function setUpOnCloseEvent(window) {
  window.on('close', (event) => { //点击关闭按钮 或者 执行cmd+Q 都会触发
    if (isQuiting) {//cmd+q 在执行，不执行拦截逻辑
      return
    }
    if (window.fullScreen) {
      return; //如果是在全屏模式下，则还是关闭，否则界面会变成黑的。
    }
    if (isMacOS) {//Mac下只是隐藏窗口
      event.preventDefault();
      window.hide()
    }
  })
}

