
module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      devTools:false,
      builderOptions: {
        appId: "com.taskbox",
        productName: "taskbox",
        copyright: "Copyright © year ${author}",
        win: {     
          target: "nsis",
          icon: "public/icon.ico",
          // requestedExecutionLevel:"requireAdministrator",
        },
        "nsis":{
          "oneClick":false
        },
        rpm: {
          category: "Other"
        },
      }
    }
  },
  transpileDependencies: [
    'vuetify'
  ]
}
