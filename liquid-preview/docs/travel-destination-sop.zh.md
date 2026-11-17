# 新增旅行地点 SOP

适用范围：本站旅行地图。地点必须来自本人确认的真实旅行记录；没有照片也可以先添加地点，不编造旅行日期、景点或照片。执行前阅读仓库根目录 `AGENTS.md`，检查 `git status --short`，记录并保留已有改动。

## 1. 准备地点与边界

1. 确认地点的中英文名称、所属省市或国家地区、近似经纬度和行政区范围；同一地区已有地点时先查重。直辖市按整个直辖市行政范围填色，不能把城市中心点当作边界。
2. 优先使用与现有地图一致的 OpenStreetMap（OSM）行政区关系。通过 [OSM 搜索](https://www.openstreetmap.org/)或 [Nominatim 搜索](https://nominatim.openstreetmap.org/ui/search.html)查找地点，区分行政边界 relation 与同名节点、景点、区县；记录 relation 编号并打开 `https://www.openstreetmap.org/relation/编号` 查看标签。核对 `boundary=administrative`、名称、所属地区和行政级别；中国直辖市的 `admin_level` 为 4，地级行政区通常为 5，具体以当地实际区划和 OSM 标签为准。
3. 用 Nominatim 根据关系编号提取几何：`https://nominatim.openstreetmap.org/lookup?osm_ids=R编号&format=jsonv2&polygon_geojson=1`，例如重庆使用 [relation/913069](https://www.openstreetmap.org/relation/913069)。从返回项的 `geojson` 字段取 Polygon 或 MultiPolygon，核对 `osm_type`、`osm_id`、行政类型、名称与包围盒；检查环闭合、经纬度范围、几何有效性及图钉位置，并在地图中目视核对完整轮廓。将来源写为 `relation/编号`。遵守 Nominatim 的使用政策，避免批量或频繁请求；必要时使用其他合适的 OSM 导出方式。
4. 边界数据来自 OpenStreetMap 贡献者，注意保留站点已有的 OSM 署名并遵守其许可；地图只作旅行展示，边界不作为权威测绘依据。
5. 边界暂时无法可靠获取时，报告缺口，暂不发布该地点；仅添加图钉不算完成。共享行政区覆盖多个地点时，沿用现有 `visitIds` 模式，核对列表与点击行为。

## 2. 编辑源数据

1. 编辑 `liquid-preview/data/travel.yaml`。必要时在 `groups` 添加唯一分组及 `order`、`name`、`nameZh`；在 `visits` 添加唯一 `id`、`group`、`geoGroup`、`name`、`nameZh`、`region`、`regionZh`、`latitude`、`longitude`。无照片时填写 `photos: []`。坐标次序是纬度、经度；GeoJSON 坐标则为经度、纬度。
2. 将行政区几何作为 Feature 加入 `liquid-preview/static/data/travel-map/visited-areas.geojson`。`properties.id` 必须与地点 `id` 一致，`properties.source` 写明可追溯来源。共享区域的 `visitIds` 应列出实际对应的地点，区域本身另设唯一 ID，并补充中英文名称。保持 GeoJSON 合法，避免重复 ID。
3. 若提供旅行照片，保留原图；依据原始拍摄时间将网页副本命名为 `拍摄日期-城市-景色.jpg`，同景可附原图编号。检查方向、尺寸和公开元数据；在 `photos` 中填写路径、真实拍摄日期以及一致的中英文说明，必要时补充双语相册名。不要凭文件修改时间推断拍摄日期。

## 3. 构建与验证

1. 网站由仓库根目录的静态文件发布，`liquid-preview` 是 Hugo 源码，不会由 GitHub Pages 自动构建。为避免把其他工作区改动带入发布产物，先用 `git archive HEAD` 导出干净基线到临时目录，叠加本次所需源文件和照片，再在临时目录执行：

   ```bash
   hugo --source /临时目录/liquid-preview --destination /临时输出目录 --minify
   ```

   若本次变更依赖尚未提交的其他文件，先明确区分其内容；不要直接把整个工作区或整站构建结果覆盖到仓库根目录。
2. 将构建结果中受影响的 `travel/index.html`、`zh/travel/index.html`、`data/travel-map/visited-areas.geojson` 和新增照片复制到仓库对应路径。若改动还影响其他发布文件，逐项核对并同步。英文地图位于 `/travel/`，中文地图位于 `/zh/travel/`。
3. 检查数据能解析、地点和边界 ID 匹配且不重复、坐标位于边界附近、照片路径存在；检查中英文页面均包含地点、语言切换正常、填色和图钉可见，点击地点及区域能打开相应内容，无照片时显示正常提示。检查生成边界文件与源码一致。
4. 比较全部 diff，确认只包含本任务内容；对含既有改动的文件单独区分。只暂存本任务路径并提交，使用 SSH 推送到远程；不要使用 `git add -A`。

## 4. 发布后验收

等待 GitHub Pages 部署完成，使用真实浏览器分别打开线上 `/travel/` 和 `/zh/travel/`，展开地点分组，点击新增地点和地图填色区域，检查中英文名称、地图定位、详情与照片；有照片时再打开和关闭大图。确认语言切换及边界加载正常。若仍显示旧版或出现异常，检查部署状态和缓存并继续排查；未完成线上验收时如实报告。
