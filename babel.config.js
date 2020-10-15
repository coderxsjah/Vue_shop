//项目发布阶段才使用的babel插件
const ProdPlugins = []
if(process.env.NODE_ENV === 'production'){
  ProdPlugins.push( "transform-remove-console")
}

module.exports = {
  "presets": [
    "@vue/cli-plugin-babel/preset"
  ],
  "plugins": [
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }
    ],
    //发布产品时使用的babel插件
    ...ProdPlugins
  ]
}