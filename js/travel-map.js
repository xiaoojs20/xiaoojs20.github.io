(() => {
  const app = document.querySelector('[data-travel-app]');
  if (!app) return;
  const zh = app.dataset.language === 'zh';
  const text = (cn, en) => zh ? cn : en;
  const data = JSON.parse(document.querySelector('#travel-data').textContent);
  const visits = Array.isArray(data.visits) ? data.visits.filter(v => v && v.latitude != null && v.longitude != null && v.latitude !== '' && v.longitude !== '' && Number.isFinite(Number(v.latitude)) && Number.isFinite(Number(v.longitude)) && Math.abs(Number(v.latitude)) <= 90 && Math.abs(Number(v.longitude)) <= 180) : [];
  const content = app.querySelector('[data-travel-content]');
  const count = app.querySelector('[data-travel-count]');
  const reset = app.querySelector('[data-travel-reset]');
  const lightbox = document.querySelector('[data-travel-lightbox]');
  const nameOf = v => (zh && v.nameZh) || v.name || '';
  const regionOf = v => (zh && v.regionZh) || v.region || '';
  const descOf = v => (zh && v.descriptionZh) || v.description || '';
  const make = (tag, cls, value) => { const e=document.createElement(tag); if(cls)e.className=cls; if(value)e.textContent=value; return e; };
  const map = L.map(app.querySelector('[data-travel-map]'), { scrollWheelZoom: false, worldCopyJump: true, minZoom: 2, maxZoom: 8 }).setView([30, 105], 3);
  map.attributionControl.setPrefix('<a href="https://leafletjs.com/">Leaflet</a>');
  map.attributionControl.addAttribution('Map: <a href="https://www.naturalearthdata.com/">Natural Earth</a> &amp; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>');
  let baseLayer, boundaryLayer, visitedLayer;
  const colors = () => document.documentElement.dataset.scheme === 'dark'
    ? {land:'#53605f', border:'#75817d', line:'#7b8881', visited:'#da9877', stroke:'#f0bc9d'}
    : {land:'#e9ece7', border:'#cbd3cd', line:'#c8d0c9', visited:'#edab89', stroke:'#bd7558'};
  const updateColors = () => { const c=colors(); if(baseLayer)baseLayer.setStyle({color:c.border,fillColor:c.land}); if(boundaryLayer)boundaryLayer.setStyle({color:c.line}); if(visitedLayer)visitedLayer.setStyle({color:c.stroke,fillColor:c.visited}); };
  Promise.all(['world','admin1-lines','visited-areas'].map(name => fetch('/data/travel-map/'+name+'.geojson').then(r=>{if(!r.ok)throw Error('Map data unavailable');return r.json()}))).then(([world,lines,areas]) => {
    const c=colors();
    baseLayer=L.geoJSON(world,{interactive:false,style:{color:c.border,weight:1,fillColor:c.land,fillOpacity:1}}).addTo(map);
    boundaryLayer=L.geoJSON(lines,{interactive:false,style:{color:c.line,weight:.65,opacity:.8}}).addTo(map);
    const byId=new Map(visits.map(v=>[v.id,v]));
    visitedLayer=L.geoJSON(areas,{filter:f=>byId.has(f.properties.id),style:{color:c.stroke,weight:1.5,fillColor:c.visited,fillOpacity:.65},onEachFeature:(feature,layer)=>{const visit=byId.get(feature.properties.id);layer.bindTooltip(nameOf(visit));layer.on('click',()=>{showPlace(visit); if(window.matchMedia('(max-width: 850px)').matches)app.querySelector('.travel-panel').scrollIntoView({behavior:'smooth',block:'start'});});}}).addTo(map);
  }).catch(()=>{app.querySelector('[data-travel-error]').hidden=false});
  new MutationObserver(updateColors).observe(document.documentElement,{attributes:true,attributeFilter:['data-scheme']});
  const markerLayer = L.layerGroup().addTo(map);
  const markerFor = (visit, demo=false) => {
    const icon=L.divIcon({className:'travel-pin'+(demo?' travel-pin--demo':''),html:'<span></span>',iconSize:[16,16],iconAnchor:[8,8]});
    return L.marker([Number(visit.latitude),Number(visit.longitude)],{icon,title:nameOf(visit),alt:nameOf(visit),keyboard:true}).addTo(markerLayer).on('click',()=>{showPlace(visit,demo); if(window.matchMedia('(max-width: 850px)').matches)app.querySelector('.travel-panel').scrollIntoView({behavior:'smooth',block:'start'});});
  };
  const realMarkers=visits.map(v=>markerFor(v));
  count.textContent = text(`${visits.length} 个地点`, `${visits.length} ${visits.length===1?'place':'places'}`);
  const showPhoto = photo => {
    const image=lightbox.querySelector('[data-travel-lightbox-image]');
    const caption=(zh && photo.captionZh)||photo.caption||'';
    image.src=photo.src; image.alt=caption || text('旅行照片','Travel photo');
    lightbox.querySelector('[data-travel-lightbox-caption]').textContent=caption;
    if(typeof lightbox.showModal==='function') lightbox.showModal();
  };
  const showPlace = (visit,demo=false) => {
    reset.hidden=false; content.replaceChildren();
    if(demo) content.append(make('span','travel-detail-label',text('示例 · 非真实行程','Example · not a real trip')));
    content.append(make('h2','',nameOf(visit)));
    const meta=[regionOf(visit),visit.date].filter(Boolean).join(' · '); if(meta)content.append(make('p','',meta));
    if(descOf(visit))content.append(make('p','',descOf(visit)));
    const photos=Array.isArray(visit.photos)?visit.photos.filter(p=>p && p.src):[];
    if(!photos.length)content.append(make('p','',text('这段旅程的照片还在整理中。','Photos from this journey are coming soon.')));
    else { const grid=make('div','travel-photos'); photos.forEach(photo=>{const btn=make('button','travel-photo'); btn.type='button'; const img=make('img'); img.src=photo.src; img.loading='lazy'; img.alt=(zh && photo.captionZh)||photo.caption||text('旅行照片','Travel photo');btn.append(img);btn.setAttribute('aria-label',text('查看照片：','View photo: ')+img.alt);btn.addEventListener('click',()=>showPhoto(photo));grid.append(btn)});content.append(grid); }
  };
  const focusPlace = (visit,demo=false) => { map.setView([Number(visit.latitude),Number(visit.longitude)], Math.max(map.getZoom(), 5)); showPlace(visit,demo); };
  const showList = () => {
    reset.hidden=true; content.replaceChildren(); markerLayer.clearLayers(); visits.forEach(v=>markerFor(v));
    content.append(make('h2','',text('每一段旅程','Every journey')));
    content.append(make('p','',visits.length ? text('选择一个地点，翻开沿途的照片。','Choose a place to open its album.') : text('旅行记录还在慢慢整理。先看看示例，之后再把真实地点加进来。','My travel journal is still taking shape. Explore an example while the real places are being added.')));
    visits.forEach(v=>{const btn=make('button','travel-place');btn.type='button';const label=make('span');label.append(make('strong','',nameOf(v)));const meta=[regionOf(v),v.date].filter(Boolean).join(' · ');if(meta)label.append(make('small','',meta));btn.append(label,make('span','','↗'));btn.addEventListener('click',()=>focusPlace(v));content.append(btn)});
    if(data.demo && !visits.length){const demo=make('button','travel-demo-button',text('✦ 查看示例地点','✦ Explore an example'));demo.type='button';demo.addEventListener('click',()=>{markerFor(data.demo,true);focusPlace(data.demo,true)});content.append(demo);}
  };
  reset.addEventListener('click',showList);
  lightbox.querySelector('[data-travel-close]').addEventListener('click',()=>lightbox.close());
  lightbox.addEventListener('click',e=>{if(e.target===lightbox)lightbox.close()});
  showList();
  if(realMarkers.length){const group=L.featureGroup(realMarkers);map.fitBounds(group.getBounds().pad(.25),{maxZoom:6});}
})();
