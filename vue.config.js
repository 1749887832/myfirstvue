module.exports = {
    pwa: {},
    // webpack-dev-server 相关配置
    devServer: {
        proxy: {// 设置代理 本地记得改ip地址
            '/api': {
                target: 'http://192.168.2.5:8000',   //后台接口地址
                ws:true,    // 如果要代理websockets，配置这个参数
                secure:false,   // 如果是https接口，需要配置这个参数
                changeOrigin: true, //是否跨域
                pathRewrite: {
                    '^/api': '/'
                }
            }
        },
    },
}