(() => {
  const app = document.querySelector('[data-travel-app]');
  if (!app) return;
  const zh = app.dataset.language === 'zh';
  const text = (cn, en) => zh ? cn : en;
  const data = JSON.parse(document.querySelector('#travel-data').textContent);
  const visits = Array.isArray(data.visits) ? data.visits.filter(v => v && v.latitude != null && v.longitude != null && v.latitude !== '' && v.longitude !== '' && Number.isFinite(Number(v.latitude)) && Number.isFinite(Number(v.longitude)) && Math.abs(Number(v.latitude)) <= 90 && Math.abs(Number(v.longitude)) <= 180) : [];
  const content = app.querySelector('[data-travel-content]');
  const reset = app.querySelector('[data-travel-reset]');
  const lightbox = document.querySelector('[data-travel-lightbox]');
  const nameOf = v => (zh && v.nameZh) || v.name || '';
  const regionOf = v => (zh && v.regionZh) || v.region || '';
  const descOf = v => (zh && v.descriptionZh) || v.description || '';
  const make = (tag, cls, value) => { const e=document.createElement(tag); if(cls)e.className=cls; if(value)e.textContent=value; return e; };
  const countText = n => text(`${n} 个地点`, `${n} ${n===1?'place':'places'}`);
  app.querySelector('[data-travel-count]').textContent=countText(visits.length);
  const colors = () => document.documentElement.dataset.scheme === 'dark'
    ? {land:'#53605f', border:'#75817d', line:'#7b8881', visited:'#da9877', stroke:'#f0bc9d'}
    : {land:'#e9ece7', border:'#cbd3cd', line:'#c8d0c9', visited:'#edab89', stroke:'#bd7558'};
  const maps={};
  const showPhoto = photo => {
    const image=lightbox.querySelector('[data-travel-lightbox-image]');
    const caption=(zh && photo.captionZh)||photo.caption||'';
    image.src=photo.src; image.alt=caption || text('旅行照片','Travel photo');
    lightbox.querySelector('[data-travel-lightbox-caption]').textContent=caption;
    if(typeof lightbox.showModal==='function') lightbox.showModal();
  };
  const showPlace = (visit,demo=false) => {
    reset.hidden=false; content.replaceChildren();
    if(demo)content.append(make('span','travel-detail-label',text('示例 · 非真实行程','Example · not a real trip')));
    content.append(make('h2','',nameOf(visit)));
    const meta=[regionOf(visit),visit.date].filter(Boolean).join(' · '); if(meta)content.append(make('p','',meta));
    if(descOf(visit))content.append(make('p','',descOf(visit)));
    const photos=Array.isArray(visit.photos)?visit.photos.filter(p=>p && p.src):[];
    if(!photos.length)content.append(make('p','',text('这段旅程的照片还在整理中。','Photos from this journey are coming soon.')));
    else {const grid=make('div','travel-photos'); photos.forEach(photo=>{const btn=make('button','travel-photo');btn.type='button';const img=make('img');img.src=photo.src;img.loading='lazy';img.alt=(zh && photo.captionZh)||photo.caption||text('旅行照片','Travel photo');btn.append(img);btn.setAttribute('aria-label',text('查看照片：','View photo: ')+img.alt);btn.addEventListener('click',()=>showPhoto(photo));grid.append(btn)});content.append(grid)}
  };
  const onSelect = visit => {showPlace(visit);if(window.matchMedia('(max-width: 850px)').matches)app.querySelector('.travel-panel').scrollIntoView({behavior:'smooth',block:'start'})};
  const fit = scope => {const item=maps[scope];const pts=visits.map(v=>[Number(v.latitude),Number(v.longitude)]);if(pts.length)item.map.fitBounds(L.latLngBounds(pts).pad(.25),{maxZoom:6});else item.map.setView([30,105],3)};
  ['combined'].forEach(scope=>{
    const map=L.map(app.querySelector(`[data-map="${scope}"]`),{scrollWheelZoom:false,worldCopyJump:true,minZoom:2,maxZoom:8}).setView([30,105],3);
    map.attributionControl.setPrefix('<a href="https://leafletjs.com/">Leaflet</a>');
    map.attributionControl.addAttribution('Map: <a href="https://www.naturalearthdata.com/">Natural Earth</a> &amp; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>');
    const markers=L.layerGroup().addTo(map);maps[scope]={map,markers};
    visits.forEach(v=>{
      const usePin=v.markerStyle==='pin';
      const icon=L.divIcon(usePin ? {className:'travel-pin travel-pin--place',html:'<svg aria-hidden="true" viewBox="0 0 24 30"><path d="M12 1C6 1 2 5.5 2 11c0 7 10 17 10 17s10-10 10-17C22 5.5 18 1 12 1Z"/><circle cx="12" cy="11" r="3"/></svg>',iconSize:[20,24],iconAnchor:[10,22]} : {className:'travel-pin',html:'<span></span>',iconSize:[16,16],iconAnchor:[8,8]});
      L.marker([Number(v.latitude),Number(v.longitude)],{icon,title:nameOf(v),alt:nameOf(v),keyboard:true}).addTo(markers).on('click',()=>onSelect(v));
    });
  });
  const areaSize = feature => {let minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;const scan=x=>{if(Array.isArray(x)&&typeof x[0]==='number'){minX=Math.min(minX,x[0]);maxX=Math.max(maxX,x[0]);minY=Math.min(minY,x[1]);maxY=Math.max(maxY,x[1])}else if(Array.isArray(x))x.forEach(scan)};scan(feature.geometry.coordinates);return (maxX-minX)*(maxY-minY)};
  Promise.all(['world','admin1-lines','visited-areas'].map(name=>fetch('/data/travel-map/'+name+'.geojson?v='+encodeURIComponent(app.dataset.mapVersion || '')).then(r=>{if(!r.ok)throw Error('Map data unavailable');return r.json()}))).then(([world,lines,areas])=>{
    const byId=new Map(visits.map(v=>[v.id,v]));areas.features.sort((a,b)=>areaSize(b)-areaSize(a));
    Object.entries(maps).forEach(([scope,item])=>{
      const c=colors();
      item.base=L.geoJSON(world,{interactive:false,style:{color:c.border,weight:1,fillColor:c.land,fillOpacity:1}}).addTo(item.map);
      item.boundaries=L.geoJSON(lines,{interactive:false,style:{color:c.line,weight:.65,opacity:.8}}).addTo(item.map);
      item.areas=L.geoJSON(areas,{filter:f=>byId.has(f.properties.id),style:{color:c.stroke,weight:1.5,fillColor:c.visited,fillOpacity:.65},onEachFeature:(feature,layer)=>{const visit=byId.get(feature.properties.id);layer.bindTooltip(nameOf(visit));layer.on('click',()=>onSelect(visit))}}).addTo(item.map);
    });
  }).catch(()=>{app.querySelector('[data-travel-error]').hidden=false});
  new MutationObserver(()=>{const c=colors();Object.values(maps).forEach(item=>{item.base?.setStyle({color:c.border,fillColor:c.land});item.boundaries?.setStyle({color:c.line});item.areas?.setStyle({color:c.stroke,fillColor:c.visited})})}).observe(document.documentElement,{attributes:true,attributeFilter:['data-scheme']});
  const focusPlace = visit => {const map=maps.combined.map;map.setView([Number(visit.latitude),Number(visit.longitude)],Math.max(map.getZoom(),5));showPlace(visit)};
  let demoMarker;
  const showList = () => {
    if(demoMarker){maps.combined.markers.removeLayer(demoMarker);demoMarker=null}
    reset.hidden=true;content.replaceChildren();content.append(make('h2','',text('每一段旅程','Every journey')));
    content.append(make('p','',visits.length?text('选择一个地点，翻开沿途的照片。','Choose a place to open its album.'):text('旅行记录还在慢慢整理。','My travel journal is still taking shape.')));
    visits.forEach(v=>{const btn=make('button','travel-place');btn.type='button';const label=make('span');label.append(make('strong','',nameOf(v)));const meta=[regionOf(v),v.date].filter(Boolean).join(' · ');if(meta)label.append(make('small','',meta));btn.append(label,make('span','','↗'));btn.addEventListener('click',()=>focusPlace(v));content.append(btn)});
    if(!visits.length && data.demo){const demo=make('button','travel-demo-button',text('✦ 查看示例地点','✦ Explore an example'));demo.type='button';demo.addEventListener('click',()=>{const v=data.demo;const icon=L.divIcon({className:'travel-pin travel-pin--demo',html:'<span></span>',iconSize:[16,16],iconAnchor:[8,8]});demoMarker=L.marker([Number(v.latitude),Number(v.longitude)],{icon,title:nameOf(v),alt:nameOf(v)}).addTo(maps.combined.markers).on('click',()=>showPlace(v,true));requestAnimationFrame(()=>maps.combined.map.setView([Number(v.latitude),Number(v.longitude)],5));showPlace(v,true)});content.append(demo)}
  };
  reset.addEventListener('click',showList);
  lightbox.querySelector('[data-travel-close]').addEventListener('click',()=>lightbox.close());
  lightbox.addEventListener('click',e=>{if(e.target===lightbox)lightbox.close()});
  showList();requestAnimationFrame(()=>fit('combined'));
})();
