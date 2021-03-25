# AHdark二开 Github2Wework Robot

### 腾讯云函数部署

1. `git clone https://github.com/RoundCloud-cn/Github2WorkWechat-Bot.git`
2. 注册并登陆腾讯云管理后台，新建一个云函数，可以先选个Node的Helloworld模板
3. 将代码目录上传
4. 点击保存（保存后可以测试试试）
5. 选择触发方式，添加新的触发方式，类型选择API网关，保存后得到url
6. ok!可以填到Github的webhook里了，类型选择`Send me everything`，也可以自定义，url填上上面的url，**别忘了要在后面加上`?id={你的机器人id}`作为参数**。

### 目前支持的事件

- Push
- Issue 
- Merge
- Repository
- Team
- Release
- Projects

### Github

如果是使用github，在github项目中的`Setting`中选择`Webhooks`，选择`Add Webhooks`，填写url，如`http://{{你的腾讯云函数API请求域名}}?id={{机器人id}}`。

`/github`用来区分github和gitlab，这两者的处理方式不同。

`id`参数代表自定义的机器人id，可以在企业微信的机器人列表中查看（注意，这个必须要自己新建的机器人才能看到）
