# hb-electron-quantitativeTrading
## 先说明下这程序
- 这是一款基于electron 开发的量化交易程序 对接的是火币API
- 为什么要使用electron开发呢？ 最初我是打算用java+vue做一套稍微大型的量化交易系统 但因为时间的关系 最终选择了electron做了套阉割版
- 当然 后续如果有时间了 我会重新用java+vue开发一套。
- **其实一开始是自己打算自己一个人用的，所以代码规范方面没考虑太多怎么方便怎么来....**

## 展示
![界面](https://raw.githubusercontent.com/myisx/hb-electron-quantitativeTrading/main/static/jiemian.png)
![邮件](https://raw.githubusercontent.com/myisx/hb-electron-quantitativeTrading/main/static/youxiang.png)

## 界面
- UI界面用的是这位大哥的 [BaseDesktopApp](https://github.com/williamfzc/BaseDesktopApp)
- 作为一名java后端 写的UI真的不能看

## 核心文件
- 邮箱配置: *email.js*
- K线计算： *line.js*
- 币种以及url等配置 ： *env.js*
- 改币种的话记得吧  *Home.vue 571行 汇率改下*  
- 注意 使用前先把电脑本地时间改成 **UTC(协调世界时)** 
- ......
### 安装依赖

``` bash
npm install
```

### 运行
```
npm run dev
```

### 编译
```
npm run build
```

## 依赖

- [Electron](https://electronjs.org)
- [Vue](https://cn.vuejs.org)
- [ElementUI](http://element.eleme.io/#/zh-CN)
- [Echarts](https://echarts.apache.org/zh/api.html#echarts)
- [Nodemailer](https://github.com/nodemailer/nodemailer-wellknown)
