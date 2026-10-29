# Email templates

These responsive HTML email examples can be adapted for Waline reply workflows, reader messages, and backlink approvals.

- `reader-reply.en.html` and `reader-reply.zh.html` reply to a reader.
- `backlink-approved.en.html` and `backlink-approved.zh.html` confirm a backlink application.
- `waline-comment-reply-bilingual.html` and `waline-comment-reply-subject.txt` are a bilingual Waline reply-notification body and subject. They retain Waline's template variables and switch language from the comment URL.

Replace every bracketed placeholder before use:

- `[Site Name]` and `[Brand]`
- `[Site URL]` and `[Backlinks URL]`
- `[Name]` or `[读者称呼]`
- `[Reply]` or `[回复内容]`
- `[Signature]` or `[署名]`

For the Waline template, replace `[SITE NAME]` and `[站点名称]` before installing the HTML body and subject in your Waline mail configuration. Keep the `self`, `parent`, and `site` template variables intact so replies and post links can render correctly.

Keep private email addresses, tokens, administrator URLs, and other credentials outside the public repository.
