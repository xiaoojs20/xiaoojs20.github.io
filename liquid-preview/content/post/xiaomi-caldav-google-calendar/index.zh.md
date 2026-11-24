---
title: "小米澎湃 OS 同步 Google 日历"
description: "一次实测：Google 账户已登录但系统日历同步失败，改用小米日历自带的 CalDAV 导入连接 Google Calendar。"
slug: xiaomi-caldav-google-calendar
date: "2026-11-24T22:23:45+08:00"
written: "2026.11"
note: true
hidden: true
share: false
license: false
---

> 2026 年 11 月 24 日实测。

今天花了半天时间折腾小米手机的 Google 日历同步。Google 账户已经登录，联系人等同步项目也有更新记录，偏偏系统日历一直同步失败。

最后发现，根本不用折腾 Google 服务框架，也不用安装其他应用。小米日历本身就支持 CalDAV，直接连接 Google Calendar 就能解决问题。

## 问题出在哪？

进入小米手机的 Google 账户同步页面，会发现其中有两个容易混淆的项目：**Google 日历**和**日历**。

我的手机上，前者显示当天已经同步，后者却一直报错，上次成功同步的时间甚至停留在 2025 年 10 月 24 日。Google 日程也无法正常显示在小米自带的日历里。

Android 的系统日历依赖日历同步适配器和系统日历数据库。即使 Google 账户能够正常登录，也不代表系统日历同步链路一定正常。至于这次究竟是哪个组件出了问题，我没有继续深究，而是换了一种同步方式。

## 解决方法：使用小米日历自带的 CalDAV

CalDAV 是一种开放的日历访问与同步协议。既然小米日历支持它，Google Calendar 也提供相应的接口，就可以尝试绕过原有的 Google 账户日历同步机制。

整个过程只需要准备一个 Google 应用专用密码和 CalDAV 服务器地址。

### 1. 生成 Google 应用专用密码

首先进入 [Google 账户安全设置](https://myaccount.google.com/security)，确认已经开启两步验证。

然后打开 [应用专用密码管理页面](https://myaccount.google.com/apppasswords)，创建一个新密码，应用名称可以填写 `Xiaomi Calendar`。

Google 会生成一个 16 位的应用专用密码，复制下来备用。填写时去掉空格即可。

注意，这里用的是**应用专用密码，不是 Google 账户的登录密码**。如果以后不再使用这项同步服务，可以在 Google 账户中单独撤销这个密码。

### 2. 在小米日历中添加 CalDAV 账户

打开小米手机自带的日历 App，依次进入：

**右上角三个点 → 设置 → 日程账号管理 → 导入账号 → CalDAV 账户导入**

进入后，填写以下信息。假设你的 Google 邮箱是 `example@gmail.com`：

| 配置项 | 填写内容 |
| --- | --- |
| 用户名 | `example@gmail.com` |
| 密码 | 刚刚生成的 16 位应用专用密码 |
| 服务器地址 | `https://www.google.com/calendar/dav/example@gmail.com/user/` |

服务器地址可以直接复制下面这一行：

```text
https://www.google.com/calendar/dav/example@gmail.com/user/
```

将其中的 `example@gmail.com` 换成自己的 Google 邮箱，确保手机能够访问 Google 服务，然后登录。

添加成功后，返回小米日历，检查 Google 日程是否已经出现。我就是通过 Google 的旧版 CalDAV 接口成功同步的。

## 最容易踩的坑：Google 的新旧 CalDAV 接口

这次之所以折腾了这么久，很大程度上是因为 Google 已经更换了 CalDAV 接口。

旧版接口：

```text
https://www.google.com/calendar/dav/
```

新版接口：

```text
https://apidata.googleusercontent.com/caldav/v2/
```

按照 [Google 官方开发文档](https://developers.google.com/workspace/calendar/caldav/v2/guide)，旧版端点已经弃用，不再受支持；新版接口要求使用 OAuth 2.0 认证，不支持传统的 Basic Authentication。

而小米日历的 CalDAV 导入界面只有服务器地址、用户名和密码，并没有 Google OAuth 授权入口。因此，直接照着新版官方文档填写地址，并不能解决认证问题。

原本看到旧接口已经弃用，我也以为这条路走不通了。但实际试了一下，**截至 2026 年 11 月 24 日，旧版接口仍然能够连接，并成功将 Google 日程同步到我的小米手机上。**

弃用并不意味着服务一定已经关闭。不过，既然 Google 不再提供官方支持，这个方法就有可能在未来失效，也不能保证每个账户和系统版本都能使用。

## 之后还需要手动同步吗？

CalDAV 不同于一次性的 ICS 文件导入。它本身支持持续同步，也具备双向读写日程的能力。

不过，小米日历具体如何执行后台同步、同步间隔是多少，以及能否将本地修改写回 Google Calendar，还取决于客户端的实现。我目前确认的是账户连接和日程获取成功，尚未验证长期自动同步和双向写入。

可以在手机设置中开启自动同步数据，允许小米日历后台联网，并确保后台网络能够访问 Google 服务。然后在电脑端新建一个 Google 日程，观察手机端是否会自动更新，就能判断后台同步是否正常。

如果后续原来的 Google 日历同步也恢复了，记得检查是否存在重复日程，必要时隐藏或关闭旧的同步来源。

---

费了半天劲，最终还是靠小米日历自带的功能解决了问题。如果你也遇到类似情况，不妨先试试 CalDAV，再考虑其他更复杂的解决方案。至少在这次实测中，不需要 Root、刷机或额外安装应用。

参考资料：[Google CalDAV API 开发指南](https://developers.google.com/workspace/calendar/caldav/v2/guide) · [Google 应用专用密码说明](https://support.google.com/accounts/answer/185833?hl=zh-Hans)
