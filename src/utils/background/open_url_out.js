function setUp(window) {
  window.webContents.on('will-navigate', function (e, reqUrl) {
    console.log("will-navigate", reqUrl)

    //1)先得到url的host：
    let getHost = url => require('url').parse(url).host;
    let reqHost = getHost(reqUrl);
    //2)与当前的host进行比较，如果不等，就是调用外部程序打开
    let isExternal = reqHost && reqHost !== getHost(window.getURL());
    console.log("reqHost", reqHost)
    if (isExternal) {
      e.preventDefault();
      // const {shell} = require("electron")
      require('electron').shell.openExternal(reqUrl);
    }
  })
}

module.exports = {
  setUp
}
