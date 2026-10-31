# 博客访客统计

本站使用 Cloudflare Web Analytics，在 Cloudflare 后台查看统计，不在公开博客展示统计结果。

## 接入

1. 登录自己的 [Cloudflare 账号](https://dash.cloudflare.com/)，进入 **Web Analytics**，选择 **Add a site**。
2. 添加主机名 `xiaoojs20.github.io`，选择手动安装 JavaScript。保留 GitHub Pages 托管，无需更换域名或 DNS。
3. 从 Cloudflare 提供的代码中复制 `data-cf-beacon` 内的 `token`，填入 `hugo.yaml` 的 `params.analytics.cloudflare.token`。这是可公开的采集标识，不是用于读取报告的 API 凭证。
4. 使用生产环境构建并同步发布中英文页面；普通 `hugo server` 开发预览不加载统计脚本。没有填写 token 时不加载统计脚本。
5. 访问线上页面，在浏览器网络面板确认 `beacon.min.js` 加载及统计上报成功；后台可能需要几分钟才显示数据。

## 仅自己查看

- 报告在 Cloudflare 账号内读取，不生成公开统计页面，不把查询统计的 API 凭证写入博客。
- 使用仅自己有访问权限的个人 Cloudflare 账号；检查账号成员，避免把 Web Analytics 或账号分析权限授予其他人。
- 页面源码里的采集 token 不能用于登录 Cloudflare 或读取统计报告。

## 可以查看什么

- 按天或其他时间范围查看访问次数、页面浏览量和趋势。
- 按页面路径、国家、来源网站、设备类型、浏览器及操作系统筛选。
- Cloudflare 的 **Visits** 是访问次数，不等同于去重后的自然人数；本统计不能识别具体朋友的身份，也不能补回接入前的数据。
- 广告拦截、网络问题或脚本未执行可能造成漏报。

官方说明：[接入步骤](https://developers.cloudflare.com/web-analytics/get-started/)、[统计维度](https://developers.cloudflare.com/web-analytics/data-metrics/dimensions/)、[指标定义](https://developers.cloudflare.com/web-analytics/data-metrics/high-level-metrics/)。

English: [analytics-setup.en.md](analytics-setup.en.md)
