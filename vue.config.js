//将开发过程和发布过程分离，使用两个main.js入口
module.exports = {
  chainWebpack:config=>{
    //发布模式
    config.when(process.env.NODE_ENV === "production",config=>{
      config.entry("app").clear().add("./src/main-prod.js")
      //使用externals避免将所有依赖打包到一个文件中，造成文件资源过大
      // config.set('externals',{
      //   vue:'vue',
      //   'vue-router':'VueRouter',
      //   axios:'axios',
      //   lodash:'_',
      //   echarts:'echarts',
      //   nprogress:'NProgress',
      //   'vue-quill-editor':'VueQuillEditor'
      // })
      config.plugin("html").tap(args =>{
        //自己添加属性，用于判断是否处于开发模式
        args[0].isProd = true
        return args
      })
    })
    //开发模式
    config.when(process.env.NODE_ENV === "development",config=>{
      config.entry("app").clear().add("./src/main-dev.js")
      config.plugin("html").tap(args =>{
        //自己添加属性，用于判断是否处于开发模式
        args[0].isProd = false
        return args
      })
    })
  }
}