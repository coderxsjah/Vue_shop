import axio from 'axios'

export function request(config) {
  //1.创建axios实例
  const instance = axio.create({
    baseURL:"http://127.0.0.1:8888/api/private/v1/",
    timeout:5*1000
  })
  //2.axios拦截器的使用
  //2.1请求拦截器
  instance.interceptors.request.use(config=>{
    //todo 对于请求config做一个初步处理
    return config
  },err=>{
    //todo 对错误信息的处理
    console.log(err);
  })

  //2.2响应拦截器
  instance.interceptors.response.use(res=>{
    //todo 对结果的预处理
    return res.data
  },err=>{
    console.log(err);
  })

  //3.返回请求
  return instance(config);
}