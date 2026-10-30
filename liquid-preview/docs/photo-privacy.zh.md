# 人像照片的答题解锁

仅为选定的人像照片开启。本人单人照和未标记照片保持公开。默认问题为「这个人（之一）是谁，除了我？」；一张合影可以接受多个姓名、昵称或英文名。页面、提问、错误提示和解锁状态均提供中英文。

公开图片地址保存经过强模糊处理的预览，清晰网页副本使用 AES-256-GCM 加密。每个可接受答案通过带独立盐的 PBKDF2-SHA-256（600,000 次）解开同一张照片的随机密钥。HTML 和 JavaScript 中不保存明文答案或清晰图链接。解锁结果只放在当前页面的内存中，关闭查看窗口即撤销 Blob 地址，刷新后需要重新答题。

## 配置

原始照片、姓名答案和私人配置必须保存在仓库之外，例如 `/Users/xiaojs20/Life/blog-private/portraits/`。保留相机原件；工具会另做自动转正、最长边不超过 2400 像素、移除 EXIF/GPS/XMP 的网页副本。

私人 JSON 配置格式：

```json
{
  "photos": [
    {
      "src": "/img/travel/city/20261030-城市-景色.jpg",
      "original": "/仓库以外的目录/原始照片.jpg",
      "answers": ["可接受姓名", "昵称"]
    }
  ]
}
```

`src` 对应旅行相册的 `src` 或照片墙的 `image`。它继续作为预览地址，因此旧的图片直链也只显示模糊图。默认模糊整张被标记的人像照片。`answers: []` 表示暂时禁止解锁，可在姓名确认前保护照片。可在顶层或单张照片添加 `question: {"zh": "中文问题", "en": "English question"}` 覆盖默认问题。

运行前，先把待保护网页照片复制到仓库外的原件目录。运行：

```sh
node liquid-preview/scripts/prepare-photo-privacy.mjs \
  --config /Users/xiaojs20/Life/blog-private/portraits/config.json \
  --published /Users/xiaojs20/Life/blog
node liquid-preview/scripts/check-photo-privacy.mjs --published /Users/xiaojs20/Life/blog
```

工具会更新 Hugo 数据、`static` 里的模糊预览和密文，以及 `--published` 指定的现有发布目录中的同名图片。**之后仍需构建并同步中英文相册页面及新脚本、样式，再整体发布**；命令本身不会发布或改写 HTML。

更改答案时使用同一私人原件重新运行工具，重新生成随机密钥和密文；需要保留的旧别名应继续列在 `answers` 中。不要直接删除 manifest 条目来恢复公开，必须明确恢复网页图片并重新构建。旧密文和历史答案在曾发布的副本中仍可能有效，重新加密不能撤回旧副本。

## 验证与边界

```sh
node --test liquid-preview/scripts/photo-privacy.test.mjs
node liquid-preview/scripts/check-photo-privacy.mjs --published /构建输出目录
```

发布工作流校验模糊预览、密文及其哈希，并扫描公开目录，发现受保护照片的相同明文副本时阻止发布。检查不能识别重新压缩、裁切过的其他副本，仍需核对使用范围。默认不做人物身份识别，姓名由站主提供。

静态方案无法限制离线猜答案的次数，答案的难猜程度决定保护效果；知道姓名的人可以解锁，也可以保存图片。这个机制无法撤回过去已公开的清晰图、Git 历史或第三方缓存。需要隐藏仓库历史原件或限制猜题次数时，应另行迁移到私有存储和服务端验证。

加密接口参考：[PBKDF2 密钥派生](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/deriveKey)、[AES-GCM 参数](https://developer.mozilla.org/en-US/docs/Web/API/AesGcmParams)。
