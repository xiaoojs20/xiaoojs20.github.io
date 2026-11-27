# 评论系统接入说明

网站的文章、照片墙及单张照片已接入 Waline，`params.comments.enabled` 为 `true`。访客无需账号即可留言或点表情，中文与英文页面共用同一条讨论串。

## 当前部署

- 服务端：Vercel 项目 `blog-waline`，公开地址 `https://blog-waline-ten-delta.vercel.app`，函数区域 `sin1`（新加坡），运行时 Node.js 22。
- 数据库：Neon 项目 `blog-waline`（分支 `production`，区域 AWS Asia Pacific 1 新加坡），表 `wl_comment` / `wl_counter` / `wl_users` 由 `waline.pgsql` 建表。
- 数据库连接信息只保存在 Vercel 环境变量（`PG_HOST`、`PG_PORT`、`PG_USER`、`PG_PASSWORD`、`PG_DB`、`PG_SSL`），不进仓库。修改环境变量后需要重新部署才会生效。
- 表情反馈固定四档 ❤️ 👍 🤔 👎，图标由 `custom.scss` 用原生 emoji 绘制，页面上不显示中文标签，计数在图标下方以小号灰字呈现。

## 运维要点

1. 管理员账号：用 `https://blog-waline-ten-delta.vercel.app/ui/register` 注册首个账号即为管理员，之后在 `/ui` 管理评论。不要再把注册页公开宣传。
2. 审核与反垃圾：默认没有开启待审核与邮件通知。需要在服务端补上垃圾评论过滤（如 Akismet）与必要时的审核策略；未配置邮件服务时不能承诺回复邮件通知。
3. 备份：可在 `/ui` 导出数据库，或定期导出 Neon 数据。删除评论会同时影响中英文页面，操作前先确认路径。
4. 浏览量：前端已开启 Waline 计数（`pageview: true`），文章页与照片页的浏览数由 Waline 记录，不再依赖 Cloudflare 数据。

## 前端约定

访客无需 GitHub 账号，昵称必填、邮箱选填。默认关闭评论中图片上传。照片评论按 `data/photo-wall/` 中的稳定 `id` 标识，更新排序、标题或译文时应保留 id；缺少 id 时使用图片路径的哈希，替换图片路径会改变该照片的评论地址。文章按去掉 `/zh/` 的页面路径共享评论，修改 slug 前应迁移已有评论。

`hugo.yaml` 中 `params.comments.waline.serverURL` 必须是真实 HTTPS 地址；模板在地址为空或仍是 `example.com` 时会直接构建失败，避免误发占位配置。
