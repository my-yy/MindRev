builderOptions = {
  "productName": "MindRev",
  "appId": "com.huacishu.mindrev2",
  "mac": {
    "icon": "public/icons/icon.icns",
    "target": {
      "target": "dmg",
      "arch": [
        "arm64", "x64",
      ]
    },
  },
  "dmg": {
    "artifactName": "MindRev-${version}-Mac-${arch}.${ext}",
    "contents": [
      {
        "x": 410,
        "y": 150,
        "type": "link",
        "path": "/Applications"
      },
      {
        "x": 130,
        "y": 150,
        "type": "file"
      }
    ]
  },
  "nsis": {
    "artifactName": "MindRev-${version}-Windows-${arch}.${ext}"
  },
  "win": {
    "icon": "public/icons/256.png",
    "target": "nsis"
  }
}


const fixNedbForElectronRenderer = {
  apply(resolver) {
    resolver
      .getHook("beforeDescribed-relative")
      .tapAsync(
        "FixNedbForElectronRenderer",
        (request, resolveContext, callback) => {
          if (!request.descriptionFileData.name === "nedb") {
            return callback()
          }

          let relativePath
          if (
            request.path.startsWith(
              resolver.join(request.descriptionFileRoot, "lib/storage")
            )
          ) {
            relativePath = "lib/storage.js"
          } else if (
            request.path.startsWith(
              resolver.join(
                request.descriptionFileRoot,
                "lib/customUtils"
              )
            )
          ) {
            relativePath = "lib/customUtils.js"
          } else {
            return callback()
          }

          const path = resolver.join(
            request.descriptionFileRoot,
            relativePath
          )
          const newRequest = Object.assign({}, request, {path})
          callback(null, newRequest)
        }
      )
  }
};

module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      builderOptions: builderOptions
    }
  },
  // configureWebpack: {
  //   "externals": {
  //     "nedb": "commonjs nedb"
  //   }
  // },
  // chainWebpack: config => {
  //   config.externals({"nedb": "commonjs nedb"})
  // }
  chainWebpack: config => {
    config.resolve
      .plugin("fixNedbForElectronRenderer")
      .use(fixNedbForElectronRenderer);
  },
}
