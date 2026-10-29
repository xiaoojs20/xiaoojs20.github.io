# Liquid Stack

[English](README.md) · [主题 Demo](https://liquid-stack.pages.dev/zh/) · [真实站点演示](https://jingyuan-zheng.github.io/) · [使用此模板](https://github.com/new?template_name=Liquid-Stack&template_owner=Jingyuan-Zheng)

Liquid Stack v1.2.0 是一套基于原版 [Hugo Theme Stack](https://github.com/CaiJimmy/hugo-theme-stack) v4.0.3 的完整双语 Hugo 站点模板。它保留 Stack 的博客基础，并加入个人主页式首页、启动台、可交互照片墙、内容仪表盘、Sveltia CMS、Waline 扩展、友链申请流程、双语站点地图和可直接替换的示例内容。

## v1.2.0 更新内容

- 加入手机个人信息顶栏，滚动时仍可使用深浅色切换、语言切换和菜单入口
- 为较长的关于页面或简历页面加入适合触控操作的浮动导航
- 加入可选的虚拟产品目录 Demo，提供双语数据、搜索、筛选、排序、分类折叠与手机卡片布局
- 加入 Web App 基础支持，包括安装图标、Manifest、独立窗口元数据与浏览器明暗主题色
- 加入可选的 Waline 安全上传与评论验证接口，默认关闭，配置兼容后端后才启用
- 加入可选的人工撰写与 AIGC 辅助文章标识，并提供 CMS 选择项和双语示例

面向使用者的更新说明见双语文章 [Liquid Stack 1.2.0](https://liquid-stack.pages.dev/zh/p/liquid-stack-1-2-0/)，完整实现与检查记录见 [`docs/feature-port-checklist.md`](docs/feature-port-checklist.md)。

## 界面截图

![Liquid Stack 主页](project-site/images/screenshots/home-light-en.png)

<p align="center">
  <img src="project-site/images/screenshots/mobile-profile-bar.png" alt="统一的手机个人信息顶栏" width="320">
</p>

| 首页公告 | 展开的公告 |
| --- | --- |
| ![首页公告](project-site/images/screenshots/home-announcement.png) | ![展开的首页公告](project-site/images/screenshots/home-announcement-open.png) |

| Liquid Glass 细节 | 启动台与照片墙 |
| --- | --- |
| ![Liquid Glass 控件](project-site/images/screenshots/liquid-glass-social.png) | ![项目启动台](project-site/images/screenshots/launchpad.png) |
| ![Liquid Glass 导航](project-site/images/screenshots/liquid-glass-navigation.png) | ![可交互照片墙](project-site/images/screenshots/photo-wall.png) |

| 网站仪表盘 | 可视化 CMS | 评论区 |
| --- | --- | --- |
| ![网站仪表盘](project-site/images/screenshots/dashboard-statistics.png) | ![Sveltia CMS](project-site/images/screenshots/cms.png) | ![Waline 评论布局](project-site/images/screenshots/comments.png) |

| 网站管理菜单 | 友链申请模板 |
| --- | --- |
| ![网站管理菜单](project-site/images/screenshots/management-menu.png) | ![中英双语友链申请表单](project-site/images/screenshots/backlink-form.png) |

完整的带说明截图请查看[项目介绍页](https://jingyuan-zheng.github.io/Liquid-Stack/)。

## Liquid Stack 新增内容

### 视觉系统

- 以苹果 Liquid Glass 设计语言为灵感，加入半透明弹层、背景模糊、柔和表面和明暗模式适配
- 为文章卡片、主页组件、面板、控件和角标建立统一的圆角层级
- 使用 Lucide 轻量线性图标统一功能入口与导航
- 使用浅灰紫与中性色作为主要配色，以少量功能色帮助识别状态
- 提供安装图标、独立窗口与浏览器主题色等 Web App 基础元数据（不包含离线缓存）

### 主页组件

- 可替换身份信息、介绍和社交链接的个人信息区域
- 连接启动台、关于页面、仪表盘和照片墙的快捷卡片
- 显示访客本地时间和站点设置时间的双模拟世界时钟
- 采用同一视觉系统的搜索、归档、分类、标签和文章列表

### 阅读与双语发布

- 按照浏览器地区显示文章日期，并提供打印、分享、相关文章、目录和全文搜索
- 根据浏览器语言自动选择英文或简体中文，保存手动语言偏好，并优先进入同一文章的译文
- 提供面向读者的双语网站地图、多语言 XML sitemap 和带搜索入口的 404 页面

### 项目、照片与关于页面

- 通过数据文件管理图标、预览图、文章和仓库链接的项目启动台
- 支持横图、竖图、拖动排列、聚焦查看和浏览器位置记忆的照片墙
- 带进入动画、时间线和浮动菜单的关于页面，可用于个人介绍、网站故事、作品经历或简历
- 使用少量虚拟数据演示搜索、排序、筛选与响应式表格的可选产品目录
- 可选的文章写作标识，区分人工撰写与 AIGC 辅助

### 管理与互动

- 可配置的管理菜单，集中连接内容后台、评论、部署、分析和其他站点工具
- 位于 `/admin/` 的 Sveltia CMS，可在浏览器中编辑双语文章和网站数据
- 根据 Hugo 内容生成文章统计、分类、标签、发布习惯和年度热力图的网站仪表盘
- 与主题样式统一的 Waline 评论和完整友链申请流程

## 使用模板创建站点

1. 在 GitHub 点击 **Use this template**，创建一个新的公开仓库。
2. 打开 `hugo.yaml`，替换 `baseURL`、站点名称、版权、侧栏介绍和社交链接。
3. 替换 `data/` 下的示例数据和 `static/img/` 下的通用素材。
4. 使用 Hugo Extended 构建网站。
5. 将生成的 `public/` 目录发布到 Cloudflare Pages 或你选择的静态托管平台。

## 本地预览

安装 Hugo Extended，然后在仓库根目录运行：

```bash
hugo server -D
```

正式构建使用：

```bash
hugo --minify --cleanDestinationDir --ignoreCache
```

## 部署

公开 Demo 部署在 Cloudflare Pages，并已连接到本仓库：每次推送到 `main` 都会使用 Hugo Extended 0.161.0 自动构建。你自己的站点也可以在 Cloudflare Pages 连接仓库，将构建命令设为 `hugo --minify --cleanDestinationDir --ignoreCache`，输出目录设为 `public`。

## Demo 配套资源

- [评论、友链申请与邮件模板](https://liquid-stack.pages.dev/zh/p/comment-forms-email-templates/)介绍完整示例流程。
- 公开 Demo 使用纯前端评论预览并显示示例评论，不连接评论数据库，也不会记录提交内容。
- 主页页脚显示带说明的全站浏览量静态示意值，所有页面显示 365 天示意运行时间。正式接入后，全站浏览量由 Waline 提供。
- 可以[打开友链申请演示](https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAAO__bK_KBBUQ0sxMlZYNVA0OTZIQTMySkxLVjdXTVJNNS4u)，也可以[复制 Microsoft Forms 模板](https://forms.cloud.microsoft/Pages/ShareFormPage.aspx?id=DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAAO__bK_KBBUQ0sxMlZYNVA0OTZIQTMySkxLVjdXTVJNNS4u&sharetoken=TnsZOZAtRpQBsNnIX6GA)。
- 申请演示仅供参考，Demo 网站不会保存填写内容或用于审核。请先复制模板，再连接自己的处理流程。
- 已去敏的双语 HTML 邮件位于 [`examples/email-templates`](examples/email-templates/)。

## 目录说明

- `hugo.yaml`：站点信息、语言、菜单、小组件和服务配置
- `content/`：双语页面、分类和文章
- `layouts/`：Liquid Stack 的模板覆盖和新增页面
- `assets/`：定制样式、交互脚本和 CMS 基础配置
- `data/launchpad/`：启动台项目
- `data/photo-wall/`：照片墙条目
- `data/friend-links/`：友链卡片
- `data/product-catalog.yaml`：可选的虚拟产品目录记录
- `examples/email-templates/`：已去敏的读者回复与友链通过通知邮件
- `static/img/`：可以替换的示例图片与图标
- `docs/waline-secure-uploads.md`：可选安全上传后端接口说明
- `themes/hugo-theme-stack/`：未经修改的官方 Stack v4.0.3

官方 Stack 主题文件保持原样，Liquid Stack 的站点功能通过项目根目录扩展。完整说明见[欢迎使用 Liquid Stack：主题新增功能](https://liquid-stack.pages.dev/zh/p/welcome-to-liquid-stack/)。

## 许可证

Liquid Stack 与内置的上游 Stack 主题一致，采用 GPL v3.0 或更高版本。完整许可证位于 `themes/hugo-theme-stack/LICENSE`。
